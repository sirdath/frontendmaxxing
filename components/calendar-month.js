/* ============================================
   CALENDAR MONTH — Render a month grid + plot events + navigation
   Inspired by Google Calendar / Apple Calendar
   ============================================
   Usage:
     CalendarMonth.init('.calm', {
       value: new Date(),
       events: [{ date: '2026-02-14', label: 'Heart', color: '#f472b6' }],
       weekStartsOn: 0,
       maxEventsPerDay: 3,
       onDayClick: function (date, cellEl) { … },
       onEventClick: function (event) { … }
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    value: null,
    events: [],
    weekStartsOn: 0,
    maxEventsPerDay: 3,
    onDayClick: null,
    onEventClick: null,
    locale: 'default'
  };

  var WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
  function key(d) { return d.toISOString().slice(0, 10); }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var view = startOfMonth(o.value || new Date());
    var title = el.querySelector('.calm-title');
    var week = el.querySelector('.calm-week');
    var grid = el.querySelector('.calm-grid');
    var prev = el.querySelector('[data-calm-prev]');
    var next = el.querySelector('[data-calm-next]');
    var today = el.querySelector('.calm-today');

    function renderWeek() {
      if (!week) return;
      var labels = [];
      for (var i = 0; i < 7; i++) labels.push(WEEKDAYS[(o.weekStartsOn + i) % 7]);
      week.innerHTML = labels.map(function (l) { return '<span>' + l + '</span>'; }).join('');
    }

    function render() {
      if (title) title.textContent = view.toLocaleString(o.locale, { month: 'long', year: 'numeric' });
      var first = startOfMonth(view);
      var firstWeekday = (first.getDay() - o.weekStartsOn + 7) % 7;
      var total = daysInMonth(view);
      var prevTotal = daysInMonth(addMonths(view, -1));
      var cells = [];

      for (var i = 0; i < firstWeekday; i++) {
        var d = new Date(view.getFullYear(), view.getMonth() - 1, prevTotal - firstWeekday + i + 1);
        cells.push({ date: d, other: true });
      }
      for (var n = 1; n <= total; n++) {
        cells.push({ date: new Date(view.getFullYear(), view.getMonth(), n), other: false });
      }
      while (cells.length < 42) {
        var last = cells[cells.length - 1].date;
        cells.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), other: true });
      }

      var today = new Date();
      var byDay = {};
      (o.events || []).forEach(function (e) {
        var k = (e.date instanceof Date) ? key(e.date) : e.date;
        (byDay[k] = byDay[k] || []).push(e);
      });

      grid.innerHTML = cells.map(function (c) {
        var dayEvents = byDay[key(c.date)] || [];
        var classes = ['calm-cell'];
        if (c.other) classes.push('is-other');
        if (sameDay(c.date, today)) classes.push('is-today');
        if (dayEvents.length) classes.push('is-event');
        var eventsHTML = dayEvents.slice(0, o.maxEventsPerDay).map(function (e) {
          var c = e.color || '#818cf8';
          return '<div class="calm-event" style="--c:' + c + '" data-id="' + (e.id || '') + '">' +
            (e.label || '') + '</div>';
        }).join('');
        var more = dayEvents.length > o.maxEventsPerDay
          ? '<div class="calm-more">+' + (dayEvents.length - o.maxEventsPerDay) + ' more</div>'
          : '';
        return '<div class="' + classes.join(' ') + '" data-date="' + key(c.date) + '">' +
          '<span class="calm-day-num">' + c.date.getDate() + '</span>' +
          '<div class="calm-events">' + eventsHTML + '</div>' +
          more +
          '</div>';
      }).join('');
    }

    function onPrev() { view = addMonths(view, -1); render(); }
    function onNext() { view = addMonths(view, 1); render(); }
    function onToday() { view = startOfMonth(new Date()); render(); }
    function onGridClick(e) {
      var event = e.target.closest('.calm-event');
      if (event && typeof o.onEventClick === 'function') {
        var id = event.getAttribute('data-id');
        var rec = (o.events || []).find(function (x) { return (x.id || '') === id; });
        o.onEventClick(rec || { label: event.textContent });
        return;
      }
      var cell = e.target.closest('.calm-cell');
      if (!cell) return;
      el.querySelectorAll('.calm-cell.is-selected').forEach(function (c) { c.classList.remove('is-selected'); });
      cell.classList.add('is-selected');
      if (typeof o.onDayClick === 'function') {
        o.onDayClick(new Date(cell.getAttribute('data-date') + 'T00:00:00'), cell);
      }
    }

    if (prev) prev.addEventListener('click', onPrev);
    if (next) next.addEventListener('click', onNext);
    if (today) today.addEventListener('click', onToday);
    grid.addEventListener('click', onGridClick);

    renderWeek();
    render();

    function destroy() {
      if (prev) prev.removeEventListener('click', onPrev);
      if (next) next.removeEventListener('click', onNext);
      if (today) today.removeEventListener('click', onToday);
      grid.removeEventListener('click', onGridClick);
    }

    return {
      el: el,
      destroy: destroy,
      goTo: function (d) { view = startOfMonth(d); render(); },
      setEvents: function (events) { o.events = events; render(); }
    };
  }

  var CalendarMonth = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = CalendarMonth;
  else root.CalendarMonth = CalendarMonth;
})(typeof window !== 'undefined' ? window : this);
