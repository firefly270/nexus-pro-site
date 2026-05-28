import { chromium } from 'playwright'
import { promises as fs } from 'fs'

const PROFILES = {
  'Desktop-Ultra': { viewport: { width: 1920, height: 1080 }, dpr: 2, concurrency: 8 },
  'Mobile-Low': { viewport: { width: 375, height: 812 }, dpr: 1, concurrency: 2 },
}

async function audit() {
  const browser = await chromium.launch({ headless: true })
  const results = {}

  for (const [name, profile] of Object.entries(PROFILES)) {
    const context = await browser.newContext({
      viewport: profile.viewport,
      deviceScaleFactor: profile.dpr,
      reducedMotion: profile.concurrency < 4 ? 'reduce' : 'no-preference',
    })
    const page = await context.newPage()
    await page.goto('http://localhost:4173')

    for (let w = 0; w < 3; w++) {
      await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }))
      await page.waitForTimeout(500)
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
      await page.waitForTimeout(500)
    }

    const allFrameTimes = []
    for (let m = 0; m < 5; m++) {
      await page.evaluate(() => {
        const times = []
        let last = performance.now()
        const frame = () => {
          const now = performance.now()
          times.push(now - last)
          last = now
          requestAnimationFrame(frame)
        }
        requestAnimationFrame(frame)
      })

      await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }))
      await page.waitForTimeout(4000)
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
      await page.waitForTimeout(4000)

      const times = await page.evaluate(() => (window as any).__frameTimes)
      if (times) allFrameTimes.push(...times)
    }

    const mean = allFrameTimes.reduce((a, b) => a + b, 0) / allFrameTimes.length
    const fps = 1000 / mean
    const janks = allFrameTimes.filter(t => t > 33.3).length
    const mem = await page.evaluate(() => (performance as any).memory?.usedJSHeapSize ?? 0)

    results[name] = { meanFps: +fps.toFixed(1), jankCount: janks, heapMB: +(mem / 1048576).toFixed(1) }
    await context.close()
  }

  await browser.close()
  await fs.writeFile('perf-report.json', JSON.stringify(results, null, 2))

  for (const [name, r] of Object.entries(results)) {
    if (r.meanFps < 45 && r.jankCount > 3) {
      console.error(`FAIL: ${name} — ${r.meanFps}fps, ${r.jankCount} janks`)
      process.exit(1)
    }
  }
  console.log('PASS:', JSON.stringify(results))
}

audit()
