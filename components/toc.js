/* ============================================
   TOC — Scrollspy + optional auto-generate for the table-of-contents
   Inspired by docs themes (Stripe / Tailwind / Radix docs)
   ============================================
   Usage:
     // auto-generate links from the article's headings:
     Toc.init('.toc', { content: '.article', headings: 'h2, h3', generate: true, offset: 90 });

     // or bind an existing list of <a class="toc-link" href="#id">:
     Toc.init('.toc', { content: '.article', offset: 90 });

   Options:
     content   selector/element holding the headings (required for spy)
     headings  selector for headings to track (default 'h2, h3')
     generate  build the <ul.toc-list> from headings (assigns ids) (default false)
     offset    px from top that counts as "active" (default 90)
     smooth    smooth-scroll on click (default true)
     hash      update location.hash on activate (default false)
   ============================================ */
(function (root) {
  'use strict';

  var defaults = { content: null, headings: 'h2, h3', generate: false, offset: 90, smooth: true, hash: false };

  function slugify(s) {
    return s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
  }

  function create(nav, opts) {
    var o = Object.assign({}, defaults, opts || {});
    var content = typeof o.content === 'string' ? document.querySelector(o.content) : o.content;
    if (!content) { console.warn('Toc: content not found'); return null; }

    var headings = Array.prototype.slice.call(content.querySelectorAll(o.headings));
    // Ensure every heading has an id
    var seen = {};
    headings.forEach(function (h) {
      if (!h.id) { var s = slugify(h.textContent) || 'section'; if (seen[s]) s += '-' + (++seen[s]); else seen[s] = 1; h.id = s; }
    });

    var list = nav.querySelector('.toc-list');
    if (o.generate) {
      if (!list) { list = document.createElement('ul'); list.className = 'toc-list'; nav.appendChild(list); }
      list.innerHTML = '';
      var topLevelTag = headings.length ? headings[0].tagName : 'H2';
      var currentSub = null;
      headings.forEach(function (h) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.className = 'toc-link'; a.href = '#' + h.id; a.textContent = h.textContent;
        li.appendChild(a);
        if (h.tagName === topLevelTag) { list.appendChild(li); currentSub = null; }
        else {
          if (!currentSub) { var sub = document.createElement('ul'); sub.className = 'toc-list';
            (list.lastElementChild || list).appendChild(sub); currentSub = sub; }
          currentSub.appendChild(li);
        }
      });
    }

    var links = Array.prototype.slice.call(nav.querySelectorAll('.toc-link'));
    var byId = {};
    links.forEach(function (a) { var id = (a.getAttribute('href') || '').replace('#', ''); if (id) byId[id] = a; });

    function setActive(id) {
      links.forEach(function (a) { a.classList.toggle('is-active', a === byId[id]); });
    }

    // Click → smooth scroll
    nav.addEventListener('click', function (e) {
      var a = e.target.closest('.toc-link'); if (!a) return;
      var id = (a.getAttribute('href') || '').replace('#', '');
      var target = document.getElementById(id); if (!target) return;
      e.preventDefault();
      var y = target.getBoundingClientRect().top + window.scrollY - o.offset + 1;
      window.scrollTo({ top: y, behavior: o.smooth ? 'smooth' : 'auto' });
      if (o.hash) history.replaceState(null, '', '#' + id);
      setActive(id);
    });

    // Scrollspy via IntersectionObserver
    var io = null;
    if ('IntersectionObserver' in window && headings.length) {
      var visible = new Set();
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) visible.add(en.target); else visible.delete(en.target);
        });
        // active = topmost visible heading, else last one passed
        var active = null, min = Infinity;
        visible.forEach(function (h) { var t = h.getBoundingClientRect().top; if (t < min) { min = t; active = h; } });
        if (!active) {
          // pick the last heading above the offset line
          for (var i = headings.length - 1; i >= 0; i--) {
            if (headings[i].getBoundingClientRect().top < o.offset + 5) { active = headings[i]; break; }
          }
        }
        if (active) setActive(active.id);
      }, { rootMargin: '-' + o.offset + 'px 0px -65% 0px', threshold: 0 });
      headings.forEach(function (h) { io.observe(h); });
    }

    return {
      el: nav,
      setActive: setActive,
      destroy: function () { if (io) io.disconnect(); }
    };
  }

  function init(target, opts) {
    if (typeof target === 'string') {
      var node = document.querySelector(target);
      return node ? create(node, opts) : null;
    }
    return create(target, opts);
  }

  var Toc = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = Toc;
  else root.Toc = Toc;
})(typeof window !== 'undefined' ? window : this);
