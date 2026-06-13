/* ============================================
   ASCII BANNER — FIGlet-style block-character banner text
   Inspired by FIGlet, toilet, npm `figlet`, old BBS / terminal splash screens
   ============================================
   Usage:
     <div id="hero-banner"></div>
     <script>
       AsciiBanner.mount('#hero-banner', 'SOLACE');
       // → injects <pre class="ascii-banner" aria-label="SOLACE">█▀▀ …</pre>

       var art = AsciiBanner.render('404 - LOST');   // multi-line string
       var framed = AsciiBanner.box('v2.0.1', { pad: 2 }); // ┌─┐ box
     </script>

   Methods:
     AsciiBanner.render(text)                 → 5-row block-art string (A-Z 0-9 space - . !; unknown → space)
     AsciiBanner.mount(el|sel, text, {className?}) → injects accessible <pre class="ascii-banner">, returns it
     AsciiBanner.box(text, {pad?})            → wraps plain text (multi-line ok) in a ┌─┐│└┘ frame
     AsciiBanner.chars()                      → array of supported characters

   Tunables (set on the <pre> or an ancestor):
     --ab-font : font stack for the banner (default ui-monospace chain)
     color     : inherited — style the banner via parent color / gradient-clip
   ============================================ */
(function (global) {
  'use strict';

  /* ------------------------------------------------------------
     FONT — hand-tuned 5-row block font.
     Strokes: █ full, ▀ upper half, ▄ lower half (halves used to
     round corners and draw diagonals at double vertical res).
     ------------------------------------------------------------ */
  var FONT = {
    'A': [' ▄▀▀▄ ',
          '█    █',
          '█▀▀▀▀█',
          '█    █',
          '▀    ▀'],
    'B': ['█▀▀▀▄ ',
          '█   █ ',
          '█▀▀▀▄ ',
          '█   █ ',
          '█▄▄▄▀ '],
    'C': ['▄▀▀▀▀▄',
          '█     ',
          '█     ',
          '█     ',
          '▀▄▄▄▄▀'],
    'D': ['█▀▀▀▄ ',
          '█   ▀▄',
          '█    █',
          '█   ▄▀',
          '█▄▄▄▀ '],
    'E': ['█▀▀▀▀▀',
          '█     ',
          '█▀▀▀  ',
          '█     ',
          '█▄▄▄▄▄'],
    'F': ['█▀▀▀▀▀',
          '█     ',
          '█▀▀▀  ',
          '█     ',
          '█     '],
    'G': ['▄▀▀▀▀▄',
          '█     ',
          '█  ▀▀█',
          '█    █',
          '▀▄▄▄▄▀'],
    'H': ['█    █',
          '█    █',
          '█▀▀▀▀█',
          '█    █',
          '█    █'],
    'I': ['▀▀█▀▀',
          '  █  ',
          '  █  ',
          '  █  ',
          '▄▄█▄▄'],
    'J': ['▀▀▀▀▀█',
          '     █',
          '     █',
          '█    █',
          ' ▀▄▄▀ '],
    'K': ['█   ▄▀',
          '█ ▄▀  ',
          '██▀   ',
          '█ ▀▄  ',
          '█   ▀▄'],
    'L': ['█     ',
          '█     ',
          '█     ',
          '█     ',
          '█▄▄▄▄▄'],
    'M': ['█▄  ▄█',
          '█ ▀▀ █',
          '█    █',
          '█    █',
          '█    █'],
    'N': ['█▄   █',
          '█▀▄  █',
          '█ ▀▄ █',
          '█  ▀▄█',
          '█   ▀█'],
    'O': ['▄▀▀▀▀▄',
          '█    █',
          '█    █',
          '█    █',
          '▀▄▄▄▄▀'],
    'P': ['█▀▀▀▀▄',
          '█    █',
          '█▀▀▀▀ ',
          '█     ',
          '█     '],
    'Q': ['▄▀▀▀▀▄',
          '█    █',
          '█    █',
          '█  ▀▄█',
          ' ▀▀▀▀▀'],
    'R': ['█▀▀▀▀▄',
          '█    █',
          '█▀▀▀▄ ',
          '█   ▀▄',
          '█    █'],
    'S': ['▄▀▀▀▀▀',
          '█     ',
          '▀▀▀▀▀▄',
          '     █',
          '▄▄▄▄▄▀'],
    'T': ['▀▀█▀▀',
          '  █  ',
          '  █  ',
          '  █  ',
          '  █  '],
    'U': ['█    █',
          '█    █',
          '█    █',
          '█    █',
          '▀▄▄▄▄▀'],
    'V': ['█    █',
          '█    █',
          '█    █',
          ' █  █ ',
          '  ▀▀  '],
    'W': ['█    █',
          '█    █',
          '█    █',
          '█ ▄▄ █',
          '█▀  ▀█'],
    'X': ['█    █',
          ' ▀▄▄▀ ',
          '  ██  ',
          ' ▄▀▀▄ ',
          '█    █'],
    'Y': ['█    █',
          ' ▀▄▄▀ ',
          '  ██  ',
          '  ██  ',
          '  ██  '],
    'Z': ['▀▀▀▀▀█',
          '   ▄▀ ',
          '  ▄▀  ',
          ' ▄▀   ',
          '█▄▄▄▄▄'],
    '0': ['▄▀▀▀▀▄',
          '█   ▄█',
          '█ ▄▀ █',
          '█▀   █',
          '▀▄▄▄▄▀'],
    '1': [' ▄█  ',
          '  █  ',
          '  █  ',
          '  █  ',
          '▄▄█▄▄'],
    '2': ['▄▀▀▀▀▄',
          '     █',
          '   ▄▀ ',
          ' ▄▀   ',
          '█▄▄▄▄▄'],
    '3': ['▄▀▀▀▀▄',
          '     █',
          '  ▀▀▀█',
          '     █',
          '▀▄▄▄▄▀'],
    '4': ['█    █',
          '█    █',
          '▀▀▀▀▀█',
          '     █',
          '     █'],
    '5': ['█▀▀▀▀▀',
          '█     ',
          '▀▀▀▀▀▄',
          '     █',
          '▄▄▄▄▄▀'],
    '6': ['▄▀▀▀▀▄',
          '█     ',
          '█▀▀▀▀▄',
          '█    █',
          '▀▄▄▄▄▀'],
    '7': ['▀▀▀▀▀█',
          '    ▄▀',
          '   ▄▀ ',
          '   █  ',
          '   █  '],
    '8': ['▄▀▀▀▀▄',
          '█    █',
          '▄▀▀▀▀▄',
          '█    █',
          '▀▄▄▄▄▀'],
    '9': ['▄▀▀▀▀▄',
          '█    █',
          ' ▀▀▀▀█',
          '     █',
          '     █'],
    '-': ['    ',
          '    ',
          '▀▀▀▀',
          '    ',
          '    '],
    '.': ['  ',
          '  ',
          '  ',
          '▄▄',
          '▀▀'],
    '!': ['█',
          '█',
          '█',
          ' ',
          '▄'],
    ' ': ['   ',
          '   ',
          '   ',
          '   ',
          '   ']
  };

  var ROWS = 5;
  var GAP = ' ';

  // Normalize once: pad every glyph row to that glyph's max width
  Object.keys(FONT).forEach(function (ch) {
    var rows = FONT[ch];
    var w = 0;
    var i;
    for (i = 0; i < ROWS; i++) if (rows[i].length > w) w = rows[i].length;
    for (i = 0; i < ROWS; i++) {
      while (rows[i].length < w) rows[i] += ' ';
    }
  });

  /* ------------------------------------------------------------
     render(text) → multi-line block-art string
     ------------------------------------------------------------ */
  function render(text) {
    var src = String(text == null ? '' : text).toUpperCase();
    var lines = ['', '', '', '', ''];
    var i, r, ch, glyph;
    for (i = 0; i < src.length; i++) {
      ch = src.charAt(i);
      glyph = FONT.hasOwnProperty(ch) ? FONT[ch] : FONT[' '];
      for (r = 0; r < ROWS; r++) {
        lines[r] += (i > 0 ? GAP : '') + glyph[r];
      }
    }
    return lines.join('\n');
  }

  /* ------------------------------------------------------------
     mount(elOrSelector, text, { className? }) → injected <pre>
     ------------------------------------------------------------ */
  function mount(target, text, opts) {
    opts = opts || {};
    var host = typeof target === 'string' ? document.querySelector(target) : target;
    if (!host) return null;

    var pre = document.createElement('pre');
    pre.className = 'ascii-banner' + (opts.className ? ' ' + opts.className : '');
    pre.setAttribute('aria-label', String(text == null ? '' : text));
    pre.setAttribute('role', 'img');
    pre.style.fontFamily = 'var(--ab-font, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace)';
    pre.style.lineHeight = '1';
    pre.style.letterSpacing = '0';
    pre.style.whiteSpace = 'pre';
    pre.style.margin = '0';
    pre.textContent = render(text);

    host.appendChild(pre);
    return pre;
  }

  /* ------------------------------------------------------------
     box(text, { pad? }) → plain text in a ┌─┐│└┘ frame
     ------------------------------------------------------------ */
  function box(text, opts) {
    opts = opts || {};
    var pad = typeof opts.pad === 'number' ? Math.max(0, opts.pad) : 1;
    var lines = String(text == null ? '' : text).split('\n');
    var width = 0;
    var i;
    for (i = 0; i < lines.length; i++) if (lines[i].length > width) width = lines[i].length;

    var spacer = repeat(' ', pad);
    var bar = repeat('─', width + pad * 2);
    var out = ['┌' + bar + '┐'];
    for (i = 0; i < lines.length; i++) {
      out.push('│' + spacer + lines[i] + repeat(' ', width - lines[i].length) + spacer + '│');
    }
    out.push('└' + bar + '┘');
    return out.join('\n');
  }

  function repeat(ch, n) {
    var s = '';
    while (n-- > 0) s += ch;
    return s;
  }

  /* ------------------------------------------------------------
     chars() → supported character list
     ------------------------------------------------------------ */
  function chars() {
    return Object.keys(FONT);
  }

  var AsciiBanner = {
    render: render,
    mount: mount,
    box: box,
    chars: chars
  };

  if (typeof module !== 'undefined' && module.exports) { module.exports = AsciiBanner; } else { global.AsciiBanner = AsciiBanner; }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
