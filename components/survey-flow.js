/* ============================================
   SURVEY FLOW — Typeform-style survey/quiz controller
   Inspired by Typeform / Tally
   ============================================
   Usage:
     SurveyFlow.init('#survey', {
       questions: [
         {type:'choice', q:'…', options:['A','B','C'], required:true},
         {type:'multi',  q:'…', options:['X','Y','Z']},
         {type:'rating', q:'…', max:5},
         {type:'scale',  q:'…', min:0, max:10},
         {type:'text',   q:'…', placeholder:'…'},
         {type:'email',  q:'…'}
       ],
       onComplete: function (answers) {},   // answers: array of {q, value}
       onAnswer: function (i, value) {}
     });
   Keyboard: Enter = next, choice keys A/B/C…, ↑/↓ on scale not required.
   ============================================ */
(function (root) {
  'use strict';

  var KEYS = 'ABCDEFGHIJ';
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

  function create(host, opts) {
    opts = opts || {};
    var qs = opts.questions || [];
    var answers = qs.map(function () { return null; });
    var cur = 0;

    host.classList.add('sv');
    host.innerHTML =
      '<div class="sv-progress"><i></i></div>' +
      '<div class="sv-stage">' + qs.map(function (q, i) { return renderQ(q, i); }).join('') +
        '<div class="sv-done"><div class="sv-done-ico">✓</div><h3 style="margin:0;font-size:1.4rem;">Thanks!</h3><p style="color:var(--sv-muted);margin:0;">Your response was recorded.</p></div>' +
      '</div>' +
      '<div class="sv-foot"><span class="sv-count"></span><div class="sv-actions"><button class="sv-btn-ghost sv-btn" data-prev>Back</button><button class="sv-btn" data-next>OK <span style="opacity:.6;">↵</span></button></div></div>';

    function renderQ(q, i) {
      var inner = '';
      if (q.type === 'choice' || q.type === 'multi') {
        inner = '<div class="sv-opts">' + (q.options || []).map(function (o, j) {
          return '<button class="sv-opt" data-opt="' + j + '"><span class="sv-opt-key">' + (KEYS[j] || (j + 1)) + '</span>' + esc(o) + '</button>';
        }).join('') + '</div>';
      } else if (q.type === 'rating') {
        var max = q.max || 5; var stars = '';
        for (var s = 1; s <= max; s++) stars += '<button class="sv-star" data-rate="' + s + '">★</button>';
        inner = '<div class="sv-rating">' + stars + '</div>';
      } else if (q.type === 'scale') {
        var lo = q.min == null ? 0 : q.min, hi = q.max == null ? 10 : q.max; var btns = '';
        for (var n = lo; n <= hi; n++) btns += '<button data-scale="' + n + '">' + n + '</button>';
        inner = '<div class="sv-scale">' + btns + '</div>';
      } else {
        inner = '<input class="sv-input" type="' + (q.type === 'email' ? 'email' : 'text') + '" placeholder="' + esc(q.placeholder || 'Type your answer…') + '">';
      }
      return '<div class="sv-q" data-q="' + i + '"><div class="sv-q-num">' + (i + 1) + ' →</div><h2 class="sv-q-title">' + esc(q.q) + '</h2>' + inner +
        '<div class="sv-hint">Press <kbd>Enter</kbd> ' + (q.required ? '· required' : '') + '</div></div>';
    }

    var qEls = Array.prototype.slice.call(host.querySelectorAll('.sv-q'));
    var prevBtn = host.querySelector('[data-prev]'), nextBtn = host.querySelector('[data-next]'), count = host.querySelector('.sv-count');

    function show() {
      qEls.forEach(function (el, i) { el.classList.toggle('is-active', i === cur); });
      host.querySelector('.sv-progress > i').style.setProperty('--p', (cur / qs.length * 100) + '%');
      count.textContent = (cur + 1) + ' of ' + qs.length;
      prevBtn.style.visibility = cur === 0 ? 'hidden' : 'visible';
      nextBtn.textContent = cur === qs.length - 1 ? 'Submit' : 'OK';
      var input = qEls[cur] && qEls[cur].querySelector('.sv-input');
      if (input) setTimeout(function () { input.focus(); }, 60);
    }

    function setAnswer(i, val) { answers[i] = val; if (typeof opts.onAnswer === 'function') opts.onAnswer(i, val); }

    host.addEventListener('click', function (e) {
      var q = qs[cur], qEl = qEls[cur];
      var opt = e.target.closest('[data-opt]');
      if (opt) {
        if (q.type === 'multi') {
          opt.classList.toggle('is-sel');
          setAnswer(cur, Array.prototype.filter.call(qEl.querySelectorAll('.sv-opt'), function (o) { return o.classList.contains('is-sel'); }).map(function (o) { return q.options[+o.dataset.opt]; }));
        } else {
          qEl.querySelectorAll('.sv-opt').forEach(function (o) { o.classList.remove('is-sel'); });
          opt.classList.add('is-sel'); setAnswer(cur, q.options[+opt.dataset.opt]);
          setTimeout(next, 250);
        }
        return;
      }
      var star = e.target.closest('[data-rate]');
      if (star) { var r = +star.dataset.rate; qEl.querySelectorAll('.sv-star').forEach(function (s, j) { s.classList.toggle('is-on', j < r); }); setAnswer(cur, r); setTimeout(next, 250); return; }
      var sc = e.target.closest('[data-scale]');
      if (sc) { qEl.querySelectorAll('.sv-scale button').forEach(function (b) { b.classList.remove('is-sel'); }); sc.classList.add('is-sel'); setAnswer(cur, +sc.dataset.scale); setTimeout(next, 250); return; }
    });

    function next() {
      var q = qs[cur], qEl = qEls[cur];
      var input = qEl.querySelector('.sv-input');
      if (input) setAnswer(cur, input.value);
      if (q.required && (answers[cur] == null || answers[cur] === '' || (Array.isArray(answers[cur]) && !answers[cur].length))) {
        qEl.animate([{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}], 220); return;
      }
      if (cur === qs.length - 1) { host.classList.add('is-done'); host.querySelector('.sv-progress > i').style.setProperty('--p', '100%'); host.querySelector('.sv-foot').style.display = 'none';
        if (typeof opts.onComplete === 'function') opts.onComplete(qs.map(function (q, i) { return { q: q.q, value: answers[i] }; })); return; }
      cur++; show();
    }
    function prev() { if (cur > 0) { cur--; show(); } }

    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);
    host.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); next(); }
      var q = qs[cur];
      if ((q.type === 'choice' || q.type === 'multi') && /^[a-zA-Z]$/.test(e.key)) {
        var idx = KEYS.indexOf(e.key.toUpperCase()); var opt = idx > -1 && qEls[cur].querySelector('[data-opt="' + idx + '"]'); if (opt) opt.click();
      }
    });
    host.tabIndex = 0;
    show();
    return { el: host, answers: function () { return answers.slice(); } };
  }

  function init(target, opts) {
    if (typeof target === 'string') { var n = document.querySelector(target); return n ? create(n, opts) : null; }
    return create(target, opts);
  }

  var SurveyFlow = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = SurveyFlow;
  else root.SurveyFlow = SurveyFlow;
})(typeof window !== 'undefined' ? window : this);
