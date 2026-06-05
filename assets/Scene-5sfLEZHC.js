const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/NvidiaScene-Dkte8Y3U.js","assets/rolldown-runtime-QTnfLwEv.js","assets/index-B-e1LwL8.js","assets/vendor-q8RIdIwp.js","assets/vendor-lenis-CTKP9dZF.js","assets/vendor-react-8zOo6Zm5.js","assets/index-8tbLZz5m.css","assets/vendor-r3f-BaCbg8Wj.js","assets/IridescentMaterial-D9jDsrSc.js","assets/AmdScene-oa_zVVMV.js","assets/IntelScene-DAVNERCL.js"])))=>i.map(i=>d[i]);
import{r as e}from"./rolldown-runtime-QTnfLwEv.js";import{Et as t,Mt as n,Pt as r,Rt as i,Tt as a,_t as o,dt as s,et as c,ht as l,jt as u,ot as d,pt as f,rt as p,st as m,tt as h,yt as g}from"./vendor-q8RIdIwp.js";import{r as _}from"./vendor-lenis-CTKP9dZF.js";import{a as v,i as y,n as b,o as x,r as S,t as C}from"./index-B-e1LwL8.js";import{a as w,c as T,i as ee,n as te,o as E,r as D,s as O}from"./vendor-r3f-BaCbg8Wj.js";var k=e(i(),1);function A(){let e=(0,k.useRef)(!0);return(0,k.useEffect)(()=>{let t=()=>{e.current=!document.hidden};return document.addEventListener(`visibilitychange`,t),()=>document.removeEventListener(`visibilitychange`,t)},[]),e}var j=`varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,ne=`uniform sampler2D uVelocity;
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
`,re=`
const RES: f32 = 128.0;
const TEXEL_SIZE: f32 = 1.0 / RES;

struct Params {
  dt: f32,
  dissipation: f32,
  forceStrength: f32,
  forcePosX: f32,
  forcePosY: f32,
  forceVecX: f32,
  forceVecY: f32,
};

@group(0) @binding(0) var<storage, read> uData: array<vec4<f32>>;
@group(0) @binding(1) var<storage, read_write> vData: array<vec4<f32>>;
@group(0) @binding(2) var<uniform> params: Params;

fn idx(x: u32, y: u32) -> u32 {
  return min(y, u32(RES) - 1u) * u32(RES) + min(x, u32(RES) - 1u);
}

fn loadVel(x: u32, y: u32) -> vec2<f32> {
  return uData[idx(x, y)].xy;
}

