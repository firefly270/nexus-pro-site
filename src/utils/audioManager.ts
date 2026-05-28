class GranularEngine {
  private ctx: AudioContext
  private grainBuffer: AudioBuffer | null = null
  private scheduledGrains: number[] = []

  constructor(ctx: AudioContext) {
    this.ctx = ctx
  }

  async init() {
    const offline = new OfflineAudioContext(1, 44100 * 0.2, 44100)
    const osc = offline.createOscillator()
    const gain = offline.createGain()
    const noiseSrc = offline.createBufferSource()
    const noiseBuf = offline.createBuffer(1, 44100 * 0.2, 44100)
    const noiseData = noiseBuf.getChannelData(0)
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * 0.2
    }
    noiseSrc.buffer = noiseBuf
    const noiseGain = offline.createGain()
    noiseGain.gain.setValueAtTime(0.08, 0)
    noiseGain.gain.linearRampToValueAtTime(0, 0.2)

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(440, 0)
    const oscGain = offline.createGain()
    oscGain.gain.setValueAtTime(0.12, 0)
    oscGain.gain.linearRampToValueAtTime(0, 0.2)

    const filter = offline.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(2000, 0)

    osc.connect(oscGain)
    noiseSrc.connect(noiseGain)
    oscGain.connect(filter)
    noiseGain.connect(filter)
    filter.connect(gain)
    gain.connect(offline.destination)

    osc.start(0)
    noiseSrc.start(0)
    this.grainBuffer = await offline.startRendering()
  }

  scheduleGrain(when: number, pitch: number, pan: number, amp: number) {
    if (!this.grainBuffer || !this.ctx) return
    const source = this.ctx.createBufferSource()
    source.buffer = this.grainBuffer
    source.playbackRate.value = pitch

    const gainNode = this.ctx.createGain()
    gainNode.gain.setValueAtTime(0, when)
    gainNode.gain.linearRampToValueAtTime(amp, when + 0.005)
    gainNode.gain.setValueAtTime(amp, when + 0.095)
    gainNode.gain.linearRampToValueAtTime(0, when + 0.1)

    const panner = this.ctx.createStereoPanner()
    panner.pan.setValueAtTime(pan, when)

    source.connect(panner)
    panner.connect(gainNode)
    gainNode.connect(this.ctx.destination)

    source.start(when)
    source.stop(when + 0.1)
  }

  update(density: number, pitch: number, pan: number) {
    if (!this.ctx) return
    const now = this.ctx.currentTime
    const lookahead = 0.1
    const targetCount = Math.round(density * lookahead)

    while (this.scheduledGrains.length < targetCount) {
      const jitter = Math.random() * (1 / Math.max(density, 1))
      const grainTime = now + jitter
      this.scheduleGrain(grainTime, pitch, pan, 0.04)
      this.scheduledGrains.push(grainTime)
    }

    this.scheduledGrains = this.scheduledGrains.filter(t => t > now)
    while (this.scheduledGrains.length > targetCount) {
      this.scheduledGrains.pop()
    }
  }
}

class CyberneticAudioManager {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private ambientOsc: OscillatorNode | null = null
  private filter: BiquadFilterNode | null = null
  private pan: StereoPannerNode | null = null
  private granular: GranularEngine | null = null
  private initialized = false
  private vendor: 'nvidia' | 'amd' | 'intel' = 'nvidia'
  private lastScrollVelocity = 0
  private lastCursorX = 0

  init() {
    if (this.initialized) return
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext
      this.ctx = new AC()
      this.ctx.resume()
      this.master = this.ctx.createGain()
      this.master.gain.setValueAtTime(0, this.ctx.currentTime)
      this.master.connect(this.ctx.destination)

      this.ambientOsc = this.ctx.createOscillator()
      this.filter = this.ctx.createBiquadFilter()
      this.pan = this.ctx.createStereoPanner()

      this.ambientOsc.type = 'sawtooth'
      this.ambientOsc.frequency.setValueAtTime(55, this.ctx.currentTime)

      this.filter.type = 'lowpass'
      this.filter.Q.setValueAtTime(4, this.ctx.currentTime)
      this.filter.frequency.setValueAtTime(250, this.ctx.currentTime)

      this.pan.pan.setValueAtTime(0, this.ctx.currentTime)

      this.ambientOsc.connect(this.filter)
      this.filter.connect(this.pan)
      this.pan.connect(this.master)
      this.ambientOsc.start(0)

      this.granular = new GranularEngine(this.ctx)
      this.granular.init()

      this.initialized = true
      this.tickGranular()
    } catch {
      console.warn('Web Audio API unavailable')
    }
  }

  private tickGranular = () => {
    if (!this.granular || !this.ctx) return
    const isOn = this.master && this.master.gain.value > 0.01
    if (isOn) {
      const density = Math.min(this.lastScrollVelocity * 4, 50)
      const pitchBase = this.vendor === 'nvidia' ? 1 : this.vendor === 'amd' ? 0.85 : 1.15
      const pitch = pitchBase * (1 + this.lastScrollVelocity * 0.15)
      this.granular.update(density, pitch, this.lastCursorX)
    }
    requestAnimationFrame(this.tickGranular)
  }

  setMute(muted: boolean) {
    if (!this.initialized) this.init()
    if (!this.ctx || !this.master) return
    if (this.ctx.state === 'suspended') this.ctx.resume()
    this.master.gain.setTargetAtTime(muted ? 0 : 0.2, this.ctx.currentTime, 0.3)
  }

  transitionVendor(vendor: 'nvidia' | 'amd' | 'intel') {
    this.vendor = vendor
    if (!this.ctx || !this.filter || !this.ambientOsc) return
    const now = this.ctx.currentTime
    switch (vendor) {
      case 'nvidia':
        this.ambientOsc.frequency.setTargetAtTime(55, now, 0.5)
        this.filter.frequency.setTargetAtTime(320, now, 0.8)
        break
      case 'amd':
        this.ambientOsc.frequency.setTargetAtTime(57.4, now, 0.5)
        this.filter.frequency.setTargetAtTime(450, now, 0.8)
        break
      case 'intel':
        this.ambientOsc.frequency.setTargetAtTime(65.4, now, 0.5)
        this.filter.frequency.setTargetAtTime(200, now, 0.8)
        break
    }
  }

  playTick() {
    if (!this.ctx || !this.master || this.master.gain.value === 0) return
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1200, now)
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04)
    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04)
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.04)
  }

  updatePan(normalizedX: number) {
    this.lastCursorX = normalizedX
    if (!this.pan || !this.ctx) return
    this.pan.pan.setTargetAtTime(normalizedX, this.ctx.currentTime, 0.15)
  }

  updateFilterVelocity(velocity: number) {
    this.lastScrollVelocity = velocity
    if (!this.filter || !this.ctx) return
    const cutoff = 200 + Math.min(velocity * 4000, 4000)
    this.filter.frequency.setTargetAtTime(cutoff, this.ctx.currentTime, 0.1)
  }

  playSwoosh(direction: 'up' | 'down' = 'up') {
    if (!this.ctx || !this.master || this.master.gain.value === 0) return
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const pan = this.ctx.createStereoPanner()
    osc.type = 'sine'
    const startFreq = direction === 'up' ? 200 : 800
    const endFreq = direction === 'up' ? 1200 : 150
    osc.frequency.setValueAtTime(startFreq, now)
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.15)
    gain.gain.setValueAtTime(0.04, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15)
    pan.pan.setValueAtTime(Math.random() * 0.6 - 0.3, now)
    osc.connect(pan)
    pan.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.15)
  }
}

export const AudioEngine = new CyberneticAudioManager()
