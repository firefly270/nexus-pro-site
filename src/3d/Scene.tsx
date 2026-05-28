import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { useVendor } from '../context/VendorContext'
import { usePageVisible } from '../hooks/usePageVisible'
import { mutateTransientState } from '../store/useBoundStore'
import GPUDie from './GPUDie'
import CircuitBoard from './CircuitBoard'
import DataParticles from './DataParticles'
import TechBackground from './TechBackground'
import SiliconWafer from './SiliconWafer'
import NVLinkRack from './NVLinkRack'
import AMDChipletDie from './AMD_ChipletDie'
import IntelMeshInterconnect from './Intel_MeshInterconnect'
import CameraSpline from './CameraSpline'

gsap.registerPlugin(ScrollTrigger)
gsap.ticker.lagSmoothing(0)

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

function SceneContent() {
  const { vendor, config } = useVendor()
  const progress = useMemo(() => ({ value: 0 }), [])
  const scrollRef = useRef(0)
  const pageVisible = usePageVisible()

  const dieRef = useRef<THREE.Group>(null)
  const amdRef = useRef<THREE.Group>(null)
  const intelRef = useRef<THREE.Group>(null)

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
    mutateTransientState({ scrollProgress: s })

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

  const color = config?.color ?? '#76B900'
  const accent = config?.accent ?? '#00D4AA'
  const isMobile = typeof navigator !== 'undefined' && navigator.hardwareConcurrency < 4

  return (
    <>
      <color attach="background" args={['#030303']} />
      <CameraSpline />
      <TechBackground scrollRef={scrollRef} />
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.6} color={color} />
      <pointLight position={[-5, -3, 2]} intensity={0.3} color={accent} />
      {vendor === 'nvidia' && (
        <>
          <GPUDie groupRef={dieRef} />
          <CircuitBoard scrollRef={scrollRef} />
          <NVLinkRack scrollRef={scrollRef} />
        </>
      )}
      {vendor === 'amd' && <AMDChipletDie groupRef={amdRef} />}
      {vendor === 'intel' && <IntelMeshInterconnect groupRef={intelRef} />}
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
        <EffectComposer enableNormalPass={false}>
          <Bloom intensity={1.0} luminanceThreshold={0.15} luminanceSmoothing={0.85} mipmapBlur />
          <ChromaticAberration offset={new THREE.Vector2(0.0015, 0.0015)} radialModulation />
          <Vignette eskil={false} offset={0.3} darkness={0.6} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
