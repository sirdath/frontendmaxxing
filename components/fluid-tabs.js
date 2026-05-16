/* ============================================
   FLUID TABS — Slide-the-pill controller
   Inspired by WatermelonUI fluid-tabs
   ============================================
   Usage:
     <div class="ftab" data-ftab>
       <button class="ftab-btn is-active" data-ftab-id="home">Home</button>
       <button class="ftab-btn" data-ftab-id="lib">Library</button>
       <button class="ftab-btn" data-ftab-id="profile">Profile</button>
       <div class="ftab-pill"></div>
     </div>

     FluidTabs.init('[data-ftab]', {
       onChange: function (id, btn) {}
     });

     instance.setActive('lib');
   ============================================ */
(function (root) {
  'use strict';

  var defaults = { onChange: null };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var insts = [];
    Array.prototype.forEach.call(els, function (el) { insts.push(create(el, opts)); });
    return insts.length === 1 ? insts[0] : insts;
  }

  function create(host, opts) {
    var o = mergeOpts(opts);
    var buttons = host.querySelectorAll('.ftab-btn');
    var pill = host.querySelector('.ftab-pill');

    function positionPill(btn) {
      if (!pill || !btn) return;
      var hostRect = host.getBoundingClientRect();
      var rect = btn.getBoundingClientRect();
      var isVertical = host.classList.contains('ftab-vertical');
      var isUnderline = host.classList.contains('ftab-underline');
      if (isVertical) {
        pill.style.width = rect.width + 'px';
        pill.style.height = rect.height + 'px';
        pill.style.transform = 'translateY(' + (rect.top - hostRect.top) + 'px)';
        pill.style.left = '0';
      } else if (isUnderline) {
        pill.style.width = rect.width + 'px';
        pill.style.transform = 'translateX(' + (rect.left - hostRect.left) + 'px)';
      } else {
        pill.style.width = rect.width + 'px';
        pill.style.height = rect.height + 'px';
        pill.style.transform = 'translateX(' + (rect.left - hostRect.left - parseFloat(getComputedStyle(host).paddingLeft)) + 'px)';
      }
    }

    function setActive(id) {
      var target = null;
      buttons.forEach(function (b) {
        var match = b.dataset.ftabId === id;
        b.classList.toggle('is-active', match);
        if (match) target = b;
      });
      if (target) {
        positionPill(target);
        if (typeof o.onChange === 'function') o.onChange(id, target);
      }
    }

    buttons.forEach(function (b) {
      b.addEventListener('click', function () { setActive(b.dataset.ftabId); });
    });

    // Initial pill position
    var initial = host.querySelector('.ftab-btn.is-active') || buttons[0];
    if (initial) {
      // Slight delay so layout is stable
      requestAnimationFrame(function () { positionPill(initial); });
    }

    // Reposition on resize
    var ro = new ResizeObserver(function () {
      var active = host.querySelector('.ftab-btn.is-active');
      if (active) positionPill(active);
    });
    ro.observe(host);

    return { host: host, setActive: setActive, destroy: function () { ro.disconnect(); } };
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var FluidTabs = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = FluidTabs;
  else root.FluidTabs = FluidTabs;
})(typeof window !== 'undefined' ? window : this);
