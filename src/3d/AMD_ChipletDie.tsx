import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function rng(seed: number) {
  let s = seed
  return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff }
}

const OFF_MAT = new THREE.MeshStandardMaterial({ color: '#1a0505', metalness: 0.3, roughness: 0.7 })
const ON_MAT = new THREE.MeshStandardMaterial({ color: '#ED1C24', emissive: '#ED1C24', emissiveIntensity: 1.2, metalness: 0.5, roughness: 0.3 })

export default function AMDChipletDie({ scrollRef, groupRef }: { scrollRef: React.RefObject<number>; groupRef: React.RefObject<THREE.Group | null> }) {
  const rand = useMemo(() => rng(42), [])

  const ccdPositions = useMemo(() => {
    const pos: [number, number, number][] = []
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 2; col++) {
        pos.push([-0.5 + col * 1.0, 0.03, -0.8 + row * 0.8])
      }
    }
    return pos
  }, [])

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
    const s = scrollRef.current ?? 0
    const pulse = 0.8 + Math.sin(state.clock.elapsedTime * 2.5) * 0.4
    ON_MAT.emissiveIntensity = pulse

    ccdPositions.forEach((_, i) => {
      const mesh = groupRef.current?.children[i] as THREE.Mesh | undefined
      if (!mesh) return
      mesh.material = i < s * ccdPositions.length ? ON_MAT : OFF_MAT

      if (mesh.material === ON_MAT) {
        const phase = Math.sin(state.clock.elapsedTime * 2 + i * 1.2) * 0.5 + 0.5
        mesh.position.y = 0.03 + phase * 0.015
      } else {
        mesh.position.y = 0.03
      }
    })

    ifLines.forEach((line, i) => {
      const mat = line.material as THREE.LineBasicMaterial
      const phase = Math.sin(state.clock.elapsedTime * 1.5 + i * 0.8) * 0.3 + 0.3
      mat.opacity = phase * s
    })
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* I/O Die center */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[1.2, 0.08, 0.6]} />
        <meshStandardMaterial color="#2a0808" metalness={0.5} roughness={0.4} />
      </mesh>

      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.8, 0.01, 0.4]} />
        <meshStandardMaterial color="#FF6900" emissive="#FF6900" emissiveIntensity={0.8} metalness={0.5} roughness={0.3} />
      </mesh>

      {/* CCD chiplets */}
      {ccdPositions.map((pos, i) => (
        <mesh key={i} position={pos} geometry={new THREE.BoxGeometry(0.5, 0.06, 0.4)} material={OFF_MAT} />
      ))}

      {/* IOD glow */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 1.5]} />
        <meshBasicMaterial color="#ED1C24" transparent opacity={0.06} />
      </mesh>

      {/* Infinity Fabric links */}
      {ifLines.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
    </group>
  )
}
