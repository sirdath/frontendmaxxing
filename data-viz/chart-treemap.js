/* ============================================
   CHART TREEMAP — Rectangular tree map (squarified-ish)
   Inspired by D3 treemap / WakaTime / Stripe spend breakdowns
   ============================================
   Usage:
     ChartTreemap.create('#container', {
       data: [
         { label: 'A', value: 40, color: '#818cf8' },
         { label: 'B', value: 25, color: '#22d3ee' },
         { label: 'C', value: 20, color: '#f472b6' },
         { label: 'D', value: 10, color: '#fbbf24' },
         { label: 'E', value: 5,  color: '#4ade80' }
       ],
       width: 480, height: 280
     });
   ============================================ */
(function (root) {
  'use strict';

  function create(target, opts) {
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return null;
    opts = opts || {};
    var data = (opts.data || []).slice().sort(function (a, b) { return b.value - a.value; });
    var width  = opts.width  || el.clientWidth || 480;
    var height = opts.height || 280;

    el.innerHTML = '';
    el.style.position = 'relative';
    el.style.width = '100%';
    el.style.height = height + 'px';
    el.style.background = opts.bg || 'transparent';
    el.style.borderRadius = '12px';
    el.style.overflow = 'hidden';

    var total = data.reduce(function (s, d) { return s + d.value; }, 0) || 1;
    var palette = ['#818cf8','#22d3ee','#f472b6','#fbbf24','#4ade80','#fb7185','#a78bfa'];

    // Simple slice-and-dice algorithm: alternate horizontal/vertical splits.
    function layout(items, x, y, w, h, horizontal) {
      if (!items.length) return;
      if (items.length === 1) {
        drawCell(items[0], x, y, w, h);
        return;
      }
      var t = items.reduce(function (s, d) { return s + d.value; }, 0);
      // Find split index where running total best splits in half
      var running = 0, splitIdx = 0;
      for (var i = 0; i < items.length; i++) {
        running += items[i].value;
        if (running >= t / 2) { splitIdx = i + 1; break; }
      }
      var first = items.slice(0, splitIdx);
      var second = items.slice(splitIdx);
      var firstSum  = first.reduce(function (s, d) { return s + d.value; }, 0);
      var firstFrac = firstSum / t;

      if (horizontal) {
        var fw = w * firstFrac;
        layout(first,  x,      y, fw,     h, !horizontal);
        layout(second, x + fw, y, w - fw, h, !horizontal);
      } else {
        var fh = h * firstFrac;
        layout(first,  x, y,      w, fh,     !horizontal);
        layout(second, x, y + fh, w, h - fh, !horizontal);
      }
    }

    function drawCell(item, x, y, w, h) {
      var cell = document.createElement('div');
      cell.style.cssText =
        'position:absolute; box-sizing:border-box; padding:0.5rem;' +
        'left:' + x + 'px; top:' + y + 'px; width:' + w + 'px; height:' + h + 'px;' +
        'background:' + (item.color || palette[Math.floor(Math.random() * palette.length)]) + ';' +
        'border:1px solid rgba(0,0,0,0.2); overflow:hidden; cursor:pointer;' +
        'transition: filter 0.15s ease;';
      cell.onmouseenter = function () { cell.style.filter = 'brightness(1.1)'; };
      cell.onmouseleave = function () { cell.style.filter = ''; };
      var pct = Math.round((item.value / total) * 100);
      if (w > 60 && h > 32) {
        cell.innerHTML =
          '<div style="font-weight:600; font-size:0.85rem; color:#fff; text-shadow:0 1px 3px rgba(0,0,0,0.4);">' +
            item.label + '</div>' +
          '<div style="font-size:0.7rem; color:rgba(255,255,255,0.85); text-shadow:0 1px 3px rgba(0,0,0,0.4);">' +
            item.value + ' · ' + pct + '%</div>';
      }
      el.appendChild(cell);
      if (typeof opts.onClick === 'function') {
        cell.addEventListener('click', function () { opts.onClick(item); });
      }
    }

    layout(data, 0, 0, width, height, width > height);

    return { el: el };
  }

  var ChartTreemap = { create: create };

  if (typeof module !== 'undefined' && module.exports) module.exports = ChartTreemap;
  else root.ChartTreemap = ChartTreemap;
})(typeof window !== 'undefined' ? window : this);
