class CyberneticAudioManager {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private ambientOsc: OscillatorNode | null = null
  private filter: BiquadFilterNode | null = null
  private pan: StereoPannerNode | null = null
  private initialized = false

  init() {
    if (this.initialized) return
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext
      this.ctx = new AC()
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

      this.initialized = true
    } catch {
      console.warn('Web Audio API unavailable')
    }
  }

  setMute(muted: boolean) {
    if (!this.initialized) this.init()
    if (!this.ctx || !this.master) return
    if (this.ctx.state === 'suspended') this.ctx.resume()
    this.master.gain.setTargetAtTime(muted ? 0 : 0.2, this.ctx.currentTime, 0.3)
  }

  transitionVendor(vendor: 'nvidia' | 'amd' | 'intel') {
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
    if (!this.pan || !this.ctx) return
    this.pan.pan.setTargetAtTime(normalizedX, this.ctx.currentTime, 0.15)
  }

  updateFilterVelocity(velocity: number) {
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
