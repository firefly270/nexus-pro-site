import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, LineSegments, LineBasicMaterial, BufferGeometry, Float32BufferAttribute, DoubleSide } from 'three'

export default function SiliconWafer({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  const groupRef = useRef<Group>(null)
  const lineRef = useRef<LineSegments>(null)

  useFrame(() => {
    if (!groupRef.current) return
    const s = scrollRef.current
    const appear = Math.max(0, Math.min(1, (s - 0.35) / 0.2))
    const fadeOut = Math.max(0, Math.min(1, (s - 0.8) / 0.1))
    const opacity = appear * (1 - fadeOut)
    groupRef.current.scale.setScalar(appear)
    groupRef.current.rotation.x = Math.sin(s * Math.PI) * 0.15
    groupRef.current.rotation.z = s * 0.3
    if (lineRef.current) {
      const mat = lineRef.current.material as LineBasicMaterial
      mat.opacity = opacity * 0.3
    }
  })

  const gridLines = useMemo(() => {
    const geometry = new BufferGeometry()
    const positions: number[] = []
    const segments = 30
    const gap = 0.15
    const dieSize = 0.08
    for (let r = 0; r < segments; r++) {
      for (let c = 0; c < segments; c++) {
        const x = -segments * gap / 2 + c * gap
        const z = -segments * gap / 2 + r * gap
        positions.push(x, 0, z, x + dieSize, 0, z)
        positions.push(x + dieSize, 0, z, x + dieSize, 0, z + dieSize)
        positions.push(x + dieSize, 0, z + dieSize, x, 0, z + dieSize)
        positions.push(x, 0, z + dieSize, x, 0, z)
      }
    }
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    return geometry
  }, [])

  return (
    <group ref={groupRef} position={[0, 0, -3]} scale={0}>
      <mesh>
        <circleGeometry args={[3.5, 64]} />
        <meshBasicMaterial color="#0a2a0a" transparent opacity={0.2} side={DoubleSide} />
      </mesh>
      <lineSegments ref={lineRef} geometry={gridLines}>
        <lineBasicMaterial color="#1a4a1a" transparent opacity={0} />
      </lineSegments>
      <mesh position={[0, 0, 0.01]}>
        <ringGeometry args={[0.5, 3.5, 64]} />
        <meshBasicMaterial color="#0d2d0d" transparent opacity={0.1} side={DoubleSide} />
      </mesh>
    </group>
  )
}
