import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { getVelocityBufferRef } from './FluidSimulation'

function rng(seed: number) {
  let s = seed
  return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff }
}

function makeParticles(count: number) {
  const rand = rng(123)
  const pos = new Float32Array(count * 3)
  const ph = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    const angle = rand() * Math.PI * 2
    const radius = 0.5 + rand() * 4
    pos[i * 3] = Math.cos(angle) * radius
    pos[i * 3 + 1] = (rand() - 0.5) * 1.5
    pos[i * 3 + 2] = Math.sin(angle) * radius
    ph[i] = rand() * Math.PI * 2
  }
  return { positions: pos, phases: ph }
}

function makeColors(count: number) {
  const rand = rng(456)
  const col = new Float32Array(count * 3)
  const green = new THREE.Color('#76B900')
  const cyan = new THREE.Color('#00D4AA')
  for (let i = 0; i < count; i++) {
    const t = rand()
    const c = green.clone().lerp(cyan, t)
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
  }
  return col
}

export default function DataParticles({ scrollRef, count = 3000 }: { scrollRef: React.RefObject<number>; count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const frameSkip = useRef(0)
  const isMobile = typeof navigator !== 'undefined' && navigator.hardwareConcurrency < 4
  const skipEvery = isMobile ? 3 : 1

  const { positions, phases } = useMemo(() => makeParticles(count), [count])
  const [colors] = useState(() => makeColors(count))

  useFrame((state) => {
    const el = ref.current
    if (!el) return
    el.position.z = scrollRef.current! * 2

    frameSkip.current = (frameSkip.current + 1) % skipEvery
    if (frameSkip.current !== 0) return

    const s = scrollRef.current!
    const speed = 0.3 + s * 0.5
    const geo = el.geometry
    const attr = geo.attributes.position as THREE.BufferAttribute
    const arr = attr.array as Float32Array
    const phArr = phases as Float32Array
    const velBuf = getVelocityBufferRef()

    for (let i = 0; i < count!; i++) {
      const idx = i * 3
      const angle = Math.atan2(arr[idx + 2]!, arr[idx]!) + speed * 0.01
      const radius = Math.sqrt(arr[idx]! * arr[idx]! + arr[idx + 2]! * arr[idx + 2]!)
      arr[idx] = Math.cos(angle) * radius
      arr[idx + 2] = Math.sin(angle) * radius
      arr[idx + 1] = arr[idx + 1]! + (Math.sin(state.clock.elapsedTime * 0.5 + phArr[i]!) - arr[idx + 1]!) * 0.02

      if (velBuf) {
        const ux = (arr[idx]! * 0.05 + 0.5) * 128
        const uy = (arr[idx + 2]! * 0.05 + 0.5) * 128
        const fi = (Math.floor(uy) * 128 + Math.floor(ux)) * 4
        if (fi >= 0 && fi + 2 < velBuf!.length) {
          arr[idx] = arr[idx]! + velBuf[fi]! * 0.002
          arr[idx + 2] = arr[idx + 2]! + velBuf[fi + 1]! * 0.002
        }
      }
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.7} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  )
}
