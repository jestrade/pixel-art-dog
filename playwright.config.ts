import { defineConfig, devices } from '@playwright/test';

/**
 * Browser smoke check. Run it with `npm run check:browser` from this folder: that exact command is
 * excluded from the Claude Code sandbox, so headless Chrome can start.
 */
export default defineConfig({
  testDir: './e2e',
  // *.pw.ts keeps these files out of the unit-test runner, whose default pattern matches *.spec.ts.
  testMatch: '**/*.pw.ts',
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4301',
    screenshot: 'only-on-failure',
  },
  // The installed Google Chrome, so no Playwright browser download is needed.
  projects: [{ name: 'chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } }],
  webServer: {
    command: 'npx vite --port 4301 --strictPort --host 127.0.0.1',
    url: 'http://127.0.0.1:4301',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
