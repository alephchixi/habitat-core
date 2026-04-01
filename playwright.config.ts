import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./scripts/qa",
  timeout: 90_000,
  retries: 0,
  workers: 1,
  outputDir: "audit/playwright-output",
  reporter: [["list"], ["json", { outputFile: "audit/playwright-report.json" }]],
  use: {
    baseURL: "http://localhost:3333",
    headless: true,
    ignoreHTTPSErrors: true,
  },
  webServer: {
    command: "npm run build && npx next start -p 3333",
    url: "http://localhost:3333/en",
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        browserName: "chromium",
      },
    },
  ],
});
