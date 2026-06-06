import { Component, useCallback, type ReactNode, type ErrorInfo } from 'react'
import { create } from 'zustand'

// ===== MODULE 1: Types =====
export type Vendor = 'nvidia' | 'amd' | 'intel'
export type MetricMode = 'transistors' | 'clock' | 'compute'

export interface DataPoint {
  name: string
  codename: string
  year: number
  vendor: Vendor
  transistors: number
  clock: number
  compute: number
}

interface GPUSpec {
  id: string
  name: string
  vendor: Vendor
  year: number
  architecture: string
  codename: string
  transistors: string
  clockSpeed: string
  memory: string
  computePower: string
  tags: string[]
}

// ===== MODULE 2: State =====
interface StoreState {
  isGraphViewEnabled: boolean
  toggleGraphView: () => void
  metricMode: MetricMode
  setMetricMode: (mode: MetricMode) => void
  logScale: boolean
  toggleLogScale: () => void
  hoveredPoint: DataPoint | null
  setHoveredPoint: (p: DataPoint | null) => void
}

export const useStore = create<StoreState>((set) => ({
  isGraphViewEnabled: false,
  toggleGraphView: () => set((s) => ({ isGraphViewEnabled: !s.isGraphViewEnabled })),
  metricMode: 'transistors',
  setMetricMode: (metricMode) => set({ metricMode }),
  logScale: true,
  toggleLogScale: () => set((s) => ({ logScale: !s.logScale })),
  hoveredPoint: null,
  setHoveredPoint: (hoveredPoint) => set({ hoveredPoint }),
}))

