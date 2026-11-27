# Triển khai VPS: https://thanhtuan.online/dotquy/

Mã nguồn ở `/home/ubuntu/dotquy`. Luồng truy cập:

`HTTPS → Cloudflare Tunnel → Nginx :80 (thanhtuan.online /dotquy/) → Nginx 127.0.0.1:8100 → /var/www/dotquy/current`

Website là HTML/CSS/JS tĩnh, không cần tiến trình Node hoặc cơ sở dữ liệu máy chủ. Nginx hiện có tự khởi động cùng VPS. Cổng 8100 chỉ lắng nghe loopback.

## Build và cập nhật

`.env` trên VPS:

```dotenv
PUBLIC_SITE_URL=https://thanhtuan.online/dotquy
PUBLIC_OTA_MANIFEST_URL=https://thanhtuan.online/dotquy/ota/manifest.json
```

```bash
cd /home/ubuntu/dotquy
npm ci
npm run build:vps
CHROME_PATH=/home/ubuntu/.cache/ms-playwright/chromium-1254/chrome-linux-arm64/chrome npm run test:e2e -- --workers=2
./deploy/vps/publish.sh
CHROME_PATH=/home/ubuntu/.cache/ms-playwright/chromium-1254/chrome-linux-arm64/chrome node scripts/verify-vps.mjs
```

`dist/` chứa bản root cho APK và gói OTA; `dist-web/` chứa bản `/dotquy/` và bản sao gói OTA root. Không đóng gói trực tiếp `dist-web/` làm OTA cho Android. Script xác minh dùng Chromium trỏ tên miền về loopback; HTTPS công khai kiểm tra thêm bằng `curl https://thanhtuan.online/dotquy/`.

Giữ các thay đổi triển khai khi cập nhật mã nguồn từ GitHub; không chạy reset hoặc ghi đè checkout. GitHub Actions đã tự động deploy khi push vào main (xem bên dưới).

## Cấu hình và rollback

- `/etc/nginx/conf.d/dotquy-upstream.conf`: static upstream.
- `/etc/nginx/snippets/dotquy-proxy.conf`: reverse proxy, include trong server `thanhtuan.online` của `/etc/nginx/conf.d/my_server.conf`.
- `/var/backups/dotquy/my_server.conf.before-dotquy`: cấu hình gốc trước triển khai.
- `/var/www/dotquy/releases/`: các bản phát hành; `current` là symlink được chuyển nguyên tử.
- Log: `/var/log/nginx/dotquy_access.log`, `/var/log/nginx/dotquy_error.log`.
- Service worker chỉ quản lý `/dotquy/`, cache được đặt namespace riêng; không xóa cache website khác. `sw.js` và `/ota/*` trả `Cache-Control: no-store`.

Rollback website (thay tên bằng release cần phục hồi):

```bash
sudo ln -s releases/initial-20261127 /var/www/dotquy/current.next
sudo mv -Tf /var/www/dotquy/current.next /var/www/dotquy/current
sudo nginx -t && sudo systemctl reload nginx
```

Lưu ý: APK v1.0 có sẵn trong `releases/` giữ nguyên. Người dùng APK cũ có thể nhập `https://thanhtuan.online/dotquy` ở cài đặt nguồn OTA; bản web không cần cấu hình này. Chưa build lại APK hoặc cấu hình phát hành Android.

## Tự động deploy từ GitHub Actions

Workflow `.github/workflows/deploy-vps.yml` chạy khi push `main` hoặc bấm **Run workflow** trên main:

1. GitHub runner cài dependency, build hai bản web/Android OTA, chạy toàn bộ safety gates.
2. Job publish có `contents: write` xuất **chỉ file tĩnh đã kiểm tra** sang nhánh `deploy-production`, kèm `deployment.json` ghi SHA nguồn và run ID. Không cần SSH key hay secret thêm.
3. `dotquy-sync.timer` trên VPS kiểm tra nhánh này mỗi 20 giây. Service chạy dưới user `dotquy-deploy`, không có sudo; không chạy script/npm từ nhánh build. Nó kiểm tra đường dẫn, checksum OTA và metadata, giải nén release mới và chuyển symlink nguyên tử.
4. Service xác nhận SHA qua Nginx nội bộ; nếu sai thì phục hồi symlink cũ. Workflow chờ SHA tương ứng xuất hiện qua HTTPS công khai trước khi báo thành công.

Build/test thất bại giữ nguyên phiên bản đang chạy. Build bị main mới thay thế sẽ không được publish. VPS giữ 5 release tự động gần nhất cùng bản hiện tại/trước đó; bản thủ công ban đầu vẫn còn. Nhánh `deploy-production` là output build, không sửa mã nguồn ở đó.

Quản lý:

```bash
sudo systemctl status dotquy-sync.timer
sudo journalctl -u dotquy-sync.service -n 50 --no-pager
cat /var/lib/dotquy-deploy/deployed.json
curl -fsS https://thanhtuan.online/dotquy/deployment.json
```

Muốn rollback thủ công lâu dài, dừng timer trước để một build GitHub mới không ghi đè:

```bash
sudo systemctl stop dotquy-sync.timer
# Thực hiện lệnh rollback ở trên.
# Khi muốn tiếp tục nhận các build mới:
sudo systemctl start dotquy-sync.timer
```

Các file `sync.py` và unit systemd được cài root-owned tại `/usr/local/lib/dotquy-deploy/` và `/etc/systemd/system/`. Workflow chỉ cập nhật website; thay đổi cấu hình Nginx/systemd cần triển khai riêng trên VPS.
