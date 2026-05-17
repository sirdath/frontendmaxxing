/* ============================================
   TIMER PACK — Pomodoro / Focus / Stopwatch / Alarm logic
   ============================================
   Usage:
     TimerPack.pomodoro('[data-tmr-pom]', {
       work: 25*60, break: 5*60, longBreak: 15*60, rounds: 4,
       onTick: function (s, phase) {}, onPhase: function (phase) {}, onComplete: function () {}
     });
     TimerPack.focus('[data-tmr-focus]', { duration: 25*60, onTick: fn, onDone: fn });
     TimerPack.stopwatch('[data-tmr-watch]', { onLap: function (i, lap) {}, onStop: function (total) {} });
     TimerPack.alarm('[data-tmr-alarm]', { time: '07:30', onToggle: fn });
   ============================================ */
(function (root) {
  'use strict';

  function each(target, fn) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, fn);
  }

  function fmt(s) {
    var m = Math.floor(s / 60);
    var r = Math.floor(s % 60);
    return (m < 10 ? '0' : '') + m + ':' + (r < 10 ? '0' : '') + r;
  }
  function fmtMs(ms) {
    var s = Math.floor(ms / 1000);
    var m = Math.floor(s / 60);
    var sec = s % 60;
    var hund = Math.floor((ms % 1000) / 10);
    return (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec + ':' + (hund < 10 ? '0' : '') + hund;
  }

  function pomodoro(target, opts) {
    opts = opts || {};
    var work = opts.work || 25 * 60;
    var brk = opts.break || 5 * 60;
    var long = opts.longBreak || 15 * 60;
    var rounds = opts.rounds || 4;

    each(target, function (host) {
      var phase = 'work', round = 0, remain = work, running = false, timer = null;
      var timeEl = host.querySelector('.tmr-pom-time');
      var phaseEl = host.querySelector('.tmr-pom-phase');
      var play = host.querySelector('.tmr-pom-controls .play');
      var reset = host.querySelector('.tmr-pom-controls .reset');
      var skip = host.querySelector('.tmr-pom-controls .skip');
      var dotsEl = host.querySelector('.tmr-pom-dots');

      function renderDots() {
        if (!dotsEl) return;
        dotsEl.innerHTML = '';
        for (var i = 0; i < rounds; i++) {
          var d = document.createElement('i');
          if (i < round) d.classList.add('is-done');
          dotsEl.appendChild(d);
        }
      }
      function render() {
        if (timeEl) timeEl.textContent = fmt(remain);
        if (phaseEl) phaseEl.textContent = phase === 'work' ? 'Focus' : (phase === 'break' ? 'Break' : 'Long break');
        host.classList.toggle('is-break', phase !== 'work');
        renderDots();
      }
      function nextPhase() {
        if (phase === 'work') {
          round++;
          phase = (round % rounds === 0) ? 'long' : 'break';
          remain = phase === 'long' ? long : brk;
        } else {
          phase = 'work';
          remain = work;
        }
        if (typeof opts.onPhase === 'function') opts.onPhase(phase);
        render();
      }
      function tick() {
        remain--;
        render();
        if (typeof opts.onTick === 'function') opts.onTick(remain, phase);
        if (remain <= 0) {
          if (typeof opts.onComplete === 'function') opts.onComplete(phase);
          nextPhase();
        }
      }
      function start() {
        if (running) return;
        running = true; timer = setInterval(tick, 1000);
        if (play) play.textContent = '❚❚';
      }
      function pause() {
        running = false; clearInterval(timer); timer = null;
        if (play) play.textContent = '▶';
      }
      function reset0() {
        pause(); phase = 'work'; round = 0; remain = work; render();
      }
      if (play) play.addEventListener('click', function () { running ? pause() : start(); });
      if (reset) reset.addEventListener('click', reset0);
      if (skip) skip.addEventListener('click', nextPhase);

      render();
    });
  }

  function focusTimer(target, opts) {
    opts = opts || {};
    var dur = opts.duration || 25 * 60;
    each(target, function (host) {
      var remain = dur, running = false, timer = null;
      var timeEl = host.querySelector('.tmr-focus-time');
      function render() {
        if (timeEl) timeEl.textContent = fmt(remain);
        var pct = ((dur - remain) / dur) * 100;
        host.style.setProperty('--pct', pct.toFixed(1));
      }
      function tick() {
        remain--;
        render();
        if (typeof opts.onTick === 'function') opts.onTick(remain);
        if (remain <= 0) {
          clearInterval(timer); running = false;
          if (typeof opts.onDone === 'function') opts.onDone();
        }
      }
      function start() { if (running) return; running = true; timer = setInterval(tick, 1000); }
      function pause() { running = false; clearInterval(timer); }
      function reset() { pause(); remain = dur; render(); }
      host.addEventListener('click', function () { running ? pause() : start(); });
      render();
      return { start: start, pause: pause, reset: reset };
    });
  }

  function stopwatch(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var elapsed = 0, startTime = 0, running = false, raf;
      var laps = [];
      var timeEl = host.querySelector('.tmr-watch-time');
      var startBtn = host.querySelector('.tmr-watch-controls .start');
      var stopBtn = host.querySelector('.tmr-watch-controls .stop');
      var lapBtn = host.querySelector('.tmr-watch-controls .lap');
      var resetBtn = host.querySelector('.tmr-watch-controls .reset');
      var lapsEl = host.querySelector('.tmr-watch-laps');

      function render() {
        if (timeEl) timeEl.innerHTML = fmtMs(elapsed).replace(/(:\d\d)$/, '<small>$1</small>');
      }
      function tick() {
        elapsed = Date.now() - startTime;
        render();
        if (running) raf = requestAnimationFrame(tick);
      }
      function start() {
        if (running) return;
        running = true; startTime = Date.now() - elapsed;
        raf = requestAnimationFrame(tick);
      }
      function stop() { running = false; if (raf) cancelAnimationFrame(raf); if (typeof opts.onStop === 'function') opts.onStop(elapsed); }
      function reset() { stop(); elapsed = 0; laps = []; if (lapsEl) lapsEl.innerHTML = ''; render(); }
      function lap() {
        laps.push(elapsed);
        if (lapsEl) {
          var row = document.createElement('div');
          row.className = 'tmr-watch-lap';
          row.innerHTML = '<span>Lap ' + laps.length + '</span><span>' + fmtMs(elapsed) + '</span>';
          lapsEl.prepend(row);
          if (laps.length > 1) {
            var times = laps.map(function (l, i) { return i === 0 ? l : l - laps[i - 1]; });
            var best = Math.min.apply(null, times);
            var worst = Math.max.apply(null, times);
            Array.from(lapsEl.children).forEach(function (r, i) {
              r.classList.remove('best', 'worst');
              var t = times[times.length - 1 - i];
              if (t === best) r.classList.add('best');
              if (t === worst) r.classList.add('worst');
            });
          }
        }
        if (typeof opts.onLap === 'function') opts.onLap(laps.length, elapsed);
      }
      if (startBtn) startBtn.addEventListener('click', start);
      if (stopBtn) stopBtn.addEventListener('click', stop);
      if (lapBtn) lapBtn.addEventListener('click', lap);
      if (resetBtn) resetBtn.addEventListener('click', reset);
      render();
    });
  }

  function alarm(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var toggle = host.querySelector('.tmr-alarm-toggle');
      if (toggle) toggle.addEventListener('click', function () {
        var on = host.classList.toggle('is-on');
        if (typeof opts.onToggle === 'function') opts.onToggle(on);
      });
    });
  }

  var TimerPack = { pomodoro: pomodoro, focus: focusTimer, stopwatch: stopwatch, alarm: alarm };
  if (typeof module !== 'undefined' && module.exports) module.exports = TimerPack;
  else root.TimerPack = TimerPack;
})(typeof window !== 'undefined' ? window : this);
