const { defineConfig } = require("@playwright/test");

// 公開GitHub Pages検証専用の一時Playwright設定。
// 既存のルートplaywright.config.js（tests/e2e向け・ローカルサーバー使用）とは独立している。
module.exports = defineConfig({
  testDir: __dirname,
  timeout: 10 * 60 * 1000,
  expect: {
    timeout: 15000,
  },
  retries: 0,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    actionTimeout: 15000,
    navigationTimeout: 60000,
  },
});
