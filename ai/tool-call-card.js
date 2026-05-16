/* ============================================
   TOOL CALL CARD — Render + update AI tool-call cards
   Inspired by Vercel AI Elements, assistant-ui ToolGroup, Claude tool-use
   ============================================
   Usage:
     // Render a card and get a handle:
     var call = ToolCallCard.create(targetEl, {
       tool: 'search_web',
       args: { query: 'paris' },
       state: 'running'
     });
     call.setState('success');
     call.setResult({ hits: [1, 2, 3] });
     call.setElapsed(1234);  // ms
     call.expand();
     call.collapse();
     call.destroy();

     // Init existing markup (toggle expand on click):
     ToolCallCard.init('.tcc');

     // Render a group of calls:
     ToolCallCard.group(targetEl, [
       { tool: 'search_web', state: 'success', args: ..., result: ... },
       { tool: 'read_file',  state: 'running', args: ... }
     ], { label: 'Agent step 1' });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    state: 'pending',
    expanded: false,
    showElapsed: true,
    formatArgs: defaultFormat,
    formatResult: defaultFormat
  };

  var stateLabels = {
    pending:   'Pending',
    running:   'Running',
    success:   'Done',
    error:     'Failed',
    cancelled: 'Cancelled'
  };

  function create(target, opts) {
    var parent = typeof target === 'string' ? document.querySelector(target) : target;
    if (!parent) return null;
    var o = mergeOpts(opts);

    var card = document.createElement('div');
    card.className = 'tcc tcc-' + o.state;
    if (o.tool) card.dataset.tccTool = o.tool;

    card.innerHTML =
      '<button class="tcc-head" type="button">' +
        '<span class="tcc-icon"></span>' +
        '<span class="tcc-name"></span>' +
        '<span class="tcc-status">' +
          '<span class="tcc-status-label"></span>' +
          (o.showElapsed ? '<span class="tcc-elapsed" hidden></span>' : '') +
        '</span>' +
        '<span class="tcc-chevron">▾</span>' +
      '</button>' +
      '<div class="tcc-body">' +
        '<div class="tcc-args"><div class="tcc-args-label">Args</div><pre></pre></div>' +
        '<div class="tcc-result" hidden><div class="tcc-result-label">Result</div><pre></pre></div>' +
      '</div>';

    parent.appendChild(card);

    var head = card.querySelector('.tcc-head');
    var nameEl = card.querySelector('.tcc-name');
    var statusLabel = card.querySelector('.tcc-status-label');
    var elapsedEl = card.querySelector('.tcc-elapsed');
    var argsPre = card.querySelector('.tcc-args pre');
    var resultBlock = card.querySelector('.tcc-result');
    var resultPre = card.querySelector('.tcc-result pre');

    nameEl.textContent = o.tool || 'tool';
    statusLabel.textContent = stateLabels[o.state] || o.state;
    if (o.args !== undefined) argsPre.textContent = o.formatArgs(o.args);
    if (o.result !== undefined) {
      resultBlock.hidden = false;
      resultPre.textContent = o.formatResult(o.result);
    }

    head.addEventListener('click', function () {
      card.classList.toggle('is-open');
    });
    if (o.expanded) card.classList.add('is-open');

    function setState(state) {
      Object.keys(stateLabels).forEach(function (s) { card.classList.remove('tcc-' + s); });
      card.classList.add('tcc-' + state);
      statusLabel.textContent = stateLabels[state] || state;
    }
    function setArgs(args)     { argsPre.textContent = o.formatArgs(args); }
    function setResult(result) {
      resultBlock.hidden = false;
      resultPre.textContent = o.formatResult(result);
    }
    function setElapsed(ms) {
      if (!elapsedEl) return;
      elapsedEl.hidden = false;
      elapsedEl.textContent = formatElapsed(ms);
    }
    function expand()  { card.classList.add('is-open'); }
    function collapse(){ card.classList.remove('is-open'); }
    function destroy() { card.remove(); }

    return {
      el: card,
      setState: setState,
      setArgs: setArgs,
      setResult: setResult,
      setElapsed: setElapsed,
      expand: expand,
      collapse: collapse,
      destroy: destroy
    };
  }

  function init(target) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target || '.tcc')
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, function (card) {
      if (card.dataset.tccBound) return;
      card.dataset.tccBound = '1';
      var head = card.querySelector('.tcc-head');
      if (head) head.addEventListener('click', function () { card.classList.toggle('is-open'); });
    });
  }

  function group(target, calls, opts) {
    var parent = typeof target === 'string' ? document.querySelector(target) : target;
    if (!parent) return null;
    opts = opts || {};

    var wrap = document.createElement('div');
    wrap.className = 'tcc-group';

    if (opts.label) {
      var lab = document.createElement('div');
      lab.className = 'tcc-group-label';
      lab.textContent = opts.label;
      parent.appendChild(lab);
    }
    parent.appendChild(wrap);

    var handles = (calls || []).map(function (c) { return create(wrap, c); });
    return { el: wrap, handles: handles };
  }

  function formatElapsed(ms) {
    if (ms < 1000) return ms + 'ms';
    return (ms / 1000).toFixed(1) + 's';
  }

  function defaultFormat(v) {
    if (typeof v === 'string') return v;
    try { return JSON.stringify(v, null, 2); }
    catch (e) { return String(v); }
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var ToolCallCard = {
    create: create,
    init: init,
    group: group,
    stateLabels: stateLabels
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = ToolCallCard;
  else root.ToolCallCard = ToolCallCard;
})(typeof window !== 'undefined' ? window : this);
