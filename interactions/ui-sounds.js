/* ============================================
   UI SOUNDS — Synthesized interface sounds (click / hover / success / error / toggle)
   Inspired by the WebAudio UI-sound patterns popularized by Vercel & Family
   ============================================
   Pure Web Audio synthesis — NO asset files, no network. A lazy AudioContext is
   created on the first user gesture (autoplay-policy safe), a global mute is
   respected, and decorative sound is silenced for prefers-reduced-motion users
   by default.

   Usage:
     UiSounds.init('[data-ui-sound]');           // auto-wire: <button data-ui-sound="click">
     UiSounds.play('success');                   // programmatic
     UiSounds.mute(true);  UiSounds.volume(0.5); // global controls

   Sounds: click · hover · success · error · toggle · pop
   Options: { volume, waveform, respectReducedMotion }
   ============================================ */
(function (root) {
  'use strict';

  var ctx = null;
  var master = null;
  var state = { muted: false, volume: 0.5, respectReducedMotion: true };

  function reducedMotion() {
    return root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Lazily build the AudioContext — browsers block it until a user gesture, so
  // the first play() after an interaction unlocks it.
  function audio() {
    if (ctx) return ctx;
    var AC = root.AudioContext || root.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = state.volume;
    master.connect(ctx.destination);
    return ctx;
  }

  // A single voice: oscillator → gain envelope → master. Returns nothing; fire-and-forget.
  function voice(freq, opts) {
    var c = audio();
    if (!c) return;
    if (c.state === 'suspended') c.resume();
    var t = c.currentTime;
    var dur = opts.dur || 0.12;
    var osc = c.createOscillator();
    var g = c.createGain();
    osc.type = opts.type || 'sine';
    osc.frequency.setValueAtTime(freq, t);
    if (opts.to) osc.frequency.exponentialRampToValueAtTime(opts.to, t + dur);
    var peak = (opts.gain == null ? 0.6 : opts.gain);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); g.connect(master);
    osc.start(t); osc.stop(t + dur + 0.02);
  }

  // The synthesized sound bank. Each is one or two short voices.
  var BANK = {
    click:   function (o) { voice(1100, { type: o.waveform || 'triangle', dur: 0.045, gain: 0.5 }); },
    hover:   function (o) { voice(520, { type: o.waveform || 'sine', dur: 0.05, gain: 0.18 }); },
    pop:     function (o) { voice(420, { type: o.waveform || 'sine', to: 900, dur: 0.09, gain: 0.4 }); },
    toggle:  function (o) { voice(700, { type: o.waveform || 'square', dur: 0.04, gain: 0.28 }); },
    success: function (o) { voice(660, { type: 'sine', dur: 0.1, gain: 0.4 }); setTimeout(function () { voice(990, { type: 'sine', dur: 0.16, gain: 0.4 }); }, 70); },
    error:   function (o) { voice(240, { type: 'sawtooth', to: 150, dur: 0.18, gain: 0.34 }); },
  };

  function play(name, opts) {
    var o = Object.assign({}, state, opts || {});
    if (o.muted) return;
    if (o.respectReducedMotion && reducedMotion()) return;
    var fn = BANK[name];
    if (!fn) { if (root.console) console.warn('[UiSounds] unknown sound "' + name + '"'); return; }
    if (master) master.gain.value = o.volume;
    fn(o);
  }

  function mute(on) { state.muted = on !== false; }
  function volume(v) { state.volume = Math.max(0, Math.min(1, +v || 0)); if (master) master.gain.value = state.volume; }

  // Wire elements: [data-ui-sound] plays on click; [data-ui-sound-hover] on pointerenter.
  function bind(el) {
    var click = el.getAttribute('data-ui-sound');
    var hover = el.getAttribute('data-ui-sound-hover');
    var onClick = function () { play(click || 'click'); };
    var onHover = function () { play(hover || 'hover'); };
    if (click !== null) el.addEventListener('click', onClick);
    if (hover !== null) el.addEventListener('pointerenter', onHover);
    return { el: el, destroy: function () { el.removeEventListener('click', onClick); el.removeEventListener('pointerenter', onHover); } };
  }

  function init(target, opts) {
    if (opts) Object.assign(state, opts);
    var sel = target || '[data-ui-sound], [data-ui-sound-hover]';
    var nodes = typeof sel === 'string' ? document.querySelectorAll(sel) : [sel];
    var arr = [];
    Array.prototype.forEach.call(nodes, function (n) { arr.push(bind(n)); });
    return arr;
  }

  var UiSounds = { init: init, bind: bind, play: play, mute: mute, volume: volume, sounds: Object.keys(BANK) };
  if (typeof module !== 'undefined' && module.exports) module.exports = UiSounds;
  else root.UiSounds = UiSounds;
})(typeof window !== 'undefined' ? window : this);
