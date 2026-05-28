/* ============================================
   DIALOG — Promise-based confirm / alert / prompt (replaces native dialogs)
   Inspired by Radix AlertDialog
   ============================================
   Usage:
     Dialog.confirm({ title, message, okText, cancelText, danger, icon }) → Promise<boolean>
     Dialog.alert({ title, message, okText, icon })                        → Promise<void>
     Dialog.prompt({ title, message, value, placeholder, okText, cancelText }) → Promise<string|null>

   Behavior: Esc / scrim / Cancel → resolves false|null; Enter / OK → resolves
   true|value. Focus moves into the dialog and is restored on close. One dialog
   at a time (queues are your job). Add class 'dlg-light' via opts.theme.
   ============================================ */
(function (root) {
  'use strict';

  function el(tag, cls, html) { var n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function open(type, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var prevFocus = document.activeElement;

      var wrap = el('div', 'dlg' + (opts.danger ? ' dlg-danger' : '') + (opts.theme === 'light' ? ' dlg-light' : ''));
      var scrim = el('div', 'dlg-scrim');
      var box = el('div', 'dlg-box');
      box.setAttribute('role', type === 'alert' ? 'alertdialog' : 'dialog');
      box.setAttribute('aria-modal', 'true');

      var html = '';
      if (opts.icon !== false) html += '<div class="dlg-icon">' + (opts.icon || (opts.danger ? '⚠' : (type === 'alert' ? 'ℹ' : '?'))) + '</div>';
      if (opts.title) html += '<h2 class="dlg-title">' + esc(opts.title) + '</h2>';
      if (opts.message) html += '<p class="dlg-msg">' + esc(opts.message) + '</p>';
      box.innerHTML = html;

      var input = null;
      if (type === 'prompt') {
        input = el('input', 'dlg-input');
        input.value = opts.value || '';
        if (opts.placeholder) input.placeholder = opts.placeholder;
        if (opts.inputType) input.type = opts.inputType;
        box.appendChild(input);
      }

      var actions = el('div', 'dlg-actions');
      var cancelBtn = null;
      if (type !== 'alert') {
        cancelBtn = el('button', 'dlg-btn dlg-cancel', esc(opts.cancelText || 'Cancel'));
        actions.appendChild(cancelBtn);
      }
      var okBtn = el('button', 'dlg-btn dlg-ok', esc(opts.okText || (type === 'confirm' ? 'Confirm' : type === 'prompt' ? 'OK' : 'OK')));
      actions.appendChild(okBtn);
      box.appendChild(actions);

      wrap.appendChild(scrim); wrap.appendChild(box);
      document.body.appendChild(wrap);
      requestAnimationFrame(function () { wrap.classList.add('is-open'); });

      var done = false;
      function close(result) {
        if (done) return; done = true;
        wrap.classList.remove('is-open');
        document.removeEventListener('keydown', onKey, true);
        setTimeout(function () { wrap.remove(); if (prevFocus && prevFocus.focus) prevFocus.focus(); }, 220);
        resolve(result);
      }

      function accept() {
        if (type === 'confirm') close(true);
        else if (type === 'prompt') close(input.value);
        else close();
      }
      function reject() {
        if (type === 'confirm') close(false);
        else if (type === 'prompt') close(null);
        else close();
      }

      okBtn.addEventListener('click', accept);
      if (cancelBtn) cancelBtn.addEventListener('click', reject);
      scrim.addEventListener('click', reject);

      function onKey(e) {
        if (e.key === 'Escape') { e.preventDefault(); reject(); }
        else if (e.key === 'Enter' && (type !== 'prompt' || document.activeElement === input || document.activeElement === okBtn)) {
          e.preventDefault(); accept();
        } else if (e.key === 'Tab') {
          // simple focus trap between the focusable controls
          var f = box.querySelectorAll('button, input');
          if (!f.length) return;
          var first = f[0], last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
      document.addEventListener('keydown', onKey, true);

      // initial focus
      requestAnimationFrame(function () { (input || okBtn).focus(); if (input) input.select(); });
    });
  }

  var Dialog = {
    confirm: function (o) { return open('confirm', o); },
    alert:   function (o) { return open('alert', o); },
    prompt:  function (o) { return open('prompt', o); }
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = Dialog;
  else root.Dialog = Dialog;
})(typeof window !== 'undefined' ? window : this);
