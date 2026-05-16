/* ============================================
   POPOVER — Position a floating panel near a trigger
   Inspired by Radix Popover / Floating UI
   ============================================
   Usage:
     // Wires up [data-popover-trigger="#id"]:
     Popover.init('.pop', { placement: 'bottom', offset: 8 });

     // Or attach manually:
     Popover.attach(trigger, popoverEl, { placement: 'right' });

   placements: 'top' | 'bottom' | 'left' | 'right'
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    placement: 'bottom',
    offset: 10,
    trigger: 'click'    // 'click' | 'hover'
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) {
      var trigger = document.querySelector('[data-popover-trigger="#' + el.id + '"]');
      if (trigger) instances.push(attach(trigger, el, opts));
    });
    return instances.length === 1 ? instances[0] : instances;
  }

  function attach(trigger, panel, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    function position() {
      var t = trigger.getBoundingClientRect();
      var p = panel.getBoundingClientRect();
      var x = 0, y = 0;
      var place = o.placement;

      // Auto-flip if not enough space
      if (place === 'top' && t.top - p.height - o.offset < 8) place = 'bottom';
      if (place === 'bottom' && t.bottom + p.height + o.offset > window.innerHeight - 8) place = 'top';
      if (place === 'left' && t.left - p.width - o.offset < 8) place = 'right';
      if (place === 'right' && t.right + p.width + o.offset > window.innerWidth - 8) place = 'left';

      if (place === 'bottom') { x = t.left + t.width / 2 - p.width / 2;          y = t.bottom + o.offset; }
      else if (place === 'top') { x = t.left + t.width / 2 - p.width / 2;        y = t.top - p.height - o.offset; }
      else if (place === 'left') { x = t.left - p.width - o.offset;              y = t.top + t.height / 2 - p.height / 2; }
      else if (place === 'right') { x = t.right + o.offset;                       y = t.top + t.height / 2 - p.height / 2; }

      // Clamp to viewport
      x = Math.max(8, Math.min(window.innerWidth - p.width - 8, x));
      y = Math.max(8, Math.min(window.innerHeight - p.height - 8, y));
      panel.style.position = 'fixed';
      panel.style.left = x + 'px';
      panel.style.top  = y + 'px';
      panel.style.setProperty('--pop-origin',
        place === 'top' ? 'bottom center' :
        place === 'bottom' ? 'top center' :
        place === 'left' ? 'center right' : 'center left');

      // Arrow
      var arrow = panel.querySelector('.pop-arrow');
      if (arrow) {
        if (place === 'bottom') { arrow.style.left = (t.left + t.width / 2 - x - 5) + 'px'; arrow.style.top = '-5px'; arrow.style.borderTop = '1px solid var(--pop-border)'; arrow.style.borderLeft = '1px solid var(--pop-border)'; arrow.style.borderRight = 'none'; arrow.style.borderBottom = 'none'; }
        else if (place === 'top') { arrow.style.left = (t.left + t.width / 2 - x - 5) + 'px'; arrow.style.top = 'calc(100% - 5px)'; arrow.style.borderBottom = '1px solid var(--pop-border)'; arrow.style.borderRight = '1px solid var(--pop-border)'; arrow.style.borderTop = 'none'; arrow.style.borderLeft = 'none'; }
        else if (place === 'right') { arrow.style.left = '-5px'; arrow.style.top = (t.top + t.height / 2 - y - 5) + 'px'; arrow.style.borderLeft = '1px solid var(--pop-border)'; arrow.style.borderBottom = '1px solid var(--pop-border)'; arrow.style.borderRight = 'none'; arrow.style.borderTop = 'none'; }
        else if (place === 'left') { arrow.style.left = 'calc(100% - 5px)'; arrow.style.top = (t.top + t.height / 2 - y - 5) + 'px'; arrow.style.borderRight = '1px solid var(--pop-border)'; arrow.style.borderTop = '1px solid var(--pop-border)'; arrow.style.borderLeft = 'none'; arrow.style.borderBottom = 'none'; }
      }
    }

    function open() {
      document.body.appendChild(panel);
      panel.classList.add('is-open');
      position();
      window.addEventListener('scroll', position, true);
      window.addEventListener('resize', position);
    }
    function close() {
      panel.classList.remove('is-open');
      window.removeEventListener('scroll', position, true);
      window.removeEventListener('resize', position);
    }
    function toggle() { panel.classList.contains('is-open') ? close() : open(); }

    function onTriggerClick(e) { e.stopPropagation(); toggle(); }
    function onTriggerEnter() { open(); }
    function onTriggerLeave() { close(); }
    function onOutside(e) { if (!panel.contains(e.target) && !trigger.contains(e.target)) close(); }
    function onKey(e) { if (e.key === 'Escape' && panel.classList.contains('is-open')) close(); }

    if (o.trigger === 'hover') {
      trigger.addEventListener('mouseenter', onTriggerEnter);
      trigger.addEventListener('mouseleave', onTriggerLeave);
    } else {
      trigger.addEventListener('click', onTriggerClick);
    }
    document.addEventListener('click', onOutside);
    document.addEventListener('keydown', onKey);

    function destroy() {
      trigger.removeEventListener('click', onTriggerClick);
      trigger.removeEventListener('mouseenter', onTriggerEnter);
      trigger.removeEventListener('mouseleave', onTriggerLeave);
      document.removeEventListener('click', onOutside);
      document.removeEventListener('keydown', onKey);
    }

    return { trigger: trigger, panel: panel, open: open, close: close, toggle: toggle, destroy: destroy };
  }

  var Popover = { init: init, attach: attach };

  if (typeof module !== 'undefined' && module.exports) module.exports = Popover;
  else root.Popover = Popover;
})(typeof window !== 'undefined' ? window : this);
