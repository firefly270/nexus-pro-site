uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uTime;

varying vec3 vInstanceColor;
varying float vFresnel;

void main() {
  float iri = sin(vFresnel * 12.0 + uTime * 0.08) * 0.5 + 0.5;
  vec3 iriColor = mix(uColor1, uColor2, iri);

  vec3 final = mix(vInstanceColor, iriColor, 0.25 * vFresnel);
  final += vInstanceColor * 0.3;

  gl_FragColor = vec4(final, 1.0);
}
