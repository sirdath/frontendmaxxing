/* ============================================
   KANBAN BOARD — Drag cards within / between columns (HTML5 DnD)
   Inspired by Trello / Linear
   ============================================
   Usage:
     KanbanBoard.init('[data-kanban]', {
       onMove: function (cardEl, fromColId, toColId, toIndex) { … }
     });

   Each column needs `data-kbn-col="<id>"`. Each card is a draggable `<li>`.
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    onMove: null,
    onAdd:  null
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function createInstance(board, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var dragged = null;
    var fromCol = null;

    function refresh() {
      Array.prototype.forEach.call(board.querySelectorAll('.kbn-col'), updateCount);
    }
    function updateCount(col) {
      var n = col.querySelectorAll('.kbn-card').length;
      var c = col.querySelector('.kbn-col-count');
      if (c) c.textContent = n;
    }

    function onDragStart(e) {
      var card = e.target.closest('.kbn-card');
      if (!card) return;
      dragged = card;
      fromCol = card.closest('.kbn-col');
      card.classList.add('is-dragging');
      try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', ''); } catch (err) {}
    }

    function onDragOver(e) {
      if (!dragged) return;
      e.preventDefault();
      var col = e.target.closest('.kbn-col');
      if (!col) return;
      var list = col.querySelector('.kbn-cards');
      var over = e.target.closest('.kbn-card');
      Array.prototype.forEach.call(board.querySelectorAll('.kbn-col'), function (c) { c.classList.remove('is-drop'); });
      col.classList.add('is-drop');
      if (over && over !== dragged) {
        var rect = over.getBoundingClientRect();
        var before = (e.clientY - rect.top) < rect.height / 2;
        list.insertBefore(dragged, before ? over : over.nextSibling);
      } else if (!over) {
        list.appendChild(dragged);
      }
    }

    function onDragEnd() {
      if (!dragged) return;
      var toCol = dragged.closest('.kbn-col');
      var toIndex = Array.prototype.indexOf.call(toCol.querySelectorAll('.kbn-card'), dragged);
      dragged.classList.remove('is-dragging');
      Array.prototype.forEach.call(board.querySelectorAll('.kbn-col'), function (c) { c.classList.remove('is-drop'); });
      if (typeof o.onMove === 'function') {
        o.onMove(
          dragged,
          fromCol && fromCol.getAttribute('data-kbn-col'),
          toCol && toCol.getAttribute('data-kbn-col'),
          toIndex
        );
      }
      dragged = null; fromCol = null;
      refresh();
    }

    function onAddClick(e) {
      var btn = e.target.closest('.kbn-col-add');
      if (!btn) return;
      var col = btn.closest('.kbn-col');
      if (typeof o.onAdd === 'function') o.onAdd(col.getAttribute('data-kbn-col'), col);
    }

    board.addEventListener('dragstart', onDragStart);
    board.addEventListener('dragover', onDragOver);
    board.addEventListener('dragend', onDragEnd);
    board.addEventListener('drop', onDragEnd);
    board.addEventListener('click', onAddClick);

    refresh();

    function destroy() {
      board.removeEventListener('dragstart', onDragStart);
      board.removeEventListener('dragover', onDragOver);
      board.removeEventListener('dragend', onDragEnd);
      board.removeEventListener('drop', onDragEnd);
      board.removeEventListener('click', onAddClick);
    }

    return { el: board, refresh: refresh, destroy: destroy };
  }

  var KanbanBoard = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = KanbanBoard;
  else root.KanbanBoard = KanbanBoard;
})(typeof window !== 'undefined' ? window : this);
