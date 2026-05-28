import { useVendor } from '../context/VendorContext'

interface ChapterTextProps {
  label: string
  title: string
  children: React.ReactNode
  align?: 'left' | 'center' | 'right'
}

export default function ChapterText({ label, title, children, align = 'center' }: ChapterTextProps) {
  const { config } = useVendor()
  const color = config?.color ?? '#76B900'
  const tf = config?.typeface ?? { fontFamily: 'Inter', displayWeight: '900', headingWeight: '700', tracking: '-0.03em' }
  const alignClass = align === 'left' ? 'items-start text-left' : align === 'right' ? 'items-end text-right' : 'items-center text-center'

  return (
    <article className={`flex flex-col ${alignClass} space-y-6`}>
      <span
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs"
        style={{ borderColor: `${color}33`, backgroundColor: `${color}0D`, color }}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: color }} />
          <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: color }} />
        </span>
        {label}
      </span>
      <h2
        className="text-[var(--type-scale-display)] leading-[1.05] tracking-tight text-white"
        style={{
          fontFamily: tf.fontFamily,
        }}
      >
        {[...title].map((ch, i) =>
          ch === ' ' ? (
            <span key={i} className="inline-block w-[0.3em]" />
          ) : (
            <span
              key={i}
              className="inline-block animate-weight-reveal-char"
              style={{
                '--char-index': i,
                '--dw': tf.displayWeight,
                '--dt': tf.tracking,
              } as React.CSSProperties}
            >
              {ch}
            </span>
          )
        )}
      </h2>
      <div className="text-[var(--type-scale-body)] text-zinc-400 leading-relaxed space-y-4 prose-column">
        {children}
      </div>
    </article>
  )
}
