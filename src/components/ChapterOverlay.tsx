import { useVendor } from '../context/VendorContext'

interface ChapterOverlayProps {
  id: string
  children: React.ReactNode
}

function hexToRgb(hex: string) {
  const v = parseInt(hex.replace('#', ''), 16)
  return `${(v >> 16) & 255}, ${(v >> 8) & 255}, ${v & 255}`
}

export default function ChapterOverlay({ id, children }: ChapterOverlayProps) {
  const { config } = useVendor()
  const color = config?.color ?? '#030303'

  return (
    <section id={id} className="min-h-screen relative flex items-center justify-center py-20 px-6 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-32 pointer-events-none" style={{ background: `linear-gradient(to bottom, rgba(${hexToRgb(color)},0.06), transparent)` }} />
      <div className="absolute inset-x-0 bottom-0 h-32 pointer-events-none" style={{ background: `linear-gradient(to top, rgba(${hexToRgb(color)},0.06), transparent)` }} />
      <div className="w-full relative">
        {children}
      </div>
    </section>
  )
}
