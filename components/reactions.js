/* ============================================
   REACTIONS — Toggle reaction state, open picker, increment counts
   Inspired by Slack / GitHub PR reactions
   ============================================
   Usage:
     Reactions.init('.rxn', {
       onReact: function (emoji, isAdding) { … }
     });

   Markup expectations:
     .rxn-chip       — existing reactions, click to toggle "is-mine"
     .rxn-add        — opens .rxn-picker
     .rxn-picker     — buttons inside represent emoji options
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    onReact: null,
    closeOnPick: true
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

    var addBtn = el.querySelector('.rxn-add');
    var picker = el.querySelector('.rxn-picker');

    function openPicker() { el.classList.add('is-picker-open'); }
    function closePicker() { el.classList.remove('is-picker-open'); }

    function adjustChip(emoji, delta, makeMine) {
      var chip = Array.prototype.find.call(el.querySelectorAll('.rxn-chip'), function (c) {
        return c.textContent.trim().indexOf(emoji) === 0;
      });
      if (!chip) {
        chip = document.createElement('button');
        chip.className = 'rxn-chip is-mine';
        chip.innerHTML = emoji + ' <span>1</span>';
        if (addBtn) el.insertBefore(chip, addBtn); else el.appendChild(chip);
        chip.addEventListener('click', onChipClick);
        if (typeof o.onReact === 'function') o.onReact(emoji, true);
        return;
      }
      var countEl = chip.querySelector('span');
      var n = parseInt(countEl ? countEl.textContent : '0', 10) || 0;
      n = Math.max(0, n + delta);
      if (n === 0) { chip.remove(); if (typeof o.onReact === 'function') o.onReact(emoji, false); return; }
      countEl.textContent = n;
      if (makeMine != null) chip.classList.toggle('is-mine', makeMine);
      if (typeof o.onReact === 'function') o.onReact(emoji, !!makeMine);
    }

    function onAddClick(e) { e.stopPropagation(); el.classList.toggle('is-picker-open'); }

    function onPickerClick(e) {
      var b = e.target.closest('button');
      if (!b) return;
      var emoji = b.textContent.trim();
      adjustChip(emoji, +1, true);
      if (o.closeOnPick) closePicker();
    }

    function onChipClick(e) {
      var chip = e.currentTarget;
      var emoji = chip.textContent.trim().split(' ')[0];
      var isMine = chip.classList.contains('is-mine');
      adjustChip(emoji, isMine ? -1 : +1, !isMine);
    }

    function onOutside(e) {
      if (!el.contains(e.target)) closePicker();
    }

    if (addBtn) addBtn.addEventListener('click', onAddClick);
    if (picker) picker.addEventListener('click', onPickerClick);
    el.querySelectorAll('.rxn-chip').forEach(function (c) { c.addEventListener('click', onChipClick); });
    document.addEventListener('click', onOutside);

    function destroy() {
      if (addBtn) addBtn.removeEventListener('click', onAddClick);
      if (picker) picker.removeEventListener('click', onPickerClick);
      document.removeEventListener('click', onOutside);
    }

    return { el: el, addReaction: function (e) { adjustChip(e, 1, true); }, destroy: destroy };
  }

  var Reactions = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = Reactions;
  else root.Reactions = Reactions;
})(typeof window !== 'undefined' ? window : this);
