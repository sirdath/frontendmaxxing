/* ============================================
   DISCLOSURE PACK — JS glue for collapsibles, switches, voice
   ============================================
   Usage:
     DisclosurePack.drop('[data-dp-drop]');
     DisclosurePack.switch_('[data-dp-switch]', { onChange: function (on) {} });
     DisclosurePack.float('[data-dp-float-host]');
     DisclosurePack.layer('[data-dp-layer]');     // for back-buttons
     DisclosurePack.task('[data-dp-task]');
   ============================================ */
(function (root) {
  'use strict';

  function each(target, fn) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, fn);
  }

  function drop(target) {
    each(target, function (host) {
      var head = host.querySelector('.dp-drop-head');
      if (!head) return;
      head.addEventListener('click', function () {
        host.classList.toggle('is-open');
      });
    });
  }

  function switch_(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var toggle = host.querySelector('.dp-switch-toggle');
      if (!toggle) return;
      toggle.addEventListener('click', function () {
        var on = host.classList.toggle('is-on');
        if (typeof opts.onChange === 'function') opts.onChange(on);
      });
    });
  }

  function floatPanel(target) {
    each(target, function (host) {
      var panel = host.querySelector('.dp-float');
      if (!panel) return;
      host.addEventListener('click', function (e) {
        if (e.target.closest('.dp-float-item')) { panel.classList.remove('is-open'); return; }
        panel.classList.toggle('is-open');
      });
      document.addEventListener('click', function (e) {
        if (!host.contains(e.target)) panel.classList.remove('is-open');
      });
    });
  }

  function layer(target) {
    each(target, function (host) {
      var panes = host.querySelectorAll('.dp-layer-pane');
      panes.forEach(function (pane, i) {
        var nextBtns = pane.querySelectorAll('[data-dp-next]');
        nextBtns.forEach(function (btn) {
          btn.addEventListener('click', function () {
            panes.forEach(function (p) { p.classList.remove('is-shown', 'is-hidden-back'); });
            for (var j = 0; j < i + 1; j++) panes[j] && panes[j].classList.add('is-hidden-back');
            if (panes[i + 1]) panes[i + 1].classList.add('is-shown');
          });
        });
        var back = pane.querySelector('.dp-layer-back');
        if (back) back.addEventListener('click', function () {
          if (i === 0) return;
          panes.forEach(function (p) { p.classList.remove('is-shown', 'is-hidden-back'); });
          for (var j = 0; j < i - 1; j++) panes[j].classList.add('is-hidden-back');
          panes[i - 1].classList.add('is-shown');
        });
      });
    });
  }

  function task(target) {
    each(target, function (host) {
      host.addEventListener('click', function (e) {
        if (e.target.closest('a, button:not(.dp-task-head)')) return;
        host.classList.toggle('is-open');
      });
    });
  }

  var DisclosurePack = { drop: drop, switch_: switch_, float: floatPanel, layer: layer, task: task };
  if (typeof module !== 'undefined' && module.exports) module.exports = DisclosurePack;
  else root.DisclosurePack = DisclosurePack;
})(typeof window !== 'undefined' ? window : this);
