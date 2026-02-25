// ===== ARCADE SOUNDS — Web Audio API =====
// No external audio files needed — generates 8-bit sounds procedurally

class ArcadeSounds {
  constructor() {
    this.muted = false;
    this.ctx = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio not supported');
    }
  }

  _play(type, frequency, duration, waveform = 'square', volume = 0.3) {
    if (this.muted || !this.initialized) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = waveform;
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + duration);
    } catch(e) {}
  }

  _playSequence(notes, waveform = 'square') {
    if (this.muted || !this.initialized) return;
    let t = this.ctx.currentTime;
    notes.forEach(([freq, dur, vol = 0.25]) => {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = waveform;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(vol, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.start(t);
        osc.stop(t + dur);
        t += dur;
      } catch(e) {}
    });
  }

  // ===== Sound effects =====

  click() {
    this.init();
    this._play('click', 440, 0.08, 'square', 0.2);
  }

  select() {
    this.init();
    this._playSequence([[440, 0.06], [660, 0.06]]);
  }

  hover() {
    this.init();
    this._play('hover', 330, 0.05, 'square', 0.1);
  }

  powerUp() {
    this.init();
    this._playSequence([
      [262, 0.08], [330, 0.08], [392, 0.08], [524, 0.08],
      [659, 0.08], [784, 0.12], [1047, 0.2, 0.3]
    ], 'square');
  }

  ko() {
    this.init();
    this._playSequence([
      [330, 0.05], [220, 0.05], [165, 0.1], [110, 0.2, 0.3]
    ], 'square');
  }

  hit() {
    this.init();
    this._playSequence([
      [880, 0.04, 0.3], [440, 0.04, 0.2], [220, 0.08, 0.15]
    ], 'square');
  }

  coin() {
    this.init();
    this._playSequence([
      [987, 0.06, 0.2], [1319, 0.12, 0.2]
    ], 'square');
  }

  stageComplete() {
    this.init();
    this._playSequence([
      [523, 0.1], [659, 0.1], [784, 0.1], [1047, 0.1],
      [784, 0.05], [1047, 0.3, 0.35]
    ], 'square');
  }

  formSubmit() {
    this.init();
    this._playSequence([
      [262, 0.07], [330, 0.07], [392, 0.07], [523, 0.07],
      [659, 0.07], [784, 0.07], [1047, 0.25, 0.35]
    ], 'square');
  }

  error() {
    this.init();
    this._playSequence([
      [220, 0.1, 0.3], [165, 0.1, 0.3], [110, 0.15, 0.3]
    ], 'square');
  }

  pressStart() {
    this.init();
    this._playSequence([
      [523, 0.1, 0.2], [523, 0.05, 0.1], [523, 0.05, 0.1],
      [659, 0.3, 0.3]
    ], 'square');
  }

  toggle(muted) {
    this.muted = muted;
    if (!muted) {
      this.init();
      this.select();
    }
  }
}

window.arcade = window.arcade || {};
window.arcade.sounds = new ArcadeSounds();
