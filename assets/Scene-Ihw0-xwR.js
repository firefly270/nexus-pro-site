const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/NvidiaScene-ChDlJPFP.js","assets/rolldown-runtime-b3L32Ng1.js","assets/index-DqvkBhwS.js","assets/vendor-D0v9Tujh.js","assets/vendor-lenis-BAg5ylyS.js","assets/vendor-react-CktcN9Rk.js","assets/index-CAoRfECB.css","assets/vendor-r3f-COfboEMP.js","assets/IridescentMaterial-F26FUyv4.js","assets/AmdScene-C9n-8ckd.js","assets/IntelScene-CavRbUTf.js"])))=>i.map(i=>d[i]);
import{r as Q}from"./rolldown-runtime-b3L32Ng1.js";import{Et as Y,Mt as B,Pt as ee,Rt as te,Tt as q,_t as X,dt as F,et as re,ht as N,jt as D,ot as ne,pt as oe,rt as m,st as se,tt as I,yt as $}from"./vendor-D0v9Tujh.js";import{r as ae}from"./vendor-lenis-BAg5ylyS.js";import{a as ie,i as ue,n as T,o as L,r as R,t as E}from"./index-DqvkBhwS.js";import{a as ce,c as j,i as le,n as fe,o as de,r as ve,s as U}from"./vendor-r3f-COfboEMP.js";var i=Q(te(),1);function pe(){const s=(0,i.useRef)(!0);return(0,i.useEffect)(()=>{const e=()=>{s.current=!document.hidden};return document.addEventListener("visibilitychange",e),()=>document.removeEventListener("visibilitychange",e)},[]),s}var ge=`varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,me=`uniform sampler2D uVelocity;
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
`,xe=`
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
`,k=128,z=k*k*4*4;function ye(){return typeof navigator<"u"&&"gpu"in navigator&&navigator.gpu!=null}var he=class Z{device;pipeline;dataA;dataB;paramsBuf;stagingBufs;bindGroupA;bindGroupB;pingIdx=0;velocityBuf=new Float32Array(z/4);static async create(){if(!ye())return null;try{const e=new Z,o=await navigator.gpu.requestAdapter();if(!o)return null;const a=await o.requestDevice();e.device=a;const u=a.createShaderModule({code:xe});e.pipeline=a.createComputePipeline({layout:"auto",compute:{module:u,entryPoint:"main"}}),e.dataA=a.createBuffer({size:z,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),e.dataB=a.createBuffer({size:z,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),e.paramsBuf=a.createBuffer({size:256,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),e.stagingBufs=[a.createBuffer({size:z,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),a.createBuffer({size:z,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST})];const n=e.pipeline.getBindGroupLayout(0);e.bindGroupA=a.createBindGroup({layout:n,entries:[{binding:0,resource:{buffer:e.dataA}},{binding:1,resource:{buffer:e.dataB}},{binding:2,resource:{buffer:e.paramsBuf}}]}),e.bindGroupB=a.createBindGroup({layout:n,entries:[{binding:0,resource:{buffer:e.dataB}},{binding:1,resource:{buffer:e.dataA}},{binding:2,resource:{buffer:e.paramsBuf}}]});const c=new Float32Array(z/4);return a.queue.writeBuffer(e.dataA,0,c),a.queue.writeBuffer(e.dataB,0,c),e}catch{return null}}step(e){const o=this.device,a=this.stagingBufs[this.pingIdx],u=new Float32Array([e.dt,0,0,0,e.dissipation,0,0,0,e.forceStrength,0,0,0,e.forcePosX,0,0,0,e.forcePosY,0,0,0,e.forceVecX,0,0,0,e.forceVecY,0,0,0]);o.queue.writeBuffer(this.paramsBuf,0,u);const n=o.createCommandEncoder(),c=n.beginComputePass();c.setPipeline(this.pipeline),c.setBindGroup(0,this.pingIdx===0?this.bindGroupA:this.bindGroupB),c.dispatchWorkgroups(16,16),c.end();const f=this.pingIdx===0?this.dataB:this.dataA;n.copyBufferToBuffer(f,0,a,0,z),o.queue.submit([n.finish()]),o.queue.onSubmittedWorkDone().then(()=>{const d=this.stagingBufs[1-this.pingIdx];d.mapAsync(GPUMapMode.READ).then(()=>{const v=new Float32Array(d.getMappedRange());this.velocityBuf.set(v),d.unmap()})}),this.pingIdx=1-this.pingIdx}dispose(){this.dataA?.destroy(),this.dataB?.destroy(),this.paramsBuf?.destroy(),this.stagingBufs[0]?.destroy(),this.stagingBufs[1]?.destroy(),this.device?.destroy()}},w=128,Pe=new D(1/w,1/w),H=null;function we(){return H}function O(){return new ee(w,w,{minFilter:F,magFilter:F,type:se,depthBuffer:!1})}function Se(){const s=j(y=>y.gl),{pointer:e}=j(),[o,a]=(0,i.useState)(null),u=(0,i.useRef)(0),n=(0,i.useMemo)(()=>[O(),O()],[]),c=(0,i.useMemo)(()=>new q,[]),f=(0,i.useMemo)(()=>new X(-1,1,1,-1,0,1),[]),d=(0,i.useMemo)(()=>new N(new $(2,2)),[]);c.add(d);const v=(0,i.useMemo)(()=>new Y({uniforms:{uVelocity:{value:null},uPressure:{value:null},uTexelSize:{value:Pe},uDt:{value:.016},uDissipation:{value:.99},uForcePos:{value:new D(.5,.5)},uForceVec:{value:new D(0,0)},uForceStrength:{value:0}},vertexShader:ge,fragmentShader:me,depthWrite:!1}),[]),g=(0,i.useMemo)(()=>new Float32Array(w*w*4),[]);H=g;const l=(0,i.useRef)({x:.5,y:.5}),t=(0,i.useRef)(performance.now());return(0,i.useEffect)(()=>{let y=!1;return he.create().then(h=>{y||a(h)}),()=>{y=!0,o?.dispose()}},[]),U(()=>{if(R.getState().settings.particleMultiplier<.2)return;const y=performance.now(),h=Math.min((y-t.current)/1e3,.05);t.current=y;const x=e.x*.5+.5,p=e.y*-.5+.5,S=x-l.current.x,M=p-l.current.y,V=Math.sqrt(S*S+M*M);if(o){const P={dt:h,dissipation:.99,forceStrength:Math.min(V*50,10),forcePosX:x,forcePosY:p,forceVecX:S*20,forceVecY:M*20};o.step(P),g.set(o.velocityBuf)}else{const P=v.uniforms;P.uDt.value=h,P.uForcePos.value.set(x,p),P.uForceVec.value.set(S*20,M*20),P.uForceStrength.value=Math.min(V*50,10);const b=n[u.current],G=n[1-u.current];P.uVelocity.value=b.texture,P.uPressure.value=b.texture,s.setRenderTarget(G),s.render(c,f),s.setRenderTarget(null),s.readRenderTargetPixels(G,0,0,w,w,g),u.current=1-u.current}l.current={x,y:p}}),null}var r=ae();function K(s){let e=s;return()=>(e=e*1103515245+12345&2147483647,e/2147483647)}function Me(s){const e=K(123),o=new Float32Array(s*3),a=new Float32Array(s);for(let u=0;u<s;u++){const n=e()*Math.PI*2,c=.5+e()*4;o[u*3]=Math.cos(n)*c,o[u*3+1]=(e()-.5)*1.5,o[u*3+2]=Math.sin(n)*c,a[u]=e()*Math.PI*2}return{positions:o,phases:a}}function be(s){const e=K(456),o=new Float32Array(s*3),a=new m("#76B900"),u=new m("#00D4AA");for(let n=0;n<s;n++){const c=e(),f=a.clone().lerp(u,c);o[n*3]=f.r,o[n*3+1]=f.g,o[n*3+2]=f.b}return o}function ze({scrollRef:s,count:e=3e3}){const o=(0,i.useRef)(null),a=(0,i.useRef)(0),u=typeof navigator<"u"&&navigator.hardwareConcurrency<4?3:1,{positions:n,phases:c}=(0,i.useMemo)(()=>Me(e),[e]),[f]=(0,i.useState)(()=>be(e));return U(d=>{const v=o.current;if(!v||(v.position.z=s.current*2,a.current=(a.current+1)%u,a.current!==0))return;const g=.3+s.current*.5,l=v.geometry.attributes.position,t=l.array,y=c,h=we();for(let x=0;x<e;x++){const p=x*3,S=Math.atan2(t[p+2],t[p])+g*.01,M=Math.sqrt(t[p]*t[p]+t[p+2]*t[p+2]);if(t[p]=Math.cos(S)*M,t[p+2]=Math.sin(S)*M,t[p+1]=t[p+1]+(Math.sin(d.clock.elapsedTime*.5+y[x])-t[p+1])*.02,h){const V=(t[p]*.05+.5)*128,P=(t[p+2]*.05+.5)*128,b=(Math.floor(P)*128+Math.floor(V))*4;b>=0&&b+2<h.length&&(t[p]=t[p]+h[b]*.002,t[p+2]=t[p+2]+h[b+1]*.002)}}l.needsUpdate=!0}),(0,r.jsxs)("points",{ref:o,children:[(0,r.jsxs)("bufferGeometry",{children:[(0,r.jsx)("bufferAttribute",{attach:"attributes-position",args:[n,3],count:e,array:n,itemSize:3}),(0,r.jsx)("bufferAttribute",{attach:"attributes-color",args:[f,3],count:e,array:f,itemSize:3})]}),(0,r.jsx)("pointsMaterial",{size:.04,vertexColors:!0,transparent:!0,opacity:.7,sizeAttenuation:!0,blending:2,depthWrite:!1})]})}var Re=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Ue=`
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
`,C=[[new m("#030712"),new m("#0a1a0a")],[new m("#0a0f0a"),new m("#0d2d0d")],[new m("#060d06"),new m("#0a1a0a")],[new m("#040904"),new m("#0f2a0f")],[new m("#020602"),new m("#0d2d0d")],[new m("#030a03"),new m("#0a1a0a")]];function Be({scrollRef:s}){const e=(0,i.useRef)(null),{pointer:o}=j(),a=(0,i.useMemo)(()=>{const u=C[0];return{uColor1:{value:u[0].clone()},uColor2:{value:u[1].clone()},uTime:{value:0},uProgress:{value:0},uMouse:{value:new D(.5,.5)}}},[]);return U(u=>{if(!e.current)return;const n=s.current,c=Math.min(Math.floor(n*(C.length-1)),C.length-2),f=c+1,d=n*(C.length-1)%1,v=d*d*(3-2*d),g=C[c],l=C[f],t=e.current.uniforms;!t||!t.uColor1||!t.uColor2||!t.uTime||!t.uProgress||!t.uMouse||(t.uColor1.value.lerpColors(g[0],l[0],v),t.uColor2.value.lerpColors(g[1],l[1],v),t.uTime.value=u.clock.elapsedTime,t.uProgress.value=n,t.uMouse.value.set(o.x*.5+.5,o.y*.5+.5))}),(0,r.jsxs)("mesh",{position:[0,0,-20],children:[(0,r.jsx)("planeGeometry",{args:[50,35]}),(0,r.jsx)("shaderMaterial",{ref:e,vertexShader:Re,fragmentShader:Ue,uniforms:a,depthWrite:!1})]})}function Ce({scrollRef:s}){const e=(0,i.useRef)(null),o=(0,i.useRef)(null);U(()=>{if(!e.current)return;const u=s.current,n=Math.max(0,Math.min(1,(u-.35)/.2)),c=n*(1-Math.max(0,Math.min(1,(u-.8)/.1)));if(e.current.scale.setScalar(n),e.current.rotation.x=Math.sin(u*Math.PI)*.15,e.current.rotation.z=u*.3,o.current){const f=o.current.material;f.opacity=c*.3}});const a=(0,i.useMemo)(()=>{const u=new re,n=[],c=30,f=.15,d=.08;for(let v=0;v<c;v++)for(let g=0;g<c;g++){const l=-30*f/2+g*f,t=-30*f/2+v*f;n.push(l,0,t,l+d,0,t),n.push(l+d,0,t,l+d,0,t+d),n.push(l+d,0,t+d,l,0,t+d),n.push(l,0,t+d,l,0,t)}return u.setAttribute("position",new ne(n,3)),u},[]);return(0,r.jsxs)("group",{ref:e,position:[0,0,-3],scale:0,children:[(0,r.jsxs)("mesh",{children:[(0,r.jsx)("circleGeometry",{args:[3.5,64]}),(0,r.jsx)("meshBasicMaterial",{color:"#0a2a0a",transparent:!0,opacity:.2,side:2})]}),(0,r.jsx)("lineSegments",{ref:o,geometry:a,children:(0,r.jsx)("lineBasicMaterial",{color:"#1a4a1a",transparent:!0,opacity:0})}),(0,r.jsxs)("mesh",{position:[0,0,.01],children:[(0,r.jsx)("ringGeometry",{args:[.5,3.5,64]}),(0,r.jsx)("meshBasicMaterial",{color:"#0d2d0d",transparent:!0,opacity:.1,side:2})]})]})}var J=[{x:0,y:.5,z:8,tx:0,ty:0,tz:0},{x:4,y:1.5,z:3,tx:0,ty:.2,tz:0},{x:-3,y:.8,z:2.5,tx:0,ty:0,tz:0},{x:0,y:-.5,z:5,tx:0,ty:0,tz:0},{x:-4,y:.3,z:4,tx:0,ty:0,tz:0},{x:2,y:0,z:3,tx:0,ty:.5,tz:0},{x:3,y:1.2,z:5,tx:0,ty:0,tz:0},{x:-2,y:.8,z:14,tx:.5,ty:.2,tz:0},{x:0,y:0,z:15,tx:0,ty:0,tz:0}],De={nvidia:J,amd:[{x:0,y:.2,z:9,tx:0,ty:0,tz:0},{x:3,y:1,z:4,tx:0,ty:.2,tz:0},{x:-2.5,y:.8,z:3,tx:0,ty:0,tz:0},{x:0,y:-.3,z:5,tx:0,ty:0,tz:0},{x:-3,y:.5,z:4.5,tx:0,ty:0,tz:0},{x:2,y:.4,z:4,tx:0,ty:.3,tz:0},{x:0,y:0,z:14,tx:0,ty:0,tz:0}],intel:[{x:0,y:.3,z:10,tx:0,ty:0,tz:0},{x:3.5,y:1,z:4.5,tx:0,ty:.2,tz:0},{x:-3,y:.5,z:3,tx:0,ty:0,tz:0},{x:0,y:.7,z:5,tx:0,ty:0,tz:0},{x:2.5,y:-.3,z:4,tx:0,ty:0,tz:0},{x:-2,y:.5,z:4.5,tx:0,ty:.3,tz:0},{x:0,y:0,z:15,tx:0,ty:0,tz:0}]};function je(){const{camera:s}=j(),{vendor:e}=T(),o=(0,i.useRef)(new B),a=(0,i.useRef)(new B),u=(0,i.useRef)(new B),n=(0,i.useRef)(new B),c=(0,i.useRef)(!1),f=(0,i.useMemo)(()=>{const d=De[e??"nvidia"]??J,v=d.map(l=>new B(l.x,l.y,l.z)),g=d.map(l=>new B(l.tx,l.ty,l.tz));return{posSpline:new I(v,!1,"centripetal"),tgtSpline:new I(g,!1,"centripetal")}},[e]);return U((d,v)=>{const g=R.getState(),l=g.transition;let t=g.transient.scrollProgress,y=4;if(l.phase!=="idle"){const x=ie(l,v);x!==l&&R.getState().updateTransition(x),t=l.progress*.3,y=8,ue(x)&&!c.current&&(l.toVendor&&g.setVendor(l.toVendor),c.current=!0),x.phase==="idle"&&(c.current=!1)}const h=oe.clamp(t,0,1);f.posSpline.getPointAt(h,u.current),f.tgtSpline.getPointAt(h,n.current),o.current.lerp(u.current,v*y),a.current.lerp(n.current,v*y),s.position.copy(o.current),s.lookAt(a.current)}),null}var Ve=`varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,_e=`uniform float uProgress;
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
`;function Te(){const s=j(n=>n.gl),e=(0,i.useMemo)(()=>new q,[]),o=(0,i.useMemo)(()=>new X(-1,1,1,-1,0,1),[]),a=(0,i.useMemo)(()=>new N(new $(2,2)),[]);e.add(a);const u=(0,i.useMemo)(()=>new Y({uniforms:{uProgress:{value:0},uColor1:{value:new m("#76B900")},uColor2:{value:new m("#00D4AA")},uScene:{value:null}},vertexShader:Ve,fragmentShader:_e,transparent:!0,depthWrite:!1,depthTest:!1}),[]);return a.material=u,U(()=>{const n=R.getState().transition;if(n.phase==="idle"){u.visible=!1;return}u.visible=!0;const c=u.uniforms;c.uProgress.value=n.progress;const f=n.fromVendor?L[n.fromVendor]:null,d=n.toVendor?L[n.toVendor]:null;f&&c.uColor1.value.set(f.color),d&&c.uColor2.value.set(d.color),c.uScene.value=s.domElement,s.setRenderTarget(null),s.render(e,o)}),null}var Ae=(0,i.lazy)(()=>E(()=>import("./NvidiaScene-ChDlJPFP.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8]))),Ee=(0,i.lazy)(()=>E(()=>import("./AmdScene-C9n-8ckd.js"),__vite__mapDeps([9,1,2,3,4,5,6,7,8]))),Ge=(0,i.lazy)(()=>E(()=>import("./IntelScene-CavRbUTf.js"),__vite__mapDeps([10,1,2,3,4,5,6,7,8])));function _(){return(0,r.jsx)("group",{})}function Fe(s){const{vendor:e}=T();return e==="nvidia"?(0,r.jsx)(i.Suspense,{fallback:(0,r.jsx)(_,{}),children:(0,r.jsx)(Ae,{dieRef:s.dieRef,scrollRef:s.scrollRef})}):e==="amd"?(0,r.jsx)(i.Suspense,{fallback:(0,r.jsx)(_,{}),children:(0,r.jsx)(Ee,{amdRef:s.amdRef})}):e==="intel"?(0,r.jsx)(i.Suspense,{fallback:(0,r.jsx)(_,{}),children:(0,r.jsx)(Ge,{intelRef:s.intelRef})}):(0,r.jsx)(_,{})}function Ie(){const[s,e]=(0,i.useState)(!0);return(0,i.useEffect)(()=>{try{const o=document.createElement("canvas");if(!(o.getContext("webgl2")||o.getContext("webgl"))){e(!1);return}}catch{e(!1)}},[]),s}function A(s,e,o){const a=Math.max(0,Math.min(1,(o-s)/(e-s)));return a*a*(3-2*a)}function Le(){const{vendor:s,config:e}=T(),o=R(t=>t.settings),a=(0,i.useRef)(0),u=pe(),n=(0,i.useRef)(null),c=(0,i.useRef)(null),f=(0,i.useRef)(null);U(()=>{if(!u.current)return;const t=R.getState().transient.scrollProgress;a.current=t,n.current&&(n.current.rotation.y=t*Math.PI*.5+Math.sin(t*Math.PI*3)*.15,n.current.position.y=A(t,0,.1)*.2,n.current.scale.setScalar(1+Math.sin(t*Math.PI*2)*.05)),c.current&&(c.current.rotation.y=t*Math.PI*.4+Math.sin(t*Math.PI*2.5)*.12,c.current.position.y=A(t,0,.1)*.15,c.current.scale.setScalar(1+Math.sin(t*Math.PI*1.8)*.04)),f.current&&(f.current.rotation.y=t*Math.PI*.3+Math.sin(t*Math.PI*2)*.1,f.current.position.y=A(t,0,.1)*.15,f.current.scale.setScalar(1+Math.sin(t*Math.PI*2.2)*.04))});const d=e?.color??"#76B900",v=e?.accent??"#00D4AA",g=o.bloomIntensity*(s==="nvidia"?1:s==="amd"?.9:.8),l=typeof navigator<"u"&&navigator.hardwareConcurrency<4;return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("color",{attach:"background",args:["#030303"]}),(0,r.jsx)("fog",{attach:"fog",args:o.fogEnabled?["#030303",14,28]:["#030303",0,0]}),(0,r.jsx)(je,{}),(0,r.jsx)(Be,{scrollRef:a}),(0,r.jsx)("ambientLight",{intensity:.3}),(0,r.jsx)("pointLight",{position:[5,5,5],intensity:.6,color:d}),(0,r.jsx)("pointLight",{position:[-5,-3,2],intensity:.3,color:v}),(0,r.jsx)(Fe,{dieRef:n,amdRef:c,intelRef:f,scrollRef:a}),(0,r.jsx)(Se,{}),(0,r.jsx)(Te,{}),(0,r.jsx)(ze,{scrollRef:a,count:l?500:Math.round(3e3*o.particleMultiplier)}),(0,r.jsx)(Ce,{scrollRef:a}),(0,r.jsxs)(fe,{enableNormalPass:!1,children:[(0,r.jsx)(le,{intensity:g,luminanceThreshold:.15,luminanceSmoothing:.85,mipmapBlur:!0}),(0,r.jsx)(ce,{offset:new D(o.caEnabled?.0015:0,o.caEnabled?.0015:0),radialModulation:!0}),(0,r.jsx)(ve,{eskil:!1,offset:.3,darkness:.6})]})]})}function W(){const{config:s}=T(),e=s?.color??"#76B900";return(0,r.jsxs)("div",{className:"webgl-fallback absolute inset-0",style:{background:`radial-gradient(800px circle at 50% 30%, ${e}10, transparent 60%),
                  radial-gradient(600px circle at 80% 70%, ${s?.accent??"#00D4AA"}08, transparent 50%),
                  radial-gradient(400px circle at 20% 80%, ${e}06, transparent 40%)`},children:[(0,r.jsx)("div",{className:"webgl-fallback-nodes"}),(0,r.jsx)("div",{className:"absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-zinc-700 font-mono tracking-wider uppercase",children:"3D unavailable · content still active"})]})}function Xe(){const s=Ie(),e=typeof navigator<"u"&&navigator.hardwareConcurrency<4,o=R(u=>e?1:u.settings.dpr),a=(0,i.useMemo)(()=>[1,o],[o]);return s?(0,r.jsx)(de,{camera:{position:[0,.5,8],fov:55,near:.1,far:100},dpr:a,gl:{antialias:!e,powerPreference:e?"default":"high-performance"},fallback:(0,r.jsx)(W,{}),children:(0,r.jsx)(Le,{})}):(0,r.jsx)(W,{})}export{Xe as default};
