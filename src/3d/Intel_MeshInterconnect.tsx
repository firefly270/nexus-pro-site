import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const OFF_TILE = new THREE.MeshStandardMaterial({ color: '#0a0a1a', metalness: 0.3, roughness: 0.7 })
const ON_TILE = new THREE.MeshStandardMaterial({ color: '#0071C5', emissive: '#0071C5', emissiveIntensity: 0.8, metalness: 0.5, roughness: 0.3 })

export default function IntelMeshInterconnect({ scrollRef, groupRef }: { scrollRef: React.RefObject<number>; groupRef: React.RefObject<THREE.Group | null> }) {
  const lineRefs = useRef<(THREE.LineSegments | null)[]>([])

  const gridSize = 5
  const spacing = 0.35

  const { tilePositions, meshLines } = useMemo(() => {
    const tiles: [number, number][] = []
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        tiles.push([(c - Math.floor(gridSize / 2)) * spacing, (r - Math.floor(gridSize / 2)) * spacing])
      }
    }

    const lines: { start: [number, number]; end: [number, number] }[] = []
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (c < gridSize - 1) lines.push({ start: tiles[r * gridSize + c]!, end: tiles[r * gridSize + c + 1]! })
        if (r < gridSize - 1) lines.push({ start: tiles[r * gridSize + c]!, end: tiles[(r + 1) * gridSize + c]! })
      }
    }

    return { tilePositions: tiles, meshLines: lines }
  }, [])

  useFrame((state) => {
    const s = scrollRef.current
    const activeCount = Math.floor(s * tilePositions.length)
    const wave = Math.sin(state.clock.elapsedTime * 2) * 0.5 + 0.5

    ON_TILE.emissiveIntensity = 0.5 + wave * 0.6

    tilePositions.forEach((_, i) => {
      const mesh = groupRef.current?.children[i] as THREE.Mesh | undefined
      if (!mesh) return
      mesh.material = i < activeCount ? ON_TILE : OFF_TILE

      if (mesh.material === ON_TILE) {
        const row = Math.floor(i / gridSize)
        const col = i % gridSize
        const dataPhase = Math.sin(state.clock.elapsedTime * 3 + (row + col) * 0.7) * 0.5 + 0.5
        mesh.position.y = 0.03 + dataPhase * 0.012
      } else {
        mesh.position.y = 0.03
      }
    })

    lineRefs.current.forEach((line, i) => {
      if (!line) return
      const mat = line.material as THREE.LineBasicMaterial
      const idxProgress = s * meshLines.length
      const baseOpacity = i < idxProgress ? 0.4 : 0.04
      const dataPulse = Math.sin(state.clock.elapsedTime * 4 + i * 0.3) * 0.5 + 0.5
      mat.opacity = baseOpacity + dataPulse * 0.15 * s
    })
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Ring bus circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <ringGeometry args={[spacing * 2.5, spacing * 2.7, 64]} />
        <meshBasicMaterial color="#0071C5" transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>

      {/* Tiles */}
      {tilePositions.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.03, z]} geometry={new THREE.BoxGeometry(0.15, 0.04, 0.15)} material={OFF_TILE} />
      ))}

      {/* Mesh interconnect lines */}
      {meshLines.map((line, i) => {
        const pts = [
          new THREE.Vector3(line.start[0], 0.02, line.start[1]),
          new THREE.Vector3(line.end[0], 0.02, line.end[1]),
        ]
        const geo = new THREE.BufferGeometry().setFromPoints(pts)
        return (
          <lineSegments
            key={i}
            ref={(el) => { lineRefs.current[i] = el }}
            geometry={geo}
          >
            <lineBasicMaterial color="#0071C5" transparent opacity={0.04} />
          </lineSegments>
        )
      })}
    </group>
  )
}
