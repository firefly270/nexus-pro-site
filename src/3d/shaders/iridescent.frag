uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uTime;
uniform float uDepth;

varying vec3 vInstanceColor;
varying float vFresnel;
varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vWorldNormal;

float hash2(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float circuitLayer(vec3 p, float t) {
  vec3 q = floor(p);
  vec3 r = fract(p) - 0.5;
  float cell = hash21(q.xy + q.z * 7.0);
  float trace = 1.0 - smoothstep(0.0, 0.05, abs(r.x) - 0.1 + 0.3 * (1.0 - cell));
  trace += 1.0 - smoothstep(0.0, 0.05, abs(r.y) - 0.1 + 0.3 * cell);
  trace += 1.0 - smoothstep(0.0, 0.05, abs(r.z) - 0.08 + 0.4 * hash21(q.xy));
  float via = 1.0 - smoothstep(0.03, 0.0, length(r.xy) - 0.05 * (1.0 - hash2(q.xy + q.z * 13.0)));
  return clamp(min(trace, 1.0) + via, 0.0, 1.0);
}

float hexGrid(vec3 p) {
  vec2 h = vec2(1.0, 1.732);
  vec2 q = p.xz / h;
  vec2 f = fract(q) - 0.5;
  float d = max(abs(f.x), abs(f.y));
  return 1.0 - smoothstep(0.0, 0.02, d);
}

float sceneSDF(vec3 p) {
  float depthLayer = p.y + 0.5;
  float grid = hexGrid(p * 4.0) * 0.15;
  float circuit = circuitLayer(p * 6.0, uTime * 0.1) * 0.3;
  float via = smoothstep(0.3, 0.5, hash2(p.xz * 10.0 + floor(p.y * 20.0))) * 0.2;
  return grid + circuit + via;
}

void main() {
  float iri = sin(vFresnel * 12.0 + uTime * 0.08) * 0.5 + 0.5;
  vec3 iriColor = mix(uColor1, uColor2, iri);

  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  vec3 rayPos = vWorldPos + vWorldNormal * 0.01;
  vec3 rayDir = reflect(viewDir, vWorldNormal);
  float depthAccum = 0.0;
  vec3 internalColor = vec3(0.0);
  int maxSteps = 24;

  if (uDepth > 0.01) {
    for (int i = 0; i < maxSteps; i++) {
      float d = sceneSDF(rayPos * 2.0);
      if (d < 0.001) {
        vec3 c = mix(vec3(0.1, 0.3, 0.15), vec3(0.3, 0.6, 0.3), hash2(rayPos.xz));
        internalColor += c * exp(-depthAccum * 0.5);
        rayPos += rayDir * 0.02;
      } else {
        rayPos += rayDir * (d * 0.5);
      }
      depthAccum += 0.04;
      if (depthAccum > 1.0) break;
    }
    internalColor *= uDepth * 0.5;
  }

  vec3 final = mix(vInstanceColor, iriColor, 0.25 * vFresnel);
  final += vInstanceColor * 0.3;
  final += internalColor;

  gl_FragColor = vec4(final, 1.0);
}
