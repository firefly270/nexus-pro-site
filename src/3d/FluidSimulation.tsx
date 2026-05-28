import { useMemo, useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import fullVert from './shaders/fluid/fullscreen.vert?raw'
import computeFrag from './shaders/fluid/compute.frag?raw'
import { useBoundStore } from '../store/useBoundStore'
import { WebGPUComputeFluid, type FluidParams } from './webgpu/WebGPUCompute'

const RES = 128
const TEXEL = new THREE.Vector2(1 / RES, 1 / RES)

let velocityBuf: Float32Array | null = null

export function getVelocityBufferRef() { return velocityBuf }

function makeRT(): THREE.WebGLRenderTarget {
  return new THREE.WebGLRenderTarget(RES, RES, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    type: THREE.HalfFloatType,
    depthBuffer: false,
  })
}

export default function FluidSimulation() {
  const gl = useThree((s) => s.gl)
  const { pointer } = useThree()
  const [wgpu, setWgpu] = useState<WebGPUComputeFluid | null>(null)
  const readIdx = useRef(0)

  const targets = useMemo(() => [makeRT(), makeRT()], [])
  const scene = useMemo(() => new THREE.Scene(), [])
  const camera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), [])
  const quad = useMemo(() => new THREE.Mesh(new THREE.PlaneGeometry(2, 2)), [])
  scene.add(quad)

  const computeMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uVelocity: { value: null },
      uPressure: { value: null },
      uTexelSize: { value: TEXEL },
      uDt: { value: 0.016 },
      uDissipation: { value: 0.99 },
      uForcePos: { value: new THREE.Vector2(0.5, 0.5) },
      uForceVec: { value: new THREE.Vector2(0, 0) },
      uForceStrength: { value: 0 },
    },
    vertexShader: fullVert,
    fragmentShader: computeFrag,
    depthWrite: false,
  }), [])

  const velBuf = useMemo(() => new Float32Array(RES * RES * 4), [])

  velocityBuf = velBuf

  const prevMouse = useRef({ x: 0.5, y: 0.5 })
  const prevTime = useRef(performance.now())

  useEffect(() => {
    let cancelled = false
    WebGPUComputeFluid.create().then(inst => {
      if (!cancelled) setWgpu(inst)
    })
    return () => { cancelled = true; wgpu?.dispose() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame(() => {
    const settings = useBoundStore.getState().settings
    if (settings.particleMultiplier < 0.2) return

    const now = performance.now()
    const dt = Math.min((now - prevTime.current) / 1000, 0.05)
    prevTime.current = now

    const px = pointer.x * 0.5 + 0.5
    const py = pointer.y * -0.5 + 0.5
    const dx = px - prevMouse.current.x
    const dy = py - prevMouse.current.y
    const speed = Math.sqrt(dx * dx + dy * dy)

    if (wgpu) {
      const params: FluidParams = {
        dt,
        dissipation: 0.99,
        forceStrength: Math.min(speed * 50, 10),
        forcePosX: px,
        forcePosY: py,
        forceVecX: dx * 20,
        forceVecY: dy * 20,
      }
      wgpu.step(params)
      velBuf.set(wgpu.velocityBuf)
    } else {
      const uniforms = computeMat.uniforms
      uniforms.uDt!.value = dt
      uniforms.uForcePos!.value.set(px, py)
      uniforms.uForceVec!.value.set(dx * 20, dy * 20)
      uniforms.uForceStrength!.value = Math.min(speed * 50, 10)

      const read = targets[readIdx.current]!
      const write = targets[1 - readIdx.current]!
      uniforms.uVelocity!.value = read.texture
      uniforms.uPressure!.value = read.texture

      gl.setRenderTarget(write)
      gl.render(scene, camera)
      gl.setRenderTarget(null)

      gl.readRenderTargetPixels(write, 0, 0, RES, RES, velBuf)
      readIdx.current = 1 - readIdx.current
    }

    prevMouse.current = { x: px, y: py }
  })

  return null
}
