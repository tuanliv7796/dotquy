import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'off',
    launchOptions: {
      executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  },
  webServer: {
    command: 'npx astro preview --host 127.0.0.1 --port 4321',
    url: 'http://127.0.0.1:4321/',
    reuseExistingServer: true,
    timeout: 30000,
  },
});
