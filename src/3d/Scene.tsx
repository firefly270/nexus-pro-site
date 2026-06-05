import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { Group, Vector2 } from 'three'
import { useVendor } from '../context/VendorContext'
import { usePageVisible } from '../hooks/usePageVisible'
import { useBoundStore } from '../store/useBoundStore'
import DataParticles from './DataParticles'
import TechBackground from './TechBackground'
import SiliconWafer from './SiliconWafer'
import CameraSpline from './CameraSpline'
import FluidSimulation from './FluidSimulation'
import PortalOverlay from './PortalOverlay'
import { VendorScene } from './VendorScene'

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

function SceneContent() {
  const { vendor, config } = useVendor()
  const settings = useBoundStore((s) => s.settings)
  const scrollRef = useRef(0)
  const pageVisible = usePageVisible()

  const dieRef = useRef<Group>(null)
  const amdRef = useRef<Group>(null)
  const intelRef = useRef<Group>(null)

  useFrame(() => {
    if (!pageVisible.current) return
    const s = useBoundStore.getState().transient.scrollProgress
    scrollRef.current = s

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
  const bloomIntensity = settings.bloomIntensity * (vendor === 'nvidia' ? 1.0 : vendor === 'amd' ? 0.9 : 0.8)
  const isMobile = typeof navigator !== 'undefined' && navigator.hardwareConcurrency < 4

  return (
    <>
      <color attach="background" args={['#030303']} />
      <fog attach="fog" args={settings.fogEnabled ? ['#030303', 14, 28] : ['#030303', 0, 0]} />
      <CameraSpline />
      <TechBackground scrollRef={scrollRef} />
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.6} color={color} />
      <pointLight position={[-5, -3, 2]} intensity={0.3} color={accent} />
      <VendorScene
        dieRef={dieRef}
        amdRef={amdRef}
        intelRef={intelRef}
        scrollRef={scrollRef}
      />
      <FluidSimulation />
      <PortalOverlay />
      <DataParticles scrollRef={scrollRef} count={isMobile ? 500 : Math.round(3000 * settings.particleMultiplier)} />
      <SiliconWafer scrollRef={scrollRef} />
      <EffectComposer enableNormalPass={false}>
        <Bloom intensity={bloomIntensity} luminanceThreshold={0.15} luminanceSmoothing={0.85} mipmapBlur />
        <ChromaticAberration offset={new Vector2(settings.caEnabled ? 0.0015 : 0, settings.caEnabled ? 0.0015 : 0)} radialModulation />
        <Vignette eskil={false} offset={0.3} darkness={0.6} />
      </EffectComposer>
    </>
  )
}

export default function Scene() {
  const isMobile = typeof navigator !== 'undefined' && navigator.hardwareConcurrency < 4
  const dprMax = useBoundStore((s) => isMobile ? 1 : s.settings.dpr)
  const dpr: [number, number] = useMemo(() => [1, dprMax], [dprMax])

  return (
    <Canvas
      camera={{ position: [0, 0.5, 8], fov: 55, near: 0.1, far: 100 }}
      dpr={dpr}
      gl={{ antialias: !isMobile, powerPreference: isMobile ? 'default' : 'high-performance' }}
    >
      <SceneContent />
    </Canvas>
  )
}
