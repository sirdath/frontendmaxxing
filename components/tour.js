/* ============================================
   TOUR — Spotlight onboarding walkthrough engine
   Inspired by Shepherd.js / driver.js / Intro.js
   ============================================
   Usage:
     Tour.start([
       { target: '#nav', title: 'Welcome', text: 'Here is your nav.', placement: 'bottom' },
       { target: '#cta', title: 'Try this', text: 'Click to start.', scrollTo: true },
       { target: '#footer', title: 'Done', text: 'You can revisit any time.' }
     ], {
       onFinish: function () { … },
       onSkip:   function () { … }
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    onNext: null,
    onFinish: null,
    onSkip: null,
    spotPad: 6,
    scrollTo: true,
    closeOnEscape: true
  };

  var state = null;

  function start(steps, opts) {
    if (!steps || !steps.length) return;
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    // Build elements
    var overlay = document.createElement('div');
    overlay.className = 'tour-overlay';
    var spot = document.createElement('div');
    spot.className = 'tour-spot';
    var pop = document.createElement('div');
    pop.className = 'tour-pop';
    document.body.appendChild(overlay);
    document.body.appendChild(spot);
    document.body.appendChild(pop);

    state = { steps: steps, i: 0, overlay: overlay, spot: spot, pop: pop, opts: o };
    render();

    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', render);
    window.addEventListener('scroll', render, true);
  }

  function render() {
    if (!state) return;
    var step = state.steps[state.i];
    var target = typeof step.target === 'string'
      ? document.querySelector(step.target)
      : step.target;
    if (!target) {
      // No target — center the popover
      placeSpot(null);
      placePop(null, step.placement);
    } else {
      if (state.opts.scrollTo && step.scrollTo !== false) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      placeSpot(target);
      placePop(target, step.placement);
    }
    paintPop(step);
  }

  function placeSpot(target) {
    if (!target) {
      state.spot.style.display = 'none';
      return;
    }
    state.spot.style.display = 'block';
    var r = target.getBoundingClientRect();
    var pad = state.opts.spotPad;
    state.spot.style.top    = (r.top - pad) + 'px';
    state.spot.style.left   = (r.left - pad) + 'px';
    state.spot.style.width  = (r.width + pad * 2) + 'px';
    state.spot.style.height = (r.height + pad * 2) + 'px';
  }

  function placePop(target, placement) {
    var p = state.pop;
    p.style.visibility = 'hidden';
    if (!target) {
      p.style.left = '50%';
      p.style.top  = '50%';
      p.style.transform = 'translate(-50%, -50%)';
      p.setAttribute('data-placement', 'center');
      p.style.visibility = 'visible';
      return;
    }
    p.style.transform = '';
    var r = target.getBoundingClientRect();
    var pr = p.getBoundingClientRect();
    placement = placement || 'bottom';
    // Auto-flip if not enough room
    if (placement === 'bottom' && r.bottom + pr.height + 16 > window.innerHeight) placement = 'top';
    if (placement === 'top' && r.top - pr.height - 16 < 0) placement = 'bottom';

    var x, y;
    if (placement === 'bottom') { x = r.left; y = r.bottom + 12; }
    else if (placement === 'top') { x = r.left; y = r.top - pr.height - 12; }
    else if (placement === 'right') { x = r.right + 12; y = r.top; }
    else { x = r.left - pr.width - 12; y = r.top; }
    x = Math.max(8, Math.min(window.innerWidth - pr.width - 8, x));
    y = Math.max(8, Math.min(window.innerHeight - pr.height - 8, y));
    p.style.left = x + 'px';
    p.style.top  = y + 'px';
    p.setAttribute('data-placement', placement);
    p.style.visibility = 'visible';
  }

  function paintPop(step) {
    var total = state.steps.length;
    var dots = state.steps.map(function (_, i) {
      return '<span' + (i === state.i ? ' class="is-active"' : '') + '></span>';
    }).join('');
    state.pop.innerHTML =
      '<div class="tour-dots">' + dots + '</div>' +
      '<h3 class="tour-title">' + escapeHTML(step.title || '') + '</h3>' +
      '<p class="tour-text">' + escapeHTML(step.text || '') + '</p>' +
      '<div class="tour-actions">' +
        '<span class="tour-counter">' + (state.i + 1) + ' / ' + total + '</span>' +
        '<button class="is-skip" data-tour-skip>Skip</button>' +
        (state.i > 0 ? '<button data-tour-back>Back</button>' : '') +
        '<button class="is-primary" data-tour-next>' +
          (state.i < total - 1 ? 'Next →' : 'Finish') +
        '</button>' +
      '</div>';
    state.pop.querySelector('[data-tour-next]').addEventListener('click', next);
    var back = state.pop.querySelector('[data-tour-back]');
    if (back) back.addEventListener('click', prev);
    state.pop.querySelector('[data-tour-skip]').addEventListener('click', skip);
  }

  function next() {
    if (typeof state.opts.onNext === 'function') state.opts.onNext(state.i, state.steps[state.i]);
    if (state.i < state.steps.length - 1) {
      state.i++;
      render();
    } else {
      finish();
    }
  }
  function prev() {
    if (state.i > 0) { state.i--; render(); }
  }
  function skip() {
    if (typeof state.opts.onSkip === 'function') state.opts.onSkip();
    destroy();
  }
  function finish() {
    if (typeof state.opts.onFinish === 'function') state.opts.onFinish();
    destroy();
  }
  function destroy() {
    if (!state) return;
    state.overlay.remove();
    state.spot.remove();
    state.pop.remove();
    document.removeEventListener('keydown', onKey);
    window.removeEventListener('resize', render);
    window.removeEventListener('scroll', render, true);
    state = null;
  }

  function onKey(e) {
    if (!state) return;
    if (e.key === 'Escape' && state.opts.closeOnEscape) skip();
    else if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft')  prev();
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var Tour = { start: start, next: next, prev: prev, skip: skip, finish: finish };

  if (typeof module !== 'undefined' && module.exports) module.exports = Tour;
  else root.Tour = Tour;
})(typeof window !== 'undefined' ? window : this);
