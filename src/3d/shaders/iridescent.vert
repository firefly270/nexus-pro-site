uniform float uTime;
uniform float uScroll;
uniform vec2 uMouse;

varying vec3 vInstanceColor;
varying float vFresnel;
varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vWorldNormal;

void main() {
  vInstanceColor = instanceColor;

  float wave = sin(position.x * 4.0 + uTime * 0.5 + uScroll * 3.0) * 0.005
             + cos(position.z * 3.0 + uTime * 0.3) * 0.003;

  vec2 delta = position.xz - uMouse;
  float dist = length(delta);
  float ripple = sin(dist * 15.0 - uTime * 2.0) * exp(-dist * 3.0) * 0.004;

  vec3 newPos = position + normal * (wave + ripple);

  vec4 worldPos = instanceMatrix * vec4(newPos, 1.0);
  vec4 mvPosition = viewMatrix * worldPos;

  vec3 worldNormal = normalize((instanceMatrix * vec4(normal, 0.0)).xyz);
  vec3 viewDir = normalize(cameraPosition - worldPos.xyz);
  vFresnel = 1.0 - abs(dot(viewDir, worldNormal));

  vUv = uv;
  vWorldPos = worldPos.xyz;
  vWorldNormal = worldNormal;

  gl_Position = projectionMatrix * mvPosition;
}
