/* ============================================
   ANIMATED LIST — Auto-cycling list with stacking entrance
   Inspired by Magic UI
   ============================================
   Usage:
     // Items can be in the DOM already, or pass items array:
     AnimatedList.init('.animated-list', {
       delay: 1200,      // ms between item arrivals
       maxVisible: 5,    // older items fade after this
       loop: true,       // cycle indefinitely
       items: [          // optional; if omitted uses existing children
         { title: 'Payment received', meta: 'just now', icon: '$' },
         { title: 'New follower',    meta: '2m ago',   icon: 'F' }
       ]
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    delay: 1200,
    maxVisible: 5,
    loop: true,
    items: null
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    // Snapshot original children as the source pool
    var pool;
    if (o.items && o.items.length) {
      pool = o.items.map(function (it) { return buildItem(it); });
    } else {
      pool = Array.prototype.slice.call(el.children).map(function (c) { return c.cloneNode(true); });
    }
    el.innerHTML = '';

    if (!pool.length) return { el: el, destroy: function () {} };

    var index = 0;
    var visible = [];
    var timer = null;

    function tick() {
      var src = pool[index % pool.length];
      var node = src.cloneNode(true);
      node.classList.add('animated-list-item', 'al-enter');
      el.insertBefore(node, el.firstChild);
      visible.unshift(node);

      // Remove the entrance class once animation ends, so subsequent
      // shifts don't replay it
      node.addEventListener('animationend', function once() {
        node.classList.remove('al-enter');
        node.removeEventListener('animationend', once);
      });

      // Evict old
      if (visible.length > o.maxVisible) {
        var stale = visible.pop();
        stale.classList.add('al-exit');
        stale.addEventListener('animationend', function () { stale.remove(); });
      }

      index++;
      if (!o.loop && index >= pool.length) return;
      timer = setTimeout(tick, o.delay);
    }

    function buildItem(spec) {
      var n = document.createElement('div');
      n.className = 'animated-list-item';
      var icon = spec.icon ? '<div class="animated-list-icon">' + escape(spec.icon) + '</div>' : '';
      n.innerHTML = icon +
        '<div class="animated-list-content">' +
          '<div class="animated-list-title">' + escape(spec.title || '') + '</div>' +
          (spec.meta ? '<div class="animated-list-meta">' + escape(spec.meta) + '</div>' : '') +
        '</div>';
      return n;
    }

    function escape(s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }

    timer = setTimeout(tick, 50);

    function destroy() {
      if (timer) clearTimeout(timer);
      visible = [];
      el.innerHTML = '';
    }

    return { el: el, destroy: destroy };
  }

  var AnimatedList = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = AnimatedList;
  else root.AnimatedList = AnimatedList;
})(typeof window !== 'undefined' ? window : this);
