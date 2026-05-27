import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uTime;
uniform float uProgress;
uniform vec2 uMouse;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7) + uTime * 0.02)) * 43758.5453);
}

void main() {
  vec2 distortion = (uMouse - 0.5) * 0.03;
  vec2 uv = (vUv + distortion) * 4.0;
  float hx = step(0.95, fract(uv.x));
  float hy = step(0.95, fract(uv.y));
  float grid = max(hx, hy);
  
  float scanline = sin(vUv.y * 200.0 + uTime * 2.0 + uMouse.x * 5.0) * 0.5 + 0.5;
  float n = hash(vUv + uTime * 0.01 + uMouse * 0.1);
  float noise = smoothstep(0.45, 0.55, n);
  
  vec3 bg = mix(uColor1, uColor2, vUv.y + uProgress * 0.3);
  vec3 col = mix(bg, mix(uColor1, uColor2, 1.0), grid * 0.15);
  col += vec3(0.4, 0.75, 0.1) * scanline * 0.03;
  col += vec3(0.46, 0.73, 0.0) * noise * 0.02 * (1.0 - uProgress * 0.5);
  
  gl_FragColor = vec4(col, 1.0);
}
`

const colorPalettes = [
  [new THREE.Color('#030712'), new THREE.Color('#0a1a0a')],
  [new THREE.Color('#0a0f0a'), new THREE.Color('#0d2d0d')],
  [new THREE.Color('#060d06'), new THREE.Color('#0a1a0a')],
  [new THREE.Color('#040904'), new THREE.Color('#0f2a0f')],
  [new THREE.Color('#020602'), new THREE.Color('#0d2d0d')],
  [new THREE.Color('#030a03'), new THREE.Color('#0a1a0a')],
]

export default function TechBackground({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  const ref = useRef<THREE.ShaderMaterial>(null)
  const { pointer } = useThree()

  const uniforms = useMemo(() => {
    const pal = colorPalettes[0] as [THREE.Color, THREE.Color]
    return {
      uColor1: { value: pal[0].clone() },
      uColor2: { value: pal[1].clone() },
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    }
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    const s = scrollRef.current
    const idx = Math.min(Math.floor(s * (colorPalettes.length - 1)), colorPalettes.length - 2)
    const next = idx + 1
    const t = (s * (colorPalettes.length - 1)) % 1
    const easeT = t * t * (3 - 2 * t)

    const a = colorPalettes[idx]!
    const b = colorPalettes[next]!
    const u = ref.current.uniforms
    if (!u || !u.uColor1 || !u.uColor2 || !u.uTime || !u.uProgress || !u.uMouse) return
    u.uColor1.value.lerpColors(a[0], b[0], easeT)
    u.uColor2.value.lerpColors(a[1], b[1], easeT)
    u.uTime.value = state.clock.elapsedTime
    u.uProgress.value = s
    u.uMouse.value.set(pointer.x * 0.5 + 0.5, pointer.y * 0.5 + 0.5)
  })

  return (
    <mesh position={[0, 0, -20]}>
      <planeGeometry args={[50, 35]} />
      <shaderMaterial ref={ref} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} depthWrite={false} />
    </mesh>
  )
}
