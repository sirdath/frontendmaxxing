/* ============================================
   STREAMING TEXT — Append tokens to a chat message with smooth-scroll-lock
   Inspired by Vercel AI Elements, ChatGPT, Claude, assistant-ui
   ============================================
   Designed for use with `fetch` + `ReadableStream` (Server-Sent Events / fetch streaming).
   Auto-renders Markdown-lite as it streams: paragraphs, lists, inline `code`, code blocks,
   blockquotes, links, headings. Smooth-scroll-locks to the bottom while streaming if the
   user hasn't scrolled away.

   Usage:
     <div class="strm strm-bubble" data-stream-id="m1"></div>
     <div class="strm-scroll" id="scroller">
       <!-- messages here -->
       <div class="strm-anchor"></div>
     </div>

     // Manual append:
     StreamingText.append('m1', 'Hello, ');
     StreamingText.append('m1', 'world!');
     StreamingText.done('m1');

     // From a Response stream (SSE / fetch streaming):
     await StreamingText.fromStream('m1', response.body, {
       parser: 'sse' | 'text' | 'json-delta',
       onDone: ()=>{}, onError: (err)=>{}
     });

     // From an async iterable of strings:
     await StreamingText.fromIterable('m1', asyncIter);

     // Scroll-lock helper:
     StreamingText.bindScrollLock('#scroller');
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    parser: 'text',           // 'text' | 'sse' | 'json-delta'
    deltaKey: 'choices.0.delta.content', // path for json-delta
    markdownLite: true,
    onToken: null,
    onDone: null,
    onError: null
  };

  var streams = {};

  function get(id) {
    if (!streams[id]) {
      var el = document.querySelector('[data-stream-id="' + id + '"]');
      if (!el) return null;
      streams[id] = { el: el, raw: '', renderTarget: null };
    }
    return streams[id];
  }

  function append(id, chunk, opts) {
    var s = get(id); if (!s) return;
    s.raw += chunk;
    render(s, opts || defaults);
    if (typeof (opts && opts.onToken) === 'function') opts.onToken(chunk);
    scrollLockTick();
  }

  function done(id, opts) {
    var s = get(id); if (!s) return;
    s.el.classList.add('strm-done');
    s.el.classList.remove('strm-thinking');
    if (typeof (opts && opts.onDone) === 'function') opts.onDone(s.raw);
    if (typeof defaults.onDone === 'function') defaults.onDone(s.raw);
  }

  function error(id, err, opts) {
    var s = get(id); if (!s) return;
    s.el.classList.add('strm-error');
    s.el.classList.remove('strm-thinking');
    if (typeof (opts && opts.onError) === 'function') opts.onError(err);
  }

  function thinking(id, on) {
    var s = get(id); if (!s) return;
    s.el.classList.toggle('strm-thinking', on !== false);
  }

  function reset(id) {
    var s = get(id); if (!s) return;
    s.raw = '';
    s.el.textContent = '';
    s.el.classList.remove('strm-done', 'strm-error', 'strm-thinking');
  }

  function render(s, opts) {
    var html = (opts && opts.markdownLite === false)
      ? escapeHtml(s.raw)
      : mdLite(s.raw);
    s.el.innerHTML = html;
  }

  // ===== Tiny streaming Markdown renderer =====
  function mdLite(src) {
    var html = src;
    // Escape first
    html = html.replace(/[<>&]/g, function (c) { return ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]); });

    // Fenced code blocks (incomplete trailing fence OK — leave as-is)
    html = html.replace(/```([a-zA-Z0-9_+-]*)\n([\s\S]*?)```/g, function (_, lang, code) {
      return '<pre><code data-lang="' + lang + '">' + code + '</code></pre>';
    });
    // Inline code
    html = html.replace(/`([^`\n]+)`/g, '<code>$1</code>');
    // Headings
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    // Bold / italic
    html = html.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^\*\n]+)\*/g, '<em>$1</em>');
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    // Blockquote
    html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');
    // Lists
    html = html.replace(/^([-*]) (.+)$/gm, '<li>$2</li>');
    html = html.replace(/(<li>[\s\S]+?<\/li>)(?!\s*<li>)/g, '<ul>$1</ul>');
    return html;
  }

  function escapeHtml(s) {
    return s.replace(/[<>&]/g, function (c) { return ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]); });
  }

  // ===== Stream consumers =====
  function fromStream(id, body, opts) {
    opts = mergeOpts(opts);
    if (!body || !body.getReader) {
      error(id, new Error('No stream'), opts);
      return Promise.reject(new Error('No stream'));
    }
    var reader = body.getReader();
    var decoder = new TextDecoder();
    var buffer = '';

    function consume() {
      return reader.read().then(function (r) {
        if (r.done) { done(id, opts); return; }
        buffer += decoder.decode(r.value, { stream: true });

        if (opts.parser === 'sse') {
          var parts = buffer.split(/\n\n/);
          buffer = parts.pop();
          parts.forEach(function (block) {
            block.split('\n').forEach(function (line) {
              var m = line.match(/^data:\s*(.*)$/);
              if (!m) return;
              if (m[1] === '[DONE]') return done(id, opts);
              try {
                var obj = JSON.parse(m[1]);
                var token = getPath(obj, opts.deltaKey);
                if (token) append(id, token, opts);
              } catch (e) {
                append(id, m[1], opts);  // raw fallback
              }
            });
          });
        } else if (opts.parser === 'json-delta') {
          var lines = buffer.split(/\n/);
          buffer = lines.pop();
          lines.forEach(function (line) {
            if (!line.trim()) return;
            try {
              var obj = JSON.parse(line);
              var token = getPath(obj, opts.deltaKey);
              if (token) append(id, token, opts);
            } catch (e) { /* skip */ }
          });
        } else {
          append(id, buffer, opts);
          buffer = '';
        }

        return consume();
      }).catch(function (err) { error(id, err, opts); throw err; });
    }
    return consume();
  }

  function fromIterable(id, iter, opts) {
    opts = mergeOpts(opts);
    return (async function () {
      try {
        for await (var token of iter) {
          if (typeof token === 'string') append(id, token, opts);
          else if (token && token.delta) append(id, token.delta, opts);
        }
        done(id, opts);
      } catch (err) {
        error(id, err, opts);
      }
    })();
  }

  function getPath(obj, path) {
    return path.split('.').reduce(function (acc, k) { return acc && acc[k]; }, obj);
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  // ===== Scroll-lock =====
  var scrollLockEls = [];
  function bindScrollLock(target) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, function (el) {
      if (scrollLockEls.indexOf(el) !== -1) return;
      var state = { el: el, locked: true };
      el.addEventListener('scroll', function () {
        var nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
        state.locked = nearBottom;
      });
      scrollLockEls.push(state);
    });
  }
  function scrollLockTick() {
    scrollLockEls.forEach(function (s) {
      if (s.locked) s.el.scrollTop = s.el.scrollHeight;
    });
  }

  var StreamingText = {
    append: append,
    done: done,
    error: error,
    thinking: thinking,
    reset: reset,
    fromStream: fromStream,
    fromIterable: fromIterable,
    bindScrollLock: bindScrollLock,
    streams: streams
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = StreamingText;
  else root.StreamingText = StreamingText;
})(typeof window !== 'undefined' ? window : this);
