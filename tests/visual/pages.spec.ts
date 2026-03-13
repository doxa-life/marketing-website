import { test, expect } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const screenshotDir = path.join(__dirname, 'screenshots')

const pages = [
  { name: 'homepage', localPath: '/', livePath: 'https://doxa.life/' },
  { name: 'pray', localPath: '/pray', livePath: 'https://doxa.life/pray/' },
  { name: 'adopt', localPath: '/adopt', livePath: 'https://doxa.life/adopt/' },
  { name: 'contact', localPath: '/contact-us', livePath: 'https://doxa.life/contact-us/' },
  { name: 'research', localPath: '/research', livePath: 'https://doxa.life/uupg-search/' },
]

async function dismissOverlays(page: import('@playwright/test').Page) {
  await page.evaluate(() => {
    const selectors = [
      '[class*="cookie"]',
      '[id*="cookie"]',
      '[class*="consent"]',
      '[id*="consent"]',
      '[class*="popup"]',
      '[class*="overlay"]',
      '[class*="banner"]',
      '[id*="banner"]',
      '[class*="gdpr"]',
      '[id*="gdpr"]',
    ]
    for (const selector of selectors) {
      document.querySelectorAll(selector).forEach(el => {
        ;(el as HTMLElement).style.display = 'none'
      })
    }
  })
}

for (const pg of pages) {
  test(`capture ${pg.name} - local and live`, async ({ browser }) => {
    test.setTimeout(60000)

    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true,
    })
    const page = await context.newPage()

    // --- Local screenshot ---
    const localResponse = await page.goto(pg.localPath, {
      waitUntil: 'networkidle',
      timeout: 30000,
    })
    expect(localResponse).not.toBeNull()

    await dismissOverlays(page)
    await page.waitForTimeout(500)

    await page.screenshot({
      path: path.join(screenshotDir, `${pg.name}-local.png`),
      fullPage: true,
    })

    if (localResponse!.status() >= 400) {
      console.warn(`[${pg.name}] local returned HTTP ${localResponse!.status()}`)
    }

    // --- Live screenshot ---
    // Use 'load' instead of 'networkidle' for the live WordPress site,
    // which may have analytics/chat scripts that keep connections open.
    const liveResponse = await page.goto(pg.livePath, {
      waitUntil: 'load',
      timeout: 30000,
    })
    expect(liveResponse).not.toBeNull()

    // Wait for rendering to settle after initial load
    await page.waitForTimeout(2000)
    await dismissOverlays(page)
    await page.waitForTimeout(500)

    await page.screenshot({
      path: path.join(screenshotDir, `${pg.name}-live.png`),
      fullPage: true,
    })

    if (liveResponse!.status() >= 400) {
      console.warn(`[${pg.name}] live returned HTTP ${liveResponse!.status()}`)
    }

    await context.close()
  })
}
