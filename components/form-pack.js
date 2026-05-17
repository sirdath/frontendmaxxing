/* ============================================
   FORM PACK — Multi-step wizard, password strength, file uploader, autocomplete
   ============================================
   Usage:
     FormPack.step('[data-fp-step]', { onComplete, validate: (i, panel) => bool });
     FormPack.password('[data-fp-pwd]');
     FormPack.file('[data-fp-file]', { multiple: true, maxSize: 5e6, onAdd, onRemove });
     FormPack.autocomplete('[data-fp-ac]', { items: [...], onPick });
     FormPack.charCount('[data-fp-cc]', { max: 280 });
     FormPack.captcha('[data-fp-cap]', { onVerified });
   ============================================ */
(function (root) {
  'use strict';

  function each(target, fn) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, fn);
  }

  function step(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var panels = host.querySelectorAll('.fp-step-panel');
      var pills = host.querySelectorAll('.fp-step-pill');
      var name = host.querySelector('.fp-step-name');
      var meta = host.querySelector('.fp-step-meta');
      var back = host.querySelector('.fp-step-foot .back');
      var next = host.querySelector('.fp-step-foot .next');
      var cur = 0, n = panels.length;

      function render() {
        panels.forEach(function (p, i) { p.classList.toggle('is-shown', i === cur); });
        pills.forEach(function (p, i) {
          p.classList.remove('is-active', 'is-done');
          if (i < cur) p.classList.add('is-done');
          if (i === cur) p.classList.add('is-active');
        });
        if (name) name.textContent = panels[cur].dataset.name || ('Step ' + (cur + 1));
        if (meta) meta.textContent = (cur + 1) + ' of ' + n;
        if (back) back.style.visibility = cur === 0 ? 'hidden' : 'visible';
        if (next) next.textContent = cur === n - 1 ? 'Submit' : 'Continue';
      }
      render();

      if (next) next.addEventListener('click', function () {
        if (typeof opts.validate === 'function' && !opts.validate(cur, panels[cur])) return;
        if (cur === n - 1) { if (typeof opts.onComplete === 'function') opts.onComplete(); return; }
        cur++; render();
      });
      if (back) back.addEventListener('click', function () {
        if (cur === 0) return; cur--; render();
      });
    });
  }

  function password(target) {
    each(target, function (host) {
      var input = host.querySelector('input[type="password"], input[type="text"]');
      var toggle = host.querySelector('.fp-pwd-input button');
      var tips = host.querySelectorAll('.fp-pwd-tips li');
      var label = host.querySelector('.fp-pwd-label');

      function score(p) {
        var s = 0;
        if (p.length >= 8) s++;
        if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
        if (/\d/.test(p)) s++;
        if (/[^A-Za-z0-9]/.test(p)) s++;
        return s;
      }
      function update() {
        var p = input.value;
        var s = p.length === 0 ? 0 : score(p);
        host.dataset.strength = s;
        if (label) label.textContent = ['', 'Weak', 'Fair', 'Good', 'Strong'][s] || '';
        if (tips.length >= 4) {
          tips[0].classList.toggle('is-met', p.length >= 8);
          tips[1].classList.toggle('is-met', /[A-Z]/.test(p) && /[a-z]/.test(p));
          tips[2].classList.toggle('is-met', /\d/.test(p));
          tips[3].classList.toggle('is-met', /[^A-Za-z0-9]/.test(p));
        }
      }
      if (input) input.addEventListener('input', update);
      if (toggle && input) toggle.addEventListener('click', function () {
        input.type = input.type === 'password' ? 'text' : 'password';
      });
      update();
    });
  }

  function file(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var input = host.querySelector('input[type="file"]') || (function () {
        var i = document.createElement('input');
        i.type = 'file'; i.style.display = 'none';
        if (opts.multiple) i.multiple = true;
        if (opts.accept) i.accept = opts.accept;
        host.appendChild(i);
        return i;
      })();
      var pick = host.querySelector('.fp-file-pick');
      var listEl = host.querySelector('.fp-file-list') || (function () {
        var d = document.createElement('div'); d.className = 'fp-file-list';
        host.appendChild(d); return d;
      })();
      if (pick) pick.addEventListener('click', function (e) {
        e.preventDefault(); input.click();
      });
      host.addEventListener('click', function (e) {
        if (e.target.closest('.fp-file-pick, input, .fp-file-x')) return;
        input.click();
      });
      ['dragenter', 'dragover'].forEach(function (ev) {
        host.addEventListener(ev, function (e) { e.preventDefault(); host.classList.add('is-drag'); });
      });
      ['dragleave', 'drop'].forEach(function (ev) {
        host.addEventListener(ev, function (e) { e.preventDefault(); host.classList.remove('is-drag'); });
      });
      host.addEventListener('drop', function (e) {
        if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
      });
      input.addEventListener('change', function () { if (input.files.length) addFiles(input.files); });

      function addFiles(files) {
        Array.from(files).forEach(function (f) {
          if (opts.maxSize && f.size > opts.maxSize) return;
          var row = document.createElement('div');
          row.className = 'fp-file-row';
          row.innerHTML =
            '<div class="fp-file-thumb"></div>' +
            '<div class="fp-file-name"></div>' +
            '<div class="fp-file-size"></div>' +
            '<button class="fp-file-x" type="button">×</button>' +
            '<div class="fp-file-progress"><i></i></div>';
          row.querySelector('.fp-file-name').textContent = f.name;
          row.querySelector('.fp-file-size').textContent = humanSize(f.size);
          listEl.appendChild(row);
          row.querySelector('.fp-file-x').addEventListener('click', function () {
            row.remove();
            if (typeof opts.onRemove === 'function') opts.onRemove(f);
          });
          if (typeof opts.onAdd === 'function') opts.onAdd(f, row);
        });
      }
      function humanSize(n) {
        if (n < 1024) return n + ' B';
        if (n < 1048576) return (n / 1024).toFixed(1) + ' kB';
        return (n / 1048576).toFixed(1) + ' MB';
      }
    });
  }

  function autocomplete(target, opts) {
    opts = opts || {};
    var items = opts.items || [];
    each(target, function (host) {
      var input = host.querySelector('input');
      var list = host.querySelector('.fp-ac-list') || (function () {
        var l = document.createElement('div'); l.className = 'fp-ac-list'; l.style.display = 'none';
        host.appendChild(l); return l;
      })();
      var idx = 0, matches = [];
      function update() {
        var q = input.value.toLowerCase().trim();
        if (!q) { list.style.display = 'none'; return; }
        matches = items.filter(function (it) {
          var t = (typeof it === 'string' ? it : it.label || it.value).toLowerCase();
          return t.indexOf(q) !== -1;
        }).slice(0, 10);
        if (!matches.length) { list.style.display = 'none'; return; }
        list.innerHTML = matches.map(function (m, i) {
          var label = typeof m === 'string' ? m : (m.label || m.value);
          var hl = label.replace(new RegExp('(' + escapeRe(q) + ')', 'ig'), '<mark>$1</mark>');
          return '<div class="fp-ac-item' + (i === 0 ? ' is-active' : '') + '" data-i="' + i + '">' + hl + '</div>';
        }).join('');
        list.style.display = 'block';
        idx = 0;
      }
      function pick(i) {
        var m = matches[i]; if (!m) return;
        var label = typeof m === 'string' ? m : (m.label || m.value);
        input.value = label;
        list.style.display = 'none';
        if (typeof opts.onPick === 'function') opts.onPick(m);
      }
      input.addEventListener('input', update);
      input.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') { idx = Math.min(matches.length - 1, idx + 1); setActive(); e.preventDefault(); }
        if (e.key === 'ArrowUp')   { idx = Math.max(0, idx - 1); setActive(); e.preventDefault(); }
        if (e.key === 'Enter')     { pick(idx); e.preventDefault(); }
        if (e.key === 'Escape')    { list.style.display = 'none'; }
      });
      list.addEventListener('click', function (e) {
        var it = e.target.closest('.fp-ac-item'); if (it) pick(+it.dataset.i);
      });
      function setActive() {
        list.querySelectorAll('.fp-ac-item').forEach(function (x, i) { x.classList.toggle('is-active', i === idx); });
      }
      function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
    });
  }

  function charCount(target, opts) {
    opts = opts || {};
    var max = opts.max || 280;
    each(target, function (host) {
      var t = host.querySelector('textarea, input');
      var c = host.querySelector('.fp-cc-count') || (function () {
        var s = document.createElement('div'); s.className = 'fp-cc-count'; host.appendChild(s); return s;
      })();
      function update() {
        var len = t.value.length;
        c.textContent = len + ' / ' + max;
        host.classList.toggle('is-warn', len > max * 0.85 && len <= max);
        host.classList.toggle('is-over', len > max);
      }
      t.addEventListener('input', update);
      update();
    });
  }

  function captcha(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var box = host.querySelector('.fp-cap-box');
      if (!box) return;
      box.addEventListener('click', function () {
        if (host.classList.contains('is-checked') || host.classList.contains('is-loading')) return;
        host.classList.add('is-loading');
        setTimeout(function () {
          host.classList.remove('is-loading');
          host.classList.add('is-checked');
          if (typeof opts.onVerified === 'function') opts.onVerified();
        }, 900);
      });
    });
  }

  var FormPack = { step: step, password: password, file: file, autocomplete: autocomplete, charCount: charCount, captcha: captcha };
  if (typeof module !== 'undefined' && module.exports) module.exports = FormPack;
  else root.FormPack = FormPack;
})(typeof window !== 'undefined' ? window : this);
