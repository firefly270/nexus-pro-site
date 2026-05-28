import * as THREE from 'three'
import vert from './iridescent.vert?raw'
import frag from './iridescent.frag?raw'

export interface IridescentUniforms {
  uTime: { value: number }
  uScroll: { value: number }
  uDepth: { value: number }
  uHeat: { value: number }
  uMouse: { value: THREE.Vector2 }
  uColor1: { value: THREE.Color }
  uColor2: { value: THREE.Color }
}

export function createIridescentMaterial(color1: string, color2: string): THREE.ShaderMaterial & { uniforms: IridescentUniforms } {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uDepth: { value: 0 },
      uHeat: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uColor1: { value: new THREE.Color(color1) },
      uColor2: { value: new THREE.Color(color2) },
    },
    vertexShader: vert,
    fragmentShader: frag,
  })
  return mat as typeof mat & { uniforms: IridescentUniforms }
}
