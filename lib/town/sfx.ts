/*
 * 効果音。Clutch（3D のレゴ組み立てアプリ）の engine/audio.ts をそのまま移したもの。
 * すべて合成音で、プラスチックがはまる「カチッ」は帯域を絞ったノイズの立ち上がり、部品の響きは減衰するサイン波、台の響きは低い「トン」。
 */


export class Sfx {
  enabled = true
  private ctx?: AudioContext
  private out?: GainNode
  private noise?: AudioBuffer

  /** Must be called from a user gesture before the first sound. */
  unlock() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume()
      return
    }
    const ctx = new AudioContext()
    const comp = ctx.createDynamicsCompressor()
    comp.threshold.value = -14
    comp.ratio.value = 4
    const out = ctx.createGain()
    out.gain.value = 0.9
    out.connect(comp).connect(ctx.destination)
    const len = ctx.sampleRate
    const noise = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = noise.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
    this.ctx = ctx
    this.out = out
    this.noise = noise
  }

  /** The snap of a part seating. More studs gripping = a fuller, slightly lower click. */
  click(grip: number, pan = 0) {
    const c = this.begin(pan)
    if (!c) return
    const { bus, t } = c
    const weight = Math.min(1, grip / 8)
    const pitch = rand(0.93, 1.07) * (1 - weight * 0.18)
    const snaps = 1 + (grip > 2 ? 1 : 0) + (grip > 6 ? 1 : 0)
    let at = t
    for (let k = 0; k < snaps; k++) {
      const amp = k === 0 ? 1 : rand(0.35, 0.6)
      this.burst(bus, at, { freq: 3400 * pitch * rand(0.9, 1.1), q: 1.1, gain: 0.9 * amp, decay: 0.022 })
      this.burst(bus, at, { freq: 7800 * pitch, q: 0.8, gain: 0.35 * amp, decay: 0.008 })
      this.ring(bus, at, 1750 * pitch * rand(0.97, 1.03), 0.12 * amp, 0.045)
      at += rand(0.004, 0.011)
    }
    this.ring(bus, t, 2900 * pitch, 0.05, 0.03)
    this.thump(bus, t + 0.002, 150 * pitch, 0.35 + weight * 0.25, 0.06)
  }

  /** Studs touching the tubes, just before the push. */
  tap(pan = 0) {
    const c = this.begin(pan)
    if (!c) return
    this.burst(c.bus, c.t, { freq: 5200 * rand(0.9, 1.1), q: 1.4, gain: 0.18, decay: 0.006 })
    this.ring(c.bus, c.t, 2400 * rand(0.95, 1.05), 0.025, 0.015)
  }

  /** A part popping free after the wiggle. */
  pop(pan = 0) {
    const c = this.begin(pan)
    if (!c) return
    const { ctx, bus, t } = c
    this.burst(bus, t, { freq: 2600 * rand(0.9, 1.1), q: 1, gain: 0.7, decay: 0.03 })
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.frequency.setValueAtTime(700, t)
    o.frequency.exponentialRampToValueAtTime(1500, t + 0.05)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.09, t + 0.004)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07)
    o.connect(g).connect(bus)
    o.start(t)
    o.stop(t + 0.08)
  }

  /** Friction squeak while working a part loose. Returns a stopper. */
  creak(pan = 0) {
    const c = this.begin(pan)
    if (!c || !this.noise) return () => {}
    const { ctx, bus, t } = c
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    src.loop = true
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 1400
    bp.Q.value = 6
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.05, t + 0.12)
    // Stick-slip: the amplitude chatters as the part rocks.
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.frequency.value = 22
    lfoGain.gain.value = 0.035
    lfo.connect(lfoGain).connect(g.gain)
    const sweep = ctx.createOscillator()
    const sweepGain = ctx.createGain()
    sweep.frequency.value = 6
    sweepGain.gain.value = 500
    sweep.connect(sweepGain).connect(bp.frequency)
    src.connect(bp).connect(g).connect(bus)
    src.start(t)
    lfo.start(t)
    sweep.start(t)
    return () => {
      const now = ctx.currentTime
      g.gain.cancelScheduledValues(now)
      g.gain.setValueAtTime(g.gain.value, now)
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.04)
      for (const n of [src, lfo, sweep]) n.stop(now + 0.05)
    }
  }

  /** Grabbing a part out of the sorting tray. */
  rattle(pan = 0) {
    const c = this.begin(pan)
    if (!c) return
    const n = 5 + Math.floor(Math.random() * 4)
    for (let i = 0; i < n; i++) {
      const at = c.t + Math.pow(Math.random(), 1.6) * 0.16
      this.burst(c.bus, at, { freq: rand(2500, 6500), q: rand(1, 3), gain: rand(0.06, 0.22), decay: rand(0.004, 0.012) })
    }
  }

  /** A loose part landing in the dish: a hard first hit, then a couple of small bounces. */
  clatter(pan = 0) {
    const c = this.begin(pan)
    if (!c) return
    const hits = [0, rand(0.05, 0.07), rand(0.1, 0.13)]
    hits.forEach((dt, i) => {
      const amp = [0.7, 0.3, 0.12][i]
      this.burst(c.bus, c.t + dt, { freq: rand(2800, 4200), q: 1.2, gain: amp, decay: 0.018 })
      this.ring(c.bus, c.t + dt, rand(1300, 1700), 0.06 * amp, 0.04)
    })
    this.thump(c.bus, c.t, 260, 0.22, 0.05)
  }

  /** Can't go there: a dull knock of plastic on plastic. */
  bonk(pan = 0) {
    const c = this.begin(pan)
    if (!c) return
    this.burst(c.bus, c.t, { freq: 900, q: 0.7, gain: 0.4, decay: 0.03 })
    this.thump(c.bus, c.t, 210, 0.25, 0.05)
  }

  /** Turning the part in the fingers. */
  turn(pan = 0) {
    const c = this.begin(pan)
    if (!c) return
    this.burst(c.bus, c.t, { freq: 4200, q: 2, gain: 0.08, decay: 0.006 })
    this.burst(c.bus, c.t + 0.03, { freq: 3600, q: 2, gain: 0.06, decay: 0.006 })
  }

  private begin(pan: number) {
    if (!this.enabled || !this.ctx || !this.out || this.ctx.state !== 'running') return undefined
    const p = this.ctx.createStereoPanner()
    p.pan.value = Math.max(-1, Math.min(1, pan)) * 0.6
    p.connect(this.out)
    return { ctx: this.ctx, bus: p as AudioNode, t: this.ctx.currentTime + 0.005 }
  }

  private burst(bus: AudioNode, t: number, o: { freq: number; q: number; gain: number; decay: number }) {
    const ctx = this.ctx!
    const src = ctx.createBufferSource()
    src.buffer = this.noise!
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = o.freq
    bp.Q.value = o.q
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(o.gain, t + 0.0007)
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.decay)
    src.connect(bp).connect(g).connect(bus)
    src.start(t, Math.random() * 0.5)
    src.stop(t + o.decay + 0.01)
  }

  private ring(bus: AudioNode, t: number, freq: number, gain: number, decay: number) {
    const ctx = this.ctx!
    const o = ctx.createOscillator()
    o.frequency.value = freq
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(gain, t + 0.001)
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay)
    o.connect(g).connect(bus)
    o.start(t)
    o.stop(t + decay + 0.01)
  }

  private thump(bus: AudioNode, t: number, freq: number, gain: number, decay: number) {
    const ctx = this.ctx!
    const o = ctx.createOscillator()
    o.frequency.setValueAtTime(freq * 1.6, t)
    o.frequency.exponentialRampToValueAtTime(freq, t + 0.012)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(gain, t + 0.002)
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay)
    o.connect(g).connect(bus)
    o.start(t)
    o.stop(t + decay + 0.01)
  }
}

const rand = (a: number, b: number) => a + Math.random() * (b - a)
