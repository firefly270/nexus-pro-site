import { useEffect, useRef } from 'react'
import { useBoundStore } from '../store/useBoundStore'

export type QualityLevel = 'ultra' | 'high' | 'medium' | 'low'

export interface PerformanceSettings {
  dpr: number
  particleMultiplier: number
  bloomIntensity: number
  fogEnabled: boolean
  caEnabled: boolean
}

const TIERS: Record<QualityLevel, PerformanceSettings> = {
  ultra: { dpr: 2, particleMultiplier: 1, bloomIntensity: 1, fogEnabled: true, caEnabled: true },
  high: { dpr: 1.5, particleMultiplier: 0.5, bloomIntensity: 0.8, fogEnabled: true, caEnabled: true },
  medium: { dpr: 1.25, particleMultiplier: 0.25, bloomIntensity: 0.5, fogEnabled: true, caEnabled: false },
  low: { dpr: 1, particleMultiplier: 0.13, bloomIntensity: 0, fogEnabled: false, caEnabled: false },
}

const FRAME_WINDOW = 120
const COOLDOWN_MS = 3000

function determineQuality(fps: number): QualityLevel {
  if (fps > 55) return 'ultra'
  if (fps > 45) return 'high'
  if (fps > 30) return 'medium'
  return 'low'
}

export function usePerformanceOrchestrator() {
  const frameTimes = useRef<number[]>([])
  const lastChange = useRef(0)
  const rafId = useRef(0)
  const lastTime = useRef(performance.now())

  useEffect(() => {
    let running = true
    const currentQuality = useBoundStore.getState().quality

    if (!currentQuality) {
      useBoundStore.setState({ quality: 'ultra', settings: TIERS.ultra })
    }

    const tick = (now: number) => {
      if (!running) return
      const delta = now - lastTime.current
      lastTime.current = now

      if (delta > 0 && delta < 100) {
        frameTimes.current.push(delta)
        if (frameTimes.current.length > FRAME_WINDOW) {
          frameTimes.current.shift()
        }
      }

      if (frameTimes.current.length >= FRAME_WINDOW) {
        const avgDelta = frameTimes.current.reduce((a, b) => a + b, 0) / frameTimes.current.length
        const fps = 1000 / avgDelta
        const desired = determineQuality(fps)
        const now_ms = performance.now()
        const store = useBoundStore.getState()

        if (desired !== store.quality && now_ms - lastChange.current > COOLDOWN_MS) {
          lastChange.current = now_ms
          useBoundStore.setState({ quality: desired, settings: TIERS[desired] })
        }
      }

      rafId.current = requestAnimationFrame(tick)
    }

    rafId.current = requestAnimationFrame(tick)

    return () => {
      running = false
      cancelAnimationFrame(rafId.current)
    }
  }, [])
}
