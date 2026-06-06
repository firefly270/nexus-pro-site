import { gpus } from '../constants/gpus'
import { amdCards } from '../constants/amd'
import { intelCards } from '../constants/intel'
import type { GPUCardData, CardData } from '../types'

export interface DataPoint {
  name: string
  codename: string
  year: number
  vendor: 'nvidia' | 'amd' | 'intel'
  transistors: number
  clock: number
  compute: number
}

export function parseTransistors(s: string): number {
  const clean = s.replace(/,/g, '')
  if (clean.endsWith('B')) return Number.parseFloat(clean) || 0
  if (clean.endsWith('M')) return (Number.parseFloat(clean) || 0) / 1000
  if (clean.endsWith('K')) return (Number.parseFloat(clean) || 0) / 1_000_000
  const n = Number.parseFloat(clean)
  return n ? n / 1_000_000_000 : 0
}

export function parseClock(s: string): number {
  const n = Number.parseFloat(s)
  if (s.includes('kHz')) return n / 1000
  return Number.isFinite(n) ? n : 0
}

export function parseCompute(card: CardData): number {
  if (card.variant === 'cpu') return Number.parseInt((card as any).cores) || 0
  const g = card as GPUCardData
  if (g.cudaCores && g.cudaCores !== 'N/A') return Number.parseInt(g.cudaCores) || 0
  return 0
}

function normalizeVendor(key: string): 'nvidia' | 'amd' | 'intel' {
  if (key === 'ch01' || key === 'ch02' || key === 'ch03' || key === 'ch04' || key === 'ch05' || key === 'ch06' || key === 'ch06b' || key === 'ch07' || key === 'ch08') return 'nvidia'
  if (key.startsWith('ch-amd-')) return 'amd'
  if (key.startsWith('ch-intel-')) return 'intel'
  return 'nvidia'
}

export function flattenData(): DataPoint[] {
  const points: DataPoint[] = []
  for (const [key, cards] of Object.entries(gpus)) {
    const vendor = normalizeVendor(key)
    for (const c of cards) {
      points.push({ name: c.name, codename: c.codename, year: Number.parseInt(c.year) || 0, vendor, transistors: parseTransistors(c.transistors), clock: parseClock(c.clock), compute: parseCompute(c) })
    }
  }
  for (const [key, cards] of Object.entries(amdCards)) {
    const vendor = normalizeVendor(key)
    for (const c of cards) {
      points.push({ name: c.name, codename: c.codename, year: Number.parseInt(c.year) || 0, vendor, transistors: parseTransistors(c.transistors), clock: parseClock(c.clock), compute: parseCompute(c) })
    }
  }
  for (const [key, cards] of Object.entries(intelCards)) {
    const vendor = normalizeVendor(key)
    for (const c of cards) {
      points.push({ name: c.name, codename: c.codename, year: Number.parseInt(c.year) || 0, vendor, transistors: parseTransistors(c.transistors), clock: parseClock(c.clock), compute: parseCompute(c) })
    }
  }
  return points.sort((a, b) => a.year - b.year)
}

export function findClosestPoint(points: DataPoint[], xYear: number, threshold: number): DataPoint | null {
  let closest: DataPoint | null = null
  let closestDist = Infinity
  for (const p of points) {
    const dist = Math.abs(p.year - xYear)
    if (dist < closestDist) { closestDist = dist; closest = p }
  }
  if (closest && closestDist < threshold) return closest
  return null
}

export function roundUp(v: number, p: number): number {
  return Math.ceil(v / p) * p
}

export function logTickValues(vMax: number, vMin: number) {
  const minExp = Math.floor(Math.log10(Math.max(vMin, 1e-10)))
  const maxExp = Math.ceil(Math.log10(vMax))
  const ticks: number[] = []
  const labels: string[] = []
  for (let e = minExp; e <= maxExp; e++) {
    const v = 10 ** e
    ticks.push(v)
    if (v >= 1) labels.push(`${v}B`)
    else if (v >= 0.001) labels.push(`${Math.round(v * 1000)}M`)
    else if (v >= 0.000001) labels.push(`${Math.round(v * 1_000_000)}K`)
    else labels.push(`${(v * 1_000_000_000).toFixed(0)}`)
  }
  return { ticks, labels }
}
