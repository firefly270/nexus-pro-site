import { ShaderMaterial, Vector2, Color } from 'three'
import vert from './iridescent.vert?raw'
import frag from './iridescent.frag?raw'

export interface IridescentUniforms {
  uTime: { value: number }
  uScroll: { value: number }
  uDepth: { value: number }
  uHeat: { value: number }
  uMouse: { value: Vector2 }
  uColor1: { value: Color }
  uColor2: { value: Color }
}

export function createIridescentMaterial(color1: string, color2: string): ShaderMaterial & { uniforms: IridescentUniforms } {
  const mat = new ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uDepth: { value: 0 },
      uHeat: { value: 0 },
      uMouse: { value: new Vector2(0.5, 0.5) },
      uColor1: { value: new Color(color1) },
      uColor2: { value: new Color(color2) },
    },
    vertexShader: vert,
    fragmentShader: frag,
  })
  return mat as typeof mat & { uniforms: IridescentUniforms }
}
