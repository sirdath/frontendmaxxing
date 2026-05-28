/* ============================================
   FEEDBACK WIDGET — Floating feedback / bug-report launcher controller
   Inspired by Canny / Sentry User Feedback / Linear
   ============================================
   Usage:
     FeedbackWidget.init('#fb', {
       title: 'Send feedback',
       emojis: ['😞','😐','🙂','😍'],
       categories: ['Bug','Idea','Praise','Other'],
       screenshot: true,            // show a "capture screenshot" toggle
       onSubmit: function (data) {   // {rating, category, message, screenshot}
         // POST to your endpoint…
       }
     });
   Builds its own DOM into the host. Esc / outside-click closes.
   ============================================ */
(function (root) {
  'use strict';

  var defaults = { title: 'Send feedback', emojis: ['😞','😐','🙂','😍'], categories: ['Bug','Idea','Other'], screenshot: true, fab: 'Feedback' };
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

  function create(host, opts) {
    var o = Object.assign({}, defaults, opts || {});
    var state = { rating: null, category: null, shot: false };

    host.classList.add('fbw');
    host.innerHTML =
      '<button class="fbw-fab">💬 ' + esc(o.fab) + '</button>' +
      '<div class="fbw-panel">' +
        '<div class="fbw-form">' +
          '<div class="fbw-head"><h4>' + esc(o.title) + '</h4><button class="fbw-close" aria-label="Close">×</button></div>' +
          '<div class="fbw-emoji">' + o.emojis.map(function (e, i) { return '<button data-rate="' + i + '">' + e + '</button>'; }).join('') + '</div>' +
          '<div class="fbw-cats">' + o.categories.map(function (c) { return '<button class="fbw-cat" data-cat="' + esc(c) + '">' + esc(c) + '</button>'; }).join('') + '</div>' +
          '<textarea class="fbw-text" placeholder="Tell us more…"></textarea>' +
          (o.screenshot ? '<div class="fbw-row"><label class="fbw-shot"><input type="checkbox" hidden> 📷 Include screenshot</label></div>' : '') +
          '<button class="fbw-submit" disabled>Send feedback</button>' +
        '</div>' +
        '<div class="fbw-sent"><div class="fbw-sent-ico">✓</div><h4 style="margin:.2rem 0;">Thanks!</h4><p style="color:var(--fbw-muted);margin:0;font-size:.85rem;">We read every message.</p></div>' +
      '</div>';

    var panel = host.querySelector('.fbw-panel');
    var fab = host.querySelector('.fbw-fab');
    var text = host.querySelector('.fbw-text');
    var submit = host.querySelector('.fbw-submit');

    function open() { host.classList.add('is-open'); setTimeout(function () { text && text.focus(); }, 80); }
    function close() { host.classList.remove('is-open'); }
    function refresh() { submit.disabled = !(state.rating != null || (text && text.value.trim())); }

    fab.addEventListener('click', function () { host.classList.contains('is-open') ? close() : open(); });
    host.querySelector('.fbw-close').addEventListener('click', close);
    document.addEventListener('click', function (e) { if (!host.contains(e.target)) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    host.addEventListener('click', function (e) {
      var r = e.target.closest('[data-rate]');
      if (r) { state.rating = +r.dataset.rate; host.querySelectorAll('[data-rate]').forEach(function (b, i) { b.classList.toggle('is-sel', i === state.rating); }); refresh(); }
      var c = e.target.closest('[data-cat]');
      if (c) { state.category = c.dataset.cat; host.querySelectorAll('[data-cat]').forEach(function (b) { b.classList.remove('is-sel'); }); c.classList.add('is-sel'); }
      var shot = e.target.closest('.fbw-shot');
      if (shot) { state.shot = !state.shot; shot.classList.toggle('is-on', state.shot); }
    });
    if (text) text.addEventListener('input', refresh);

    submit.addEventListener('click', function () {
      var data = { rating: state.rating, category: state.category, message: text ? text.value.trim() : '', screenshot: state.shot };
      if (typeof o.onSubmit === 'function') o.onSubmit(data);
      panel.classList.add('is-sent');
      setTimeout(function () { close(); panel.classList.remove('is-sent'); reset(); }, 1800);
    });

    function reset() { state = { rating: null, category: null, shot: false }; if (text) text.value = ''; host.querySelectorAll('.is-sel').forEach(function (e) { e.classList.remove('is-sel'); }); host.querySelectorAll('.fbw-shot.is-on').forEach(function (e) { e.classList.remove('is-on'); }); refresh(); }

    return { el: host, open: open, close: close, reset: reset };
  }

  function init(target, opts) {
    if (typeof target === 'string') { var n = document.querySelector(target); return n ? create(n, opts) : null; }
    return create(target, opts);
  }

  var FeedbackWidget = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = FeedbackWidget;
  else root.FeedbackWidget = FeedbackWidget;
})(typeof window !== 'undefined' ? window : this);
