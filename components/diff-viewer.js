/* ============================================
   DIFF VIEWER — Line-level diff of two strings (LCS-based)
   Inspired by GitHub PR diffs
   ============================================
   Usage:
     DiffViewer.create('[data-diff-viewer]', {
       before: '…old code…',
       after:  '…new code…',
       mode: 'unified',         // 'unified' | 'split'
       lineNumbers: true,
       title: 'app.js'
     });
   ============================================ */
(function (root) {
  'use strict';

  function escapeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Simple LCS to compute additions/removals per line.
  function diffLines(a, b) {
    var A = a.split('\n');
    var B = b.split('\n');
    var n = A.length, m = B.length;
    // Use array of arrays; sufficient for moderate sizes (a few thousand lines).
    var dp = new Array(n + 1);
    for (var i = 0; i <= n; i++) {
      dp[i] = new Array(m + 1).fill(0);
    }
    for (var i = n - 1; i >= 0; i--) {
      for (var j = m - 1; j >= 0; j--) {
        if (A[i] === B[j]) dp[i][j] = dp[i + 1][j + 1] + 1;
        else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
    var ops = [];
    var ii = 0, jj = 0;
    while (ii < n && jj < m) {
      if (A[ii] === B[jj]) { ops.push({ op: '=', text: A[ii] }); ii++; jj++; }
      else if (dp[ii + 1][jj] >= dp[ii][jj + 1]) { ops.push({ op: '-', text: A[ii] }); ii++; }
      else { ops.push({ op: '+', text: B[jj] }); jj++; }
    }
    while (ii < n) { ops.push({ op: '-', text: A[ii] }); ii++; }
    while (jj < m) { ops.push({ op: '+', text: B[jj] }); jj++; }
    return ops;
  }

  function create(target, opts) {
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return null;
    opts = opts || {};
    var before = opts.before || '';
    var after  = opts.after  || '';
    var mode   = opts.mode   || 'unified';
    var lineNumbers = opts.lineNumbers !== false;
    var title = opts.title || '';

    el.classList.add('dfv');
    el.classList.remove('dfv-unified', 'dfv-split');
    el.classList.add('dfv-' + mode);
    if (!lineNumbers) el.classList.add('dfv-no-numbers');

    var ops = diffLines(before, after);
    var adds = ops.filter(function (o) { return o.op === '+'; }).length;
    var dels = ops.filter(function (o) { return o.op === '-'; }).length;

    var header =
      '<div class="dfv-header">' +
        '<div>' + escapeHTML(title) + '</div>' +
        '<div class="dfv-stats">' +
          '<span class="dfv-add-count">+' + adds + '</span>' +
          '<span class="dfv-del-count">−' + dels + '</span>' +
        '</div>' +
      '</div>';

    var bodyHTML;
    if (mode === 'unified') {
      var oldN = 0, newN = 0;
      bodyHTML = '<div class="dfv-body">';
      ops.forEach(function (o) {
        var cls = 'dfv-line';
        var prefix = ' ';
        var oCol = '', nCol = '';
        if (o.op === '=') { oldN++; newN++; oCol = oldN; nCol = newN; }
        else if (o.op === '-') { cls += ' is-removed'; oldN++; oCol = oldN; prefix = '−'; }
        else if (o.op === '+') { cls += ' is-added';   newN++; nCol = newN; prefix = '+'; }
        bodyHTML += '<div class="' + cls + '">' +
          '<span class="dfv-num">' + (oCol || '') + '</span>' +
          '<span class="dfv-num">' + (nCol || '') + '</span>' +
          '<span class="dfv-prefix">' + prefix + '</span>' +
          '<span class="dfv-text">' + escapeHTML(o.text) + '</span>' +
        '</div>';
      });
      bodyHTML += '</div>';
    } else {
      // Split: 2 columns
      var leftHTML = '', rightHTML = '';
      var oN = 0, nN = 0;
      ops.forEach(function (o) {
        if (o.op === '=') {
          oN++; nN++;
          leftHTML  += renderLine('', oN, o.text);
          rightHTML += renderLine('', nN, o.text);
        } else if (o.op === '-') {
          oN++;
          leftHTML  += renderLine('is-removed', oN, o.text, '−');
          rightHTML += renderLine('', '', '');
        } else {
          nN++;
          leftHTML  += renderLine('', '', '');
          rightHTML += renderLine('is-added', nN, o.text, '+');
        }
      });
      bodyHTML = '<div class="dfv-body">' +
        '<div class="dfv-side-before">' + leftHTML + '</div>' +
        '<div class="dfv-side-after">' + rightHTML + '</div>' +
      '</div>';
    }

    el.innerHTML = header + bodyHTML;

    function renderLine(cls, num, text, prefix) {
      return '<div class="dfv-line ' + (cls || '') + '">' +
        '<span class="dfv-num">' + (num || '') + '</span>' +
        '<span class="dfv-prefix">' + (prefix || ' ') + '</span>' +
        '<span class="dfv-text">' + escapeHTML(text || '') + '</span>' +
      '</div>';
    }

    return { el: el, ops: ops, adds: adds, dels: dels };
  }

  var DiffViewer = { create: create, diffLines: diffLines };

  if (typeof module !== 'undefined' && module.exports) module.exports = DiffViewer;
  else root.DiffViewer = DiffViewer;
})(typeof window !== 'undefined' ? window : this);
