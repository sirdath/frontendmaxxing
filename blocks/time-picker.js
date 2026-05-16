/* ============================================
   TIME PICKER — Populate columns, snap to value, sync trigger label
   Inspired by iOS time picker / Calendly slot picker
   ============================================
   Usage:
     TimePicker.init('[data-time-picker]', {
       value: '14:30',     // 24h string
       format24: false,
       minuteStep: 15,
       onChange: function (hhmm) { … }
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    value: null,
    format24: false,
    minuteStep: 5,
    onChange: null
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    if (o.format24) el.classList.add('tpk-24h');

    var trigger = el.querySelector('.tpk-trigger');
    var valueEl = el.querySelector('.tpk-value');
    var hCol = el.querySelector('[data-col="h"]');
    var mCol = el.querySelector('[data-col="m"]');
    var pCol = el.querySelector('[data-col="p"]');

    var hour = 12, minute = 0, ampm = 'AM';
    if (o.value) {
      var parts = o.value.split(':');
      var h24 = parseInt(parts[0], 10);
      minute = parseInt(parts[1], 10) || 0;
      if (o.format24) { hour = h24; }
      else { ampm = h24 >= 12 ? 'PM' : 'AM'; hour = (h24 % 12) || 12; }
    }

    function fillCol(col, values, current, key) {
      col.innerHTML = '';
      values.forEach(function (v) {
        var li = document.createElement('li');
        li.textContent = key === 'm' ? pad(v) : v;
        li.dataset.v = v;
        if (String(v) === String(current)) li.classList.add('is-active');
        col.appendChild(li);
      });
    }

    function rebuild() {
      var hours = o.format24
        ? Array.from({ length: 24 }, function (_, i) { return i; })
        : Array.from({ length: 12 }, function (_, i) { return i + 1; });
      var minutes = [];
      for (var i = 0; i < 60; i += o.minuteStep) minutes.push(i);
      fillCol(hCol, hours, hour, 'h');
      fillCol(mCol, minutes, minute, 'm');
      if (pCol) {
        Array.prototype.forEach.call(pCol.children, function (li) {
          li.classList.toggle('is-active', li.textContent === ampm);
        });
      }
    }

    function updateLabel() {
      if (!valueEl) return;
      var h24 = o.format24 ? hour : (ampm === 'PM' ? (hour % 12) + 12 : (hour % 12));
      valueEl.textContent = o.format24
        ? (pad(h24) + ':' + pad(minute))
        : (hour + ':' + pad(minute) + ' ' + ampm);
      if (typeof o.onChange === 'function') o.onChange(pad(h24) + ':' + pad(minute));
    }

    function onPick(e) {
      var li = e.target.closest('li');
      if (!li || !li.parentElement) return;
      var key = li.parentElement.getAttribute('data-col');
      var v = li.dataset.v;
      if (key === 'h')      hour = parseInt(v, 10);
      else if (key === 'm') minute = parseInt(v, 10);
      else if (key === 'p') ampm = li.textContent;
      rebuild();
      updateLabel();
    }

    function open()  { el.classList.add('is-open'); }
    function close() { el.classList.remove('is-open'); }
    function toggle(){ el.classList.contains('is-open') ? close() : open(); }

    function onTrigger(e) { e.stopPropagation(); toggle(); }
    function onOutside(e) { if (!el.contains(e.target)) close(); }

    if (trigger) trigger.addEventListener('click', onTrigger);
    if (hCol) hCol.addEventListener('click', onPick);
    if (mCol) mCol.addEventListener('click', onPick);
    if (pCol) pCol.addEventListener('click', onPick);
    document.addEventListener('click', onOutside);

    rebuild();
    updateLabel();

    function destroy() {
      if (trigger) trigger.removeEventListener('click', onTrigger);
      if (hCol) hCol.removeEventListener('click', onPick);
      if (mCol) mCol.removeEventListener('click', onPick);
      if (pCol) pCol.removeEventListener('click', onPick);
      document.removeEventListener('click', onOutside);
    }

    return { el: el, open: open, close: close, destroy: destroy };
  }

  var TimePicker = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = TimePicker;
  else root.TimePicker = TimePicker;
})(typeof window !== 'undefined' ? window : this);
