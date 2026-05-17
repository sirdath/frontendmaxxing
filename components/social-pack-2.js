/* ============================================
   SOCIAL PACK 2 — JS for poll voting + live cursors + reaction pile
   ============================================
   Usage:
     Social2.poll('[data-s2-poll]', { onVote: function (idx, opt) {} });
     Social2.reactionPile('[data-s2-pile]', { onToggle: function (emoji, isMine) {} });
     var cursors = Social2.cursors('.canvas-area', {
       users: [{id, name, color}, ...], onMove: function (id, x, y) {}
     });
     cursors.update(id, x, y);
   ============================================ */
(function (root) {
  'use strict';

  function each(target, fn) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, fn);
  }

  function poll(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var opts2 = host.querySelectorAll('.s2-poll-opt');
      opts2.forEach(function (opt, i) {
        opt.addEventListener('click', function () {
          if (host.classList.contains('is-voted')) return;
          host.classList.add('is-voted');
          opts2.forEach(function (o) { o.classList.add('voted'); o.classList.remove('is-pick'); });
          opt.classList.add('is-pick');
          // Generate fake percentages — caller can override
          var total = parseInt(host.dataset.votes || '120', 10);
          var picked = parseInt(opt.dataset.votes || String(Math.floor(total / opts2.length + 10)), 10);
          var rest = total - picked;
          var others = [];
          opts2.forEach(function (o, j) {
            if (j === i) return;
            var v = parseInt(o.dataset.votes || String(Math.floor(Math.random() * rest)), 10);
            others.push(v);
          });
          var sumOthers = others.reduce(function (a, b) { return a + b; }, 0);
          others = others.map(function (v) { return Math.round((v / Math.max(1, sumOthers)) * rest); });
          var oi = 0;
          opts2.forEach(function (o, j) {
            var v = j === i ? picked : others[oi++];
            var pct = ((v / total) * 100).toFixed(0);
            o.style.setProperty('--pct', pct + '%');
            var label = o.querySelector('.s2-poll-pct');
            if (label) label.textContent = pct + '%';
          });
          if (typeof opts.onVote === 'function') opts.onVote(i, opt);
        });
      });
    });
  }

  function reactionPile(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      host.addEventListener('click', function (e) {
        var chip = e.target.closest('.s2-pile-chip');
        if (chip) {
          var mine = chip.classList.toggle('is-mine');
          // Adjust count
          var count = chip.querySelector('.s2-pile-count');
          if (count) {
            var n = parseInt(count.textContent, 10) || 0;
            count.textContent = (mine ? n + 1 : Math.max(0, n - 1)) + '';
          }
          var emoji = chip.dataset.emoji || chip.textContent.replace(/\d/g, '').trim();
          if (typeof opts.onToggle === 'function') opts.onToggle(emoji, mine);
          return;
        }
        var add = e.target.closest('.s2-pile-add');
        if (add && typeof opts.onAdd === 'function') opts.onAdd(host);
      });
    });
  }

  function cursors(target, opts) {
    opts = opts || {};
    var host = typeof target === 'string' ? document.querySelector(target) : target;
    if (!host) return null;
    host.style.position = host.style.position || 'relative';
    var cursorMap = {};
    function update(id, x, y, meta) {
      if (!cursorMap[id]) {
        var u = (opts.users || []).find(function (x) { return x.id === id; }) || meta || {};
        var el = document.createElement('div');
        el.className = 's2-cur' + (u.colorClass ? ' s2-cur-' + u.colorClass : '');
        if (u.color) el.style.setProperty('--c', u.color);
        el.innerHTML = '<div class="s2-cur-arrow"></div><div class="s2-cur-name"></div>';
        el.querySelector('.s2-cur-name').textContent = u.name || id;
        host.appendChild(el);
        cursorMap[id] = el;
      }
      cursorMap[id].style.setProperty('--x', x + 'px');
      cursorMap[id].style.setProperty('--y', y + 'px');
    }
    function remove(id) {
      if (cursorMap[id]) { cursorMap[id].remove(); delete cursorMap[id]; }
    }
    function clear() {
      Object.keys(cursorMap).forEach(remove);
    }
    return { update: update, remove: remove, clear: clear, el: host };
  }

  function mention(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var rows = host.querySelectorAll('.s2-ment-row');
      var i = 0;
      function setActive(j) {
        rows.forEach(function (r, k) { r.classList.toggle('is-active', k === j); });
        i = j;
      }
      setActive(0);
      host.addEventListener('mouseover', function (e) {
        var r = e.target.closest('.s2-ment-row');
        if (!r) return;
        setActive(Array.from(rows).indexOf(r));
      });
      host.addEventListener('click', function (e) {
        var r = e.target.closest('.s2-ment-row');
        if (!r) return;
        if (typeof opts.onPick === 'function') opts.onPick(r.dataset.handle || r.querySelector('.s2-ment-handle').textContent, r);
      });
      host._mentionNext = function () { setActive((i + 1) % rows.length); };
      host._mentionPrev = function () { setActive((i - 1 + rows.length) % rows.length); };
      host._mentionPick = function () { rows[i].click(); };
    });
  }

  var Social2 = { poll: poll, reactionPile: reactionPile, cursors: cursors, mention: mention };
  if (typeof module !== 'undefined' && module.exports) module.exports = Social2;
  else root.Social2 = Social2;
})(typeof window !== 'undefined' ? window : this);
