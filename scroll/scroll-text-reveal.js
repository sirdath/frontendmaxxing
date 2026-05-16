/* ============================================
   SCROLL TEXT REVEAL — Word reveal as the user scrolls past
   Inspired by Codrops scroll demos / Apple-style word reveals
   ============================================
   Usage:
     <p data-scroll-text-reveal>Long block of text that reveals word by word as you scroll.</p>
     ScrollTextReveal.init('[data-scroll-text-reveal]');

     // Options:
     ScrollTextReveal.init('[data-scroll-text-reveal]', {
       mode: 'word',     // 'word' | 'line' (line splits by computed wrap)
       start: 0.85,      // viewport fraction where reveal begins (0=top)
       end:   0.4        // viewport fraction where last word becomes active
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    mode: 'word',
    start: 0.85,
    end: 0.4
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var originalHTML = el.innerHTML;
    var words = [];

    if (o.mode === 'line') {
      // Split into "lines" naively: each <br> or visible line break (use spans of words then merge by y)
      // Lightweight approach: wrap each word, then on init collapse into line spans.
      splitWords();
      mergeIntoLines();
    } else {
      splitWords();
    }

    function splitWords() {
      var text = el.textContent;
      el.innerHTML = '';
      var parts = text.split(/(\s+)/);
      parts.forEach(function (p) {
        if (/^\s+$/.test(p)) {
          el.appendChild(document.createTextNode(p));
        } else if (p.length) {
          var s = document.createElement('span');
          s.className = 'str-word';
          s.textContent = p;
          el.appendChild(s);
          words.push(s);
        }
      });
    }

    function mergeIntoLines() {
      // Group words by their computed offsetTop
      if (!words.length) return;
      var groups = [];
      var current = null;
      words.forEach(function (w) {
        var top = w.offsetTop;
        if (!current || Math.abs(current.top - top) > 4) {
          current = { top: top, words: [w] };
          groups.push(current);
        } else {
          current.words.push(w);
        }
      });
      // Re-render: each group becomes a .str-line > <span>(inner words text)</span>
      el.innerHTML = '';
      var lineNodes = [];
      groups.forEach(function (g, i) {
        var line = document.createElement('span');
        line.className = 'str-line';
        var inner = document.createElement('span');
        inner.textContent = g.words.map(function (w) { return w.textContent; }).join(' ');
        line.appendChild(inner);
        el.appendChild(line);
        if (i < groups.length - 1) el.appendChild(document.createTextNode(' '));
        lineNodes.push(line);
      });
      words = lineNodes;  // re-target
    }

    var raf = null, pending = false;

    function update() {
      var r = el.getBoundingClientRect();
      var vh = window.innerHeight || 800;
      // 0 when element top hits start*vh, 1 when element bottom passes end*vh
      var elTop = r.top;
      var elBot = r.bottom;
      var startY = vh * o.start;
      var endY   = vh * o.end;

      var n = words.length;
      for (var i = 0; i < n; i++) {
        var w = words[i];
        var wr = w.getBoundingClientRect();
        var wCenter = wr.top + wr.height / 2;
        // Active when this word's center is above startY but below endY
        var active = wCenter < startY;
        if (active && !w.classList.contains('is-active')) w.classList.add('is-active');
        else if (!active && w.classList.contains('is-active')) w.classList.remove('is-active');
      }
    }

    function onScroll() {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(function () { pending = false; update(); });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    function destroy() {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
      el.innerHTML = originalHTML;
    }

    return { el: el, destroy: destroy };
  }

  var ScrollTextReveal = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = ScrollTextReveal;
  else root.ScrollTextReveal = ScrollTextReveal;
})(typeof window !== 'undefined' ? window : this);
