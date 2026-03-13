import { test, expect } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const screenshotDir = path.join(__dirname, 'screenshots')

test('header desktop - local vs live', async ({ browser }) => {
  test.setTimeout(60000)
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    ignoreHTTPSErrors: true,
  })
  const page = await context.newPage()

  // Local
  await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForTimeout(1000)
  const localHeader = page.locator('header').first()
  await localHeader.screenshot({ path: path.join(screenshotDir, 'header-desktop-local.png') })
  await page.screenshot({ path: path.join(screenshotDir, 'home-desktop-local.png'), fullPage: true })

  // Live
  await page.goto('https://doxa.life/', { waitUntil: 'load', timeout: 30000 })
  await page.waitForTimeout(3000)
  const liveHeader = page.locator('header').first()
  await liveHeader.screenshot({ path: path.join(screenshotDir, 'header-desktop-live.png') })
  await page.screenshot({ path: path.join(screenshotDir, 'home-desktop-live.png'), fullPage: true })

  await context.close()
})

test('header mobile - local vs live', async ({ browser }) => {
  test.setTimeout(60000)
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    ignoreHTTPSErrors: true,
  })
  const page = await context.newPage()

  // Local mobile
  await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForTimeout(1000)
  await page.screenshot({ path: path.join(screenshotDir, 'home-mobile-local.png'), fullPage: true })
  const localHeader = page.locator('header').first()
  await localHeader.screenshot({ path: path.join(screenshotDir, 'header-mobile-local.png') })

  // Click hamburger to open menu
  const hamburger = page.locator('.mobile-menu-toggle').first()
  if (await hamburger.isVisible()) {
    await hamburger.click()
    await page.waitForTimeout(500)
    await page.screenshot({ path: path.join(screenshotDir, 'header-mobile-menu-open-local.png'), fullPage: false })
  }

  // Live mobile
  await page.goto('https://doxa.life/', { waitUntil: 'load', timeout: 30000 })
  await page.waitForTimeout(3000)
  await page.screenshot({ path: path.join(screenshotDir, 'home-mobile-live.png'), fullPage: true })
  const liveHeader = page.locator('header').first()
  await liveHeader.screenshot({ path: path.join(screenshotDir, 'header-mobile-live.png') })

  const liveHamburger = page.locator('.mobile-menu-toggle').first()
  if (await liveHamburger.isVisible()) {
    await liveHamburger.click()
    await page.waitForTimeout(500)
    await page.screenshot({ path: path.join(screenshotDir, 'header-mobile-menu-open-live.png'), fullPage: false })
  }

  await context.close()
})

test('homepage sections - local vs live', async ({ browser }) => {
  test.setTimeout(90000)
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    ignoreHTTPSErrors: true,
  })
  const page = await context.newPage()

  // Local - capture each section
  await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForTimeout(1000)

  // Hero area (first ~900px)
  await page.screenshot({ path: path.join(screenshotDir, 'home-hero-local.png'), clip: { x: 0, y: 0, width: 1280, height: 900 } })

  // Scroll to unengaged section
  await page.evaluate(() => window.scrollTo(0, 900))
  await page.waitForTimeout(500)
  await page.screenshot({ path: path.join(screenshotDir, 'home-unengaged-local.png'), clip: { x: 0, y: 0, width: 1280, height: 900 } })

  // Scroll to steps section
  await page.evaluate(() => window.scrollTo(0, 1600))
  await page.waitForTimeout(500)
  await page.screenshot({ path: path.join(screenshotDir, 'home-steps-local.png'), clip: { x: 0, y: 0, width: 1280, height: 900 } })

  // Footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(500)
  await page.screenshot({ path: path.join(screenshotDir, 'home-footer-local.png'), clip: { x: 0, y: 0, width: 1280, height: 900 } })

  // Live - same sections
  await page.goto('https://doxa.life/', { waitUntil: 'load', timeout: 30000 })
  await page.waitForTimeout(3000)

  await page.screenshot({ path: path.join(screenshotDir, 'home-hero-live.png'), clip: { x: 0, y: 0, width: 1280, height: 900 } })

  await page.evaluate(() => window.scrollTo(0, 900))
  await page.waitForTimeout(500)
  await page.screenshot({ path: path.join(screenshotDir, 'home-unengaged-live.png'), clip: { x: 0, y: 0, width: 1280, height: 900 } })

  await page.evaluate(() => window.scrollTo(0, 1600))
  await page.waitForTimeout(500)
  await page.screenshot({ path: path.join(screenshotDir, 'home-steps-live.png'), clip: { x: 0, y: 0, width: 1280, height: 900 } })

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(500)
  await page.screenshot({ path: path.join(screenshotDir, 'home-footer-live.png'), clip: { x: 0, y: 0, width: 1280, height: 900 } })

  await context.close()
})
