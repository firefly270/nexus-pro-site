import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3, CatmullRomCurve3, BufferGeometry, BufferAttribute, Line, LineBasicMaterial } from 'three'

function rng(seed: number) {
  let s = seed
  return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff }
}

function generateTraces(count: number) {
  const rand = rng(42)
  const traces: Vector3[][] = []
  for (let i = 0; i < count; i++) {
    const points: Vector3[] = []
    const x = -1.5 + rand() * 3
    const z = -1.5 + rand() * 3
    points.push(new Vector3(x, 0, z))
    const segments = 3 + Math.floor(rand() * 4)
    for (let j = 1; j <= segments; j++) {
      const a = -1.5 + rand() * 3
      const b = -1.5 + rand() * 3
      points.push(new Vector3(a, 0.01, b))
    }
    traces.push(points)
  }
  return traces
}

export default function CircuitBoard({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  const geoRefs = useRef<BufferGeometry[]>([])

  const traces = useMemo(() => generateTraces(30), [])

  const activeTraces = useMemo(() => {
    const indicesSet = new Set<number>()
    const rand = rng(99)
    while (indicesSet.size < 8) {
      indicesSet.add(Math.floor(rand() * 30))
    }
    return Array.from(indicesSet).map(idx => ({
      idx,
      curvePts: new CatmullRomCurve3(traces[idx]!).getPoints(20),
    }))
  }, [traces])

  useFrame(() => {
    const s = scrollRef.current
    activeTraces.forEach((t, i) => {
      const geo = geoRefs.current[i]
      if (!geo) return
      const totalPts = t.curvePts.length
      const activePts = Math.max(2, Math.floor(totalPts * Math.min(s * 2, 1)))
      const posAttr = geo.attributes.position as BufferAttribute
      const positions = posAttr.array as Float32Array
      for (let j = 0; j < totalPts; j++) {
        const p = t.curvePts[Math.min(j, activePts - 1)]
        if (p) {
          positions[j * 3] = p.x
          positions[j * 3 + 1] = p.y
          positions[j * 3 + 2] = p.z
        }
      }
      posAttr.needsUpdate = true
    })
  })

  const inactiveLines = useMemo(() => traces.map(t =>
    new Line(
      new BufferGeometry().setFromPoints(new CatmullRomCurve3(t).getPoints(20)),
      new LineBasicMaterial({ color: '#1a3a1a', transparent: true, opacity: 0.3 })
    )
  ), [traces])

  const activeLines = useMemo(() => activeTraces.map((t) =>
    new Line(
      new BufferGeometry().setFromPoints(t.curvePts),
      new LineBasicMaterial({ color: '#76B900' }),
    )
  ), [activeTraces])

  useEffect(() => {
    activeLines.forEach((line, i) => {
      geoRefs.current[i] = line.geometry
    })
    return () => { geoRefs.current = [] }
  }, [activeLines])

  return (
    <group position={[0, -0.15, -0.5]}>
      {inactiveLines.map((line, i) => (
        <primitive key={`trace-${i}`} object={line} />
      ))}
      {activeLines.map((line, i) => (
        <primitive key={`active-${i}`} object={line} />
      ))}
    </group>
  )
}
