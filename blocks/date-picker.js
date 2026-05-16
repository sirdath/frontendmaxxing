/* ============================================
   DATE PICKER — Single date or date range picker
   Inspired by Radix Calendar / react-day-picker
   ============================================
   Usage:
     DatePicker.init('[data-date-picker]', {
       mode: 'single',          // 'single' | 'range'
       value: new Date(),
       format: function (d) { return d.toLocaleDateString(); },
       weekStartsOn: 1,         // 0=Sun, 1=Mon
       min: null,
       max: null,
       onChange: function (value) { … }
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    mode: 'single',
    value: null,                 // Date | [Date, Date] | null
    weekStartsOn: 0,
    min: null,
    max: null,
    format: function (d) { return d ? d.toLocaleDateString() : ''; },
    formatRange: null,
    onChange: null,
    locale: 'default'
  };

  var WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
  function addMonths(d, n) { return new Date(d.getFullYear(), d.getMonth() + n, 1); }
  function daysInMonth(d) { return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); }
  function sameDay(a, b) { return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
  function dateInRange(d, a, b) { return d >= a && d <= b; }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var trigger = el.querySelector('.dpk-trigger');
    var valueEl = el.querySelector('.dpk-value');
    var popover = el.querySelector('.dpk-popover');
    var title   = popover && popover.querySelector('.dpk-title');
    var weekRow = popover && popover.querySelector('.dpk-week-row');
    var grid    = popover && popover.querySelector('.dpk-grid');
    var navPrev = popover && popover.querySelector('[data-dpk-prev]');
    var navNext = popover && popover.querySelector('[data-dpk-next]');
    var todayBtn = popover && popover.querySelector('.dpk-today');
    var clearBtn = popover && popover.querySelector('.dpk-clear');

    var viewMonth = startOfMonth(new Date());
    var single = o.mode === 'single' ? o.value : null;
    var range  = o.mode === 'range' && o.value ? { start: o.value[0], end: o.value[1] } : { start: null, end: null };
    var pendingRangeStart = null;

    function renderWeekRow() {
      if (!weekRow) return;
      var labels = [];
      for (var i = 0; i < 7; i++) labels.push(WEEKDAYS[(o.weekStartsOn + i) % 7]);
      weekRow.innerHTML = labels.map(function (l) { return '<span>' + l + '</span>'; }).join('');
    }

    function render() {
      if (!grid) return;
      title.textContent = viewMonth.toLocaleString(o.locale, { month: 'long', year: 'numeric' });
      var first = startOfMonth(viewMonth);
      var firstWeekday = (first.getDay() - o.weekStartsOn + 7) % 7;
      var totalDays = daysInMonth(viewMonth);
      var prevTotal = daysInMonth(addMonths(viewMonth, -1));
      var cells = [];

      // leading
      for (var i = 0; i < firstWeekday; i++) {
        var d = new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, prevTotal - firstWeekday + i + 1);
        cells.push({ date: d, other: true });
      }
      // current
      for (var i2 = 1; i2 <= totalDays; i2++) {
        cells.push({ date: new Date(viewMonth.getFullYear(), viewMonth.getMonth(), i2), other: false });
      }
      // trailing to fill 6 rows
      while (cells.length < 42) {
        var last = cells[cells.length - 1].date;
        cells.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), other: true });
      }

      var today = new Date();

      grid.innerHTML = cells.map(function (c) {
        var classes = ['dpk-day'];
        if (c.other) classes.push('is-other');
        if (sameDay(c.date, today)) classes.push('is-today');
        if (o.mode === 'single' && sameDay(c.date, single)) classes.push('is-selected');
        if (o.mode === 'range') {
          var s = range.start, e = range.end;
          if (s && e) {
            if (sameDay(c.date, s)) classes.push('is-range-start');
            if (sameDay(c.date, e)) classes.push('is-range-end');
            if (s.getTime() !== e.getTime() && dateInRange(c.date, s, e)) classes.push('is-in-range');
          } else if (s && sameDay(c.date, s)) {
            classes.push('is-range-start');
          }
        }
        var disabled = (o.min && c.date < o.min) || (o.max && c.date > o.max);
        return '<button type="button" class="' + classes.join(' ') + '"' +
          ' data-date="' + c.date.toISOString().slice(0, 10) + '"' +
          (disabled ? ' disabled' : '') + '>' +
          c.date.getDate() +
          '</button>';
      }).join('');
    }

    function updateTriggerLabel() {
      if (!valueEl) return;
      if (o.mode === 'single') {
        el.classList.toggle('is-empty', !single);
        valueEl.textContent = single ? o.format(single) : (valueEl.dataset.placeholder || 'Pick a date');
      } else {
        var both = range.start && range.end;
        el.classList.toggle('is-empty', !both);
        if (both) {
          valueEl.textContent = (o.formatRange || function (s, e) { return o.format(s) + ' – ' + o.format(e); })(range.start, range.end);
        } else if (range.start) {
          valueEl.textContent = o.format(range.start) + ' – …';
        } else {
          valueEl.textContent = valueEl.dataset.placeholder || 'Pick a range';
        }
      }
    }

    function onDayClick(e) {
      var b = e.target.closest('.dpk-day');
      if (!b || b.disabled) return;
      var d = new Date(b.getAttribute('data-date') + 'T00:00:00');
      if (o.mode === 'single') {
        single = d;
        render();
        updateTriggerLabel();
        emit();
        close();
      } else {
        if (!range.start || (range.start && range.end)) {
          range.start = d; range.end = null;
        } else if (d < range.start) {
          range.end = range.start; range.start = d;
        } else {
          range.end = d;
        }
        render();
        updateTriggerLabel();
        if (range.start && range.end) { emit(); close(); }
      }
    }

    function emit() {
      if (typeof o.onChange !== 'function') return;
      if (o.mode === 'single') o.onChange(single);
      else o.onChange([range.start, range.end]);
    }

    function open() {
      el.classList.add('is-open');
      if (o.mode === 'single' && single) viewMonth = startOfMonth(single);
      if (o.mode === 'range' && range.start) viewMonth = startOfMonth(range.start);
      render();
    }
    function close() { el.classList.remove('is-open'); }

    function onTriggerClick(e) { e.stopPropagation(); el.classList.contains('is-open') ? close() : open(); }
    function onPrev() { viewMonth = addMonths(viewMonth, -1); render(); }
    function onNext() { viewMonth = addMonths(viewMonth, 1); render(); }
    function onToday() {
      if (o.mode === 'single') single = new Date();
      else { range.start = new Date(); range.end = null; }
      viewMonth = startOfMonth(new Date());
      render(); updateTriggerLabel(); emit();
    }
    function onClear() {
      single = null; range.start = null; range.end = null;
      render(); updateTriggerLabel(); emit();
    }
    function onOutside(e) { if (!el.contains(e.target)) close(); }

    renderWeekRow();
    render();
    updateTriggerLabel();

    if (trigger)  trigger.addEventListener('click', onTriggerClick);
    if (navPrev)  navPrev.addEventListener('click', onPrev);
    if (navNext)  navNext.addEventListener('click', onNext);
    if (todayBtn) todayBtn.addEventListener('click', onToday);
    if (clearBtn) clearBtn.addEventListener('click', onClear);
    if (grid)     grid.addEventListener('click', onDayClick);
    document.addEventListener('click', onOutside);

    function destroy() {
      if (trigger)  trigger.removeEventListener('click', onTriggerClick);
      if (navPrev)  navPrev.removeEventListener('click', onPrev);
      if (navNext)  navNext.removeEventListener('click', onNext);
      if (todayBtn) todayBtn.removeEventListener('click', onToday);
      if (clearBtn) clearBtn.removeEventListener('click', onClear);
      if (grid)     grid.removeEventListener('click', onDayClick);
      document.removeEventListener('click', onOutside);
    }

    return {
      el: el, open: open, close: close, destroy: destroy,
      getValue: function () { return o.mode === 'single' ? single : [range.start, range.end]; }
    };
  }

  var DatePicker = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = DatePicker;
  else root.DatePicker = DatePicker;
})(typeof window !== 'undefined' ? window : this);
