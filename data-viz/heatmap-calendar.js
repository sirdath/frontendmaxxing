/* ============================================
   HEATMAP CALENDAR — GitHub-style yearly contribution graph
   Inspired by GitHub / WakaTime
   ============================================
   Usage:
     HeatmapCalendar.create('[data-heatmap-calendar]', {
       data: { '2026-01-15': 3, '2026-02-04': 7 },
       year: 2026,
       color: '#22c55e',
       weekStartsOn: 0,
       tooltip: true,
       onClick: function (dateStr, value) { … }
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    data: {},
    year: new Date().getFullYear(),
    color: '#22c55e',
    weekStartsOn: 0,
    tooltip: true,
    onClick: null,
    levels: 4
  };

  function create(target, opts) {
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return null;
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    el.classList.add('hcal');
    el.style.setProperty('--hcal-color', o.color);

    var max = Math.max.apply(null, Object.values(o.data).concat([1]));
    function level(v) {
      if (!v) return 0;
      var t = v / max;
      if (t > 0.75) return 4;
      if (t > 0.45) return 3;
      if (t > 0.2)  return 2;
      return 1;
    }

    // Build days for the year
    var start = new Date(o.year, 0, 1);
    var end   = new Date(o.year, 11, 31);
    var leading = (start.getDay() - o.weekStartsOn + 7) % 7;
    var firstSunday = new Date(start);
    firstSunday.setDate(start.getDate() - leading);

    var cells = [];
    var months = [];
    var lastMonth = -1;
    for (var d = new Date(firstSunday); d <= end || cells.length % 7 !== 0; d.setDate(d.getDate() + 1)) {
      var key = d.toISOString().slice(0, 10);
      var inYear = d.getFullYear() === o.year;
      cells.push({
        date: new Date(d),
        key: key,
        value: inYear ? (o.data[key] || 0) : null
      });
      if (inYear && d.getDate() === 1) {
        var col = Math.floor((cells.length - 1) / 7);
        months.push({ name: d.toLocaleString('default', { month: 'short' }), col: col });
        lastMonth = d.getMonth();
      }
    }

    var weeks = Math.ceil(cells.length / 7);
    var weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var weekdayLabels = [];
    for (var i = 0; i < 7; i++) weekdayLabels.push(i % 2 === 1 ? weekdays[(o.weekStartsOn + i) % 7] : '');

    var html =
      '<div class="hcal-months" style="--hcal-month-cols: repeat(' + weeks + ', var(--hcal-cell));">' +
        months.map(function (m) {
          return '<span style="grid-column:' + (m.col + 1) + ';">' + m.name + '</span>';
        }).join('') +
      '</div>' +
      '<div class="hcal-body">' +
        '<div class="hcal-weekdays">' +
          weekdayLabels.map(function (l) { return '<span>' + l + '</span>'; }).join('') +
        '</div>' +
        '<div class="hcal-weeks">' +
          cells.map(function (c) {
            var lvl = c.value === null ? 0 : level(c.value);
            return '<div class="hcal-cell l' + lvl + '" data-d="' + c.key + '" data-v="' + (c.value == null ? '' : c.value) + '"' +
                   (c.value === null ? ' style="visibility:hidden;"' : '') +
                   '></div>';
          }).join('') +
        '</div>' +
      '</div>' +
      '<div class="hcal-legend">' +
        '<span>Less</span>' +
        '<span class="hcal-cell" style="background:var(--hcal-empty)"></span>' +
        '<span class="hcal-cell l1"></span>' +
        '<span class="hcal-cell l2"></span>' +
        '<span class="hcal-cell l3"></span>' +
        '<span class="hcal-cell l4"></span>' +
        '<span>More</span>' +
      '</div>';
    el.innerHTML = html;

    // Tooltip
    var tip = null;
    if (o.tooltip) {
      el.addEventListener('mouseover', function (e) {
        var c = e.target.closest('.hcal-cell[data-d]');
        if (!c) return;
        if (!tip) { tip = document.createElement('div'); tip.className = 'hcal-tooltip'; document.body.appendChild(tip); }
        var v = c.getAttribute('data-v');
        tip.textContent = (v || '0') + ' on ' + c.getAttribute('data-d');
        var r = c.getBoundingClientRect();
        tip.style.left = (r.left + r.width / 2) + 'px';
        tip.style.top  = r.top + 'px';
        tip.style.display = 'block';
      });
      el.addEventListener('mouseout', function (e) {
        if (e.target.closest('.hcal-cell')) { if (tip) tip.style.display = 'none'; }
      });
    }

    el.addEventListener('click', function (e) {
      var c = e.target.closest('.hcal-cell[data-d]');
      if (!c) return;
      if (typeof o.onClick === 'function') o.onClick(c.getAttribute('data-d'), parseFloat(c.getAttribute('data-v')) || 0);
    });

    return {
      el: el,
      destroy: function () { if (tip) tip.remove(); el.innerHTML = ''; }
    };
  }

  var HeatmapCalendar = { create: create };

  if (typeof module !== 'undefined' && module.exports) module.exports = HeatmapCalendar;
  else root.HeatmapCalendar = HeatmapCalendar;
})(typeof window !== 'undefined' ? window : this);
