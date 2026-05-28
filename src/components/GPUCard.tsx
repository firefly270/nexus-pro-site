import { useRef } from 'react'
import type { GPUCardData, CPUCardData } from '../types'
import { useVendor } from '../context/VendorContext'
import { useBoundStore } from '../store/useBoundStore'

type CardProps = (GPUCardData | CPUCardData) & { bentoRole?: 'hero' | 'compact' | 'full' }

function getPrimarySpecs(props: GPUCardData | CPUCardData) {
  if (props.variant === 'cpu') {
    const cpu = props as CPUCardData
    return [
      { label: 'CLOCK', val: cpu.clock, large: true },
      { label: 'CORES', val: cpu.cores },
      { label: 'THREADS', val: cpu.threads },
    ]
  }
  const gpu = props as GPUCardData
  return [
    { label: 'CLOCK', val: gpu.clock, large: true },
    { label: 'CUDA CORES', val: gpu.cudaCores },
  ]
}

function getEnvironmentalSpecs(props: GPUCardData | CPUCardData) {
  if (props.variant === 'cpu') {
    const cpu = props as CPUCardData
    return [
      { label: 'TDP', val: cpu.tdp },
      { label: 'CACHE', val: cpu.cache },
      { label: 'CORE ARCH', val: cpu.codename },
    ]
  }
  const gpu = props as GPUCardData
  return [
    { label: 'MEMORY LAYER', val: gpu.memory },
    { label: 'CORE ARCH', val: gpu.codename },
  ]
}

function Spec({ label, val, large }: { label: string; val: string; large?: boolean }) {
  return (
    <div className="rounded-lg px-3 py-2 transition-all duration-200 hover:-translate-y-0.5" style={{ background: 'rgba(0,0,0,0.25)', border: '0.5px solid rgba(255,255,255,0.04)' }}>
      <div className="text-zinc-600 text-[10px] uppercase tracking-wider">{label}</div>
      <div className={`text-white ${large ? 'text-2xl' : 'text-sm'} font-mono`}>{val}</div>
    </div>
  )
}

function MiniSpec({ label, val }: { label: string; val: string }) {
  return (
    <div className="rounded-md px-2 py-1" style={{ background: 'rgba(0,0,0,0.25)', border: '0.5px solid rgba(255,255,255,0.04)' }}>
      <div className="text-zinc-600 text-[9px] uppercase tracking-wider">{label}</div>
      <div className="text-white text-xs font-mono">{val}</div>
    </div>
  )
}

