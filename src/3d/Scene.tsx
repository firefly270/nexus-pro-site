import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { useVendor } from '../context/VendorContext'
import { usePageVisible } from '../hooks/usePageVisible'
import GPUDie from './GPUDie'
import CircuitBoard from './CircuitBoard'
import DataParticles from './DataParticles'
import TechBackground from './TechBackground'
import SiliconWafer from './SiliconWafer'
import NVLinkRack from './NVLinkRack'
import AMDChipletDie from './AMD_ChipletDie'
import IntelMeshInterconnect from './Intel_MeshInterconnect'

gsap.registerPlugin(ScrollTrigger)
gsap.ticker.lagSmoothing(0)

const NVIDIA_KEYFRAMES = [
  { t: 0, x: 0, y: 0.5, z: 8, tx: 0, ty: 0, tz: 0 },
  { t: 0.08, x: 4, y: 1.5, z: 3, tx: 0, ty: 0.2, tz: 0 },
  { t: 0.2, x: -3, y: 0.8, z: 2.5, tx: 0, ty: 0, tz: 0 },
  { t: 0.35, x: 0, y: -0.5, z: 5, tx: 0, ty: 0, tz: 0 },
  { t: 0.5, x: -4, y: 0.3, z: 4, tx: 0, ty: 0, tz: 0 },
  { t: 0.62, x: 2, y: 0, z: 3, tx: 0, ty: 0.5, tz: 0 },
  { t: 0.72, x: 3, y: 1.2, z: 5, tx: 0, ty: 0, tz: 0 },
  { t: 0.82, x: -2, y: 0.8, z: 14, tx: 0.5, ty: 0.2, tz: 0 },
  { t: 0.92, x: 0, y: 0, z: 15, tx: 0, ty: 0, tz: 0 },
]

const AMD_KEYFRAMES = [
  { t: 0, x: 0, y: 0.2, z: 9, tx: 0, ty: 0, tz: 0 },
  { t: 0.1, x: 3, y: 1, z: 4, tx: 0, ty: 0.2, tz: 0 },
  { t: 0.25, x: -2.5, y: 0.8, z: 3, tx: 0, ty: 0, tz: 0 },
  { t: 0.4, x: 0, y: -0.3, z: 5, tx: 0, ty: 0, tz: 0 },
  { t: 0.55, x: -3, y: 0.5, z: 4.5, tx: 0, ty: 0, tz: 0 },
  { t: 0.7, x: 2, y: 0.4, z: 4, tx: 0, ty: 0.3, tz: 0 },
  { t: 0.85, x: 0, y: 0, z: 14, tx: 0, ty: 0, tz: 0 },
]

const INTEL_KEYFRAMES = [
  { t: 0, x: 0, y: 0.3, z: 10, tx: 0, ty: 0, tz: 0 },
  { t: 0.1, x: 3.5, y: 1, z: 4.5, tx: 0, ty: 0.2, tz: 0 },
  { t: 0.25, x: -3, y: 0.5, z: 3, tx: 0, ty: 0, tz: 0 },
  { t: 0.4, x: 0, y: 0.7, z: 5, tx: 0, ty: 0, tz: 0 },
  { t: 0.55, x: 2.5, y: -0.3, z: 4, tx: 0, ty: 0, tz: 0 },
  { t: 0.7, x: -2, y: 0.5, z: 4.5, tx: 0, ty: 0.3, tz: 0 },
  { t: 0.85, x: 0, y: 0, z: 15, tx: 0, ty: 0, tz: 0 },
]

