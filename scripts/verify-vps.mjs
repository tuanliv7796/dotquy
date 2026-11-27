import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import JSZip from 'jszip';

const base = process.env.VERIFY_URL || 'http://thanhtuan.online';
const requestBase = 'http://127.0.0.1';
const requestOptions = { headers: { Host: 'thanhtuan.online' } };
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--no-sandbox', '--host-resolver-rules=MAP thanhtuan.online 127.0.0.1', '--unsafely-treat-insecure-origin-as-secure=http://thanhtuan.online'],
});
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (res) => { if (res.status() >= 400) errors.push(`${res.status()} ${res.url()}`); });
  await page.goto(`${base}/dotquy/`);
  await page.evaluate(() => caches.open('other-website-cache'));
  const scope = await page.evaluate(async () => (await navigator.serviceWorker.ready).scope);
  assert.equal(new URL(scope).pathname, '/dotquy/');
  assert.ok((await page.evaluate(() => caches.keys())).includes('other-website-cache'));
  const routes = [];
  const collect = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const filename = path.join(dir, entry.name);
      if (entry.isDirectory()) collect(filename);
      else if (entry.name === 'index.html') routes.push('/dotquy/' + path.relative('dist-web', dir).replaceAll(path.sep, '/') + (dir === 'dist-web' ? '' : '/'));
    }
  };
  collect('dist-web');
  for (const route of routes) {
    const response = await page.goto(base + route);
    assert.equal(response.status(), 200, route);
    const escapedLinks = await page.locator('a[href^="/"], link[href^="/"], script[src^="/"]').evaluateAll((els) => els.map((el) => el.getAttribute('href') || el.getAttribute('src')).filter((url) => !url.startsWith('/dotquy/')));
    assert.deepEqual(escapedLinks, [], route);
  }
  await page.goto(`${base}/dotquy/`);
  await page.fill('#home-search-input', 'an cung');
  await page.locator('[data-safety-banner="harm_blocker"]').waitFor();
  for (const link of await page.locator('[data-search-output] a[href^="/"]').evaluateAll((els) => els.map((el) => el.getAttribute('href')))) assert.ok(link.startsWith('/dotquy/'), link);
  await context.setOffline(true);
  await page.fill('#home-search-input', 'te tay');
  await page.locator('[data-safety-banner="acute_symptom"]').waitFor();
  await context.setOffline(false);
  await page.goto(`${base}/dotquy/kiem-tra/`);
  await page.click('[data-acute-ans="yes"]');
  await page.locator('#acute-verdict-card').waitFor();
  assert.ok((await page.locator('#acute-verdict-card a[href$="/so-cuu/"]').getAttribute('href')).startsWith('/dotquy/'));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/dotquy/so-cuu/`);
  await page.locator('#btn-primary-call-115').waitFor();
  assert.deepEqual(errors, []);
  const response = await context.request.get(`${requestBase}/dotquy/ota/manifest.json`, requestOptions);
  assert.match(response.headers()['cache-control'], /no-store/);
  const manifest = await response.json();
  const zipBuffer = await (await context.request.get(`${requestBase}/dotquy/ota/bundle.zip`, requestOptions)).body();
  assert.equal(crypto.createHash('sha256').update(zipBuffer).digest('hex'), manifest.bundleSha256);
  const zip = await JSZip.loadAsync(zipBuffer);
  const nativeHome = await zip.file('index.html').async('string');
  assert.ok(nativeHome.includes('href="/so-cuu/"'), 'Native OTA must retain root URLs');
  const missing = await context.request.get(`${requestBase}/dotquy/does-not-exist`, requestOptions);
  assert.equal(missing.status(), 404);
  console.log(`PASS: ${routes.length} pages, scoped links/assets, search online/offline, triage, mobile emergency, scoped service worker/cache, OTA SHA-256, native root URLs, and real 404.`);
} finally { await browser.close(); }
