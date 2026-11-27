import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import JSZip from 'jszip';

const DIST_DIR = path.resolve('dist');
const OTA_DIR = path.join(DIST_DIR, 'ota');

function collectFiles(dir, baseDir = dir, list = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(baseDir, fullPath).split(path.sep).join('/');
    if (relPath === 'ota' || relPath.startsWith('ota/')) continue;
    if (entry.isDirectory()) {
      collectFiles(fullPath, baseDir, list);
    } else if (entry.isFile()) {
      list.push({ fullPath, relPath });
    }
  }
  return list;
}

async function main() {
  if (!fs.existsSync(DIST_DIR)) {
    throw new Error('dist/ directory not found. Run astro build first.');
  }

  fs.mkdirSync(OTA_DIR, { recursive: true });
  const files = collectFiles(DIST_DIR);
  const zip = new JSZip();

  const fileDigests = {};
  for (const f of files) {
    const buf = fs.readFileSync(f.fullPath);
    const sha256 = crypto.createHash('sha256').update(buf).digest('hex');
    fileDigests[f.relPath] = { sha256, size: buf.length };
    zip.file(f.relPath, buf, {
      date: new Date('2026-01-01T00:00:00.000Z'),
      compression: 'DEFLATE',
      compressionOptions: { level: 9 },
    });
  }

  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
  const bundleSha256 = crypto.createHash('sha256').update(zipBuffer).digest('hex');
  const shortHash = bundleSha256.slice(0, 10);
  const nowIso = new Date().toISOString();
  const stamp = nowIso.replace(/[-:T]/g, '').slice(0, 14);
  const pkg = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf-8'));

  const bundlePath = path.join(OTA_DIR, 'bundle.zip');
  fs.writeFileSync(bundlePath, zipBuffer);

  const manifest = {
    buildId: `${pkg.version}-${stamp}-${shortHash}`,
    version: pkg.version,
    schemaVersion: 1,
    minNativeVersion: 1,
    builtAt: nowIso,
    bundleUrl: './bundle.zip',
    bundleSha256,
    bundleSizeBytes: zipBuffer.length,
    fileCount: files.length,
  };

  fs.writeFileSync(path.join(OTA_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf-8');
  console.log(
    `[OTA Packager] Packed ${files.length} web files -> dist/ota/bundle.zip (${(
      zipBuffer.length / 1024
    ).toFixed(1)} KB, sha256=${bundleSha256.slice(0, 16)}...)`
  );
}

main().catch((err) => {
  console.error('[OTA Packager] Failed:', err);
  process.exit(1);
});
