/* ============================================
   APP AGE PICKER — Scroll-snap birthday wheel + age summary
   ============================================
   Usage:
     AppAgePicker.init('[data-app-age-picker]', {
       summarySel: '.apage-summary',
       onChange: function (date) {}  // { month, day, year, age }
     });
   ============================================ */
(function (root) {
  'use strict';

  function init(target, opts) {
    opts = opts || {};
    var nodes = typeof target === 'string' ? document.querySelectorAll(target) : [target];
    Array.prototype.forEach.call(nodes, function (el) { bind(el, opts); });
  }

  function bind(picker, opts) {
    if (picker.dataset.apAgeBound) return;
    picker.dataset.apAgeBound = '1';

    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var thisYear = new Date().getFullYear();
    var years = []; for (var y = thisYear - 100; y <= thisYear; y++) years.push(y);

    var cols = {
      month: picker.querySelector('[data-col="month"]'),
      day:   picker.querySelector('[data-col="day"]'),
      year:  picker.querySelector('[data-col="year"]')
    };

    // Populate
    if (cols.month && !cols.month.children.length) fill(cols.month, months);
    if (cols.day   && !cols.day.children.length)   fill(cols.day,   range(1, 31));
    if (cols.year  && !cols.year.children.length)  fill(cols.year,  years);

    var rowH = parseInt(getComputedStyle(picker).getPropertyValue('--row-h')) || 40;
    var summary = opts.summarySel ? picker.parentNode.querySelector(opts.summarySel) : null;

    var state = { month: 5, day: 14, year: thisYear - 25 }; // sensible default

    function setupCol(name) {
      var col = cols[name];
      if (!col) return;
      var children = Array.prototype.slice.call(col.children);
      var snapTimer = null;
      function update() {
        var idx = Math.round(col.scrollTop / rowH);
        if (idx < 0) idx = 0;
        if (idx >= children.length) idx = children.length - 1;
        children.forEach(function (c, i) { c.classList.toggle('is-selected', i === idx); });
        var val = children[idx] ? children[idx].textContent.trim() : null;
        if (name === 'month') state.month = months.indexOf(val);
        if (name === 'day')   state.day = parseInt(val, 10);
        if (name === 'year')  state.year = parseInt(val, 10);
        updateSummary();
      }
      function snap() {
        var idx = Math.round(col.scrollTop / rowH);
        col.scrollTo({ top: idx * rowH, behavior: 'smooth' });
      }
      col.addEventListener('scroll', function () {
        update();
        clearTimeout(snapTimer);
        snapTimer = setTimeout(snap, 90);
      }, { passive: true });
      // initial scroll
      var initIdx = name === 'month' ? state.month
                  : name === 'day' ? state.day - 1
                  : years.indexOf(state.year);
      requestAnimationFrame(function () { col.scrollTop = initIdx * rowH; update(); });
    }

    function updateSummary() {
      if (!summary) return;
      var now = new Date();
      var bd = new Date(state.year, state.month, state.day);
      var age = now.getFullYear() - bd.getFullYear();
      var m = now.getMonth() - bd.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < bd.getDate())) age--;
      var b = summary.querySelector('b');
      if (b) b.textContent = age;
      if (typeof opts.onChange === 'function') opts.onChange({ month: state.month, day: state.day, year: state.year, age: age });
    }

    Object.keys(cols).forEach(setupCol);
  }

  function fill(col, items) {
    items.forEach(function (v) {
      var row = document.createElement('div');
      row.className = 'apage-row';
      row.textContent = v;
      col.appendChild(row);
    });
  }
  function range(a, b) { var out = []; for (var i = a; i <= b; i++) out.push(i); return out; }

  var AppAgePicker = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = AppAgePicker;
  else root.AppAgePicker = AppAgePicker;
})(typeof window !== 'undefined' ? window : this);
