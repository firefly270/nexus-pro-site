import { useVendor } from '../context/VendorContext'

interface ChapterOverlayProps {
  id: string
  children: React.ReactNode
  width?: 'narrow' | 'default' | 'wide' | 'full'
}

const widths = {
  narrow: 'max-w-2xl',
  default: 'max-w-3xl',
  wide: 'max-w-5xl',
  full: 'max-w-full',
}

function hexToRgb(hex: string) {
  const v = parseInt(hex.replace('#', ''), 16)
  return `${(v >> 16) & 255}, ${(v >> 8) & 255}, ${v & 255}`
}

export default function ChapterOverlay({ id, children, width = 'default' }: ChapterOverlayProps) {
  const { config } = useVendor()
  const color = config?.color ?? '#030303'

  return (
    <section id={id} className="min-h-screen relative flex items-center justify-center py-24 px-6 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-32 pointer-events-none" style={{ background: `linear-gradient(to bottom, rgba(${hexToRgb(color)},0.06), transparent)` }} />
      <div className="absolute inset-x-0 bottom-0 h-32 pointer-events-none" style={{ background: `linear-gradient(to top, rgba(${hexToRgb(color)},0.06), transparent)` }} />
      <div className={`${widths[width]} w-full relative`}>
        {children}
      </div>
    </section>
  )
}
