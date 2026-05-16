/* ============================================
   SCHEDULER PACK — JS glue: avail drag-paint + tldrag move + strip
   ============================================
   Usage:
     SchedulerPack.avail('[data-sch-avail]', { days: 7, hours: 24, onChange: function (cells) {} });
     SchedulerPack.tldrag('[data-sch-tldrag]', { onMove: function (slot, from, to) {} });
     SchedulerPack.strip('[data-sch-strip]', { onPick: function (date) {} });
   ============================================ */
(function (root) {
  'use strict';

  function each(target, fn) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, fn);
  }

  function avail(target, opts) {
    opts = opts || {};
    var days = opts.days || 7;
    var hours = opts.hours || 24;
    each(target, function (host) {
      var grid = host.querySelector('.sch-avail-grid');
      if (!grid) return;
      if (!grid.children.length) {
        // Header row
        var headEmpty = document.createElement('div'); grid.appendChild(headEmpty);
        var dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        for (var d = 0; d < days; d++) {
          var h = document.createElement('div');
          h.className = 'sch-avail-head';
          h.textContent = dayNames[d] || ('D' + (d + 1));
          grid.appendChild(h);
        }
        // Body rows
        for (var hr = 0; hr < hours; hr++) {
          var lbl = document.createElement('div');
          lbl.className = 'sch-avail-hour';
          if (hr % 3 === 0) lbl.textContent = (hr === 0 ? 12 : hr > 12 ? hr - 12 : hr) + (hr >= 12 ? 'p' : 'a');
          grid.appendChild(lbl);
          for (var dd = 0; dd < days; dd++) {
            var c = document.createElement('div');
            c.className = 'sch-avail-cell';
            c.dataset.day = dd; c.dataset.hour = hr;
            grid.appendChild(c);
          }
        }
      }

      var dragging = false; var mode = 'paint';
      grid.addEventListener('pointerdown', function (e) {
        var cell = e.target.closest('.sch-avail-cell');
        if (!cell) return;
        dragging = true;
        mode = cell.classList.contains('is-busy') ? 'erase' : 'paint';
        toggle(cell);
      });
      grid.addEventListener('pointerover', function (e) {
        if (!dragging) return;
        var cell = e.target.closest('.sch-avail-cell');
        if (cell) toggle(cell);
      });
      document.addEventListener('pointerup', function () {
        if (!dragging) return;
        dragging = false;
        if (typeof opts.onChange === 'function') {
          var busy = Array.from(grid.querySelectorAll('.sch-avail-cell.is-busy'))
            .map(function (c) { return { day: +c.dataset.day, hour: +c.dataset.hour }; });
          opts.onChange(busy);
        }
      });
      function toggle(cell) {
        if (mode === 'paint') cell.classList.add('is-busy');
        else cell.classList.remove('is-busy');
      }

      var clear = host.querySelector('.sch-avail-clear');
      if (clear) clear.addEventListener('click', function () {
        grid.querySelectorAll('.sch-avail-cell.is-busy').forEach(function (c) { c.classList.remove('is-busy'); });
      });
      var fill = host.querySelector('.sch-avail-fill');
      if (fill) fill.addEventListener('click', function () {
        grid.querySelectorAll('.sch-avail-cell').forEach(function (c) { c.classList.add('is-busy'); });
      });
    });
  }

  function tldrag(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var slots = host.querySelectorAll('.sch-tldrag-slot');
      slots.forEach(function (slot) {
        var startX = 0, startY = 0, dragging = false, origRow, origLeft, origRect;
        slot.addEventListener('pointerdown', function (e) {
          dragging = true;
          startX = e.clientX; startY = e.clientY;
          origRow = slot.closest('.sch-tldrag-row');
          origLeft = slot.offsetLeft;
          origRect = slot.getBoundingClientRect();
          slot.classList.add('is-dragging');
          try { slot.setPointerCapture(e.pointerId); } catch (_) {}
        });
        slot.addEventListener('pointermove', function (e) {
          if (!dragging) return;
          var dx = e.clientX - startX, dy = e.clientY - startY;
          slot.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
        });
        slot.addEventListener('pointerup', function (e) {
          if (!dragging) return;
          dragging = false;
          slot.classList.remove('is-dragging');
          // Find which row we're over
          var rows = host.querySelectorAll('.sch-tldrag-row');
          var dropRow = null;
          rows.forEach(function (r) {
            var rr = r.getBoundingClientRect();
            if (e.clientY >= rr.top && e.clientY <= rr.bottom) dropRow = r;
          });
          slot.style.transform = '';
          if (dropRow && dropRow !== origRow) {
            var target = dropRow.querySelector('.sch-tldrag-track');
            if (target) {
              target.appendChild(slot);
              if (typeof opts.onMove === 'function') opts.onMove(slot, origRow, dropRow);
            }
          }
        });
      });
    });
  }

  function strip(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var days = host.querySelectorAll('.sch-strip-day');
      days.forEach(function (d) {
        d.addEventListener('click', function () {
          days.forEach(function (x) { x.classList.remove('is-picked'); });
          d.classList.add('is-picked');
          if (typeof opts.onPick === 'function') opts.onPick(d.dataset.date || d.textContent.trim());
        });
      });
    });
  }

  var SchedulerPack = { avail: avail, tldrag: tldrag, strip: strip };
  if (typeof module !== 'undefined' && module.exports) module.exports = SchedulerPack;
  else root.SchedulerPack = SchedulerPack;
})(typeof window !== 'undefined' ? window : this);
