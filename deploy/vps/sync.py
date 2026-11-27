#!/usr/bin/env python3
"""Consume static builds from GitHub; never execute code from the build branch."""
import fcntl
import hashlib
import io
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import subprocess
import tarfile
import tempfile
import urllib.request

REPOSITORY = 'https://github.com/tuanliv7796/dotquy.git'
STATE = Path('/var/lib/dotquy-deploy')
WEB = Path('/var/www/dotquy')


def git(*args):
    return subprocess.check_output(['git', '-C', str(STATE / 'repository.git'), *args], timeout=90)


def validate_archive(data):
    archive = tarfile.open(fileobj=io.BytesIO(data))
    files = {}
    total = 0
    for member in archive.getmembers():
        p = PurePosixPath(member.name)
        if p.is_absolute() or '..' in p.parts or any(x.startswith('.') for x in p.parts):
            raise ValueError('Unsafe archive path')
        if member.isdir():
            continue
        if not member.isfile() or member.size > 20 * 1024 * 1024:
            raise ValueError('Only regular static files are allowed')
        total += member.size
        if total > 100 * 1024 * 1024 or len(files) >= 5000:
            raise ValueError('Build exceeds deployment limits')
        files[member.name] = archive.extractfile(member).read()
    for required in ('index.html', 'so-cuu/index.html', 'kiem-tra/index.html',
                     'sw.js', 'deployment.json', 'ota/manifest.json', 'ota/bundle.zip'):
        if required not in files:
            raise ValueError(f'Missing {required}')
    metadata = json.loads(files['deployment.json'])
    if metadata.get('repository') != 'tuanliv7796/dotquy' or not re.fullmatch('[0-9a-f]{40}', metadata.get('sha', '')):
        raise ValueError('Invalid deployment metadata')
    manifest = json.loads(files['ota/manifest.json'])
    bundle = files['ota/bundle.zip']
    if hashlib.sha256(bundle).hexdigest() != manifest['bundleSha256'] or len(bundle) != manifest['bundleSizeBytes']:
        raise ValueError('Invalid OTA checksum')
    if b'/dotquy/' not in files['index.html']:
        raise ValueError('Website must be built with /dotquy base')
    return files, metadata


def set_current(target):
    staging = WEB / 'current.sync'
    staging.unlink(missing_ok=True)
    staging.symlink_to(target)
    os.replace(staging, WEB / 'current')


def main():
    STATE.mkdir(exist_ok=True)
    with (STATE / 'sync.lock').open('w') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        if not (STATE / 'repository.git').exists():
            subprocess.run(['git', 'init', '--bare', str(STATE / 'repository.git')], check=True, capture_output=True)
            git('remote', 'add', 'origin', REPOSITORY)
        # ls-remote avoids downloading already deployed builds.
        remote = git('ls-remote', 'origin', 'refs/heads/deploy-production').decode().split()
        if not remote:
            print('Waiting for first successful GitHub Actions build.', flush=True)
            return
        revision = remote[0]
        marker = STATE / 'deployed.json'
        if marker.exists() and json.loads(marker.read_text()).get('buildCommit') == revision:
            return
        git('fetch', '--depth=1', 'origin', 'refs/heads/deploy-production:refs/remotes/origin/deploy-production')
        revision = git('rev-parse', 'refs/remotes/origin/deploy-production').decode().strip()
        files, metadata = validate_archive(git('archive', '--format=tar', revision))
        release = WEB / 'releases' / ('actions-' + revision)
        if not release.exists():
            temporary = Path(tempfile.mkdtemp(prefix='.incoming-', dir=WEB / 'releases'))
            try:
                for filename, content in files.items():
                    destination = temporary / filename
                    destination.parent.mkdir(parents=True, exist_ok=True)
                    destination.write_bytes(content)
                    destination.chmod(0o644)
                temporary.chmod(0o755)
                temporary.rename(release)
            finally:
                if temporary.exists():
                    shutil.rmtree(temporary)
        previous = os.readlink(WEB / 'current')
        set_current(str(release.relative_to(WEB)))
        try:
            request = urllib.request.Request('http://127.0.0.1/dotquy/deployment.json', headers={'Host': 'thanhtuan.online'})
            with urllib.request.urlopen(request, timeout=10) as response:
                actual = json.load(response)
            if actual['sha'] != metadata['sha']:
                raise ValueError('Live deployment does not match published commit')
        except Exception:
            set_current(previous)
            raise
        metadata.update(buildCommit=revision, previous=previous)
        temporary_marker = STATE / 'deployed.next'
        temporary_marker.write_text(json.dumps(metadata) + '\n')
        os.replace(temporary_marker, marker)
        print(f"Deployed {metadata['sha']} from build {revision}; previous={previous}", flush=True)
        # Keep the newest five automatic releases, plus current/previous if needed.
        protected = {release.resolve(), (WEB / previous).resolve()}
        releases = sorted((WEB / 'releases').glob('actions-*'), key=lambda p: p.stat().st_mtime, reverse=True)
        for old in releases[5:]:
            if old.resolve() not in protected:
                shutil.rmtree(old)


if __name__ == '__main__':
    main()
