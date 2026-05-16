/* ============================================
   SORTABLE — Minimal drag-to-sort list (HTML5 DnD)
   Inspired by Sortable.js (Sortable/Sortable) — much smaller surface
   ============================================
   Usage:
     <ul id="list">
       <li class="sortable-item">A</li>
       <li class="sortable-item">B</li>
       <li class="sortable-item">C</li>
     </ul>
     Sortable.init('#list', {
       itemSelector: '.sortable-item',
       handle: null,            // CSS selector inside item, or null for whole item
       onSort: function (newOrder, el) { … }
     });

   CSS hooks (apply your own styles):
     .sortable-dragging — class set on the item being dragged
     .sortable-over     — class set on the hover target during drag
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    itemSelector: 'li',
    handle: null,
    onSort: null,
    onStart: null,
    onEnd: null
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function createInstance(list, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var dragged = null;
    var startY = 0;

    function setup(item) {
      var dragSource = o.handle ? item.querySelector(o.handle) : item;
      if (!dragSource) return;
      item.setAttribute('draggable', 'true');
      // The drag handle on the source enables drag on the parent item
      if (dragSource !== item) {
        dragSource.setAttribute('draggable', 'true');
        // Prevent body from being draggable when handle is used
        item.addEventListener('mousedown', function (e) {
          if (!e.target.closest(o.handle)) item.setAttribute('draggable', 'false');
          else item.setAttribute('draggable', 'true');
        });
      }
    }

    function rebuild() {
      var items = Array.prototype.slice.call(list.querySelectorAll(':scope > ' + o.itemSelector));
      items.forEach(setup);
      return items;
    }

    rebuild();

    function onDragStart(e) {
      var item = e.target.closest(o.itemSelector);
      if (!item || item.parentElement !== list) return;
      dragged = item;
      dragged.classList.add('sortable-dragging');
      try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', ''); } catch (err) {}
      if (typeof o.onStart === 'function') o.onStart(item);
    }

    function onDragOver(e) {
      if (!dragged) return;
      e.preventDefault();
      var over = e.target.closest(o.itemSelector);
      if (!over || over.parentElement !== list || over === dragged) return;
      Array.prototype.forEach.call(list.children, function (c) { c.classList.remove('sortable-over'); });
      over.classList.add('sortable-over');
      var rect = over.getBoundingClientRect();
      var before = (e.clientY - rect.top) < rect.height / 2;
      list.insertBefore(dragged, before ? over : over.nextSibling);
    }

    function onDragEnd() {
      if (!dragged) return;
      dragged.classList.remove('sortable-dragging');
      Array.prototype.forEach.call(list.children, function (c) { c.classList.remove('sortable-over'); });
      var order = Array.prototype.map.call(list.children, function (c) { return c; });
      if (typeof o.onSort === 'function') o.onSort(order, dragged);
      if (typeof o.onEnd === 'function')  o.onEnd(dragged);
      dragged = null;
    }

    list.addEventListener('dragstart', onDragStart);
    list.addEventListener('dragover',  onDragOver);
    list.addEventListener('dragend',   onDragEnd);
    list.addEventListener('drop',      onDragEnd);

    function destroy() {
      list.removeEventListener('dragstart', onDragStart);
      list.removeEventListener('dragover',  onDragOver);
      list.removeEventListener('dragend',   onDragEnd);
      list.removeEventListener('drop',      onDragEnd);
      Array.prototype.forEach.call(list.querySelectorAll(o.itemSelector), function (it) {
        it.removeAttribute('draggable');
      });
    }

    return { el: list, refresh: rebuild, destroy: destroy };
  }

  var Sortable = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = Sortable;
  else root.Sortable = Sortable;
})(typeof window !== 'undefined' ? window : this);
