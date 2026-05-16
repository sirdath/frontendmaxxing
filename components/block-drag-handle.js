/* ============================================
   BLOCK DRAG HANDLE — Reorder + actions + add controllers
   Inspired by Notion, BlockNote
   ============================================
   Usage:
     BlockDragHandle.init('[data-bdh]', {
       blockSelector: '.bdh-block',
       handleSelector: '.bdh-handle',
       addSelector: '.bdh-add',
       onReorder: function (oldIdx, newIdx, el) { ... },
       onAdd: function (afterEl, idx) { ... },
       actions: [
         { id: 'duplicate', label: 'Duplicate', icon: '⧉', shortcut: '⌘D',
           run: function (block) { ... } },
         { id: 'delete', label: 'Delete', icon: '⨯', shortcut: '⌫',
           run: function (block) { block.remove(); } },
         '---',
         { id: 'turnInto', label: 'Turn into…', icon: '🔄' }
       ]
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    blockSelector: '.bdh-block',
    handleSelector: '.bdh-handle',
    addSelector: '.bdh-add',
    onReorder: null,
    onAdd: null,
    actions: null
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var insts = [];
    Array.prototype.forEach.call(els, function (el) { insts.push(create(el, opts)); });
    return insts.length === 1 ? insts[0] : insts;
  }

  function create(container, opts) {
    var o = mergeOpts(opts);
    var dragging = null;
    var ghost = null;
    var openMenu = null;

    // Wire handles & add buttons (live for dynamic blocks)
    container.addEventListener('pointerdown', function (e) {
      var handle = e.target.closest(o.handleSelector);
      if (handle && container.contains(handle)) {
        var block = handle.closest(o.blockSelector);
        if (block) startDrag(e, block);
      }
    });

    container.addEventListener('click', function (e) {
      var add = e.target.closest(o.addSelector);
      if (add && container.contains(add)) {
        var block = add.closest(o.blockSelector);
        if (typeof o.onAdd === 'function') {
          var blocks = Array.prototype.slice.call(container.querySelectorAll(o.blockSelector));
          o.onAdd(block, blocks.indexOf(block));
        }
      }
    });

    // Right-click on handle = actions menu
    container.addEventListener('contextmenu', function (e) {
      var handle = e.target.closest(o.handleSelector);
      if (!handle) return;
      if (!o.actions) return;
      e.preventDefault();
      var block = handle.closest(o.blockSelector);
      openActions(handle, block);
    });

    function startDrag(e, block) {
      e.preventDefault();
      dragging = { block: block, startX: e.clientX, startY: e.clientY };
      block.classList.add('is-dragging');

      ghost = document.createElement('div');
      ghost.className = 'bdh-ghost';
      ghost.textContent = block.querySelector('.bdh-content')?.textContent?.trim().slice(0, 80) || 'Block';
      document.body.appendChild(ghost);
      moveGhost(e.clientX, e.clientY);

      window.addEventListener('pointermove', onDragMove);
      window.addEventListener('pointerup', onDragEnd);
    }

    function moveGhost(x, y) {
      if (!ghost) return;
      ghost.style.left = (x + 8) + 'px';
      ghost.style.top = (y - 12) + 'px';
    }

    function onDragMove(e) {
      if (!dragging) return;
      moveGhost(e.clientX, e.clientY);

      // Find drop target — block under cursor
      var blocks = Array.prototype.slice.call(container.querySelectorAll(o.blockSelector));
      var target = null, before = false;
      for (var i = 0; i < blocks.length; i++) {
        var b = blocks[i];
        if (b === dragging.block) continue;
        var r = b.getBoundingClientRect();
        if (e.clientY >= r.top && e.clientY <= r.bottom) {
          target = b;
          before = e.clientY < r.top + r.height / 2;
          break;
        }
      }
      blocks.forEach(function (b) { b.classList.remove('is-drop-before', 'is-drop-after'); });
      if (target) {
        target.classList.add(before ? 'is-drop-before' : 'is-drop-after');
        dragging.dropTarget = target;
        dragging.dropBefore = before;
      } else {
        dragging.dropTarget = null;
      }
    }

    function onDragEnd() {
      if (!dragging) return;
      var d = dragging;
      d.block.classList.remove('is-dragging');
      Array.prototype.forEach.call(container.querySelectorAll('.is-drop-before, .is-drop-after'), function (b) {
        b.classList.remove('is-drop-before', 'is-drop-after');
      });
      if (ghost && ghost.parentNode) ghost.parentNode.removeChild(ghost);
      ghost = null;
      window.removeEventListener('pointermove', onDragMove);
      window.removeEventListener('pointerup', onDragEnd);

      if (d.dropTarget && d.dropTarget !== d.block) {
        var blocks = Array.prototype.slice.call(container.querySelectorAll(o.blockSelector));
        var oldIdx = blocks.indexOf(d.block);
        if (d.dropBefore) container.insertBefore(d.block, d.dropTarget);
        else container.insertBefore(d.block, d.dropTarget.nextSibling);
        var newBlocks = Array.prototype.slice.call(container.querySelectorAll(o.blockSelector));
        var newIdx = newBlocks.indexOf(d.block);
        if (typeof o.onReorder === 'function') o.onReorder(oldIdx, newIdx, d.block);
      }

      dragging = null;
    }

    function openActions(handle, block) {
      closeActions();
      if (!o.actions) return;
      openMenu = document.createElement('div');
      openMenu.className = 'bdh-menu';
      var html = '';
      o.actions.forEach(function (a) {
        if (a === '---') {
          html += '<div class="bdh-menu-sep"></div>';
          return;
        }
        html += '<div class="bdh-menu-item" data-bdh-action="' + escape(a.id) + '">' +
          '<span class="bdh-menu-icon">' + escape(a.icon || '') + '</span>' +
          '<span>' + escape(a.label) + '</span>' +
          (a.shortcut ? '<span class="bdh-menu-shortcut">' + escape(a.shortcut) + '</span>' : '') +
        '</div>';
      });
      openMenu.innerHTML = html;
      document.body.appendChild(openMenu);
      var rect = handle.getBoundingClientRect();
      openMenu.style.left = (rect.right + 4 + window.scrollX) + 'px';
      openMenu.style.top = (rect.top + window.scrollY) + 'px';
      requestAnimationFrame(function () { openMenu && openMenu.classList.add('is-open'); });

      openMenu.addEventListener('click', function (e) {
        var item = e.target.closest('[data-bdh-action]');
        if (!item) return;
        var id = item.dataset.bdhAction;
        var action = o.actions.find(function (a) { return a && a.id === id; });
        if (action && typeof action.run === 'function') action.run(block);
        closeActions();
      });
      setTimeout(function () {
        document.addEventListener('click', onOutsideClick);
      }, 0);
    }

    function closeActions() {
      if (openMenu) {
        var m = openMenu;
        m.classList.remove('is-open');
        setTimeout(function () { if (m.parentNode) m.parentNode.removeChild(m); }, 150);
        openMenu = null;
      }
      document.removeEventListener('click', onOutsideClick);
    }
    function onOutsideClick(e) {
      if (openMenu && !openMenu.contains(e.target)) closeActions();
    }

    function destroy() {
      closeActions();
    }

    return { container: container, destroy: destroy };
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

  var BlockDragHandle = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = BlockDragHandle;
  else root.BlockDragHandle = BlockDragHandle;
})(typeof window !== 'undefined' ? window : this);
