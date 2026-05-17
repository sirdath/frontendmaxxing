/* ============================================
   CHATBOT PACK — Toggle widget, send message, typing indicator, feedback
   ============================================
   Usage:
     var bot = ChatbotPack.widget({
       launcher: '[data-cbp-launch]',
       window: '[data-cbp-win]',
       greeting: 'Hi! How can I help?',
       onSend: function (text, addBotReply) {
         // call your API, then:
         addBotReply('Working on it...');
       }
     });
     bot.open(); bot.close(); bot.addBot('text'); bot.addUser('text');

     ChatbotPack.feedback('[data-cbp-fb]', { onFeedback: function (kind) {} });
     ChatbotPack.prompt('[data-cbp-prompt]', { onChange: function (filled) {} });
   ============================================ */
(function (root) {
  'use strict';

  function each(target, fn) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, fn);
  }

  function widget(opts) {
    opts = opts || {};
    var launcher = typeof opts.launcher === 'string' ? document.querySelector(opts.launcher) : opts.launcher;
    var win = typeof opts.window === 'string' ? document.querySelector(opts.window) : opts.window;
    if (!win) return null;
    var body = win.querySelector('.cbp-win-body');
    var input = win.querySelector('.cbp-win-input');
    var send = win.querySelector('.cbp-win-send');
    var closeBtn = win.querySelector('.cbp-win-x');

    function open() { win.classList.add('is-open'); if (typeof opts.onOpen === 'function') opts.onOpen(); if (input) setTimeout(function () { input.focus(); }, 200); }
    function close() { win.classList.remove('is-open'); if (typeof opts.onClose === 'function') opts.onClose(); }
    function toggle() { win.classList.contains('is-open') ? close() : open(); }

    function addMsg(text, who) {
      var d = document.createElement('div');
      d.className = 'cbp-msg ' + who;
      d.textContent = text;
      body.appendChild(d);
      body.scrollTop = body.scrollHeight;
      return d;
    }
    function addUser(text) { return addMsg(text, 'user'); }
    function addBot(text) { return addMsg(text, 'bot'); }
    function addTyping() {
      var d = document.createElement('div');
      d.className = 'cbp-msg typing';
      d.innerHTML = '<i></i><i></i><i></i>';
      body.appendChild(d);
      body.scrollTop = body.scrollHeight;
      return d;
    }

    if (launcher) launcher.addEventListener('click', toggle);
    if (closeBtn) closeBtn.addEventListener('click', close);

    function fireSend() {
      var text = input.value.trim(); if (!text) return;
      addUser(text); input.value = '';
      var typing = addTyping();
      function reply(t) { typing.remove(); addBot(t); }
      if (typeof opts.onSend === 'function') opts.onSend(text, reply);
      else setTimeout(function () { reply('Got it.'); }, 700);
    }
    if (send) send.addEventListener('click', fireSend);
    if (input) input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') fireSend();
    });

    if (opts.greeting) addBot(opts.greeting);

    return { open: open, close: close, toggle: toggle, addUser: addUser, addBot: addBot, el: win };
  }

  function feedback(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      host.querySelectorAll('.cbp-fb-btn').forEach(function (b) {
        b.addEventListener('click', function () {
          var kind = b.dataset.kind || (b.classList.contains('good') ? 'good' : b.classList.contains('bad') ? 'bad' : b.classList.contains('copy') ? 'copy' : 'action');
          if (kind === 'good' || kind === 'bad') {
            host.querySelectorAll('.cbp-fb-btn.good, .cbp-fb-btn.bad').forEach(function (x) { x.classList.remove('is-on'); });
            b.classList.add('is-on');
          } else if (kind === 'copy') {
            b.classList.add('is-copied');
            setTimeout(function () { b.classList.remove('is-copied'); }, 1200);
          }
          if (typeof opts.onFeedback === 'function') opts.onFeedback(kind, b);
        });
      });
    });
  }

  function prompt(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var slots = host.querySelectorAll('.cbp-prompt-slot');
      slots.forEach(function (s) {
        s.setAttribute('contenteditable', 'true');
        s.addEventListener('input', function () {
          if (typeof opts.onChange === 'function') {
            var vals = {};
            slots.forEach(function (x) { if (x.dataset.slot) vals[x.dataset.slot] = x.textContent.trim(); });
            opts.onChange(vals);
          }
        });
      });
      host.querySelectorAll('.cbp-prompt-tag').forEach(function (t) {
        t.addEventListener('click', function () {
          var slot = host.querySelector('.cbp-prompt-slot[data-slot="' + (t.dataset.slot || 'value') + '"]');
          if (slot) slot.textContent = t.textContent.trim();
          if (typeof opts.onChange === 'function') opts.onChange();
        });
      });
    });
  }

  var ChatbotPack = { widget: widget, feedback: feedback, prompt: prompt };
  if (typeof module !== 'undefined' && module.exports) module.exports = ChatbotPack;
  else root.ChatbotPack = ChatbotPack;
})(typeof window !== 'undefined' ? window : this);
