const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests/e2e",
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: "http://localhost:8080",
  },
  webServer: {
    command: "npx --yes http-server -p 8080 -c-1 .",
    url: "http://localhost:8080/catalog-v2.html",
    reuseExistingServer: true,
    timeout: 60000,
  },
});
