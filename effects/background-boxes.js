/* ============================================
   BACKGROUND BOXES — Generates an Aceternity-style skewed grid; cells light on hover
   Inspired by Aceternity UI
   ============================================
   Usage:
     BackgroundBoxes.init('.bgx-host', {
       rows: 12, cols: 20,
       colors: ['#a855f7','#ec4899','#10b981','#06b6d4','#facc15'],
       fadeMs: 1500
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    rows: 12, cols: 20,
    colors: ['#a855f7','#ec4899','#10b981','#06b6d4','#facc15','#f97316'],
    fadeMs: 1500
  };

  function create(host, opts) {
    var o = Object.assign({}, defaults, opts || {});
    if (host._bgx) host._bgx.destroy();

    var grid = document.createElement('div');
    grid.className = 'bgx-grid';
    grid.style.gridTemplateColumns = 'repeat(' + o.cols + ', 1fr)';
    grid.style.gridTemplateRows    = 'repeat(' + o.rows + ', 1fr)';

    for (var i = 0; i < o.rows * o.cols; i++) {
      var c = document.createElement('div');
      c.className = 'bgx-cell';
      grid.appendChild(c);
    }

    grid.addEventListener('mouseover', function (e) {
      var cell = e.target.closest('.bgx-cell');
      if (!cell || cell.classList.contains('is-on')) return;
      var color = o.colors[Math.floor(Math.random() * o.colors.length)];
      cell.style.setProperty('--c', color);
      cell.classList.add('is-on');
      cell.classList.remove('is-fade');
      setTimeout(function () { cell.classList.add('is-fade'); }, 50);
      setTimeout(function () {
        cell.classList.remove('is-on', 'is-fade');
      }, o.fadeMs);
    });

    host.appendChild(grid);

    var instance = {
      el: host,
      destroy: function () { grid.remove(); delete host._bgx; }
    };
    host._bgx = instance;
    return instance;
  }

  function init(target, opts) {
    if (typeof target === 'string') {
      var nodes = document.querySelectorAll(target);
      if (nodes.length === 0) return null;
      if (nodes.length === 1) return create(nodes[0], opts);
      var arr = []; nodes.forEach(function (n) { arr.push(create(n, opts)); });
      return arr;
    }
    return create(target, opts);
  }

  var BackgroundBoxes = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = BackgroundBoxes;
  else root.BackgroundBoxes = BackgroundBoxes;
})(typeof window !== 'undefined' ? window : this);
