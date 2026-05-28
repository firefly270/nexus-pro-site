import { useRef } from 'react'
import type { GPUCardData, CPUCardData } from '../types'
import { useVendor } from '../context/VendorContext'

type CardProps = (GPUCardData | CPUCardData) & { bentoRole?: 'hero' | 'compact' | 'full' }

export default function GPUCard(props: CardProps) {
  const { name, year, codename, transistors, clock, highlight, features, transistorScale, variant, bentoRole = 'compact' } = props
  const isCpu = variant === 'cpu'
  const { config } = useVendor()
  const color = config?.color ?? '#76B900'
  const accent = config?.accent ?? '#00D4AA'
  const tf = config?.typeface ?? { fontFamily: 'Inter', displayWeight: '900', headingWeight: '700', tracking: '-0.03em' }
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.setProperty('--tilt-x', `${y * -8}deg`)
    el.style.setProperty('--tilt-y', `${x * 8}deg`)
    el.style.setProperty('--glow-x', `${50 + x * 3}%`)
    el.style.setProperty('--glow-y', `${50 - y * 3}%`)
  }

  const handleMouseLeave = () => {
    const el = cardRef.current
    if (!el) return
    el.style.removeProperty('--tilt-x')
    el.style.removeProperty('--tilt-y')
    el.style.removeProperty('--glow-x')
    el.style.removeProperty('--glow-y')
  }

  const isHero = bentoRole === 'hero' || bentoRole === 'full'

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative bg-white/[0.03] border border-white/[0.06] backdrop-blur-xl rounded-2xl animate-fade-up transition-transform duration-300 ease-out overflow-hidden"
      style={{
        transform: 'perspective(800px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))',
      }}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at var(--glow-x, 50%) var(--glow-y, 50%), ${color}08, transparent 60%)`,
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${color}33, transparent)` }} />
      {isHero ? (
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-white text-xl" style={{ fontFamily: tf.fontFamily, fontWeight: tf.displayWeight, letterSpacing: tf.tracking }}>{name}</h3>
              <span className="text-zinc-500 text-xs">{codename} · {year}</span>
            </div>
            <span className="text-sm font-mono px-2 py-0.5 rounded" style={{ backgroundColor: `${color}1A`, color }}>{transistors}</span>
          </div>
          <p className="text-zinc-300 text-sm italic border-l-2 pl-3 mb-5" style={{ borderColor: `${color}66` }}>{highlight}</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {isCpu ? (
              <>
                <Spec label="Clock" val={clock} />
                <Spec label="Cores" val={(props as CPUCardData).cores} />
                <Spec label="Threads" val={(props as CPUCardData).threads} />
                <Spec label="Cache" val={(props as CPUCardData).cache} />
                <Spec label="TDP" val={(props as CPUCardData).tdp} />
                <Spec label="µarch" val={codename} />
              </>
            ) : (
              <>
                <Spec label="Clock" val={clock} />
                <Spec label="CUDA" val={(props as GPUCardData).cudaCores} />
                <Spec label="Memory" val={(props as GPUCardData).memory} />
              </>
            )}
          </div>
          <ul className="space-y-1 mb-4">
            {features.map(f => (
              <li key={f} className="text-zinc-500 text-xs flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: color }} />
                {f}
              </li>
            ))}
          </ul>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${transistorScale * 100}%`, background: `linear-gradient(to right, ${color}, ${accent})` }} />
          </div>
          <div className="flex justify-between text-[10px] text-zinc-600 mt-1">
            <span>Transistor scale</span>
            <span>{transistors}</span>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-white text-sm font-semibold" style={{ fontFamily: tf.fontFamily }}>{name}</h3>
              <span className="text-zinc-500 text-[10px]">{year}</span>
            </div>
            <span className="text-[10px] font-mono" style={{ color }}>{transistors}</span>
          </div>
          <p className="text-zinc-400 text-xs leading-relaxed mb-3 line-clamp-2">{highlight}</p>
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            <MiniSpec label="Clock" val={clock} />
            {isCpu ? (
              <MiniSpec label="Cores" val={(props as CPUCardData).cores} />
            ) : (
              <MiniSpec label="CUDA" val={(props as GPUCardData).cudaCores} />
            )}
          </div>
          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${transistorScale * 100}%`, background: `linear-gradient(to right, ${color}, ${accent})` }} />
          </div>
        </div>
      )}
    </div>
  )
}

function Spec({ label, val }: { label: string; val: string }) {
  return (
    <div className="bg-black/30 rounded-lg px-3 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:bg-black/40">
      <div className="text-zinc-600 text-[10px] uppercase tracking-wider">{label}</div>
      <div className="text-white text-sm font-mono">{val}</div>
    </div>
  )
}

function MiniSpec({ label, val }: { label: string; val: string }) {
  return (
    <div className="bg-black/30 rounded-md px-2 py-1">
      <div className="text-zinc-600 text-[9px] uppercase tracking-wider">{label}</div>
      <div className="text-white text-xs font-mono">{val}</div>
    </div>
  )
}