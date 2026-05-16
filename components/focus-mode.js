/* ============================================
   FOCUS MODE — Toggle controller, peek-on-mousemove, optional Pomodoro
   Inspired by Arc, iA Writer, Linear focus
   ============================================
   Usage:
     FocusMode.init({
       keepSelector: '.focus-keep',
       dimOpacity: 0.18,
       peekOnHover: true,
       pomodoro: { duration: 25 * 60 * 1000, breakDuration: 5 * 60 * 1000, onComplete: () => {} },
       ambient: 'cosmic',
       triggerKey: 'F11'
     });

     FocusMode.enter();
     FocusMode.exit();
     FocusMode.toggle();
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    keepSelector: '.focus-keep',
    dimOpacity: 0.18,
    peekOnHover: true,
    peekTimeout: 2000,
    pomodoro: null,
    ambient: 'cosmic',
    triggerKey: 'F11',
    showBar: true,
    onEnter: null,
    onExit: null
  };

  var state = {
    opts: null,
    active: false,
    bar: null,
    pom: null,
    pomTimerId: null,
    pomEnd: null,
    peekTimer: null
  };

  function init(opts) {
    state.opts = mergeOpts(opts);
    document.addEventListener('keydown', function (e) {
      if (e.key === state.opts.triggerKey || (e.key === 'Escape' && state.active)) {
        e.preventDefault();
        toggle();
      }
    });
  }

  function enter() {
    if (state.active) return;
    state.active = true;
    document.body.classList.add('fm-active', 'fm-' + state.opts.ambient);
    document.body.style.setProperty('--fm-dim-opacity', state.opts.dimOpacity);

    // Mark dim siblings of .focus-keep
    var keeps = Array.from(document.querySelectorAll(state.opts.keepSelector));
    var keepers = new Set();
    keeps.forEach(function (k) {
      var cur = k;
      while (cur) { keepers.add(cur); cur = cur.parentElement; }
    });
    Array.from(document.body.children).forEach(function (child) {
      if (!keepers.has(child)) child.classList.add('fm-dim');
    });

    // Build floating bar
    if (state.opts.showBar) buildBar();

    // Peek on mousemove (re-show dimmed UI for a moment)
    if (state.opts.peekOnHover) {
      document.addEventListener('mousemove', onMouseMovePeek);
    }

    if (state.opts.pomodoro) startPomodoro(state.opts.pomodoro.duration);
    if (typeof state.opts.onEnter === 'function') state.opts.onEnter();
  }

  function exit() {
    if (!state.active) return;
    state.active = false;
    document.body.classList.remove('fm-active', 'fm-' + state.opts.ambient, 'fm-peek');
    document.querySelectorAll('.fm-dim').forEach(function (el) { el.classList.remove('fm-dim'); });
    if (state.bar) { state.bar.remove(); state.bar = null; }
    document.removeEventListener('mousemove', onMouseMovePeek);
    if (state.peekTimer) { clearTimeout(state.peekTimer); state.peekTimer = null; }
    stopPomodoro();
    if (typeof state.opts.onExit === 'function') state.opts.onExit();
  }

  function toggle() { state.active ? exit() : enter(); }

  function onMouseMovePeek() {
    document.body.classList.add('fm-peek');
    if (state.peekTimer) clearTimeout(state.peekTimer);
    state.peekTimer = setTimeout(function () {
      document.body.classList.remove('fm-peek');
    }, state.opts.peekTimeout);
  }

  function buildBar() {
    state.bar = document.createElement('div');
    state.bar.className = 'fm-bar';
    state.bar.innerHTML =
      '<button class="fm-pom-toggle" aria-label="Pomodoro" title="Start/pause timer">⏱</button>' +
      (state.opts.pomodoro ?
        '<span class="fm-pom">' +
          '<svg class="fm-pom-arc" viewBox="0 0 24 24">' +
            '<circle class="fm-pom-track" cx="12" cy="12" r="9"/>' +
            '<circle class="fm-pom-fill" cx="12" cy="12" r="9"/>' +
          '</svg>' +
          '<span class="fm-pom-time">--:--</span>' +
        '</span>' : '') +
      '<button class="fm-ambient-toggle" aria-label="Ambient">✨</button>' +
      '<button class="fm-exit" aria-label="Exit focus">✕</button>';
    document.body.appendChild(state.bar);

    state.pom = state.bar.querySelector('.fm-pom');
    state.bar.querySelector('.fm-exit').addEventListener('click', exit);
    state.bar.querySelector('.fm-ambient-toggle').addEventListener('click', cycleAmbient);
    var pt = state.bar.querySelector('.fm-pom-toggle');
    if (pt) pt.addEventListener('click', function () {
      if (state.pomTimerId) pausePomodoro();
      else startPomodoro(state.opts.pomodoro ? state.opts.pomodoro.duration : 25 * 60 * 1000);
    });
  }

  function cycleAmbient() {
    var order = ['cosmic', 'warm', 'cool', 'none'];
    var i = order.indexOf(state.opts.ambient);
    document.body.classList.remove('fm-' + state.opts.ambient);
    state.opts.ambient = order[(i + 1) % order.length];
    document.body.classList.add('fm-' + state.opts.ambient);
  }

  function startPomodoro(duration) {
    state.pomEnd = Date.now() + duration;
    stopPomodoro();
    state.pomTimerId = setInterval(tickPom, 250);
    if (state.pom) state.pom.classList.remove('is-finished');
    tickPom();
  }
  function pausePomodoro() {
    if (state.pomTimerId) { clearInterval(state.pomTimerId); state.pomTimerId = null; }
  }
  function stopPomodoro() {
    if (state.pomTimerId) clearInterval(state.pomTimerId);
    state.pomTimerId = null;
    state.pomEnd = null;
  }
  function tickPom() {
    if (!state.pom || !state.pomEnd) return;
    var remaining = Math.max(0, state.pomEnd - Date.now());
    var total = state.opts.pomodoro ? state.opts.pomodoro.duration : 1;
    var pct = remaining / total;
    state.pom.style.setProperty('--p-pct', pct.toFixed(3));
    state.pom.querySelector('.fm-pom-time').textContent = formatMs(remaining);
    state.pom.classList.toggle('is-low', pct < 0.2 && remaining > 0);
    if (remaining <= 0) {
      stopPomodoro();
      state.pom.classList.add('is-finished');
      state.pom.querySelector('.fm-pom-time').textContent = '✓';
      if (state.opts.pomodoro && typeof state.opts.pomodoro.onComplete === 'function') {
        state.opts.pomodoro.onComplete();
      }
    }
  }
  function formatMs(ms) {
    var s = Math.ceil(ms / 1000);
    var m = Math.floor(s / 60);
    var ss = (s % 60).toString().padStart(2, '0');
    return m + ':' + ss;
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var FocusMode = {
    init: init,
    enter: enter,
    exit: exit,
    toggle: toggle,
    startPomodoro: startPomodoro,
    pausePomodoro: pausePomodoro
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = FocusMode;
  else root.FocusMode = FocusMode;
})(typeof window !== 'undefined' ? window : this);
