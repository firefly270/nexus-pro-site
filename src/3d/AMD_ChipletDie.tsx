import { useMemo, useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useBoundStore } from '../store/useBoundStore'
import { createIridescentMaterial } from './shaders/IridescentMaterial'

function rng(seed: number) {
  let s = seed
  return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff }
}

const OFF_COLOR_STR = '#1a0505'
const ON_COLOR_STR = '#ED1C24'
const IRIDESCENT_MAT = createIridescentMaterial(OFF_COLOR_STR, ON_COLOR_STR)
const OFF_COLOR = new THREE.Color(OFF_COLOR_STR)
const ON_COLOR = new THREE.Color(ON_COLOR_STR)

export default function AMDChipletDie({ groupRef }: { groupRef: React.RefObject<THREE.Group | null> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const rand = useMemo(() => rng(42), [])
  const prevLit = useRef(new Float32Array(6).fill(-1))
  const { pointer } = useThree()

  const ccdGeo = useMemo(() => new THREE.BoxGeometry(0.5, 0.06, 0.4), [])

  const ccdPositions = useMemo(() => {
    const pos: [number, number, number][] = []
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 2; col++) {
        pos.push([-0.5 + col * 1.0, 0.03, -0.8 + row * 0.8])
      }
    }
    return pos
  }, [])

  useEffect(() => {
    if (!meshRef.current) return
    ccdPositions.forEach(([x, y, z], i) => {
      dummy.position.set(x, y, z)
      dummy.scale.set(1, 1, 1)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
      meshRef.current!.setColorAt(i, OFF_COLOR)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  }, [ccdPositions, dummy])

  const ifLines = useMemo(() => {
    const lines: THREE.Line[] = []
    const iodCenters: [number, number][] = [[-0.5, 0.0], [0.5, 0.0]]
    const mat = new THREE.LineBasicMaterial({ color: '#ED1C24', transparent: true, opacity: 0.3 })

    ccdPositions.forEach((ccd, i) => {
      let bestDist = Infinity
      let bestIod: [number, number] = iodCenters[0]!
      iodCenters.forEach((iod) => {
        const dist = Math.sqrt((ccd[0] - iod[0]) ** 2 + (ccd[2] - iod[1]) ** 2)
        if (dist < bestDist) { bestDist = dist; bestIod = iod }
      })
      const a = new THREE.Vector3(ccd[0], 0.02, ccd[2])
      const b = new THREE.Vector3(bestIod[0], 0.02, bestIod[1])
      const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5)
      mid.y = 0.05 + Math.sin(i * 1.5 + rand() * 2) * 0.03
      const curve = new THREE.CatmullRomCurve3([a, mid, b])
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(12))
      lines.push(new THREE.Line(geo, mat))
    })
    return lines
  }, [ccdPositions, rand])

  useFrame((state) => {
    const s = useBoundStore.getState().transient.scrollProgress
    const prev = prevLit.current
    const mesh = meshRef.current
    if (!mesh) return

    const u = IRIDESCENT_MAT.uniforms
    u.uTime.value = state.clock.elapsedTime
    u.uScroll.value = s
    u.uMouse.value.set(pointer.x * 0.5 + 0.5, pointer.y * 0.5 + 0.5)

    ccdPositions.forEach((_, i) => {
      const isOn = i < s * ccdPositions.length ? 1 : 0
      if (prev[i] !== isOn) {
        prev[i] = isOn
        mesh.setColorAt(i, isOn ? ON_COLOR : OFF_COLOR)
      }
    })
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true

    ifLines.forEach((line, i) => {
      const mat = line.material as THREE.LineBasicMaterial
      const phase = Math.sin(state.clock.elapsedTime * 1.5 + i * 0.8) * 0.3 + 0.3
      mat.opacity = phase * s
    })
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[1.2, 0.08, 0.6]} />
        <meshStandardMaterial color="#2a0808" metalness={0.5} roughness={0.4} />
      </mesh>

      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.8, 0.01, 0.4]} />
        <meshStandardMaterial color="#FF6900" emissive="#FF6900" emissiveIntensity={0.8} metalness={0.5} roughness={0.3} />
      </mesh>

      <instancedMesh ref={meshRef} args={[ccdGeo, IRIDESCENT_MAT, ccdPositions.length]} />

      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 1.5]} />
        <meshBasicMaterial color="#ED1C24" transparent opacity={0.06} />
      </mesh>

      {ifLines.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
    </group>
  )
}
