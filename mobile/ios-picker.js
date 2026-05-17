/* ============================================
   IOS PICKER — Snap-scroll wheel picker
   ============================================
   Usage:
     IosPicker.init('[data-ios-picker]', {
       onChange: function (colIndex, rowIndex, value) {}
     });

     var pick = IosPicker.init(el, { onChange: function () {} });
     pick.setValue(0, 3);  // column 0, row 3
     pick.getValue();       // array of selected row indices per column
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
    if (el.dataset.iosPickerBound) return null;
    el.dataset.iosPickerBound = '1';

    var cols = Array.prototype.slice.call(el.querySelectorAll('[data-ios-picker-col], .ios-picker-col'));
    var rowH = parseFloat(getComputedStyle(el).getPropertyValue('--picker-row-h')) || 36;

    var state = cols.map(function () { return 0; });

    cols.forEach(function (col, ci) {
      var rows = Array.prototype.slice.call(col.querySelectorAll('.ios-picker-row'));
      var snapTimer = null;
      function update() {
        var top = col.scrollTop;
        var idx = Math.round(top / rowH);
        if (idx < 0) idx = 0;
        if (idx >= rows.length) idx = rows.length - 1;
        rows.forEach(function (r, i) {
          r.classList.toggle('is-selected', i === idx);
        });
        if (state[ci] !== idx) {
          state[ci] = idx;
          if (typeof opts.onChange === 'function') {
            opts.onChange(ci, idx, rows[idx] ? rows[idx].textContent.trim() : '');
          }
        }
      }
      function snap() {
        var top = col.scrollTop;
        var idx = Math.round(top / rowH);
        col.scrollTo({ top: idx * rowH, behavior: 'smooth' });
      }
      col.addEventListener('scroll', function () {
        update();
        clearTimeout(snapTimer);
        snapTimer = setTimeout(snap, 90);
      }, { passive: true });
      // initial
      requestAnimationFrame(update);
    });

    function setValue(colIdx, rowIdx) {
      var col = cols[colIdx];
      if (!col) return;
      col.scrollTo({ top: rowIdx * rowH, behavior: 'smooth' });
    }

    return {
      el: el,
      setValue: setValue,
      getValue: function () { return state.slice(); },
      destroy: function () { delete el.dataset.iosPickerBound; }
    };
  }

  var IosPicker = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = IosPicker;
  else root.IosPicker = IosPicker;
})(typeof window !== 'undefined' ? window : this);
