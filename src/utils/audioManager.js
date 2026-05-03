class AudioManager {
  constructor() {
    this._ctx        = null
    this._master     = null
    this._muted      = false
    this._lastNote   = -1
  }

  _init() {
    if (this._ctx) return
    this._ctx = new (window.AudioContext || window.webkitAudioContext)()
    this._master = this._ctx.createGain()
    this._master.gain.value = 0.18
    this._master.connect(this._ctx.destination)
  }

  // Call on first user interaction to satisfy browser autoplay policy
  resume() {
    this._init()
    if (this._ctx.state === 'suspended') this._ctx.resume()
  }

  playNote(value, maxValue) {
    if (this._muted || !this._ctx || this._ctx.state !== 'running') return
    const now = this._ctx.currentTime
    if (now - this._lastNote < 0.005) return   // max ~200 notes/sec
    this._lastNote = now

    // Exponential pitch mapping → musical progression across 3 octaves
    const ratio = Math.max(0, Math.min(1, value / Math.max(1, maxValue)))
    const freq  = 200 * Math.pow(2, ratio * 3)   // 200 Hz – 1600 Hz

    const osc = this._ctx.createOscillator()
    const env = this._ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.value = freq

    // Short attack + exponential decay to prevent click pops
    env.gain.setValueAtTime(0, now)
    env.gain.linearRampToValueAtTime(0.15, now + 0.007)
    env.gain.exponentialRampToValueAtTime(0.0001, now + 0.075)

    osc.connect(env)
    env.connect(this._master)
    osc.start(now)
    osc.stop(now + 0.075)
  }

  setMuted(muted) {
    this._muted = muted
    if (this._master && this._ctx) {
      const g = this._master.gain
      g.cancelScheduledValues(this._ctx.currentTime)
      if (muted) {
        g.setValueAtTime(0, this._ctx.currentTime)
      } else {
        g.setTargetAtTime(0.18, this._ctx.currentTime, 0.1)
      }
    }
  }
}

export const audioManager = new AudioManager()
