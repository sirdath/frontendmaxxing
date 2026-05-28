/* ============================================
   CART PRO — Open/close + qty + free-shipping progress for the cart-pro drawer
   Inspired by Shopify cart drawers
   ============================================
   Usage:
     CartPro.init('#cart', {
       freeShip: 75,          // free-shipping threshold (currency units)
       subtotal: 52,          // current subtotal (optional; else summed from data-price)
       currency: '$',
       onCheckout: function () { … }
     });
     // open from anywhere:
     <button data-cart-open>Cart</button>   // any element with data-cart-open toggles it
     <button data-cart-close>×</button>      // closes

   The instance recomputes the free-ship bar whenever quantities change
   (line items use .cartx-qty with + / − buttons and a data-price attr on
   the .cartx-item).
   ============================================ */
(function (root) {
  'use strict';

  var defaults = { freeShip: 0, subtotal: null, currency: '$', onCheckout: null };

  function money(n, cur) { return cur + (Math.round(n * 100) / 100).toFixed(2); }

  function create(el, opts) {
    var o = Object.assign({}, defaults, opts || {});

    function open()  { el.hidden = false; requestAnimationFrame(function () { el.classList.add('is-open'); }); document.documentElement.style.overflow = 'hidden'; }
    function close() { el.classList.remove('is-open'); document.documentElement.style.overflow = ''; setTimeout(function () { el.hidden = true; }, 360); }

    // Global open/close triggers
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-cart-open]'))  { open(); }
      if (e.target.closest('[data-cart-close]')) { close(); }
    });
    el.querySelectorAll('[data-cart-close]').forEach(function (b) { b.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && el.classList.contains('is-open')) close(); });

    function subtotal() {
      if (o.subtotal != null && !el.querySelector('.cartx-item')) return o.subtotal;
      var sum = 0;
      el.querySelectorAll('.cartx-item').forEach(function (it) {
        var price = parseFloat(it.dataset.price || '0');
        var qtyEl = it.querySelector('.cartx-qty span');
        var qty = qtyEl ? parseInt(qtyEl.textContent, 10) || 1 : 1;
        sum += price * qty;
      });
      return sum || (o.subtotal || 0);
    }

    function refresh() {
      var sub = subtotal();
      var subEl = el.querySelector('[data-cart-subtotal]');
      if (subEl) subEl.textContent = money(sub, o.currency);

      var ship = el.querySelector('.cartx-ship');
      if (ship && o.freeShip > 0) {
        var pct = Math.min(100, sub / o.freeShip * 100);
        var bar = ship.querySelector('i'); if (bar) bar.style.setProperty('--p', pct.toFixed(1) + '%');
        var msg = ship.querySelector('.cartx-ship-msg');
        var remaining = o.freeShip - sub;
        if (remaining <= 0) { ship.classList.add('is-free'); if (msg) msg.innerHTML = 'You unlocked <b>free shipping</b> 🎉'; }
        else { ship.classList.remove('is-free'); if (msg) msg.innerHTML = 'You\'re <b>' + money(remaining, o.currency) + '</b> away from free shipping'; }
      }
    }

    // Qty steppers + remove (event delegation)
    el.addEventListener('click', function (e) {
      var inc = e.target.closest('.cartx-qty button');
      if (inc) {
        var span = inc.parentElement.querySelector('span');
        var v = parseInt(span.textContent, 10) || 1;
        v += inc.textContent.trim() === '+' ? 1 : -1;
        if (v < 1) v = 1;
        span.textContent = v;
        refresh();
      }
      var rm = e.target.closest('.cartx-item-remove');
      if (rm) { var item = rm.closest('.cartx-item'); if (item) item.remove(); refresh(); }
      if (e.target.closest('.cartx-checkout') && typeof o.onCheckout === 'function') o.onCheckout();
    });

    refresh();

    return { el: el, open: open, close: close, refresh: refresh };
  }

  function init(target, opts) {
    if (typeof target === 'string') {
      var node = document.querySelector(target);
      return node ? create(node, opts) : null;
    }
    return create(target, opts);
  }

  var CartPro = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = CartPro;
  else root.CartPro = CartPro;
})(typeof window !== 'undefined' ? window : this);
