/* ============================================
   IOS ACTION SHEET — Show + dismiss
   ============================================
   Usage:
     IosActionSheet.show(container, {
       title: 'Delete photo?',
       subtitle: 'This cannot be undone.',
       actions: [
         { label: 'Delete', destructive: true, onTap: function () {} },
         { label: 'Save', onTap: function () {} }
       ],
       cancelLabel: 'Cancel',
       onCancel: function () {}
     });
   ============================================ */
(function (root) {
  'use strict';

  function show(container, opts) {
    opts = opts || {};
    if (typeof container === 'string') container = document.querySelector(container);
    if (!container) return null;

    var overlay = document.createElement('div');
    overlay.className = 'ios-action-overlay';

    var sheet = document.createElement('div');
    sheet.className = 'ios-action-sheet';
    if (opts.title || opts.subtitle) {
      var titleEl = document.createElement('div');
      titleEl.className = 'ios-action-title';
      titleEl.innerHTML =
        (opts.title    ? '<div class="ios-action-title-main">' + esc(opts.title) + '</div>' : '') +
        (opts.subtitle ? '<div class="ios-action-title-sub">'  + esc(opts.subtitle) + '</div>' : '');
      sheet.appendChild(titleEl);
    }
    (opts.actions || []).forEach(function (a) {
      var btn = document.createElement('button');
      btn.className = 'ios-action-row' +
        (a.destructive ? ' is-destructive' : '') +
        (a.bold ? ' is-bold' : '');
      btn.textContent = a.label;
      btn.addEventListener('click', function () {
        dismiss();
        if (typeof a.onTap === 'function') a.onTap();
      });
      sheet.appendChild(btn);
    });
    overlay.appendChild(sheet);

    var cancel = document.createElement('button');
    cancel.className = 'ios-action-cancel';
    cancel.textContent = opts.cancelLabel || 'Cancel';
    cancel.addEventListener('click', function () {
      dismiss();
      if (typeof opts.onCancel === 'function') opts.onCancel();
    });
    overlay.appendChild(cancel);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        dismiss();
        if (typeof opts.onCancel === 'function') opts.onCancel();
      }
    });

    container.appendChild(overlay);

    function dismiss() {
      overlay.classList.add('is-leaving');
      setTimeout(function () { overlay.remove(); }, 220);
    }

    return { dismiss: dismiss, el: overlay };
  }

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var IosActionSheet = { show: show };
  if (typeof module !== 'undefined' && module.exports) module.exports = IosActionSheet;
  else root.IosActionSheet = IosActionSheet;
})(typeof window !== 'undefined' ? window : this);
