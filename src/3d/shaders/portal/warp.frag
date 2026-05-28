uniform float uProgress;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform sampler2D uScene;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec2 center = vec2(0.5, 0.5);
  vec2 dir = uv - center;
  float dist = length(dir);

  float zoom = 1.0 + uProgress * 0.2;
  uv = center + dir / zoom;

  float warp = uProgress * 0.08;
  uv += normalize(dir + 0.001) * dist * warp;

  float rOff = uProgress * 0.015;
  float gOff = 0.0;
  float bOff = -uProgress * 0.015;

  float r = texture2D(uScene, uv + vec2(rOff, 0.0)).r;
  float g = texture2D(uScene, uv + vec2(gOff, 0.0)).g;
  float b = texture2D(uScene, uv + vec2(bOff, 0.0)).b;

  vec3 sceneColor = vec3(r, g, b);
  vec3 sweep = mix(uColor1, uColor2, uProgress);
  vec3 final = mix(sceneColor, sceneColor + sweep * 0.3, uProgress);

  float vignette = 1.0 - dist * uProgress * 1.5;
  float alpha = smoothstep(0.0, 1.0, uProgress * 2.0) - smoothstep(0.5, 1.0, uProgress + 0.5);

  gl_FragColor = vec4(final * vignette, alpha * 0.85);
}
