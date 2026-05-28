import { useEffect, useRef } from 'react'

export default function AccessibleAnnouncer() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handler = (e: CustomEvent) => {
      el.textContent = e.detail?.message ?? ''
    }

    window.addEventListener('a11y-announce', handler as EventListener)
    return () => window.removeEventListener('a11y-announce', handler as EventListener)
  }, [])

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  )
}

export function announce(message: string) {
  window.dispatchEvent(new CustomEvent('a11y-announce', { detail: { message } }))
}
