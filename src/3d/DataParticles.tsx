import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

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
    col[i * 3] = c.r
    col[i * 3 + 1] = c.g
    col[i * 3 + 2] = c.b
  }
  return col
}

export default function DataParticles({ scrollRef, count = 3000 }: { scrollRef: React.RefObject<number>; count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const { pointer, camera } = useThree()
  const mouseTarget = useRef(new THREE.Vector3())

  const [{ positions, phases }] = useState(() => makeParticles(count))
  const [colors] = useState(() => makeColors(count))

  useFrame((state) => {
    if (!ref.current) return
    const s = scrollRef.current
    const speed = 0.3 + s * 0.5
    const geo = ref.current.geometry
    const pos = geo.attributes.position as THREE.BufferAttribute
    const arr = pos.array as Float32Array
    const phArr = phases as Float32Array

    const mouse3D = new THREE.Vector3(pointer.x, pointer.y, 0.5).unproject(camera)
    const dir = mouse3D.sub(camera.position).normalize()
    const dist = -camera.position.z / dir.z
    mouseTarget.current.copy(camera.position).add(dir.multiplyScalar(dist))

    for (let i = 0; i < count; i++) {
      const idx = i * 3
      const angle = Math.atan2(arr[idx + 2]!, arr[idx]!) + speed * 0.01
      const radius = Math.sqrt(arr[idx]! * arr[idx]! + arr[idx + 2]! * arr[idx + 2]!)
      arr[idx] = Math.cos(angle) * radius
      arr[idx + 2] = Math.sin(angle) * radius
      const prevY = arr[idx + 1]!
      arr[idx + 1] = prevY + (Math.sin(state.clock.elapsedTime * 0.5 + phArr[i]!) - prevY) * 0.02

      const dx = mouseTarget.current.x - arr[idx]!
      const dy = mouseTarget.current.y - arr[idx + 1]!
      const dz = mouseTarget.current.z - arr[idx + 2]!
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
      if (d < 3) {
        const force = (1 - d / 3) * 0.008
        arr[idx]! += dx * force
        arr[idx + 1]! += dy * force * 0.5
        arr[idx + 2]! += dz * force
      }
    }
    pos.needsUpdate = true

    ref.current.position.z = s * 2
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
