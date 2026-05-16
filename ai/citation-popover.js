/* ============================================
   CITATION POPOVER — Inline numbered refs with hover/click source popovers
   Inspired by Perplexity citations, Vercel AI Elements InlineCitation
   ============================================
   Usage:
     // 1) Auto-init: works on existing markup with `.cit[data-cit]`
     CitationPopover.init('.cit-body');

     // 2) Programmatic source registry:
     CitationPopover.register('1', {
       title: 'History of Paris',
       domain: 'wikipedia.org',
       favicon: 'https://...',
       url: 'https://en.wikipedia.org/wiki/Paris',
       snippet: 'Paris is the capital and most populous city of France...'
     });
     CitationPopover.register('2', {...});

     // 3) Render text+citations from data:
     CitationPopover.renderInto(el, 'Paris [1] is in France [2].', sourcesArray);

   Trigger options:
     trigger: 'hover' | 'click' | 'both'   // default 'both'
   ============================================ */
(function (root) {
  'use strict';

  var sources = {};
  var popover = null;
  var hideTimer = null;
  var activeTrigger = null;

  var defaults = {
    trigger: 'both',
    offset: 8,
    hideDelay: 200,
    parseSources: true     // pull from .cit-sources <li id="src-N"> entries
  };

  function register(id, source) {
    sources[String(id)] = source;
  }

  function unregister(id) {
    delete sources[String(id)];
  }

  function get(id) {
    return sources[String(id)] || null;
  }

  function init(target, opts) {
    var o = mergeOpts(opts);
    var roots = typeof target === 'string'
      ? document.querySelectorAll(target || 'body')
      : (target.length ? target : [target]);

    Array.prototype.forEach.call(roots, function (r) {
      if (o.parseSources) parseSourcesFrom(r);
      var refs = r.querySelectorAll('.cit[data-cit]');
      Array.prototype.forEach.call(refs, function (ref) {
        if (ref.dataset.citBound) return;
        ref.dataset.citBound = '1';
        wire(ref, o);
      });
    });
  }

  function parseSourcesFrom(scope) {
    var lists = scope.querySelectorAll('.cit-sources');
    lists.forEach(function (list) {
      list.querySelectorAll('li[id^="src-"]').forEach(function (li) {
        var id = li.id.replace(/^src-/, '');
        register(id, {
          title: li.dataset.citTitle || '',
          domain: li.dataset.citDomain || '',
          favicon: li.dataset.citFavicon || '',
          url: li.dataset.citUrl || '',
          snippet: li.dataset.citSnippet || li.textContent.trim()
        });
      });
    });
  }

  function wire(ref, o) {
    var id = ref.dataset.cit;
    if (o.trigger === 'hover' || o.trigger === 'both') {
      ref.addEventListener('mouseenter', function () { open(ref, id); });
      ref.addEventListener('mouseleave', scheduleClose);
    }
    if (o.trigger === 'click' || o.trigger === 'both') {
      ref.addEventListener('click', function (e) {
        e.preventDefault();
        open(ref, id);
      });
    }
    ref.addEventListener('focus', function () { open(ref, id); });
    ref.addEventListener('blur', scheduleClose);
  }

  function open(ref, id) {
    var src = get(id);
    if (!src) return;
    cancelClose();

    if (!popover) popover = makePopover();
    fillPopover(popover, src, id);
    position(popover, ref);
    document.body.appendChild(popover);
    requestAnimationFrame(function () {
      popover.classList.add('is-open');
    });
    activeTrigger = ref;

    popover.addEventListener('mouseenter', cancelClose);
    popover.addEventListener('mouseleave', scheduleClose);
  }

  function makePopover() {
    var pop = document.createElement('div');
    pop.className = 'cit-popover';
    pop.setAttribute('role', 'tooltip');
    pop.innerHTML =
      '<div class="cit-pop-arrow"></div>' +
      '<div class="cit-pop-head">' +
        '<span class="cit-pop-favicon"></span>' +
        '<span class="cit-pop-domain"></span>' +
        '<span class="cit-pop-num"></span>' +
      '</div>' +
      '<div class="cit-pop-title"></div>' +
      '<div class="cit-pop-snippet"></div>' +
      '<a class="cit-pop-url" target="_blank" rel="noopener"></a>';
    return pop;
  }

  function fillPopover(pop, src, id) {
    var fav = pop.querySelector('.cit-pop-favicon');
    if (src.favicon) {
      fav.style.backgroundImage = 'url("' + src.favicon + '")';
      fav.style.backgroundSize = 'cover';
    } else {
      fav.style.backgroundImage = '';
    }
    pop.querySelector('.cit-pop-domain').textContent = src.domain || '';
    pop.querySelector('.cit-pop-num').textContent = id;
    pop.querySelector('.cit-pop-title').textContent = src.title || '';
    pop.querySelector('.cit-pop-snippet').textContent = src.snippet || '';
    var urlEl = pop.querySelector('.cit-pop-url');
    urlEl.textContent = src.url || '';
    urlEl.href = src.url || '#';
  }

  function position(pop, ref) {
    var rect = ref.getBoundingClientRect();
    var w = pop.offsetWidth || 320;
    var h = pop.offsetHeight || 140;
    var spaceBelow = window.innerHeight - rect.bottom;
    var below = spaceBelow > h + 16;

    var left = rect.left + window.scrollX - 8;
    var top = below
      ? rect.bottom + window.scrollY + 8
      : rect.top + window.scrollY - h - 8;

    // Clamp inside viewport
    var maxLeft = window.scrollX + window.innerWidth - w - 8;
    if (left > maxLeft) left = maxLeft;
    if (left < window.scrollX + 8) left = window.scrollX + 8;

    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
    pop.setAttribute('data-cit-placement', below ? 'bottom' : 'top');

    // Move arrow under the trigger
    var arrow = pop.querySelector('.cit-pop-arrow');
    if (arrow) {
      var arrowLeft = rect.left + rect.width / 2 - left + window.scrollX - 5;
      arrowLeft = Math.max(10, Math.min(w - 20, arrowLeft));
      arrow.style.left = arrowLeft + 'px';
    }
  }

  function scheduleClose() {
    cancelClose();
    hideTimer = setTimeout(close, defaults.hideDelay);
  }
  function cancelClose() {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
  }
  function close() {
    if (!popover) return;
    popover.classList.remove('is-open');
    setTimeout(function () {
      if (popover && popover.parentNode) popover.parentNode.removeChild(popover);
    }, 200);
    activeTrigger = null;
  }

  // Click outside to close
  document.addEventListener('click', function (e) {
    if (!popover || !popover.parentNode) return;
    if (popover.contains(e.target)) return;
    if (e.target.classList && e.target.classList.contains('cit')) return;
    close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
  window.addEventListener('resize', close);
  window.addEventListener('scroll', close, { passive: true });

  // === Render helper — turn "[1]" markers into chips and attach sources ===
  function renderInto(targetEl, text, sourcesArr, opts) {
    opts = opts || {};
    var html = escapeHtml(text).replace(/\[(\d+)\]/g, function (_, n) {
      return '<a class="cit ' + (opts.className || '') + '" data-cit="' + n + '" href="#src-' + n + '">' + n + '</a>';
    });
    targetEl.innerHTML = html;
    (sourcesArr || []).forEach(function (s, i) { register(String(i + 1), s); });
    init(targetEl, opts);
  }

  function escapeHtml(s) {
    return s.replace(/[<>&]/g, function (c) { return ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]); });
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var CitationPopover = {
    init: init,
    register: register,
    unregister: unregister,
    get: get,
    renderInto: renderInto,
    close: close,
    sources: sources
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = CitationPopover;
  else root.CitationPopover = CitationPopover;
})(typeof window !== 'undefined' ? window : this);
