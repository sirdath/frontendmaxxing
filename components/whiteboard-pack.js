/* ============================================
   WHITEBOARD PACK — Tool switcher + pen-draw + sticky drag + marquee
   ============================================
   Usage:
     Whiteboard.init('[data-wb-host]', {
       tools: '[data-wb-tools]',
       defaultTool: 'pen',
       defaultColor: '#8b5cf6',
       defaultStroke: 3,
       onChangeTool: function (t) {}
     });

     Whiteboard.makeStickyDraggable('[data-wb-sticky]');
   ============================================ */
(function (root) {
  'use strict';
  var defaults = {
    tools: null,
    defaultTool: 'pen',
    defaultColor: '#8b5cf6',
    defaultStroke: 3,
    onChangeTool: null,
    onDrawEnd: null
  };

  function each(target, fn) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, fn);
  }

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var insts = [];
    Array.prototype.forEach.call(els, function (el) { insts.push(create(el, opts)); });
    return insts.length === 1 ? insts[0] : insts;
  }

  function create(host, opts) {
    var o = mergeOpts(opts);
    var canvas = host.querySelector('canvas') || (function () {
      var c = document.createElement('canvas');
      c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
      host.appendChild(c);
      return c;
    })();
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;

    function resize() {
      var r = host.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
    resize();
    window.addEventListener('resize', resize);

    var state = { tool: o.defaultTool, color: o.defaultColor, stroke: o.defaultStroke };
    host.classList.add('tool-' + state.tool);

    function setTool(t) {
      host.classList.remove('tool-pen', 'tool-eraser', 'tool-pan', 'tool-rect', 'tool-arrow', 'tool-text');
      state.tool = t;
      host.classList.add('tool-' + t);
      if (typeof o.onChangeTool === 'function') o.onChangeTool(t);
    }

    // Tool binding
    if (o.tools) {
      each(o.tools, function (tools) {
        tools.querySelectorAll('.wb-tool').forEach(function (b) {
          b.addEventListener('click', function () {
            tools.querySelectorAll('.wb-tool.is-active').forEach(function (x) { x.classList.remove('is-active'); });
            b.classList.add('is-active');
            setTool(b.dataset.tool || b.title || 'pen');
          });
        });
      });
    }

    // Drawing
    var drawing = false, last = null;
    canvas.addEventListener('pointerdown', function (e) {
      if (state.tool !== 'pen' && state.tool !== 'eraser') return;
      drawing = true;
      try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
      var p = pt(e);
      last = p;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.strokeStyle = state.tool === 'eraser' ? 'rgba(20,20,30,1)' : state.color;
      ctx.globalCompositeOperation = state.tool === 'eraser' ? 'destination-out' : 'source-over';
      ctx.lineWidth = state.tool === 'eraser' ? state.stroke * 6 : state.stroke;
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!drawing) return;
      var p = pt(e);
      var mid = { x: (last.x + p.x) / 2, y: (last.y + p.y) / 2 };
      ctx.quadraticCurveTo(last.x, last.y, mid.x, mid.y);
      ctx.stroke();
      last = p;
    });
    canvas.addEventListener('pointerup', function () {
      if (!drawing) return;
      drawing = false;
      ctx.beginPath();
      ctx.globalCompositeOperation = 'source-over';
      if (typeof o.onDrawEnd === 'function') o.onDrawEnd();
    });
    function pt(e) {
      var r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    function clear() {
      var r = host.getBoundingClientRect();
      ctx.clearRect(0, 0, r.width, r.height);
    }
    function setColor(c) { state.color = c; }
    function setStroke(n) { state.stroke = n; }

    return { el: host, setTool: setTool, setColor: setColor, setStroke: setStroke, clear: clear };
  }

  function makeStickyDraggable(target) {
    each(target, function (el) {
      var startX = 0, startY = 0, origX = 0, origY = 0, dragging = false;
      el.style.position = 'absolute';
      el.addEventListener('pointerdown', function (e) {
        dragging = true; startX = e.clientX; startY = e.clientY;
        origX = el.offsetLeft; origY = el.offsetTop;
        el.classList.add('is-dragging');
        try { el.setPointerCapture(e.pointerId); } catch (_) {}
      });
      el.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        el.style.left = (origX + e.clientX - startX) + 'px';
        el.style.top = (origY + e.clientY - startY) + 'px';
      });
      el.addEventListener('pointerup', function () {
        dragging = false;
        el.classList.remove('is-dragging');
      });
    });
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var Whiteboard = { init: init, makeStickyDraggable: makeStickyDraggable };
  if (typeof module !== 'undefined' && module.exports) module.exports = Whiteboard;
  else root.Whiteboard = Whiteboard;
})(typeof window !== 'undefined' ? window : this);
