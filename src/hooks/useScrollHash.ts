import { useEffect, useRef } from 'react'

const OBSERVER_CONFIG = { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' }

export function useScrollHash() {
  const initialScrolled = useRef(false)

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash) {
      const target = document.getElementById(hash)
      if (target) {
        requestAnimationFrame(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      }
    }
    initialScrolled.current = true
  }, [])

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('section[id^="ch-"]')
    if (!sections.length) return

    const visible = new Map<string, number>()

    const cb: IntersectionObserverCallback = (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          visible.set(e.target.id, e.intersectionRatio)
        } else {
          visible.delete(e.target.id)
        }
      }

      let bestId = ''
      let bestRatio = 0
      for (const [id, ratio] of visible) {
        if (ratio > bestRatio) {
          bestRatio = ratio
          bestId = id
        }
      }
      if (bestId) {
        const url = new URL(window.location.href)
        if (url.hash !== `#${bestId}`) {
          url.hash = bestId
          history.replaceState(null, '', url.href)
        }
      }
    }

    const observer = new IntersectionObserver(cb, OBSERVER_CONFIG)
    for (const s of sections) observer.observe(s)
    return () => observer.disconnect()
  }, [])
}
