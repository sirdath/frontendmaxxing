/* ============================================
   NAV PACK JS — Glue for sidebar/segment/github-stars/nbell
   ============================================
   Usage:
     NavPack.sidebar('[data-sbcp]');
     NavPack.segment('[data-segctl]', { onChange: function (i, opt) {} });
     NavPack.githubStars('[data-ghs]', { owner: 'sirdath', repo: 'frontendmaxxing' });
     NavPack.bell('[data-nbell]', { count: 3, ring: true });
   ============================================ */
(function (root) {
  'use strict';

  function each(target, fn) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, fn);
  }

  function sidebar(target) {
    each(target, function (host) {
      var toggle = host.querySelector('.sbcp-toggle');
      if (!toggle) return;
      toggle.addEventListener('click', function () {
        host.classList.toggle('is-collapsed');
      });
    });
  }

  function segment(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var opts2 = host.querySelectorAll('.segctl-opt');
      var pill = host.querySelector('.segctl-pill');
      if (!pill) {
        pill = document.createElement('div');
        pill.className = 'segctl-pill';
        host.appendChild(pill);
      }
      function move(btn) {
        var r = btn.getBoundingClientRect();
        var hr = host.getBoundingClientRect();
        host.style.setProperty('--segctl-x', (r.left - hr.left) + 'px');
        host.style.setProperty('--segctl-w', r.width + 'px');
        opts2.forEach(function (o) { o.classList.remove('is-active'); });
        btn.classList.add('is-active');
      }
      opts2.forEach(function (b, i) {
        b.addEventListener('click', function () {
          move(b);
          if (typeof opts.onChange === 'function') opts.onChange(i, b);
        });
      });
      var initial = host.querySelector('.segctl-opt.is-active') || opts2[0];
      if (initial) move(initial);
    });
  }

  function githubStars(target, cfg) {
    cfg = cfg || {};
    each(target, function (host) {
      var owner = cfg.owner || host.dataset.owner;
      var repo  = cfg.repo  || host.dataset.repo;
      if (!owner || !repo) return;
      host.href = 'https://github.com/' + owner + '/' + repo;
      host.target = '_blank';
      host.rel = 'noopener';
      if (!host.querySelector('.ghs-label')) {
        var l = document.createElement('span'); l.className = 'ghs-label'; l.textContent = 'Star';
        host.appendChild(l);
      }
      var countEl = host.querySelector('.ghs-count');
      if (!countEl) {
        countEl = document.createElement('span'); countEl.className = 'ghs-count'; countEl.textContent = '—';
        host.appendChild(countEl);
      }
      fetch('https://api.github.com/repos/' + owner + '/' + repo)
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (typeof d.stargazers_count === 'number') {
            countEl.textContent = formatCount(d.stargazers_count);
          }
        })
        .catch(function () {});
    });
  }
  function formatCount(n) {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return String(n);
  }

  function bell(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      if (!host.querySelector('.nbell-icon')) {
        var i = document.createElement('span'); i.className = 'nbell-icon';
        host.appendChild(i);
      }
      var count = typeof opts.count === 'number' ? opts.count : parseInt(host.dataset.count || '0', 10);
      var dot = host.querySelector('.nbell-dot');
      if (count > 0) {
        if (!dot) { dot = document.createElement('span'); dot.className = 'nbell-dot'; host.appendChild(dot); }
        dot.textContent = count > 99 ? '99+' : String(count);
      } else if (dot) {
        dot.remove();
      }
      if (opts.ring) {
        host.classList.add('is-ringing');
        setTimeout(function () { host.classList.remove('is-ringing'); }, 700);
      }
      host.addEventListener('click', function () {
        host.classList.add('is-ringing');
        setTimeout(function () { host.classList.remove('is-ringing'); }, 700);
        if (typeof opts.onClick === 'function') opts.onClick(host);
      });
    });
  }

  var NavPack = { sidebar: sidebar, segment: segment, githubStars: githubStars, bell: bell };
  if (typeof module !== 'undefined' && module.exports) module.exports = NavPack;
  else root.NavPack = NavPack;
})(typeof window !== 'undefined' ? window : this);
