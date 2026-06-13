#!/usr/bin/env node
/* ============================================
   A11Y CODEMOD — add focus-visible ring + reduced-motion guard to CSS snippets
   ============================================
   Idempotent. For each target file:
     - detects the base class prefix (first top-level `.class {` defined)
     - appends a :focus-visible outline (skipped if file already has one)
     - appends a prefers-reduced-motion guard that SNAPS animations to their
       end-state (duration→0.01ms, iteration→1) rather than killing them —
       this avoids the "animate-in-from-hidden stays invisible" footgun.
       (skipped if file already declares prefers-reduced-motion)

   The guard is scoped to the file's prefix so it never pollutes the host page.

   Usage:
     node tools/a11y-codemod.js <file.css> [file2.css ...]
     node tools/a11y-codemod.js --focus-only <file.css>   # only the focus ring
   ============================================ */
'use strict';
var fs = require('fs');

var args = process.argv.slice(2);
var focusOnly = false, rmOnly = false, focusInteractive = false;
args = args.filter(function (a) {
  if (a === '--focus-only') { focusOnly = true; return false; }
  if (a === '--rm-only') { rmOnly = true; return false; }
  if (a === '--focus-interactive') { focusInteractive = true; return false; }
  return true;
});

// Restore a keyboard focus ring to interactive elements inside a component that
// has done `outline:none` without a :focus-visible replacement. Scopes to the
// element itself + focusable descendants; specificity (class + :focus-visible)
// beats the file's `.x:focus { outline:none }`, and :focus-visible only matches
// keyboard focus so mouse clicks stay ring-free.
function focusInteractiveBlock(bases) {
  var FOCUSABLE = 'a[href], button, input, select, textarea, summary, [tabindex], [role="button"], [role="tab"], [role="option"], [contenteditable="true"]';
  var primary = bases[0];
  var scope = bases.length > 1 ? ':is(' + bases.map(function (b) { return '.' + b; }).join(', ') + ')' : '.' + bases[0];
  return '\n/* ── Accessibility: restore keyboard focus ring (added by a11y-codemod) ── */\n' +
    scope + ' :is(' + FOCUSABLE + '):focus-visible,\n' +
    scope + ':is(' + FOCUSABLE + '):focus-visible {\n' +
    '  outline: var(--' + primary + '-focus-width, 2px) solid var(--' + primary + '-focus-color, #8b5cf6);\n' +
    '  outline-offset: var(--' + primary + '-focus-offset, 2px);\n' +
    '}\n';
}

// All distinct top-level class selectors in the file.
function topLevelClasses(src) {
  var set = {};
  var re = /^\.([a-z][a-z0-9_-]*)(?=[\s,{:.\[]|$)/gm;
  var m;
  while ((m = re.exec(src))) set[m[1]] = true;
  return Object.keys(set);
}
// Base prefixes = classes that are not a `<base>-variant` of another class.
// e.g. {btnp, btnp-neon} -> [btnp];  {modal, modal-x, drawer} -> [modal, drawer]
function basePrefixes(src) {
  var all = topLevelClasses(src);
  var bases = all.filter(function (c) {
    return !all.some(function (p) { return p !== c && c.indexOf(p + '-') === 0; });
  });
  return bases.length ? bases : all;
}

var changed = [];
args.forEach(function (file) {
  var src = fs.readFileSync(file, 'utf8');
  var bases = basePrefixes(src);
  if (!bases.length) { console.error('skip (no class found): ' + file); return; }
  var primary = bases[0];

  var hasFocus = /:focus-visible/.test(src);
  var hasRM = /prefers-reduced-motion/.test(src);

  // Dedicated mode: restore focus rings on interactive components.
  if (focusInteractive) {
    if (hasFocus) { return; }
    var fblock = focusInteractiveBlock(bases);
    fs.writeFileSync(file, (src.endsWith('\n') ? src : src + '\n') + fblock);
    changed.push(file + '  [bases=' + bases.map(function (b) { return '.' + b; }).join(',') + ' +focus-interactive]');
    return;
  }

  var wantFocus = !rmOnly && !hasFocus;
  var wantRM = !focusOnly && !hasRM;
  if (!wantFocus && !wantRM) { return; } // nothing to do

  var add = '\n/* ── Accessibility: ' +
    [wantFocus ? 'keyboard focus ring' : '', wantRM ? 'reduced-motion' : ''].filter(Boolean).join(' + ') +
    ' (added by a11y-codemod) ── */\n';
  if (wantFocus) {
    add += '.' + primary + ':focus-visible {\n' +
      '  outline: var(--' + primary + '-focus-width, 2px) solid var(--' + primary + '-focus-color, #8b5cf6);\n' +
      '  outline-offset: var(--' + primary + '-focus-offset, 2px);\n' +
      '}\n';
  }
  if (wantRM) {
    var sel = bases.map(function (b) {
      return '.' + b + ', .' + b + ' *, .' + b + '::before, .' + b + '::after';
    }).join(',\n  ');
    add += '@media (prefers-reduced-motion: reduce) {\n' +
      '  ' + sel + ' {\n' +
      '    animation-duration: 0.01ms !important;\n' +
      '    animation-iteration-count: 1 !important;\n' +
      '    transition-duration: 0.01ms !important;\n' +
      '    scroll-behavior: auto !important;\n' +
      '  }\n' +
      '}\n';
  }
  if (!src.endsWith('\n')) add = '\n' + add;
  fs.writeFileSync(file, src + add);
  changed.push(file + '  [bases=' + bases.map(function (b) { return '.' + b; }).join(',') +
    (wantFocus ? ' +focus' : '') + (wantRM ? ' +rm' : '') + ']');
});

console.log('updated ' + changed.length + ' file(s):');
changed.forEach(function (c) { console.log('  ' + c); });
