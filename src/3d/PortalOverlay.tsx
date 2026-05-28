import { useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useBoundStore } from '../store/useBoundStore'
import fullVert from './shaders/portal/fullscreen.vert?raw'
import warpFrag from './shaders/portal/warp.frag?raw'
import { vendorConfigs } from '../constants/vendors'

export default function PortalOverlay() {
  const gl = useThree((s) => s.gl)
  const scene = useMemo(() => new THREE.Scene(), [])
  const camera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), [])
  const quad = useMemo(() => new THREE.Mesh(new THREE.PlaneGeometry(2, 2)), [])
  scene.add(quad)

  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uProgress: { value: 0 },
      uColor1: { value: new THREE.Color('#76B900') },
      uColor2: { value: new THREE.Color('#00D4AA') },
      uScene: { value: null },
    },
    vertexShader: fullVert,
    fragmentShader: warpFrag,
    transparent: true,
    depthWrite: false,
    depthTest: false,
  }), [])
  quad.material = mat

  useFrame(() => {
    const trans = useBoundStore.getState().transition
    if (trans.phase === 'idle') {
      mat.visible = false
      return
    }
    mat.visible = true

    const u = mat.uniforms
    u.uProgress!.value = trans.progress

    const fromCfg = trans.fromVendor ? vendorConfigs[trans.fromVendor] : null
    const toCfg = trans.toVendor ? vendorConfigs[trans.toVendor] : null
    if (fromCfg) u.uColor1!.value.set(fromCfg.color)
    if (toCfg) u.uColor2!.value.set(toCfg.color)

    u.uScene!.value = gl.domElement

    gl.setRenderTarget(null)
    gl.render(scene, camera)
  })

  return null
}
