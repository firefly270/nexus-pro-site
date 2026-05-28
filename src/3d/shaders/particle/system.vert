uniform sampler2D uVelocity;
uniform float uTime;
uniform float uScale;
uniform float uDt;

attribute float aPhase;
attribute vec3 aBasePos;

varying vec3 vColor;

void main() {
  vec4 pos = instanceMatrix * vec4(aBasePos, 1.0);
  vec2 uv = pos.xz * 0.05 + 0.5;
  uv = clamp(uv, 0.0, 0.999);
  vec2 vel = texture2D(uVelocity, uv).rg;

  vec3 worldPos = pos.xyz + vec3(vel.x, 0.0, vel.y) * uDt * 2.0;
  worldPos.y += sin(uTime * 0.5 + aPhase) * 0.01;

  vColor = 0.5 + 0.5 * normalize(vel + 0.001);

  vec4 mvPosition = viewMatrix * vec4(worldPos, 1.0);
  gl_PointSize = uScale * (1.0 / -mvPosition.z) * 0.5;
  gl_Position = projectionMatrix * mvPosition;
}
