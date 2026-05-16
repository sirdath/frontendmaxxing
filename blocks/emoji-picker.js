/* ============================================
   EMOJI PICKER — Categorized emoji grid with search
   Inspired by Slack / Discord pickers (small built-in set)
   ============================================
   Usage:
     EmojiPicker.init('[data-emoji-picker]', {
       onPick: function (emoji) { … },
       recent: 16   // number of recents to remember
     });
   ============================================ */
(function (root) {
  'use strict';

  // Compact starter set — keywords help search. Extend freely.
  var EMOJIS = {
    'Smileys': [
      ['😀','grin smile happy'], ['😃','grin big smile'], ['😄','grin smile'],
      ['😁','grin'], ['😆','laugh'], ['🥹','holding tears'], ['😂','laugh tears joy'],
      ['🤣','rofl'], ['😊','smile blush'], ['🙂','slight smile'], ['🙃','upside'],
      ['😉','wink'], ['😌','relieved'], ['😍','love heart eyes'], ['🥰','smile hearts'],
      ['😘','kiss'], ['😎','cool sunglasses'], ['🤓','nerd geek'], ['🤔','thinking hmm'],
      ['🙄','eye roll'], ['😐','neutral'], ['😴','sleep'], ['🤤','drool'],
      ['😢','cry'], ['😭','sob cry'], ['😡','angry mad'], ['🤬','swear angry']
    ],
    'People': [
      ['👋','wave hello hi'], ['🤚','hand stop'], ['✋','high five'], ['🖐','hand'],
      ['🤘','rock'], ['👌','ok okay perfect'], ['🤏','pinch'], ['🤙','call shaka'],
      ['👍','thumbs up like'], ['👎','thumbs down dislike'], ['👏','clap applause'],
      ['🙌','raised hands praise'], ['🤝','handshake deal'], ['🙏','pray thanks'],
      ['💪','muscle strong'], ['🧠','brain'], ['👀','eyes look']
    ],
    'Symbols': [
      ['❤️','heart love'], ['🧡','orange heart'], ['💛','yellow heart'], ['💚','green heart'],
      ['💙','blue heart'], ['💜','purple heart'], ['🖤','black heart'], ['🤍','white heart'],
      ['💔','broken heart'], ['💯','100 perfect'], ['💥','boom explode'], ['💫','dizzy'],
      ['⭐','star'], ['🌟','glow star'], ['✨','sparkles'], ['🔥','fire hot lit'],
      ['🚀','rocket launch'], ['🎉','party celebrate'], ['🎊','confetti'], ['🏆','trophy win'],
      ['🥇','gold medal'], ['💎','diamond gem'], ['👑','crown']
    ],
    'Nature': [
      ['🌸','blossom pink'], ['🌺','flower'], ['🌻','sunflower'], ['🌹','rose'],
      ['🌷','tulip'], ['🌳','tree'], ['🌲','evergreen'], ['🌵','cactus'],
      ['🌊','wave water'], ['🌈','rainbow'], ['☀️','sun'], ['🌙','moon'],
      ['☁️','cloud'], ['⚡','lightning bolt'], ['❄️','snowflake'], ['🌍','earth world']
    ],
    'Food': [
      ['🍎','apple'], ['🍊','orange'], ['🍋','lemon'], ['🍌','banana'],
      ['🍓','strawberry'], ['🍇','grapes'], ['🍕','pizza'], ['🍔','burger'],
      ['🍟','fries'], ['🌮','taco'], ['🍣','sushi'], ['🍩','donut'], ['🍪','cookie'],
      ['🍫','chocolate'], ['🍰','cake'], ['☕','coffee'], ['🍵','tea'], ['🥤','drink']
    ],
    'Activities': [
      ['⚽','soccer'], ['🏀','basketball'], ['🏈','football'], ['⚾','baseball'],
      ['🎾','tennis'], ['🏐','volleyball'], ['🎯','target'], ['🎮','game'],
      ['🎲','dice'], ['🎸','guitar'], ['🎹','piano'], ['🎷','sax'],
      ['🎨','art paint'], ['🎬','movie clapper'], ['📷','camera']
    ],
    'Travel': [
      ['🚗','car'], ['🚕','taxi'], ['🚙','suv'], ['🏎️','race car'],
      ['🚌','bus'], ['🚲','bike'], ['✈️','plane'], ['🚀','rocket space'],
      ['🛰️','satellite'], ['⛵','sailboat'], ['🚢','ship'], ['🏝️','island']
    ],
    'Objects': [
      ['💻','laptop'], ['🖥️','desktop'], ['📱','phone'], ['⌨️','keyboard'],
      ['🖱️','mouse'], ['💾','floppy disk save'], ['💿','disc'], ['📀','dvd'],
      ['📦','box package'], ['🎁','gift present'], ['🔑','key'], ['🔒','lock'],
      ['💡','lightbulb idea'], ['🔍','search magnify'], ['📌','pin'], ['📎','clip attach']
    ]
  };

  var defaults = {
    onPick: null,
    recent: 16
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

    el.classList.add('emj');
    el.innerHTML =
      '<div class="emj-search">' +
        '<span style="color:rgba(255,255,255,0.55);">⌕</span>' +
        '<input placeholder="Search emoji…">' +
      '</div>' +
      '<div class="emj-cats"></div>' +
      '<div class="emj-grid"></div>';

    var search = el.querySelector('.emj-search input');
    var catsEl = el.querySelector('.emj-cats');
    var grid   = el.querySelector('.emj-grid');

    var categories = Object.keys(EMOJIS);
    var recent = JSON.parse(localStorage.getItem('emj-recent') || '[]');

    function renderCats() {
      catsEl.innerHTML = '';
      if (recent.length) {
        var rb = document.createElement('button');
        rb.className = 'emj-cat'; rb.textContent = '🕒';
        rb.title = 'Recent';
        rb.addEventListener('click', function () { showCat(null); });
        catsEl.appendChild(rb);
      }
      categories.forEach(function (c) {
        var b = document.createElement('button');
        b.className = 'emj-cat';
        b.textContent = EMOJIS[c][0][0];
        b.title = c;
        b.addEventListener('click', function () { showCat(c); });
        catsEl.appendChild(b);
      });
    }

    function showCat(name) {
      Array.prototype.forEach.call(catsEl.children, function (c) { c.classList.remove('is-active'); });
      if (!name) {
        if (catsEl.children[0]) catsEl.children[0].classList.add('is-active');
        renderGrid(recent.map(function (e) { return [e, '']; }), 'Recent');
      } else {
        var idx = categories.indexOf(name);
        if (catsEl.children[idx + (recent.length ? 1 : 0)]) {
          catsEl.children[idx + (recent.length ? 1 : 0)].classList.add('is-active');
        }
        renderGrid(EMOJIS[name], name);
      }
    }

    function renderGrid(items, label) {
      grid.innerHTML = '';
      if (label) {
        var h = document.createElement('div');
        h.className = 'emj-section';
        h.textContent = label;
        grid.appendChild(h);
      }
      if (!items.length) {
        grid.innerHTML += '<div class="emj-empty">No matches</div>';
        return;
      }
      items.forEach(function (it) {
        var b = document.createElement('button');
        b.textContent = it[0];
        b.title = it[1] || '';
        b.addEventListener('click', function () {
          pick(it[0]);
        });
        grid.appendChild(b);
      });
    }

    function renderSearch(q) {
      var matches = [];
      q = q.toLowerCase().trim();
      categories.forEach(function (c) {
        EMOJIS[c].forEach(function (e) {
          if (e[1].indexOf(q) !== -1 || e[0].indexOf(q) !== -1) matches.push(e);
        });
      });
      renderGrid(matches, q ? 'Results' : null);
    }

    function pick(emoji) {
      // Save to recent
      recent = [emoji].concat(recent.filter(function (e) { return e !== emoji; })).slice(0, o.recent);
      try { localStorage.setItem('emj-recent', JSON.stringify(recent)); } catch (e) {}
      if (typeof o.onPick === 'function') o.onPick(emoji);
    }

    search.addEventListener('input', function () {
      var v = search.value;
      if (v.trim()) renderSearch(v);
      else showCat(categories[0]);
    });

    renderCats();
    showCat(categories[0]);

    return {
      el: el,
      destroy: function () { el.innerHTML = ''; }
    };
  }

  var EmojiPicker = { init: init, EMOJIS: EMOJIS };

  if (typeof module !== 'undefined' && module.exports) module.exports = EmojiPicker;
  else root.EmojiPicker = EmojiPicker;
})(typeof window !== 'undefined' ? window : this);
