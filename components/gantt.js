/* ============================================
   GANTT — Build a CSS-grid project timeline from data
   Inspired by Linear cycles / Asana timeline
   ============================================
   Usage:
     Gantt.init('#g', {
       periods: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
       today: 6,                          // optional column for the "today" marker
       tasks: [
         {name:'Research',  start:1, span:2, color:'accent2', progress:1},
         {name:'Design',    start:2, span:3, progress:.6},
         {name:'Build',     start:4, span:5, color:'ok', progress:.3},
         {name:'Launch',    start:9, milestone:true, color:'danger'}
       ]
     });
   color: '' (accent) | 'accent2' | 'ok' | 'warn' | 'danger'
   ============================================ */
(function (root) {
  'use strict';

  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

  function create(host, opts) {
    opts = opts || {};
    var periods = opts.periods || ['Q1','Q2','Q3','Q4'];
    var tasks = opts.tasks || [];
    var cols = periods.length;
    host.classList.add('gantt');
    host.style.setProperty('--cols', cols);

    var head = '<div class="gantt-head"><div class="gantt-row-label">Task</div><div class="gantt-periods">' +
      periods.map(function (p) { return '<span>' + esc(p) + '</span>'; }).join('') + '</div></div>';

    var rows = tasks.map(function (t) {
      var todayCls = opts.today ? ' has-today' : '';
      var todayStyle = opts.today ? 'style="--today:' + opts.today + ';"' : '';
      var bar;
      if (t.milestone) {
        bar = '<div class="gantt-milestone gantt-bar-' + (t.color || 'accent') + '" style="--c:' + t.start + ';" title="' + esc(t.name) + '"></div>';
      } else {
        var cls = t.color ? ' gantt-bar-' + t.color : '';
        var prog = t.progress != null ? '--progress:' + t.progress + ';' : '';
        bar = '<div class="gantt-bar' + cls + '" style="--c:' + t.start + ';--span:' + (t.span || 1) + ';' + prog + '"><span>' + esc(t.name) + '</span></div>';
      }
      return '<div class="gantt-row"><div class="gantt-row-label">' + esc(t.name) + '</div><div class="gantt-track' + todayCls + '" ' + todayStyle + '>' + bar + '</div></div>';
    }).join('');

    host.innerHTML = head + rows;

    host.addEventListener('click', function (e) {
      var bar = e.target.closest('.gantt-bar, .gantt-milestone');
      if (bar && typeof opts.onTask === 'function') opts.onTask(bar.querySelector('span') ? bar.querySelector('span').textContent : bar.title, bar);
    });

    return { el: host };
  }

  function init(target, opts) {
    if (typeof target === 'string') { var n = document.querySelector(target); return n ? create(n, opts) : null; }
    return create(target, opts);
  }

  var Gantt = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = Gantt;
  else root.Gantt = Gantt;
})(typeof window !== 'undefined' ? window : this);
