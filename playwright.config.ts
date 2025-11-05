import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: [['list']],
  use: { baseURL: 'http://localhost:3000', trace: 'on-first-retry' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    { name: 'accessibility', use: { ...devices['Desktop Chrome'] } },
  ],
});
