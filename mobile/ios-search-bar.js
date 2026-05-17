/* ============================================
   IOS SEARCH — Cancel button reveal on focus + clear-X
   ============================================
   Usage:
     IosSearch.init('.ios-search');
   ============================================ */
(function (root) {
  'use strict';

  function init(target) {
    var nodes = typeof target === 'string' ? document.querySelectorAll(target) : [target];
    Array.prototype.forEach.call(nodes, bind);
  }

  function bind(el) {
    if (el.dataset.iosSearchBound) return;
    el.dataset.iosSearchBound = '1';
    var input = el.querySelector('input');
    var field = el.querySelector('.ios-search-field');
    var clear = el.querySelector('.ios-search-clear');
    var cancel = el.querySelector('.ios-search-cancel');
    if (!input || !field) return;

    input.addEventListener('focus', function () { el.classList.add('is-active'); });
    input.addEventListener('input', function () {
      field.classList.toggle('has-text', input.value.length > 0);
    });
    if (clear) clear.addEventListener('click', function () {
      input.value = '';
      field.classList.remove('has-text');
      input.focus();
    });
    if (cancel) cancel.addEventListener('click', function () {
      input.value = '';
      input.blur();
      field.classList.remove('has-text');
      el.classList.remove('is-active');
    });
  }

  var IosSearch = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = IosSearch;
  else root.IosSearch = IosSearch;
})(typeof window !== 'undefined' ? window : this);
