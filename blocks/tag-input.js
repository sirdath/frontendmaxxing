/* ============================================
   TAG INPUT — Chip tokens + autocomplete + keyboard
   Inspired by Linear / Notion / GitHub label pickers
   ============================================
   Usage:
     TagInput.init('[data-tag-input]', {
       value: ['react'],
       suggestions: ['react','vue','svelte','solid','astro'],
       placeholder: 'Add tag…',
       allowFree: true,                 // accept any tag, not just suggestions
       max: null,
       onChange: function (tags) { … }
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    value: [],
    suggestions: [],
    placeholder: 'Add tag…',
    allowFree: true,
    max: null,
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

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    el.classList.add('tin');
    el.innerHTML =
      '<input class="tin-input" placeholder="' + escapeHTML(o.placeholder) + '">' +
      '<div class="tin-suggestions"></div>';

    var input = el.querySelector('.tin-input');
    var sug = el.querySelector('.tin-suggestions');
    var tags = o.value.slice();

    function paint() {
      // Remove existing chips
      el.querySelectorAll('.tin-chip').forEach(function (c) { c.remove(); });
      tags.slice().reverse().forEach(function (t) {
        var c = document.createElement('span');
        c.className = 'tin-chip';
        c.innerHTML = escapeHTML(t) + ' <button data-remove="' + escapeHTML(t) + '">×</button>';
        el.insertBefore(c, el.firstChild);
      });
    }

    function emit() {
      if (typeof o.onChange === 'function') o.onChange(tags.slice());
    }

    function add(tag) {
      tag = tag.trim();
      if (!tag) return;
      if (tags.indexOf(tag) !== -1) return;
      if (o.max && tags.length >= o.max) return;
      tags.push(tag);
      paint();
      emit();
    }

    function remove(tag) {
      tags = tags.filter(function (t) { return t !== tag; });
      paint();
      emit();
    }

    function renderSuggestions() {
      var q = input.value.trim().toLowerCase();
      var matches = o.suggestions.filter(function (s) {
        return s.toLowerCase().indexOf(q) !== -1 && tags.indexOf(s) === -1;
      });
      if (!q && !matches.length) { el.classList.remove('is-suggesting'); return; }
      if (!matches.length) {
        sug.innerHTML = o.allowFree
          ? '<div class="tin-suggestion">Add "' + escapeHTML(input.value) + '"</div>'
          : '<div class="tin-suggestion-empty">No matches</div>';
      } else {
        sug.innerHTML = matches.map(function (s, i) {
          return '<div class="tin-suggestion' + (i === 0 ? ' is-focused' : '') + '" data-tag="' + escapeHTML(s) + '">' + escapeHTML(s) + '</div>';
        }).join('');
      }
      el.classList.add('is-suggesting');
    }

    function pickFocused() {
      var f = sug.querySelector('.tin-suggestion.is-focused');
      if (f) {
        var tag = f.getAttribute('data-tag') || input.value;
        add(tag);
      } else if (o.allowFree && input.value.trim()) {
        add(input.value);
      }
      input.value = '';
      el.classList.remove('is-suggesting');
    }

    function moveFocus(dir) {
      var list = Array.prototype.slice.call(sug.querySelectorAll('.tin-suggestion'));
      if (!list.length) return;
      var cur = sug.querySelector('.tin-suggestion.is-focused');
      var idx = cur ? list.indexOf(cur) : -1;
      idx = (idx + dir + list.length) % list.length;
      list.forEach(function (s) { s.classList.remove('is-focused'); });
      list[idx].classList.add('is-focused');
      list[idx].scrollIntoView({ block: 'nearest' });
    }

    function onInput() { renderSuggestions(); }
    function onKey(e) {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        pickFocused();
      } else if (e.key === 'Backspace' && !input.value && tags.length) {
        remove(tags[tags.length - 1]);
      } else if (e.key === 'ArrowDown') { e.preventDefault(); moveFocus(1); }
      else if (e.key === 'ArrowUp')   { e.preventDefault(); moveFocus(-1); }
      else if (e.key === 'Escape')    { el.classList.remove('is-suggesting'); }
    }
    function onSugClick(e) {
      var s = e.target.closest('.tin-suggestion');
      if (!s) return;
      var tag = s.getAttribute('data-tag') || input.value;
      add(tag);
      input.value = '';
      el.classList.remove('is-suggesting');
      input.focus();
    }
    function onChipClick(e) {
      var b = e.target.closest('[data-remove]');
      if (b) { remove(b.getAttribute('data-remove')); input.focus(); }
    }
    function onElClick(e) {
      if (e.target === el) input.focus();
    }
    function onOutside(e) { if (!el.contains(e.target)) el.classList.remove('is-suggesting'); }

    input.addEventListener('input', onInput);
    input.addEventListener('keydown', onKey);
    input.addEventListener('focus', renderSuggestions);
    sug.addEventListener('click', onSugClick);
    el.addEventListener('click', onChipClick);
    el.addEventListener('click', onElClick);
    document.addEventListener('click', onOutside);

    paint();

    function destroy() {
      input.removeEventListener('input', onInput);
      input.removeEventListener('keydown', onKey);
      input.removeEventListener('focus', renderSuggestions);
      sug.removeEventListener('click', onSugClick);
      el.removeEventListener('click', onChipClick);
      el.removeEventListener('click', onElClick);
      document.removeEventListener('click', onOutside);
    }

    return {
      el: el,
      getValue: function () { return tags.slice(); },
      setValue: function (v) { tags = v.slice(); paint(); emit(); },
      destroy: destroy
    };
  }

  var TagInput = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = TagInput;
  else root.TagInput = TagInput;
})(typeof window !== 'undefined' ? window : this);
