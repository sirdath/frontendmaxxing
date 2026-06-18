/* ============================================
   LIVE CONTROLS — bind a Tweakpane panel to any object's props (tune in real time)
   Inspired by Tweakpane (cocopon/tweakpane, MIT) · visu.haus-style "Live Controls"
   ============================================
   The vault's live-tuning affordance: turn any shader's `uniforms` map or a
   scene-runner `opts` object into a real-time tune-and-export instrument. Tweakpane
   is an AUTHORING dependency — if it's absent this no-ops gracefully (the piece
   still runs at its defaults, nothing is mutated), so it's safe to ship in a demo.
     <script src="https://cdn.jsdelivr.net/npm/tweakpane@3.1.10/dist/tweakpane.min.js"></script>

   Usage:
     // two-way binds each key: editing the panel mutates `uniforms` live.
     var ctrl = LiveControls.bind('#panel', uniforms, {
       u_speed: { min: 0, max: 2, step: 0.01 },
       u_scale: { min: 0.5, max: 8 }
     }, { title: 'Shader', onChange: function (key, val, obj) { runner.setUniform(key, obj[key]); } });
     // ctrl.refresh() after external changes · ctrl.dispose() to remove.
   ============================================ */
(function (root) {
  'use strict';

  var CDN = 'https://cdn.jsdelivr.net/npm/tweakpane@3.1.10/dist/tweakpane.min.js';

  // Bind a control panel to `obj`. `schema` maps obj keys → Tweakpane binding
  // opts ({min,max,step}, {options:{…}}, color, etc). Returns a handle that is a
  // safe no-op when Tweakpane is not present.
  function bind(target, obj, schema, opts) {
    opts = opts || {};
    if (!root.Tweakpane || !root.Tweakpane.Pane) {
      console.warn('[LiveControls] Tweakpane not loaded — controls disabled (piece runs at defaults). Add: <script src="' + CDN + '"></script>');
      return { pane: null, refresh: function () {}, dispose: function () {} };
    }
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    var pane = new root.Tweakpane.Pane(el ? { container: el, title: opts.title } : { title: opts.title });

    var keys = schema ? Object.keys(schema) : [];
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (!(key in obj)) continue;
      // v4 renamed addInput → addBinding; support both (the vault ships Tweakpane
      // v3's UMD browser global — v4 is ESM-only and defines no window global).
      var add = pane.addBinding ? pane.addBinding : pane.addInput;
      var binding = add.call(pane, obj, key, schema[key] || {});
      // Tweakpane is two-way: the panel already mutates obj[key]. Fire onChange
      // so callers can push the new value into a runner/uniform.
      if (typeof opts.onChange === 'function') {
        (function (k) {
          binding.on('change', function (ev) { opts.onChange(k, ev.value, obj); });
        })(key);
      }
    }
    if (typeof opts.onReady === 'function') opts.onReady(pane);

    return {
      pane: pane,
      refresh: function () { pane.refresh(); },
      dispose: function () { pane.dispose(); }
    };
  }

  var LiveControls = { bind: bind, init: bind, cdn: CDN };

  if (typeof module !== 'undefined' && module.exports) module.exports = LiveControls;
  else root.LiveControls = LiveControls;
})(typeof window !== 'undefined' ? window : this);
