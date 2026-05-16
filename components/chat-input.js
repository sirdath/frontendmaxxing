/* ============================================
   CHAT INPUT — Auto-grow textarea, send-on-enter, attachments
   Inspired by Slack / iMessage / Discord composer
   ============================================
   Usage:
     ChatInput.init('[data-chat-input]', {
       submitOnEnter: true,
       shiftForNewline: true,
       onSend: function (text) { … },
       maxLength: 4000
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    submitOnEnter: true,
    shiftForNewline: true,
    onSend: null,
    maxLength: 0
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var text = el.querySelector('.cinp-text');
    var send = el.querySelector('.cinp-send');
    if (!text) return { el: el, destroy: function () {} };

    function autoGrow() {
      text.style.height = 'auto';
      text.style.height = Math.min(text.scrollHeight, 160) + 'px';
    }
    function updateSend() {
      var has = text.value.trim().length > 0;
      if (send) send.disabled = !has;
    }
    function submit() {
      var val = text.value.trim();
      if (!val) return;
      if (typeof o.onSend === 'function') o.onSend(val);
      text.value = '';
      autoGrow();
      updateSend();
    }
    function onInput() {
      if (o.maxLength && text.value.length > o.maxLength) {
        text.value = text.value.slice(0, o.maxLength);
      }
      autoGrow();
      updateSend();
    }
    function onKey(e) {
      if (e.key !== 'Enter') return;
      if (!o.submitOnEnter) return;
      if (o.shiftForNewline && e.shiftKey) return;
      e.preventDefault();
      submit();
    }
    function onFormSubmit(e) {
      e.preventDefault();
      submit();
    }

    text.addEventListener('input', onInput);
    text.addEventListener('keydown', onKey);
    el.addEventListener('submit', onFormSubmit);
    if (send) send.addEventListener('click', function (e) { e.preventDefault(); submit(); });

    autoGrow();
    updateSend();

    function destroy() {
      text.removeEventListener('input', onInput);
      text.removeEventListener('keydown', onKey);
      el.removeEventListener('submit', onFormSubmit);
    }

    return { el: el, submit: submit, focus: function () { text.focus(); }, destroy: destroy };
  }

  var ChatInput = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = ChatInput;
  else root.ChatInput = ChatInput;
})(typeof window !== 'undefined' ? window : this);
