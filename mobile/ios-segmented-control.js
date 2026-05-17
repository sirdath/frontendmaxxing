/* ============================================
   IOS SEGMENTED CONTROL — Click handler + sliding thumb
   ============================================
   Usage:
     IosSegmented.init('[data-ios-seg]');
     IosSegmented.init(el, {
       onChange: function (index, item) {}
     });
   ============================================ */
(function (root) {
  'use strict';

  function init(target, opts) {
    opts = opts || {};
    var nodes = typeof target === 'string' ? document.querySelectorAll(target) : [target];
    var arr = [];
    Array.prototype.forEach.call(nodes, function (el) {
      var inst = bind(el, opts);
      if (inst) arr.push(inst);
    });
    return arr.length === 1 ? arr[0] : arr;
  }

  function bind(el, opts) {
    if (el.dataset.iosSegBound) return null;
    el.dataset.iosSegBound = '1';

    var items = Array.prototype.slice.call(el.querySelectorAll('.ios-seg-item'));
    if (!items.length) return null;
    el.style.setProperty('--ios-seg-count', items.length);

    var thumb = el.querySelector('.ios-seg-thumb');
    if (!thumb) {
      thumb = document.createElement('span');
      thumb.className = 'ios-seg-thumb';
      el.insertBefore(thumb, el.firstChild);
    }

    var activeIdx = Math.max(0, items.findIndex(function (i) { return i.classList.contains('is-active'); }));
    if (activeIdx < 0) activeIdx = 0;
    moveThumb(activeIdx);

    items.forEach(function (it, i) {
      it.addEventListener('click', function () {
        if (i === activeIdx) return;
        items[activeIdx].classList.remove('is-active');
        it.classList.add('is-active');
        activeIdx = i;
        moveThumb(i);
        if (typeof opts.onChange === 'function') opts.onChange(i, it);
      });
    });

    function moveThumb(i) {
      thumb.style.transform = 'translateX(' + (i * 100) + '%)';
    }

    return {
      el: el,
      setIndex: function (i) { if (items[i]) items[i].click(); },
      getIndex: function () { return activeIdx; },
      destroy: function () { delete el.dataset.iosSegBound; }
    };
  }

  var IosSegmented = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = IosSegmented;
  else root.IosSegmented = IosSegmented;
})(typeof window !== 'undefined' ? window : this);
