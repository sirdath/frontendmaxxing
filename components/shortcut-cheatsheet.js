/* ============================================
   SHORTCUT CHEATSHEET — "?" overlay listing app keybindings, platform-aware
   Inspired by GitHub, Gmail, Linear, Vercel
   ============================================
   Usage:
     ShortcutCheatsheet.init({
       title: 'Keyboard shortcuts',
       triggerKey: '?',
       groups: [
         { title: 'General', items: [
           { keys: ['mod', 'k'], label: 'Command palette' },
           { keys: ['mod', '/'], label: 'Toggle sidebar' },
           { keys: ['g', 'h'], label: 'Go home', combo: 'sequence' },
         ]}
       ]
     });

     ShortcutCheatsheet.open();
     ShortcutCheatsheet.close();
     ShortcutCheatsheet.setGroups([{...}]);

     // Also auto-detects [data-shc-trigger] elements to open on click.

   Key glyphs (auto, platform-aware):
     mod → ⌘ (Mac) | Ctrl (others)
     alt → ⌥ | Alt
     shift → ⇧
     enter → ↵
     esc → Esc
     up/down/left/right → ↑↓←→
     space → Space
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    title: 'Keyboard shortcuts',
    subtitle: '',
    groups: [],
    triggerKey: '?',
    triggerSelector: '[data-shc-trigger]',
    enableSearch: true,
    style: 'default'   // 'default' | 'wide' | 'cmd-style'
  };

  var isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  var keyMap = isMac
    ? { mod: '⌘', alt: '⌥', shift: '⇧', enter: '↵', esc: 'esc', backspace: '⌫', tab: '⇥', space: 'Space',
        up: '↑', down: '↓', left: '←', right: '→' }
    : { mod: 'Ctrl', alt: 'Alt', shift: 'Shift', enter: '↵', esc: 'Esc', backspace: '⌫', tab: 'Tab', space: 'Space',
        up: '↑', down: '↓', left: '←', right: '→' };

  var state = { backdrop: null, modal: null, opts: null };

  function init(opts) {
    state.opts = mergeOpts(opts);

    // Bind global keyboard trigger
    document.addEventListener('keydown', function (e) {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) return;
      if (e.key === state.opts.triggerKey && !state.modal) {
        e.preventDefault();
        open();
      }
    });

    // Bind any [data-shc-trigger] elements
    document.querySelectorAll(state.opts.triggerSelector).forEach(function (el) {
      el.addEventListener('click', open);
    });
  }

  function setGroups(groups) {
    if (state.opts) state.opts.groups = groups;
    if (state.modal) render();
  }

  function open() {
    if (state.modal) return;
    state.backdrop = document.createElement('div');
    state.backdrop.className = 'shc-backdrop';
    state.modal = document.createElement('div');
    state.modal.className = 'shc-modal' + (state.opts.style === 'wide' ? ' shc-modal-wide' : '') +
                            (state.opts.style === 'cmd-style' ? ' shc-cmd-style' : '');
    state.modal.setAttribute('role', 'dialog');
    state.modal.setAttribute('aria-modal', 'true');
    state.modal.setAttribute('aria-label', state.opts.title);

    state.modal.innerHTML =
      '<div class="shc-head">' +
        '<div>' +
          '<div class="shc-title"></div>' +
          (state.opts.subtitle ? '<div class="shc-subtitle"></div>' : '') +
        '</div>' +
        (state.opts.enableSearch ?
          '<div class="shc-search">' +
            '<span class="shc-search-icon">⌕</span>' +
            '<input type="text" placeholder="Filter shortcuts…" autocomplete="off">' +
          '</div>' : '') +
        '<button class="shc-close" type="button" aria-label="Close">✕</button>' +
      '</div>' +
      '<div class="shc-body"><div class="shc-cols"></div></div>' +
      '<div class="shc-foot">' +
        '<span><span class="shc-kbd">esc</span> close · <span class="shc-kbd">?</span> toggle</span>' +
        '<span>' + (isMac ? 'macOS' : 'Win/Linux') + '</span>' +
      '</div>';

    document.body.appendChild(state.backdrop);
    document.body.appendChild(state.modal);

    state.modal.querySelector('.shc-title').textContent = state.opts.title;
    if (state.opts.subtitle) state.modal.querySelector('.shc-subtitle').textContent = state.opts.subtitle;

    render();

    requestAnimationFrame(function () {
      state.backdrop.classList.add('is-open');
      state.modal.classList.add('is-open');
      var input = state.modal.querySelector('input');
      if (input) input.focus();
    });

    state.backdrop.addEventListener('click', close);
    state.modal.querySelector('.shc-close').addEventListener('click', close);
    document.addEventListener('keydown', onKey);
    var input = state.modal.querySelector('input');
    if (input) input.addEventListener('input', function () { render(input.value); });
  }

  function close() {
    if (!state.modal) return;
    state.backdrop.classList.remove('is-open');
    state.modal.classList.remove('is-open');
    var b = state.backdrop, m = state.modal;
    setTimeout(function () {
      if (b.parentNode) b.parentNode.removeChild(b);
      if (m.parentNode) m.parentNode.removeChild(m);
    }, 200);
    state.backdrop = null;
    state.modal = null;
    document.removeEventListener('keydown', onKey);
  }

  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === state.opts.triggerKey) { e.preventDefault(); close(); }
  }

  function render(filter) {
    if (!state.modal) return;
    var cols = state.modal.querySelector('.shc-cols');
    var q = (filter || '').trim().toLowerCase();
    var html = '';
    var totalMatched = 0;

    state.opts.groups.forEach(function (group) {
      var items = (group.items || []).filter(function (it) {
        if (!q) return true;
        return it.label.toLowerCase().indexOf(q) !== -1
          || (it.keys || []).join(' ').toLowerCase().indexOf(q) !== -1;
      });
      if (!items.length) return;
      totalMatched += items.length;
      html += '<div class="shc-group">' +
        '<div class="shc-group-title">' + escape(group.title) + '</div>';
      items.forEach(function (it) {
        html += '<div class="shc-row">' +
          '<span class="shc-label">' + escape(it.label) + '</span>' +
          '<span class="shc-keys">' + keysHtml(it.keys, it.combo) + '</span>' +
        '</div>';
      });
      html += '</div>';
    });

    if (!totalMatched) {
      html = '<div class="shc-empty">No shortcuts match "' + escape(q) + '"</div>';
    }
    cols.innerHTML = html;
  }

  function keysHtml(keys, combo) {
    if (!keys || !keys.length) return '';
    var sep = combo === 'sequence'
      ? '<span class="shc-kbd-then">then</span>'
      : '<span class="shc-kbd-plus">+</span>';
    return keys.map(function (k) {
      return '<span class="shc-kbd">' + escape(format(k)) + '</span>';
    }).join(sep);
  }

  function format(k) {
    if (keyMap[k]) return keyMap[k];
    return k.length === 1 ? k.toUpperCase() : k;
  }

  function escape(s) {
    return String(s == null ? '' : s).replace(/[<>&"]/g, function (c) {
      return ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]);
    });
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var ShortcutCheatsheet = {
    init: init,
    open: open,
    close: close,
    setGroups: setGroups,
    isMac: isMac,
    keyMap: keyMap
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = ShortcutCheatsheet;
  else root.ShortcutCheatsheet = ShortcutCheatsheet;
})(typeof window !== 'undefined' ? window : this);