// ===== MODULE 3: Dataset =====
const RAW_GPUS: GPUSpec[] = [
  // Intel
  { id: 'intel-4004', name: 'Intel 4004', vendor: 'intel', year: 1971, architecture: '4-bit CPU', codename: '4004', transistors: '2,300', clockSpeed: '740 kHz', memory: 'N/A', computePower: '0.06', tags: ['cpu', 'milestone'] },
  { id: 'intel-i740', name: 'Intel i740', vendor: 'intel', year: 1998, architecture: 'i740', codename: 'Auburn', transistors: '3.5M', clockSpeed: '66 MHz', memory: '8 MB', computePower: '0.5', tags: ['gpu', 'first-discrete'] },
  { id: 'arc-a770', name: 'Arc A770', vendor: 'intel', year: 2022, architecture: 'Alchemist', codename: 'ACM-G10', transistors: '21.7B', clockSpeed: '2400 MHz', memory: '16 GB GDDR6', computePower: '19.2', tags: ['gpu', 'xess'] },
  { id: 'arc-b580', name: 'Arc B580', vendor: 'intel', year: 2024, architecture: 'Battlemage', codename: 'BMG-G21', transistors: '19.6B', clockSpeed: '2850 MHz', memory: '12 GB GDDR6', computePower: '23.8', tags: ['gpu', 'xess2'] },
  { id: 'intel-celestial', name: 'Intel Celestial', vendor: 'intel', year: 2027, architecture: 'Celestial', codename: 'Celestial', transistors: '35B', clockSpeed: '3200 MHz', memory: '24 GB GDDR7', computePower: '45', tags: ['gpu', 'future'] },
  // AMD
  { id: 'rage-128', name: 'Rage 128', vendor: 'amd', year: 1998, architecture: 'Rage', codename: 'Rage 128', transistors: '8M', clockSpeed: '120 MHz', memory: '32 MB', computePower: '0.8', tags: ['gpu', 'legacy'] },
  { id: 'radeon-9700', name: 'Radeon 9700 Pro', vendor: 'amd', year: 2002, architecture: 'R300', codename: 'R300', transistors: '107M', clockSpeed: '325 MHz', memory: '128 MB GDDR', computePower: '2.8', tags: ['gpu', 'directx9'] },
  { id: 'hd-4870', name: 'Radeon HD 4870', vendor: 'amd', year: 2008, architecture: 'RV770', codename: 'RV770', transistors: '956M', clockSpeed: '750 MHz', memory: '512 MB GDDR5', computePower: '6.5', tags: ['gpu', 'gddr5'] },
  { id: 'rx-5700xt', name: 'Radeon RX 5700 XT', vendor: 'amd', year: 2019, architecture: 'RDNA', codename: 'Navi 10', transistors: '10.3B', clockSpeed: '1905 MHz', memory: '8 GB GDDR6', computePower: '9.8', tags: ['gpu', 'rdna'] },
  { id: 'rx-7900xtx', name: 'Radeon RX 7900 XTX', vendor: 'amd', year: 2022, architecture: 'RDNA 3', codename: 'Navi 31', transistors: '57.7B', clockSpeed: '2500 MHz', memory: '24 GB GDDR6', computePower: '27.5', tags: ['gpu', 'chiplet'] },
  { id: 'amd-9000', name: 'Radeon RX 9000', vendor: 'amd', year: 2028, architecture: 'RDNA 5', codename: 'Navi 50', transistors: '80B', clockSpeed: '3500 MHz', memory: '32 GB GDDR7', computePower: '60', tags: ['gpu', 'future'] },
  // NVIDIA
  { id: 'nv1', name: 'NV1', vendor: 'nvidia', year: 1995, architecture: 'NV1', codename: 'NV1', transistors: '1M', clockSpeed: '75 MHz', memory: '2 MB', computePower: '0.1', tags: ['gpu', 'first'] },
  { id: 'riva-tnt', name: 'RIVA TNT', vendor: 'nvidia', year: 1998, architecture: 'TNT', codename: 'NV4', transistors: '7M', clockSpeed: '90 MHz', memory: '16 MB', computePower: '0.4', tags: ['gpu', 'legacy'] },
  { id: 'geforce-256', name: 'GeForce 256', vendor: 'nvidia', year: 1999, architecture: 'NV10', codename: 'NV10', transistors: '23M', clockSpeed: '120 MHz', memory: '32 MB DDR', computePower: '0.8', tags: ['gpu', 'first-gpu'] },
  { id: 'geforce-8800gtx', name: 'GeForce 8800 GTX', vendor: 'nvidia', year: 2006, architecture: 'Tesla', codename: 'G80', transistors: '681M', clockSpeed: '576 MHz', memory: '768 MB GDDR3', computePower: '4.9', tags: ['gpu', 'unified-shader'] },
  { id: 'gtx-980', name: 'GeForce GTX 980', vendor: 'nvidia', year: 2014, architecture: 'Maxwell', codename: 'GM204', transistors: '5.2B', clockSpeed: '1216 MHz', memory: '4 GB GDDR5', computePower: '12.4', tags: ['gpu', 'maxwell'] },
  { id: 'rtx-2080ti', name: 'RTX 2080 Ti', vendor: 'nvidia', year: 2018, architecture: 'Turing', codename: 'TU102', transistors: '18.6B', clockSpeed: '1545 MHz', memory: '11 GB GDDR6', computePower: '32.8', tags: ['gpu', 'ray-tracing'] },
  { id: 'rtx-3090', name: 'RTX 3090', vendor: 'nvidia', year: 2020, architecture: 'Ampere', codename: 'GA102', transistors: '28.3B', clockSpeed: '1695 MHz', memory: '24 GB GDDR6X', computePower: '45.4', tags: ['gpu', 'ampere'] },
  { id: 'rtx-4090', name: 'RTX 4090', vendor: 'nvidia', year: 2022, architecture: 'Ada Lovelace', codename: 'AD102', transistors: '76.3B', clockSpeed: '2520 MHz', memory: '24 GB GDDR6X', computePower: '73.5', tags: ['gpu', 'ada'] },
  { id: 'rtx-5090', name: 'RTX 5090', vendor: 'nvidia', year: 2025, architecture: 'Blackwell', codename: 'GB202', transistors: '92B', clockSpeed: '2900 MHz', memory: '32 GB GDDR7', computePower: '100', tags: ['gpu', 'blackwell'] },
  { id: 'rtx-6090', name: 'RTX 6090', vendor: 'nvidia', year: 2028, architecture: 'Rubin', codename: 'RB202', transistors: '120B', clockSpeed: '3800 MHz', memory: '48 GB GDDR7', computePower: '150', tags: ['gpu', 'future'] },
]

