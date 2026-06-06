import { describe, it, expect } from 'vitest'
import { parseTransistors, parseClock, flattenData, findClosestPoint } from '../../utils/dataPipeline'
import type { DataPoint } from '../../utils/dataPipeline'

describe('parseTransistors', () => {
  it('parses billions (B) correctly', () => {
    expect(parseTransistors('18.6B')).toBeCloseTo(18.6, 3)
    expect(parseTransistors('76.3B')).toBeCloseTo(76.3, 3)
    expect(parseTransistors('1.4B')).toBeCloseTo(1.4, 3)
    expect(parseTransistors('240B')).toBeCloseTo(240, 3)
  })

  it('parses millions (M) correctly', () => {
    expect(parseTransistors('57M')).toBeCloseTo(0.057, 6)
    expect(parseTransistors('222M')).toBeCloseTo(0.222, 6)
    expect(parseTransistors('1M')).toBeCloseTo(0.001, 6)
    expect(parseTransistors('107M')).toBeCloseTo(0.107, 6)
  })

  it('parses thousands (K) correctly', () => {
    expect(parseTransistors('29K')).toBeCloseTo(0.000029, 9)
    expect(parseTransistors('275K')).toBeCloseTo(0.000275, 9)
  })

  it('parses raw numbers as transistor counts (2,300 -> 2.3e-6)', () => {
    expect(parseTransistors('2,300')).toBeCloseTo(0.0000023, 10)
    expect(parseTransistors('1.2M')).toBeCloseTo(0.0012, 7)
  })

  it('returns 0 for empty strings', () => {
    expect(parseTransistors('')).toBe(0)
    expect(parseTransistors('TBA')).toBe(0)
  })
})

describe('parseClock', () => {
  it('parses MHz values correctly', () => {
    expect(parseClock('1350 MHz')).toBeCloseTo(1350, 0)
    expect(parseClock('2235 MHz')).toBeCloseTo(2235, 0)
    expect(parseClock('12 MHz')).toBeCloseTo(12, 0)
    expect(parseClock('2400 MHz')).toBeCloseTo(2400, 0)
  })

  it('converts kHz to MHz correctly', () => {
    expect(parseClock('740 kHz')).toBeCloseTo(0.74, 2)
    expect(parseClock('500 kHz')).toBeCloseTo(0.5, 2)
  })

  it('returns 0 for unparseable values', () => {
    expect(parseClock('TBA')).toBe(0)
    expect(parseClock('')).toBe(0)
  })
})

describe('flattenData', () => {
  it('combines all three vendor datasets into one array', () => {
    const data = flattenData()
    expect(data.length).toBeGreaterThan(10)
    expect(data.some((d) => d.vendor === 'nvidia')).toBe(true)
    expect(data.some((d) => d.vendor === 'amd')).toBe(true)
    expect(data.some((d) => d.vendor === 'intel')).toBe(true)
  })

  it('sorts chronologically by year', () => {
    const data = flattenData()
    for (let i = 1; i < data.length; i++) {
      expect(data[i].year).toBeGreaterThanOrEqual(data[i - 1].year)
    }
  })

  it('starts with Intel 4004 (1971) as the earliest entry', () => {
    const data = flattenData()
    expect(data[0].name).toBe('Intel 4004')
    expect(data[0].year).toBe(1971)
    expect(data[0].vendor).toBe('intel')
  })

  it('ends with a modern GPU entry (2028 Feynman or 2027 Rubin)', () => {
    const data = flattenData()
    const last = data[data.length - 1]
    expect(last.year).toBeGreaterThanOrEqual(2027)
  })
})

describe('findClosestPoint', () => {
  const samples: DataPoint[] = [
    { name: 'A', codename: 'A1', year: 2000, vendor: 'nvidia', transistors: 0.1, clock: 100, compute: 10 },
    { name: 'B', codename: 'B1', year: 2005, vendor: 'nvidia', transistors: 0.5, clock: 200, compute: 20 },
    { name: 'C', codename: 'C1', year: 2010, vendor: 'nvidia', transistors: 1, clock: 300, compute: 30 },
  ]

  it('finds the closest point by year', () => {
    const result = findClosestPoint(samples, 2004, 10)
    expect(result).not.toBeNull()
    expect(result!.name).toBe('B')
  })

  it('returns null when no point is within threshold', () => {
    const result = findClosestPoint(samples, 1990, 5)
    expect(result).toBeNull()
  })

  it('handles exact year matches', () => {
    const result = findClosestPoint(samples, 2005, 1)
    expect(result).not.toBeNull()
    expect(result!.name).toBe('B')
  })

  it('handles negative xYear values (before earliest data)', () => {
    const result = findClosestPoint(samples, 1800, 500)
    expect(result).not.toBeNull()
    expect(result!.name).toBe('A')
  })

  it('handles xYear values beyond the latest data', () => {
    const result = findClosestPoint(samples, 2050, 100)
    expect(result).not.toBeNull()
    expect(result!.name).toBe('C')
  })

  it('returns null for empty array', () => {
    const result = findClosestPoint([], 2000, 10)
    expect(result).toBeNull()
  })
})
