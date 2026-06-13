/* ============================================
   CELEBRATION SCREEN — Full-screen success takeover sequencer
   Companion to feedback/celebration-screen.css (class prefix .cel-)
   ============================================
   Usage:
     CelebrationScreen.show({
       title: 'Order confirmed',
       subtitle: 'A receipt is on its way to your inbox',
       detail: [['Order', '#FE-48211'], ['Total', '$249.00']],
       actions: [
         { label: 'View order', primary: true, onClick: function () {} },
         { label: 'Continue shopping' }            // { close: false } keeps it open
       ],
       variant: 'burst',      // 'burst' | 'minimal' | 'dark' | 'light' | '' (default)
       confetti: true,        // fire window.Confetti if loaded (optional companion)
       autoHide: null,        // ms before auto-close, or null
       closeOnEsc: true,
       closeOnOverlay: true,
       onClose: function () {}
     });
     CelebrationScreen.hide();   // play exit choreography + remove

   Methods:
     show(opts) — builds the DOM, staggers mark → title → sub → card →
                  actions via timeouts, moves focus to the primary action
     hide()     — plays .is-out exit, removes node, restores focus
   Notes: reduced motion shows everything instantly and skips confetti;
   only one screen exists at a time (show() replaces a previous one).
   ============================================ */
(function (global) {
  'use strict';

  var MARK_SVG =
    '<svg viewBox="0 0 96 96" aria-hidden="true" focusable="false">' +
      '<circle class="cel-mark-ring" cx="48" cy="48" r="44"></circle>' +
      '<path class="cel-mark-check" d="M30 50 L44 64 L68 36"></path>' +
    '</svg>';

  /* sequence offsets composed from blessed steps: 120, +480, +160, +160, +160 */
  var SEQ = { mark: 120, title: 600, sub: 760, card: 920, actions: 1080, focus: 1100, confetti: 640 };

  var state = null;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function prefersReduced() {
    return typeof global.matchMedia === 'function' &&
      global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function later(fn, ms) {
    if (!state) return;
    state.timers.push(setTimeout(fn, ms));
  }

  function fireConfetti() {
    if (!global.Confetti) return;
    try {
      global.Confetti.burst({ x: 0.5, y: 0.42, count: 130, spread: 80, startVelocity: 38 });
      later(function () {
        global.Confetti.cannon('left');
        global.Confetti.cannon('right');
      }, 320);
    } catch (e) { /* confetti is decorative — never let it break the screen */ }
  }

  function onKeydown(e) {
    if (!state) return;
    if (e.key === 'Escape' && state.opts.closeOnEsc !== false) {
      e.preventDefault();
      hide();
      return;
    }
    if (e.key === 'Tab') {
      var f = state.root.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
      if (!f.length) { e.preventDefault(); state.root.focus(); return; }
      var first = f[0], last = f[f.length - 1], active = document.activeElement;
      if (e.shiftKey && (active === first || !state.root.contains(active))) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && (active === last || !state.root.contains(active))) {
        e.preventDefault(); first.focus();
      }
    }
  }

  function destroy() {
    if (!state) return;
    var s = state;
    state = null;
    s.timers.forEach(clearTimeout);
    document.removeEventListener('keydown', onKeydown, true);
    if (s.root.parentNode) s.root.parentNode.removeChild(s.root);
    document.body.style.overflow = s.prevOverflow;
    if (s.prevFocus && typeof s.prevFocus.focus === 'function') {
      try { s.prevFocus.focus(); } catch (e) {}
    }
    if (typeof s.opts.onClose === 'function') s.opts.onClose();
  }

  function hide() {
    if (!state || state.closing) return;
    state.closing = true;
    state.timers.forEach(clearTimeout);
    state.timers = [];
    if (prefersReduced()) { destroy(); return; }
    state.root.classList.add('is-out');
    state.timers.push(setTimeout(destroy, 380)); /* 260ms fade + 90ms delay + slack */
  }

  function show(opts) {
    opts = opts || {};
    if (state) destroy(); /* one screen at a time */

    var variant = opts.variant ? ' cel--' + opts.variant : '';
    var root = el('div', 'cel' + variant);
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', opts.title || 'Success');
    root.tabIndex = -1;

    root.appendChild(el('div', 'cel-rays'));

    var stage = el('div', 'cel-stage');
    root.appendChild(stage);

    var mark = el('div', 'cel-mark');
    mark.innerHTML = MARK_SVG;
    stage.appendChild(mark);

    var title = null, sub = null, card = null, actions = null, primaryBtn = null;

    if (opts.title) stage.appendChild(title = el('h2', 'cel-title', opts.title));
    if (opts.subtitle) stage.appendChild(sub = el('p', 'cel-sub', opts.subtitle));

    if (opts.detail && opts.detail.length) {
      card = el('div', 'cel-detail-card');
      opts.detail.forEach(function (pair) {
        var row = el('div', 'cel-row');
        row.appendChild(el('span', 'cel-row-label', pair[0]));
        row.appendChild(el('span', 'cel-row-value', pair[1]));
        card.appendChild(row);
      });
      stage.appendChild(card);
    }

    if (opts.actions && opts.actions.length) {
      actions = el('div', 'cel-actions');
      opts.actions.forEach(function (a) {
        var btn = el('button', 'cel-btn ' + (a.primary ? 'cel-btn--primary' : 'cel-btn--ghost'), a.label || 'OK');
        btn.type = 'button';
        btn.addEventListener('click', function (ev) {
          if (typeof a.onClick === 'function') a.onClick(ev);
          if (a.close !== false) hide();
        });
        if (a.primary && !primaryBtn) primaryBtn = btn;
        actions.appendChild(btn);
      });
      if (!primaryBtn) primaryBtn = actions.firstChild;
      stage.appendChild(actions);
    }

    root.addEventListener('click', function (e) {
      if (e.target === root && opts.closeOnOverlay !== false) hide();
    });

    state = {
      root: root,
      opts: opts,
      timers: [],
      closing: false,
      prevFocus: document.activeElement,
      prevOverflow: document.body.style.overflow
    };

    document.body.appendChild(root);
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeydown, true);

    var seqEls = [mark, title, sub, card, actions];

    if (prefersReduced()) {
      /* instant show — no choreography, no confetti */
      root.classList.add('is-in');
      seqEls.forEach(function (n) { if (n) n.classList.add('is-in'); });
      (primaryBtn || root).focus();
    } else {
      void root.offsetWidth; /* commit hidden state before transitioning */
      root.classList.add('is-in');
      later(function () { mark.classList.add('is-in'); }, SEQ.mark);
      if (title) later(function () { title.classList.add('is-in'); }, SEQ.title);
      if (sub) later(function () { sub.classList.add('is-in'); }, SEQ.sub);
      if (card) later(function () { card.classList.add('is-in'); }, SEQ.card);
      if (actions) later(function () { actions.classList.add('is-in'); }, SEQ.actions);
      later(function () { (primaryBtn || root).focus(); }, SEQ.focus);
      if (opts.confetti !== false) later(fireConfetti, SEQ.confetti);
    }

    if (typeof opts.autoHide === 'number' && opts.autoHide > 0) later(hide, opts.autoHide);

    return root;
  }

  var CelebrationScreen = { show: show, hide: hide };

  if (typeof module !== 'undefined' && module.exports) { module.exports = CelebrationScreen; } else { global.CelebrationScreen = CelebrationScreen; }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
