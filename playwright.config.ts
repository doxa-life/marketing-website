import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/visual',
  use: {
    baseURL: 'http://localhost:3200',
    screenshot: 'only-on-failure',
    viewport: { width: 1280, height: 720 },
  },
  webServer: {
    command: 'npx nuxt dev',
    port: 3200,
    reuseExistingServer: true,
    timeout: 60000,
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
})
