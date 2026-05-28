/* ============================================
   BOOKING FLOW — Appointment booker controller
   Inspired by Calendly / Cal.com
   ============================================
   Usage:
     BookingFlow.init('#book', {
       services: [{id:'cut', name:'Haircut', duration:'45 min', price:'$40'}],
       slots: ['9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','1:00 PM','1:30 PM','2:00 PM'],
       onConfirm: function (b) {}   // b: service, date, time, name, email, phone, notes
     });
   ============================================ */
(function (root) {
  'use strict';

  var STEPS = ['Service', 'Date & time', 'Details', 'Confirm'];
  var DOW = ['S','M','T','W','T','F','S'];
  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  function el(t, c, h) { var n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; }
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

  function create(host, opts) {
    opts = opts || {};
    var services = opts.services || [{ id: 's1', name: 'Consultation', duration: '30 min', price: 'Free' }];
    var slots = opts.slots || ['9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM'];

    var state = { step: 0, service: null, date: null, time: null, name: '', email: '', phone: '', notes: '', view: new Date() };

    host.innerHTML =
      '<div class="bk-steps">' + STEPS.map(function (s, i) { return '<div class="bk-step" data-s="' + i + '"><span class="bk-step-n">' + (i + 1) + '</span>' + esc(s) + '</div>'; }).join('') + '</div>' +
      '<div class="bk-body"></div>' +
      '<div class="bk-nav"><button class="bk-btn bk-btn-ghost" data-back>Back</button><button class="bk-btn" data-next>Continue</button></div>';

    var body = host.querySelector('.bk-body');
    var backBtn = host.querySelector('[data-back]');
    var nextBtn = host.querySelector('[data-next]');

    function renderSteps() {
      host.querySelectorAll('.bk-step').forEach(function (s, i) {
        s.classList.toggle('is-active', i === state.step);
        s.classList.toggle('is-done', i < state.step);
      });
    }

    function monthCalendar() {
      var v = state.view, y = v.getFullYear(), m = v.getMonth();
      var first = new Date(y, m, 1).getDay();
      var days = new Date(y, m + 1, 0).getDate();
      var today = new Date(); today.setHours(0,0,0,0);
      var cells = '';
      for (var i = 0; i < first; i++) cells += '<button class="bk-day is-empty" disabled></button>';
      for (var d = 1; d <= days; d++) {
        var date = new Date(y, m, d);
        var past = date < today;
        var sel = state.date && date.toDateString() === state.date.toDateString();
        cells += '<button class="bk-day' + (sel ? ' is-sel' : '') + '" data-day="' + d + '"' + (past ? ' disabled' : '') + '>' + d + '</button>';
      }
      return '<div class="bk-cal-head"><button data-mo="-1">‹</button><strong>' + MONTHS[m] + ' ' + y + '</strong><button data-mo="1">›</button></div>' +
        '<div class="bk-cal-grid">' + DOW.map(function (d) { return '<div class="bk-cal-dow">' + d + '</div>'; }).join('') + cells + '</div>';
    }

    function render() {
      renderSteps();
      backBtn.style.visibility = state.step === 0 || state.step === 4 ? 'hidden' : 'visible';
      nextBtn.textContent = state.step === 3 ? 'Confirm booking' : 'Continue';
      host.querySelector('.bk-nav').style.display = state.step === 4 ? 'none' : 'flex';

      var html = '';
      if (state.step === 0) {
        html = '<h3 class="bk-h">Choose a service</h3>' + services.map(function (s) {
          return '<div class="bk-service' + (state.service && state.service.id === s.id ? ' is-sel' : '') + '" data-svc="' + s.id + '"><div><div class="bk-service-name">' + esc(s.name) + '</div><div class="bk-service-meta">' + esc(s.duration) + '</div></div><div class="bk-service-price">' + esc(s.price) + '</div></div>';
        }).join('');
      } else if (state.step === 1) {
        html = '<h3 class="bk-h">Pick a date &amp; time</h3><div class="bk-datetime"><div class="bk-cal">' + monthCalendar() + '</div>' +
          '<div><div class="bk-slots-label">' + (state.date ? state.date.toDateString() : 'Select a date first') + '</div><div class="bk-slots">' +
          (state.date ? slots.map(function (t) { return '<button class="bk-slot' + (state.time === t ? ' is-sel' : '') + '" data-slot="' + esc(t) + '">' + esc(t) + '</button>'; }).join('') : '') +
          '</div></div></div>';
      } else if (state.step === 2) {
        html = '<h3 class="bk-h">Your details</h3>' +
          '<div class="bk-field"><label>Full name</label><input data-f="name" value="' + esc(state.name) + '" placeholder="Jane Doe"></div>' +
          '<div class="bk-field"><label>Email</label><input data-f="email" type="email" value="' + esc(state.email) + '" placeholder="jane@email.com"></div>' +
          '<div class="bk-field"><label>Phone</label><input data-f="phone" value="' + esc(state.phone) + '" placeholder="(555) 000-0000"></div>' +
          '<div class="bk-field"><label>Notes (optional)</label><textarea data-f="notes" rows="2" placeholder="Anything we should know?">' + esc(state.notes) + '</textarea></div>';
      } else if (state.step === 3) {
        html = '<h3 class="bk-h">Confirm your booking</h3><div class="bk-summary">' +
          row('Service', state.service ? state.service.name : '—') + row('When', (state.date ? state.date.toDateString() : '—') + (state.time ? ' · ' + state.time : '')) +
          row('Name', state.name || '—') + row('Email', state.email || '—') + (state.service ? row('Price', state.service.price) : '') + '</div>';
      } else if (state.step === 4) {
        html = '<div class="bk-success"><div class="bk-success-ico">✓</div><h3 class="bk-h" style="margin-bottom:.4rem;">You\'re booked!</h3>' +
          '<p style="color:var(--bk-muted);margin:0;">' + esc(state.service ? state.service.name : '') + ' · ' + esc(state.date ? state.date.toDateString() : '') + ' · ' + esc(state.time || '') + '<br>A confirmation was sent to ' + esc(state.email) + '.</p></div>';
      }
      body.innerHTML = html;
    }
    function row(k, v) { return '<div class="bk-summary-row"><span>' + esc(k) + '</span><span>' + esc(v) + '</span></div>'; }

    function canAdvance() {
      if (state.step === 0) return !!state.service;
      if (state.step === 1) return !!(state.date && state.time);
      if (state.step === 2) return state.name && /.+@.+\..+/.test(state.email);
      return true;
    }

    body.addEventListener('click', function (e) {
      var svc = e.target.closest('[data-svc]');
      if (svc) { state.service = services.filter(function (s) { return s.id === svc.dataset.svc; })[0]; render(); return; }
      var mo = e.target.closest('[data-mo]');
      if (mo) { state.view = new Date(state.view.getFullYear(), state.view.getMonth() + (+mo.dataset.mo), 1); render(); return; }
      var day = e.target.closest('[data-day]');
      if (day && !day.disabled) { state.date = new Date(state.view.getFullYear(), state.view.getMonth(), +day.dataset.day); render(); return; }
      var slot = e.target.closest('[data-slot]');
      if (slot) { state.time = slot.dataset.slot; render(); return; }
    });
    body.addEventListener('input', function (e) { var f = e.target.closest('[data-f]'); if (f) state[f.dataset.f] = f.value; });

    nextBtn.addEventListener('click', function () {
      if (!canAdvance()) { nextBtn.animate([{transform:'translateX(-4px)'},{transform:'translateX(4px)'},{transform:'translateX(0)'}], 200); return; }
      if (state.step === 3) { state.step = 4; render(); if (typeof opts.onConfirm === 'function') opts.onConfirm({ service: state.service, date: state.date, time: state.time, name: state.name, email: state.email, phone: state.phone, notes: state.notes }); return; }
      state.step = Math.min(3, state.step + 1); render();
    });
    backBtn.addEventListener('click', function () { state.step = Math.max(0, state.step - 1); render(); });

    render();
    return { el: host, reset: function () { state = { step:0, service:null, date:null, time:null, name:'', email:'', phone:'', notes:'', view:new Date() }; render(); } };
  }

  function init(target, opts) {
    if (typeof target === 'string') { var n = document.querySelector(target); return n ? create(n, opts) : null; }
    return create(target, opts);
  }

  var BookingFlow = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = BookingFlow;
  else root.BookingFlow = BookingFlow;
})(typeof window !== 'undefined' ? window : this);
