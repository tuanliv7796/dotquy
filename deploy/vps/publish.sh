#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/../.."
test -f dist-web/index.html
test -f dist-web/ota/manifest.json
sudo -n nginx -t
release="$(date -u +%Y%m%dT%H%M%S)-$(git rev-parse --short HEAD)"
previous="$(readlink /var/www/dotquy/current)"
sudo -n cp -a dist-web "/var/www/dotquy/releases/$release"
sudo -n chown -R root:root "/var/www/dotquy/releases/$release"
sudo -n chmod -R a+rX "/var/www/dotquy/releases/$release"
sudo -n ln -s "releases/$release" /var/www/dotquy/current.next
sudo -n mv -Tf /var/www/dotquy/current.next /var/www/dotquy/current
sudo -n systemctl reload nginx
printf 'Published: %s\nPrevious release: %s\n' "$release" "$previous"
