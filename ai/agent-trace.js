/* ============================================
   AGENT TRACE — Build + update a step-by-step agent run timeline
   Inspired by LangChain agents, Vercel AI Task/Plan/Checkpoint, CopilotKit
   ============================================
   Usage:
     var trace = AgentTrace.create('#trace', {
       collapseDone: false,
       autoExpandRunning: true
     });

     var step1 = trace.addStep({
       type: 'plan',
       title: 'Plan the approach',
       content: '1. Search...\n2. Read...\n3. Compose...'
     });
     step1.done({ duration: 420 });

     var step2 = trace.addStep({ type: 'tool', title: 'search_web("paris")', state: 'running' });
     step2.update({ content: '{ "query": "paris" }' });
     step2.done({ duration: 1230 });

     var step3 = trace.addStep({
       type: 'answer',
       title: 'Final response',
       content: 'Paris is the capital of France.'
     }).done({ duration: 80 });

     trace.summary();   // returns { total, durations, errors }
     trace.clear();
     trace.destroy();
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    autoExpandRunning: true,
    collapseDone: false,
    showSummary: true
  };

  var typeNum = { plan: 1, tool: 2, observation: 3, thinking: 4, answer: 5, action: 6, checkpoint: 7, error: 8 };

  function create(target, opts) {
    var host = typeof target === 'string' ? document.querySelector(target) : target;
    if (!host) return null;
    var o = mergeOpts(opts);
    host.classList.add('atrc');

    var steps = [];
    var summaryEl = null;

    function addStep(step) {
      var idx = steps.length;
      var stepEl = document.createElement('div');
      stepEl.className = 'atrc-step atrc-step-' + (step.type || 'action') + ' is-' + (step.state || 'running') + (o.autoExpandRunning && (step.state || 'running') === 'running' ? ' is-open' : '');
      stepEl.dataset.atrcIdx = idx;
      stepEl.innerHTML =
        '<div class="atrc-marker"><span class="atrc-num">' + (idx + 1) + '</span></div>' +
        '<div class="atrc-body">' +
          '<header class="atrc-head">' +
            '<span class="atrc-type">' + escape(step.type || 'action') + '</span>' +
            '<span class="atrc-title">' + escape(step.title || '') + '</span>' +
            (step.state === 'running' ? '<span class="atrc-time">…</span>' : '') +
            '<span class="atrc-chevron">▾</span>' +
          '</header>' +
          (step.content ? '<div class="atrc-content">' + escape(step.content) + '</div>' : '<div class="atrc-content" hidden></div>') +
        '</div>';

      // Insert before summary
      if (summaryEl && summaryEl.parentNode === host) {
        host.insertBefore(stepEl, summaryEl);
      } else {
        host.appendChild(stepEl);
      }

      var head = stepEl.querySelector('.atrc-head');
      head.addEventListener('click', function () {
        stepEl.classList.toggle('is-open');
      });

      var startTime = Date.now();
      var stepObj = {
        el: stepEl,
        data: step,
        startTime: startTime,
        update: function (patch) {
          if (patch.title) stepEl.querySelector('.atrc-title').textContent = patch.title;
          if (patch.content !== undefined) {
            var c = stepEl.querySelector('.atrc-content');
            c.textContent = patch.content;
            c.hidden = !patch.content;
          }
          if (patch.state) setState(patch.state, patch);
        },
        done: function (info) {
          setState('done', info);
          if (o.collapseDone) stepEl.classList.remove('is-open');
          updateSummary();
        },
        error: function (info) {
          setState('error', info);
          updateSummary();
        },
        skip: function () {
          setState('skipped');
          updateSummary();
        },
        addSubstep: function (text) {
          var subs = stepEl.querySelector('.atrc-substeps') || (function () {
            var ss = document.createElement('div');
            ss.className = 'atrc-substeps';
            stepEl.querySelector('.atrc-body').appendChild(ss);
            return ss;
          })();
          var s = document.createElement('div');
          s.className = 'atrc-substep';
          s.textContent = text;
          subs.appendChild(s);
        }
      };

      function setState(state, info) {
        stepEl.classList.remove('is-pending', 'is-running', 'is-done', 'is-error', 'is-skipped');
        stepEl.classList.add('is-' + state);
        if (info && info.duration != null) {
          var timeEl = stepEl.querySelector('.atrc-time');
          if (!timeEl) {
            timeEl = document.createElement('span');
            timeEl.className = 'atrc-time';
            stepEl.querySelector('.atrc-head').insertBefore(timeEl, stepEl.querySelector('.atrc-chevron'));
          }
          timeEl.textContent = formatDuration(info.duration);
        } else if (state === 'done' || state === 'error') {
          var timeEl2 = stepEl.querySelector('.atrc-time');
          if (timeEl2) timeEl2.textContent = formatDuration(Date.now() - startTime);
        }
        if (info && info.content !== undefined) {
          var c = stepEl.querySelector('.atrc-content');
          c.textContent = info.content;
          c.hidden = !info.content;
        }
      }

      steps.push(stepObj);
      updateSummary();
      return stepObj;
    }

    function updateSummary() {
      if (!o.showSummary) return;
      if (!summaryEl) {
        summaryEl = document.createElement('div');
        summaryEl.className = 'atrc-summary';
        host.appendChild(summaryEl);
      }
      var done = steps.filter(function (s) { return s.el.classList.contains('is-done'); }).length;
      var running = steps.filter(function (s) { return s.el.classList.contains('is-running'); }).length;
      var errors = steps.filter(function (s) { return s.el.classList.contains('is-error'); }).length;
      summaryEl.innerHTML =
        '<span class="atrc-summary-stat">' + steps.length + ' steps</span>' +
        '<span class="atrc-summary-stat">' + done + ' ✓</span>' +
        (running ? '<span class="atrc-summary-stat">' + running + ' running</span>' : '') +
        (errors ? '<span class="atrc-summary-stat" style="color:#fca5a5">' + errors + ' errors</span>' : '');
    }

    function summary() {
      return {
        total: steps.length,
        done: steps.filter(function (s) { return s.el.classList.contains('is-done'); }).length,
        errors: steps.filter(function (s) { return s.el.classList.contains('is-error'); }).length
      };
    }

    function clear() {
      steps = [];
      host.innerHTML = '';
      summaryEl = null;
    }

    function destroy() { clear(); }

    return {
      el: host,
      addStep: addStep,
      summary: summary,
      clear: clear,
      destroy: destroy,
      get steps() { return steps; }
    };
  }

  function formatDuration(ms) {
    if (ms < 1000) return ms + 'ms';
    if (ms < 60000) return (ms / 1000).toFixed(1) + 's';
    var m = Math.floor(ms / 60000);
    var s = Math.floor((ms % 60000) / 1000);
    return m + 'm ' + s + 's';
  }
  function escape(s) {
    return String(s == null ? '' : s).replace(/[<>&]/g, function (c) { return ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]); });
  }
  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var AgentTrace = { create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = AgentTrace;
  else root.AgentTrace = AgentTrace;
})(typeof window !== 'undefined' ? window : this);
