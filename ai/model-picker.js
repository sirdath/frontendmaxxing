/* ============================================
   MODEL PICKER — Dropdown controller for selecting AI models
   Inspired by Vercel AI Elements, OpenRouter, ChatGPT model picker
   ============================================
   Usage:
     ModelPicker.init('[data-mpk]', {
       models: [
         { id: 'claude-opus-4-7', name: 'Claude Opus 4.7', provider: 'anthropic',
           context: '1M', tags: ['vision', 'tools', 'reasoning'],
           description: 'Top reasoning model, 1M context',
           shortcut: 'O', group: 'Anthropic' },
         { id: 'gpt-5o', name: 'GPT-5o', provider: 'openai',
           context: '200k', tags: ['vision', 'tools', 'fast'], group: 'OpenAI' },
         // ...
       ],
       selectedId: 'claude-opus-4-7',
       onChange: function (model) { … }
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    models: [],
    selectedId: null,
    onChange: null,
    placeholder: 'Search models…',
    emptyText: 'No models match',
    enableSearch: true
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) {
      instances.push(create(el, opts));
    });
    return instances.length === 1 ? instances[0] : instances;
  }

  function create(trigger, opts) {
    var o = mergeOpts(opts);
    var state = { open: false, query: '', focused: 0, models: o.models, selected: findById(o.models, o.selectedId) };

    var panel = null;

    function renderTrigger() {
      var m = state.selected;
      if (!m) {
        trigger.innerHTML = '<span class="mpk-name">Select model</span><span class="mpk-chevron">▾</span>';
        return;
      }
      trigger.dataset.mpkProvider = m.provider || '';
      trigger.innerHTML =
        '<span class="mpk-logo"' + (m.logo ? ' style="background-image:url(' + m.logo + ')"' : '') + '></span>' +
        '<span class="mpk-name">' + escape(m.name) + '</span>' +
        (m.context ? '<span class="mpk-context">' + escape(m.context) + '</span>' : '') +
        '<span class="mpk-chevron">▾</span>';
    }

    function openPanel() {
      if (state.open) return;
      state.open = true;
      trigger.setAttribute('aria-expanded', 'true');
      panel = buildPanel();
      document.body.appendChild(panel);
      positionPanel();
      requestAnimationFrame(function () { panel.classList.add('is-open'); });
      var input = panel.querySelector('input');
      if (input) setTimeout(function () { input.focus(); }, 30);
      document.addEventListener('click', onOutside);
      document.addEventListener('keydown', onKey);
      window.addEventListener('resize', positionPanel);
      window.addEventListener('scroll', positionPanel, { passive: true });
    }

    function closePanel() {
      if (!state.open) return;
      state.open = false;
      trigger.setAttribute('aria-expanded', 'false');
      if (panel) {
        panel.classList.remove('is-open');
        var p = panel;
        setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, 200);
        panel = null;
      }
      document.removeEventListener('click', onOutside);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', positionPanel);
      window.removeEventListener('scroll', positionPanel);
    }

    function buildPanel() {
      var p = document.createElement('div');
      p.className = 'mpk-panel';
      p.setAttribute('role', 'listbox');
      p.innerHTML =
        (o.enableSearch ?
          '<div class="mpk-search">' +
            '<span class="mpk-search-icon">⌕</span>' +
            '<input type="text" placeholder="' + escape(o.placeholder) + '" autocomplete="off">' +
          '</div>' : '') +
        '<div class="mpk-list"></div>' +
        '<div class="mpk-foot">' +
          '<span><span class="mpk-kbd">↑↓</span> navigate</span>' +
          '<span><span class="mpk-kbd">⏎</span> select</span>' +
        '</div>';
      renderList(p);
      var input = p.querySelector('input');
      if (input) {
        input.addEventListener('input', function () {
          state.query = input.value.trim().toLowerCase();
          state.focused = 0;
          renderList(p);
        });
      }
      p.querySelector('.mpk-list').addEventListener('click', function (e) {
        var item = e.target.closest('.mpk-item');
        if (!item) return;
        select(item.dataset.mpkId);
        closePanel();
      });
      return p;
    }

    function renderList(p) {
      var list = p.querySelector('.mpk-list');
      var filtered = filterModels(state.models, state.query);
      if (!filtered.length) {
        list.innerHTML = '<div class="mpk-empty">' + escape(o.emptyText) + '</div>';
        return;
      }
      var grouped = groupBy(filtered, 'group');
      var html = '';
      Object.keys(grouped).forEach(function (g) {
        if (g && g !== 'undefined') html += '<div class="mpk-group">' + escape(g) + '</div>';
        grouped[g].forEach(function (m, idx) {
          var active = state.selected && state.selected.id === m.id;
          html +=
            '<div class="mpk-item' + (active ? ' is-active' : '') + '" ' +
                  'role="option" ' +
                  'data-mpk-id="' + escape(m.id) + '" ' +
                  'data-mpk-provider="' + escape(m.provider || '') + '">' +
              '<span class="mpk-item-logo"' + (m.logo ? ' style="background-image:url(' + m.logo + ')"' : '') + '></span>' +
              '<div class="mpk-item-body">' +
                '<div class="mpk-item-name">' + escape(m.name) +
                  (m.tags || []).map(function (t) {
                    return '<span class="mpk-tag mpk-tag-' + escape(t) + '">' + escape(t) + '</span>';
                  }).join('') +
                '</div>' +
                '<div class="mpk-item-meta">' +
                  (m.context ? '<span class="mpk-item-context">' + escape(m.context) + '</span>' : '') +
                  (m.price ? '<span class="mpk-item-price">' + escape(m.price) + '</span>' : '') +
                '</div>' +
                (m.description ? '<div class="mpk-item-desc">' + escape(m.description) + '</div>' : '') +
              '</div>' +
              (m.shortcut ? '<span class="mpk-item-shortcut">' + escape(m.shortcut) + '</span>' : '') +
              (active ? '<svg class="mpk-item-check" viewBox="0 0 16 16" fill="currentColor"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 1.06-1.06l2.47 2.47 6.97-6.97a.75.75 0 0 1 1.06 0Z"/></svg>' : '') +
            '</div>';
        });
      });
      list.innerHTML = html;
    }

    function filterModels(models, q) {
      if (!q) return models;
      return models.filter(function (m) {
        var hay = (m.name + ' ' + (m.provider || '') + ' ' + (m.description || '') + ' ' + (m.tags || []).join(' ')).toLowerCase();
        return hay.indexOf(q) !== -1;
      });
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

    function positionPanel() {
      if (!panel) return;
      var rect = trigger.getBoundingClientRect();
      panel.style.left = (rect.left + window.scrollX) + 'px';
      panel.style.top = (rect.bottom + window.scrollY + 4) + 'px';
      panel.style.minWidth = Math.max(rect.width, 360) + 'px';
    }

    function onOutside(e) {
      if (!panel) return;
      if (panel.contains(e.target) || trigger.contains(e.target)) return;
      closePanel();
    }

    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); closePanel(); return; }
      if (!panel) return;
      var items = panel.querySelectorAll('.mpk-item');
      if (!items.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        state.focused = (state.focused + 1) % items.length;
        updateFocus(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        state.focused = (state.focused - 1 + items.length) % items.length;
        updateFocus(items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        select(items[state.focused].dataset.mpkId);
        closePanel();
      }
    }
    function updateFocus(items) {
      items.forEach(function (it, i) { it.classList.toggle('is-focused', i === state.focused); });
      items[state.focused].scrollIntoView({ block: 'nearest' });
    }

    function select(id) {
      var m = findById(state.models, id);
      if (!m) return;
      state.selected = m;
      renderTrigger();
      if (typeof o.onChange === 'function') o.onChange(m);
    }

    function setModels(models) {
      state.models = models;
      if (state.selected && !findById(models, state.selected.id)) state.selected = null;
      renderTrigger();
      if (panel) renderList(panel);
    }
    function setSelected(id) { select(id); }
    function get() { return state.selected; }
    function destroy() { closePanel(); trigger.removeEventListener('click', toggle); }

    function toggle() { state.open ? closePanel() : openPanel(); }
    trigger.addEventListener('click', toggle);
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');

    renderTrigger();

    return { trigger: trigger, setModels: setModels, setSelected: setSelected, get: get, open: openPanel, close: closePanel, destroy: destroy };
  }

  function findById(models, id) {
    if (!id) return null;
    for (var i = 0; i < models.length; i++) if (models[i].id === id) return models[i];
    return null;
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

  var ModelPicker = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = ModelPicker;
  else root.ModelPicker = ModelPicker;
})(typeof window !== 'undefined' ? window : this);