// ===== MODULE 4: Math Utilities =====
export function parseTransistors(s: string): number {
  if (!s || s === 'TBA' || s === 'N/A') return 0
  const cleaned = s.replace(/,/g, '').trim()
  const match = cleaned.match(/^([\d.]+)\s*(T|B|M|K)?$/i)
  if (!match) return 0
  const val = parseFloat(match[1]!)
  const unit = (match[2] ?? '').toUpperCase()
  if (unit === 'T') return val * 1000
  if (unit === 'B') return val
  if (unit === 'M') return val / 1000
  if (unit === 'K') return val / 1e6
  return val / 1e9
}

export function parseClock(s: string): number {
  if (!s || s === 'TBA' || s === 'N/A') return 0
  const cleaned = s.trim()
  const mhz = cleaned.match(/^([\d.]+)\s*MHz/i)
  if (mhz) return parseFloat(mhz[1]!)
  const khz = cleaned.match(/^([\d.]+)\s*kHz/i)
  if (khz) return parseFloat(khz[1]!) / 1000
  const ghz = cleaned.match(/^([\d.]+)\s*GHz/i)
  if (ghz) return parseFloat(ghz[1]!) * 1000
  return 0
}

function parseCompute(s: string): number {
  if (!s || s === 'TBA' || s === 'N/A') return 0
  return parseFloat(s) || 0
}

export function flattenData(): DataPoint[] {
  return RAW_GPUS
    .map((g) => ({
      name: g.name,
      codename: g.codename,
      year: g.year,
      vendor: g.vendor,
      transistors: parseTransistors(g.transistors),
      clock: parseClock(g.clockSpeed),
      compute: parseCompute(g.computePower),
    }))
    .sort((a, b) => a.year - b.year)
}

const ALL_DATA = flattenData()

export function findClosestPoint(data: DataPoint[], xYear: number, threshold: number): DataPoint | null {
  if (data.length === 0) return null
  let closest: DataPoint | null = null
  let minDist = Infinity
  for (const d of data) {
    const dist = Math.abs(d.year - xYear)
    if (dist < minDist) {
      minDist = dist
      closest = d
    }
  }
  return minDist <= threshold ? closest : null
}

// ===== MODULE 5: Components =====
export class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(_error: Error, _info: ErrorInfo) {}
  handleRetry = () => this.setState({ hasError: false })
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 text-red-400 text-xl">!</div>
          <h2 className="text-lg font-semibold text-zinc-200 mb-2">Something went wrong</h2>
          <p className="text-sm text-zinc-500 mb-4">An unexpected error occurred</p>
          <button onClick={this.handleRetry} className="px-4 py-2 text-sm rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors">Try again</button>
        </div>
      )
    }
    return this.props.children
  }
}

const VENDOR_COLORS: Record<Vendor, string> = { nvidia: '#76B900', amd: '#ED1C24', intel: '#0071C5' }
const VENDOR_LABELS: Record<Vendor, string> = { nvidia: 'NVIDIA', amd: 'AMD', intel: 'Intel' }

export function GPUCard({ data }: { data: DataPoint }) {
  const metricMode = useStore((s) => s.metricMode)
  const metricValue = metricMode === 'transistors' ? data.transistors : metricMode === 'clock' ? data.clock : data.compute
  const metricUnit = metricMode === 'transistors' ? 'B transistors' : metricMode === 'clock' ? ' MHz' : ' TFLOPS'
  const color = VENDOR_COLORS[data.vendor]
  return (
    <article
      className="group relative rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6 transition-all duration-300 hover:scale-[1.02] hover:border-zinc-700/80 hover:shadow-lg hover:shadow-zinc-900/50"
      aria-label={`${VENDOR_LABELS[data.vendor]}: ${data.name} (${data.year})`}
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ boxShadow: `inset 0 0 0 1px ${color}22` }} />
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">{VENDOR_LABELS[data.vendor]}</span>
        <span className="text-[10px] text-zinc-600 ml-auto">{data.year}</span>
      </div>
      <h3 className="text-base font-semibold text-zinc-100 mb-1 group-hover:text-white transition-colors">{data.name}</h3>
      <p className="text-xs text-zinc-500 mb-4 font-mono">{data.codename}</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        <span className="text-zinc-600">Transistors</span>
        <span className="text-zinc-300 text-right font-mono">{data.transistors.toFixed(1)}B</span>
        <span className="text-zinc-600">Clock</span>
        <span className="text-zinc-300 text-right font-mono">{data.clock.toFixed(0)} MHz</span>
        <span className="text-zinc-600">Compute</span>
        <span className="text-zinc-300 text-right font-mono">{data.compute.toFixed(1)} TFLOPS</span>
      </div>
      <div className="mt-3 pt-3 border-t border-zinc-800/30 flex items-center justify-between">
        <span className="text-[10px] text-zinc-600">{metricUnit}</span>
        <span className="text-xs font-mono font-medium" style={{ color }}>{metricValue.toFixed(metricMode === 'transistors' ? 2 : metricMode === 'clock' ? 0 : 1)}</span>
      </div>
    </article>
  )
}

