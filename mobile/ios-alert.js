/* ============================================
   IOS ALERT — Show + dismiss
   ============================================
   Usage:
     IosAlert.show(container, {
       title: 'Delete this photo?',
       message: 'This will remove it from your library.',
       buttons: [
         { label: 'Cancel' },
         { label: 'Delete', destructive: true, bold: true, onTap: function () {} }
       ]
     });
   ============================================ */
(function (root) {
  'use strict';

  function show(container, opts) {
    opts = opts || {};
    if (typeof container === 'string') container = document.querySelector(container);
    if (!container) return null;

    var overlay = document.createElement('div');
    overlay.className = 'ios-alert-overlay';

    var alertEl = document.createElement('div');
    alertEl.className = 'ios-alert';

    var body = document.createElement('div');
    body.className = 'ios-alert-body';
    body.innerHTML =
      (opts.title   ? '<div class="ios-alert-title">' + esc(opts.title) + '</div>' : '') +
      (opts.message ? '<div class="ios-alert-message">' + esc(opts.message) + '</div>' : '');
    alertEl.appendChild(body);

    var btnRow = document.createElement('div');
    btnRow.className = 'ios-alert-buttons';
    var btns = opts.buttons || [{ label: 'OK', bold: true }];
    if (btns.length > 2) btnRow.classList.add('is-vertical');

    btns.forEach(function (b) {
      var bn = document.createElement('button');
      bn.className = 'ios-alert-btn' +
        (b.bold ? ' is-bold' : '') +
        (b.destructive ? ' is-destructive' : '');
      bn.textContent = b.label;
      bn.addEventListener('click', function () {
        dismiss();
        if (typeof b.onTap === 'function') b.onTap();
      });
      btnRow.appendChild(bn);
    });
    alertEl.appendChild(btnRow);
    overlay.appendChild(alertEl);
    container.appendChild(overlay);

    function dismiss() {
      overlay.classList.add('is-leaving');
      setTimeout(function () { overlay.remove(); }, 180);
    }

    return { dismiss: dismiss, el: overlay };
  }

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var IosAlert = { show: show };
  if (typeof module !== 'undefined' && module.exports) module.exports = IosAlert;
  else root.IosAlert = IosAlert;
})(typeof window !== 'undefined' ? window : this);
