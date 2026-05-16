/* ============================================
   ACHIEVEMENT — Show a Steam/Xbox-style achievement toast
   ============================================
   Usage:
     Achievement.show({
       title: 'Achievement Unlocked',
       text: 'First commit · +50 XP',
       icon: '🏆',
       rarity: 'rare',      // common | rare | epic | legendary
       position: 'topright', // topright | topcenter | bottomright | bottomleft
       duration: 4000,
       onClick: function () { … }
     });
   ============================================ */
(function (root) {
  'use strict';

  function show(opts) {
    opts = opts || {};
    var pos = opts.position || 'topright';
    var div = document.createElement('div');
    div.className = 'ach ach-' + (opts.rarity || 'common');
    if (pos === 'topcenter') div.classList.add('ach-top');
    if (pos === 'bottomright' || pos === 'bottomleft') div.classList.add('ach-bottom');
    if (pos === 'bottomleft' || pos === 'topleft') { div.style.left = '24px'; div.style.right = 'auto'; }

    div.innerHTML =
      '<div class="ach-icon">' + (opts.icon || '🏆') + '</div>' +
      '<div class="ach-body">' +
        '<div class="ach-title">' + (opts.title || 'Achievement Unlocked') + '</div>' +
        '<div class="ach-text">' + (opts.text || '') + '</div>' +
      '</div>';
    document.body.appendChild(div);

    if (typeof opts.onClick === 'function') {
      div.style.cursor = 'pointer';
      div.addEventListener('click', opts.onClick);
    }

    var dur = opts.duration || 4000;
    setTimeout(function () {
      div.classList.add('is-leaving');
      setTimeout(function () { div.remove(); }, 450);
    }, dur);

    return div;
  }

  var Achievement = { show: show };

  if (typeof module !== 'undefined' && module.exports) module.exports = Achievement;
  else root.Achievement = Achievement;
})(typeof window !== 'undefined' ? window : this);
