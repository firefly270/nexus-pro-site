import { useState, useMemo, useCallback, type MouseEvent } from 'react'
import type { DataPoint } from '../utils/dataPipeline'
import { flattenData, findClosestPoint, roundUp, logTickValues } from '../utils/dataPipeline'

type Metric = 'transistors' | 'clock' | 'compute'

const VENDOR_COLORS: Record<string, string> = { nvidia: '#76B900', amd: '#ED1C24', intel: '#0071C5' }

const METRIC_LABELS: Record<Metric, { short: string; full: string }> = {
  transistors: { short: 'Transistors', full: 'Transistors (Billions)' },
  clock: { short: 'Clock', full: 'Clock Speed (MHz)' },
  compute: { short: 'Compute', full: 'Compute Units' },
}

function log10Safe(v: number): number {
  return v <= 0 ? 0 : Math.log10(v)
}

export default function GraphifyView() {
  const [metric, setMetric] = useState<Metric>('transistors')
  const [isLogScale, setIsLogScale] = useState(false)
  const [tooltip, setTooltip] = useState<{ data: DataPoint; x: number; y: number } | null>(null)

  const points = useMemo(() => flattenData(), [])

  const { svgW, svgH, padding, yearMin, yearMax, yMin, yMax, yMinRaw, yMaxRaw, vendors, usingLog } = useMemo(() => {
    const pw = typeof window !== 'undefined' ? Math.min(window.innerWidth - 80, 1200) : 1000
    const svgW = Math.max(400, pw)
    const svgH = Math.max(300, Math.round(svgW * 0.55))
    const padding = { top: 30, right: 30, bottom: 50, left: 70 }

    const years = points.map(p => p.year)
    const yearMin = Math.min(...years)
    const yearMax = Math.max(...years)

    const usingLog = metric === 'transistors' && isLogScale
    const rawVals = points.map(p => p[metric])
    const yMinRaw = Math.min(...rawVals)
    const yMaxRaw = Math.max(...rawVals)

    let yMin: number
    let yMax: number
    if (usingLog) {
      const minLog = log10Safe(yMinRaw)
      const maxLog = log10Safe(yMaxRaw)
      const range = maxLog - minLog
      yMin = Math.floor((minLog - range * 0.05) * 10) / 10
      yMax = Math.ceil((maxLog + range * 0.05) * 10) / 10
    } else {
      yMin = 0
      yMax = roundUp(Math.max(...rawVals) * 1.1, 10 ** Math.max(0, Math.floor(Math.log10(Math.max(...rawVals)) - 1)))
    }
    const vendors = [...new Set(points.map(p => p.vendor))]

    return { svgW, svgH, padding, yearMin, yearMax, yMin, yMax, yMinRaw, yMaxRaw, vendors, usingLog }
  }, [points, metric, isLogScale])

  const xScale = useCallback((y: number) => padding.left + ((y - yearMin) / (yearMax - yearMin)) * (svgW - padding.left - padding.right), [padding, yearMin, yearMax, svgW])
  const yScale = useCallback((v: number) => {
    const val = usingLog ? log10Safe(v) : v
    return svgH - padding.bottom - ((val - yMin) / (yMax - yMin)) * (svgH - padding.top - padding.bottom)
  }, [padding, svgH, yMin, yMax, usingLog])

  const handleMouseMove = useCallback((e: MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const xYear = yearMin + ((mx - padding.left) / (svgW - padding.left - padding.right)) * (yearMax - yearMin)
    const threshold = (yearMax - yearMin) * 0.02
    const closest = findClosestPoint(points, xYear, threshold)
    if (closest) {
      setTooltip({ data: closest, x: mx, y: e.clientY - rect.top })
    } else {
      setTooltip(null)
    }
  }, [points, yearMin, yearMax, svgW, padding])

  const handleMouseLeave = useCallback(() => setTooltip(null), [])

  const yTicks: { value: number; label: string }[] = useMemo(() => {
    if (usingLog) {
      const { ticks, labels } = logTickValues(yMaxRaw, yMinRaw)
      return ticks.map((v, i) => ({ value: log10Safe(v), label: labels[i] ?? '' }))
    }
    const ticks: { value: number; label: string }[] = []
    const step = (yMax - yMin) / 5
    for (let i = 0; i <= 5; i++) {
      const v = Math.round(yMin + step * i)
      ticks.push({ value: v, label: metric === 'transistors' ? `${v}B` : String(v) })
    }
    return ticks
  }, [yMax, yMin, usingLog, yMaxRaw, yMinRaw, metric])

  const xTicks = useMemo(() => {
    const ticks: number[] = []
    const step = Math.max(1, Math.round((yearMax - yearMin) / 8))
    for (let y = yearMin; y <= yearMax; y += step) ticks.push(y)
    return ticks
  }, [yearMin, yearMax])

  const curves = useMemo(() => {
    return vendors.map(v => {
      const vp = points.filter(p => p.vendor === v).sort((a, b) => a.year - b.year)
      const seen = new Set<number>()
      const deduped = vp.filter(p => { if (seen.has(p.year)) return false; seen.add(p.year); return true })
      if (deduped.length < 2) return null
      const d = deduped.map((p, i) => `${i === 0 ? 'M' : 'L'}${xScale(p.year)},${yScale(p[metric])}`).join(' ')
      return { vendor: v, d }
    }).filter(Boolean) as { vendor: string; d: string }[]
  }, [vendors, points, metric, xScale, yScale])

  const handleMetricChange = (m: Metric) => {
    setMetric(m)
    setTooltip(null)
    if (m !== 'transistors') setIsLogScale(false)
  }

  const handleScaleToggle = () => {
    setIsLogScale((prev) => !prev)
    setTooltip(null)
  }

  return (
    <div className="bg-[#030303] flex flex-col" style={{ height: 'calc(100vh - 48px)' }}>
      <div className="flex items-center justify-between px-6 pt-16 pb-2 max-w-[1200px] mx-auto w-full">
        <h2 className="text-zinc-400 text-xs font-mono tracking-widest uppercase">Analytics Dashboard</h2>
        <div className="flex gap-1">
          {(['transistors', 'clock', 'compute'] as Metric[]).map(m => (
            <button key={m} onClick={() => handleMetricChange(m)} className={`px-3 py-1 text-[10px] font-mono tracking-wider uppercase rounded-full border transition-all duration-200 ${metric === m ? 'text-white border-zinc-500 bg-zinc-800/50' : 'text-zinc-600 border-zinc-800 hover:text-zinc-400 hover:border-zinc-600'}`}>
              {METRIC_LABELS[m].short}
            </button>
          ))}
          {metric === 'transistors' && (
            <button onClick={handleScaleToggle} className={`px-3 py-1 text-[10px] font-mono tracking-wider uppercase rounded-full border transition-all duration-200 ml-2 ${isLogScale ? 'text-emerald-300 border-emerald-700/50 bg-emerald-900/20' : 'text-zinc-600 border-zinc-800 hover:text-zinc-400 hover:border-zinc-600'}`}>
              {isLogScale ? 'Log' : 'Linear'}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 pb-6">
        <div className="w-full max-w-[1200px] relative">
          <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto" style={{ maxHeight: '70vh' }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            {/* Grid lines */}
            {yTicks.map(t => (
              <g key={`g-${t.value}`}>
                <line x1={padding.left} y1={yScale(usingLog ? 10 ** (t.value) : t.value)} x2={svgW - padding.right} y2={yScale(usingLog ? 10 ** (t.value) : t.value)} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
                <text x={padding.left - 8} y={yScale(usingLog ? 10 ** (t.value) : t.value) + 3} textAnchor="end" fill="rgba(255,255,255,0.25)" fontSize={9} fontFamily="monospace">{t.label}</text>
              </g>
            ))}
            {xTicks.map(y => (
              <g key={`x-${y}`}>
                <line x1={xScale(y)} y1={padding.top} x2={xScale(y)} y2={svgH - padding.bottom} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
                <text x={xScale(y)} y={svgH - padding.bottom + 16} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize={9} fontFamily="monospace">{y}</text>
              </g>
            ))}

            {/* Y-axis label */}
            <text x={12} y={svgH / 2} textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize={9} fontFamily="monospace" transform={`rotate(-90, 12, ${svgH / 2})`}>{usingLog ? 'Transistors (Log Scale)' : METRIC_LABELS[metric].full}</text>

            {/* Vendor curves */}
            {curves.map(c => (
              <path key={`${metric}-${isLogScale}-${c.vendor}`} d={c.d} fill="none" stroke={VENDOR_COLORS[c.vendor]} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" opacity={0.6} style={{ transition: 'opacity 0.3s ease' }} />
            ))}

            {/* Data point dots */}
            {points.map((p, i) => (
              <circle key={`${metric}-${isLogScale}-${i}`} cx={xScale(p.year)} cy={yScale(p[metric])} r={3} fill={VENDOR_COLORS[p.vendor]} opacity={0.8} stroke="#030303" strokeWidth={1} style={{ transition: 'cx 0.4s ease, cy 0.4s ease' }} />
            ))}

            {/* Legend */}
            {vendors.map((v, i) => {
              const lx = svgW - padding.right - 140
              const ly = padding.top + i * 18
              return (
                <g key={v}>
                  <rect x={lx} y={ly - 6} width={10} height={10} rx={2} fill={VENDOR_COLORS[v]} />
                  <text x={lx + 16} y={ly + 1} fill="rgba(255,255,255,0.5)" fontSize={10} fontFamily="monospace">{v.charAt(0).toUpperCase() + v.slice(1)}</text>
                </g>
              )
            })}
          </svg>

          {/* Tooltip */}
          {tooltip && (
            <div className="absolute pointer-events-none z-50 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700 rounded-xl px-3 py-2 shadow-2xl" style={{ left: Math.min(tooltip.x + 16, svgW - 220), top: Math.max(tooltip.y - 80, 0) }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: VENDOR_COLORS[tooltip.data.vendor] }} />
                <span className="text-white text-[11px] font-semibold">{tooltip.data.name}</span>
              </div>
              <div className="text-zinc-400 text-[10px] font-mono space-y-0.5">
                <div>{tooltip.data.codename} · {tooltip.data.year}</div>
                <div className="text-zinc-500">Transistors: <span className="text-zinc-300">{tooltip.data.transistors.toFixed(1)}B</span></div>
                <div className="text-zinc-500">Clock: <span className="text-zinc-300">{tooltip.data.clock.toFixed(0)} MHz</span></div>
                <div className="text-zinc-500">Compute: <span className="text-zinc-300">{tooltip.data.compute.toLocaleString()}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