fn loadPressure(x: u32, y: u32) -> f32 {
  return uData[idx(x, y)].z;
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let x = id.x;
  let y = id.y;
  if (x >= u32(RES) || y >= u32(RES)) { return; }

  let i = idx(x, y);
  let vel = loadVel(x, y);
  let p = loadPressure(x, y);

  let velL = loadVel(x - 1u, y);
  let velR = loadVel(x + 1u, y);
  let velD = loadVel(x, y - 1u);
  let velU = loadVel(x, y + 1u);

  let pL = loadPressure(x - 1u, y);
  let pR = loadPressure(x + 1u, y);
  let pD = loadPressure(x, y - 1u);
  let pU = loadPressure(x, y + 1u);

  // Semi-Lagrangian advection
  let uv = vec2<f32>(f32(x), f32(y)) / RES;
  let advectedCoord = uv - vel * params.dt * TEXEL_SIZE * 20.0;
  let ac = clamp(advectedCoord, vec2<f32>(0.001), vec2<f32>(0.999));
  let ax = u32(ac.x * RES);
  let ay = u32(ac.y * RES);
  let advectedVel = uData[idx(ax, ay)].xy;

  // Diffusion (central difference)
  let diffusion = (velL + velR + velD + velU) * 0.25;

  // Pressure projection
  let divergence = (velR.x - velL.x + velU.y - velD.y) * 0.5;
  let newP = (pL + pR + pD + pU - divergence) * 0.25;
  let gradient = vec2<f32>(newP - pL, newP - pD) * (1.0 / TEXEL_SIZE) * 0.5;
  let projected = advectedVel - gradient;

  // Cursor force
  let forceDelta = uv - vec2<f32>(params.forcePosX, params.forcePosY);
  let force = params.forceStrength * vec2<f32>(params.forceVecX, params.forceVecY) * exp(-dot(forceDelta, forceDelta) * 200.0);

  // Blend steps
  let outVel = (advectedVel * 0.5 + diffusion * 0.3 + projected * 0.2) * params.dissipation + force;
  let outP = newP * 0.95;

  vData[i] = vec4<f32>(outVel, outP, 1.0);
}
`,M=128,N=M*M*4*4;function P(){return typeof navigator<`u`&&`gpu`in navigator&&navigator.gpu!=null}var F=class e{device;pipeline;dataA;dataB;paramsBuf;stagingBufs;bindGroupA;bindGroupB;pingIdx=0;velocityBuf=new Float32Array(N/4);static async create(){if(!P())return null;try{let t=new e,n=await navigator.gpu.requestAdapter();if(!n)return null;let r=await n.requestDevice();t.device=r;let i=r.createShaderModule({code:re});t.pipeline=r.createComputePipeline({layout:`auto`,compute:{module:i,entryPoint:`main`}}),t.dataA=r.createBuffer({size:N,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),t.dataB=r.createBuffer({size:N,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),t.paramsBuf=r.createBuffer({size:256,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),t.stagingBufs=[r.createBuffer({size:N,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),r.createBuffer({size:N,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST})];let a=t.pipeline.getBindGroupLayout(0);t.bindGroupA=r.createBindGroup({layout:a,entries:[{binding:0,resource:{buffer:t.dataA}},{binding:1,resource:{buffer:t.dataB}},{binding:2,resource:{buffer:t.paramsBuf}}]}),t.bindGroupB=r.createBindGroup({layout:a,entries:[{binding:0,resource:{buffer:t.dataB}},{binding:1,resource:{buffer:t.dataA}},{binding:2,resource:{buffer:t.paramsBuf}}]});let o=new Float32Array(N/4);return r.queue.writeBuffer(t.dataA,0,o),r.queue.writeBuffer(t.dataB,0,o),t}catch{return null}}step(e){let t=this.device,n=this.stagingBufs[this.pingIdx],r=new Float32Array([e.dt,0,0,0,e.dissipation,0,0,0,e.forceStrength,0,0,0,e.forcePosX,0,0,0,e.forcePosY,0,0,0,e.forceVecX,0,0,0,e.forceVecY,0,0,0]);t.queue.writeBuffer(this.paramsBuf,0,r);let i=t.createCommandEncoder(),a=i.beginComputePass();a.setPipeline(this.pipeline),a.setBindGroup(0,this.pingIdx===0?this.bindGroupA:this.bindGroupB),a.dispatchWorkgroups(16,16),a.end();let o=this.pingIdx===0?this.dataB:this.dataA;i.copyBufferToBuffer(o,0,n,0,N),t.queue.submit([i.finish()]),t.queue.onSubmittedWorkDone().then(()=>{let e=this.stagingBufs[1-this.pingIdx];e.mapAsync(GPUMapMode.READ).then(()=>{let t=new Float32Array(e.getMappedRange());this.velocityBuf.set(t),e.unmap()})}),this.pingIdx=1-this.pingIdx}dispose(){this.dataA?.destroy(),this.dataB?.destroy(),this.paramsBuf?.destroy(),this.stagingBufs[0]?.destroy(),this.stagingBufs[1]?.destroy(),this.device?.destroy()}},I=128,L=new u(1/I,1/I),R=null;function z(){return R}function B(){return new r(I,I,{minFilter:s,magFilter:s,type:m,depthBuffer:!1})}function V(){let e=T(e=>e.gl),{pointer:n}=T(),[r,i]=(0,k.useState)(null),s=(0,k.useRef)(0),c=(0,k.useMemo)(()=>[B(),B()],[]),d=(0,k.useMemo)(()=>new a,[]),f=(0,k.useMemo)(()=>new o(-1,1,1,-1,0,1),[]),p=(0,k.useMemo)(()=>new l(new g(2,2)),[]);d.add(p);let m=(0,k.useMemo)(()=>new t({uniforms:{uVelocity:{value:null},uPressure:{value:null},uTexelSize:{value:L},uDt:{value:.016},uDissipation:{value:.99},uForcePos:{value:new u(.5,.5)},uForceVec:{value:new u(0,0)},uForceStrength:{value:0}},vertexShader:j,fragmentShader:ne,depthWrite:!1}),[]),h=(0,k.useMemo)(()=>new Float32Array(I*I*4),[]);R=h;let _=(0,k.useRef)({x:.5,y:.5}),v=(0,k.useRef)(performance.now());return(0,k.useEffect)(()=>{let e=!1;return F.create().then(t=>{e||i(t)}),()=>{e=!0,r?.dispose()}},[]),O(()=>{if(S.getState().settings.particleMultiplier<.2)return;let t=performance.now(),i=Math.min((t-v.current)/1e3,.05);v.current=t;let a=n.x*.5+.5,o=n.y*-.5+.5,l=a-_.current.x,u=o-_.current.y,p=Math.sqrt(l*l+u*u);if(r){let e={dt:i,dissipation:.99,forceStrength:Math.min(p*50,10),forcePosX:a,forcePosY:o,forceVecX:l*20,forceVecY:u*20};r.step(e),h.set(r.velocityBuf)}else{let t=m.uniforms;t.uDt.value=i,t.uForcePos.value.set(a,o),t.uForceVec.value.set(l*20,u*20),t.uForceStrength.value=Math.min(p*50,10);let n=c[s.current],r=c[1-s.current];t.uVelocity.value=n.texture,t.uPressure.value=n.texture,e.setRenderTarget(r),e.render(d,f),e.setRenderTarget(null),e.readRenderTargetPixels(r,0,0,I,I,h),s.current=1-s.current}_.current={x:a,y:o}}),null}var H=_();function U(e){let t=e;return()=>(t=t*1103515245+12345&2147483647,t/2147483647)}function W(e){let t=U(123),n=new Float32Array(e*3),r=new Float32Array(e);for(let i=0;i<e;i++){let e=t()*Math.PI*2,a=.5+t()*4;n[i*3]=Math.cos(e)*a,n[i*3+1]=(t()-.5)*1.5,n[i*3+2]=Math.sin(e)*a,r[i]=t()*Math.PI*2}return{positions:n,phases:r}}function G(e){let t=U(456),n=new Float32Array(e*3),r=new p(`#76B900`),i=new p(`#00D4AA`);for(let a=0;a<e;a++){let e=t(),o=r.clone().lerp(i,e);n[a*3]=o.r,n[a*3+1]=o.g,n[a*3+2]=o.b}return n}function K({scrollRef:e,count:t=3e3}){let n=(0,k.useRef)(null),r=(0,k.useRef)(0),i=typeof navigator<`u`&&navigator.hardwareConcurrency<4?3:1,{positions:a,phases:o}=(0,k.useMemo)(()=>W(t),[t]),[s]=(0,k.useState)(()=>G(t));return O(a=>{let s=n.current;if(!s||(s.position.z=e.current*2,r.current=(r.current+1)%i,r.current!==0))return;let c=.3+e.current*.5,l=s.geometry.attributes.position,u=l.array,d=o,f=z();for(let e=0;e<t;e++){let t=e*3,n=Math.atan2(u[t+2],u[t])+c*.01,r=Math.sqrt(u[t]*u[t]+u[t+2]*u[t+2]);if(u[t]=Math.cos(n)*r,u[t+2]=Math.sin(n)*r,u[t+1]=u[t+1]+(Math.sin(a.clock.elapsedTime*.5+d[e])-u[t+1])*.02,f){let e=(u[t]*.05+.5)*128,n=(u[t+2]*.05+.5)*128,r=(Math.floor(n)*128+Math.floor(e))*4;r>=0&&r+2<f.length&&(u[t]=u[t]+f[r]*.002,u[t+2]=u[t+2]+f[r+1]*.002)}}l.needsUpdate=!0}),(0,H.jsxs)(`points`,{ref:n,children:[(0,H.jsxs)(`bufferGeometry`,{children:[(0,H.jsx)(`bufferAttribute`,{attach:`attributes-position`,args:[a,3],count:t,array:a,itemSize:3}),(0,H.jsx)(`bufferAttribute`,{attach:`attributes-color`,args:[s,3],count:t,array:s,itemSize:3})]}),(0,H.jsx)(`pointsMaterial`,{size:.04,vertexColors:!0,transparent:!0,opacity:.7,sizeAttenuation:!0,blending:2,depthWrite:!1})]})}var q=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,J=`
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
  
  float wave1 = sin(vUv.x * 8.0 + uTime * 0.3) * 0.5 + 0.5;
  float wave2 = cos(vUv.y * 6.0 + uTime * 0.4 + uProgress * 3.0) * 0.5 + 0.5;
  float wave3 = sin((vUv.x + vUv.y) * 5.0 + uTime * 0.25 + uProgress * 2.0) * 0.5 + 0.5;
  float energyWave = (wave1 * 0.3 + wave2 * 0.3 + wave3 * 0.4) * uProgress * 0.15;
  col += (mix(uColor1, uColor2, 0.5)) * energyWave * 0.02;
  
  float ring = distance(vUv, vec2(0.5 + sin(uTime * 0.1) * 0.1, 0.5 + cos(uTime * 0.08) * 0.1));
  float ringGlow = sin(ring * 30.0 - uTime * 0.5 + uProgress * 2.0) * 0.5 + 0.5;
  ringGlow = smoothstep(0.4, 0.8, ringGlow) * 0.04 * uProgress;
  col += vec3(0.3, 0.5, 0.3) * ringGlow;
  
  gl_FragColor = vec4(col, 1.0);
}
`,Y=[[new p(`#030712`),new p(`#0a1a0a`)],[new p(`#0a0f0a`),new p(`#0d2d0d`)],[new p(`#060d06`),new p(`#0a1a0a`)],[new p(`#040904`),new p(`#0f2a0f`)],[new p(`#020602`),new p(`#0d2d0d`)],[new p(`#030a03`),new p(`#0a1a0a`)]];function ie({scrollRef:e}){let t=(0,k.useRef)(null),{pointer:n}=T(),r=(0,k.useMemo)(()=>{let e=Y[0];return{uColor1:{value:e[0].clone()},uColor2:{value:e[1].clone()},uTime:{value:0},uProgress:{value:0},uMouse:{value:new u(.5,.5)}}},[]);return O(r=>{if(!t.current)return;let i=e.current,a=Math.min(Math.floor(i*(Y.length-1)),Y.length-2),o=a+1,s=i*(Y.length-1)%1,c=s*s*(3-2*s),l=Y[a],u=Y[o],d=t.current.uniforms;!d||!d.uColor1||!d.uColor2||!d.uTime||!d.uProgress||!d.uMouse||(d.uColor1.value.lerpColors(l[0],u[0],c),d.uColor2.value.lerpColors(l[1],u[1],c),d.uTime.value=r.clock.elapsedTime,d.uProgress.value=i,d.uMouse.value.set(n.x*.5+.5,n.y*.5+.5))}),(0,H.jsxs)(`mesh`,{position:[0,0,-20],children:[(0,H.jsx)(`planeGeometry`,{args:[50,35]}),(0,H.jsx)(`shaderMaterial`,{ref:t,vertexShader:q,fragmentShader:J,uniforms:r,depthWrite:!1})]})}function ae({scrollRef:e}){let t=(0,k.useRef)(null),n=(0,k.useRef)(null);O(()=>{if(!t.current)return;let r=e.current,i=Math.max(0,Math.min(1,(r-.35)/.2)),a=i*(1-Math.max(0,Math.min(1,(r-.8)/.1)));if(t.current.scale.setScalar(i),t.current.rotation.x=Math.sin(r*Math.PI)*.15,t.current.rotation.z=r*.3,n.current){let e=n.current.material;e.opacity=a*.3}});let r=(0,k.useMemo)(()=>{let e=new c,t=[],n=.15,r=.08;for(let e=0;e<30;e++)for(let i=0;i<30;i++){let a=-30*n/2+i*n,o=-30*n/2+e*n;t.push(a,0,o,a+r,0,o),t.push(a+r,0,o,a+r,0,o+r),t.push(a+r,0,o+r,a,0,o+r),t.push(a,0,o+r,a,0,o)}return e.setAttribute(`position`,new d(t,3)),e},[]);return(0,H.jsxs)(`group`,{ref:t,position:[0,0,-3],scale:0,children:[(0,H.jsxs)(`mesh`,{children:[(0,H.jsx)(`circleGeometry`,{args:[3.5,64]}),(0,H.jsx)(`meshBasicMaterial`,{color:`#0a2a0a`,transparent:!0,opacity:.2,side:2})]}),(0,H.jsx)(`lineSegments`,{ref:n,geometry:r,children:(0,H.jsx)(`lineBasicMaterial`,{color:`#1a4a1a`,transparent:!0,opacity:0})}),(0,H.jsxs)(`mesh`,{position:[0,0,.01],children:[(0,H.jsx)(`ringGeometry`,{args:[.5,3.5,64]}),(0,H.jsx)(`meshBasicMaterial`,{color:`#0d2d0d`,transparent:!0,opacity:.1,side:2})]})]})}var X=[{x:0,y:.5,z:8,tx:0,ty:0,tz:0},{x:4,y:1.5,z:3,tx:0,ty:.2,tz:0},{x:-3,y:.8,z:2.5,tx:0,ty:0,tz:0},{x:0,y:-.5,z:5,tx:0,ty:0,tz:0},{x:-4,y:.3,z:4,tx:0,ty:0,tz:0},{x:2,y:0,z:3,tx:0,ty:.5,tz:0},{x:3,y:1.2,z:5,tx:0,ty:0,tz:0},{x:-2,y:.8,z:14,tx:.5,ty:.2,tz:0},{x:0,y:0,z:15,tx:0,ty:0,tz:0}],oe={nvidia:X,amd:[{x:0,y:.2,z:9,tx:0,ty:0,tz:0},{x:3,y:1,z:4,tx:0,ty:.2,tz:0},{x:-2.5,y:.8,z:3,tx:0,ty:0,tz:0},{x:0,y:-.3,z:5,tx:0,ty:0,tz:0},{x:-3,y:.5,z:4.5,tx:0,ty:0,tz:0},{x:2,y:.4,z:4,tx:0,ty:.3,tz:0},{x:0,y:0,z:14,tx:0,ty:0,tz:0}],intel:[{x:0,y:.3,z:10,tx:0,ty:0,tz:0},{x:3.5,y:1,z:4.5,tx:0,ty:.2,tz:0},{x:-3,y:.5,z:3,tx:0,ty:0,tz:0},{x:0,y:.7,z:5,tx:0,ty:0,tz:0},{x:2.5,y:-.3,z:4,tx:0,ty:0,tz:0},{x:-2,y:.5,z:4.5,tx:0,ty:.3,tz:0},{x:0,y:0,z:15,tx:0,ty:0,tz:0}]};function se(){let{camera:e}=T(),{vendor:t}=b(),r=(0,k.useRef)(new n),i=(0,k.useRef)(new n),a=(0,k.useRef)(new n),o=(0,k.useRef)(new n),s=(0,k.useRef)(!1),c=(0,k.useMemo)(()=>{let e=oe[t??`nvidia`]??X,r=e.map(e=>new n(e.x,e.y,e.z)),i=e.map(e=>new n(e.tx,e.ty,e.tz));return{posSpline:new h(r,!1,`centripetal`),tgtSpline:new h(i,!1,`centripetal`)}},[t]);return O((t,n)=>{let l=S.getState(),u=l.transition,d=l.transient.scrollProgress,p=4;if(u.phase!==`idle`){let e=v(u,n);e!==u&&S.getState().updateTransition(e),d=u.progress*.3,p=8,y(e)&&!s.current&&(u.toVendor&&l.setVendor(u.toVendor),s.current=!0),e.phase===`idle`&&(s.current=!1)}let m=f.clamp(d,0,1);c.posSpline.getPointAt(m,a.current),c.tgtSpline.getPointAt(m,o.current),r.current.lerp(a.current,n*p),i.current.lerp(o.current,n*p),e.position.copy(r.current),e.lookAt(i.current)}),null}var ce=`varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,le=`uniform float uProgress;
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
`;function ue(){let e=T(e=>e.gl),n=(0,k.useMemo)(()=>new a,[]),r=(0,k.useMemo)(()=>new o(-1,1,1,-1,0,1),[]),i=(0,k.useMemo)(()=>new l(new g(2,2)),[]);n.add(i);let s=(0,k.useMemo)(()=>new t({uniforms:{uProgress:{value:0},uColor1:{value:new p(`#76B900`)},uColor2:{value:new p(`#00D4AA`)},uScene:{value:null}},vertexShader:ce,fragmentShader:le,transparent:!0,depthWrite:!1,depthTest:!1}),[]);return i.material=s,O(()=>{let t=S.getState().transition;if(t.phase===`idle`){s.visible=!1;return}s.visible=!0;let i=s.uniforms;i.uProgress.value=t.progress;let a=t.fromVendor?x[t.fromVendor]:null,o=t.toVendor?x[t.toVendor]:null;a&&i.uColor1.value.set(a.color),o&&i.uColor2.value.set(o.color),i.uScene.value=e.domElement,e.setRenderTarget(null),e.render(n,r)}),null}var de=(0,k.lazy)(()=>C(()=>import(`./NvidiaScene-Dkte8Y3U.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8]))),Z=(0,k.lazy)(()=>C(()=>import(`./AmdScene-oa_zVVMV.js`),__vite__mapDeps([9,1,2,3,4,5,6,7,8]))),fe=(0,k.lazy)(()=>C(()=>import(`./IntelScene-DAVNERCL.js`),__vite__mapDeps([10,1,2,3,4,5,6,7,8])));function Q(){return(0,H.jsx)(`group`,{})}function pe(e){let{vendor:t}=b();return t===`nvidia`?(0,H.jsx)(k.Suspense,{fallback:(0,H.jsx)(Q,{}),children:(0,H.jsx)(de,{dieRef:e.dieRef,scrollRef:e.scrollRef})}):t===`amd`?(0,H.jsx)(k.Suspense,{fallback:(0,H.jsx)(Q,{}),children:(0,H.jsx)(Z,{amdRef:e.amdRef})}):t===`intel`?(0,H.jsx)(k.Suspense,{fallback:(0,H.jsx)(Q,{}),children:(0,H.jsx)(fe,{intelRef:e.intelRef})}):(0,H.jsx)(Q,{})}function $(e,t,n){let r=Math.max(0,Math.min(1,(n-e)/(t-e)));return r*r*(3-2*r)}function me(){let{vendor:e,config:t}=b(),n=S(e=>e.settings),r=(0,k.useRef)(0),i=A(),a=(0,k.useRef)(null),o=(0,k.useRef)(null),s=(0,k.useRef)(null);O(()=>{if(!i.current)return;let e=S.getState().transient.scrollProgress;r.current=e,a.current&&(a.current.rotation.y=e*Math.PI*.5+Math.sin(e*Math.PI*3)*.15,a.current.position.y=$(e,0,.1)*.2,a.current.scale.setScalar(1+Math.sin(e*Math.PI*2)*.05)),o.current&&(o.current.rotation.y=e*Math.PI*.4+Math.sin(e*Math.PI*2.5)*.12,o.current.position.y=$(e,0,.1)*.15,o.current.scale.setScalar(1+Math.sin(e*Math.PI*1.8)*.04)),s.current&&(s.current.rotation.y=e*Math.PI*.3+Math.sin(e*Math.PI*2)*.1,s.current.position.y=$(e,0,.1)*.15,s.current.scale.setScalar(1+Math.sin(e*Math.PI*2.2)*.04))});let c=t?.color??`#76B900`,l=t?.accent??`#00D4AA`,d=n.bloomIntensity*(e===`nvidia`?1:e===`amd`?.9:.8),f=typeof navigator<`u`&&navigator.hardwareConcurrency<4;return(0,H.jsxs)(H.Fragment,{children:[(0,H.jsx)(`color`,{attach:`background`,args:[`#030303`]}),(0,H.jsx)(`fog`,{attach:`fog`,args:n.fogEnabled?[`#030303`,14,28]:[`#030303`,0,0]}),(0,H.jsx)(se,{}),(0,H.jsx)(ie,{scrollRef:r}),(0,H.jsx)(`ambientLight`,{intensity:.3}),(0,H.jsx)(`pointLight`,{position:[5,5,5],intensity:.6,color:c}),(0,H.jsx)(`pointLight`,{position:[-5,-3,2],intensity:.3,color:l}),(0,H.jsx)(pe,{dieRef:a,amdRef:o,intelRef:s,scrollRef:r}),(0,H.jsx)(V,{}),(0,H.jsx)(ue,{}),(0,H.jsx)(K,{scrollRef:r,count:f?500:Math.round(3e3*n.particleMultiplier)}),(0,H.jsx)(ae,{scrollRef:r}),(0,H.jsxs)(te,{enableNormalPass:!1,children:[(0,H.jsx)(ee,{intensity:d,luminanceThreshold:.15,luminanceSmoothing:.85,mipmapBlur:!0}),(0,H.jsx)(w,{offset:new u(n.caEnabled?.0015:0,n.caEnabled?.0015:0),radialModulation:!0}),(0,H.jsx)(D,{eskil:!1,offset:.3,darkness:.6})]})]})}function he(){let e=typeof navigator<`u`&&navigator.hardwareConcurrency<4,t=S(t=>e?1:t.settings.dpr);return(0,H.jsx)(E,{camera:{position:[0,.5,8],fov:55,near:.1,far:100},dpr:(0,k.useMemo)(()=>[1,t],[t]),gl:{antialias:!e,powerPreference:e?`default`:`high-performance`},children:(0,H.jsx)(me,{})})}export{he as default};