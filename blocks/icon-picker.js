/* ============================================
   ICON PICKER — Grid of icons with search + random + active highlight
   Inspired by Notion icon picker
   ============================================
   Usage:
     IconPicker.init('[data-icon-picker]', {
       onPick: function (icon) { … },
       value: '⚡',
       icons: null   // optional: [{ name: 'react', char: '⚛' }, …]
     });

   Default icon set: a curated emoji collection useful as page/object icons.
   ============================================ */
(function (root) {
  'use strict';

  var DEFAULT_ICONS = [
    ['⚡','lightning fast'],['🚀','rocket launch'],['🎯','target goal'],['💡','idea light'],
    ['🔥','fire hot'],['🌱','seedling start'],['🌳','tree grow'],['🌊','wave water'],
    ['☀️','sun day'],['🌙','moon night'],['⭐','star'],['🌟','glow star'],
    ['❤️','heart love'],['💎','gem diamond'],['👑','crown'],['🏆','trophy win'],
    ['🎨','art paint'],['🎭','theater mask'],['🎼','music'],['🎬','movie'],
    ['📚','books'],['📖','book'],['📝','note write'],['📌','pin'],
    ['📎','clip'],['📁','folder'],['📂','folder open'],['🗂️','file'],
    ['💼','briefcase work'],['🏢','building'],['🏠','home house'],['🏗️','construction'],
    ['🔧','wrench fix'],['⚙️','gear settings'],['🔨','hammer'],['🛠️','tools'],
    ['💻','laptop'],['🖥️','desktop'],['📱','phone'],['⌨️','keyboard'],
    ['🔍','search'],['🔒','lock'],['🔑','key'],['🗝️','old key'],
    ['📊','chart'],['📈','growth'],['📉','decline'],['📍','pin location'],
    ['🗺️','map'],['🧭','compass'],['📷','camera'],['🎥','video'],
    ['🎤','mic'],['🎧','headphones'],['🔔','bell'],['🔕','silent'],
    ['💬','speech'],['💭','thought'],['📣','megaphone'],['📨','envelope'],
    ['📦','box'],['🎁','gift'],['💰','money'],['💳','card'],
    ['🪙','coin'],['🏦','bank'],['🧮','abacus'],['📅','calendar'],
    ['⏰','clock alarm'],['⏳','hourglass'],['🌍','earth'],['🌐','globe'],
    ['🛰️','satellite'],['🧬','dna'],['🔬','science'],['🧪','test tube']
  ];

  var defaults = {
    value: null,
    icons: null,
    onPick: null
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

    el.classList.add('ipk');
    el.innerHTML =
      '<div class="ipk-toolbar">' +
        '<input placeholder="Search…">' +
        '<button class="ipk-random" type="button" title="Random">🎲</button>' +
      '</div>' +
      '<div class="ipk-grid"></div>';

    var search = el.querySelector('input');
    var randomBtn = el.querySelector('.ipk-random');
    var grid = el.querySelector('.ipk-grid');

    var items = o.icons
      ? o.icons.map(function (i) { return [i.char || i, i.name || '']; })
      : DEFAULT_ICONS;
    var current = o.value;

    function render(filter) {
      var q = (filter || '').toLowerCase().trim();
      var results = items.filter(function (it) {
        if (!q) return true;
        return it[1].indexOf(q) !== -1 || it[0].indexOf(q) !== -1;
      });
      if (!results.length) {
        grid.innerHTML = '<div class="ipk-empty">No matches</div>';
        return;
      }
      grid.innerHTML = results.map(function (it) {
        return '<button title="' + (it[1] || '') + '"' +
          (it[0] === current ? ' class="is-active"' : '') +
          '>' + it[0] + '</button>';
      }).join('');
    }
    function pick(icon) {
      current = icon;
      render(search.value);
      if (typeof o.onPick === 'function') o.onPick(icon);
    }

    grid.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (b) pick(b.textContent);
    });
    search.addEventListener('input', function () { render(search.value); });
    randomBtn.addEventListener('click', function () {
      var rnd = items[Math.floor(Math.random() * items.length)];
      pick(rnd[0]);
    });

    render('');

    return {
      el: el,
      destroy: function () { el.innerHTML = ''; },
      getValue: function () { return current; },
      setValue: function (v) { pick(v); }
    };
  }

  var IconPicker = { init: init, DEFAULT_ICONS: DEFAULT_ICONS };

  if (typeof module !== 'undefined' && module.exports) module.exports = IconPicker;
  else root.IconPicker = IconPicker;
})(typeof window !== 'undefined' ? window : this);