function lerpKeyframes(kfs: typeof NVIDIA_KEYFRAMES, t: number, key: 'x' | 'y' | 'z' | 'tx' | 'ty' | 'tz') {
  for (let i = 0; i < kfs.length - 1; i++) {
    const a = kfs[i]!
    const b = kfs[i + 1]!
    if (t >= a.t && t <= b.t) {
      const p = (t - a.t) / (b.t - a.t)
      return a[key] + (b[key] - a[key]) * p
    }
  }
  return kfs[kfs.length - 1]![key]
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

function SceneContent() {
  const { vendor } = useVendor()
  const { camera } = useThree()
  const progress = useMemo(() => ({ value: 0 }), [])
  const scrollRef = useRef(0)
  const pageVisible = usePageVisible()

  const dieRef = useRef<THREE.Group>(null)
  const amdRef = useRef<THREE.Group>(null)
  const intelRef = useRef<THREE.Group>(null)

  const keyframes = vendor ? (vendor === 'amd' ? AMD_KEYFRAMES : vendor === 'intel' ? INTEL_KEYFRAMES : NVIDIA_KEYFRAMES) : NVIDIA_KEYFRAMES

  useEffect(() => {
    gsap.to(progress, {
      value: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '#scroll-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
      },
    })
    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [progress])

  useFrame(() => {
    if (!pageVisible.current) return
    const s = progress.value
    scrollRef.current = s

    camera.position.set(lerpKeyframes(keyframes, s, 'x'), lerpKeyframes(keyframes, s, 'y'), lerpKeyframes(keyframes, s, 'z'))
    camera.lookAt(lerpKeyframes(keyframes, s, 'tx'), lerpKeyframes(keyframes, s, 'ty'), lerpKeyframes(keyframes, s, 'tz'))

    if (dieRef.current) {
      dieRef.current.rotation.y = s * Math.PI * 0.5 + Math.sin(s * Math.PI * 3) * 0.15
      dieRef.current.position.y = smoothstep(s, 0, 0.1) * 0.2
      dieRef.current.scale.setScalar(1 + Math.sin(s * Math.PI * 2) * 0.05)
    }
    if (amdRef.current) {
      amdRef.current.rotation.y = s * Math.PI * 0.4 + Math.sin(s * Math.PI * 2.5) * 0.12
      amdRef.current.position.y = smoothstep(s, 0, 0.1) * 0.15
      amdRef.current.scale.setScalar(1 + Math.sin(s * Math.PI * 1.8) * 0.04)
    }
    if (intelRef.current) {
      intelRef.current.rotation.y = s * Math.PI * 0.3 + Math.sin(s * Math.PI * 2) * 0.1
      intelRef.current.position.y = smoothstep(s, 0, 0.1) * 0.15
      intelRef.current.scale.setScalar(1 + Math.sin(s * Math.PI * 2.2) * 0.04)
    }
  })

  const isMobile = typeof navigator !== 'undefined' && navigator.hardwareConcurrency < 4
  const color = vendor === 'amd' ? '#ED1C24' : vendor === 'intel' ? '#0071C5' : '#76B900'
  const accent = vendor === 'amd' ? '#FF6900' : vendor === 'intel' ? '#00C7FD' : '#00D4AA'

  return (
    <>
      <TechBackground scrollRef={scrollRef} />
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.6} color={color} />
      <pointLight position={[-5, -3, 2]} intensity={0.3} color={accent} />
      {vendor === 'nvidia' && (
        <>
          <GPUDie scrollRef={scrollRef} groupRef={dieRef} />
          <CircuitBoard scrollRef={scrollRef} />
          <NVLinkRack scrollRef={scrollRef} />
        </>
      )}
      {vendor === 'amd' && <AMDChipletDie scrollRef={scrollRef} groupRef={amdRef} />}
      {vendor === 'intel' && <IntelMeshInterconnect scrollRef={scrollRef} groupRef={intelRef} />}
      <DataParticles scrollRef={scrollRef} count={isMobile ? 500 : 3000} />
      <SiliconWafer scrollRef={scrollRef} />
    </>
  )
}

export default function Scene() {
  const isMobile = typeof navigator !== 'undefined' && navigator.hardwareConcurrency < 4

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0.5, 8], fov: 55, near: 0.1, far: 100 }}
        dpr={isMobile ? [1, 1] : [1, 2]}
        gl={{ antialias: !isMobile, powerPreference: isMobile ? 'default' : 'high-performance' }}
      >
        <SceneContent />
      </Canvas>
    </div>
  )
}
