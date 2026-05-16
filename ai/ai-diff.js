/* ============================================
   AI DIFF — Cursor-style inline diff controller (accept/reject hunks)
   Inspired by Cursor IDE, Continue.dev
   ============================================
   Usage:
     var diff = AIDiff.create('#diff', {
       file: 'src/handlers/user.ts',
       hunks: [
         {
           id: 'h1',
           startLine: 42,
           lines: [
             { type: 'context', text: 'const user = req.user;' },
             { type: 'del',     text: '  return user.foo;' },
             { type: 'add',     text: '  return user?.foo ?? null;' },
             { type: 'context', text: '}' }
           ]
         },
         // …
       ],
       onAccept: function (hunk) {},
       onReject: function (hunk) {},
       onResolve: function ({ accepted, rejected, all }) {}
     });

     diff.accept('h1');
     diff.reject('h1');
     diff.acceptAll(); diff.rejectAll();
     diff.getResult();        // → { accepted: [...], rejected: [...] }
     diff.destroy();
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    file: '',
    hunks: [],
    onAccept: null,
    onReject: null,
    onResolve: null
  };

  function create(target, opts) {
    var host = typeof target === 'string' ? document.querySelector(target) : target;
    if (!host) return null;
    var o = mergeOpts(opts);
    host.classList.add('adf');

    var state = {};   // hunkId → 'accepted' | 'rejected' | undefined
    var hunks = o.hunks;

    function render() {
      var addCount = 0, delCount = 0;
      hunks.forEach(function (h) {
        h.lines.forEach(function (l) {
          if (l.type === 'add') addCount++;
          else if (l.type === 'del') delCount++;
        });
      });

      host.innerHTML =
        '<header class="adf-head">' +
          '<span class="adf-file">' + escape(o.file) + '</span>' +
          '<span class="adf-stats">' +
            '<span class="adf-add">+' + addCount + '</span>' +
            '<span class="adf-del">-' + delCount + '</span>' +
          '</span>' +
          '<div class="adf-actions">' +
            '<button class="adf-action adf-accept-all">Accept all</button>' +
            '<button class="adf-action adf-reject-all">Reject all</button>' +
          '</div>' +
        '</header>' +
        '<div class="adf-body">' + hunks.map(renderHunk).join('') + '</div>';

      host.querySelector('.adf-accept-all').addEventListener('click', acceptAll);
      host.querySelector('.adf-reject-all').addEventListener('click', rejectAll);
      hunks.forEach(function (h) {
        host.querySelector('.adf-hunk[data-adf-hunk="' + escapeAttr(h.id) + '"] .adf-hunk-accept').addEventListener('click', function () { accept(h.id); });
        host.querySelector('.adf-hunk[data-adf-hunk="' + escapeAttr(h.id) + '"] .adf-hunk-reject').addEventListener('click', function () { reject(h.id); });
      });
    }

    function renderHunk(h) {
      var startLine = h.startLine || 1;
      var html =
        '<div class="adf-hunk" data-adf-hunk="' + escapeAttr(h.id) + '">' +
          '<div class="adf-hunk-head">' +
            '<span class="adf-loc">@@ ' + startLine + ' @@</span>' +
            '<button class="adf-hunk-accept">Accept</button>' +
            '<button class="adf-hunk-reject">Reject</button>' +
          '</div>' +
          '<ol class="adf-lines" start="' + startLine + '">';
      var num = startLine;
      h.lines.forEach(function (l) {
        html += '<li class="adf-line adf-line-' + (l.type === 'add' ? 'add' : l.type === 'del' ? 'del' : 'context') + '" value="' + num + '">' +
          escape(l.text) +
        '</li>';
        if (l.type !== 'del') num++;
      });
      html += '</ol></div>';
      return html;
    }

    function accept(id) {
      state[id] = 'accepted';
      var el = host.querySelector('.adf-hunk[data-adf-hunk="' + escapeAttr(id) + '"]');
      if (el) {
        el.classList.remove('is-rejected');
        el.classList.add('is-accepted', 'is-resolved');
      }
      var hunk = hunks.find(function (h) { return h.id === id; });
      if (typeof o.onAccept === 'function') o.onAccept(hunk);
      maybeResolve();
    }
    function reject(id) {
      state[id] = 'rejected';
      var el = host.querySelector('.adf-hunk[data-adf-hunk="' + escapeAttr(id) + '"]');
      if (el) {
        el.classList.remove('is-accepted');
        el.classList.add('is-rejected', 'is-resolved');
      }
      var hunk = hunks.find(function (h) { return h.id === id; });
      if (typeof o.onReject === 'function') o.onReject(hunk);
      maybeResolve();
    }
    function acceptAll() { hunks.forEach(function (h) { accept(h.id); }); }
    function rejectAll() { hunks.forEach(function (h) { reject(h.id); }); }

    function maybeResolve() {
      if (hunks.every(function (h) { return state[h.id]; })) {
        var result = getResult();
        if (typeof o.onResolve === 'function') o.onResolve(result);
      }
    }
    function getResult() {
      return {
        accepted: hunks.filter(function (h) { return state[h.id] === 'accepted'; }),
        rejected: hunks.filter(function (h) { return state[h.id] === 'rejected'; }),
        all: hunks
      };
    }

    // Build the post-accept text (applying accepted hunks)
    function getResolvedText(originalText) {
      // Simplified: assumes hunks reference contiguous regions and lines have line nums
      var lines = (originalText || '').split('\n');
      // Process hunks in reverse so line indices stay valid
      hunks.slice().reverse().forEach(function (h) {
        if (state[h.id] !== 'accepted') return;
        var newLines = [];
        h.lines.forEach(function (l) {
          if (l.type === 'del') { /* skip */ }
          else newLines.push(l.text);
        });
        var startIdx = (h.startLine || 1) - 1;
        var deleteCount = h.lines.filter(function (l) { return l.type !== 'add'; }).length;
        lines.splice.apply(lines, [startIdx, deleteCount].concat(newLines));
      });
      return lines.join('\n');
    }

    function destroy() { host.innerHTML = ''; }

    render();

    return {
      el: host,
      accept: accept,
      reject: reject,
      acceptAll: acceptAll,
      rejectAll: rejectAll,
      getResult: getResult,
      getResolvedText: getResolvedText,
      destroy: destroy
    };
  }

  function escape(s) {
    return String(s == null ? '' : s).replace(/[<>&]/g, function (c) {
      return ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]);
    });
  }
  function escapeAttr(s) { return escape(s).replace(/"/g, '&quot;'); }
  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var AIDiff = { create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = AIDiff;
  else root.AIDiff = AIDiff;
})(typeof window !== 'undefined' ? window : this);