function Navbar() {
  const isGraphViewEnabled = useStore((s) => s.isGraphViewEnabled)
  const toggleGraphView = useStore((s) => s.toggleGraphView)
  return (
    <header className="sticky top-0 z-50 bg-[#0b0b0b]/80 backdrop-blur-xl border-b border-zinc-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 text-zinc-100 font-semibold text-sm tracking-tight">
          <svg className="w-5 h-5 text-[#76B900]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          Silicon Archive
        </a>
        <nav className="flex items-center gap-3">
          <button onClick={toggleGraphView} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all" aria-label={isGraphViewEnabled ? 'Show timeline' : 'Show graph view'}>
            <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isGraphViewEnabled ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            {isGraphViewEnabled ? 'Timeline' : 'Graph'}
          </button>
        </nav>
      </div>
    </header>
  )
}

function BentoGrid() {
  const data = ALL_DATA
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {data.map((d, i) => (
          <GPUCard key={`${d.vendor}-${d.name}-${i}`} data={d} />
        ))}
      </div>
    </div>
  )
}

// ===== MODULE 6: SVG Chart =====
const CHART_W = 1000
const CHART_H = 550
const PAD = { top: 40, right: 40, bottom: 60, left: 80 }
const PLOT_W = CHART_W - PAD.left - PAD.right
const PLOT_H = CHART_H - PAD.top - PAD.bottom

function formatMetricValue(v: number, mode: MetricMode): string {
  if (mode === 'transistors') return v >= 1000 ? `${(v / 1000).toFixed(1)}T` : `${v.toFixed(1)}B`
  if (mode === 'clock') return v >= 1000 ? `${(v / 1000).toFixed(2)} GHz` : `${v.toFixed(0)} MHz`
  return `${v.toFixed(1)} TFLOPS`
}

