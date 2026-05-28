uniform sampler2D uVelocity;
uniform sampler2D uPressure;
uniform vec2 uTexelSize;
uniform float uDt;
uniform float uDissipation;
uniform vec2 uForcePos;
uniform vec2 uForceVec;
uniform float uForceStrength;

varying vec2 vUv;

void main() {
  vec2 vel = texture2D(uVelocity, vUv).rg;
  float p = texture2D(uPressure, vUv).r;

  vec2 st = vec2(uTexelSize.x, 0.0);
  vec2 sv = vec2(0.0, uTexelSize.y);

  vec2 velL = texture2D(uVelocity, vUv - st).rg;
  vec2 velR = texture2D(uVelocity, vUv + st).rg;
  vec2 velD = texture2D(uVelocity, vUv - sv).rg;
  vec2 velU = texture2D(uVelocity, vUv + sv).rg;

  float pL = texture2D(uPressure, vUv - st).r;
  float pR = texture2D(uPressure, vUv + st).r;
  float pD = texture2D(uPressure, vUv - sv).r;
  float pU = texture2D(uPressure, vUv + sv).r;

  vec2 advection = vel;
  vec2 advectedCoord = vUv - vel * uDt * uTexelSize * 20.0;
  advectedCoord = clamp(advectedCoord, 0.001, 0.999);
  vec2 advectedVel = texture2D(uVelocity, advectedCoord).rg;

  vec2 diffusion = (velL + velR + velD + velU) * 0.25;
  vec2 projected;
  float divergence = (velR.x - velL.x + velU.y - velD.y) * 0.5;
  float newP = (pL + pR + pD + pU - divergence) * 0.25;
  projected = advectedVel - vec2(newP - pL, newP - pD) / uTexelSize * 0.5;

  vec2 force = uForceStrength * uForceVec * exp(-dot(vUv - uForcePos, vUv - uForcePos) * 200.0);

  vec2 outVel = (advectedVel * 0.5 + diffusion * 0.3 + projected * 0.2) * uDissipation + force;
  float outP = newP * 0.95;

  gl_FragColor = vec4(outVel, outP, 1.0);
}