export default function GPUCard(props: CardProps) {
  const { name, year, codename, transistors, clock, highlight, features, transistorScale, variant, bentoRole = 'compact' } = props
  const { config } = useVendor()
  const quality = useBoundStore((s) => s.quality)
  const isLowTier = quality === 'low' || quality === 'medium'
  const color = config?.color ?? '#76B900'
  const accent = config?.accent ?? '#00D4AA'
  const tf = config?.typeface ?? { fontFamily: 'Inter', displayWeight: '900', headingWeight: '700', tracking: '-0.03em' }
  const cardRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const accentGlowRef = useRef<HTMLDivElement>(null)

  const isCpu = variant === 'cpu'
  const isHero = bentoRole === 'hero' || bentoRole === 'full'
  const primarySpecs = getPrimarySpecs(props)
  const envSpecs = getEnvironmentalSpecs(props)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el || isLowTier) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.setProperty('--tilt-x', `${y * -8}deg`)
    el.style.setProperty('--tilt-y', `${x * 8}deg`)
    el.style.setProperty('--glow-x', `${50 + x * 3}%`)
    el.style.setProperty('--glow-y', `${50 - y * 3}%`)
    if (glowRef.current) glowRef.current.style.opacity = '1'
    if (accentGlowRef.current) accentGlowRef.current.style.opacity = '1'
  }

  const handleMouseLeave = () => {
    const el = cardRef.current
    if (!el || isLowTier) return
    el.style.removeProperty('--tilt-x')
    el.style.removeProperty('--tilt-y')
    el.style.removeProperty('--glow-x')
    el.style.removeProperty('--glow-y')
    if (glowRef.current) glowRef.current.style.opacity = '0'
    if (accentGlowRef.current) accentGlowRef.current.style.opacity = '0'
  }

  const filledBlocks = Math.round(transistorScale * 20)

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${isLowTier ? '' : 'backdrop-blur-xl'} animate-fade-up transition-transform duration-300 ease-out overflow-hidden`}
      style={{
        border: 'var(--era-border, 1px solid rgba(255,255,255,0.05))',
        background: 'rgba(255, 255, 255, 0.015)',
        borderRadius: 'var(--era-radius, 16px)',
        boxShadow: isLowTier ? 'none' : '0 8px 32px rgba(0,0,0,0.4)',
        transform: 'var(--era-card-transform, none) perspective(800px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))',
        transition: 'box-shadow 0.3s ease, background 0.8s ease, border 0.8s ease, border-radius 0.8s ease, transform 0.3s ease',
      }}
    >
      {/* Corner notches */}
      <span className="corner-notch top-2 left-2" style={{ color: `${color}44` }}>+</span>
      <span className="corner-notch top-2 right-2" style={{ color: `${color}44` }}>+</span>
      <span className="corner-notch bottom-2 left-2" style={{ color: `${color}44` }}>+</span>
      <span className="corner-notch bottom-2 right-2" style={{ color: `${color}44` }}>+</span>

      {/* Holographic glow layers */}
      {!isLowTier && (
        <>
          <div ref={glowRef} className="absolute inset-0 rounded-2xl pointer-events-none opacity-0"
               style={{
                 background: `radial-gradient(600px circle at var(--glow-x, 50%) var(--glow-y, 50%), ${color}10, transparent 60%)`,
                 transition: 'opacity 0.3s ease',
               }} />
          <div ref={accentGlowRef} className="absolute inset-0 rounded-2xl pointer-events-none opacity-0"
               style={{
                 background: `radial-gradient(400px circle at var(--glow-x, 50%) var(--glow-y, 50%), ${accent}08, transparent 50%)`,
                 transition: 'opacity 0.3s ease',
               }} />
        </>
      )}

      {/* Top edge highlight */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${color}33, transparent)` }} />

      {isHero ? (
        <div className="p-6">
          {/* Header row */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-white text-xl" style={{ fontFamily: tf.fontFamily, fontWeight: tf.displayWeight, letterSpacing: tf.tracking }}>{name}</h3>
              <span className="text-zinc-500 text-xs">{codename} · {year}</span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest rounded"
                  style={{ background: `${color}12`, border: `0.5px solid ${color}30`, color }}>
              <span className="opacity-50 tracking-[0.15em]">TRANSISTORS</span>
              <span className="text-white">//</span>
              <span>{transistors}</span>
            </span>
          </div>

          <p className="text-zinc-300 text-sm italic border-l-2 pl-3 mb-5" style={{ borderColor: `${color}66` }}>{highlight}</p>

          {/* Asymmetric bento grid: 5 columns */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
            <div className="space-y-2 md:col-span-3">
              {primarySpecs.map(s => (
                <Spec key={s.label} label={s.label} val={s.val} large={s.large} />
              ))}
            </div>
            <div className="space-y-2 md:col-span-2">
              {envSpecs.map(s => (
                <Spec key={s.label} label={s.label} val={s.val} />
              ))}
            </div>
          </div>

          {/* Capsule feature tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {features.map(f => (
              <span key={f} className="capsule-tag" style={{ background: `${color}08`, border: `0.5px solid ${color}20`, color: `${color}cc` }}>{f}</span>
            ))}
          </div>

          {/* Segmented 20-block transistor level */}
          <div className="flex gap-[2px] items-stretch">
            {Array.from({ length: 20 }, (_, i) => {
              const filled = i < filledBlocks
              return (
                <div key={i} className={`segment-block ${isLowTier ? 'instant' : ''}`}
                     style={{
                       background: filled ? accent : 'rgba(255,255,255,0.06)',
                       opacity: filled ? 1 : 0.3,
                       boxShadow: filled ? `0 0 4px ${accent}` : 'none',
                       transitionDelay: isLowTier ? '0ms' : `${i * 30}ms`,
                       '--seg-color': accent,
                     } as React.CSSProperties} />
              )
            })}
          </div>
        </div>
      ) : (
        <div className="p-4">
          {/* Compact header */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-white text-sm font-semibold" style={{ fontFamily: tf.fontFamily }}>{name}</h3>
              <span className="text-zinc-500 text-[10px]">{year}</span>
            </div>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-widest rounded"
                  style={{ background: `${color}12`, border: `0.5px solid ${color}30`, color }}>
              <span className="opacity-50 tracking-[0.15em]">TRANSISTORS</span>
              <span className="text-white">//</span>
              <span>{transistors}</span>
            </span>
          </div>

          <p className="text-zinc-400 text-xs leading-relaxed mb-3 line-clamp-2">{highlight}</p>

          <div className="grid grid-cols-2 gap-1.5 mb-3">
            <MiniSpec label="CLOCK" val={clock} />
            {isCpu ? (
              <MiniSpec label="CORES" val={(props as CPUCardData).cores} />
            ) : (
              <MiniSpec label="CUDA" val={(props as GPUCardData).cudaCores} />
            )}
          </div>

          {/* Capsule tags in compact */}
          <div className="flex flex-wrap gap-1 mb-3">
            {features.slice(0, 3).map(f => (
              <span key={f} className="capsule-tag text-[8px]" style={{ background: `${color}08`, border: `0.5px solid ${color}20`, color: `${color}cc` }}>{f}</span>
            ))}
          </div>

          {/* Segmented 20-block bar (compact — thinner) */}
          <div className="flex gap-[2px] items-stretch h-1.5">
            {Array.from({ length: 20 }, (_, i) => {
              const filled = i < filledBlocks
              return (
                <div key={i} className={`segment-block ${isLowTier ? 'instant' : ''}`}
                     style={{
                       height: '6px',
                       background: filled ? accent : 'rgba(255,255,255,0.06)',
                       opacity: filled ? 1 : 0.3,
                       boxShadow: filled ? `0 0 2px ${accent}` : 'none',
                       transitionDelay: isLowTier ? '0ms' : `${i * 30}ms`,
                     } as React.CSSProperties} />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
