/* ============================================
   TRIAGE ROW — Keyboard-first inline-editable list controller
   Inspired by Linear Triage
   ============================================
   Usage:
     TriageRow.init('.trg', {
       fields: {
         priority: { type: 'select', options: ['urgent','high','medium','low','none'] },
         status:   { type: 'select', options: ['Backlog','Todo','In Progress','In Review','Done','Cancelled'] },
         title:    { type: 'text' },
         labels:   { type: 'multi-select', options: ['bug', 'feature', 'a11y', 'perf', 'design'] },
         assignee: { type: 'user', options: [{ id, name, initials, color }] },
         due:      { type: 'date' }
       },
       onChange: function (rowId, field, value) {},
       onCommit: function (row) {},
       onBulk:   function (action, rowIds) {}
     });

   Keyboard shortcuts:
     j/k or ↓/↑    — focus next/prev row
     Enter / e     — open inline editor on focused row (first editable field)
     Esc           — close editor / blur
     x             — toggle selection (for bulk)
     ⌘A            — select all
     ⌘D            — duplicate (emits onBulk('duplicate'))
     Backspace     — delete (emits onBulk('delete'))
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    fields: {},
    onChange: null,
    onCommit: null,
    onBulk: null
  };

  function init(target, opts) {
    var hosts = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var insts = [];
    Array.prototype.forEach.call(hosts, function (host) { insts.push(create(host, opts)); });
    return insts.length === 1 ? insts[0] : insts;
  }

  function create(host, opts) {
    var o = mergeOpts(opts);
    host.setAttribute('tabindex', '0');

    var rows = function () { return Array.prototype.slice.call(host.querySelectorAll('.trg-row')); };
    var focusedIdx = 0;
    var selected = new Set();
    var editor = null;

    function focusRow(idx) {
      var all = rows();
      if (!all.length) return;
      focusedIdx = (idx + all.length) % all.length;
      all.forEach(function (r, i) { r.classList.toggle('is-focused', i === focusedIdx); });
      all[focusedIdx].scrollIntoView({ block: 'nearest' });
    }

    function toggleSelect(idx) {
      var all = rows();
      var row = all[idx];
      if (!row) return;
      var id = row.dataset.trgId;
      if (selected.has(id)) {
        selected.delete(id);
        row.classList.remove('is-selected');
      } else {
        selected.add(id);
        row.classList.add('is-selected');
      }
      updateBulkBar();
    }

    function updateBulkBar() {
      var bar = host.querySelector('.trg-bulk');
      if (selected.size === 0) {
        if (bar) bar.remove();
        return;
      }
      if (!bar) {
        bar = document.createElement('div');
        bar.className = 'trg-bulk';
        bar.innerHTML =
          '<span class="trg-bulk-count">0 selected</span>' +
          '<div class="trg-bulk-actions">' +
            '<button data-trg-bulk="status">Status</button>' +
            '<button data-trg-bulk="assignee">Assignee</button>' +
            '<button data-trg-bulk="delete">Delete</button>' +
          '</div>';
        host.insertBefore(bar, host.firstChild);
        bar.querySelectorAll('[data-trg-bulk]').forEach(function (b) {
          b.addEventListener('click', function () {
            if (typeof o.onBulk === 'function') o.onBulk(b.dataset.trgBulk, Array.from(selected));
          });
        });
      }
      bar.querySelector('.trg-bulk-count').textContent = selected.size + ' selected';
    }

    host.addEventListener('click', function (e) {
      var row = e.target.closest('.trg-row');
      if (!row) return;
      var all = rows();
      var idx = all.indexOf(row);
      if (e.shiftKey || e.target.closest('.trg-row > .trg-key')) {
        toggleSelect(idx);
      } else {
        focusRow(idx);
      }
      var field = e.target.closest('[data-trg-field]');
      if (field) {
        openEditor(row, field);
        e.stopPropagation();
      }
    });

    host.addEventListener('keydown', function (e) {
      if (editor) return;
      if (e.key === 'j' || e.key === 'ArrowDown') { e.preventDefault(); focusRow(focusedIdx + 1); }
      else if (e.key === 'k' || e.key === 'ArrowUp') { e.preventDefault(); focusRow(focusedIdx - 1); }
      else if (e.key === 'Enter' || e.key === 'e') {
        e.preventDefault();
        var row = rows()[focusedIdx];
        if (row) openEditor(row, row.querySelector('.trg-title'));
      } else if (e.key === 'x') {
        e.preventDefault();
        toggleSelect(focusedIdx);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        selected.clear();
        rows().forEach(function (r) { selected.add(r.dataset.trgId); r.classList.add('is-selected'); });
        updateBulkBar();
      } else if (e.key === 'Backspace' && selected.size) {
        e.preventDefault();
        if (typeof o.onBulk === 'function') o.onBulk('delete', Array.from(selected));
      }
    });

    function openEditor(row, fieldEl) {
      closeEditor();
      var fieldName = fieldEl.dataset.trgField;
      if (!fieldName) return;
      var def = o.fields[fieldName];
      if (!def) return;

      editor = document.createElement('div');
      editor.className = 'trg-edit';
      row.classList.add('is-editing');

      if (def.type === 'text') {
        editor.innerHTML = '<input type="text" value="' + escapeAttr(fieldEl.textContent.trim()) + '">';
        var input = editor.querySelector('input');
        setTimeout(function () { input.focus(); input.select(); }, 30);
        input.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') {
            e.preventDefault();
            fieldEl.textContent = input.value;
            emitChange(row.dataset.trgId, fieldName, input.value);
            closeEditor();
          } else if (e.key === 'Escape') {
            closeEditor();
          }
        });
      } else if (def.type === 'select' || def.type === 'multi-select' || def.type === 'user') {
        editor.innerHTML = '<input type="text" placeholder="Search…"><div class="trg-edit-list"></div>';
        var input2 = editor.querySelector('input');
        var list = editor.querySelector('.trg-edit-list');
        var options = def.options || [];
        var focusedOpt = 0;
        function renderList(filter) {
          var q = (filter || '').toLowerCase();
          list.innerHTML = '';
          options.forEach(function (opt, i) {
            var label = typeof opt === 'string' ? opt : (opt.name || opt.label || opt.id);
            if (q && label.toLowerCase().indexOf(q) === -1) return;
            var item = document.createElement('div');
            item.className = 'trg-edit-item' + (i === focusedOpt ? ' is-focused' : '');
            item.innerHTML = (typeof opt === 'object' && opt.initials ?
              '<span class="trg-avatar" style="--av-c:' + (opt.color || '#818cf8') + '">' + escape(opt.initials) + '</span>' : '') +
              '<span>' + escape(label) + '</span>';
            item.addEventListener('click', function () {
              emitChange(row.dataset.trgId, fieldName, opt);
              if (fieldEl) {
                if (typeof opt === 'string') fieldEl.textContent = opt;
                else if (opt.name) fieldEl.textContent = opt.name;
              }
              closeEditor();
            });
            list.appendChild(item);
          });
        }
        renderList('');
        setTimeout(function () { input2.focus(); }, 30);
        input2.addEventListener('input', function () { renderList(input2.value); });
        input2.addEventListener('keydown', function (e) {
          var items = list.querySelectorAll('.trg-edit-item');
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            focusedOpt = Math.min(items.length - 1, focusedOpt + 1);
            items.forEach(function (it, i) { it.classList.toggle('is-focused', i === focusedOpt); });
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            focusedOpt = Math.max(0, focusedOpt - 1);
            items.forEach(function (it, i) { it.classList.toggle('is-focused', i === focusedOpt); });
          } else if (e.key === 'Enter') {
            e.preventDefault();
            if (items[focusedOpt]) items[focusedOpt].click();
          } else if (e.key === 'Escape') {
            closeEditor();
          }
        });
      }

      // Position editor
      var fRect = fieldEl.getBoundingClientRect();
      var rRect = row.getBoundingClientRect();
      editor.style.top = (fRect.bottom - rRect.top + row.offsetTop + 4) + 'px';
      editor.style.left = Math.max(8, fRect.left - rRect.left + row.offsetLeft) + 'px';
      host.appendChild(editor);

      setTimeout(function () { document.addEventListener('click', onOutside); }, 0);
    }
    function onOutside(e) {
      if (editor && !editor.contains(e.target)) closeEditor();
    }
    function closeEditor() {
      if (!editor) return;
      editor.remove();
      editor = null;
      host.querySelectorAll('.is-editing').forEach(function (r) { r.classList.remove('is-editing'); });
      document.removeEventListener('click', onOutside);
    }

    function emitChange(id, field, value) {
      if (typeof o.onChange === 'function') o.onChange(id, field, value);
    }

    focusRow(0);

    return {
      host: host,
      focusRow: focusRow,
      toggleSelect: toggleSelect,
      getSelected: function () { return Array.from(selected); },
      clearSelection: function () {
        selected.clear();
        host.querySelectorAll('.is-selected').forEach(function (r) { r.classList.remove('is-selected'); });
        updateBulkBar();
      },
      closeEditor: closeEditor
    };
  }

  function escape(s) {
    return String(s == null ? '' : s).replace(/[<>&]/g, function (c) { return ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]); });
  }
  function escapeAttr(s) { return escape(s).replace(/"/g, '&quot;'); }
  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var TriageRow = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = TriageRow;
  else root.TriageRow = TriageRow;
})(typeof window !== 'undefined' ? window : this);
