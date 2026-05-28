const WGSL_SHADER = `
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
`

export interface FluidParams {
  dt: number
  dissipation: number
  forceStrength: number
  forcePosX: number
  forcePosY: number
  forceVecX: number
  forceVecY: number
}

const RES = 128
const CELLS = RES * RES
const BUF_SIZE = CELLS * 4 * 4 // vec4<f32> per cell

export function isWebGPUSupported(): boolean {
  return typeof navigator !== 'undefined' && 'gpu' in navigator && navigator.gpu != null
}

export class WebGPUComputeFluid {
  private device!: GPUDevice
  private pipeline!: GPUComputePipeline
  private dataA!: GPUBuffer
  private dataB!: GPUBuffer
  private paramsBuf!: GPUBuffer
  private stagingBufs!: [GPUBuffer, GPUBuffer]
  private bindGroupA!: GPUBindGroup
  private bindGroupB!: GPUBindGroup
  private pingIdx = 0
  velocityBuf = new Float32Array(BUF_SIZE / 4)

  static async create(): Promise<WebGPUComputeFluid | null> {
    if (!isWebGPUSupported()) return null
    try {
      const inst = new WebGPUComputeFluid()
      const adapter = await navigator.gpu!.requestAdapter()
      if (!adapter) return null
      const device = await adapter.requestDevice()
      inst.device = device

      const shader = device.createShaderModule({ code: WGSL_SHADER })
      inst.pipeline = device.createComputePipeline({
        layout: 'auto',
        compute: { module: shader, entryPoint: 'main' },
      })

      inst.dataA = device.createBuffer({
        size: BUF_SIZE,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
      })
      inst.dataB = device.createBuffer({
        size: BUF_SIZE,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
      })

      inst.paramsBuf = device.createBuffer({
        size: 256,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      })

      const stagingA = device.createBuffer({
        size: BUF_SIZE,
        usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
      })
      const stagingB = device.createBuffer({
        size: BUF_SIZE,
        usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
      })
      inst.stagingBufs = [stagingA, stagingB]

      const bindGroupLayout = inst.pipeline.getBindGroupLayout(0)
      inst.bindGroupA = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
          { binding: 0, resource: { buffer: inst.dataA } },
          { binding: 1, resource: { buffer: inst.dataB } },
          { binding: 2, resource: { buffer: inst.paramsBuf } },
        ],
      })
      inst.bindGroupB = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
          { binding: 0, resource: { buffer: inst.dataB } },
          { binding: 1, resource: { buffer: inst.dataA } },
          { binding: 2, resource: { buffer: inst.paramsBuf } },
        ],
      })

      // Initialize buffers with zeros
      const zeros = new Float32Array(BUF_SIZE / 4)
      device.queue.writeBuffer(inst.dataA, 0, zeros)
      device.queue.writeBuffer(inst.dataB, 0, zeros)

      return inst
    } catch {
      return null
    }
  }

  step(params: FluidParams): void {
    const device = this.device
    const writeStaging = this.stagingBufs[this.pingIdx]!

    const paramsArray = new Float32Array([
      params.dt, 0, 0, 0,
      params.dissipation, 0, 0, 0,
      params.forceStrength, 0, 0, 0,
      params.forcePosX, 0, 0, 0,
      params.forcePosY, 0, 0, 0,
      params.forceVecX, 0, 0, 0,
      params.forceVecY, 0, 0, 0,
    ])
    device.queue.writeBuffer(this.paramsBuf, 0, paramsArray)

    const encoder = device.createCommandEncoder()
    const pass = encoder.beginComputePass()
    pass.setPipeline(this.pipeline)
    pass.setBindGroup(0, this.pingIdx === 0 ? this.bindGroupA : this.bindGroupB)
    pass.dispatchWorkgroups(16, 16)
    pass.end()

    const outBuf = this.pingIdx === 0 ? this.dataB : this.dataA
    encoder.copyBufferToBuffer(outBuf, 0, writeStaging, 0, BUF_SIZE)
    device.queue.submit([encoder.finish()])

    device.queue.onSubmittedWorkDone().then(() => {
      const readStaging = this.stagingBufs[1 - this.pingIdx]!
      readStaging.mapAsync(GPUMapMode.READ).then(() => {
        const src = new Float32Array(readStaging.getMappedRange())
        this.velocityBuf.set(src)
        readStaging.unmap()
      })
    })

    this.pingIdx = 1 - this.pingIdx
  }

  dispose(): void {
    this.dataA?.destroy()
    this.dataB?.destroy()
    this.paramsBuf?.destroy()
    this.stagingBufs[0]?.destroy()
    this.stagingBufs[1]?.destroy()
    this.device?.destroy()
  }
}
