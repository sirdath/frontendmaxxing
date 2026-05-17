/* ============================================
   RATINGS PACK — Star pick + 1-10 pick + thumbs + NPS
   ============================================
   Usage:
     Ratings.stars('[data-rp-stars]', { value: 0, onChange: function (v) {} });
     Ratings.tens('[data-rp-tens]', { onChange: fn });
     Ratings.thumbs('[data-rp-tum]', { onUp, onDown });
     Ratings.nps('[data-rp-nps]', { onChange: fn });
   ============================================ */
(function (root) {
  'use strict';

  function each(target, fn) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, fn);
  }

  function stars(target, opts) {
    opts = opts || {};
    var max = opts.max || 5;
    each(target, function (host) {
      var btns = host.querySelectorAll('button');
      if (btns.length === 0) {
        for (var i = 0; i < max; i++) {
          var b = document.createElement('button');
          b.textContent = '★';
          b.dataset.v = (i + 1);
          host.appendChild(b);
        }
        btns = host.querySelectorAll('button');
      }
      var val = opts.value || 0;
      function render() {
        btns.forEach(function (b, i) { b.classList.toggle('is-filled', i < val); });
        var label = host.querySelector('.rp-stars-val');
        if (label) label.textContent = val + ' / ' + max;
      }
      render();
      btns.forEach(function (b, i) {
        b.addEventListener('click', function () {
          val = i + 1;
          render();
          if (typeof opts.onChange === 'function') opts.onChange(val);
        });
      });
    });
  }

  function tens(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      host.querySelectorAll('.rp-tens-opt').forEach(function (b) {
        b.addEventListener('click', function () {
          host.querySelectorAll('.rp-tens-opt.is-picked').forEach(function (x) { x.classList.remove('is-picked'); });
          b.classList.add('is-picked');
          if (typeof opts.onChange === 'function') opts.onChange(+b.textContent.trim());
        });
      });
    });
  }

  function thumbs(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var up = host.querySelector('.rp-tum-btn.up');
      var dn = host.querySelector('.rp-tum-btn.down');
      var count = host.querySelector('.rp-tum-count');
      var n = parseInt((count && count.textContent) || '0', 10);
      function update() { if (count) count.textContent = n; }
      if (up) up.addEventListener('click', function () {
        var on = up.classList.toggle('is-on');
        if (dn && dn.classList.contains('is-on')) { dn.classList.remove('is-on'); n++; }
        n += on ? 1 : -1; update();
        if (typeof opts.onUp === 'function') opts.onUp(on);
      });
      if (dn) dn.addEventListener('click', function () {
        var on = dn.classList.toggle('is-on');
        if (up && up.classList.contains('is-on')) { up.classList.remove('is-on'); n--; }
        n -= on ? 1 : -1; update();
        if (typeof opts.onDown === 'function') opts.onDown(on);
      });
      update();
    });
  }

  function nps(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var opts2 = host.querySelectorAll('.rp-nps-opt');
      if (opts2.length === 0) {
        for (var i = 0; i <= 10; i++) {
          var b = document.createElement('button');
          b.className = 'rp-nps-opt';
          b.textContent = i;
          b.dataset.value = i;
          host.appendChild(b);
        }
        opts2 = host.querySelectorAll('.rp-nps-opt');
      }
      opts2.forEach(function (b) {
        b.addEventListener('click', function () {
          opts2.forEach(function (x) { x.classList.remove('is-picked'); });
          b.classList.add('is-picked');
          if (typeof opts.onChange === 'function') opts.onChange(+b.dataset.value);
        });
      });
    });
  }

  var Ratings = { stars: stars, tens: tens, thumbs: thumbs, nps: nps };
  if (typeof module !== 'undefined' && module.exports) module.exports = Ratings;
  else root.Ratings = Ratings;
})(typeof window !== 'undefined' ? window : this);
