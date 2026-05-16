/* ============================================
   SELECT — Open/close, search-filter, keyboard nav, value binding
   Inspired by Radix Select / shadcn
   ============================================
   Usage:
     Select.init('[data-select]', {
       placeholder: 'Choose…',
       searchable: true,
       onChange: function (value, label) { … }
     });

     // Or with data:
     Select.init('[data-select]', {
       options: [
         { value: 'react', label: 'React' },
         { value: 'vue',   label: 'Vue', group: 'Frameworks' },
         { value: 'pasta', label: 'Pasta', disabled: true }
       ]
     });

   API on returned instance: .open(), .close(), .setValue(v), .getValue()
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    placeholder: 'Choose…',
    searchable: true,
    options: null,           // optional array; otherwise reads from DOM
    onChange: null,
    closeOnSelect: true,
    emptyText: 'No matches'
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

    var menu = el.querySelector('.sel-menu');
    var trigger = el.querySelector('.sel-trigger');
    var valueEl = el.querySelector('.sel-value');
    var searchInput;
    var value = null;
    var label = null;

    if (!menu) {
      // Build markup if missing
      el.innerHTML =
        '<button class="sel-trigger" type="button"><span class="sel-value"></span><span class="sel-caret">▾</span></button>' +
        '<div class="sel-menu" role="listbox">' +
          (o.searchable ? '<div class="sel-search"><input placeholder="Search…"></div>' : '') +
          '<div class="sel-options"></div>' +
        '</div>';
      trigger = el.querySelector('.sel-trigger');
      menu = el.querySelector('.sel-menu');
      valueEl = el.querySelector('.sel-value');
    }
    if (o.searchable && !el.querySelector('.sel-search')) {
      menu.insertAdjacentHTML('afterbegin', '<div class="sel-search"><input placeholder="Search…"></div>');
    }
    if (!o.searchable) el.classList.add('sel-no-search');
    searchInput = el.querySelector('.sel-search input');

    if (o.options) renderOptions(o.options);
    var options = Array.prototype.slice.call(el.querySelectorAll('.sel-option'));

    function renderOptions(arr) {
      var byGroup = {};
      var order = [];
      arr.forEach(function (it) {
        var g = it.group || '';
        if (!byGroup[g]) { byGroup[g] = []; order.push(g); }
        byGroup[g].push(it);
      });
      var html = '';
      order.forEach(function (g) {
        html += '<div class="sel-group"' + (g ? ' data-label="' + escape(g) + '"' : '') + '>';
        byGroup[g].forEach(function (it) {
          html += '<div class="sel-option" data-value="' + escape(it.value) + '"' +
                  (it.disabled ? ' data-disabled' : '') + '>' + escape(it.label) + '</div>';
        });
        html += '</div>';
      });
      var container = menu.querySelector('.sel-options') || menu;
      container.innerHTML = html;
    }

    function escape(s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }

    setValue(null);

    function open() {
      el.classList.add('is-open');
      if (searchInput) { searchInput.value = ''; filter(''); setTimeout(function () { searchInput.focus(); }, 50); }
      focusOption(currentIndex());
    }
    function close() {
      el.classList.remove('is-open');
      clearFocus();
      trigger.focus();
    }
    function toggle() { el.classList.contains('is-open') ? close() : open(); }

    function currentIndex() {
      return Math.max(0, options.findIndex(function (o) { return o.classList.contains('is-selected'); }));
    }

    function clearFocus() {
      options.forEach(function (o) { o.classList.remove('is-focused'); });
    }

    function focusOption(idx) {
      clearFocus();
      var visible = options.filter(function (o) { return o.style.display !== 'none'; });
      if (!visible.length) return;
      var target = visible[Math.max(0, Math.min(visible.length - 1, idx))];
      if (target) {
        target.classList.add('is-focused');
        target.scrollIntoView({ block: 'nearest' });
      }
    }

    function visibleFocused() {
      return options.find(function (o) { return o.classList.contains('is-focused') && o.style.display !== 'none'; });
    }

    function filter(q) {
      q = q.toLowerCase().trim();
      options.forEach(function (op) {
        var text = op.textContent.toLowerCase();
        op.style.display = (!q || text.indexOf(q) !== -1) ? '' : 'none';
      });
      // Empty state
      var anyVisible = options.some(function (op) { return op.style.display !== 'none'; });
      var emptyEl = el.querySelector('.sel-empty');
      if (!anyVisible) {
        if (!emptyEl) {
          emptyEl = document.createElement('div');
          emptyEl.className = 'sel-empty';
          emptyEl.textContent = o.emptyText;
          menu.appendChild(emptyEl);
        }
      } else if (emptyEl) {
        emptyEl.remove();
      }
      focusOption(0);
    }

    function setValue(v) {
      value = v;
      var match = options.find(function (op) { return op.getAttribute('data-value') === v; });
      options.forEach(function (op) { op.classList.toggle('is-selected', op === match); });
      if (match) {
        label = match.textContent.trim();
        valueEl.textContent = label;
        el.classList.remove('is-empty');
      } else {
        valueEl.textContent = o.placeholder;
        el.classList.add('is-empty');
      }
    }

    function pick(op) {
      if (op.hasAttribute('data-disabled')) return;
      setValue(op.getAttribute('data-value'));
      if (typeof o.onChange === 'function') o.onChange(value, label);
      if (o.closeOnSelect) close();
    }

    function onTriggerClick(e) { e.stopPropagation(); toggle(); }
    function onOptionClick(e) {
      var op = e.target.closest('.sel-option');
      if (op) pick(op);
    }
    function onSearch() { filter(searchInput.value); }
    function onKey(e) {
      if (!el.classList.contains('is-open')) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault(); open();
        }
        return;
      }
      var visible = options.filter(function (op) { return op.style.display !== 'none'; });
      var current = visibleFocused();
      var idx = current ? visible.indexOf(current) : -1;
      if (e.key === 'ArrowDown') { e.preventDefault(); focusOption(Math.min(visible.length - 1, idx + 1) === idx ? idx + 1 : idx + 1); var n = visible[Math.min(visible.length - 1, idx + 1)]; if (n) { clearFocus(); n.classList.add('is-focused'); n.scrollIntoView({block:'nearest'}); } }
      else if (e.key === 'ArrowUp')   { e.preventDefault(); var p = visible[Math.max(0, idx - 1)]; if (p) { clearFocus(); p.classList.add('is-focused'); p.scrollIntoView({block:'nearest'}); } }
      else if (e.key === 'Enter')     { e.preventDefault(); if (current) pick(current); }
      else if (e.key === 'Escape')    { e.preventDefault(); close(); }
    }
    function onOutside(e) {
      if (!el.contains(e.target)) close();
    }

    trigger.addEventListener('click', onTriggerClick);
    menu.addEventListener('click', onOptionClick);
    el.addEventListener('keydown', onKey);
    if (searchInput) searchInput.addEventListener('input', onSearch);
    document.addEventListener('click', onOutside);

    function destroy() {
      trigger.removeEventListener('click', onTriggerClick);
      menu.removeEventListener('click', onOptionClick);
      el.removeEventListener('keydown', onKey);
      if (searchInput) searchInput.removeEventListener('input', onSearch);
      document.removeEventListener('click', onOutside);
    }

    return { el: el, open: open, close: close, toggle: toggle, setValue: setValue, getValue: function () { return value; }, destroy: destroy };
  }

  var Select = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = Select;
  else root.Select = Select;
})(typeof window !== 'undefined' ? window : this);
