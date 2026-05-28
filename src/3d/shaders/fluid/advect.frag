uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 uTexelSize;
uniform float uDt;
uniform float uDissipation;

varying vec2 vUv;

void main() {
  vec2 vel = texture2D(uVelocity, vUv).rg;
  vec2 coord = vUv - vel * uDt * uTexelSize * 20.0;
  coord = clamp(coord, 0.001, 0.999);
  vec3 result = texture2D(uSource, coord).rgb;
  result *= uDissipation;
  gl_FragColor = vec4(result, 1.0);
}
