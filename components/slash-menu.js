/* ============================================
   SLASH MENU — Caret-anchored block-insert palette controller
   Inspired by Notion, BlockNote, Tiptap
   ============================================
   Usage:
     SlashMenu.bind('[data-slash]', {
       trigger: '/',
       items: [
         { id, label, desc, icon, group, keywords, insert(editor, ctx) },
         ...
       ],
       onSelect: function (item, editor) { item.insert && item.insert(editor); }
     });

     // The menu opens when the user types `trigger` at the start of a line
     // (or after whitespace) inside the bound element, filters as typing
     // continues, and inserts the chosen item on Enter or click.
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    trigger: '/',
    items: [],
    onSelect: null,
    placement: 'bottom',   // 'bottom' | 'top' | 'auto'
    caretOffset: { x: 0, y: 24 },
    maxResults: 50,
    onClose: null
  };

  function bind(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var binds = [];
    Array.prototype.forEach.call(els, function (el) { binds.push(create(el, opts)); });
    return binds.length === 1 ? binds[0] : binds;
  }

  function create(editor, opts) {
    var o = mergeOpts(opts);
    var menu = null;
    var query = '';
    var focused = 0;
    var triggerPosition = null;

    function onInput(e) {
      var text = getText(editor);
      var pos = getCaretOffset(editor);
      // Find a trigger at or before the caret
      var slashIdx = findTriggerStart(text, pos, o.trigger);
      if (slashIdx === -1) {
        if (menu) close();
        return;
      }
      query = text.slice(slashIdx + 1, pos);
      // Bail if the query has whitespace (user moved past the trigger)
      if (/\s/.test(query)) { if (menu) close(); return; }
      triggerPosition = slashIdx;
      if (!menu) open();
      filterAndRender();
    }

    function onKey(e) {
      if (!menu) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        moveFocus(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        moveFocus(-1);
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        selectCurrent();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    }

    function open() {
      menu = document.createElement('div');
      menu.className = 'slm';
      menu.setAttribute('role', 'listbox');
      menu.innerHTML =
        '<div class="slm-query"></div>' +
        '<div class="slm-list"></div>' +
        '<div class="slm-foot">' +
          '<span><span class="slm-kbd">↑↓</span> navigate</span>' +
          '<span><span class="slm-kbd">⏎</span> insert</span>' +
          '<span><span class="slm-kbd">esc</span> cancel</span>' +
        '</div>';
      document.body.appendChild(menu);

      menu.querySelector('.slm-list').addEventListener('click', function (e) {
        var item = e.target.closest('.slm-item');
        if (!item) return;
        focused = parseInt(item.dataset.slmIndex, 10) || 0;
        selectCurrent();
      });

      positionMenu();
      requestAnimationFrame(function () { if (menu) menu.classList.add('is-open'); });
    }

    function close() {
      if (!menu) return;
      menu.classList.remove('is-open');
      var m = menu;
      setTimeout(function () { if (m.parentNode) m.parentNode.removeChild(m); }, 150);
      menu = null;
      query = '';
      focused = 0;
      triggerPosition = null;
      if (typeof o.onClose === 'function') o.onClose();
    }

    function positionMenu() {
      if (!menu) return;
      var rect = getCaretRect();
      if (!rect) {
        var elRect = editor.getBoundingClientRect();
        rect = { left: elRect.left, top: elRect.top, bottom: elRect.top + 20, height: 20 };
      }
      var menuW = 280;
      var menuH = Math.min(menu.offsetHeight || 360, 360);
      var spaceBelow = window.innerHeight - rect.bottom;
      var below = (o.placement === 'bottom') || (o.placement === 'auto' && spaceBelow > menuH);
      var top = below ? (rect.bottom + window.scrollY + o.caretOffset.y - 18) : (rect.top + window.scrollY - menuH - 4);
      var left = rect.left + window.scrollX + o.caretOffset.x;
      // Clamp horizontally
      left = Math.max(8, Math.min(window.innerWidth - menuW - 8, left));
      menu.style.left = left + 'px';
      menu.style.top = top + 'px';
    }

    function filterAndRender() {
      if (!menu) return;
      menu.querySelector('.slm-query').textContent = query || ' ';
      var filtered = filter(o.items, query).slice(0, o.maxResults);
      var grouped = groupBy(filtered, 'group');
      focused = Math.min(focused, filtered.length - 1);
      if (focused < 0) focused = 0;

      var html = '';
      var idx = 0;
      Object.keys(grouped).forEach(function (g) {
        if (g && g !== 'undefined') html += '<div class="slm-group">' + escape(g) + '</div>';
        grouped[g].forEach(function (item) {
          var active = idx === focused;
          html +=
            '<div class="slm-item' + (active ? ' is-active' : '') + '" ' +
                  'role="option" data-slm-index="' + idx + '" data-slm-id="' + escape(item.id) + '">' +
              '<span class="slm-icon">' + escape(item.icon || '') + '</span>' +
              '<div class="slm-body">' +
                '<div class="slm-label">' + escape(item.label) +
                  (item.tag ? '<span class="slm-tag slm-tag-' + escape(item.tag) + '">' + escape(item.tag) + '</span>' : '') +
                '</div>' +
                (item.desc ? '<div class="slm-desc">' + escape(item.desc) + '</div>' : '') +
              '</div>' +
              '<span class="slm-kbd">↵</span>' +
            '</div>';
          idx++;
        });
      });
      if (!filtered.length) html = '<div class="slm-empty">No matches</div>';
      menu.querySelector('.slm-list').innerHTML = html;
      menu._items = filtered;
      positionMenu();
    }

    function moveFocus(delta) {
      if (!menu || !menu._items) return;
      focused = (focused + delta + menu._items.length) % menu._items.length;
      filterAndRender();
      var act = menu.querySelector('.slm-item.is-active');
      if (act) act.scrollIntoView({ block: 'nearest' });
    }

    function selectCurrent() {
      if (!menu || !menu._items || !menu._items.length) return;
      var item = menu._items[focused];
      // Remove the slash trigger + query from the editor
      removeTrigger();
      close();
      if (typeof o.onSelect === 'function') o.onSelect(item, editor);
      else if (typeof item.insert === 'function') item.insert(editor);
    }

    function removeTrigger() {
      if (editor.isContentEditable) {
        // contenteditable — use Selection.modify or manual range
        var sel = window.getSelection();
        if (!sel.rangeCount) return;
        var range = sel.getRangeAt(0);
        var charsToDelete = (query.length + 1);
        for (var i = 0; i < charsToDelete; i++) {
          range.setStart(range.startContainer, Math.max(0, range.startOffset - 1));
          range.deleteContents();
        }
      } else if (editor.value !== undefined) {
        var v = editor.value;
        var pos = editor.selectionStart;
        var start = pos - (query.length + 1);
        editor.value = v.slice(0, start) + v.slice(pos);
        editor.selectionStart = editor.selectionEnd = start;
      }
    }

    editor.addEventListener('input', onInput);
    editor.addEventListener('keydown', onKey);
    editor.addEventListener('blur', function () { setTimeout(function () { if (menu) close(); }, 150); });
    window.addEventListener('resize', positionMenu);
    window.addEventListener('scroll', positionMenu, { passive: true });

    function destroy() {
      editor.removeEventListener('input', onInput);
      editor.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', positionMenu);
      window.removeEventListener('scroll', positionMenu);
      if (menu) close();
    }

    return { editor: editor, close: close, destroy: destroy };
  }

  // ===== Editor introspection =====
  function getText(editor) {
    if (editor.isContentEditable) return editor.textContent || '';
    return editor.value || '';
  }
  function getCaretOffset(editor) {
    if (editor.isContentEditable) {
      var sel = window.getSelection();
      if (!sel.rangeCount) return 0;
      var range = sel.getRangeAt(0).cloneRange();
      range.selectNodeContents(editor);
      range.setEnd(sel.getRangeAt(0).endContainer, sel.getRangeAt(0).endOffset);
      return range.toString().length;
    }
    return editor.selectionStart || 0;
  }
  function getCaretRect() {
    var sel = window.getSelection();
    if (!sel.rangeCount) return null;
    var range = sel.getRangeAt(0).cloneRange();
    var rect;
    if (range.collapsed) {
      var span = document.createElement('span');
      span.textContent = '​';
      range.insertNode(span);
      rect = span.getBoundingClientRect();
      span.parentNode.removeChild(span);
      // Restore selection
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      rect = range.getBoundingClientRect();
    }
    return rect;
  }
  function findTriggerStart(text, pos, trigger) {
    var i = pos - 1;
    while (i >= 0) {
      var c = text[i];
      if (c === trigger) {
        var prev = text[i - 1];
        if (i === 0 || /\s/.test(prev || '')) return i;
        return -1;
      }
      if (/\s/.test(c)) return -1;
      i--;
    }
    return -1;
  }

  function filter(items, q) {
    if (!q) return items;
    var query = q.toLowerCase();
    return items
      .map(function (item) {
        var hay = (item.label + ' ' + (item.desc || '') + ' ' + (item.id || '') + ' ' + ((item.keywords || []).join(' '))).toLowerCase();
        var idx = hay.indexOf(query);
        return idx === -1 ? null : { item: item, score: -idx };
      })
      .filter(Boolean)
      .sort(function (a, b) { return b.score - a.score; })
      .map(function (x) { return x.item; });
  }

  function groupBy(arr, key) {
    var out = {};
    arr.forEach(function (m) {
      var k = m[key] || '';
      if (!out[k]) out[k] = [];
      out[k].push(m);
    });
    return out;
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

  var SlashMenu = { bind: bind };
  if (typeof module !== 'undefined' && module.exports) module.exports = SlashMenu;
  else root.SlashMenu = SlashMenu;
})(typeof window !== 'undefined' ? window : this);
