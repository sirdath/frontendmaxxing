/* ============================================
   MULTI-SELECT — Chip-based multi-pick with search
   Inspired by Linear filter pickers / Notion property selectors
   ============================================
   Usage:
     MultiSelect.init('[data-multi-select]', {
       options: [
         { value: 'tag1', label: 'Tag 1' },
         { value: 'tag2', label: 'Tag 2', group: 'Priority' }
       ],
       placeholder: 'Add tags…',
       showCount: false,   // true = "3 selected" instead of chips
       onChange: function (values) { … }
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    options: [],
    placeholder: 'Select…',
    showCount: false,
    onChange: null
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function escape(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    // Build markup if not present
    if (!el.querySelector('.mse-trigger')) {
      el.innerHTML =
        '<button type="button" class="mse-trigger">' +
          '<div class="mse-chips"></div>' +
          '<span class="mse-placeholder"></span>' +
          '<span class="mse-caret">▾</span>' +
        '</button>' +
        '<div class="mse-menu" role="listbox">' +
          '<div class="mse-search"><input placeholder="Search…"></div>' +
          '<div class="mse-options"></div>' +
        '</div>';
    }
    if (o.showCount) el.classList.add('mse-no-chips');

    var trigger = el.querySelector('.mse-trigger');
    var chips   = el.querySelector('.mse-chips');
    var placeholder = el.querySelector('.mse-placeholder');
    var menu    = el.querySelector('.mse-menu');
    var search  = el.querySelector('.mse-search input');
    var optionsRoot = el.querySelector('.mse-options');

    placeholder.textContent = o.placeholder;
    var selected = new Set();

    function renderOptions() {
      var byGroup = {};
      var order = [];
      o.options.forEach(function (it) {
        var g = it.group || '';
        if (!byGroup[g]) { byGroup[g] = []; order.push(g); }
        byGroup[g].push(it);
      });
      var html = '';
      order.forEach(function (g) {
        if (g) html += '<div class="mse-group" style="padding:0.35rem 0.6rem 0.15rem; font-size:0.7rem; font-weight:600; text-transform:uppercase; letter-spacing:0.04em; color:var(--mse-muted)">' + escape(g) + '</div>';
        byGroup[g].forEach(function (it) {
          html +=
            '<div class="mse-option" data-value="' + escape(it.value) + '">' +
              '<span class="mse-option-box"></span>' +
              escape(it.label) +
            '</div>';
        });
      });
      optionsRoot.innerHTML = html;
    }

    function renderChips() {
      if (o.showCount) {
        var n = selected.size;
        if (n === 0) {
          placeholder.style.display = '';
          placeholder.textContent = o.placeholder;
          chips.innerHTML = '';
        } else {
          placeholder.style.display = '';
          placeholder.classList.add('mse-count');
          placeholder.textContent = n + ' selected';
        }
        return;
      }
      chips.innerHTML = '';
      var any = false;
      selected.forEach(function (v) {
        var item = o.options.find(function (it) { return it.value === v; });
        if (!item) return;
        any = true;
        var c = document.createElement('span');
        c.className = 'mse-chip';
        c.innerHTML = escape(item.label) + ' <button data-remove="' + escape(v) + '">×</button>';
        chips.appendChild(c);
      });
      placeholder.style.display = any ? 'none' : '';
    }

    function refreshOptions() {
      Array.prototype.forEach.call(optionsRoot.querySelectorAll('.mse-option'), function (op) {
        op.classList.toggle('is-selected', selected.has(op.getAttribute('data-value')));
      });
    }

    function emit() {
      if (typeof o.onChange === 'function') o.onChange(Array.from(selected));
    }

    function toggleValue(v) {
      if (selected.has(v)) selected.delete(v); else selected.add(v);
      renderChips();
      refreshOptions();
      emit();
    }

    function setValue(values) {
      selected = new Set(values || []);
      renderChips();
      refreshOptions();
    }

    function open()  { el.classList.add('is-open'); if (search) setTimeout(function () { search.focus(); }, 50); }
    function close() { el.classList.remove('is-open'); }
    function toggle(){ el.classList.contains('is-open') ? close() : open(); }

    function onTriggerClick(e) { e.stopPropagation(); toggle(); }
    function onOptionClick(e) {
      // Don't close on chip remove inside trigger
      if (e.target.matches('[data-remove]')) {
        e.stopPropagation();
        toggleValue(e.target.getAttribute('data-remove'));
        return;
      }
      var op = e.target.closest('.mse-option');
      if (op) toggleValue(op.getAttribute('data-value'));
    }
    function onSearchInput() {
      var q = search.value.toLowerCase().trim();
      Array.prototype.forEach.call(optionsRoot.querySelectorAll('.mse-option'), function (op) {
        op.style.display = (!q || op.textContent.toLowerCase().indexOf(q) !== -1) ? '' : 'none';
      });
    }
    function onOutside(e) {
      if (!el.contains(e.target)) close();
    }
    function onKey(e) {
      if (e.key === 'Escape' && el.classList.contains('is-open')) close();
    }

    renderOptions();
    renderChips();
    trigger.addEventListener('click', onTriggerClick);
    el.addEventListener('click', onOptionClick);
    if (search) search.addEventListener('input', onSearchInput);
    document.addEventListener('click', onOutside);
    el.addEventListener('keydown', onKey);

    function destroy() {
      trigger.removeEventListener('click', onTriggerClick);
      el.removeEventListener('click', onOptionClick);
      if (search) search.removeEventListener('input', onSearchInput);
      document.removeEventListener('click', onOutside);
      el.removeEventListener('keydown', onKey);
    }

    return { el: el, open: open, close: close, setValue: setValue, getValue: function () { return Array.from(selected); }, destroy: destroy };
  }

  var MultiSelect = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = MultiSelect;
  else root.MultiSelect = MultiSelect;
})(typeof window !== 'undefined' ? window : this);
