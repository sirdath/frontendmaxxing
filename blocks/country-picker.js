/* ============================================
   COUNTRY PICKER — Country / dial-code picker with flag emojis
   Inspired by Stripe checkout
   ============================================
   Usage:
     CountryPicker.init('[data-country-picker]', {
       value: 'US',
       onChange: function (country) { … }   // { code, name, dial, flag }
     });

   Built-in list covers ~50 most common; extend via opts.countries.
   ============================================ */
(function (root) {
  'use strict';

  // ISO 3166-1 alpha-2 → name, dial code. Flag is derived from code.
  var COUNTRIES = [
    ['US', 'United States', '+1'],
    ['GB', 'United Kingdom', '+44'],
    ['CA', 'Canada', '+1'],
    ['AU', 'Australia', '+61'],
    ['DE', 'Germany', '+49'],
    ['FR', 'France', '+33'],
    ['IT', 'Italy', '+39'],
    ['ES', 'Spain', '+34'],
    ['NL', 'Netherlands', '+31'],
    ['BE', 'Belgium', '+32'],
    ['CH', 'Switzerland', '+41'],
    ['AT', 'Austria', '+43'],
    ['SE', 'Sweden', '+46'],
    ['NO', 'Norway', '+47'],
    ['DK', 'Denmark', '+45'],
    ['FI', 'Finland', '+358'],
    ['IE', 'Ireland', '+353'],
    ['PT', 'Portugal', '+351'],
    ['PL', 'Poland', '+48'],
    ['CZ', 'Czechia', '+420'],
    ['GR', 'Greece', '+30'],
    ['JP', 'Japan', '+81'],
    ['KR', 'South Korea', '+82'],
    ['CN', 'China', '+86'],
    ['IN', 'India', '+91'],
    ['SG', 'Singapore', '+65'],
    ['HK', 'Hong Kong', '+852'],
    ['TW', 'Taiwan', '+886'],
    ['TH', 'Thailand', '+66'],
    ['ID', 'Indonesia', '+62'],
    ['MY', 'Malaysia', '+60'],
    ['PH', 'Philippines', '+63'],
    ['VN', 'Vietnam', '+84'],
    ['NZ', 'New Zealand', '+64'],
    ['MX', 'Mexico', '+52'],
    ['BR', 'Brazil', '+55'],
    ['AR', 'Argentina', '+54'],
    ['CL', 'Chile', '+56'],
    ['CO', 'Colombia', '+57'],
    ['PE', 'Peru', '+51'],
    ['ZA', 'South Africa', '+27'],
    ['NG', 'Nigeria', '+234'],
    ['EG', 'Egypt', '+20'],
    ['KE', 'Kenya', '+254'],
    ['MA', 'Morocco', '+212'],
    ['AE', 'United Arab Emirates', '+971'],
    ['SA', 'Saudi Arabia', '+966'],
    ['IL', 'Israel', '+972'],
    ['TR', 'Turkey', '+90'],
    ['RU', 'Russia', '+7'],
    ['UA', 'Ukraine', '+380']
  ];

  function flagFor(code) {
    return code.toUpperCase().replace(/./g, function (c) {
      return String.fromCodePoint(127397 + c.charCodeAt(0));
    });
  }

  var defaults = {
    value: 'US',
    countries: null,
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

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var countries = (o.countries || COUNTRIES).map(function (c) {
      return { code: c[0], name: c[1], dial: c[2], flag: flagFor(c[0]) };
    });

    if (!el.querySelector('.cpk-trigger')) {
      el.innerHTML =
        '<button type="button" class="cpk-trigger">' +
          '<span class="cpk-flag"></span>' +
          '<span class="cpk-code"></span>' +
          '<span class="cpk-caret">▾</span>' +
        '</button>' +
        '<div class="cpk-menu">' +
          '<input class="cpk-search" placeholder="Search countries…">' +
          '<ul class="cpk-list"></ul>' +
        '</div>';
    }

    var trigger = el.querySelector('.cpk-trigger');
    var flagEl  = el.querySelector('.cpk-flag');
    var codeEl  = el.querySelector('.cpk-code');
    var menu    = el.querySelector('.cpk-menu');
    var search  = el.querySelector('.cpk-search');
    var list    = el.querySelector('.cpk-list');

    var current = countries.find(function (c) { return c.code === o.value; }) || countries[0];

    function paint() {
      flagEl.textContent = current.flag;
      codeEl.textContent = current.dial;
    }
    paint();

    function render(filter) {
      var q = (filter || '').toLowerCase().trim();
      list.innerHTML = '';
      countries.filter(function (c) {
        return !q || c.name.toLowerCase().indexOf(q) !== -1 ||
                c.code.toLowerCase().indexOf(q) !== -1 ||
                c.dial.indexOf(q) !== -1;
      }).forEach(function (c) {
        var li = document.createElement('li');
        li.className = 'cpk-item' + (c.code === current.code ? ' is-active' : '');
        li.innerHTML =
          '<span class="cpk-flag">' + c.flag + '</span>' +
          '<span class="cpk-item-name">' + c.name + '</span>' +
          '<span class="cpk-item-code">' + c.dial + '</span>';
        li.addEventListener('click', function () { pick(c); });
        list.appendChild(li);
      });
    }
    function pick(c) {
      current = c;
      paint();
      close();
      if (typeof o.onChange === 'function') o.onChange(c);
    }
    function open()  { el.classList.add('is-open'); render(''); setTimeout(function () { search.focus(); }, 50); }
    function close() { el.classList.remove('is-open'); search.value = ''; }
    function onTrigger(e) { e.stopPropagation(); el.classList.contains('is-open') ? close() : open(); }
    function onSearch() { render(search.value); }
    function onOutside(e) { if (!el.contains(e.target)) close(); }

    trigger.addEventListener('click', onTrigger);
    search.addEventListener('input', onSearch);
    document.addEventListener('click', onOutside);

    function destroy() {
      trigger.removeEventListener('click', onTrigger);
      search.removeEventListener('input', onSearch);
      document.removeEventListener('click', onOutside);
    }

    return {
      el: el,
      getValue: function () { return current; },
      setValue: function (code) {
        var c = countries.find(function (x) { return x.code === code; });
        if (c) pick(c);
      },
      destroy: destroy
    };
  }

  var CountryPicker = { init: init, COUNTRIES: COUNTRIES };

  if (typeof module !== 'undefined' && module.exports) module.exports = CountryPicker;
  else root.CountryPicker = CountryPicker;
})(typeof window !== 'undefined' ? window : this);
