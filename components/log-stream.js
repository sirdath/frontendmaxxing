/* ============================================
   LOG STREAM — Controller: append/filter/levels/follow-tail/permalink
   Inspired by Vercel deployment logs, Datadog Live Tail
   ============================================
   Usage:
     var stream = LogStream.create('#logs', {
       levels: { info: true, warn: true, error: true, debug: false },
       follow: true,
       maxLines: 5000,
       formatTime: function (t) { return new Date(t).toISOString().slice(11, 23); }
     });

     stream.append({ time: Date.now(), level: 'info', msg: 'Server started' });
     stream.append('Plain string line', 'info');     // shorthand
     stream.clear();
     stream.setFilter('error|timeout');              // regex
     stream.scrollToLine(42);
     stream.destroy();

     // Bind to a fetch SSE / WebSocket / EventSource:
     stream.bindEventSource(es, { parse: 'json' | 'text' });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    levels: { info: true, warn: true, error: true, debug: false, trace: false, success: true, fatal: true },
    follow: true,
    maxLines: 5000,
    formatTime: function (t) {
      var d = new Date(t);
      return d.getHours().toString().padStart(2, '0') + ':' +
             d.getMinutes().toString().padStart(2, '0') + ':' +
             d.getSeconds().toString().padStart(2, '0') + '.' +
             d.getMilliseconds().toString().padStart(3, '0');
    },
    onLineClick: null
  };

  function create(target, opts) {
    var host = typeof target === 'string' ? document.querySelector(target) : target;
    if (!host) return null;
    var o = mergeOpts(opts);

    // Build markup if needed
    if (!host.classList.contains('lstr')) buildMarkup(host, o);

    var lines = [];
    var lineNum = 0;
    var filter = '';
    var filterRegex = null;
    var following = !!o.follow;
    var levelsState = Object.assign({}, o.levels);

    var filterInput = host.querySelector('.lstr-filter input');
    var levelBtns = host.querySelectorAll('.lstr-levels button');
    var followBtn = host.querySelector('.lstr-follow');
    var countEl = host.querySelector('.lstr-count');
    var viewport = host.querySelector('.lstr-viewport');
    var linesEl = host.querySelector('.lstr-lines');

    // Filter input
    if (filterInput) {
      filterInput.addEventListener('input', function () {
        filter = filterInput.value;
        try {
          filterRegex = filter ? new RegExp(filter, 'i') : null;
          filterInput.parentNode.classList.remove('is-regex-error');
        } catch (e) {
          filterRegex = null;
          filterInput.parentNode.classList.add('is-regex-error');
        }
        applyFilters();
      });
    }

    // Level toggles
    levelBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lvl = btn.dataset.lstrLevel;
        levelsState[lvl] = !levelsState[lvl];
        btn.classList.toggle('is-on', levelsState[lvl]);
        applyFilters();
      });
      if (levelsState[btn.dataset.lstrLevel]) btn.classList.add('is-on');
    });

    // Follow button
    if (followBtn) {
      followBtn.addEventListener('click', function () {
        following = !following;
        followBtn.classList.toggle('is-following', following);
        if (following) scrollToBottom();
      });
    }

    // Auto-disable follow when user scrolls up
    viewport.addEventListener('scroll', function () {
      var atBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 30;
      if (!atBottom && following) {
        following = false;
        if (followBtn) followBtn.classList.remove('is-following');
        showPausedBanner();
      }
      if (atBottom) hidePausedBanner();
    });

    // Line click → permalink + anchor
    linesEl.addEventListener('click', function (e) {
      var line = e.target.closest('.lstr-line');
      if (!line) return;
      if (e.target.classList.contains('lstr-num')) {
        var n = line.dataset.lstrNum;
        scrollToLine(parseInt(n, 10));
        var url = window.location.origin + window.location.pathname + '#L' + n;
        if (navigator.clipboard) navigator.clipboard.writeText(url);
      }
      if (typeof o.onLineClick === 'function') o.onLineClick({
        num: parseInt(line.dataset.lstrNum, 10),
        level: line.dataset.level,
        msg: line.querySelector('.lstr-msg').textContent,
        time: line.querySelector('.lstr-time').textContent
      });
    });

    // Anchor support (#L42)
    function checkHash() {
      var m = (location.hash || '').match(/^#L(\d+)/);
      if (m) scrollToLine(parseInt(m[1], 10));
    }
    window.addEventListener('hashchange', checkHash);
    setTimeout(checkHash, 100);

    function append(entry, levelMaybe) {
      if (typeof entry === 'string') entry = { msg: entry, level: levelMaybe || 'info', time: Date.now() };
      if (!entry.time) entry.time = Date.now();
      if (!entry.level) entry.level = 'info';
      entry.num = ++lineNum;
      lines.push(entry);

      // Trim if over max
      if (lines.length > o.maxLines) {
        var drop = lines.length - o.maxLines;
        lines.splice(0, drop);
        for (var i = 0; i < drop; i++) {
          if (linesEl.firstElementChild) linesEl.firstElementChild.remove();
        }
      }

      var line = buildLineEl(entry);
      linesEl.appendChild(line);
      if (!matchesFilters(entry)) line.style.display = 'none';

      if (countEl) countEl.textContent = lines.length.toLocaleString() + ' lines';
      if (following) scrollToBottom();
    }

    function buildLineEl(entry) {
      var line = document.createElement('div');
      line.className = 'lstr-line';
      line.dataset.level = entry.level;
      line.dataset.lstrNum = entry.num;
      line.id = 'L' + entry.num;
      line.innerHTML =
        '<span class="lstr-time">' + escape(o.formatTime(entry.time)) + '</span>' +
        '<span class="lstr-level">' + escape(entry.level) + '</span>' +
        '<span class="lstr-num">' + entry.num + '</span>' +
        '<span class="lstr-msg">' + highlightMatch(escape(entry.msg)) + '</span>';
      return line;
    }

    function highlightMatch(text) {
      if (!filterRegex) return text;
      try {
        return text.replace(filterRegex, function (m) { return '<mark>' + m + '</mark>'; });
      } catch (e) { return text; }
    }

    function matchesFilters(entry) {
      if (!levelsState[entry.level]) return false;
      if (filterRegex && !filterRegex.test(entry.msg)) return false;
      return true;
    }

    function applyFilters() {
      var all = linesEl.querySelectorAll('.lstr-line');
      for (var i = 0; i < all.length; i++) {
        var line = all[i];
        var entry = lines[i];
        if (!entry) continue;
        var match = matchesFilters(entry);
        line.style.display = match ? '' : 'none';
        // Update highlight
        var msgEl = line.querySelector('.lstr-msg');
        if (msgEl) msgEl.innerHTML = highlightMatch(escape(entry.msg));
      }
    }

    function scrollToBottom() {
      viewport.scrollTop = viewport.scrollHeight;
    }

    function scrollToLine(num) {
      var el = host.querySelector('#L' + num);
      if (el) {
        // Clear previous anchored
        host.querySelectorAll('.is-anchored').forEach(function (n) { n.classList.remove('is-anchored'); });
        el.classList.add('is-anchored');
        var top = el.offsetTop - viewport.clientHeight / 2;
        viewport.scrollTop = Math.max(0, top);
      }
    }

    function clear() {
      lines = [];
      lineNum = 0;
      linesEl.innerHTML = '';
      if (countEl) countEl.textContent = '0 lines';
    }

    function setFilter(query) {
      if (filterInput) filterInput.value = query;
      filter = query;
      try {
        filterRegex = query ? new RegExp(query, 'i') : null;
      } catch (e) { filterRegex = null; }
      applyFilters();
    }

    function bindEventSource(es, opts2) {
      opts2 = opts2 || {};
      es.onmessage = function (ev) {
        var data = ev.data;
        if (opts2.parse === 'json') {
          try { data = JSON.parse(ev.data); }
          catch (e) { data = { msg: ev.data }; }
        }
        if (typeof data === 'string') append({ msg: data, level: 'info' });
        else append(data);
      };
    }

    // Paused banner
    var pausedBanner = null;
    function showPausedBanner() {
      if (pausedBanner) return;
      pausedBanner = document.createElement('div');
      pausedBanner.className = 'lstr-paused-banner';
      pausedBanner.textContent = '↓ Resume following';
      pausedBanner.addEventListener('click', function () {
        following = true;
        if (followBtn) followBtn.classList.add('is-following');
        scrollToBottom();
        hidePausedBanner();
      });
      viewport.appendChild(pausedBanner);
    }
    function hidePausedBanner() {
      if (pausedBanner) { pausedBanner.remove(); pausedBanner = null; }
    }

    function destroy() {
      window.removeEventListener('hashchange', checkHash);
    }

    return {
      el: host,
      append: append,
      clear: clear,
      setFilter: setFilter,
      scrollToLine: scrollToLine,
      bindEventSource: bindEventSource,
      destroy: destroy
    };
  }

  function buildMarkup(host, o) {
    host.classList.add('lstr');
    host.innerHTML =
      '<header class="lstr-toolbar">' +
        '<div class="lstr-filter"><input type="text" placeholder="Filter (regex)"></div>' +
        '<div class="lstr-levels">' +
          '<button data-lstr-level="info">info</button>' +
          '<button data-lstr-level="warn">warn</button>' +
          '<button data-lstr-level="error">error</button>' +
          '<button data-lstr-level="debug">debug</button>' +
        '</div>' +
        '<button class="lstr-follow' + (o.follow ? ' is-following' : '') + '">⏷ Follow</button>' +
        '<span class="lstr-count">0 lines</span>' +
      '</header>' +
      '<div class="lstr-viewport"><div class="lstr-lines"></div></div>';
  }

  function escape(s) {
    return String(s == null ? '' : s).replace(/[<>&]/g, function (c) { return ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]); });
  }
  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) {
      if (k2 === 'levels') o.levels = Object.assign({}, o.levels, opts.levels);
      else o[k2] = opts[k2];
    }
    return o;
  }

  var LogStream = { create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = LogStream;
  else root.LogStream = LogStream;
})(typeof window !== 'undefined' ? window : this);
