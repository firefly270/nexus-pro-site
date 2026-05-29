import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, CatmullRomCurve3, Vector3, BufferGeometry, Line, LineBasicMaterial } from 'three'

function rng(seed: number) {
  let s = seed
  return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff }
}

const TRAYS = 6
const TRAY_HEIGHT = 0.18
const TRAY_GAP = 0.08
const TRAY_WIDTH = 1.2
const TRAY_DEPTH = 0.6

export default function NVLinkRack({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  const groupRef = useRef<Group>(null)

  const trayPositions = useMemo(() => {
    const pos: number[] = []
    const totalH = TRAYS * TRAY_HEIGHT + (TRAYS - 1) * TRAY_GAP
    for (let i = 0; i < TRAYS; i++) {
      const y = -totalH / 2 + i * (TRAY_HEIGHT + TRAY_GAP) + TRAY_HEIGHT / 2
      pos.push(y)
    }
    return pos
  }, [])

  const linkCurves = useMemo(() => {
    const rand = rng(77)
    const curves: CatmullRomCurve3[] = []

    for (let i = 0; i < TRAYS; i++) {
      for (let j = i + 1; j < TRAYS; j++) {
        if (rand() > 0.45) {
          curves.push(new CatmullRomCurve3([
            new Vector3(0.65, trayPositions[i]!, 0),
            new Vector3(0.80, (trayPositions[i]! + trayPositions[j]!) / 2, rand() * 0.2 - 0.1),
            new Vector3(0.65, trayPositions[j]!, 0),
          ]))
        }
        if (rand() > 0.45) {
          curves.push(new CatmullRomCurve3([
            new Vector3(-0.65, trayPositions[i]!, 0),
            new Vector3(-0.80, (trayPositions[i]! + trayPositions[j]!) / 2, rand() * 0.2 - 0.1),
            new Vector3(-0.65, trayPositions[j]!, 0),
          ]))
        }
      }
    }

    const switchY = trayPositions[trayPositions.length - 1]! + TRAY_HEIGHT / 2 + TRAY_GAP + 0.15
    for (let i = 0; i < TRAYS; i++) {
      curves.push(new CatmullRomCurve3([
        new Vector3(0, switchY + 0.1, 0),
        new Vector3(0, (switchY + trayPositions[i]!) / 2, 0),
        new Vector3(0, trayPositions[i]!, 0.35),
      ]))
    }
    return curves
  }, [trayPositions])

  const lineObjects = useMemo(() =>
    linkCurves.map((c, i) => {
      const geo = new BufferGeometry().setFromPoints(c.getPoints(16))
      return new Line(geo, new LineBasicMaterial({ color: '#76B900', transparent: true, opacity: 0.2 + (i % 3) * 0.1 }))
    }),
  [linkCurves])

  useFrame(() => {
    if (!groupRef.current) return
    const s = scrollRef.current
    const appear = Math.max(0, Math.min(1, (s - 0.65) / 0.15))
    groupRef.current.scale.setScalar(appear)
    groupRef.current.position.y = Math.sin(s * Math.PI) * 0.1
  })

  const totalH = TRAYS * TRAY_HEIGHT + (TRAYS - 1) * TRAY_GAP
  const switchY = trayPositions[trayPositions.length - 1]! + TRAY_HEIGHT / 2 + TRAY_GAP + 0.15

  return (
    <group ref={groupRef} position={[2.5, 0.2, -2]} scale={0}>
      {/* Rack frame */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[TRAY_WIDTH + 0.2, totalH + 0.15, TRAY_DEPTH + 0.15]} />
        <meshBasicMaterial color="#0a1a0a" transparent opacity={0.3} wireframe />
      </mesh>

      {/* Compute trays */}
      {trayPositions.map((y, i) => (
        <group key={`tray-${i}`} position={[0, y, 0]}>
          <mesh>
            <boxGeometry args={[TRAY_WIDTH, TRAY_HEIGHT, TRAY_DEPTH]} />
            <meshStandardMaterial color="#0d2d0d" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.01, 0]}>
            <boxGeometry args={[TRAY_WIDTH * 0.7, 0.02, TRAY_DEPTH * 0.7]} />
            <meshBasicMaterial color="#76B900" transparent opacity={0.08 + i * 0.02} />
          </mesh>
          <mesh position={[-TRAY_WIDTH / 2 + 0.08, 0, 0]}>
            <boxGeometry args={[0.04, 0.02, TRAY_DEPTH * 0.3]} />
            <meshBasicMaterial color="#00D4AA" transparent opacity={0.15} />
          </mesh>
        </group>
      ))}

      {/* Switch tray on top */}
      <mesh position={[0, switchY, 0]}>
        <boxGeometry args={[TRAY_WIDTH * 0.6, 0.1, TRAY_DEPTH * 0.5]} />
        <meshStandardMaterial color="#00D4AA" metalness={0.8} roughness={0.2} transparent opacity={0.6} />
      </mesh>

      {/* NVLink connection lines */}
      {lineObjects.map((line, i) => (
        <primitive key={`link-${i}`} object={line} />
      ))}
    </group>
  )
}