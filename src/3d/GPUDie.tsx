import { useMemo, useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useBoundStore } from '../store/useBoundStore'
import { createIridescentMaterial } from './shaders/IridescentMaterial'

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

const OFF_COLOR_STR = '#0d2d0d'
const ON_COLOR_STR = '#76B900'
const IRIDESCENT_MAT = createIridescentMaterial(OFF_COLOR_STR, ON_COLOR_STR)
const OFF_COLOR = new THREE.Color(OFF_COLOR_STR)
const ON_COLOR = new THREE.Color(ON_COLOR_STR)

export default function GPUDie({ groupRef }: { groupRef: React.RefObject<THREE.Group | null> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const prevLit = useRef(new Float32Array(24).fill(-1))
  const tempColor = useMemo(() => new THREE.Color(), [])
  const prevScroll = useRef(0)
  const { pointer } = useThree()

  const smGeo = useMemo(() => new THREE.BoxGeometry(0.1, 0.04, 0.1), [])
  const wireGeo = useMemo(() => new THREE.BoxGeometry(0.18, 0.01, 0.01), [])

  const smPositions = useMemo(() => {
    const pos: [number, number, number][] = []
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 4; col++) {
        pos.push([(col - 1.5) * 0.3, 0.03, (row - 2.5) * 0.3])
      }
    }
    return pos
  }, [])

  useEffect(() => {
    if (!meshRef.current) return
    smPositions.forEach(([x, y, z], i) => {
      dummy.position.set(x, y, z)
      dummy.scale.set(1, 1, 1)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
      meshRef.current!.setColorAt(i, OFF_COLOR)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  }, [smPositions, dummy])

  useFrame((state) => {
    const s = useBoundStore.getState().transient.scrollProgress
    const totalSMs = smPositions.length
    const pulse = 0.7 + Math.sin(state.clock.elapsedTime * 3) * 0.3
    const prev = prevLit.current
    const mesh = meshRef.current
    if (!mesh) return

    const u = IRIDESCENT_MAT.uniforms
    u.uTime.value = state.clock.elapsedTime
    u.uScroll.value = s
    const velocity = Math.abs(s - prevScroll.current)
    prevScroll.current = s
    u.uDepth.value = Math.min(velocity * 10, 1)
    u.uMouse.value.set(pointer.x * 0.5 + 0.5, pointer.y * 0.5 + 0.5)

    for (let i = 0; i < totalSMs; i++) {
      const centerDist = Math.abs(i - Math.floor(totalSMs / 2)) / Math.floor(totalSMs / 2)
      const threshold = smoothstep(s, 0.1, 0.8)
      const waveDelay = centerDist * 0.15
      const lit = threshold > waveDelay ? 1 : 0

      if (prev[i] !== lit) {
        prev[i] = lit
        if (lit) {
          tempColor.copy(ON_COLOR).multiplyScalar(pulse)
          mesh.setColorAt(i, tempColor)
        } else {
          mesh.setColorAt(i, OFF_COLOR)
        }
      }
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh>
        <boxGeometry args={[1.8, 0.08, 1.6]} />
        <meshStandardMaterial color="#0a1a0a" metalness={0.6} roughness={0.4} />
      </mesh>

      <instancedMesh ref={meshRef} args={[smGeo, IRIDESCENT_MAT, smPositions.length]} />

      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 2]} />
        <meshBasicMaterial color="#76B900" transparent opacity={0.06} />
      </mesh>

      <Text position={[0, 0.06, 0.7]} fontSize={0.12} color="#ffffff" anchorX="center" anchorY="middle" fontWeight={700}>
        NVIDIA
      </Text>

      {[-0.85, 0.85].map((x, xi) => (
        <group key={xi} position={[x, 0, 0]}>
          {Array.from({ length: 8 }, (_, i) => {
            const z = -0.7 + i * 0.2
            return (
              <mesh key={i} position={[0, 0.02, z]} rotation={[0, 0, xi === 0 ? 0.3 : -0.3]}>
                <primitive object={wireGeo} />
                <meshBasicMaterial color="#d4a843" />
              </mesh>
            )
          })}
        </group>
      ))}
    </group>
  )
}