function GraphifyView() {
  const metricMode = useStore((s) => s.metricMode)
  const logScale = useStore((s) => s.logScale)
  const hoveredPoint = useStore((s) => s.hoveredPoint)
  const setHoveredPoint = useStore((s) => s.setHoveredPoint)

  const data = ALL_DATA
  const years = data.map((d) => d.year)
  const minYear = Math.min(...years) - 2
  const maxYear = Math.max(...years) + 2

  const getMetric = useCallback((d: DataPoint) => {
    const v = metricMode === 'transistors' ? d.transistors : metricMode === 'clock' ? d.clock : d.compute
    return logScale && metricMode === 'transistors' ? Math.log10(v * 1e9) : v
  }, [metricMode, logScale])

  const values = data.map(getMetric)
  const minVal = Math.min(...values) * 0.9
  const maxVal = Math.max(...values) * 1.1

  const toX = useCallback((year: number) => PAD.left + ((year - minYear) / (maxYear - minYear)) * PLOT_W, [minYear, maxYear])
  const toY = useCallback((v: number) => PAD.top + PLOT_H - ((v - minVal) / (maxVal - minVal)) * PLOT_H, [minVal, maxVal])

  const vendors: Vendor[] = ['nvidia', 'amd', 'intel']
  const vendorData = vendors.map((v) => data.filter((d) => d.vendor === v).sort((a, b) => a.year - b.year))

  const lines = vendorData.map((vd) => {
    if (vd.length < 2) return null
    return vd.map((d) => `${toX(d.year)},${toY(getMetric(d))}`).join(' ')
  })

  const yTicks = 6
  const yTickValues = Array.from({ length: yTicks }, (_, i) => minVal + ((maxVal - minVal) / (yTicks - 1)) * i)

  const xTicks = Math.min(15, maxYear - minYear)
  const xTickStep = Math.max(1, Math.floor((maxYear - minYear) / xTicks))
  const xTickValues = Array.from({ length: Math.floor((maxYear - minYear) / xTickStep) + 1 }, (_, i) => minYear + i * xTickStep)

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const mx = ((e.clientX - rect.left) / rect.width) * CHART_W
    // Find closest data point by x distance
    let closest: DataPoint | null = null
    let minDist = Infinity
    for (const d of data) {
      const dx = Math.abs(toX(d.year) - mx)
      if (dx < minDist) {
        minDist = dx
        closest = d
      }
    }
    const xDistThreshold = PLOT_W * 0.08
    setHoveredPoint(minDist <= xDistThreshold ? closest : null)
  }, [data, toX, setHoveredPoint])

  return (
    <div className="w-full h-full flex items-center justify-center p-4 sm:p-8">
      <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="w-full max-w-5xl h-auto" onMouseMove={handleMouseMove} onMouseLeave={() => setHoveredPoint(null)}>
        {/* Gridlines */}
        {yTickValues.map((v, i) => (
          <g key={`grid-${i}`}>
            <line x1={PAD.left} y1={toY(v)} x2={CHART_W - PAD.right} y2={toY(v)} stroke="#1a1a1a" strokeWidth={1} />
            <text x={PAD.left - 10} y={toY(v) + 4} textAnchor="end" fill="#666" fontSize={10} fontFamily="monospace">
              {logScale && metricMode === 'transistors'
                ? `10^${(v).toFixed(1)}`
                : formatMetricValue(v, metricMode)}
            </text>
          </g>
        ))}
        {xTickValues.map((y) => (
          <g key={`x-${y}`}>
            <text x={toX(y)} y={CHART_H - PAD.bottom + 20} textAnchor="middle" fill="#666" fontSize={10} fontFamily="monospace">{y}</text>
            <line x1={toX(y)} y1={PAD.top} x2={toX(y)} y2={CHART_H - PAD.bottom} stroke="#1a1a1a" strokeWidth={1} />
          </g>
        ))}

        {/* Axis labels */}
        <text x={CHART_W / 2} y={CHART_H - 5} textAnchor="middle" fill="#888" fontSize={11} fontFamily="sans-serif">Release Year</text>
        <text x={12} y={CHART_H / 2} textAnchor="middle" fill="#888" fontSize={11} fontFamily="sans-serif" transform={`rotate(-90, 12, ${CHART_H / 2})`}>
          {metricMode === 'transistors' ? 'Transistor Count' : metricMode === 'clock' ? 'Clock Speed' : 'Compute Power'}
        </text>

        {/* Data lines */}
        {lines.map((line, i) => {
          const v = vendors[i]
          return line && v ? (
            <path key={`line-${i}`} d={`M${line}`} fill="none" stroke={VENDOR_COLORS[v]} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" opacity={0.8} />
          ) : null
        })}

        {/* Data points */}
        {vendorData.map((vd, vi) => vd.map((d, di) => {
          const isHovered = hoveredPoint?.name === d.name && hoveredPoint?.year === d.year && hoveredPoint?.vendor === d.vendor
          return (
            <g key={`pt-${vi}-${di}`}>
              <circle cx={toX(d.year)} cy={toY(getMetric(d))} r={isHovered ? 7 : 4} fill={VENDOR_COLORS[d.vendor]} stroke="#0b0b0b" strokeWidth={isHovered ? 2 : 1.5} style={{ transition: 'r 0.15s ease, stroke-width 0.15s ease' }} />
              {isHovered && (
                <>
                  <line x1={toX(d.year)} y1={toY(getMetric(d))} x2={toX(d.year)} y2={CHART_H - PAD.bottom} stroke={VENDOR_COLORS[d.vendor]} strokeWidth={1} strokeDasharray="3,3" opacity={0.5} />
                  <line x1={toX(d.year)} y1={toY(getMetric(d))} x2={PAD.left} y2={toY(getMetric(d))} stroke={VENDOR_COLORS[d.vendor]} strokeWidth={1} strokeDasharray="3,3" opacity={0.5} />
                </>
              )}
            </g>
          )
        }))}

        {/* Legend */}
        {vendors.map((v, i) => (
          <g key={`legend-${v}`} transform={`translate(${CHART_W - PAD.right - 120}, ${PAD.top + i * 22})`}>
            <rect x={0} y={0} width={10} height={10} rx={2} fill={VENDOR_COLORS[v]} />
            <text x={16} y={9} fill="#999" fontSize={11} fontFamily="sans-serif">{VENDOR_LABELS[v]}</text>
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      {hoveredPoint && (
        <div
          className="fixed z-50 pointer-events-none bg-zinc-900/95 border border-zinc-700/50 rounded-xl px-4 py-3 shadow-2xl"
          style={{
            left: Math.min(Math.max(toX(hoveredPoint.year) / CHART_W * window.innerWidth + 16, 10), window.innerWidth - 240),
            top: Math.max(toY(getMetric(hoveredPoint)) / CHART_H * (window.innerHeight * 0.85) - 80, 10),
          }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: VENDOR_COLORS[hoveredPoint.vendor] }} />
            <span className="text-[10px] uppercase tracking-wider text-zinc-500">{VENDOR_LABELS[hoveredPoint.vendor]}</span>
            <span className="text-[10px] text-zinc-600 ml-auto">{hoveredPoint.year}</span>
          </div>
          <p className="text-sm font-semibold text-zinc-100 mb-1">{hoveredPoint.name}</p>
          <p className="text-xs text-zinc-500 font-mono mb-2">{hoveredPoint.codename}</p>
          <div className="text-xs text-zinc-400 space-y-0.5">
            <div className="flex justify-between gap-4"><span className="text-zinc-600">Transistors</span><span className="font-mono text-zinc-200">{hoveredPoint.transistors.toFixed(2)}B</span></div>
            <div className="flex justify-between gap-4"><span className="text-zinc-600">Clock</span><span className="font-mono text-zinc-200">{hoveredPoint.clock.toFixed(0)} MHz</span></div>
            <div className="flex justify-between gap-4"><span className="text-zinc-600">Compute</span><span className="font-mono text-zinc-200">{hoveredPoint.compute.toFixed(1)} TFLOPS</span></div>
          </div>
        </div>
      )}
    </div>
  )
}

// ===== MODULE 7: App =====
function Content() {
  const isGraphViewEnabled = useStore((s) => s.isGraphViewEnabled)
  const metricMode = useStore((s) => s.metricMode)
  const setMetricMode = useStore((s) => s.setMetricMode)
  const logScale = useStore((s) => s.logScale)
  const toggleLogScale = useStore((s) => s.toggleLogScale)

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-[#f5f5f5] antialiased">
      <Navbar />

      <div className={`transition-all duration-500 ease-in-out ${isGraphViewEnabled ? 'opacity-0 pointer-events-none absolute inset-0 scale-[0.97]' : 'opacity-100'}`}>
        <BentoGrid />
      </div>

      <div className={`fixed inset-0 z-40 transition-all duration-500 ease-in-out ${isGraphViewEnabled ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} style={{ top: '56px' }}>
        {/* Metric controls */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 rounded-full px-3 py-1.5">
          {(['transistors', 'clock', 'compute'] as MetricMode[]).map((mode) => (
            <button key={mode} onClick={() => setMetricMode(mode)} className={`text-[11px] px-2.5 py-1 rounded-full transition-all capitalize ${metricMode === mode ? 'bg-zinc-700 text-zinc-100 font-medium' : 'text-zinc-500 hover:text-zinc-300'}`}>
              {mode}
            </button>
          ))}
          <span className="w-px h-4 bg-zinc-800" />
          <button onClick={toggleLogScale} className={`text-[11px] px-2.5 py-1 rounded-full transition-all ${logScale ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}>
            Log
          </button>
        </div>
        <GraphifyView />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <Content />
    </ErrorBoundary>
  )
}
