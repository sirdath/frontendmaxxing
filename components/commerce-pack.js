/* ============================================
   COMMERCE PACK — JS for gallery zoom, color/size pick, add-to-cart flight
   ============================================
   Usage:
     Commerce.gallery('[data-com-gal]');
     Commerce.swatches('[data-com-clr]', { onPick: function (color, el) {} });
     Commerce.sizes('[data-com-sz]', { onPick: function (size, el) {} });
     Commerce.addToCart('[data-com-add]', { target: '#cart-icon', onComplete: fn });
     Commerce.save('[data-com-save]', { onToggle: fn });
   ============================================ */
(function (root) {
  'use strict';

  function each(target, fn) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, fn);
  }

  function gallery(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var thumbs = host.querySelectorAll('.com-gal-thumb');
      var main = host.querySelector('.com-gal-main');
      thumbs.forEach(function (t) {
        t.addEventListener('click', function () {
          thumbs.forEach(function (x) { x.classList.remove('is-active'); });
          t.classList.add('is-active');
          if (main) {
            var img = t.dataset.src;
            if (img && main.querySelector('img')) main.querySelector('img').src = img;
            else if (t.style.background) main.style.background = getComputedStyle(t).background;
          }
        });
      });
      if (main) {
        main.addEventListener('click', function () { main.classList.toggle('is-zoom'); });
        main.addEventListener('mousemove', function (e) {
          if (!main.classList.contains('is-zoom')) return;
          var r = main.getBoundingClientRect();
          var x = ((e.clientX - r.left) / r.width) * 100;
          var y = ((e.clientY - r.top) / r.height) * 100;
          main.style.setProperty('--zx', x + '%');
          main.style.setProperty('--zy', y + '%');
        });
      }
    });
  }

  function swatches(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      host.querySelectorAll('.com-clr-opt').forEach(function (b) {
        b.addEventListener('click', function () {
          if (b.disabled) return;
          host.querySelectorAll('.com-clr-opt.is-picked').forEach(function (x) { x.classList.remove('is-picked'); });
          b.classList.add('is-picked');
          if (typeof opts.onPick === 'function') opts.onPick(b.dataset.color || b.style.getPropertyValue('--clr'), b);
        });
      });
    });
  }

  function sizes(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      host.querySelectorAll('.com-sz-opt').forEach(function (b) {
        b.addEventListener('click', function () {
          if (b.disabled) return;
          host.querySelectorAll('.com-sz-opt.is-picked').forEach(function (x) { x.classList.remove('is-picked'); });
          b.classList.add('is-picked');
          if (typeof opts.onPick === 'function') opts.onPick(b.textContent.trim(), b);
        });
      });
    });
  }

  function addToCart(target, opts) {
    opts = opts || {};
    each(target, function (btn) {
      btn.addEventListener('click', function () {
        if (btn.classList.contains('is-loading') || btn.classList.contains('is-added')) return;
        btn.classList.add('is-loading');
        var dur = opts.duration || 700;
        setTimeout(function () {
          btn.classList.remove('is-loading');
          btn.classList.add('is-added');
          var original = btn.dataset.originalText || btn.textContent;
          btn.dataset.originalText = original;
          btn.querySelector('.com-add-label') ? btn.querySelector('.com-add-label').textContent = 'Added' :
            (btn.lastChild && btn.lastChild.nodeType === 3 ? btn.lastChild.nodeValue = ' Added' : null);

          // Fly animation
          if (opts.target) {
            fly(btn, opts.target);
          }
          // Bump cart badge
          if (opts.target) {
            var t = document.querySelector(opts.target);
            if (t) {
              var badge = t.querySelector('.com-mini-badge');
              if (badge) {
                badge.classList.add('is-bump');
                var cur = parseInt(badge.textContent, 10) || 0;
                badge.textContent = cur + 1;
                setTimeout(function () { badge.classList.remove('is-bump'); }, 450);
              }
            }
          }
          if (typeof opts.onComplete === 'function') opts.onComplete();
          setTimeout(function () {
            btn.classList.remove('is-added');
            if (btn.querySelector('.com-add-label')) btn.querySelector('.com-add-label').textContent = original;
            else if (btn.lastChild && btn.lastChild.nodeType === 3) btn.lastChild.nodeValue = ' ' + original;
          }, 1800);
        }, dur);
      });
    });
  }

  function fly(fromEl, toSel) {
    var to = document.querySelector(toSel);
    if (!to) return;
    var f = fromEl.getBoundingClientRect();
    var t = to.getBoundingClientRect();
    var bit = document.createElement('div');
    bit.style.cssText = [
      'position:fixed','z-index:9999','pointer-events:none',
      'left:' + (f.left + f.width / 2) + 'px',
      'top:'  + (f.top + f.height / 2) + 'px',
      'width:20px','height:20px','border-radius:50%',
      'background:#8b5cf6',
      'transform:translate(-50%,-50%) scale(1)',
      'transition:transform 0.8s cubic-bezier(0.32, 0.72, 0, 1), left 0.8s cubic-bezier(0.32, 0.72, 0, 1), top 0.8s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.8s ease'
    ].join(';');
    document.body.appendChild(bit);
    requestAnimationFrame(function () {
      bit.style.left = (t.left + t.width / 2) + 'px';
      bit.style.top = (t.top + t.height / 2) + 'px';
      bit.style.transform = 'translate(-50%,-50%) scale(0.3)';
      bit.style.opacity = '0';
    });
    setTimeout(function () { bit.remove(); }, 900);
  }

  function save(target, opts) {
    opts = opts || {};
    each(target, function (btn) {
      btn.addEventListener('click', function () {
        var on = btn.classList.toggle('is-saved');
        if (typeof opts.onToggle === 'function') opts.onToggle(on);
      });
    });
  }

  var Commerce = { gallery: gallery, swatches: swatches, sizes: sizes, addToCart: addToCart, save: save, fly: fly };
  if (typeof module !== 'undefined' && module.exports) module.exports = Commerce;
  else root.Commerce = Commerce;
})(typeof window !== 'undefined' ? window : this);
