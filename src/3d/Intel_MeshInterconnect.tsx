import { useMemo, useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useBoundStore } from '../store/useBoundStore'
import { createIridescentMaterial } from './shaders/IridescentMaterial'

const OFF_COLOR_STR = '#0a0a1a'
const ON_COLOR_STR = '#0071C5'
const IRIDESCENT_MAT = createIridescentMaterial(OFF_COLOR_STR, ON_COLOR_STR)
const OFF_COLOR = new THREE.Color(OFF_COLOR_STR)
const ON_COLOR = new THREE.Color(ON_COLOR_STR)

export default function IntelMeshInterconnect({ groupRef }: { groupRef: React.RefObject<THREE.Group | null> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const lineRefs = useRef<(THREE.LineSegments | null)[]>([])
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const prevActive = useRef(new Float32Array(25).fill(-1))
  const tempColor = useMemo(() => new THREE.Color(), [])
  const { pointer } = useThree()
  const prevScroll = useRef(0)

  const gridSize = 5
  const spacing = 0.35
  const tileGeo = useMemo(() => new THREE.BoxGeometry(0.15, 0.04, 0.15), [])

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

  useEffect(() => {
    if (!meshRef.current) return
    tilePositions.forEach(([x, z], i) => {
      dummy.position.set(x, 0.03, z)
      dummy.scale.set(1, 1, 1)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
      meshRef.current!.setColorAt(i, OFF_COLOR)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  }, [tilePositions, dummy])

  useFrame((state) => {
    const s = useBoundStore.getState().transient.scrollProgress
    const activeCount = Math.floor(s * tilePositions.length)
    const wave = Math.sin(state.clock.elapsedTime * 2) * 0.5 + 0.5
    const prev = prevActive.current
    const mesh = meshRef.current
    if (!mesh) return

    const u = IRIDESCENT_MAT.uniforms
    u.uTime.value = state.clock.elapsedTime
    u.uScroll.value = s
    const velocity = Math.abs(s - prevScroll.current)
    prevScroll.current = s
    u.uDepth.value = Math.min(velocity * 10, 1)
    u.uMouse.value.set(pointer.x * 0.5 + 0.5, pointer.y * 0.5 + 0.5)

    tilePositions.forEach((_, i) => {
      const isOn = i < activeCount ? 1 : 0
      if (prev[i] !== isOn) {
        prev[i] = isOn
        if (isOn) {
          tempColor.copy(ON_COLOR).lerp(new THREE.Color('#ffffff'), wave * 0.2)
          mesh.setColorAt(i, tempColor)
        } else {
          mesh.setColorAt(i, OFF_COLOR)
        }
      }
      if (isOn) {
        const row = Math.floor(i / gridSize)
        const col = i % gridSize
        const dataPhase = Math.sin(state.clock.elapsedTime * 3 + (row + col) * 0.7) * 0.5 + 0.5
        dummy.position.set(
          tilePositions[i]![0],
          0.03 + dataPhase * 0.012,
          tilePositions[i]![1],
        )
        dummy.scale.set(1, 1, 1)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
      }
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true

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
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <ringGeometry args={[spacing * 2.5, spacing * 2.7, 64]} />
        <meshBasicMaterial color="#0071C5" transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>

      <instancedMesh ref={meshRef} args={[tileGeo, IRIDESCENT_MAT, tilePositions.length]} />

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
