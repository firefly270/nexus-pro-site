import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

const OFF_MAT = new THREE.MeshStandardMaterial({ color: '#0d2d0d', metalness: 0.3, roughness: 0.7 })
const ON_MAT = new THREE.MeshStandardMaterial({ color: '#76B900', emissive: '#76B900', emissiveIntensity: 1.2, metalness: 0.5, roughness: 0.3 })

export default function GPUDie({ scrollRef, groupRef }: { scrollRef: React.RefObject<number>; groupRef: React.RefObject<THREE.Group | null> }) {
  const smRefs = useRef<(THREE.Mesh | null)[]>([])

  const smPositions = useMemo(() => {
    const pos: [number, number, number][] = []
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 4; col++) {
        const x = (col - 1.5) * 0.3
        const z = (row - 2.5) * 0.3
        pos.push([x, 0.03, z])
      }
    }
    return pos
  }, [])

  useFrame((state) => {
    const s = scrollRef.current
    const totalSMs = smPositions.length
    const pulse = 0.8 + Math.sin(state.clock.elapsedTime * 3) * 0.4

    ON_MAT.emissiveIntensity = pulse

    for (let i = 0; i < totalSMs; i++) {
      const mesh = smRefs.current[i]
      if (!mesh) continue

      const centerDist = Math.abs(i - Math.floor(totalSMs / 2)) / Math.floor(totalSMs / 2)
      const threshold = smoothstep(s, 0.1, 0.8)
      const waveDelay = centerDist * 0.15
      const lit = threshold > waveDelay

      if (lit) {
        mesh.material = ON_MAT
      } else {
        mesh.material = OFF_MAT
      }
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Die substrate */}
      <mesh>
        <boxGeometry args={[1.8, 0.08, 1.6]} />
        <meshStandardMaterial color="#0a1a0a" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* SM units */}
      {smPositions.map((pos, i) => (
        <mesh
          key={i}
          ref={(el) => { smRefs.current[i] = el }}
          position={pos}
          geometry={new THREE.BoxGeometry(0.1, 0.04, 0.1)}
          material={OFF_MAT}
        />
      ))}

      {/* Glow plane under die */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 2]} />
        <meshBasicMaterial color="#76B900" transparent opacity={0.06} />
      </mesh>

      {/* NVIDIA text */}
      <Text position={[0, 0.06, 0.7]} fontSize={0.12} color="#ffffff" anchorX="center" anchorY="middle" fontWeight={700}>
        NVIDIA
      </Text>

      {/* Wire bonds */}
      {[-0.85, 0.85].map((x, xi) => (
        <group key={xi} position={[x, 0, 0]}>
          {Array.from({ length: 8 }, (_, i) => {
            const z = -0.7 + i * 0.2
            return (
              <mesh key={i} position={[0, 0.02, z]} rotation={[0, 0, xi === 0 ? 0.3 : -0.3]}>
                <boxGeometry args={[0.18, 0.01, 0.01]} />
                <meshBasicMaterial color="#d4a843" />
              </mesh>
            )
          })}
        </group>
      ))}
    </group>
  )
}
