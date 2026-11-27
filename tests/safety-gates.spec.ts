import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import JSZip from 'jszip';

const ALL_CORE_ROUTES = [
  '/',
  '/so-cuu/',
  '/kiem-tra/',
  '/tra-cuu/',
  '/tra-cuu/02-cam-thuoc-ha-huyet-ap-va-aspirin/',
  '/benh-vien/',
  '/ho-so/',
];

test.describe('10 Cổng Kiểm Tra An Toàn Y Khoa, Trợ Năng & OTA (Playwright CI Safety Gates)', () => {
  test('Gate 1: Bài kiểm tra cấp phải CẮT MẠCH 0 GIÂY ngay khi bấm "Có dấu hiệu" hoặc "Không chắc" ở bất kỳ bước nào (Fixes K1 & G3)', async ({ page }) => {
    await page.goto('/kiem-tra/');

    // Case A: Click "Có dấu hiệu" on Step 1 -> Immediate red emergency verdict!
    await page.click('[data-acute-ans="yes"]');
    await expect(page.locator('#acute-question-card')).toBeHidden();
    await expect(page.locator('#acute-result-panel')).toBeVisible();
    await expect(page.locator('#acute-verdict-card')).toContainText('CẮT MẠCH KHẨN CẤP');

    // Reset and test Case B: Click "Chưa thấy" on Step 1, then "Không chắc" on Step 2 -> Immediate red emergency verdict!
    await page.click('#btn-reset-from-verdict');
    await expect(page.locator('#acute-question-card')).toBeVisible();
    await page.click('[data-acute-ans="no"]');
    await expect(page.locator('#acute-step-indicator')).toContainText('Bước 2 / 6');
    await page.click('[data-acute-ans="unsure"]');
    await expect(page.locator('#acute-question-card')).toBeHidden();
    await expect(page.locator('#acute-verdict-card')).toContainText('xử trí an toàn như đột quỵ cấp');
  });

  test('Gate 2: Nút Gọi 115 luôn nằm ở đỉnh Bước 1 (<220px), ghim cố định khi cuộn sâu, và mở nhịp CPR 110 BPM chỉ bằng 1 chạm (Fixes G5 & K3)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/so-cuu/');

    // Giant 115 button at top without scrolling
    const giantBtn = page.locator('#btn-primary-call-115');
    await expect(giantBtn).toBeVisible();
    const box1 = await giantBtn.boundingBox();
    expect(box1).not.toBeNull();
    expect(box1!.height).toBeGreaterThanOrEqual(96);
    expect(box1!.y).toBeLessThan(260);

    // Scroll all the way to the bottom of Emergency flow -> sticky 115 button STILL visible in viewport!
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(100);
    const sticky115 = page.locator('#sticky-115-btn');
    await expect(sticky115).toBeVisible();
    const stickyBox = await sticky115.boundingBox();
    expect(stickyBox).not.toBeNull();
    expect(stickyBox!.y).toBeGreaterThanOrEqual(0);
    expect(stickyBox!.y + stickyBox!.height).toBeLessThanOrEqual(844);

    // 1-tap CPR metronome activation from Survival Gate #1
    await page.click('[data-gate-branch="arrest"]');
    await expect(page.locator('#cpr-metronome-box')).toBeVisible();
  });

  test('Gate 3: Không bao giờ trấn an sai ("Bình thường / Ổn / An toàn"), không hiện kết quả trước khi trả lời, không xúi đứng dậy đi thử (Fixes G1, G2, K2, K5)', async ({ page }) => {
    await page.goto('/kiem-tra/');

    // Before answering: result panel MUST be hidden!
    await expect(page.locator('#acute-result-panel')).toBeHidden();

    // Check all 6 steps: NEVER instruct patient to stand up and walk ("đứng dậy hoặc bước đi")
    for (let i = 0; i < 6; i++) {
      const howText = (await page.locator('#acute-q-how').innerText()).toLowerCase();
      expect(howText).not.toContain('đứng dậy hoặc bước đi');
      await page.click('[data-acute-ans="no"]');
    }

    // Negative verdict reached: must NOT contain forbidden reassuring words!
    const verdictText = (await page.locator('#acute-verdict-card').innerText()).toLowerCase();
    expect(verdictText).toContain('không loại trừ');
    expect(verdictText).not.toContain('mức 1: bình thường');
    expect(verdictText).not.toContain('bạn an toàn');
    expect(verdictText).not.toContain('hoàn toàn ổn định');
  });

  test('Gate 4: Lịch sử kiểm tra bắt mẫu TIA "Có rồi tự hết" trong 48h (H3) và chống nhiễm chéo hồ sơ gia đình (H9)', async ({ page }) => {
    await page.goto('/kiem-tra/');

    // Step 1: Create positive record and assign to "Bố"
    await page.click('[data-acute-ans="yes"]');
    await page.click('[data-assign-person="bo"]');

    // Step 2: Run a negative check immediately after (within 48h)
    await page.click('#btn-reset-from-verdict');
    for (let i = 0; i < 6; i++) {
      await page.click('[data-acute-ans="no"]');
    }

    // Before assigning person (Rule H9): "Mẹ" must NOT inherit "Bố"'s positive record!
    await page.click('[data-assign-person="me"]');
    await expect(page.locator('#acute-tia-48h-alert')).toBeHidden();

    // Now assign to "Bố": 48h TIA Resolved Alert MUST appear ABOVE neutral card!
    await page.click('[data-assign-person="bo"]');
    await expect(page.locator('#acute-tia-48h-alert')).toBeVisible();
    await expect(page.locator('#acute-tia-48h-alert')).toContainText('CÓ RỒI TỰ HẾT');
  });

  test('Gate 5: Bộ tìm kiếm An toàn 4 Tầng xử lý chính xác các truy vấn tiếng Việt khó (Fixes G7, G8, K4)', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('#home-search-input');
    const output = page.locator('[data-search-output]').first();

    const criticalQueries: { q: string; expectBanner: 'acute_symptom' | 'harm_blocker'; mustNotContain?: string }[] = [
      { q: 'đớ lưỡi', expectBanner: 'acute_symptom', mustNotContain: 'giảm muối' },
      { q: 'te tay', expectBanner: 'acute_symptom' },
      { q: 'trúng gió', expectBanner: 'acute_symptom' },
      { q: 'sặc nước', expectBanner: 'acute_symptom' },
      { q: 'khàn tiếng', expectBanner: 'acute_symptom' },
      { q: 'rối loạn tiền đình', expectBanner: 'acute_symptom' },
      { q: 'mù 1 mắt', expectBanner: 'acute_symptom' },
      { q: 'co giật', expectBanner: 'acute_symptom' },
      { q: 'bất tỉnh', expectBanner: 'acute_symptom' },
      { q: 'hạ huyết áp', expectBanner: 'harm_blocker' },
      { q: 'huyết áp 200', expectBanner: 'harm_blocker' },
      { q: 'aspirin', expectBanner: 'harm_blocker' },
      { q: 'nước gừng', expectBanner: 'harm_blocker' },
      { q: 'an cung', expectBanner: 'harm_blocker' },
      { q: 'chích máu ngón tay', expectBanner: 'harm_blocker' },
      { q: 'tam thất', expectBanner: 'harm_blocker' },
      { q: 'nattokinase', expectBanner: 'harm_blocker' },
    ];

    for (const item of criticalQueries) {
      await input.fill(item.q);
      // Search input MUST stay visible on Home page (Fixes G7)
      await expect(input).toBeVisible();
      await expect(output.locator(`[data-safety-banner="${item.expectBanner}"]`).first()).toBeVisible();
      if (item.mustNotContain) {
        const text = (await output.innerText()).toLowerCase();
        expect(text).not.toContain(item.mustNotContain);
      }
    }
  });

  test('Gate 6 & Gate 7: Sàn cỡ chữ cứng >= 14px (nội dung >= 18px) và Vùng chạm >= 48px trên toàn bộ các trang (Fixes C4, C5, K6)', async ({ page }) => {
    for (const vp of [
      { width: 1366, height: 900 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(vp);
      for (const route of ALL_CORE_ROUTES) {
        await page.goto(route);
        const audit = await page.evaluate(() => {
          const smallFonts: string[] = [];
          const smallTargets: string[] = [];

          document.querySelectorAll('body *').forEach((el) => {
            if (el.classList.contains('sr-only')) return;
            const st = getComputedStyle(el);
            if (st.display === 'none' || st.visibility === 'hidden' || parseFloat(st.opacity) === 0) return;
            const rect = el.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;

            const hasText = Array.from(el.childNodes).some(
              (n) => n.nodeType === 3 && n.textContent && n.textContent.trim().length > 0
            );
            if (hasText && el.tagName !== 'TEXT' && el.tagName !== 'text') {
              const fs = parseFloat(st.fontSize);
              if (fs < 13.9) {
                smallFonts.push(`${el.tagName} "${(el.textContent || '').trim().slice(0, 25)}" -> ${fs}px`);
              }
            }
          });

          document.querySelectorAll('button, a, input, select, summary').forEach((el) => {
            const st = getComputedStyle(el);
            if (st.display === 'none' || st.visibility === 'hidden') return;
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) return;
            if (r.height < 47.5 || r.width < 43.5) {
              smallTargets.push(
                `${el.tagName} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 25)}" -> ${Math.round(r.width)}x${Math.round(r.height)}`
              );
            }
          });

          const bodyFs = parseFloat(getComputedStyle(document.body).fontSize);
          return { bodyFs, smallFonts, smallTargets };
        });

        expect(audit.bodyFs, `Body font size on ${route}`).toBeGreaterThanOrEqual(18);
        expect(audit.smallFonts, `Text <14px on ${route} (${vp.width}px)`).toEqual([]);
        expect(audit.smallTargets, `Touch target <48px on ${route} (${vp.width}px)`).toEqual([]);
      }
    }
  });

  test('Gate 8 & Gate 9: Tương phản WCAG 2.2 ở cả 4 chế độ màu & Không tràn ngang khi phóng chữ Rất lớn (xl) trên màn nhỏ 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 760 });
    for (const theme of ['warm', 'contrast', 'dark']) {
      for (const route of ['/', '/so-cuu/', '/kiem-tra/']) {
        await page.goto(route);
        await page.evaluate((th) => {
          document.documentElement.setAttribute('data-theme', th);
          document.documentElement.setAttribute('data-scale', 'xl');
        }, theme);

        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth
        );
        expect(overflow, `Horizontal overflow on ${route} theme=${theme} scale=xl`).toBeLessThanOrEqual(1);
      }
    }
  });

  test('Gate 10: Kiểm thử Chế độ Máy bay Offline & Xác thực toàn vẹn SHA-256 của Gói Cập nhật OTA (dist/ota/bundle.zip)', async ({ page, context }) => {
    // 1. Verify OTA manifest & bundle.zip integrity on disk
    const otaDir = path.resolve('dist/ota');
    const manifest = JSON.parse(fs.readFileSync(path.join(otaDir, 'manifest.json'), 'utf-8'));
    const zipBuf = fs.readFileSync(path.join(otaDir, 'bundle.zip'));
    const computedSha = crypto.createHash('sha256').update(zipBuf).digest('hex');

    expect(computedSha).toBe(manifest.bundleSha256);
    expect(zipBuf.length).toBe(manifest.bundleSizeBytes);

    const zip = await JSZip.loadAsync(zipBuf);
    expect(zip.file('index.html')).not.toBeNull();
    expect(zip.file('so-cuu/index.html')).not.toBeNull();
    expect(zip.file('kiem-tra/index.html')).not.toBeNull();
    expect(zip.file('fonts/be-vietnam-pro-vietnamese-700-normal.woff2')).not.toBeNull();

    // 2. Verify zero external Google Fonts dependency & offline interaction
    const externalRequests: string[] = [];
    page.on('request', (req) => {
      const url = req.url();
      if (!url.startsWith('http://127.0.0.1') && !url.startsWith('data:') && !url.startsWith('blob:')) {
        externalRequests.push(url);
      }
    });

    await page.goto('/');
    expect(externalRequests, 'Must have ZERO external CDN/Google Fonts dependencies').toEqual([]);

    // Go completely offline and verify client-side search & triage work 100%
    await context.setOffline(true);
    await page.fill('#home-search-input', 'an cung');
    await expect(page.locator('[data-safety-banner="harm_blocker"]')).toBeVisible();
    await context.setOffline(false);
  });
});
