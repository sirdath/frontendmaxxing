/* ============================================
   DEMO PREVIEWS — Custom preview templates for high-impact snippets
   ============================================
   Registry: keyed by "folder/file" or just "file".
   Each function gets (targetEl, entry, opts) and renders preview HTML into target.

   To add a preview for a new snippet, register it here.
   ============================================ */
(function () {
  'use strict';

  var P = window.DemoPreviews = {};

  function html(target, str) { target.innerHTML = str; target.classList.add('is-dark'); }
  function grid(target, str) { target.innerHTML = str; target.classList.add('is-grid'); }

  // iPhone-frame helper for iOS previews: returns a screen element to fill.
  function iphoneFrame(target, opts) {
    opts = opts || {};
    var size = opts.size || 'sm'; // sm | normal | lg
    var iphClass = 'iph' + (size === 'sm' ? ' iph-sm' : size === 'lg' ? ' iph-lg' : '') + (opts.light ? ' iph-light' : '');
    var wp = opts.wallpaper ? (' iph-wp-' + opts.wallpaper) : '';
    var statusBar = opts.statusBar !== false;
    var homeIndicator = opts.homeIndicator !== false;
    var notch = opts.notch === 'notch'
      ? '<div class="iph-notch"></div>'
      : (opts.notch === 'none' ? '' : '<div class="iph-island"></div>');
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.6rem;width:100%;">' +
        '<div class="' + iphClass + '">' +
          notch +
          '<div class="iph-screen' + wp + '" data-iph-screen>' +
            (statusBar ? defaultStatusBar(opts.statusBarDark, opts.statusBarColor) : '') +
            '<div data-iph-content style="flex:1;display:flex;flex-direction:column;overflow:hidden;position:relative;"></div>' +
          '</div>' +
          (homeIndicator ? '<div class="iph-home" style="background:' + (opts.light ? '#000' : 'rgba(255,255,255,0.85)') + ';"></div>' : '') +
        '</div>' +
        (opts.caption ? '<div style="font-size:0.7rem;color:rgba(255,255,255,0.5);text-align:center;max-width:300px;">' + opts.caption + '</div>' : '') +
      '</div>';
    return target.querySelector('[data-iph-content]');
  }
  function defaultStatusBar(dark, color) {
    var c = dark ? 'ios-status-dark' : '';
    var inline = color ? 'color:' + color + ';' : '';
    return '<div class="ios-status ' + c + '" style="' + inline + '">' +
      '<span class="ios-status-time">9:41</span>' +
      '<div class="ios-status-right">' +
        '<span class="ios-status-signal"></span>' +
        '<span class="ios-status-wifi"></span>' +
        '<span class="ios-status-battery"></span>' +
      '</div>' +
    '</div>';
  }

  // ===== Gradient text =====
  P['effects/gradient-text.css'] = function (target) {
    html(target,
      '<div style="text-align:center;line-height:1.05;">' +
        '<div class="gtxt gtxt-h1 gtxt-cosmic" style="font-size:3rem;font-weight:800;">Cosmic gradient</div>' +
        '<div class="gtxt gtxt-instagram" style="font-size:1.6rem;font-weight:700;margin-top:0.6rem;">Instagram preset</div>' +
        '<div class="gtxt gtxt-apple gtxt-shimmer" style="font-size:1.6rem;font-weight:700;margin-top:0.6rem;">Apple shimmer</div>' +
      '</div>');
  };

  // ===== Aurora background =====
  P['backgrounds/aurora-bg.css'] = function (target) {
    target.innerHTML =
      '<div class="aurorabg aurorabg-cosmic" style="width:100%;height:100%;min-height:240px;border-radius:8px;position:relative;display:grid;place-items:center;">' +
        '<div style="font-size:1.5rem;font-weight:700;color:#fff;text-shadow:0 2px 12px rgba(0,0,0,0.4);">Aurora · cosmic</div>' +
      '</div>';
  };

  // ===== Gradient orbs =====
  P['backgrounds/gradient-orbs.css'] = function (target) {
    target.innerHTML =
      '<div class="orbsbg orbsbg-vercel" style="width:100%;height:240px;border-radius:8px;position:relative;overflow:hidden;">' +
        '<span class="orb orb-1"></span><span class="orb orb-2"></span><span class="orb orb-3"></span>' +
      '</div>';
  };

  // ===== Mesh BG Stripe =====
  P['backgrounds/mesh-bg-stripe.css'] = function (target) {
    target.innerHTML =
      '<div class="meshbg meshbg-stripe" style="width:100%;height:240px;border-radius:8px;display:grid;place-items:center;">' +
        '<div style="font-size:1.6rem;font-weight:700;color:#fff;">Stripe-style mesh</div>' +
      '</div>';
  };

  // ===== Sky gradients =====
  P['backgrounds/sky-gradients.css'] = function (target) {
    target.classList.add('is-grid');
    var skies = ['sunset', 'aurora-sky', 'deep-space', 'pastel-sky', 'mars', 'golden-hour'];
    target.innerHTML = skies.map(function (s) {
      return '<div class="sky sky-' + s + '" style="height:120px;border-radius:8px;display:grid;place-items:end;padding:0.5rem;">' +
        '<span style="color:#fff;font-size:0.72rem;font-family:monospace;text-shadow:0 2px 8px rgba(0,0,0,0.5);">' + s + '</span>' +
      '</div>';
    }).join('');
  };

  // ===== Gradient buttons =====
  P['blocks/gradient-buttons.css'] = function (target) {
    grid(target,
      '<button class="gbtn gbtn-aurora">Aurora</button>' +
      '<button class="gbtn gbtn-sunset gbtn-glow">Sunset</button>' +
      '<button class="gbtn gbtn-holo gbtn-pill">Holo</button>' +
      '<button class="gbtn gbtn-conic">Conic</button>' +
      '<button class="gbtn gbtn-instagram">Instagram</button>' +
      '<button class="gbtn gbtn-outline gbtn-cyber">Outline</button>'
    );
  };

  // ===== Buttons pack =====
  P['blocks/buttons-pack.css'] = function (target) {
    grid(target,
      '<button class="btnp btnp-neon">Neon</button>' +
      '<button class="btnp btnp-glass">Glass</button>' +
      '<button class="btnp btnp-3d">3D</button>' +
      '<button class="btnp btnp-gooey">Gooey</button>' +
      '<button class="btnp btnp-soft">Soft</button>' +
      '<button class="btnp btnp-glow-arrow">Glow →</button>'
    );
  };

  // ===== Neumorph buttons =====
  P['blocks/neumorph-buttons.css'] = function (target) {
    target.innerHTML =
      '<div style="background:#2a2d34;padding:2rem;border-radius:12px;display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;">' +
        '<button class="neu">Default</button>' +
        '<button class="neu neu-primary">Primary</button>' +
        '<button class="neu neu-pressed">Pressed</button>' +
        '<button class="neu neu-pill">Pill</button>' +
        '<button class="neu neu-icon">★</button>' +
      '</div>';
  };

  // ===== Gradient progress =====
  P['blocks/gradient-progress.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:1rem;width:100%;max-width:480px;">' +
        '<div class="gprog gprog-aurora" style="--v:75"><div class="gprog-fill"></div></div>' +
        '<div class="gprog gprog-sunset gprog-striped gprog-anim" style="--v:60"><div class="gprog-fill"></div></div>' +
        '<div class="gprog gprog-cyber gprog-thick gprog-glow" style="--v:45"><div class="gprog-fill"></div></div>' +
        '<div class="gprog gprog-mint gprog-indeterminate"><div class="gprog-fill"></div></div>' +
      '</div>';
  };

  // ===== Gradient badges =====
  P['blocks/gradient-badges.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;">' +
        '<span class="gbdg gbdg-aurora">Aurora</span>' +
        '<span class="gbdg gbdg-sunset gbdg-pulse">Live</span>' +
        '<span class="gbdg gbdg-holo">Holo</span>' +
        '<span class="gbdg gbdg-outline gbdg-cosmic">Outline</span>' +
        '<span class="gbdg gbdg-discord">Discord</span>' +
        '<span class="gbdg gbdg-cyber gbdg-sm">Cyber sm</span>' +
        '<span class="gbdg gbdg-gold gbdg-lg">Premium</span>' +
      '</div>';
  };

  // ===== Logo glow =====
  P['effects/logo-glow.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;gap:3rem;align-items:center;justify-content:center;">' +
        '<div class="logoglow logoglow-aurora" style="font-size:3rem;font-weight:800;color:#fff;">▲</div>' +
        '<div class="logoglow logoglow-cyber logoglow-strong" style="font-size:3rem;font-weight:800;color:#fff;">★</div>' +
        '<div class="logoglow logoglow-sunset logoglow-pulse" style="font-size:3rem;font-weight:800;color:#fff;">●</div>' +
      '</div>';
  };

  // ===== Fire =====
  P['effects/fire.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;gap:2rem;justify-content:center;">' +
        '<div class="fire"><span class="fire-flame"></span><span class="fire-flame"></span><span class="fire-flame"></span><span class="fire-ember"></span><span class="fire-ember"></span></div>' +
        '<div class="fire fire-blue"><span class="fire-flame"></span><span class="fire-flame"></span><span class="fire-flame"></span></div>' +
        '<div class="fire fire-purple"><span class="fire-flame"></span><span class="fire-flame"></span><span class="fire-flame"></span></div>' +
      '</div>';
  };

  // ===== Caustics =====
  P['effects/caustics.css'] = function (target) {
    target.innerHTML =
      '<div class="caustics caustics-tropical" style="width:100%;height:240px;border-radius:8px;"></div>';
  };

  // ===== Watercolor =====
  P['effects/watercolor.css'] = function (target) {
    target.innerHTML =
      '<div class="wc wc-bloom wc-paper" style="width:100%;height:240px;border-radius:8px;display:grid;place-items:center;">' +
        '<div style="font-size:1.5rem;font-weight:700;color:#1a1a2a;">Watercolor bloom</div>' +
      '</div>';
  };

  // ===== Tie dye =====
  P['effects/tie-dye.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;gap:1rem;justify-content:center;">' +
        '<div class="tie-dye tie-dye-classic tie-dye-spin" style="width:140px;height:140px;border-radius:50%;"></div>' +
        '<div class="tie-dye tie-dye-festival" style="width:140px;height:140px;border-radius:50%;"></div>' +
        '<div class="tie-dye tie-dye-cyberpunk" style="width:140px;height:140px;border-radius:50%;"></div>' +
      '</div>';
  };

  // ===== Lava lamp =====
  P['effects/lava-lamp.css'] = function (target) {
    target.innerHTML =
      '<div class="lava lava-aurora" style="width:200px;height:280px;border-radius:8px;">' +
        '<span class="lava-blob"></span><span class="lava-blob"></span><span class="lava-blob"></span>' +
        '<span class="lava-blob"></span><span class="lava-blob"></span>' +
      '</div>';
  };

  // ===== Crystal facets =====
  P['effects/crystal-facets.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;gap:1rem;justify-content:center;">' +
        '<div class="cryst cryst-emerald cryst-shine"></div>' +
        '<div class="cryst cryst-ruby"></div>' +
        '<div class="cryst cryst-opal cryst-hex"></div>' +
      '</div>';
  };

  // ===== Iridescent pack =====
  P['effects/iridescent-pack.css'] = function (target) {
    grid(target,
      '<div class="iri iri-soap" style="width:140px;height:140px;border-radius:50%;"></div>' +
      '<div class="iri iri-cd" style="width:140px;height:140px;border-radius:50%;"></div>' +
      '<div class="iri iri-opal" style="width:140px;height:140px;border-radius:8px;"></div>' +
      '<div class="iri iri-foil" style="width:140px;height:140px;border-radius:8px;"></div>'
    );
  };

  // ===== Liquid metal =====
  P['effects/liquid-metal.css'] = function (target) {
    grid(target,
      '<div class="metal metal-chrome metal-sheen" style="width:140px;height:140px;border-radius:8px;"></div>' +
      '<div class="metal metal-gold-liquid metal-anim" style="width:140px;height:140px;border-radius:8px;"></div>' +
      '<div class="metal metal-rose-gold" style="width:140px;height:140px;border-radius:8px;"></div>' +
      '<div class="metal metal-obsidian metal-sheen" style="width:140px;height:140px;border-radius:8px;"></div>'
    );
  };

  // ===== Glass refraction =====
  P['effects/glass-refraction.css'] = function (target) {
    html(target,
      '<div style="text-align:center;line-height:1.2;">' +
        '<div class="gref-text gref-text-prism" style="font-size:3rem;font-weight:900;">PRISM</div>' +
        '<div class="gref-text gref-text-rainbow gref-anim" style="font-size:2rem;font-weight:800;margin-top:0.8rem;">RAINBOW</div>' +
      '</div>');
  };

  // ===== Light rays =====
  P['effects/light-rays.css'] = function (target) {
    target.innerHTML =
      '<div class="lrays lrays-cosmic" style="width:100%;height:240px;border-radius:8px;display:grid;place-items:center;">' +
        '<div style="font-size:1.4rem;font-weight:700;color:#fff;">Light rays · cosmic</div>' +
      '</div>';
  };

  // ===== Image gradient =====
  P['effects/image-gradient.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;gap:2rem;align-items:center;justify-content:center;">' +
        '<div style="text-align:center;color:rgba(255,255,255,0.55);font-size:0.72rem;">Set <code>--src</code> to your PNG/SVG, then use <code>.imggrad-aurora</code>, <code>.imggrad-holo</code>, etc.</div>' +
      '</div>';
  };

  // ===== Heroes pack =====
  P['components/heroes-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="text-align:center;color:rgba(255,255,255,0.55);font-size:0.78rem;">10+ hero layouts. Open <code>components/heroes-pack.css</code> to see the full set.</div>';
  };

  // ===== Tooltip — programmatic =====
  P['blocks/tooltips.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;gap:1.5rem;justify-content:center;">' +
        '<span class="tooltip" data-tooltip="Hover me!">Top tooltip</span>' +
        '<span class="tooltip tooltip-right" data-tooltip="Side note">Right</span>' +
        '<span class="tooltip tooltip-bottom" data-tooltip="Below">Bottom</span>' +
      '</div>';
  };

  // ===== Streaming text (Phase 14) =====
  P['ai/streaming-text.js'] = function (target, entry, opts) {
    target.innerHTML =
      '<div class="strm strm-bubble strm-card" data-stream-id="dapp-stream" style="max-width:540px;">' +
      '</div>' +
      '<div style="margin-top:0.85rem;font-size:0.72rem;color:rgba(255,255,255,0.5);text-align:center;">Click "Replay" to see streaming again</div>';
    if (window.StreamingText) {
      var msg = '## Streaming response\n\nThis text streams **token by token** with a blinking caret. Use it for ChatGPT/Claude-style chat UIs.\n\n- Markdown rendering: lists, **bold**, `code`\n- Auto-scroll lock\n- SSE stream consumer included\n\nDone.';
      var i = 0;
      window.StreamingText.reset('dapp-stream');
      var iv = setInterval(function () {
        if (i >= msg.length) {
          clearInterval(iv);
          window.StreamingText.done('dapp-stream');
          return;
        }
        window.StreamingText.append('dapp-stream', msg[i]);
        i++;
      }, 16);
    }
  };

  // ===== Tool call card (Phase 14) =====
  P['ai/tool-call-card.js'] = function (target) {
    target.innerHTML = '<div id="dapp-tcc-host" style="width:100%;max-width:540px;"></div>';
    var host = document.getElementById('dapp-tcc-host');
    if (window.ToolCallCard) {
      window.ToolCallCard.create(host, {
        tool: 'search_web',
        state: 'success',
        args: { query: 'paris france capital' },
        result: { hits: 3, top: 'wikipedia.org/wiki/Paris' },
        expanded: true
      });
      window.ToolCallCard.create(host, {
        tool: 'read_file',
        state: 'running',
        args: { path: 'src/app.ts' }
      });
      window.ToolCallCard.create(host, {
        tool: 'execute_code',
        state: 'error',
        args: { lang: 'python' },
        result: 'ModuleNotFoundError: No module named "foo"'
      });
    }
  };

  // ===== Reasoning block =====
  P['ai/reasoning-block.js'] = function (target) {
    target.innerHTML = '<div id="dapp-rsn-host" style="width:100%;max-width:540px;"></div>';
    var host = document.getElementById('dapp-rsn-host');
    if (window.ReasoningBlock) {
      var r = window.ReasoningBlock.create(host, { autoCollapse: false });
      var txt = 'The user is asking about X. I should first consider Y, then check Z.\n\nStep 1: Search for context\nStep 2: Verify with primary source\nStep 3: Compose response';
      var i = 0;
      var iv = setInterval(function () {
        if (i >= txt.length) { clearInterval(iv); r.done(); return; }
        r.append(txt[i++]);
      }, 20);
    }
  };

  // ===== Citation popover =====
  P['ai/citation-popover.js'] = function (target) {
    target.innerHTML =
      '<div style="max-width:540px;color:#fff;line-height:1.65;">' +
        'Paris is the capital and most populous city of France <a class="cit cit-violet" data-cit="1" href="#">1</a>, ' +
        'with an estimated population of 2.1 million as of 2025 <a class="cit cit-cyan" data-cit="2" href="#">2</a>. ' +
        'It has been a major settlement for over two thousand years <a class="cit cit-pink" data-cit="3" href="#">3</a>.' +
      '</div>';
    if (window.CitationPopover) {
      window.CitationPopover.register('1', { title: 'Paris — Wikipedia', domain: 'wikipedia.org', snippet: 'Paris is the capital and most populous city of France...', url: 'https://en.wikipedia.org/wiki/Paris' });
      window.CitationPopover.register('2', { title: 'INSEE Population Stats', domain: 'insee.fr', snippet: 'Population estimates for Paris and Île-de-France...', url: 'https://insee.fr' });
      window.CitationPopover.register('3', { title: 'History of Paris', domain: 'britannica.com', snippet: 'Lutetia was founded by the Parisii tribe in the 3rd century BC...', url: 'https://britannica.com' });
      window.CitationPopover.init(target);
    }
  };

  // ===== Suggested replies =====
  P['ai/suggested-replies.css'] = function (target) {
    target.innerHTML =
      '<div class="sgr sgr-wrap" style="max-width:540px;">' +
        '<button class="sgr-chip">Tell me more</button>' +
        '<button class="sgr-chip sgr-arrow">Show an example</button>' +
        '<button class="sgr-chip sgr-primary">Yes, continue</button>' +
        '<button class="sgr-chip sgr-outline">Skip</button>' +
        '<button class="sgr-chip sgr-chip-cyan">Compare options</button>' +
      '</div>';
  };

  // ===== Token usage pill =====
  P['ai/token-usage-pill.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:0.7rem;align-items:flex-start;">' +
        '<span class="tup is-low" style="--tup-pct: 0.25"><svg class="tup-arc" viewBox="0 0 24 24"><circle class="tup-track" cx="12" cy="12" r="9"/><circle class="tup-fill" cx="12" cy="12" r="9"/></svg><span class="tup-text"><span class="tup-used">50k</span><span class="tup-sep">/</span><span class="tup-max">200k</span></span></span>' +
        '<span class="tup is-warn" style="--tup-pct: 0.8"><svg class="tup-arc" viewBox="0 0 24 24"><circle class="tup-track" cx="12" cy="12" r="9"/><circle class="tup-fill" cx="12" cy="12" r="9"/></svg><span class="tup-text"><span class="tup-used">160k</span><span class="tup-sep">/</span><span class="tup-max">200k</span></span></span>' +
        '<span class="tup is-critical" style="--tup-pct: 0.95"><svg class="tup-arc" viewBox="0 0 24 24"><circle class="tup-track" cx="12" cy="12" r="9"/><circle class="tup-fill" cx="12" cy="12" r="9"/></svg><span class="tup-text"><span class="tup-used">190k</span><span class="tup-sep">/</span><span class="tup-max">200k</span></span></span>' +
      '</div>';
  };

  // ===== Inline controls =====
  P['ai/inline-controls.css'] = function (target) {
    target.innerHTML =
      '<div class="ictl">' +
        '<button class="ictl-btn ictl-regenerate">↻ Regenerate</button>' +
        '<button class="ictl-btn ictl-copy">⧉ Copy</button>' +
        '<button class="ictl-btn ictl-good">👍</button>' +
        '<button class="ictl-btn ictl-bad">👎</button>' +
        '<button class="ictl-btn ictl-branch">⎇ Branch</button>' +
        '<button class="ictl-btn ictl-edit">✎ Edit</button>' +
      '</div>';
  };

  // ===== Agent trace =====
  P['ai/agent-trace.js'] = function (target) {
    target.innerHTML = '<div id="dapp-atrc-host" style="width:100%;max-width:540px;"></div>';
    if (window.AgentTrace) {
      var trace = window.AgentTrace.create('#dapp-atrc-host');
      trace.addStep({ type: 'plan', title: 'Plan the approach', content: '1. Search for context\n2. Verify primary source\n3. Compose answer', state: 'done' }).done({ duration: 420 });
      trace.addStep({ type: 'tool', title: 'search_web("paris")', state: 'done' }).done({ duration: 1230, content: 'Returned 3 hits.' });
      trace.addStep({ type: 'thinking', title: 'Synthesizing answer', state: 'running' });
    }
  };

  // ===== Shaders =====
  function shaderPreview(target, shaderModule, palette) {
    target.innerHTML = '<canvas id="dapp-shader" style="width:100%;height:240px;border-radius:8px;background:#000;display:block;"></canvas>';
    if (window.ShaderRunner && window[shaderModule]) {
      var u = palette
        ? Object.assign({}, window[shaderModule].defaults, window[shaderModule].palettes && window[shaderModule].palettes[palette] || {})
        : window[shaderModule].defaults;
      window.ShaderRunner.create('#dapp-shader', {
        fragment: window[shaderModule].fragment,
        uniforms: u
      });
    } else {
      target.innerHTML = '<div style="color:rgba(255,255,255,0.45);font-size:0.78rem;text-align:center;">Shader runner not loaded. Add <code>shaders/runner.js</code> + this shader to a page to see it run.</div>';
    }
  }
  P['shaders/voronoi.glsl.js']         = function (t) { shaderPreview(t, 'VoronoiShader', 'cosmic'); };
  P['shaders/kaleidoscope.glsl.js']    = function (t) { shaderPreview(t, 'KaleidoscopeShader', 'psychedelic'); };
  P['shaders/raymarch-sdf.glsl.js']    = function (t) { shaderPreview(t, 'RaymarchSDFShader', 'cosmic'); };
  P['shaders/godrays.glsl.js']         = function (t) { shaderPreview(t, 'GodraysShader', 'cinematic'); };
  P['shaders/plasma.glsl.js']          = function (t) { shaderPreview(t, 'PlasmaShader', 'rainbow'); };
  P['shaders/fluid.glsl.js']           = function (t) { shaderPreview(t, 'FluidShader', 'cosmic'); };
  P['shaders/noise-flow.glsl.js']      = function (t) { shaderPreview(t, 'NoiseFlowShader'); };
  P['shaders/gradient-mesh.glsl.js']   = function (t) { shaderPreview(t, 'GradientMeshShader'); };
  P['shaders/mesh-gradient-wgl.glsl.js'] = function (t) { shaderPreview(t, 'MeshGradientWGLShader', 'stripe'); };
  P['shaders/gradient-flow.glsl.js']   = function (t) { shaderPreview(t, 'GradientFlowShader', 'aurora'); };
  P['shaders/liquid-distortion.glsl.js'] = function (t) { shaderPreview(t, 'LiquidDistortionShader'); };
  P['shaders/halftone.glsl.js']        = function (t) { shaderPreview(t, 'HalftoneShader'); };
  P['shaders/sdf-text.glsl.js']        = function (t) {
    target = t;
    if (window.ShaderRunner && window.SDFTextShader) {
      target.innerHTML = '<canvas id="dapp-shader" style="width:100%;height:240px;border-radius:8px;background:#0a0014;display:block;"></canvas>';
      window.ShaderRunner.create('#dapp-shader', {
        fragment: window.SDFTextShader.proceduralFragment,
        uniforms: window.SDFTextShader.defaults
      });
    } else {
      shaderPreview(t, 'SDFTextShader');
    }
  };

  // ===== Gravity =====
  P['interactions/gravity.js'] = function (target) {
    target.innerHTML =
      '<div class="grv-stage" data-grv style="width:100%;height:280px;background:rgba(0,0,0,0.3);border-radius:8px;position:relative;overflow:hidden;">' +
        ['🚀', '⚡', '✨', '🎈', '🎯', '⭐', '🌟', '💫'].map(function (e) {
          return '<span class="grv-body" data-grv-body style="font-size:1.6rem;cursor:grab;user-select:none;">' + e + '</span>';
        }).join('') +
      '</div>';
    if (window.Gravity) {
      window.Gravity.create('.grv-stage', { cursorMode: 'attract', cursorStrength: 800 });
    }
  };

  // ===== Elastic line =====
  P['interactions/elastic-line.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:1.5rem;width:100%;max-width:500px;">' +
        '<div class="eln-host eln-violet" data-eln><svg class="eln-svg" viewBox="0 0 600 100" preserveAspectRatio="none"><path class="eln-path" d="M0,50 Q300,50 600,50"/></svg></div>' +
        '<div class="eln-host eln-cyan eln-thick" data-eln><svg class="eln-svg" viewBox="0 0 600 100" preserveAspectRatio="none"><path class="eln-path" d="M0,50 Q300,50 600,50"/></svg></div>' +
      '</div>';
    if (window.ElasticLine) window.ElasticLine.init('[data-eln]');
  };

  // ===== Encrypted text =====
  P['effects/encrypted-text.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:1rem;align-items:center;">' +
        '<div class="enctxt enctxt-cyber enctxt-glow" data-enctxt-target="ANTHROPIC" style="font-size:2rem;">ANTHROPIC</div>' +
        '<div class="enctxt enctxt-matrix enctxt-cursor" data-enctxt-target="DECRYPTED" style="font-size:1.4rem;">DECRYPTED</div>' +
      '</div>';
    if (window.EncryptedText) {
      target.querySelectorAll('.enctxt').forEach(function (el) {
        window.EncryptedText.reveal(el, { trigger: 'auto', perChar: 50, stagger: 60 });
      });
    }
  };

  // ===== Text flipping board =====
  P['effects/text-flipping-board.js'] = function (target) {
    target.innerHTML = '<div class="flap flap-amber flap-md" data-flap data-flap-text="PARIS 12:42">PARIS 12:42</div>';
    if (window.TextFlippingBoard) {
      var b = window.TextFlippingBoard.init('[data-flap]');
      var words = ['PARIS 12:42', 'LONDON 13:15', 'TOKYO 21:00', 'NEW YORK 06:42'];
      var i = 0;
      setInterval(function () { i++; b.setText(words[i % words.length]); }, 3000);
    }
  };

  // ===== Variable font cursor =====
  P['effects/variable-font-cursor.js'] = function (target) {
    target.innerHTML = '<h2 class="vfc vfc-hero vfc-gradient" data-vfc>MOVE YOUR CURSOR</h2>';
    if (window.VariableFontCursor) {
      window.VariableFontCursor.init('[data-vfc]', { radius: 220, smoothing: 0.18 });
    }
  };

  // ===== Light rays + Aurora bg companions ===== (already above)

  // ===== Smoke =====
  P['effects/smoke.css'] = function (target) {
    target.innerHTML =
      '<div class="smoke smoke-magical" style="width:100%;height:240px;border-radius:8px;position:relative;">' +
        '<span class="smoke-puff"></span><span class="smoke-puff"></span><span class="smoke-puff"></span>' +
        '<span class="smoke-puff"></span><span class="smoke-puff"></span>' +
      '</div>';
  };

  // ===== Gooey input =====
  P['effects/gooey-input.css'] = function (target) {
    target.innerHTML =
      '<svg width="0" height="0" style="position:absolute;">' +
        '<defs><filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"/><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo"/><feComposite in="SourceGraphic" in2="goo" operator="atop"/></filter></defs>' +
      '</svg>' +
      '<div class="goo goo-violet"><button class="goo-trigger">⌕</button><input class="goo-input" placeholder="Search…"><button class="goo-submit">→</button></div>';
  };

  // ===== Stepped gradients =====
  P['effects/stepped-gradient.css'] = function (target) {
    target.classList.add('is-grid');
    target.innerHTML =
      '<div class="step step-rainbow" style="height:80px;border-radius:6px;"></div>' +
      '<div class="step step-cosmic step-bands-8" style="height:80px;border-radius:6px;"></div>' +
      '<div class="dither dither-cyan-magenta" style="height:80px;border-radius:6px;"></div>' +
      '<div class="pixel-grad-blocks pixel-grad-game-boy" style="height:80px;border-radius:6px;"></div>';
  };

  // ===== Avatars =====
  P['components/gradient-avatar.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;gap:0.6rem;align-items:center;flex-wrap:wrap;justify-content:center;">' +
        ['claude', 'anthropic', 'sirdath', 'alice@email.com', 'bob.smith', 'carol', 'dan-vader'].map(function (s) {
          var style = ['', 'gav-conic', 'gav-mesh', 'gav-dots', 'gav-rings', 'gav-spiral', 'gav-holo'][Math.floor(Math.random() * 7)];
          return '<span class="gav gav-lg ' + style + '" data-gav="' + s + '" data-gav-name="' + s + '"></span>';
        }).join('') +
      '</div>';
    if (window.GradientAvatar) window.GradientAvatar.init('[data-gav]');
  };

  // ===== Triage row =====
  P['components/triage-row.css'] = function (target) {
    target.innerHTML =
      '<ul class="trg" style="width:100%;max-width:680px;">' +
        '<li class="trg-row"><span class="trg-priority is-urgent">●</span><span class="trg-key">ENG-241</span><span class="trg-title">Add bulk-edit to issues list</span><span class="trg-status is-progress">In Progress</span><span class="trg-labels"><span class="trg-label trg-label-bug">bug</span></span><span class="trg-avatar" style="--av-c:#a855f7;">AB</span><span class="trg-due">Mar 12</span></li>' +
        '<li class="trg-row"><span class="trg-priority is-high">●</span><span class="trg-key">ENG-242</span><span class="trg-title">Migrate to new auth flow</span><span class="trg-status is-todo">Todo</span><span class="trg-labels"><span class="trg-label trg-label-feature">feature</span></span><span class="trg-avatar" style="--av-c:#22d3ee;">CD</span><span class="trg-due is-soon">Mar 8</span></li>' +
        '<li class="trg-row"><span class="trg-priority is-medium">●</span><span class="trg-key">ENG-243</span><span class="trg-title">Fix flaky integration test</span><span class="trg-status is-done">Done</span><span class="trg-labels"><span class="trg-label trg-label-perf">perf</span></span><span class="trg-avatar" style="--av-c:#34d399;">EF</span><span class="trg-due">Feb 28</span></li>' +
      '</ul>';
  };

  // ===== Terminal block =====
  P['components/terminal-block.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:0.5rem;width:100%;max-width:640px;">' +
        '<div class="tblk tblk-success">' +
          '<header class="tblk-head"><span class="tblk-status">✓</span><code class="tblk-cmd">npm run build</code><span class="tblk-meta"><span class="tblk-time">1.2s</span><span class="tblk-exit">0</span></span></header>' +
          '<pre class="tblk-output">✓ Built dist/index.html\n✓ Built dist/app.js (32.4 KB)\n✓ Done in 1.2s</pre>' +
        '</div>' +
        '<div class="tblk tblk-error">' +
          '<header class="tblk-head"><span class="tblk-status">✕</span><code class="tblk-cmd">npm test</code><span class="tblk-meta"><span class="tblk-time">0.8s</span><span class="tblk-exit">1</span></span></header>' +
          '<pre class="tblk-output">FAIL src/auth.test.js\n  ✗ should validate token (12ms)</pre>' +
        '</div>' +
      '</div>';
  };

  // ===== Log stream =====
  P['components/log-stream.css'] = function (target) {
    target.innerHTML =
      '<div class="lstr" id="dapp-lstr" style="width:100%;max-width:680px;"></div>';
    if (window.LogStream) {
      var ls = window.LogStream.create('#dapp-lstr', { follow: true });
      var lines = [
        ['info', 'Server starting on port 3000'],
        ['info', 'Database connection established'],
        ['warn', 'Slow query detected (412ms): SELECT * FROM users'],
        ['info', 'GET /api/users 200 (8ms)'],
        ['error', 'Failed to send email: ECONNRESET'],
        ['debug', 'Cache hit ratio: 87%'],
        ['info', 'POST /api/auth 201 (24ms)']
      ];
      lines.forEach(function (l, i) {
        setTimeout(function () { ls.append({ time: Date.now(), level: l[0], msg: l[1] }); }, i * 250);
      });
    }
  };

  // ===== Stack trace =====
  P['components/stack-trace.css'] = function (target) {
    target.innerHTML = '<div id="dapp-stk" style="width:100%;max-width:680px;"></div>';
    if (window.StackTrace) {
      window.StackTrace.render('#dapp-stk', {
        error: { type: 'TypeError', message: "Cannot read 'profile' of undefined" },
        frames: [
          { fn: 'handleRequest', path: 'app/handlers/user.js', line: 42, col: 18, inApp: true, isError: true,
            source: ['function handleRequest(req) {', '  const user = req.user;', '  return user.profile.foo;', '}'],
            sourceStart: 40, errorLine: 42,
            locals: { user: undefined, 'req.user': null } },
          { fn: 'router.dispatch', path: 'node_modules/router/index.js', line: 312, inApp: false }
        ]
      });
    }
  };

  // ===== Infinite canvas =====
  P['components/infinite-canvas.css'] = function (target) {
    target.innerHTML =
      '<div class="icv icv-blueprint" data-icv style="width:100%;height:280px;border-radius:8px;position:relative;">' +
        '<div class="icv-grid"></div>' +
        '<div class="icv-world">' +
          '<div class="icv-node" style="left:80px;top:60px;">Node 1</div>' +
          '<div class="icv-node" style="left:280px;top:120px;">Node 2</div>' +
          '<div class="icv-node" style="left:160px;top:200px;">Node 3</div>' +
        '</div>' +
      '</div>';
    if (window.InfiniteCanvas) window.InfiniteCanvas.init('.icv');
  };

  // ===== Color wheel =====
  P['components/color-wheel.js'] = function (target) {
    target.innerHTML =
      '<div class="cwheel cwheel-lg">' +
        '<div class="cwheel-ring"></div>' +
        '<div class="cwheel-lum"></div>' +
        '<div class="cwheel-thumb"></div>' +
        '<div class="cwheel-preview"></div>' +
        '<div class="cwheel-readout">#FF0000</div>' +
      '</div>';
    if (window.ColorWheel) window.ColorWheel.init('.cwheel');
  };

  // ===== Sparkline / counter / progress ring (data-viz quickies) =====
  P['data-viz/count-up.js'] = function (target) {
    target.innerHTML =
      '<div style="text-align:center;">' +
        '<div class="countup" data-from="0" data-to="12450" data-suffix="+" style="font-size:3rem;font-weight:800;background:linear-gradient(135deg,#8b5cf6,#ec4899);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;">0</div>' +
        '<div style="color:rgba(255,255,255,0.5);font-size:0.8rem;text-transform:uppercase;letter-spacing:0.06em;font-weight:600;">Active users</div>' +
      '</div>';
    if (window.countUp) {
      window.countUp(target.querySelector('.countup'), { from: 0, to: 12450, duration: 1800, suffix: '+' });
    }
  };

  // ===== Glassmorphism =====
  P['effects/glassmorphism.css'] = function (target) {
    target.innerHTML =
      '<div style="width:100%;height:240px;background:linear-gradient(135deg,#8b5cf6 0%,#ec4899 50%,#06b6d4 100%);border-radius:8px;position:relative;display:grid;place-items:center;">' +
        '<div class="glass" style="width:240px;padding:1.5rem;border-radius:14px;text-align:center;">' +
          '<div style="font-size:1.2rem;font-weight:700;color:#fff;margin-bottom:0.3rem;">Glass card</div>' +
          '<div style="font-size:0.8rem;color:rgba(255,255,255,0.85);">Frosted backdrop blur</div>' +
        '</div>' +
      '</div>';
  };

  // ===== Border beam =====
  P['effects/border-beam.css'] = function (target) {
    target.innerHTML =
      '<div class="border-beam" style="padding:2rem 2.5rem;border-radius:12px;background:#0a0a14;color:#fff;font-weight:700;">Rotating gradient border</div>';
  };

  // ===== Spotlight reveal =====
  P['effects/spotlight-reveal.js'] = function (target) {
    target.innerHTML =
      '<div class="spotlight" data-spotlight style="width:100%;height:240px;border-radius:8px;display:grid;place-items:center;">' +
        '<div style="font-size:1.4rem;font-weight:700;color:#fff;position:relative;z-index:2;">Move your cursor</div>' +
      '</div>';
    if (window.SpotlightReveal) window.SpotlightReveal.init('.spotlight');
  };

  // ===== Marquee =====
  P['components/marquee.css'] = function (target) {
    target.innerHTML =
      '<div class="marquee" style="width:100%;">' +
        '<div class="marquee-track">' +
          ['React', 'Vue', 'Svelte', 'Solid', 'Angular', 'Astro', 'Remix', 'Next.js'].map(function (t) {
            return '<span class="marquee-item" style="margin:0 1.5rem;font-weight:600;font-size:1.2rem;color:rgba(255,255,255,0.8);">' + t + '</span>';
          }).join('') +
        '</div>' +
      '</div>';
  };

  // ===== Confetti =====
  P['feedback/confetti.js'] = function (target) {
    target.innerHTML =
      '<button id="dapp-confetti-btn" style="padding:0.75rem 1.5rem;background:linear-gradient(135deg,#8b5cf6,#ec4899);border:0;border-radius:8px;color:#fff;font-weight:600;cursor:pointer;font-size:1rem;">🎉 Click to celebrate</button>';
    document.getElementById('dapp-confetti-btn').addEventListener('click', function () {
      if (window.Confetti) window.Confetti.burst({ origin: { x: 0.5, y: 0.5 }, count: 80 });
    });
  };

  // ====================================================
  // PACK PREVIEWS — hand-crafted demos for every major namespaced pack
  // Each grid wraps each variant in a small card so the visual is always present.
  // ====================================================

  function packGrid(target, items, cardStyle, gridCols) {
    cardStyle = cardStyle || 'padding:0.7rem;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:10px;';
    var minCol = gridCols || 220;
    target.innerHTML =
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(' + minCol + 'px,1fr));gap:0.7rem;width:100%;max-width:1100px;">' +
        items.map(function (it) {
          return '<div style="' + cardStyle + 'display:flex;flex-direction:column;gap:0.5rem;">' +
            '<div style="font-size:0.62rem;color:rgba(255,255,255,0.5);font-family:ui-monospace,monospace;letter-spacing:0.04em;text-transform:uppercase;">' + (it.label || '') + '</div>' +
            '<div style="display:flex;align-items:center;justify-content:center;min-height:80px;">' + it.html + '</div>' +
          '</div>';
        }).join('') +
      '</div>';
  }

  // ===== Fintech pack =====
  P['components/fintech-pack.css'] = function (target) {
    packGrid(target, [
      { label: 'swap',     html: '<div class="fin-swap" style="max-width:280px;"><div class="fin-swap-row"><div class="fin-swap-label">From</div><input class="fin-swap-amount" value="1.5" readonly><button class="fin-swap-token"><span class="fin-swap-token-icon"></span>ETH</button></div><button class="fin-swap-flip">↕</button><div class="fin-swap-row"><div class="fin-swap-label">To</div><input class="fin-swap-amount" value="2,400" readonly><button class="fin-swap-token"><span class="fin-swap-token-icon" style="background:#06b6d4;"></span>USDC</button></div><button class="fin-swap-cta">Swap</button></div>' },
      { label: 'send',     html: '<div class="fin-send" style="max-width:240px;"><div class="fin-send-to">Send to</div><div class="fin-send-recipient">@maria.eth</div><div class="fin-send-amount"><span class="fin-send-amount-currency">$</span>120</div></div>' },
      { label: 'receive',  html: '<div class="fin-recv" style="max-width:260px;"><h4 class="fin-recv-title">Family received</h4><div class="fin-recv-people"><div class="fin-recv-avatar">J</div><div class="fin-recv-avatar" style="background:linear-gradient(135deg,#06b6d4,#8b5cf6);">M</div><div class="fin-recv-avatar" style="background:linear-gradient(135deg,#f59e0b,#ef4444);">L</div></div><div class="fin-recv-row"><span>James paid you</span><b class="fin-recv-amount">+$48</b></div></div>' },
      { label: 'credit',   html: '<div class="fin-credit" style="max-width:220px;"><div class="fin-credit-ring" style="--pct:65;"><div class="fin-credit-pct">65%<small>used</small></div></div><div class="fin-credit-amounts"><span>$3,250 used</span><span>$5,000</span></div></div>' },
      { label: 'budget',   html: '<div class="fin-budget" style="max-width:280px;"><div class="fin-budget-head"><div class="fin-budget-cat"><span class="fin-budget-cat-icon">🍔</span>Food</div><div class="fin-budget-amount">$320</div></div><div class="fin-budget-bar"><div class="fin-budget-fill" style="--fin-pct:65%;"></div></div><div class="fin-budget-meta"><span>Used</span><span>of $500</span></div></div>' },
      { label: 'fund',     html: '<div class="fin-fund" style="max-width:260px;"><div class="fin-fund-head"><div class="fin-fund-name">S&P 500</div><div class="fin-fund-change fin-fund-up">+12.4%</div></div><div class="fin-fund-amount">$24,810</div><div class="fin-fund-spark"></div></div>' },
      { label: 'wallet',   html: '<div class="fin-wallet" style="max-width:280px;"><div class="fin-wallet-brand">VISA</div><div class="fin-wallet-chip"></div><div class="fin-wallet-num">•••• •••• •••• 4242</div><div class="fin-wallet-foot"><div><div>CARDHOLDER</div><strong>JOHN APPLESEED</strong></div><div><div>EXPIRES</div><strong>12/26</strong></div></div></div>' },
      { label: 'tx-list',  html: '<ul class="fin-tx" style="max-width:300px;"><li class="fin-tx-item"><div class="fin-tx-icon">🛒</div><div><p class="fin-tx-title">Whole Foods</p><div class="fin-tx-sub">Groceries · 12:42 PM</div></div><div class="fin-tx-amt down">−$42.18</div></li><li class="fin-tx-item"><div class="fin-tx-icon" style="background:rgba(16,185,129,0.15);color:#10b981;">↑</div><div><p class="fin-tx-title">Payroll</p><div class="fin-tx-sub">Acme Co · 9:00 AM</div></div><div class="fin-tx-amt up">+$2,840.00</div></li></ul>' }
    ], null, 240);
  };

  // ===== Content cards pack =====
  P['components/content-cards-pack.css'] = function (target) {
    packGrid(target, [
      { label: 'profile-hero',  html: '<div class="cc-profile-hero" style="max-width:300px;"><div class="cc-profile-hero-cover"></div><div class="cc-profile-hero-body"><div class="cc-profile-hero-avatar">M</div><div class="cc-profile-hero-name">Maria Rivera</div><div class="cc-profile-hero-handle">@maria</div></div></div>' },
      { label: 'stats',         html: '<div class="cc-profile-stats" style="max-width:300px;"><div class="cc-profile-stats-tile"><b>2.1k</b><span>Followers</span></div><div class="cc-profile-stats-tile"><b>184</b><span>Posts</span></div><div class="cc-profile-stats-tile"><b>89%</b><span>Engagement</span></div></div>' },
      { label: 'notion-toggle', html: '<details class="cc-toggle" open style="max-width:300px;"><summary class="cc-toggle-head"><span class="cc-toggle-arrow"></span>Project Notes</summary><div class="cc-toggle-body">Click rows to expand nested content</div></details>' },
      { label: 'folder-stack',  html: '<div class="cc-folder-stack"><div></div><div></div><div></div></div>' },
      { label: 'action-sheet',  html: '<div class="cc-action-sheet" style="max-width:280px;"><button class="cc-action-sheet-item">Save Image</button><button class="cc-action-sheet-item">Copy Link</button><button class="cc-action-sheet-item danger">Delete</button><button class="cc-action-sheet-item cc-action-sheet-cancel">Cancel</button></div>' },
      { label: 'share-sheet',   html: '<div class="cc-share-sheet" style="max-width:300px;"><h4>Share via</h4><div class="cc-share-sheet-grid"><div class="cc-share-sheet-target"><span class="cc-share-sheet-icon">T</span>Twitter</div><div class="cc-share-sheet-target"><span class="cc-share-sheet-icon" style="background:linear-gradient(135deg,#1877f2,#42a5f5);">f</span>Facebook</div><div class="cc-share-sheet-target"><span class="cc-share-sheet-icon" style="background:linear-gradient(135deg,#0a66c2,#0e76d9);">in</span>LinkedIn</div><div class="cc-share-sheet-target"><span class="cc-share-sheet-icon" style="background:linear-gradient(135deg,#10b981,#06b6d4);">@</span>Email</div></div></div>' },
      { label: 'onboarding',    html: '<div class="cc-onboarding" style="max-width:280px;"><div class="cc-onboarding-num">1</div><h3>Get started</h3><p>Set up your workspace in three steps.</p><ul><li>Add your name</li><li>Invite teammates</li><li>Connect an integration</li></ul></div>' },
      { label: 'pricing',       html: '<div class="cc-pricing cc-pricing-featured" style="max-width:240px;"><h3>Pro</h3><div class="cc-pricing-price">$29<small>/mo</small></div><ul class="cc-pricing-list"><li>Unlimited projects</li><li>Priority support</li><li>Advanced analytics</li></ul><button class="cc-pricing-cta">Upgrade</button></div>' },
      { label: 'feature-glow',  html: '<div class="cc-feature-glow" style="max-width:280px;"><div class="cc-feature-glow-icon">⚡</div><h3>Fast as lightning</h3><p>Optimized for instant feedback at every keystroke.</p></div>' },
      { label: 'quote',         html: '<div class="cc-quote" style="max-width:320px;"><blockquote>"Best decision we made all year — it just works."</blockquote><div class="cc-quote-author"><div class="cc-quote-avatar"></div><div><b>Lena Park</b><span>CEO, Acme</span></div></div></div>' },
      { label: 'article',       html: '<div class="cc-article" style="max-width:260px;"><div class="cc-article-img"></div><div class="cc-article-body"><div class="cc-article-meta"><b>Design</b> · 5 min read</div><h3>The art of restraint</h3><p>Why removing features can be more powerful than adding them.</p></div></div>' },
      { label: 'event',         html: '<div class="cc-event" style="max-width:280px;"><div class="cc-event-date"><b>24</b><span>Aug</span></div><div class="cc-event-body"><h3>Product launch</h3><p>Apollo HQ · 2pm</p></div></div>' },
      { label: 'contact',       html: '<div class="cc-contact" style="max-width:240px;"><div class="cc-contact-avatar">JS</div><h3>James Smith</h3><div class="cc-contact-role">Engineering Lead</div><div class="cc-contact-row">📧 james@acme.io</div></div>' },
      { label: 'playlist',      html: '<div class="cc-playlist" style="max-width:180px;"><div class="cc-playlist-cover"></div><div class="cc-playlist-body"><h4>Late-night code</h4><p>32 tracks · 2h 18m</p></div></div>' },
      { label: 'song',          html: '<div class="cc-song" style="max-width:300px;"><div class="cc-song-thumb"></div><div><h4 class="cc-song-title">Solar Drift</h4><div class="cc-song-artist">Aurora Stack</div></div><div class="cc-song-dur">3:42</div></div>' },
      { label: 'podcast',       html: '<div class="cc-podcast" style="max-width:300px;"><div class="cc-podcast-art"></div><div><div class="cc-podcast-show">Decoder</div><h4>Episode 142: Hello World</h4><div class="cc-podcast-meta">52 min</div><button class="cc-podcast-play">▶</button></div></div>' },
      { label: 'recipe',        html: '<div class="cc-recipe" style="max-width:240px;"><div class="cc-recipe-hero"><button class="cc-recipe-fav">♥</button></div><div class="cc-recipe-body"><h3>Tomato basil galette</h3><div class="cc-recipe-meta"><span><b>45</b> min</span><span><b>4</b> servings</span></div></div></div>' },
      { label: 'character',     html: '<div class="cc-character" style="max-width:180px;"><div class="cc-character-portrait"></div><div class="cc-character-name">Eldwin Sage</div><div class="cc-character-level">LVL 42</div></div>' },
      { label: 'team',          html: '<div class="cc-team" style="max-width:200px;"><div class="cc-team-photo"></div><div class="cc-team-body"><h4>Alex Chen</h4><div class="cc-team-role">Designer</div><div class="cc-team-socials"><a>𝕏</a><a>in</a></div></div></div>' },
      { label: 'album-stack',   html: '<div class="cc-album-stack"><div></div><div></div><div></div></div>' }
    ], null, 260);
  };

  // ===== Widget pack (Phase 18) =====
  P['components/widget-pack.css'] = function (target) {
    packGrid(target, [
      { label: 'activities',  html: '<div class="wid-acts" style="max-width:280px;"><div class="wid-acts-rings"><div class="wid-acts-ring-3"></div></div><div class="wid-acts-stats"><div class="wid-acts-stat wid-acts-move"><span class="wid-acts-dot"></span>Move <b>420</b>/600 cal</div><div class="wid-acts-stat wid-acts-exc"><span class="wid-acts-dot"></span>Exercise <b>22</b>/30 min</div><div class="wid-acts-stat wid-acts-stand"><span class="wid-acts-dot"></span>Stand <b>8</b>/12 hrs</div></div></div>' },
      { label: 'weight',      html: '<div class="wid-weight" style="max-width:240px;"><div class="wid-weight-label">Weight</div><div class="wid-weight-val">162.4<small>lbs</small></div><div class="wid-weight-trend"></div><div class="wid-weight-delta">2.1 lbs this week</div></div>' },
      { label: 'trade',       html: '<div class="wid-trade" style="max-width:280px;"><div class="wid-trade-head"><div class="wid-trade-sym">AAPL</div><div class="wid-trade-action buy">Buy</div></div><div class="wid-trade-row"><span>Shares</span><b>50</b></div><div class="wid-trade-row"><span>Price</span><b>$192.40</b></div><div class="wid-trade-row"><span>Total</span><b>$9,620</b></div></div>' },
      { label: 'preview-link',html: '<div class="wid-prevlink" style="max-width:280px;"><div class="wid-prevlink-img"></div><div class="wid-prevlink-body"><div class="wid-prevlink-host">acme.app</div><h3 class="wid-prevlink-title">Building product on the edge</h3><p class="wid-prevlink-desc">A look at how the team ships fast without breaking things.</p></div></div>' },
      { label: 'deployment',  html: '<div class="wid-deploy" style="max-width:300px;"><div class="wid-deploy-head"><div class="wid-deploy-name">acme-app</div><div class="wid-deploy-status">Ready</div></div><div class="wid-deploy-meta"><span>Commit <b>3a2b1c</b></span><span>2m ago</span></div><a class="wid-deploy-url">acme-app-3a2b1c.vercel.app</a></div>' },
      { label: 'integration', html: '<div class="wid-integ" style="max-width:300px;"><div class="wid-integ-logo"></div><div class="wid-integ-body"><h4 class="wid-integ-name">Slack</h4><p class="wid-integ-desc">Send notifications to your team channels</p></div><button class="wid-integ-toggle is-on"></button></div>' },
      { label: 'meeting',     html: '<div class="wid-meet" style="max-width:300px;"><div class="wid-meet-head"><div class="wid-meet-time">2:00 PM</div><div class="wid-meet-dur">30 min</div></div><h4>Weekly sync</h4><div class="wid-meet-attendees"><div>JS</div><div style="background:linear-gradient(135deg,#06b6d4,#8b5cf6);">MA</div><div style="background:linear-gradient(135deg,#f59e0b,#ef4444);">LP</div></div><button class="wid-meet-join">Join Zoom</button></div>' },
      { label: 'event-rem',   html: '<div class="wid-evrem" style="max-width:300px;"><div class="wid-evrem-row"><div class="wid-evrem-icon">📅</div><div><p class="wid-evrem-title">Submit Q3 report</p><div class="wid-evrem-when">Tomorrow at 9:00 AM</div></div><div class="wid-evrem-pill">Work</div></div></div>' },
      { label: 'compose',     html: '<div class="wid-email" style="max-width:320px;"><div class="wid-email-row"><span>To:</span><input value="team@acme.io"></div><div class="wid-email-row"><span>Sub:</span><input value="Quick update"></div><textarea class="wid-email-body" placeholder="Type your message..."></textarea><div class="wid-email-foot"><div class="wid-email-tools"><button class="wid-email-tool">📎</button></div><button class="wid-email-send">Send</button></div></div>' },
      { label: 'files',       html: '<div class="wid-files" style="max-width:300px;"><div class="wid-files-row"><div class="wid-files-icon img">IMG</div><div><p class="wid-files-name">hero-shot.png</p><div class="wid-files-meta">2.1 MB · 2 hours ago</div></div><div class="wid-files-size"></div></div><div class="wid-files-row"><div class="wid-files-icon pdf">PDF</div><div><p class="wid-files-name">design-spec.pdf</p><div class="wid-files-meta">421 KB · Yesterday</div></div><div class="wid-files-size"></div></div></div>' }
    ], null, 260);
  };

  // ===== KPI pack =====
  P['components/kpi-pack.css'] = function (target) {
    packGrid(target, [
      { label: 'clean',    html: '<div class="kpi kpi-clean" style="max-width:200px;"><div class="kpi-label">Revenue</div><div class="kpi-val">$48.2k<small>/mo</small></div><div class="kpi-delta up">12% this week</div></div>' },
      { label: 'trend',    html: '<div class="kpi kpi-trend" style="max-width:220px;"><div><div class="kpi-label">Users</div><div class="kpi-val">8,210</div></div><div class="kpi-trend-spark"></div></div>' },
      { label: 'ring',     html: '<div class="kpi kpi-ring" style="max-width:240px;"><div class="kpi-ring-vis"><div class="kpi-ring-vis-num">72%</div></div><div><div class="kpi-label">Goal</div><div class="kpi-val">$36k<small>/$50k</small></div></div></div>' },
      { label: 'bar',      html: '<div class="kpi kpi-bar" style="max-width:220px;"><div class="kpi-label">Storage</div><div class="kpi-val">12.4<small>GB</small></div><div class="kpi-bar-track"><i style="--p:62%"></i></div></div>' },
      { label: 'compare',  html: '<div class="kpi kpi-compare" style="max-width:240px;"><div><div class="kpi-label">Sessions</div><div class="kpi-val">1,248</div></div><div class="kpi-compare-vs"><b>+18%</b>vs prev</div></div>' },
      { label: 'glow',     html: '<div class="kpi kpi-glow" style="max-width:220px;"><div class="kpi-label">Premium</div><div class="kpi-val">$1.2M</div><div class="kpi-delta up">+24%</div></div>' },
      { label: 'icon',     html: '<div class="kpi kpi-icon" style="max-width:220px;"><div class="kpi-icon-vis">📈</div><div><div class="kpi-label">Growth</div><div class="kpi-val">+24%</div></div></div>' },
      { label: 'stacked',  html: '<div class="kpi kpi-stacked" style="max-width:220px;"><div class="kpi-stacked-row"><span>Sessions</span><b>1,248</b></div><div class="kpi-stacked-row"><span>Bounce</span><b>32%</b></div><div class="kpi-stacked-row"><span>Avg time</span><b>2m 18s</b></div></div>' },
      { label: 'live',     html: '<div class="kpi" style="max-width:220px;"><div class="kpi-live-head">Live · last 5 min</div><div class="kpi-val">182</div><div class="kpi-delta up">active now</div></div>' }
    ], null, 220);
  };

  // ===== Badge pack =====
  P['components/badge-pack.css'] = function (target) {
    var demo = function (cls, text) { return '<span class="bp ' + cls + '">' + text + '</span>'; };
    target.innerHTML =
      '<div style="display:flex;flex-wrap:wrap;gap:0.4rem;max-width:720px;justify-content:center;">' +
        [
          demo('bp-solid-violet', 'Solid'),
          demo('bp-solid-pink', 'Pink'),
          demo('bp-solid-cyan', 'Cyan'),
          demo('bp-solid-mint', 'Mint'),
          demo('bp-solid-amber', 'Amber'),
          demo('bp-solid-red', 'Red'),
          demo('bp-soft-violet', 'Soft'),
          demo('bp-soft-pink', 'Soft pink'),
          demo('bp-soft-mint', 'Soft mint'),
          demo('bp-outline-violet', 'Outline'),
          demo('bp-outline-pink', 'Outline pink'),
          demo('bp-soft-mint bp-dot', 'Active'),
          demo('bp-soft-amber bp-pulse', 'Live'),
          demo('bp-count', '12'),
          demo('bp-count bp-count-lg', '99+'),
          demo('bp-gradient-1', 'Gradient'),
          demo('bp-gradient-2', 'Ocean'),
          demo('bp-gradient-3', 'Sunset'),
          demo('bp-beta', 'Beta'),
          demo('bp-new', 'New'),
          demo('bp-pro', 'Pro'),
          demo('bp-soon', 'Soon'),
          demo('bp-soft-violet bp-ic-star', 'Featured'),
          demo('bp-soft-mint bp-ic-check', 'Verified'),
          demo('bp-soft-amber bp-ic-fire', 'Trending'),
          demo('bp-sq bp-soft-cyan', 'API'),
          demo('bp-sm bp-solid-violet', 'sm'),
          demo('bp-lg bp-solid-pink', 'large'),
          demo('bp-loading', 'Syncing...')
        ].join('') +
      '</div>';
  };

  // ===== Avatar pack =====
  P['components/avatar-pack.css'] = function (target) {
    var av = function (extra, content) {
      return '<div class="av ' + extra + '">' + (content || '') + '</div>';
    };
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:1rem;align-items:center;">' +
        '<div style="display:flex;flex-wrap:wrap;gap:0.6rem;align-items:center;justify-content:center;max-width:720px;">' +
          av('av-xs', 'A') + av('av-sm', 'B') + av('av-md', 'C') +
          av('av-lg', 'D') + av('av-xl', 'E') +
          av('av-md av-c1', 'F') + av('av-md av-c2', 'G') + av('av-md av-c3', 'H') +
          av('av-md av-c4', 'I') + av('av-md av-c5', 'J') + av('av-md av-c6', 'K') +
          av('av-md av-square', 'L') + av('av-md av-squircle', 'M') +
          av('av-md av-status', 'N') +
          av('av-md av-status av-status-away', 'O') +
          av('av-md av-status av-status-busy', 'P') +
          av('av-lg av-ring-online', 'Q') +
          av('av-lg av-gradient-ring', '<div class="av-inner" style="width:100%;height:100%;display:grid;place-items:center;color:#fff;font-weight:700;">R</div>') +
          av('av-lg av-role" data-role="PRO', 'S') +
          av('av-lg av-identicon" style="--id-c1:#8b5cf6;--id-c2:#ec4899;--id-c3:#06b6d4;--id-c4:#f59e0b;', '') +
        '</div>' +
        '<div class="av-stack">' +
          av('av-md av-c1', 'A') + av('av-md av-c3', 'B') + av('av-md av-c4', 'C') +
          av('av-md av-c5', 'D') + av('av-md is-more', '+8') +
        '</div>' +
      '</div>';
  };

  // ===== Spinner pack =====
  P['blocks/spinner-pack.css'] = function (target) {
    var sp = function (cls, children) {
      return '<div style="display:flex;flex-direction:column;align-items:center;gap:0.4rem;padding:0.7rem;background:rgba(255,255,255,0.02);border-radius:8px;min-width:80px;">' +
        '<div class="sp ' + cls + '">' + (children || '') + '</div>' +
        '<div style="font-size:0.62rem;color:rgba(255,255,255,0.5);font-family:ui-monospace,monospace;">' + cls.split(' ').pop() + '</div>' +
      '</div>';
    };
    target.innerHTML =
      '<div style="display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center;justify-content:center;max-width:720px;">' +
        sp('sp-ring') + sp('sp-dual-ring') + sp('sp-dots-3', '<i></i>') +
        sp('sp-dots-orbit') + sp('sp-bars-3', '<i></i><i></i><i></i>') +
        sp('sp-bars-5', '<i></i><i></i><i></i><i></i><i></i>') +
        sp('sp-pulse') + sp('sp-ell', '<i></i><i></i><i></i><i></i>') +
        sp('sp-ripple') + sp('sp-grow') + sp('sp-grad') +
        sp('sp-sq-flip') + sp('sp-wave', '<i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>') +
        sp('sp-infinity') + sp('sp-atom') + sp('sp-hourglass') +
      '</div>';
  };

  // ===== Icons pack =====
  P['components/icons-pack.css'] = function (target) {
    var names = ['arrow-up','arrow-down','arrow-left','arrow-right','plus','minus','x','check','star','heart','bell','search','menu','grid','list','calendar','clock','user','mail','lock','unlock','eye','trash','edit','download','upload','share','link','filter','sort','settings','info','warn','error','success','loading','dots','three-bars'];
    target.innerHTML =
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(72px,1fr));gap:0.4rem;max-width:720px;color:#c4b5fd;">' +
        names.map(function (n) {
          return '<div style="display:flex;flex-direction:column;align-items:center;gap:0.3rem;padding:0.7rem 0.4rem;background:rgba(255,255,255,0.02);border-radius:8px;">' +
            '<span class="ic ic-' + n + ' ic-lg"></span>' +
            '<div style="font-size:0.6rem;font-family:ui-monospace,monospace;color:rgba(255,255,255,0.5);">' + n + '</div>' +
          '</div>';
        }).join('') +
      '</div>';
  };

  // ===== Chip pack =====
  P['blocks/chip-pack.css'] = function (target) {
    var chip = function (cls, content, extra) {
      return '<span class="chp ' + cls + '"' + (extra || '') + '>' + content + '</span>';
    };
    target.innerHTML =
      '<div style="display:flex;flex-wrap:wrap;gap:0.4rem;align-items:center;justify-content:center;max-width:720px;">' +
        chip('chp-filter is-picked', 'Filter ✓') +
        chip('chp-filter', 'Filter') +
        chip('chp-action', 'Action') +
        chip('chp-status chp-status-good chp-status-pulse', 'Live') +
        chip('chp-status chp-status-warn', 'Pending') +
        chip('chp-status chp-status-bad', 'Failed') +
        chip('chp-status chp-status-info', 'Info') +
        chip('chp-choice is-picked', 'Picked') +
        chip('chp-rm', 'Tag<button class="chp-rm-x">×</button>') +
        chip('chp-av', '<span class="chp-av-img"></span>Maria') +
        chip('chp-ic', 'Premium', ' data-ic="✨"') +
        chip('chp-grad-1', 'Gradient') +
        chip('chp-grad-2', 'Ocean') +
        chip('chp-grad-3', 'Sunset') +
        chip('chp-grad-4', 'Forest') +
        chip('chp-ghost-violet', 'Ghost') +
        chip('chp-met chp-met-up', '<b>+12%</b><span>vs prev</span>') +
        chip('chp-met chp-met-down', '<b>-3.2%</b><span>vs prev</span>') +
        chip('chp-anim chp-solid-pink chp-sm', 'sm') +
        chip('chp-anim chp-solid-mint chp-lg', 'large') +
      '</div>';
  };

  // ===== Divider pack =====
  P['blocks/divider-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:1.4rem;max-width:520px;width:100%;color:rgba(255,255,255,0.6);font-size:0.72rem;">' +
        ['solid', 'dashed', 'dotted', 'fade', 'fade-violet', 'double'].map(function (n) {
          return '<div><div style="font-family:ui-monospace,monospace;margin-bottom:0.3rem;">.dv-' + n + '</div><hr class="dv dv-' + n + '"></div>';
        }).join('') +
        '<div><div style="font-family:ui-monospace,monospace;margin-bottom:0.3rem;">.dv-text</div><div class="dv dv-text"><span>OR</span></div></div>' +
        '<div><div style="font-family:ui-monospace,monospace;margin-bottom:0.3rem;">.dv-icon</div><div class="dv dv-icon"><span class="dv-icon-ic">✦</span></div></div>' +
        '<div><div style="font-family:ui-monospace,monospace;margin-bottom:0.3rem;">.dv-glyph</div><div class="dv dv-glyph dv-glyph-star"><span>★ chapter ★</span></div></div>' +
        '<div><div style="font-family:ui-monospace,monospace;margin-bottom:0.3rem;">.dv-zigzag</div><div class="dv dv-zigzag"></div></div>' +
        '<div><div style="font-family:ui-monospace,monospace;margin-bottom:0.3rem;">.dv-wavy</div><div class="dv dv-wavy"></div></div>' +
        '<div><div style="font-family:ui-monospace,monospace;margin-bottom:0.3rem;">.dv-thick</div><hr class="dv dv-thick dv-thick-short"></div>' +
      '</div>';
  };

  // ===== Button pack 3 =====
  P['blocks/button-pack-3.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center;justify-content:center;max-width:720px;">' +
        '<button class="btn3">Default</button>' +
        '<button class="btn3 btn3-fab">+</button>' +
        '<div class="btn3-segmented"><button class="btn3 is-active">Day</button><button class="btn3">Week</button><button class="btn3">Month</button></div>' +
        '<div class="btn3-group"><button class="btn3">Bold</button><button class="btn3 is-active">Italic</button><button class="btn3">Under</button></div>' +
        '<button class="btn3 btn3-ghost-icon">⌘</button>' +
        '<button class="btn3 btn3-arrow">Get started</button>' +
        '<button class="btn3 btn3-grad-soft">Soft</button>' +
        '<button class="btn3 btn3-3d">3D pop</button>' +
        '<button class="btn3 btn3-shift">Slide</button>' +
        '<button class="btn3 btn3-pulse is-clicked">Pulse</button>' +
        '<a class="btn3 btn3-link" href="#">Learn more →</a>' +
        '<button class="btn3 btn3-sm">Small</button>' +
        '<button class="btn3 btn3-lg">Large</button>' +
        '<button class="btn3 btn3-xl">XL</button>' +
      '</div>';
  };

  // ===== Card pack 3 =====
  P['components/card-pack-3.css'] = function (target) {
    packGrid(target, [
      { label: 'info',     html: '<div class="cd3-info" style="max-width:280px;"><div class="cd3-info-ic">💡</div><div><h4>Quick tip</h4><p>Press <code>?</code> anywhere to open the cheatsheet.</p></div></div>' },
      { label: 'stat',     html: '<div class="cd3-stat" style="max-width:200px;"><div class="cd3-stat-label">MRR</div><div class="cd3-stat-val">$48.2k</div><div class="cd3-stat-delta up">+24%</div><div class="cd3-stat-spark"></div></div>' },
      { label: 'product',  html: '<div class="cd3-prod" style="max-width:200px;"><div class="cd3-prod-img"><span class="cd3-prod-badge">Sale</span><button class="cd3-prod-save">♥</button></div><div class="cd3-prod-body"><div class="cd3-prod-name">Linen pullover</div><div class="cd3-prod-meta"><span class="cd3-prod-price">$59</span><span class="cd3-prod-old">$89</span></div></div></div>' },
      { label: 'blog',     html: '<a class="cd3-blog" style="max-width:280px;text-decoration:none;color:inherit;"><div class="cd3-blog-img"></div><div class="cd3-blog-body"><div class="cd3-blog-cat">Engineering</div><h3>Why we rewrote our queue</h3><div class="cd3-blog-meta"><b>5 min</b>read · 2 days ago</div></div></a>' },
      { label: 'video',    html: '<div class="cd3-vid" style="max-width:280px;"><div class="cd3-vid-thumb"><span class="cd3-vid-dur">4:21</span></div><div class="cd3-vid-body"><h4 class="cd3-vid-title">Introducing Aurora 2.0</h4><div class="cd3-vid-meta"><b>120k views</b> · 3 days ago</div></div></div>' },
      { label: 'deal',     html: '<div class="cd3-deal" style="max-width:260px;"><span class="cd3-deal-tag">Limited</span><div class="cd3-deal-title">50% off</div><div class="cd3-deal-sub">Black Friday weekend</div><button class="cd3-deal-cta">Shop now</button></div>' },
      { label: 'spotlight',html: '<div class="cd3-spot" style="max-width:300px;"><div class="cd3-spot-ic">⚡</div><h3>AI suggestions</h3><p>Get instant code completions, refactoring tips, and bug fixes.</p><button class="cd3-spot-cta">Try free</button></div>' },
      { label: 'app',      html: '<div class="cd3-app"><div class="cd3-app-ic">A</div><div class="cd3-app-name">Apollo</div></div>' }
    ], null, 240);
  };

  // ===== Modal pack =====
  P['components/modal-pack.css'] = function (target) {
    packGrid(target, [
      { label: 'confirm',  html: '<div class="md-confirm" style="position:static;max-width:300px;transform:none;"><div class="md-confirm-icon">?</div><h3>Delete project</h3><p>Are you sure? This cannot be undone.</p><div class="md-confirm-actions"><button class="cancel">Cancel</button><button class="confirm">Delete</button></div></div>' },
      { label: 'alert',    html: '<div class="md-alert" style="position:static;max-width:300px;transform:none;"><div class="md-alert-icon"></div><h3>Saved!</h3><p>Your changes have been published.</p><button>Continue</button></div>' },
      { label: 'multi',    html: '<div class="md-multi" style="position:static;max-width:340px;transform:none;"><div class="md-multi-bar"><i style="--p:33%"></i></div><div class="md-multi-step">Step 1 of 3</div><h3>Tell us about you</h3><div class="md-multi-body">Choose your role to personalize your dashboard.</div><div class="md-multi-foot"><button class="back" disabled>Back</button><button class="next">Continue</button></div></div>' }
    ], null, 280);
  };

  // ===== Tabs pack 2 =====
  P['components/tabs-pack-2.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:1.2rem;max-width:540px;width:100%;">' +
        '<div class="tp2-v"><div class="tp2-v-list"><button class="tp2-v-tab is-active">Profile</button><button class="tp2-v-tab">Account</button><button class="tp2-v-tab">Billing</button></div><div class="tp2-v-body"><h3 style="margin:0;">Profile</h3><p style="margin:0.5rem 0 0;color:rgba(255,255,255,0.55);font-size:0.85rem;">Manage your personal info.</p></div></div>' +
        '<div class="tp2-ic"><button class="tp2-ic-tab is-active"><span class="tp2-ic-tab-icon">⌘</span>Cmd</button><button class="tp2-ic-tab"><span class="tp2-ic-tab-icon" style="background:rgba(236,72,153,0.18);color:#ec4899;">⚙</span>Settings</button><button class="tp2-ic-tab"><span class="tp2-ic-tab-icon" style="background:rgba(6,182,212,0.18);color:#06b6d4;">🔔</span>Alerts</button></div>' +
        '<div class="tp2-grow"><button class="tp2-grow-tab is-active">★ <span>Featured</span></button><button class="tp2-grow-tab">📦</button><button class="tp2-grow-tab">⚡</button><button class="tp2-grow-tab">🌟</button></div>' +
      '</div>';
  };

  // ===== Sidebar pack =====
  P['components/sidebar-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;gap:1rem;align-items:flex-start;max-width:720px;">' +
        '<aside class="sb-disc"><div class="sb-disc-icon sb-disc-icon-img is-home">F</div><div class="sb-disc-divider"></div><div class="sb-disc-icon is-active">A</div><div class="sb-disc-icon">B</div><div class="sb-disc-icon">C</div><div class="sb-disc-icon sb-disc-add">+</div></aside>' +
        '<aside class="sb-not"><div class="sb-not-ws"><div class="sb-not-ws-icon"></div><div class="sb-not-ws-name">Acme HQ</div></div><div class="sb-not-section">Workspace</div><div class="sb-not-item is-active"><button class="sb-not-toggle">▾</button><span class="sb-not-emoji">🚀</span><span class="sb-not-name">Roadmap</span></div><div class="sb-not-item"><button class="sb-not-toggle">▾</button><span class="sb-not-emoji">📋</span><span class="sb-not-name">Tasks</span></div><div class="sb-not-item"><button class="sb-not-toggle">▾</button><span class="sb-not-emoji">📚</span><span class="sb-not-name">Docs</span></div></aside>' +
      '</div>';
  };

  // ===== Menu pack =====
  P['components/menu-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:flex-start;justify-content:center;">' +
        '<div class="mn-ctx is-open" style="position:static;"><div class="mn-ctx-item"><span class="mn-ctx-ic">↻</span>Refresh<span class="mn-ctx-shortcut">⌘R</span></div><div class="mn-ctx-item"><span class="mn-ctx-ic">📋</span>Copy<span class="mn-ctx-shortcut">⌘C</span></div><div class="mn-ctx-divider"></div><div class="mn-ctx-item danger"><span class="mn-ctx-ic">🗑</span>Delete</div></div>' +
        '<div class="mn-seg"><button class="is-active">Comments</button><div class="mn-seg-divider"></div><button>Issues</button><div class="mn-seg-divider"></div><button>PRs</button></div>' +
        '<div class="mn-prof"><div class="mn-prof-head"><div class="mn-prof-avatar"></div><div><div class="mn-prof-name">Maria Rivera</div><div class="mn-prof-email">maria@acme.io</div></div></div><a class="mn-prof-item"><span class="mn-ctx-ic">👤</span>Profile<span class="mn-prof-kbd">⌘P</span></a><a class="mn-prof-item"><span class="mn-ctx-ic">⚙</span>Settings</a><div class="mn-prof-divider"></div><a class="mn-prof-item danger"><span class="mn-ctx-ic">⏏</span>Sign out</a></div>' +
      '</div>';
  };

  // ===== Settings pack =====
  P['components/settings-pack.css'] = function (target) {
    packGrid(target, [
      { label: 'integrations', html: '<div class="st-int-list" style="max-width:340px;width:100%;"><div class="st-int-row connected"><div class="st-int-logo"></div><div class="st-int-body"><b>Slack</b><p>Notifications</p></div><button class="st-int-toggle is-on"></button></div><div class="st-int-row"><div class="st-int-logo" style="background:linear-gradient(135deg,#f59e0b,#ef4444);"></div><div class="st-int-body"><b>Stripe</b><p>Payments</p></div><button class="st-int-toggle"></button></div></div>' },
      { label: 'appearance',  html: '<div class="st-appear" style="max-width:340px;"><button class="st-appear-opt" data-theme="light"><div class="st-appear-preview"></div><div class="st-appear-name">Light</div></button><button class="st-appear-opt is-picked" data-theme="dark"><div class="st-appear-preview"></div><div class="st-appear-name">Dark</div></button><button class="st-appear-opt"><div class="st-appear-preview"></div><div class="st-appear-name">System</div></button></div>' },
      { label: 'danger',      html: '<div class="st-card st-danger" style="max-width:340px;width:100%;"><h3>Danger zone</h3><div class="st-danger-row"><div><b>Delete account</b><p>Cannot be undone.</p></div><button class="st-danger-btn">Delete</button></div></div>' },
      { label: 'sessions',    html: '<div class="st-sess" style="max-width:380px;"><div class="st-sess-row"><div class="st-sess-ic">💻</div><div class="st-sess-info"><b>MacBook Pro</b><span>Chrome · San Francisco · now</span></div><span class="st-sess-current">Current</span></div></div>' }
    ], null, 320);
  };

  // ===== Billing pack =====
  P['components/billing-pack.css'] = function (target) {
    packGrid(target, [
      { label: 'invoice',   html: '<div class="bl-inv" style="max-width:480px;width:100%;"><div class="bl-inv-ic">📄</div><div><div class="bl-inv-name">Pro plan · Aug 2024</div><div class="bl-inv-date">Aug 1, 2024</div></div><div class="bl-inv-status">Paid</div><div class="bl-inv-amt">$29.00</div><button class="bl-inv-dl">↓</button></div>' },
      { label: 'payment',   html: '<div class="bl-pm" style="max-width:380px;"><div class="bl-pm-card"></div><div><div class="bl-pm-name">•••• 4242</div><div class="bl-pm-exp">Expires 12/26</div></div><span class="bl-pm-default">Default</span><button class="bl-pm-x">×</button></div>' },
      { label: 'plan',      html: '<div class="bl-plan" style="max-width:300px;"><div class="bl-plan-name">Pro</div><div class="bl-plan-price">$29<small>/mo</small></div><ul class="bl-plan-feats"><li>Unlimited projects</li><li>Priority support</li><li>Advanced analytics</li></ul><button class="bl-plan-cta">Upgrade</button></div>' },
      { label: 'usage',     html: '<div class="bl-use" style="max-width:300px;"><div class="bl-use-head"><div class="bl-use-label">API calls</div><div class="bl-use-pct">72%</div></div><div class="bl-use-bar"><i style="--p:72%"></i></div><div class="bl-use-foot"><span>72,000 used</span><span>of 100,000</span></div></div>' },
      { label: 'credit',    html: '<div class="bl-credit" style="max-width:280px;"><div class="bl-credit-ic">💰</div><div><div class="bl-credit-amt">$48.20</div><div class="bl-credit-label">Account credit</div></div></div>' },
      { label: 'addon',     html: '<div class="bl-addon is-on" style="max-width:340px;"><div><div class="bl-addon-name">Extra storage</div><div class="bl-addon-desc">100 GB monthly</div></div><div class="bl-addon-price">$5<span>/mo</span></div><button class="bl-addon-toggle"></button></div>' }
    ], null, 320);
  };

  // ===== Pricing tables pack =====
  P['components/pricing-tables-pack.css'] = function (target) {
    target.innerHTML =
      '<div class="pr-tier" style="max-width:780px;">' +
        '<div class="pr-tier-card"><div class="pr-tier-name">Free</div><div class="pr-tier-desc">For trying things out</div><div class="pr-tier-price">$0<small>/mo</small></div><ul class="pr-tier-feats"><li>3 projects</li><li>Community support</li></ul><button class="pr-tier-cta">Get started</button></div>' +
        '<div class="pr-tier-card featured"><div class="pr-tier-name">Pro</div><div class="pr-tier-desc">For growing teams</div><div class="pr-tier-price">$29<small>/mo</small></div><ul class="pr-tier-feats"><li>Unlimited projects</li><li>Priority support</li><li>Advanced analytics</li></ul><button class="pr-tier-cta">Upgrade</button></div>' +
        '<div class="pr-tier-card"><div class="pr-tier-name">Enterprise</div><div class="pr-tier-desc">For large orgs</div><div class="pr-tier-price">Custom</div><ul class="pr-tier-feats"><li>SSO + SCIM</li><li>SLA</li><li>Dedicated rep</li></ul><button class="pr-tier-cta">Contact us</button></div>' +
      '</div>';
  };

  // ===== Header pack =====
  P['components/header-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:1rem;max-width:680px;width:100%;">' +
        '<div class="hd-trans is-stuck" style="position:relative;"><div class="hd-trans-logo">Apollo</div><nav class="hd-trans-nav"><a>Features</a><a>Pricing</a><a>Docs</a></nav><div class="hd-trans-actions"><button style="padding:0.4rem 0.8rem;background:rgba(255,255,255,0.08);color:#fff;border:0;border-radius:6px;cursor:pointer;font-weight:600;font-size:0.85rem;">Sign in</button></div></div>' +
        '<div class="hd-cent"><nav class="hd-cent-nav-l"><a>Shop</a><a>Story</a></nav><div class="hd-cent-logo">AURORA</div><nav class="hd-cent-nav-r"><a>Cart</a><a>Account</a></nav></div>' +
        '<div class="hd-ann"><div class="hd-ann-strip"><b>20% off</b> all plans this weekend. <a>Get started →</a><button class="hd-ann-strip-x">×</button></div><div class="hd-ann-bar" style="padding:0.7rem 1.2rem;"><div style="font-weight:700;">Acme</div><nav style="display:flex;gap:1rem;margin-left:auto;font-size:0.88rem;"><a style="color:rgba(255,255,255,0.7);">Products</a><a style="color:rgba(255,255,255,0.7);">Pricing</a></nav></div></div>' +
      '</div>';
  };

  // ===== Footer pack 2 =====
  P['components/footer-pack-2.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:1rem;max-width:760px;width:100%;">' +
        '<footer class="ft-min" style="padding:1.4rem;"><div class="ft-min-logo">Aurora</div><div class="ft-min-links"><a>Privacy</a><a>Terms</a><a>Contact</a></div><div class="ft-min-copy">© 2024 Aurora Inc.</div></footer>' +
        '<footer class="ft-news"><h3 style="font-size:1.4rem;">Stay in the loop</h3><p>Get our monthly newsletter — no spam, ever.</p><form class="ft-news-form"><input type="email" placeholder="you@example.com"><button type="button">Subscribe</button></form></footer>' +
      '</div>';
  };

  // ===== Hero pack =====
  P['components/hero-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:1rem;max-width:780px;width:100%;">' +
        '<section class="hp hp-gradient-mesh" style="padding:2.4rem 1.4rem;min-height:240px;border-radius:14px;"><div style="text-align:center;"><h1 style="font-size:2rem;">Ship beautifully fast</h1><p style="margin:0 auto 1rem;">Aurora gives your team the design system from day one.</p><div class="hp-cta" style="justify-content:center;"><button class="hp-btn hp-btn-primary">Start free trial</button><button class="hp-btn hp-btn-ghost">View demo</button></div></div></section>' +
        '<section class="hp hp-kbd" style="padding:2rem 1.4rem;min-height:200px;border-radius:14px;"><div style="text-align:center;"><h1 style="font-size:1.8rem;">Find anything, instantly.</h1><div class="hp-kbd-search" style="margin:1rem auto 0;"><span style="color:rgba(255,255,255,0.4);">🔍</span><input placeholder="Search docs, settings, anything..."><kbd>⌘K</kbd></div></div></section>' +
      '</div>';
  };

  // ===== Marketing pack =====
  P['components/marketing-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:1.4rem;max-width:760px;width:100%;align-items:center;">' +
        '<div class="mkt-proof"><div class="mkt-proof-avatars"><div></div><div></div><div></div><div></div></div><span class="mkt-proof-stars">★★★★★</span><span class="mkt-proof-text"><b>4.9</b> · loved by 10k+ teams</span></div>' +
        '<div class="mkt-statbar"><div class="mkt-statbar-cell"><div class="mkt-statbar-val">10k+</div><div class="mkt-statbar-label">Teams</div></div><div class="mkt-statbar-cell"><div class="mkt-statbar-val">99.9%</div><div class="mkt-statbar-label">Uptime</div></div><div class="mkt-statbar-cell"><div class="mkt-statbar-val">$1.2B</div><div class="mkt-statbar-label">Processed</div></div></div>' +
        '<div class="mkt-feats" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:0.7rem;width:100%;"><div class="mkt-feat"><div class="mkt-feat-icon">⚡</div><div><div class="mkt-feat-title">Fast</div><div class="mkt-feat-desc">Under 100ms response.</div></div></div><div class="mkt-feat"><div class="mkt-feat-icon">🔒</div><div><div class="mkt-feat-title">Secure</div><div class="mkt-feat-desc">SOC 2 Type II.</div></div></div></div>' +
      '</div>';
  };

  // ===== Notifications pro =====
  P['feedback/notifications-pro.css'] = function (target) {
    packGrid(target, [
      { label: 'success', html: '<div class="np-alert np-alert-success" style="max-width:360px;"><div class="np-alert-icon">✓</div><div><h4>Saved!</h4><p>Your changes are live.</p></div><button class="np-alert-x">×</button></div>' },
      { label: 'warn',    html: '<div class="np-alert np-alert-warn" style="max-width:360px;"><div class="np-alert-icon">!</div><div><h4>Heads up</h4><p>Your subscription expires in 3 days.</p></div><button class="np-alert-x">×</button></div>' },
      { label: 'error',   html: '<div class="np-alert np-alert-error" style="max-width:360px;"><div class="np-alert-icon">×</div><div><h4>Failed</h4><p>Could not connect to server.</p></div><button class="np-alert-x">×</button></div>' },
      { label: 'info',    html: '<div class="np-alert np-alert-info" style="max-width:360px;"><div class="np-alert-icon">i</div><div><h4>FYI</h4><p>New feature: dark mode.</p></div><button class="np-alert-x">×</button></div>' },
      { label: 'row',     html: '<div class="np-row is-unread" style="max-width:360px;"><div class="np-row-avatar"></div><div class="np-row-body"><p><b>Maria</b> commented on your draft</p><div class="np-row-meta"><span class="np-row-time">2m ago</span><span class="np-row-tag">Project</span></div></div></div>' },
      { label: 'mention', html: '<div class="np-mention" style="max-width:360px;"><div class="np-mention-avatar"></div><div><div class="np-mention-head"><span class="np-mention-author">Lena</span><span class="np-mention-channel">#design</span><span class="np-mention-time">2m</span></div><div class="np-mention-body">Hey <mark>@you</mark> — can you review the new hero?</div></div></div>' }
    ], null, 340);
  };

  // ===== Feedback pack (Phase 17 watermelon) =====
  P['feedback/feedback-pack.css'] = function (target) {
    packGrid(target, [
      { label: 'reveal-copy', html: '<div class="fbk-revcopy" style="font-size:0.9rem;">SK-LIVE-3a2b1c8d-9f87-4321<span class="fbk-revcopy-hint">click</span></div>' },
      { label: 'emoji-row',   html: '<div class="fbk-emo"><button class="fbk-emo-btn is-picked">👍</button><button class="fbk-emo-btn">❤️</button><button class="fbk-emo-btn">🎉</button><button class="fbk-emo-btn">🚀</button><span class="fbk-emo-count">12</span></div>' },
      { label: 'banner',      html: '<div class="fbk-banup" style="max-width:340px;"><div class="fbk-banup-icon">↻</div><div class="fbk-banup-body"><b>Update available</b><small>v2.4.1 is ready to install</small></div><button class="fbk-banup-cta">Update</button><button class="fbk-banup-x">×</button></div>' },
      { label: 'coin',        html: '<div class="fbk-coin is-heads" style="cursor:pointer;"><div class="fbk-coin-inner"><div class="fbk-coin-face">H</div><div class="fbk-coin-face fbk-coin-back">T</div></div></div>' },
      { label: 'balloon',     html: '<div class="fbk-balloon">Try this!</div>' },
      { label: 'balloon-pink',html: '<div class="fbk-balloon fbk-balloon-pink">New</div>' },
      { label: 'qr',          html: '<div class="fbk-qr" style="max-width:200px;"><div class="fbk-qr-canvas"></div><div class="fbk-qr-label">SCAN ME</div></div>' }
    ], null, 240);
  };

  // ===== Game pack 2 =====
  P['feedback/game-pack-2.css'] = function (target) {
    var items = [];
    for (var i = 0; i < 16; i++) {
      var rarity = ['', '', 'is-rare', '', 'is-epic', '', 'is-legendary', '', '', 'is-mythic', '', ''][i % 12];
      items.push('<div class="gp-inv-cell ' + rarity + '"><div class="gp-inv-item" style="background:linear-gradient(135deg,hsl(' + (i*30) + ',70%,55%),hsl(' + (i*30+40) + ',70%,40%));"></div>' + (i % 3 === 0 ? '<span class="gp-inv-stack">' + (12 - i % 7) + '</span>' : '') + '</div>');
    }
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:1.2rem;align-items:center;max-width:680px;">' +
        '<div class="gp-inv">' + items.join('') + '</div>' +
        '<div class="gp-quest" style="max-width:340px;"><div class="gp-quest-title">Defeat the dragon<span class="gp-quest-reward">+500 XP</span></div><ul class="gp-quest-obj"><li class="done">Find the cave entrance</li><li class="done">Light all 4 torches</li><li>Slay the dragon</li></ul><div class="gp-quest-prog">2 of 3 complete</div></div>' +
        '<div class="gp-boss" style="max-width:500px;"><div class="gp-boss-head"><div class="gp-boss-name">Inferno</div><div class="gp-boss-rank">RANK S</div></div><div class="gp-boss-bar"><i style="--hp:64%"></i></div><div class="gp-boss-meta">12,840 / 20,000 HP</div></div>' +
        '<div style="display:flex;gap:1rem;align-items:center;"><div class="gp-cross"><div class="gp-cross-dot"></div></div><div class="gp-cross gp-cross-spread"></div><div class="gp-ammo"><span class="gp-ammo-now">28</span><span class="gp-ammo-sep">/</span><span class="gp-ammo-max">120</span></div></div>' +
      '</div>';
  };

  // ===== Code-tabs =====
  P['components/code-tabs.css'] = function (target) {
    target.innerHTML =
      '<div class="ctabs" style="max-width:540px;"><div class="ctabs-head"><button class="ctabs-tab is-active">JavaScript</button><button class="ctabs-tab">Python</button><button class="ctabs-tab">cURL</button><button class="ctabs-copy">⧉</button></div><div class="ctabs-panels"><pre class="ctabs-panel is-active"><code><span class="tok-kw">const</span> client = <span class="tok-kw">new</span> <span class="tok-fn">Aurora</span>(<span class="tok-str">"sk-..."</span>);\n<span class="tok-com">// Send a request</span>\nclient.<span class="tok-fn">send</span>({ to: <span class="tok-str">"hi"</span> });</code></pre></div></div>';
  };
  P['components/code-tabs.js'] = P['components/code-tabs.css'];

  // ===== Code-block pack =====
  P['components/code-block-pack.css'] = function (target) {
    var snippet = '<span class="kw">function</span> <span class="fn">greet</span>(<span class="var">name</span>) {\n  <span class="kw">return</span> <span class="str">`Hello, ${name}`</span>;\n}';
    var themes = ['', 'cb-blk-monokai', 'cb-blk-dracula', 'cb-blk-nord', 'cb-blk-one-dark', 'cb-blk-light', 'cb-blk-terminal'];
    var labels = ['github-dark', 'monokai', 'dracula', 'nord', 'one-dark', 'light', 'terminal'];
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:0.7rem;width:100%;max-width:560px;">' +
        themes.map(function (t, i) {
          return '<div class="cb-blk ' + t + '"><div class="cb-blk-head"><span class="cb-blk-lang">' + labels[i] + '</span><button class="cb-blk-copy">copy</button></div><pre><code>' + snippet + '</code></pre></div>';
        }).join('') +
      '</div>';
  };

  // ===== Accordion pack =====
  P['components/accordion-pack.css'] = function (target) {
    target.innerHTML =
      '<div class="ac" style="max-width:520px;width:100%;">' +
        '<div class="ac-item is-open"><div class="ac-q">What is Aurora?</div><div class="ac-a">Aurora is a design system + component library to ship faster.</div></div>' +
        '<div class="ac-item"><div class="ac-q">How does pricing work?</div><div class="ac-a">Free for personal, $29/mo for teams.</div></div>' +
        '<div class="ac-item"><div class="ac-q">Can I cancel anytime?</div><div class="ac-a">Yes — cancel from settings in two clicks.</div></div>' +
      '</div>';
  };

  // ===== Popover pack =====
  P['components/popover-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-wrap:wrap;gap:1.5rem;align-items:flex-start;justify-content:center;padding:1rem;">' +
        '<div class="pop">Quick tip: press <b>?</b> for shortcuts.</div>' +
        '<div class="pop-info">Your account uses 2-factor authentication.</div>' +
        '<div class="pop-hover" style="max-width:260px;"><div class="pop-hover-head"><div class="pop-hover-avatar"></div><button class="pop-hover-follow">Follow</button></div><div class="pop-hover-name">Maria Rivera</div><div class="pop-hover-handle">@maria</div><div class="pop-hover-bio">Engineer at Acme. I write tools and post stuff.</div><div class="pop-hover-stats"><span><b>248</b> following</span><span><b>2.1k</b> followers</span></div></div>' +
        '<div class="pop-conf"><h4>Delete?</h4><p>This action cannot be undone.</p><div class="pop-conf-actions"><button class="cancel">Cancel</button><button class="confirm">Delete</button></div></div>' +
      '</div>';
  };

  // ===== Callout pack =====
  P['components/callout-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:0.7rem;max-width:540px;width:100%;">' +
        '<div class="co co-note"><div><h4>Note</h4><p>This is the default note style.</p></div></div>' +
        '<div class="co co-tip"><div><h4>Tip</h4><p>Press <b>⌘K</b> to open the command palette.</p></div></div>' +
        '<div class="co co-warn"><div><h4>Warning</h4><p>Your trial expires in 3 days.</p></div></div>' +
        '<div class="co co-danger"><div><h4>Danger</h4><p>This action will permanently delete your account.</p></div></div>' +
        '<div class="co co-success"><div><h4>Success</h4><p>Profile updated successfully.</p></div></div>' +
      '</div>';
  };

  // ===== Empty states 2 =====
  P['components/empty-states-pack-2.css'] = function (target) {
    packGrid(target, [
      { label: 'no-results', html: '<div class="es2 es2-no-results" style="max-width:260px;"><div class="es2-icon"></div><h3 class="es2-title">No results</h3><p class="es2-desc">Try different keywords.</p></div>' },
      { label: 'inbox-zero', html: '<div class="es2 es2-inbox-zero" style="max-width:260px;"><div class="es2-icon"></div><h3 class="es2-title">All done!</h3><p class="es2-desc">Your inbox is clear.</p></div>' },
      { label: 'no-perm',    html: '<div class="es2 es2-no-perm" style="max-width:260px;"><div class="es2-icon"></div><h3 class="es2-title">Permission required</h3><p class="es2-desc">Ask an admin to grant access.</p></div>' }
    ], null, 280);
  };

  // ===== Loading pages =====
  P['components/loading-pages.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:1rem;max-width:680px;width:100%;">' +
        '<div class="lp-spin" style="min-height:160px;border-radius:14px;"><div class="lp-spin-ring"></div><div class="lp-spin-msg">Loading...</div></div>' +
        '<div class="lp-brand" style="min-height:200px;border-radius:14px;"><div class="lp-brand-logo">A</div><div class="lp-brand-name">Aurora</div><div class="lp-brand-dots"><i></i><i></i><i></i></div></div>' +
        '<div class="lp-pct" style="min-height:180px;border-radius:14px;"><div class="lp-pct-num">73%</div><div class="lp-pct-bar"><i style="--p:73%"></i></div><div class="lp-pct-label">Restoring backup...</div></div>' +
      '</div>';
  };

  // ===== Error pages =====
  P['components/error-pages.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:1rem;max-width:680px;width:100%;">' +
        '<div class="err-404" style="min-height:240px;border-radius:14px;"><div class="err-num">404</div><div class="err-title">Page not found</div><div class="err-desc">Sorry, we lost track of that page.</div></div>' +
      '</div>';
  };

  // ===== Onboarding pack =====
  P['components/onboarding-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:1rem;max-width:540px;width:100%;align-items:center;">' +
        '<div class="onb-welc" style="max-width:380px;"><div class="onb-welc-illus"></div><div class="onb-welc-body"><h2>Welcome to Aurora</h2><p>Let\'s get you set up in under a minute.</p><div class="onb-welc-cta"><button class="primary">Start tour</button><button class="ghost">Skip</button></div></div></div>' +
        '<div class="onb-launch"><div class="onb-launch-avatar">A</div><div>Take a 30s tour <b>of Aurora</b><span class="onb-launch-tag">NEW</span></div></div>' +
      '</div>';
  };

  // ===== Inline mega pack =====
  P['components/inline-mega-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:1.2rem;align-items:center;max-width:720px;width:100%;">' +
        '<div class="imp-dtabs"><button class="imp-dtabs-tab is-active">⚡ <span>All</span></button><button class="imp-dtabs-tab">📂</button><button class="imp-dtabs-tab">⭐</button><button class="imp-dtabs-tab">📊</button></div>' +
        '<div class="imp-xtool is-open"><button class="imp-xtool-trig">+</button><button class="imp-xtool-act">📝</button><button class="imp-xtool-act">📷</button><button class="imp-xtool-act">🎬</button></div>' +
        '<div class="imp-pricing" style="max-width:280px;"><div class="imp-pricing-toggle"><button>Monthly</button><button class="is-active">Yearly <span class="imp-pricing-toggle-save">-20%</span></button></div><div class="imp-pricing-price">$24<small>/mo</small></div></div>' +
      '</div>';
  };

  // ===== Whiteboard pack =====
  P['components/whiteboard-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:1rem;align-items:center;max-width:680px;">' +
        '<div class="wb-tools"><button class="wb-tool is-active">✏️</button><button class="wb-tool">⬚</button><button class="wb-tool">○</button><button class="wb-tool">↑</button><div class="wb-tools-divider"></div><button class="wb-tool">📝</button><button class="wb-tool">🖼</button><div class="wb-tools-divider"></div><button class="wb-tool">🗑</button></div>' +
        '<div style="display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;">' +
          '<div class="wb-sticky" style="position:static;">Important!</div>' +
          '<div class="wb-sticky wb-sticky-mint" style="position:static;">Meeting 3pm</div>' +
          '<div class="wb-sticky wb-sticky-cyan" style="position:static;">Ship Friday</div>' +
        '</div>' +
        '<div class="wb-clrs"><button class="wb-clr is-picked" style="--c:#8b5cf6;"></button><button class="wb-clr" style="--c:#ec4899;"></button><button class="wb-clr" style="--c:#06b6d4;"></button><button class="wb-clr" style="--c:#10b981;"></button><button class="wb-clr" style="--c:#f59e0b;"></button></div>' +
      '</div>';
  };

  // ===== Auth screens 2 =====
  P['components/auth-screens-2.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;">' +
        '<div class="au-login"><div class="au-login-head"><div class="au-login-logo"></div><h2>Welcome back</h2><div class="au-login-sub">Sign in to continue</div></div><div class="au-field"><label>Email</label><input value="you@example.com"></div><div class="au-field"><label>Password</label><input type="password" value="password"></div><div class="au-login-foot"><label class="au-login-remember"><input type="checkbox" checked>Remember me</label><a class="au-login-forgot">Forgot?</a></div><button class="au-cta">Sign in</button></div>' +
        '<div class="au-magic" style="max-width:320px;"><div class="au-magic-emoji">✉️</div><h3>Check your inbox</h3><p>We sent a magic link to</p><div class="au-magic-email">you@example.com</div><div class="au-magic-tip">⏱ Link expires in 10 min</div></div>' +
      '</div>';
  };

  // ===== AI watermelon pack =====
  P['ai/ai-watermelon-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:1rem;align-items:center;max-width:540px;width:100%;">' +
        '<div class="aiwm-voice"><button class="aiwm-voice-play">▶</button><div class="aiwm-voice-wave">' + Array.from({length:24},function(_,i){return '<i style="--bar-h:'+(20+Math.random()*60)+'%"></i>';}).join('') + '</div><div class="aiwm-voice-dur">0:42</div></div>' +
        '<div class="aiwm-ctxbar"><div class="aiwm-ctxbar-spark">✨</div><input class="aiwm-ctxbar-input" placeholder="Ask anything..."><span class="aiwm-ctxbar-shortcut">⌘K</span></div>' +
        '<div class="aiwm-think"><i></i><i></i><i></i></div>' +
        '<div class="aiwm-bubble">Hi! I can help you draft emails, summarize meetings, or write code. What would you like to do?<div class="aiwm-bubble-tools"><button class="aiwm-bubble-tool good">👍</button><button class="aiwm-bubble-tool bad">👎</button><button class="aiwm-bubble-tool">📋</button><button class="aiwm-bubble-tool">↻</button></div></div>' +
        '<div class="aiwm-sugg-row"><div class="aiwm-sugg">Draft an email</div><div class="aiwm-sugg">Summarize this</div><div class="aiwm-sugg">Translate</div><div class="aiwm-sugg">Explain code</div></div>' +
      '</div>';
  };

  // ===== Chatbot pack =====
  P['ai/chatbot-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;gap:1.4rem;align-items:flex-end;justify-content:center;flex-wrap:wrap;">' +
        '<div class="cbp-win is-open" style="position:static;width:340px;height:420px;"><div class="cbp-win-head"><div class="cbp-win-avatar"></div><div><div class="cbp-win-name">Aurora AI</div><div class="cbp-win-status">Online</div></div><button class="cbp-win-x">×</button></div><div class="cbp-win-body"><div class="cbp-msg bot">Hi! How can I help today?</div><div class="cbp-msg user">Can you summarize this article?</div><div class="cbp-msg bot">Sure — paste the text or link.</div></div><div class="cbp-win-foot"><input class="cbp-win-input" placeholder="Type message..."><button class="cbp-win-send">→</button></div></div>' +
      '</div>';
  };

  // ===== Quote blocks =====
  P['typography/quote-blocks.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:1rem;max-width:540px;width:100%;">' +
        '<div class="qb qb-bar">"The best designs are the ones we never see — they just work."<div class="qb-bar-author">Maria Rivera</div></div>' +
        '<div class="qb qb-pull">"Removing features is more powerful than adding them."</div>' +
        '<div class="qb qb-grad"><div class="qb-grad-body">Aurora cut our launch time in half.</div><div class="qb-grad-author">— Lena Park, CEO</div></div>' +
      '</div>';
  };

  // ===== Heading pack =====
  P['typography/heading-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:1.4rem;text-align:center;">' +
        '<h1 class="hp-grad">Build at light speed</h1>' +
        '<h1 class="hp-3d hp-3d-pink">RETRO</h1>' +
        '<h1 class="hp-out">HOLLOW</h1>' +
        '<h1 class="hp-mono">build.deploy</h1>' +
      '</div>';
  };

  // ===== Text pack 2 =====
  P['typography/text-pack-2.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-wrap:wrap;gap:1.2rem;justify-content:center;align-items:center;">' +
        '<div class="tp2 tp2-chrome" style="font-size:2rem;font-weight:800;">Chrome</div>' +
        '<div class="tp2 tp2-3d" style="font-size:2rem;font-weight:800;">RETRO</div>' +
        '<div class="tp2 tp2-3d-pink" style="font-size:2rem;font-weight:800;">PINK</div>' +
        '<div class="tp2 tp2-neon-deep" style="font-size:2rem;font-weight:800;">NEON</div>' +
        '<div class="tp2 tp2-etched tp2-etched-thick" style="font-size:2rem;font-weight:800;">ETCHED</div>' +
        '<div class="tp2 tp2-stencil" style="font-size:1.4rem;">STENCIL</div>' +
      '</div>';
  };

  // ===== Greece map (choropleth + pins, 4 layers) =====
  P['components/greece-map.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:0.9rem;align-items:center;width:100%;">' +
        '<div id="gmap-host" style="width:100%;max-width:720px;"></div>' +
        '<div style="display:flex;gap:0.4rem;flex-wrap:wrap;justify-content:center;font-family:ui-monospace,monospace;font-size:0.7rem;">' +
          '<span style="align-self:center;color:rgba(255,255,255,0.5);margin-right:0.4rem;">color scale:</span>' +
          '<button data-scale="coverage" class="dapp-btn is-on" style="padding:0.25rem 0.6rem;">coverage</button>' +
          '<button data-scale="heat"     class="dapp-btn"      style="padding:0.25rem 0.6rem;">heat</button>' +
          '<button data-scale="ocean"    class="dapp-btn"      style="padding:0.25rem 0.6rem;">ocean</button>' +
          '<button data-scale="mono"     class="dapp-btn"      style="padding:0.25rem 0.6rem;">mono</button>' +
          '<button data-scale="traffic"  class="dapp-btn"      style="padding:0.25rem 0.6rem;">traffic</button>' +
        '</div>' +
      '</div>';

    function go() {
      if (!window.GreeceMap) return;

      // Synthetic deterministic value per feature id
      function fakeCoverage(id) {
        var n = 0; for (var i = 0; i < id.length; i++) n = (n * 31 + id.charCodeAt(i)) >>> 0;
        return Math.round((0.18 + (n % 700) / 1000) * 100) / 100;
      }
      var allData = {};
      [
        window.GREECE_REGIONS,
        window.GREECE_PREFECTURES,
        window.GREECE_MUNICIPALITIES,
        window.GREECE_NEIGHBORHOODS
      ].forEach(function (arr) {
        (arr || []).forEach(function (f) { allData[f.id] = fakeCoverage(f.id); });
      });

      var inst = window.GreeceMap.init('#gmap-host', {
        title: 'Sample coverage (δείγμα κάλυψης)',
        mode: 'regions',
        data: allData,
        scale: 'coverage',
        valueLabel: 'coverage'
      });

      // A few real-city pins to demonstrate the lat/lng overlay
      inst.pin([
        { lat: 37.9838, lng: 23.7275, label: 'Athens',       color: '#ffd166', value: 0.92 },
        { lat: 40.6401, lng: 22.9444, label: 'Thessaloniki', color: '#ef476f', value: 0.78 },
        { lat: 35.3387, lng: 25.1442, label: 'Heraklion',    color: '#06d6a0', value: 0.63 },
        { lat: 39.6243, lng: 19.9217, label: 'Corfu',        color: '#118ab2', value: 0.41 },
        { lat: 37.4467, lng: 25.3289, label: 'Mykonos',      color: '#7b2cbf', value: 0.55 }
      ]);

      target.querySelectorAll('button[data-scale]').forEach(function (b) {
        b.addEventListener('click', function () {
          target.querySelectorAll('button[data-scale]').forEach(function (x) { x.classList.remove('is-on'); });
          b.classList.add('is-on');
          inst.setScale(b.dataset.scale);
        });
      });
    }

    if (window.GREECE_REGIONS && window.GreeceMap) { go(); return; }
    var s = document.createElement('script');
    s.src = '../components/greece-map-data.js';
    s.onload = go;
    document.head.appendChild(s);
  };

  // ===== Phase data-org previews =====
  P['components/gantt.js'] = function (target) {
    target.innerHTML = '<div class="pal-saas-indigo" style="width:100%;"><div class="gantt" id="gantt-demo"></div></div>';
    if (window.Gantt) window.Gantt.init('#gantt-demo', { periods:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], today:6, tasks:[
      { name:'Research', start:1, span:2, color:'accent2', progress:1 },
      { name:'Design', start:2, span:3, progress:.6 },
      { name:'Build', start:4, span:5, color:'ok', progress:.3 },
      { name:'QA', start:8, span:2, color:'warn' },
      { name:'Launch', start:10, milestone:true, color:'danger' }
    ]});
  };

  P['components/org-chart.css'] = function (target) {
    function n(t, s, accent) { return '<div class="org-node' + (accent ? ' org-node-accent' : '') + '"><span class="org-av"></span><div><b>' + t + '</b><small>' + s + '</small></div></div>'; }
    target.innerHTML = '<div class="pal-saas-indigo" style="width:100%;"><div class="org">' +
      '<ul><li>' + n('CEO', 'Dana Okafor', true) +
        '<ul>' +
          '<li>' + n('VP Eng', 'A. Rivera') + '<ul><li>' + n('Frontend', '3 reports') + '</li><li>' + n('Backend', '4 reports') + '</li></ul></li>' +
          '<li>' + n('VP Sales', 'M. Webb') + '<ul><li>' + n('AE Team', '6 reports') + '</li></ul></li>' +
          '<li>' + n('VP Design', 'P. Anand') + '</li>' +
        '</ul>' +
      '</li></ul></div></div>';
  };

  P['components/media-library.js'] = function (target) {
    target.innerHTML = '<div class="pal-saas-indigo" style="width:100%;max-width:760px;">' +
      '<div class="mlib" id="mlib-demo">' +
        '<div class="mlib-bar"><nav class="mlib-crumb"><a>Files</a><span>/</span><b>Marketing</b></nav><div class="mlib-tools"><input class="mlib-search" placeholder="Search…"><div class="mlib-view"><button class="is-on" data-view="grid">▦</button><button data-view="list">☰</button></div></div></div>' +
        '<div class="mlib-grid">' +
          '<div class="mlib-item"><div class="mlib-thumb mlib-folder"></div><div class="mlib-name">Brand assets</div><div class="mlib-meta">24 items</div></div>' +
          '<div class="mlib-item"><div class="mlib-thumb"></div><div class="mlib-name">hero-banner.jpg</div><div class="mlib-meta">2.4 MB</div></div>' +
          '<div class="mlib-item"><div class="mlib-thumb mlib-video"></div><div class="mlib-name">promo.mp4</div><div class="mlib-meta">18 MB</div></div>' +
          '<div class="mlib-item"><div class="mlib-thumb mlib-doc"></div><div class="mlib-name">brief.pdf</div><div class="mlib-meta">340 KB</div></div>' +
          '<div class="mlib-item"><div class="mlib-thumb"></div><div class="mlib-name">logo-dark.png</div><div class="mlib-meta">88 KB</div></div>' +
        '</div>' +
        '<div class="mlib-selbar"><span class="mlib-selcount">0 selected</span><div><button>Move</button><button class="mlib-danger">Delete</button></div></div>' +
      '</div><div style="margin-top:0.6rem;font-size:0.72rem;color:rgba(255,255,255,0.45);font-family:ui-monospace,monospace;">click to select · Ctrl/Cmd-click multi · ▦/☰ toggle · search filters</div></div>';
    if (window.MediaLibrary) window.MediaLibrary.init('#mlib-demo');
  };

  // ===== Phase saas-pages previews =====
  P['components/docs-layout.css'] = function (target) {
    target.innerHTML = '<div class="pal-saas-indigo" style="width:100%;background:var(--bg);border-radius:12px;overflow:hidden;border:1px solid var(--border);">' +
      '<div class="docs" style="padding:1.2rem;gap:1.5rem;">' +
        '<aside class="docs-nav"><div class="docs-nav-group"><h4>Start</h4><a>Introduction</a><a class="is-active">Installation</a><a>Quickstart</a></div><div class="docs-nav-group"><h4>Guides</h4><a>Auth</a><a>Webhooks</a></div></aside>' +
        '<main class="docs-main"><nav class="docs-crumb"><a>Docs</a> / <b>Installation</b></nav><article class="docs-prose"><h1>Installation</h1><p class="docs-lead">Running in under five minutes.</p><h2>Install via npm</h2><p>Add the package and import the client.</p><pre><code>npm install @nimbus/sdk</code></pre><div class="docs-callout note"><span class="docs-callout-ico">i</span><p>You need an API key first.</p></div><div class="docs-callout tip"><span class="docs-callout-ico">+</span><p>Use env vars for keys.</p></div></article>' +
        '<nav class="docs-pager"><a class="docs-prev"><small>Previous</small><b>Introduction</b></a><a class="docs-next"><small>Next</small><b>Quickstart</b></a></nav><div class="docs-helpful">Was this helpful? <button>up</button><button>dn</button></div></main>' +
        '<aside class="docs-toc"><h4>On this page</h4><a class="is-active">Install via npm</a><a>Verify</a></aside>' +
      '</div></div>';
  };

  P['components/roadmap.css'] = function (target) {
    target.innerHTML = '<div class="pal-saas-indigo" style="width:100%;"><div class="rm">' +
      '<div class="rm-col"><div class="rm-col-head"><span class="rm-status planned"></span>Planned <span class="rm-count">8</span></div>' +
        '<div class="rm-card"><button class="rm-vote"><span>▲</span>124</button><div><h4>Dark mode</h4><p>System-aware theme</p><div class="rm-tags"><span class="rm-tag">UI</span></div></div></div>' +
        '<div class="rm-card"><button class="rm-vote"><span>▲</span>89</button><div><h4>Slack integration</h4><p>Push alerts to channels</p></div></div></div>' +
      '<div class="rm-col"><div class="rm-col-head"><span class="rm-status progress"></span>In progress <span class="rm-count">3</span></div>' +
        '<div class="rm-card"><button class="rm-vote is-voted"><span>▲</span>211</button><div><h4>Booking flow</h4><p>Appointment scheduling</p><div class="rm-tags"><span class="rm-tag">Feature</span></div></div></div></div>' +
      '<div class="rm-col"><div class="rm-col-head"><span class="rm-status shipped"></span>Shipped <span class="rm-count">42</span></div>' +
        '<div class="rm-card"><button class="rm-vote"><span>▲</span>302</button><div><h4>CSV export</h4><p>Download any report</p><div class="rm-tags"><span class="rm-tag new">Shipped</span></div></div></div></div>' +
    '</div></div>';
  };

  P['components/status-page.css'] = function (target) {
    var comps = [['API','ok'],['Web app','ok'],['Email','degraded'],['CDN','ok']];
    var rows = comps.map(function (c) {
      var bars = ''; for (var i = 0; i < 90; i++) { var r = Math.random(); var cls = r > 0.985 ? 'down' : r > 0.96 ? 'degraded' : ''; bars += '<i class="' + cls + '"></i>'; }
      var label = c[1] === 'ok' ? 'Operational' : c[1] === 'degraded' ? 'Degraded' : 'Down';
      return '<div class="sts-row"><span class="sts-name">' + c[0] + '</span><span class="sts-state ' + c[1] + '">' + label + '</span><div class="sts-uptime">' + bars + '</div><div class="sts-uptime-legend"><span>90 days ago</span><span>' + (c[1] === 'ok' ? '99.99%' : '99.2%') + ' uptime</span><span>Today</span></div></div>';
    }).join('');
    target.innerHTML = '<div class="pal-saas-indigo" style="width:100%;"><div class="sts">' +
      '<div class="sts-banner ok"><span class="sts-banner-dot"></span> All systems operational</div>' +
      '<div class="sts-metrics"><div class="sts-metric"><b>99.98%</b><small>90-day uptime</small></div><div class="sts-metric"><b>184ms</b><small>avg response</small></div><div class="sts-metric"><b>0</b><small>active incidents</small></div></div>' +
      '<div class="sts-group">' + rows + '</div>' +
      '<div class="sts-incidents"><h3>Past incidents</h3><div class="sts-incident resolved"><div class="sts-incident-date">May 24, 2026</div><h4>Elevated API latency <span class="sts-pill resolved">Resolved</span></h4><p class="sts-incident-update"><b>Resolved</b> — DB failover caused ~12 min of latency. Recovered.</p></div></div>' +
    '</div></div>';
  };

  // ===== Phase flows-pro previews =====
  P['components/booking-flow.js'] = function (target) {
    target.innerHTML = '<div class="struct pal-saas-indigo" style="width:100%;display:flex;justify-content:center;"><div class="bk" id="bk-demo" style="width:100%;"></div></div>';
    if (window.BookingFlow) window.BookingFlow.init('#bk-demo', { services: [
      { id:'cut', name:'Haircut & style', duration:'45 min', price:'$40' },
      { id:'col', name:'Color', duration:'2 hr', price:'$120' },
      { id:'beard', name:'Beard trim', duration:'20 min', price:'$20' }
    ]});
  };

  P['components/survey-flow.js'] = function (target) {
    target.innerHTML = '<div class="struct pal-saas-indigo" style="width:100%;max-width:680px;"><div class="sv" id="sv-demo" style="max-width:none;"></div></div>';
    if (window.SurveyFlow) window.SurveyFlow.init('#sv-demo', { questions: [
      { type:'choice', q:'How did you hear about us?', options:['Search','A friend','Social media','An ad'] },
      { type:'rating', q:'How likely are you to recommend us?', max:5 },
      { type:'scale', q:'Rate your overall experience', min:0, max:10 },
      { type:'text', q:'Anything else we should know?', placeholder:'Optional…' }
    ]});
  };

  P['components/feedback-widget.js'] = function (target) {
    // Render the panel inline (not fixed) so it doesn't hijack the demo viewport
    target.innerHTML =
      '<div class="struct pal-saas-indigo" style="width:100%;display:flex;justify-content:center;">' +
        '<div class="fbw is-open" style="position:relative;right:auto;bottom:auto;">' +
          '<div class="fbw-panel" style="position:relative;bottom:auto;right:auto;opacity:1;visibility:visible;transform:none;width:340px;">' +
            '<div class="fbw-form"><div class="fbw-head"><h4>Send feedback</h4><button class="fbw-close">×</button></div>' +
            '<div class="fbw-emoji"><button>😞</button><button>😐</button><button class="is-sel">🙂</button><button>😍</button></div>' +
            '<div class="fbw-cats"><button class="fbw-cat">Bug</button><button class="fbw-cat is-sel">Idea</button><button class="fbw-cat">Praise</button></div>' +
            '<textarea class="fbw-text" placeholder="Tell us more…"></textarea>' +
            '<div class="fbw-row"><label class="fbw-shot">📷 Include screenshot</label></div>' +
            '<button class="fbw-submit">Send feedback</button></div>' +
          '</div>' +
        '</div>' +
      '</div><div style="text-align:center;margin-top:0.7rem;font-size:0.72rem;color:rgba(255,255,255,0.45);font-family:ui-monospace,monospace;">live: a corner FAB opens this · FeedbackWidget.init(...)</div>';
  };

  P['components/waitlist.css'] = function (target) {
    target.innerHTML = '<div class="struct pal-saas-indigo" style="width:100%;"><section class="wl" style="border-radius:16px;">' +
      '<div class="wl-in"><span class="wl-badge">Early access</span><h1 class="wl-title">Join the waitlist</h1>' +
      '<p class="wl-sub">Be first in line when we launch this spring.</p>' +
      '<form class="wl-form" onsubmit="return false"><input type="email" placeholder="you@email.com"><button>Get early access</button></form>' +
      '<div class="wl-avatars"><span></span><span></span><span></span><span></span><span class="wl-count">+2,481 joined</span></div>' +
      '</div></section></div>';
  };

  // ===== Phase chrome-pro previews =====
  P['components/headers-pro.js'] = function (target) {
    target.innerHTML =
      '<div class="struct pal-saas-indigo" style="width:100%;max-width:900px;background:var(--bg);border:1px solid var(--border);border-radius:12px;position:relative;overflow:hidden;">' +
        '<header class="hdr hdr-blur hdr-shrink is-scrolled" style="position:relative;">' +
          '<div class="hdr-inner"><a class="hdr-brand"><span class="hdr-dot"></span> Nimbus</a>' +
          '<nav class="hdr-nav"><a class="hdr-link is-active">Features</a>' +
          '<div class="hdr-mega is-open"><button class="hdr-link">Products ▾</button><div class="hdr-mega-panel" style="top:60px;">' +
            '<a class="hdr-mega-item"><span class="hdr-mega-ico">▦</span><span><b>Analytics</b><span>Real-time funnels</span></span></a>' +
            '<a class="hdr-mega-item"><span class="hdr-mega-ico">◷</span><span><b>Automations</b><span>No-code flows</span></span></a>' +
            '<a class="hdr-mega-item"><span class="hdr-mega-ico">✦</span><span><b>AI</b><span>Ask anything</span></span></a>' +
          '</div></div><a class="hdr-link">Pricing</a></nav>' +
          '<div class="hdr-actions"><button class="hdr-cmdk">Search <kbd>⌘K</kbd></button><a class="hdr-btn">Sign up</a></div></div>' +
          '<div class="hdr-progress"><i style="--p:.4"></i></div>' +
        '</header>' +
        '<div style="padding:1.4rem;color:var(--muted);font-size:0.82rem;font-family:ui-monospace,monospace;">scroll-aware: hide-on-scroll · shrink · blur · scroll-spy · ⌘K — see structure/dashboard or saas pages for live scroll behavior</div>' +
      '</div>';
    if (window.HeaderKit) window.HeaderKit.init(target.querySelector('.hdr'), { blurAt: 9999 });
  };

  P['components/footers-pro.css'] = function (target) {
    target.innerHTML =
      '<div class="struct pal-saas-indigo" style="width:100%;max-width:900px;display:flex;flex-direction:column;gap:1rem;">' +
        '<footer class="ftx ftx-giant" style="border-radius:12px;overflow:hidden;border:1px solid var(--border);"><div class="ftx-in"><div class="ftx-word">Nimbus</div><div class="ftx-bottom" style="margin-top:0.5rem;"><span>© 2026 Nimbus, Inc.</span><div class="ftx-social"><a>x</a><a>in</a><a>gh</a></div></div></div></footer>' +
        '<footer class="ftx ftx-bento" style="border-radius:12px;overflow:hidden;border:1px solid var(--border);"><div class="ftx-in"><div class="ftx-grid">' +
          '<div class="ftx-tile span-2"><h4>Newsletter</h4><div style="font-size:.9rem;color:var(--muted);">Product news, monthly.</div><div class="ftx-input"><input placeholder="you@email.com"><button>Join</button></div></div>' +
          '<div class="ftx-tile"><h4>Product</h4><a style="display:block;color:var(--muted);font-size:.85rem;">Features</a><a style="display:block;color:var(--muted);font-size:.85rem;">Pricing</a></div>' +
          '<div class="ftx-tile"><h4>Social</h4><div class="ftx-social"><a>x</a><a>in</a></div></div>' +
        '</div></div></footer>' +
        '<div style="font-size:0.75rem;color:rgba(255,255,255,0.5);font-family:ui-monospace,monospace;">also: .ftx-reveal (sticky scroll-to-uncover), .ftx-marquee, .ftx-aurora, .ftx-contact, .ftx-minimal</div>' +
      '</div>';
  };

  P['components/sidebar-nav.js'] = function (target) {
    target.innerHTML =
      '<div class="struct pal-saas-indigo" style="width:100%;max-width:560px;border:1px solid var(--border);border-radius:12px;overflow:hidden;">' +
        '<aside class="snav" id="snav-demo" style="position:relative;height:340px;">' +
          '<div class="snav-header"><span class="snav-brand"><span class="snav-dot"></span><span class="snav-label">Nimbus</span></span><button class="snav-toggle">«</button></div>' +
          '<nav class="snav-body"><div class="snav-section"><span class="snav-label">Main</span></div>' +
            '<a class="snav-item is-active" data-tip="Overview"><span class="snav-ico"></span><span class="snav-label">Overview</span></a>' +
            '<a class="snav-item" data-tip="Analytics"><span class="snav-ico"></span><span class="snav-label">Analytics</span></a>' +
            '<a class="snav-item" data-tip="Customers"><span class="snav-ico"></span><span class="snav-label">Customers</span></a>' +
            '<div class="snav-group is-open"><button class="snav-item snav-group-trigger" data-tip="Settings"><span class="snav-ico"></span><span class="snav-label">Settings</span><span class="snav-caret">›</span></button><div class="snav-group-items"><a class="snav-item snav-sub"><span class="snav-label">Profile</span></a><a class="snav-item snav-sub"><span class="snav-label">Billing</span></a></div></div>' +
          '</nav>' +
          '<div class="snav-footer"><a class="snav-item"><span class="snav-ico snav-av"></span><span class="snav-label">Maria O.</span></a></div>' +
        '</aside>' +
      '</div><div style="margin-top:0.6rem;font-size:0.75rem;color:rgba(255,255,255,0.5);font-family:ui-monospace,monospace;">click « to collapse to icon-rail (hover icons for tooltips)</div>';
    if (window.SidebarNav) window.SidebarNav.init('#snav-demo');
  };

  P['components/page-header.css'] = function (target) {
    target.innerHTML =
      '<div class="struct pal-saas-indigo" style="width:100%;max-width:820px;background:var(--bg);border:1px solid var(--border);border-radius:12px;overflow:hidden;">' +
        '<header class="pgh pgh-bordered">' +
          '<nav class="pgh-breadcrumb"><a>Projects</a><span>/</span><a>Acme</a><span>/</span><b>Settings</b></nav>' +
          '<div class="pgh-bar"><div class="pgh-titlewrap"><span class="pgh-avatar"></span><div><h1 class="pgh-title">Acme Inc. <span class="pgh-badge">Pro</span></h1><p class="pgh-sub">Manage your team and billing</p></div></div>' +
          '<div class="pgh-actions"><button class="pgh-btn pgh-btn-ghost">Invite</button><button class="pgh-btn">New project</button></div></div>' +
          '<nav class="pgh-tabs"><a class="is-active">Overview</a><a>Activity</a><a>Members</a><a>Settings</a></nav>' +
        '</header>' +
      '</div>';
  };

  // ===== Dashboard widgets preview =====
  P['components/dashboard-widgets.js'] = function (target) {
    target.innerHTML =
      '<div class="struct pal-saas-indigo" style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.9rem;width:100%;max-width:840px;background:var(--bg);padding:1rem;border-radius:14px;">' +
        '<div class="dw dw-metric"><div class="dw-metric-label">Revenue</div><div class="dw-metric-row"><div class="dw-metric-value" data-countup data-prefix="$">128400</div><div class="dw-spark" data-spark="8,9,7,11,10,13,12,15,14,18"></div></div><div style="margin-top:0.5rem;"><span class="dw-delta dw-delta-up">24%</span></div></div>' +
        '<div class="dw dw-goal-ring"><div class="dw-head"><h3 class="dw-title">Goal</h3></div><div class="dw-ring" data-p="72"><div class="dw-ring-label">72%</div></div></div>' +
        '<div class="dw dw-live"><div class="dw-live-pulse"></div><div><div class="dw-live-num" data-countup>284</div><div class="dw-live-label">active now</div></div></div>' +
        '<div class="dw dw-toplist" style="grid-column:span 2;"><div class="dw-head"><h3 class="dw-title">Top pages</h3></div>' +
          '<div class="dw-top"><span class="dw-top-name">/pricing</span><span class="dw-top-val">8,240</span><span class="dw-top-bar"><i style="--p:100%"></i></span></div>' +
          '<div class="dw-top"><span class="dw-top-name">/features</span><span class="dw-top-val">6,110</span><span class="dw-top-bar"><i style="--p:74%"></i></span></div>' +
          '<div class="dw-top"><span class="dw-top-name">/docs</span><span class="dw-top-val">3,200</span><span class="dw-top-bar"><i style="--p:39%"></i></span></div>' +
        '</div>' +
        '<div class="dw dw-status"><div class="dw-head"><h3 class="dw-title">Status</h3></div><div class="dw-status-grid" style="grid-template-columns:1fr;">' +
          '<div class="dw-svc up"><span class="dw-svc-dot"></span>API <small>99.9%</small></div><div class="dw-svc deg"><span class="dw-svc-dot"></span>Email</div></div></div>' +
      '</div>' +
      '<div style="margin-top:0.8rem;font-size:0.75rem;color:rgba(255,255,255,0.5);font-family:ui-monospace,monospace;">full page → <a href="../structure/dashboard.html" target="_blank" style="color:#7c5cff;">structure/dashboard.html</a></div>';
    if (window.DashboardWidgets) window.DashboardWidgets.initAll();
  };

  // ===== Colors previews =====
  P['colors/palettes.css'] = function (target) {
    var pals = ['pal-fintech-navy','pal-saas-indigo','pal-luxe-black-gold','pal-wealth-emerald','pal-wellness-teal','pal-energy-volt','pal-web3-violet','pal-cyberpunk','pal-neon-night','pal-forest','pal-sunset-coast','pal-mocha','pal-clean-light','pal-medical-blue','pal-espresso-cream','pal-blush-rose','pal-spa-sage','pal-fresh-citrus'];
    target.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:0.8rem;width:100%;max-width:1100px;">' +
      pals.map(function (p) {
        return '<div class="' + p + '" style="background:var(--bg);color:var(--fg);border:1px solid var(--border);border-radius:12px;padding:0.9rem;">' +
          '<div style="font:600 0.68rem ui-monospace;color:var(--faint);letter-spacing:.04em;margin-bottom:0.6rem;">.' + p + '</div>' +
          '<div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:0.6rem 0.7rem;margin-bottom:0.6rem;"><div style="font-weight:600;font-size:0.85rem;">Aa Headline</div><div style="color:var(--muted);font-size:0.72rem;">Secondary copy</div></div>' +
          '<div style="display:flex;gap:0.4rem;align-items:center;">' +
            '<span style="background:var(--accent);color:var(--on-accent);font-size:0.7rem;font-weight:600;padding:0.3rem 0.6rem;border-radius:7px;">Primary</span>' +
            '<span style="width:13px;height:13px;border-radius:50%;background:var(--accent-2);"></span>' +
            '<span style="width:11px;height:11px;border-radius:50%;background:var(--ok);"></span>' +
            '<span style="width:11px;height:11px;border-radius:50%;background:var(--warn);"></span>' +
            '<span style="width:11px;height:11px;border-radius:50%;background:var(--danger);"></span>' +
            '<span style="width:11px;height:11px;border-radius:50%;background:var(--info);"></span>' +
          '</div>' +
        '</div>';
      }).join('') +
      '</div><div style="margin-top:1rem;font-size:0.75rem;color:rgba(255,255,255,0.5);font-family:ui-monospace,monospace;">50 total · apply any <b>.pal-*</b> on a <b>.struct</b> page to re-theme · see color.skill.md for industry/mood mapping</div>';
  };

  P['colors/scales.css'] = function (target) {
    var hues = ['slate','zinc','stone','red','orange','amber','yellow','lime','green','emerald','teal','cyan','sky','blue','indigo','violet','purple','fuchsia','pink','rose'];
    var steps = ['50','100','200','300','400','500','600','700','800','900'];
    target.innerHTML = '<div style="width:100%;max-width:900px;font-family:ui-monospace,monospace;">' +
      hues.map(function (h) {
        return '<div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.35rem;">' +
          '<span style="width:62px;font-size:0.72rem;color:rgba(255,255,255,0.6);">' + h + '</span>' +
          '<div style="display:flex;flex:1;border-radius:6px;overflow:hidden;">' +
            steps.map(function (s) { return '<div style="flex:1;height:26px;background:var(--' + h + '-' + s + ');"></div>'; }).join('') +
          '</div></div>';
      }).join('') +
      '<div style="margin-top:0.8rem;font-size:0.72rem;color:rgba(255,255,255,0.5);">17 hue ramps + slate/zinc/stone neutrals · 50→900 · use <b>var(--blue-600)</b> etc. to build a palette</div>' +
      '</div>';
  };

  // ===== Phase essentials previews =====
  P['components/toc.css'] = function (target) {
    target.innerHTML =
      '<nav class="toc" style="position:static;max-width:240px;">' +
        '<div class="toc-title">On this page</div>' +
        '<ul class="toc-list">' +
          '<li><a class="toc-link" href="#">Getting started</a></li>' +
          '<li><a class="toc-link is-active" href="#">Installation</a><ul class="toc-list"><li><a class="toc-link" href="#">Requirements</a></li><li><a class="toc-link" href="#">Setup</a></li></ul></li>' +
          '<li><a class="toc-link" href="#">Configuration</a></li>' +
          '<li><a class="toc-link" href="#">API reference</a></li>' +
        '</ul>' +
      '</nav>' +
      '<div style="margin-top:1rem;font-size:0.72rem;color:rgba(255,255,255,0.45);font-family:ui-monospace,monospace;">Toc.init scrolls + highlights live on a real page</div>';
  };

  P['components/reading-aids.css'] = function (target) {
    target.innerHTML =
      '<div style="position:relative;width:100%;max-width:520px;height:200px;background:#0e0e16;border:1px solid rgba(255,255,255,0.1);border-radius:12px;overflow:hidden;">' +
        '<div class="ra-bar ra-bar-glow" style="position:absolute;"><i style="--p:0.42"></i></div>' +
        '<div style="padding:1.6rem;color:rgba(255,255,255,0.6);font-size:0.85rem;">Article body… the bar at the top fills as you scroll; the button appears bottom-right after scrolling.</div>' +
        '<button class="ra-top is-on" style="position:absolute;">↑</button>' +
      '</div>';
  };

  P['components/share-buttons.js'] = function (target) {
    var X = '<svg viewBox="0 0 24 24"><path d="M18.9 1.2h3.7l-8 9.1 9.4 12.5h-7.4l-5.8-7.6-6.6 7.6H.5l8.5-9.8L0 1.2h7.6l5.2 6.9z"/></svg>';
    var FB = '<svg viewBox="0 0 24 24"><path d="M14 8h3V4h-3c-2.2 0-4 1.8-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8c0-.6.4-1 1-1z"/></svg>';
    var LI = '<svg viewBox="0 0 24 24"><path d="M4 4h4v16H4zM6 2a2 2 0 100 4 2 2 0 000-4zM10 9h4v2c.6-1 2-2 4-2 3 0 4 2 4 5v6h-4v-5c0-1.5-.5-2.5-2-2.5S14 14 14 15.5V20h-4z"/></svg>';
    var WA = '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 00-8.5 15.3L2 22l4.8-1.5A10 10 0 1012 2z"/></svg>';
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:1rem;align-items:center;">' +
        '<div class="shb shb-round" id="shb-a"><button class="shb-btn shb-x" data-share="x">' + X + '</button><button class="shb-btn shb-facebook" data-share="facebook">' + FB + '</button><button class="shb-btn shb-linkedin" data-share="linkedin">' + LI + '</button><button class="shb-btn shb-whatsapp" data-share="whatsapp">' + WA + '</button></div>' +
        '<div class="shb shb-labeled shb-pill" id="shb-b"><button class="shb-btn shb-copy" data-share="copy"><span class="shb-label">Copy link</span></button><button class="shb-btn shb-email" data-share="email"><span class="shb-label">Email</span></button><button class="shb-btn shb-native" data-share="native"><span class="shb-label">Share</span></button></div>' +
      '</div>';
    if (window.ShareButtons) window.ShareButtons.init('#shb-a'), window.ShareButtons.init('#shb-b');
  };

  P['components/dialog.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;gap:0.6rem;flex-wrap:wrap;justify-content:center;">' +
        '<button class="dapp-btn" id="dlg-confirm">Dialog.confirm</button>' +
        '<button class="dapp-btn" id="dlg-alert">Dialog.alert</button>' +
        '<button class="dapp-btn" id="dlg-prompt">Dialog.prompt</button>' +
        '<button class="dapp-btn" id="dlg-danger">Danger confirm</button>' +
      '</div><div id="dlg-out" style="text-align:center;margin-top:1rem;font-family:ui-monospace,monospace;font-size:0.8rem;color:rgba(255,255,255,0.55);">resolved value appears here →</div>';
    var out = target.querySelector('#dlg-out');
    function show(v) { out.textContent = 'resolved: ' + JSON.stringify(v); }
    if (window.Dialog) {
      target.querySelector('#dlg-confirm').onclick = function () { Dialog.confirm({ title: 'Publish changes?', message: 'They go live immediately.' }).then(show); };
      target.querySelector('#dlg-alert').onclick = function () { Dialog.alert({ title: 'Saved', message: 'Your changes are live.' }).then(function(){ show('(ok)'); }); };
      target.querySelector('#dlg-prompt').onclick = function () { Dialog.prompt({ title: 'Rename', value: 'untitled', placeholder: 'New name' }).then(show); };
      target.querySelector('#dlg-danger').onclick = function () { Dialog.confirm({ title: 'Delete project?', message: "This can't be undone.", danger: true, okText: 'Delete' }).then(show); };
    }
  };

  P['components/menubar.js'] = function (target) {
    target.innerHTML =
      '<div class="mbar" id="mbar-demo">' +
        '<div class="mbar-menu"><button class="mbar-trigger">File</button><div class="mbar-dropdown"><button class="mbar-item">New<span class="mbar-kbd">⌘N</span></button><button class="mbar-item">Open…<span class="mbar-kbd">⌘O</span></button><button class="mbar-item mbar-checked" data-toggle>Auto-save</button><div class="mbar-sep"></div><button class="mbar-item mbar-danger">Delete project</button></div></div>' +
        '<div class="mbar-menu"><button class="mbar-trigger">Edit</button><div class="mbar-dropdown"><button class="mbar-item">Undo<span class="mbar-kbd">⌘Z</span></button><button class="mbar-item">Redo<span class="mbar-kbd">⇧⌘Z</span></button><div class="mbar-sep"></div><button class="mbar-item">Cut</button><button class="mbar-item">Copy</button><button class="mbar-item">Paste</button></div></div>' +
        '<div class="mbar-menu"><button class="mbar-trigger">View</button><div class="mbar-dropdown"><button class="mbar-item mbar-checked" data-toggle>Sidebar</button><button class="mbar-item">Zoom in<span class="mbar-kbd">⌘+</span></button><button class="mbar-item">Zoom out<span class="mbar-kbd">⌘−</span></button></div></div>' +
        '<div class="mbar-menu"><button class="mbar-trigger">Help</button><div class="mbar-dropdown"><button class="mbar-item">Docs</button><button class="mbar-item">Shortcuts</button></div></div>' +
      '</div><div style="margin-top:0.8rem;font-size:0.72rem;color:rgba(255,255,255,0.45);font-family:ui-monospace,monospace;text-align:center;">click File, then hover Edit/View · arrow keys navigate</div>';
    if (window.Menubar) window.Menubar.init('#mbar-demo');
  };

  P['components/scroll-area.js'] = function (target) {
    function lines(n) { var s = ''; for (var i = 1; i <= n; i++) s += '<p style="margin:0 0 10px;color:rgba(255,255,255,0.7);">Item ' + i + ' — scrollable row</p>'; return s; }
    target.innerHTML =
      '<div style="display:flex;gap:1.5rem;flex-wrap:wrap;justify-content:center;">' +
        '<div><div style="font-size:0.7rem;color:rgba(255,255,255,0.45);font-family:ui-monospace,monospace;margin-bottom:0.4rem;">.sa-thin .sa-fade</div><div class="sa sa-thin sa-fade" id="sa-a" style="height:220px;width:240px;background:#14141d;border:1px solid #2a2a3a;border-radius:12px;padding:14px;">' + lines(14) + '</div></div>' +
        '<div><div style="font-size:0.7rem;color:rgba(255,255,255,0.45);font-family:ui-monospace,monospace;margin-bottom:0.4rem;">.sa-accent (always-on bar)</div><div class="sa sa-accent" style="height:220px;width:240px;background:#14141d;border:1px solid #2a2a3a;border-radius:12px;padding:14px;">' + lines(14) + '</div></div>' +
      '</div>';
    if (window.ScrollArea) window.ScrollArea.init('#sa-a');
  };

  // ===== Phase wave2-uiverse previews =====
  P['blocks/loaders-uiverse.css'] = function (target) {
    var v = ['conic-glow','gradient-orbit','neon-bars','dual-conic','comet','ripple-radar','glow-orb','segment-clock','three-body','liquid-circle','infinity','square-morph','gradient-trail','pulse-grid','helix-dots'];
    target.innerHTML = '<div style="display:flex;gap:2rem;flex-wrap:wrap;align-items:center;justify-content:center;padding:1.5rem;background:#0a0a12;border-radius:12px;">' +
      v.map(function (x) {
        var inner = x === 'pulse-grid' ? '<span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>'
                  : (x === 'neon-bars' || x === 'three-body' || x === 'helix-dots') ? '<i></i>' : '';
        return '<div style="display:flex;flex-direction:column;align-items:center;gap:0.6rem;width:80px;"><div class="uload uload-' + x + '">' + inner + '</div><span style="font-size:0.6rem;color:rgba(255,255,255,0.4);font-family:ui-monospace,monospace;">' + x + '</span></div>';
      }).join('') + '</div>';
  };

  P['blocks/inputs-uiverse.css'] = function (target) {
    target.innerHTML = '<div style="display:flex;flex-direction:column;gap:1rem;width:100%;max-width:360px;padding:1rem;background:#0a0a12;border-radius:12px;">' +
      '<label class="uinp uinp-neon" style="width:100%;"><input placeholder="Neon focus — click me"></label>' +
      '<div class="uinp uinp-gradient-border" style="width:100%;"><input placeholder="Gradient border (focus)"></div>' +
      '<label class="uinp uinp-underline-grow" style="width:100%;"><input placeholder="Underline grows from center"></label>' +
      '<label class="uinp uinp-float-glow" style="width:100%;"><input placeholder=" "><span>Floating label</span></label>' +
      '<label class="uinp uinp-glass" style="width:100%;"><input placeholder="Glass"></label>' +
      '<label class="uinp uinp-pill-glow" style="width:100%;"><input placeholder="Pill glow"></label>' +
    '</div>';
  };

  P['blocks/cards-uiverse.css'] = function (target) {
    var v = [['glow-border','Glow border','Gradient ring.'],['conic-border','Conic border','Rotating outline.'],['shine','Shine','Sweep on hover.'],['glow-hover','Glow hover','Radial glow.'],['neon','Neon','Outlined glow.'],['glass','Glass','Frosted.'],['spotlight','Spotlight','Top focus.'],['holo','Holo foil','Animated.'],['corner-peel','Corner peel','Folded corner.'],['lift','Lift','Deep shadow.']];
    target.innerHTML = '<div style="display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;padding:1rem;">' +
      v.map(function (c) { return '<article class="ucard ucard-' + c[0] + '" style="width:200px;min-height:120px;"><h3>' + c[1] + '</h3><p>' + c[2] + '</p></article>'; }).join('') +
    '</div>';
  };

  // ===== Phase eshop-pro previews =====
  P['components/product-cards-pro.css'] = function (target) {
    function card(opts) {
      return '<article class="ppc ' + (opts.cls || '') + '" style="width:230px;">' +
        '<div class="ppc-media">' + (opts.badge || '') + '<button class="ppc-wish ' + (opts.wish ? 'is-on' : '') + '"></button><button class="ppc-quick">' + (opts.quick || 'Quick add +') + '</button></div>' +
        '<div class="ppc-body"><div class="ppc-brand">' + opts.brand + '</div><h3 class="ppc-name">' + opts.name + '</h3>' +
        (opts.rating ? '<div class="ppc-rating"><span class="ppc-stars" style="--r:' + opts.rating + '"></span><span>' + opts.rev + '</span></div>' : '') +
        '<div class="ppc-price"><span class="ppc-now">' + opts.now + '</span>' + (opts.was ? '<span class="ppc-was">' + opts.was + '</span>' : '') + '</div>' +
        (opts.swatch ? '<div class="ppc-swatches"><i style="--c:#111" class="is-on"></i><i style="--c:#c44"></i><i style="--c:#46a"></i></div>' : '') +
        (opts.stock ? '<div class="ppc-stock">Only 3 left</div>' : '') +
        '</div></article>';
    }
    target.innerHTML = '<div style="display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;">' +
      card({ brand: 'Aura', name: 'Gen 3 Headphones', rating: 4.5, rev: '(2.4k)', now: '$349', was: '$499', swatch: 1, wish: 1, badge: '<span class="ppc-badge ppc-badge-sale">-30%</span>' }) +
      card({ brand: 'Lumen', name: 'Desk Lamp Pro', rating: 5, rev: '(311)', now: '$89', stock: 1, badge: '<span class="ppc-badge ppc-badge-new">New</span>' }) +
      card({ cls: 'is-soldout', brand: 'Marrow', name: 'Leather Tote', now: '$220', quick: 'Notify me', badge: '<span class="ppc-badge ppc-badge-soldout">Sold out</span>' }) +
    '</div>';
  };

  P['components/product-detail.css'] = function (target) {
    target.innerHTML =
      '<div class="pdt" style="background:#0e0e16;padding:1.4rem;border-radius:16px;max-width:860px;">' +
        '<div class="pdt-gallery"><div class="pdt-main">main image</div><div class="pdt-thumbs"><div class="pdt-thumb is-on"></div><div class="pdt-thumb"></div><div class="pdt-thumb"></div></div></div>' +
        '<div class="pdt-info">' +
          '<div class="pdt-brand">Aura Audio</div><h1 class="pdt-title">Gen 3 Headphones</h1>' +
          '<div class="pdt-rating"><span class="stars">★★★★★</span> 4.8 · 2,400 reviews</div>' +
          '<div class="pdt-price"><span class="pdt-price-now">$349</span><span class="pdt-price-was">$499</span><span class="pdt-price-off">-30%</span></div>' +
          '<div><div class="pdt-swatch-label">Color: <b>Midnight</b></div><div class="pdt-swatch"><i style="--c:#111" class="is-on"></i><i style="--c:#c0392b"></i><i style="--c:#2e5aa8"></i></div></div>' +
          '<div><div class="pdt-sizes-head"><span>Size</span><a>Size guide</a></div><div class="pdt-sizes"><div class="pdt-size">S</div><div class="pdt-size is-on">M</div><div class="pdt-size">L</div><div class="pdt-size is-oos">XL</div></div></div>' +
          '<div class="pdt-buy-row"><div class="pdt-qty"><button>−</button><input value="1"><button>+</button></div><button class="pdt-buy">Add to cart · $349</button><button class="pdt-buy-alt">♥</button></div>' +
          '<div class="pdt-delivery">🚚 <span>Free delivery by <b>Thu</b> · order within <b>4h 12m</b></span></div>' +
          '<div class="pdt-trust"><span>2-yr warranty</span><span>30-day returns</span><span>Secure checkout</span></div>' +
        '</div>' +
      '</div>';
  };

  P['components/cart-pro.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.8rem;">' +
        '<button class="dapp-btn" data-cart-open>Open cart drawer →</button>' +
        '<div style="font-size:0.72rem;color:rgba(255,255,255,0.45);font-family:ui-monospace,monospace;">slides in from the right · free-ship bar updates on qty change</div>' +
        '<div class="cartx" id="demo-cart" hidden>' +
          '<div class="cartx-scrim" data-cart-close></div>' +
          '<aside class="cartx-panel">' +
            '<header class="cartx-head"><h3>Your cart</h3><button data-cart-close>×</button></header>' +
            '<div class="cartx-ship"><div class="cartx-ship-msg"></div><div class="cartx-ship-bar"><i></i></div></div>' +
            '<div class="cartx-items">' +
              '<div class="cartx-item" data-price="349"><div class="cartx-thumb"></div><div><div class="cartx-item-name">Gen 3 Headphones</div><div class="cartx-item-variant">Midnight</div><div class="cartx-qty"><button>−</button><span>1</span><button>+</button></div></div><div><div class="cartx-item-price">$349</div><button class="cartx-item-remove">Remove</button></div></div>' +
              '<div class="cartx-item" data-price="29"><div class="cartx-thumb"></div><div><div class="cartx-item-name">Travel Case</div><div class="cartx-item-variant">Black</div><div class="cartx-qty"><button>−</button><span>1</span><button>+</button></div></div><div><div class="cartx-item-price">$29</div><button class="cartx-item-remove">Remove</button></div></div>' +
            '</div>' +
            '<footer class="cartx-foot"><div class="cartx-line"><span>Subtotal</span><span data-cart-subtotal>$378</span></div><div class="cartx-total"><span>Total</span><span data-cart-subtotal>$378</span></div><button class="cartx-checkout">Checkout</button><div class="cartx-note">Shipping &amp; taxes at checkout</div></footer>' +
          '</aside>' +
        '</div>' +
      '</div>';
    if (window.CartPro) window.CartPro.init('#demo-cart', { freeShip: 500, currency: '$' });
  };

  P['components/shop-filters.css'] = function (target) {
    target.innerHTML =
      '<div style="width:100%;max-width:820px;">' +
        '<div class="shf-toolbar"><span class="shf-count"><b>248</b> products</span><div class="shf-toolbar-right"><div class="shf-sort"><select><option>Featured</option><option>Price ↑</option><option>Newest</option></select></div><div class="shf-view"><button class="is-on">▦</button><button>☰</button></div></div></div>' +
        '<div class="shf-chips"><span class="shf-chip">Under $100 <button>×</button></span><span class="shf-chip">Black <button>×</button></span><span class="shf-chip">In stock <button>×</button></span><button class="shf-chip-clear">Clear all</button></div>' +
        '<div class="shf-layout" style="margin-top:0.6rem;"><aside class="shf-sidebar">' +
          '<details class="shf-group" open><summary>Category</summary><div class="shf-group-body"><label class="shf-check"><input type="checkbox" checked>Headphones<span class="shf-cnt">84</span></label><label class="shf-check"><input type="checkbox">Earbuds<span class="shf-cnt">52</span></label><label class="shf-check"><input type="checkbox">Speakers<span class="shf-cnt">31</span></label></div></details>' +
          '<details class="shf-group" open><summary>Color</summary><div class="shf-group-body"><div class="shf-swatch"><i style="--c:#111" class="is-on"></i><i style="--c:#c0392b"></i><i style="--c:#2e5aa8"></i><i style="--c:#dcdcdc"></i><i style="--c:#16a34a"></i></div></div></details>' +
          '<details class="shf-group" open><summary>Price</summary><div class="shf-group-body"><div class="shf-range"><div class="shf-range-track"><div class="shf-range-fill"></div><div class="shf-range-knob" style="left:20%"></div><div class="shf-range-knob" style="left:75%"></div></div><div class="shf-range-vals"><span>$20</span><span>$350</span></div></div></div></details>' +
        '</aside><div class="shf-results" style="display:grid;place-items:center;min-height:200px;color:rgba(255,255,255,0.4);font-family:ui-monospace,monospace;font-size:0.8rem;border:1px dashed rgba(255,255,255,0.12);border-radius:12px;">product grid →</div></div>' +
      '</div>';
  };

  P['components/shop-extras.css'] = function (target) {
    target.innerHTML = '<div class="shx" style="display:flex;flex-direction:column;gap:1rem;width:100%;max-width:720px;">' +
      '<div class="shx-shipbar">🚚 You\'re <b style="margin:0 .2rem">$22</b> away from free shipping <div class="shx-shipbar-bar"><i style="--p:72%"></i></div></div>' +
      '<div class="shx-reviews"><div class="shx-reviews-score"><b>4.8</b><span class="stars">★★★★★</span><small>2,400 reviews</small></div><div>' +
        ['5★|82','4★|12','3★|4','2★|1','1★|1'].map(function (r) { var p = r.split('|'); return '<div class="shx-bar-row"><span class="lbl">' + p[0] + '</span><div class="shx-bar"><i style="--p:' + p[1] + '%"></i></div><span class="cnt">' + p[1] + '%</span></div>'; }).join('') +
      '</div></div>' +
      '<div style="background:#14141d;border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:1.4rem;"><div class="shx-track"><div class="shx-track-step is-done"><div class="shx-track-dot">✓</div><small>Ordered</small></div><div class="shx-track-step is-done"><div class="shx-track-dot">✓</div><small>Packed</small></div><div class="shx-track-step is-active"><div class="shx-track-dot">●</div><small>Shipped</small></div><div class="shx-track-step"><div class="shx-track-dot"></div><small>Delivered</small></div></div></div>' +
      '<div class="s-cluster" style="display:flex;gap:0.6rem;flex-wrap:wrap;align-items:center;"><span class="shx-badge shx-badge-sale">-30%</span><span class="shx-badge shx-badge-new">New</span><span class="shx-badge shx-badge-best">Bestseller</span><span class="shx-badge shx-badge-low">Low stock</span><span class="shx-badge shx-badge-eco">Eco</span><span class="shx-coupon"><code>SAVE20</code><button>Copy</button></span></div>' +
    '</div>';
  };

  // ===== Structure (page architecture) previews =====
  P['structure/structure.css'] = function (target) {
    target.innerHTML =
      '<div class="struct" style="width:100%;max-width:760px;border:1px solid rgba(255,255,255,0.1);border-radius:14px;overflow:hidden;">' +
        '<header class="s-nav" style="position:static;"><div class="s-nav-inner" style="padding:0.7rem 1rem;"><span class="s-brand"><span class="s-brand-dot"></span>Brand</span><nav class="s-nav-links"><a>Features</a><a>Pricing</a></nav><a class="s-btn" style="padding:0.5rem 1rem;">Start</a></div></header>' +
        '<section class="s-hero s-hero--center" style="padding-block:2.4rem;"><div class="s-container"><div class="s-hero-inner"><span class="s-eyebrow">Eyebrow label</span><h1 style="font-size:1.9rem;">A page skeleton you compose</h1><p class="s-lead" style="font-size:0.95rem;">Tokens + section rhythm + nav/hero/grid/footer shells.</p><div class="s-cluster s-cluster--center"><a class="s-btn">Primary</a><a class="s-btn s-btn--ghost">Ghost</a></div></div></div></section>' +
        '<section class="s-section s-section--alt s-section-tight"><div class="s-container"><div class="s-grid s-grid--3" style="--gap:0.7rem;"><div class="s-card"><h3 style="font-size:1rem;">Feature</h3><p style="font-size:0.85rem;">One job per card.</p></div><div class="s-card"><h3 style="font-size:1rem;">Feature</h3><p style="font-size:0.85rem;">Threes read as a set.</p></div><div class="s-card"><h3 style="font-size:1rem;">Feature</h3><p style="font-size:0.85rem;">Consistent rhythm.</p></div></div></div></section>' +
        '<section class="s-section s-section-tight"><div class="s-container"><div class="s-stats"><div><div class="s-stat-num">12k</div><div class="s-stat-label">teams</div></div><div><div class="s-stat-num">99.9%</div><div class="s-stat-label">uptime</div></div><div><div class="s-stat-num">3.2s</div><div class="s-stat-label">speed</div></div></div></div></section>' +
      '</div>' +
      '<div style="text-align:center;margin-top:1rem;font-family:ui-monospace,monospace;font-size:0.78rem;color:rgba(255,255,255,0.55);line-height:1.8;">Full openable pages → ' +
        ['saas','agency','restaurant','ecommerce','shop-store','dashboard','legal','cleaning','gym','coffee'].map(function (p) {
          return '<a href="../structure/' + p + '.html" target="_blank" style="color:#7c5cff;">' + p + '</a>';
        }).join(' · ') + '</div>';
  };

  P['structure/section-transitions.css'] = function (target) {
    function block(color, label) { return '<div style="background:' + color + ';padding:1.4rem;text-align:center;color:rgba(255,255,255,0.7);font-family:ui-monospace,monospace;font-size:0.75rem;">' + label + '</div>'; }
    target.innerHTML =
      '<div style="width:100%;max-width:720px;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.1);">' +
        block('#11111b', 'section A') +
        '<div class="st st-wave" style="--st-fill:#0b0b12;"><svg viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M0 60 C 200 110 400 10 600 50 C 800 90 1000 20 1200 60 L1200 120 L0 120 Z"/></svg></div>' +
        block('#0b0b12', 'wave ↑') +
        '<div class="st st-diagonal" style="--st-fill:#1b1030;"></div>' +
        block('#1b1030', 'diagonal ↑') +
        '<div class="st st-curve" style="--st-fill:#0b1530;"><svg viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M0 0 C 400 120 800 120 1200 0 L1200 120 L0 120 Z"/></svg></div>' +
        block('#0b1530', 'curve ↑') +
        '<div class="st st-zigzag" style="--st-fill:#102015;"></div>' +
        block('#102015', 'zigzag ↑') +
        '<div class="st st-layered" style="--st-fill:#2a0f12;"><svg viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M0 40 C 300 90 900 0 1200 50 L1200 120 L0 120 Z"/><path d="M0 60 C 300 100 900 20 1200 70 L1200 120 L0 120 Z"/><path d="M0 80 C 300 110 900 40 1200 90 L1200 120 L0 120 Z"/></svg></div>' +
        block('#2a0f12', 'layered ↑') +
      '</div>';
  };

  P['structure/section-frames.css'] = function (target) {
    var v = ['outline','inset','window','brackets','ticket','notch','ruled','gradient-edge','grid-guides','label','spotlight'];
    target.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem;width:100%;max-width:760px;">' +
      v.map(function (x) {
        var inner = x === 'window'
          ? '<div class="sf-bar"><span></span><span></span><span></span></div><div class="sf-body" style="color:rgba(255,255,255,0.6);font-size:0.8rem;">.sf-window</div>'
          : (x === 'label' ? '<span class="sf-tag">label</span><span style="color:rgba(255,255,255,0.6);font-size:0.8rem;">.sf-label</span>' : '<span style="color:rgba(255,255,255,0.6);font-size:0.8rem;font-family:ui-monospace,monospace;">.sf-' + x + '</span>');
        return '<div class="sf sf-' + x + '" style="--sf-bg:#15151f;min-height:96px;display:grid;place-items:center;">' + inner + '</div>';
      }).join('') + '</div>';
  };

  // ===== Phase buttons-mega previews =====
  function btnWrap(inner, opts) {
    opts = opts || {};
    var bg = opts.bg || 'transparent';
    return '<div style="display:flex;flex-wrap:wrap;gap:0.8rem;align-items:center;justify-content:center;padding:1rem;border-radius:12px;background:' + bg + ';">' + inner + '</div>';
  }

  P['blocks/buttons-social.css'] = function (target) {
    var GG = '<svg class="sobtn-ico" viewBox="0 0 24 24"><path fill="#4285F4" d="M22 12c0-.7-.1-1.4-.2-2H12v4h5.6a4.8 4.8 0 0 1-2 3.1v2.6h3.2A9.7 9.7 0 0 0 22 12z"/><path fill="#34A853" d="M12 22c2.7 0 4.9-.9 6.6-2.3l-3.2-2.6c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z"/><path fill="#FBBC05" d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9z"/><path fill="#EA4335" d="M12 6.6c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 8.3 9.4 6.6 12 6.6z"/></svg>';
    var GH = '<svg class="sobtn-ico" viewBox="0 0 24 24"><path fill="currentColor" d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 4.7 18 5 18 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/></svg>';
    var X = '<svg class="sobtn-ico" viewBox="0 0 24 24"><path fill="currentColor" d="M18.9 1.2h3.7l-8 9.1 9.4 12.5h-7.4l-5.8-7.6-6.6 7.6H.5l8.5-9.8L0 1.2h7.6l5.2 6.9zM17.6 20.6h2L6.5 3.2H4.3z"/></svg>';
    target.innerHTML = btnWrap(
      '<button class="sobtn sobtn-google">' + GG + '<span>Continue with Google</span></button>' +
      '<button class="sobtn sobtn-github">' + GH + '<span>Continue with GitHub</span></button>' +
      '<button class="sobtn sobtn-x">' + X + '<span>Sign in with X</span></button>' +
      '<button class="sobtn sobtn-discord"><span>Discord</span></button>' +
      '<button class="sobtn sobtn-spotify"><span>Spotify</span></button>' +
      '<button class="sobtn sobtn-google sobtn-pill">' + GG + '<span>Pill</span></button>' +
      '<button class="sobtn sobtn-github sobtn-icon">' + GH + '<span>GitHub</span></button>'
    , { bg: 'linear-gradient(135deg,#1b1b2b,#0e0e16)' });
  };

  P['blocks/buttons-hover-fill.css'] = function (target) {
    var v = ['left','right','top','bottom','center-h','circle','center-out','diagonal','split-v','corner','stripe'];
    var colors = ['violet','emerald','rose','amber','sky'];
    target.innerHTML = btnWrap(v.map(function (x, i) {
      return '<button class="hfbtn hfbtn-' + x + ' hfbtn-' + colors[i % colors.length] + '">' + x + '</button>';
    }).join(''), { bg: '#0e0e16' });
  };

  P['blocks/buttons-borders.css'] = function (target) {
    var v = ['marching','conic','snake','draw','double','dashed-spin','beam','glow-pulse','gradient-flow','brackets','neon-trace','sweep'];
    target.innerHTML = btnWrap(v.map(function (x) {
      return '<button class="bdbtn bdbtn-' + x + '">' + x + '</button>';
    }).join(''), { bg: '#08080e' });
  };

  P['blocks/buttons-shine.css'] = function (target) {
    var v = ['sweep','satin','spotlight','holo-foil','steel','gold','chrome','iridescent','laser','wet','glass-gloss','prism'];
    target.innerHTML = btnWrap(v.map(function (x) {
      return '<button class="shbtn shbtn-' + x + '">' + x + '</button>';
    }).join(''), { bg: 'linear-gradient(135deg,#1a1a2e,#0b0b14)' });
  };

  P['blocks/buttons-glass.css'] = function (target) {
    var v = ['frosted','aqua','web2','aero','tinted','liquid','depth','bubble','dark','ghost'];
    target.innerHTML = btnWrap(v.map(function (x) {
      return '<button class="glbtn glbtn-' + x + '">' + x + '</button>';
    }).join(''), { bg: 'radial-gradient(circle at 30% 20%,#6d28d9,#0b0b14 70%)' });
  };

  P['blocks/buttons-gaming.css'] = function (target) {
    var v = ['fantasy','rpg-gold','sci-fi','cyberpunk','arcade','hologram','energy','pixel-quest','neon-arcade','mech','health','mana'];
    target.innerHTML = btnWrap(v.map(function (x) {
      return '<button class="gmbtn gmbtn-' + x + '">' + x.replace('-', ' ') + '</button>';
    }).join(''), { bg: 'radial-gradient(circle at 50% 0%,#1a1030,#06060c 70%)' });
  };

  P['blocks/button-groups.css'] = function (target) {
    target.innerHTML = btnWrap(
      '<div style="display:flex;flex-direction:column;gap:1rem;align-items:center;">' +
        '<div class="bgrp bgrp-segmented"><button class="bgrp-item is-active">Day</button><button class="bgrp-item">Week</button><button class="bgrp-item">Month</button></div>' +
        '<div class="bgrp bgrp-joined"><button class="bgrp-item is-active">Left</button><button class="bgrp-item">Mid</button><button class="bgrp-item">Right</button></div>' +
        '<div class="bgrp bgrp-split"><button class="bgrp-item">Deploy</button><button class="bgrp-item">▾</button></div>' +
        '<div class="bgrp bgrp-pill-toggle"><button class="bgrp-item is-active">On</button><button class="bgrp-item">Off</button></div>' +
        '<div class="bgrp bgrp-toolbar"><button class="bgrp-item is-active">B</button><button class="bgrp-item">I</button><span class="bgrp-sep"></span><button class="bgrp-item">↺</button><button class="bgrp-item">↻</button></div>' +
        '<div class="bgrp bgrp-radio"><button class="bgrp-item is-active">Small</button><button class="bgrp-item">Medium</button><button class="bgrp-item">Large</button></div>' +
      '</div>'
    , { bg: '#0e0e16' });
  };

  P['blocks/buttons-states.js'] = function (target) {
    var check = '<span class="sbtn-spinner"></span><svg class="sbtn-check" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg><svg class="sbtn-x" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    target.innerHTML = btnWrap(
      '<button class="sbtn sbtn-async"><span class="sbtn-label">Save changes</span>' + check + '</button>' +
      '<button class="sbtn sbtn-async" data-demo="fail"><span class="sbtn-label">Will fail</span>' + check + '</button>' +
      '<button class="sbtn sbtn-hold"><span class="sbtn-label">Hold to delete</span></button>' +
      '<button class="sbtn sbtn-slide" style="min-width:240px;"><span class="sbtn-label">Slide to confirm →</span><span class="sbtn-knob">→</span></button>'
    , { bg: '#0e0e16' });
    if (window.ButtonStates) {
      window.ButtonStates.init(target.querySelector('.sbtn-async:not([data-demo])'), { task: function () { return new Promise(function (r) { setTimeout(function () { r(true); }, 1200); }); } });
      window.ButtonStates.init(target.querySelector('.sbtn-async[data-demo]'), { task: function () { return new Promise(function (r) { setTimeout(function () { r(false); }, 1200); }); } });
      window.ButtonStates.init(target.querySelector('.sbtn-hold'), { holdTime: 1200 });
      window.ButtonStates.init(target.querySelector('.sbtn-slide'));
    }
  };

  P['blocks/buttons-text-fx.js'] = function (target) {
    target.innerHTML = btnWrap(
      '<button class="txbtn txbtn-glitch" data-text="Launch">Launch</button>' +
      '<button class="txbtn txbtn-swap"><span data-hover="Let\'s go!">Get started</span></button>' +
      '<button class="txbtn txbtn-stagger"><i>H</i><i>o</i><i>v</i><i>e</i><i>r</i></button>' +
      '<button class="txbtn txbtn-arrow">Next<span class="tx-arrow">→</span></button>' +
      '<button class="txbtn txbtn-scramble">Decrypt</button>' +
      '<button class="txbtn txbtn-typing">Deploy now</button>' +
      '<button class="txbtn txbtn-count">0</button>'
    , { bg: '#0e0e16' });
    if (window.ButtonTextFx) {
      window.ButtonTextFx.init(target.querySelector('.txbtn-scramble'));
      window.ButtonTextFx.init(target.querySelector('.txbtn-typing'), { text: 'Deploy now' });
      window.ButtonTextFx.init(target.querySelector('.txbtn-count'), { to: 1280, prefix: '$', trigger: 'hover' });
    }
  };

  P['blocks/buttons-micro.js'] = function (target) {
    var check = '<span class="mi-label">Done?</span><span class="mi-check"><svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg></span>';
    target.innerHTML = btnWrap(
      '<button class="mibtn mibtn-confetti">🎉 Celebrate</button>' +
      '<button class="mibtn mibtn-particle">Pop</button>' +
      '<button class="mibtn mibtn-sparkle">✦ Sparkle</button>' +
      '<button class="mibtn mibtn-ripple-point">Ripple</button>' +
      '<button class="mibtn mibtn-shockwave">Shockwave</button>' +
      '<button class="mibtn mibtn-squish">Squish</button>' +
      '<button class="mibtn mibtn-jelly">Jelly</button>' +
      '<button class="mibtn mibtn-checkmark">' + check + '</button>' +
      '<button class="mibtn mibtn-emoji" data-emoji="🔥">Fire</button>'
    , { bg: '#0e0e16' });
    if (window.ButtonMicro) window.ButtonMicro.init(target.querySelectorAll('.mibtn'));
  };

  P['blocks/buttons-toggle.js'] = function (target) {
    var heart = '<svg class="tg-ico" viewBox="0 0 24 24"><path d="M12 21s-7-4.5-9.5-8.5C.5 9 2 5.5 5.3 5.5c2 0 3.2 1.2 3.7 2 .5-.8 1.7-2 3.7-2C16 5.5 17.5 9 15.5 12.5 13 16.5 12 21 12 21z"/></svg>';
    var book = '<svg class="tg-ico" viewBox="0 0 24 24"><path d="M6 4h12v16l-6-4-6 4z"/></svg>';
    var star = '<svg class="tg-ico" viewBox="0 0 24 24"><path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8L3.5 9.2l5.9-.9z"/></svg>';
    target.innerHTML = btnWrap(
      '<button class="tgbtn tgbtn-like">' + heart + '<span class="tg-count">128</span></button>' +
      '<button class="tgbtn tgbtn-bookmark">' + book + '<span>Save</span></button>' +
      '<button class="tgbtn tgbtn-star">' + star + '<span>Star</span></button>' +
      '<button class="tgbtn tgbtn-follow"><span class="tg-off-label">Follow</span><span class="tg-on-label">Following</span></button>' +
      '<button class="tgbtn tgbtn-subscribe"><span class="tg-off-label">Subscribe</span><span class="tg-on-label">Subscribed</span></button>'
    , { bg: '#0e0e16' });
    if (window.ButtonToggle) window.ButtonToggle.init(target.querySelectorAll('.tgbtn'));
  };

  // ===== Aceternity gap-fill: high-impact previews =====

  P['components/infinite-moving-cards.js'] = function (target) {
    target.innerHTML =
      '<div class="imc-host" data-speed="30" data-direction="left" style="max-width:760px;">' +
        '<ul class="imc-track">' +
          ['"Game changer for our pipeline." — Maria · CTO',
           '"Felt like cheating." — Alex · Designer',
           '"Loved the migration story." — Jordan · PM',
           '"Best devx in years." — Sam · Eng',
           '"Shipped a redesign in a weekend." — Aria · Founder'
          ].map(function (s) {
            var parts = s.split(' — ');
            return '<li class="imc-card"><p>' + parts[0] + '</p><span>' + parts[1] + '</span></li>';
          }).join('') +
        '</ul>' +
      '</div>';
    if (window.InfiniteMovingCards) window.InfiniteMovingCards.init('.imc-host');
  };

  P['components/card-stack.js'] = function (target) {
    target.innerHTML =
      '<div class="cs-host">' +
        ['"This shipped twice as fast as anything else." — Maria · CTO',
         '"DX so good it feels illegal." — Alex · Designer',
         '"Our team\'s velocity doubled." — Jordan · PM'
        ].map(function (s) {
          var parts = s.split(' — ');
          return '<div class="cs-card"><p>' + parts[0] + '</p><span>' + parts[1] + '</span></div>';
        }).join('') +
      '</div>' +
      '<div style="margin-top:0.8rem;font-size:0.7rem;color:rgba(255,255,255,0.45);font-family:ui-monospace,monospace;">click or wait — auto-rotates every 4s</div>';
    if (window.CardStack) window.CardStack.init('.cs-host', { interval: 4000 });
  };

  P['components/glare-card.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;gap:1.2rem;flex-wrap:wrap;justify-content:center;">' +
        '<div class="gc-host"><div class="gc-content"><h3>Aurora Pro</h3><p>Up to 12% APR · move mouse over</p></div></div>' +
        '<div class="gc-host" style="--gc-bg:linear-gradient(135deg,#7c2d12,#ea580c);"><div class="gc-content"><h3>Sunset</h3><p>Limited edition</p></div></div>' +
      '</div>';
    if (window.GlareCard) window.GlareCard.init('.gc-host');
  };

  P['components/wobble-card.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;gap:1.2rem;flex-wrap:wrap;justify-content:center;">' +
        '<div class="wc-host"><div class="wc-inner"><h3>Pro</h3><p>Everything you need to ship.</p></div></div>' +
        '<div class="wc-host wc-host-emerald"><div class="wc-inner"><h3>Team</h3><p>Collaborate without limits.</p></div></div>' +
        '<div class="wc-host wc-host-sunset"><div class="wc-inner"><h3>Lifetime</h3><p>One-time, forever.</p></div></div>' +
      '</div>';
    if (window.WobbleCard) window.WobbleCard.init('.wc-host');
  };

  P['components/pin-container.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;gap:2.5rem;flex-wrap:wrap;justify-content:center;padding-top:1rem;">' +
        ['violet','emerald','amber'].map(function (variant) {
          return '<a href="#" class="pc-host pc-host-' + variant + '">' +
            '<div class="pc-pin"><span class="pc-pin-label">/ui/' + variant + '-card</span></div>' +
            '<div class="pc-card">' +
              '<h3>' + variant.charAt(0).toUpperCase() + variant.slice(1) + ' card</h3>' +
              '<p style="margin-top:auto;">Hover me. The card tilts back and a pin extends above with a label.</p>' +
            '</div>' +
          '</a>';
        }).join('') +
      '</div>';
  };

  P['effects/background-beams.css'] = function (target) {
    target.innerHTML =
      '<div class="bb-host" style="height:240px;border-radius:12px;display:grid;place-items:center;">' +
        '<svg class="bb-svg" viewBox="0 0 696 240" fill="none" preserveAspectRatio="none">' +
          ['M0 80 C 200 80, 400 160, 696 100',
           'M0 40  C 200 40, 400 200, 696 60',
           'M0 120 C 200 120, 400 40,  696 140',
           'M0 180 C 200 180, 400 80,  696 200',
           'M0 60  C 250 60, 450 180, 696 30'
          ].map(function (d) { return '<path class="bb-path" d="' + d + '"/>'; }).join('') +
        '</svg>' +
        '<div style="position:relative;z-index:2;font-family:system-ui,sans-serif;font-size:1.8rem;font-weight:700;color:#fff;text-align:center;letter-spacing:-0.02em;">Background <span style="background:linear-gradient(90deg,#a855f7,#ec4899);-webkit-background-clip:text;background-clip:text;color:transparent;">beams</span></div>' +
      '</div>';
    if (window.BackgroundBeams) window.BackgroundBeams.init();
  };

  P['effects/background-beams-collision.js'] = function (target) {
    target.innerHTML = '<div class="bbc-host" style="height:320px;border-radius:12px;"></div>';
    if (window.BackgroundBeamsCollision) window.BackgroundBeamsCollision.init('.bbc-host', { count: 14 });
  };

  P['effects/vortex.js'] = function (target) {
    target.innerHTML =
      '<div class="vtx-host" style="height:340px;border-radius:12px;display:grid;place-items:center;">' +
        '<div style="position:relative;z-index:2;font-family:system-ui,sans-serif;color:#fff;text-align:center;">' +
          '<div style="font-size:2.2rem;font-weight:700;letter-spacing:-0.02em;">The hypnotic <span style="background:linear-gradient(90deg,#a855f7,#ec4899);-webkit-background-clip:text;background-clip:text;color:transparent;">vortex</span></div>' +
          '<div style="font-size:0.8rem;opacity:0.6;margin-top:0.4rem;">600 particles · curl-noise · pure canvas</div>' +
        '</div>' +
      '</div>';
    if (window.Vortex) window.Vortex.init('.vtx-host', { count: 600 });
  };

  P['effects/background-boxes.js'] = function (target) {
    target.innerHTML =
      '<div class="bgx-host" style="height:340px;border-radius:12px;display:grid;place-items:center;">' +
        '<div style="position:relative;z-index:2;font-family:system-ui,sans-serif;color:#fff;text-align:center;pointer-events:none;">' +
          '<div style="font-size:2rem;font-weight:700;">Hover the <span style="color:#a855f7;">grid</span></div>' +
          '<div style="font-size:0.78rem;opacity:0.6;margin-top:0.3rem;">cells light up + fade out</div>' +
        '</div>' +
      '</div>';
    if (window.BackgroundBoxes) window.BackgroundBoxes.init('.bgx-host', { rows: 14, cols: 24 });
  };

  P['interactions/following-pointer.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;">' +
        '<div class="fp-host" data-label="Maria" data-color="#a855f7" style="background:#0e0e18;padding:2rem;border-radius:12px;width:280px;border:1px solid rgba(255,255,255,0.08);">' +
          '<h3 style="margin:0 0 0.4rem;color:#fff;font-family:system-ui,sans-serif;">Hover me</h3>' +
          '<p style="margin:0;color:rgba(255,255,255,0.55);font-family:system-ui,sans-serif;font-size:0.85rem;">Cursor turns into a Maria-labelled arrow.</p>' +
        '</div>' +
        '<div class="fp-host" data-label="Alex"  data-color="#10b981" style="background:#0e0e18;padding:2rem;border-radius:12px;width:280px;border:1px solid rgba(255,255,255,0.08);">' +
          '<h3 style="margin:0 0 0.4rem;color:#fff;font-family:system-ui,sans-serif;">And me</h3>' +
          '<p style="margin:0;color:rgba(255,255,255,0.55);font-family:system-ui,sans-serif;font-size:0.85rem;">A second region with a different label + color.</p>' +
        '</div>' +
      '</div>';
    if (window.FollowingPointer) window.FollowingPointer.init('.fp-host');
  };

  // The scroll-driven ones (container-scroll, macbook-scroll, tracing-beam,
  // sticky-scroll-reveal, google-gemini-effect) only animate during real-page
  // scroll. The vault's per-snippet preview iframe isn't tall enough to drive
  // them, so we render a representative still-frame + usage hint.
  P['scroll/container-scroll.js'] = function (target) {
    target.innerHTML =
      '<div style="text-align:center;font-family:system-ui,sans-serif;color:#fff;max-width:540px;">' +
        '<div style="perspective:1200px;margin-bottom:1.2rem;">' +
          '<div style="width:100%;aspect-ratio:16/10;background:#1a1d27;border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:10px;transform:rotateX(14deg) scale(0.9);box-shadow:0 30px 80px -20px rgba(0,0,0,0.45);">' +
            '<div style="width:100%;height:100%;background:linear-gradient(135deg,#0f172a,#312e81);border-radius:8px;display:grid;place-items:center;font-size:1.6rem;font-weight:700;">Your hero image</div>' +
          '</div>' +
        '</div>' +
        '<div style="font-size:0.85rem;opacity:0.6;">Scroll-driven. The frame rotates flat + scales up as you scroll through the section. Drop into a real page to see it animate.</div>' +
      '</div>';
  };
  P['scroll/macbook-scroll.js'] = function (target) {
    target.innerHTML =
      '<div style="text-align:center;font-family:system-ui,sans-serif;color:#fff;max-width:540px;">' +
        '<div style="perspective:900px;margin-bottom:1.2rem;display:flex;flex-direction:column;align-items:center;">' +
          '<div style="width:280px;aspect-ratio:16/10;background:#2a2d36;border:1px solid rgba(255,255,255,0.08);border-radius:14px 14px 4px 4px;padding:10px;transform:rotateX(-30deg);transform-origin:bottom;box-shadow:0 30px 60px -24px rgba(0,0,0,0.55);">' +
            '<div style="width:100%;height:100%;background:linear-gradient(135deg,#0f172a,#1e1b4b);border-radius:6px;"></div>' +
          '</div>' +
          '<div style="width:300px;height:18px;background:linear-gradient(180deg,#2a2d36,#1c1e25);border-radius:0 0 18px 18px;border:1px solid rgba(255,255,255,0.08);margin-top:-1px;"></div>' +
        '</div>' +
        '<div style="font-size:0.85rem;opacity:0.6;">Scroll-driven. The lid opens from closed (-90°) to open as the user scrolls through the section.</div>' +
      '</div>';
  };
  P['scroll/google-gemini-effect.js'] = function (target) {
    target.innerHTML =
      '<div style="text-align:center;font-family:system-ui,sans-serif;color:#fff;max-width:600px;">' +
        '<svg viewBox="0 0 1440 400" style="width:100%;background:#050510;border-radius:12px;" fill="none">' +
          ['#a855f7','#ec4899','#f59e0b','#10b981','#3b82f6'].map(function (c, i) {
            var y1 = 320, y2 = 200 - i * 30;
            return '<path d="M0 ' + y1 + ' C 360 ' + (y1 - i*60) + ', 720 ' + (y1 - i*60) + ', 1440 ' + y2 + '" stroke="' + c + '" stroke-width="3" stroke-linecap="round" style="filter:drop-shadow(0 0 6px ' + c + ');"/>';
          }).join('') +
        '</svg>' +
        '<div style="font-size:0.85rem;opacity:0.6;margin-top:0.7rem;">Scroll-driven. Each curve animates its stroke-dashoffset from 0 → full as you scroll through the section.</div>' +
      '</div>';
  };
  P['scroll/tracing-beam.js'] = function (target) {
    target.innerHTML =
      '<div style="text-align:left;font-family:system-ui,sans-serif;color:#fff;max-width:560px;display:grid;grid-template-columns:30px 1fr;gap:1rem;">' +
        '<div style="position:relative;background:rgba(255,255,255,0.04);width:2px;margin-left:14px;border-radius:1px;">' +
          '<div style="position:absolute;top:0;width:2px;height:60%;background:linear-gradient(180deg,transparent,#a855f7);"></div>' +
          '<div style="position:absolute;top:60%;left:50%;transform:translate(-50%,-50%);width:14px;height:14px;border-radius:50%;background:#fff;border:2px solid #a855f7;box-shadow:0 0 24px rgba(168,85,247,0.85);"></div>' +
        '</div>' +
        '<div style="opacity:0.75;font-size:0.9rem;line-height:1.6;">' +
          '<p style="margin:0 0 1rem;">Long-form article body. The beam to the left fills + the glowing dot travels down as the reader scrolls. Pair with `article` and ResizeObserver handles dynamic heights.</p>' +
          '<p style="margin:0;opacity:0.55;font-size:0.78rem;">Static preview — the real beam animates from scroll progress.</p>' +
        '</div>' +
      '</div>';
  };
  P['scroll/sticky-scroll-reveal.js'] = function (target) {
    target.innerHTML =
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;max-width:680px;font-family:system-ui,sans-serif;color:#fff;">' +
        '<div>' +
          '<div style="opacity:0.35;font-size:0.95rem;margin-bottom:1.2rem;"><strong>Step one</strong><br>Sketch the layout.</div>' +
          '<div style="opacity:1;font-size:0.95rem;margin-bottom:1.2rem;"><strong style="font-size:1.1rem;">Step two — active</strong><br>Wire up the data.</div>' +
          '<div style="opacity:0.35;font-size:0.95rem;"><strong>Step three</strong><br>Polish + ship.</div>' +
        '</div>' +
        '<div style="background:linear-gradient(135deg,#312e81,#1e293b);border-radius:14px;min-height:200px;display:grid;place-items:center;font-size:0.85rem;opacity:0.7;">visual for active panel</div>' +
      '</div>';
  };

  // ===== Greek fonts pack =====
  P['typography/greek-fonts.css'] = function (target) {
    var fonts = [
      // [class, label, category, sample Greek, sample Latin/numeric]
      ['gf-gfs-didot',          'GFS Didot',          'Greek serif',         'Καλώς ορίσατε',     'Welcome 1234'],
      ['gf-athena-vkf',         'Athena VKF',         'Greek display',       'Ἀθῆναι',            'Athena 567'],
      ['gf-junicode',           'Junicode',           'Polytonic serif',     'Πολυτονικό κείμενο', 'Junicode Æ ﬂ'],
      ['gf-open-sans',          'Open Sans',          'Sans (Greek)',        'Ελληνικά γράμματα', 'The quick brown fox'],
      ['gf-ubuntu',             'Ubuntu',             'Sans (Greek)',        'Ελευθερία στο λογισμικό', 'Ubuntu means humanity'],
      ['gf-ubuntu-condensed',   'Ubuntu Condensed',   'Condensed',           'ΣΥΜΠΥΚΝΩΣΗ',         'CONDENSED 1280'],
      ['gf-ubuntu-mono',        'Ubuntu Mono',        'Mono (Greek)',        'κωδικός: αληθές',   '> npm install'],
      ['gf-basenji',            'Basenji',            'Display',             'Αθήνα',             'Basenji Semi'],
      ['gf-basis33',            'Basis33',            'Pixel / 8-bit',       'ΡΕΤΡΟ 8',           'PIXEL ART 88'],
      ['gf-bodoni-z37',         'Bodoni Z37',         'Didone bold',         'ΕΛΕΓΑΝΣ',           'BODONI 37'],
      ['gf-breamcatcher',       'Breamcatcher',       'Brush',               'γεια σου',          'hand drawn'],
      ['gf-bubble-sans',        'Bubble Sans',        'Cartoon',             'γουστάρω',          'Bubbly Fun'],
      ['gf-dihjauti',           'Dihjauti',           'Experimental',        'ΣΧΗΜΑ',             'Dihjauti'],
      ['gf-dihjauti-s',         'Dihjauti S',         'Stylistic alt',       'ΑΛΛΑΓΗ',            'Dihjauti S'],
      ['gf-galiver-sans',       'Galiver Sans',       'Geometric grotesque', 'ΓΑΛΑΞΙΑΣ',          'Galiver Bold'],
      ['gf-slimamif',           'Slimamif',           'Condensed display',   'ΨΗΛΟ',              'TALL & SLIM'],
      ['gf-stampatello-faceto', 'Stampatello Faceto', 'Schoolroom print',    'σχολείο',           'school print'],
      ['gf-toxigenesis',        'Toxigenesis',        'Sci-fi',              'ΚΥΒΕΡΝΟ',           'CYBER 2099'],
      ['gf-wimzik',             'Wimzik',             'Handwritten',         'σημείωση',          'whimsical note']
    ];
    target.innerHTML =
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:0.8rem;width:100%;max-width:1100px;">' +
        fonts.map(function (f) {
          return '<div style="background:#14141e;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:1rem 1.1rem;display:flex;flex-direction:column;gap:0.45rem;">' +
            '<div style="display:flex;align-items:center;justify-content:space-between;gap:0.5rem;">' +
              '<div style="font-size:0.72rem;color:rgba(255,255,255,0.55);font-family:ui-monospace,monospace;letter-spacing:0.04em;">.' + f[0] + '</div>' +
              '<div style="font-size:0.6rem;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.08em;">' + f[2] + '</div>' +
            '</div>' +
            '<div style="font-size:0.95rem;color:rgba(255,255,255,0.85);font-weight:600;">' + f[1] + '</div>' +
            '<div class="' + f[0] + '" style="font-size:1.9rem;line-height:1.15;color:#fff;">' + f[3] + '</div>' +
            '<div class="' + f[0] + '" style="font-size:1.1rem;color:rgba(255,255,255,0.75);">' + f[4] + '</div>' +
            '<div class="' + f[0] + '" style="font-size:0.75rem;color:rgba(255,255,255,0.45);letter-spacing:0.02em;">αβγδεζηθικλμ ABCDEFG 1234567890</div>' +
          '</div>';
        }).join('') +
      '</div>';
  };

  // ===== Decorative shapes =====
  P['svg/decorative-shapes.css'] = function (target) {
    target.innerHTML =
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:0.6rem;max-width:720px;">' +
        ['dec-blob','dec-waves','dec-dots','dec-grid-soft','dec-stripes','dec-scribble','dec-arrow','dec-ribbon','dec-sparkles','dec-checker','dec-zigzag','dec-circuit','dec-honeycomb'].map(function (cls) {
          return '<div class="dec-host" style="height:120px;background:#14141e;border-radius:10px;display:grid;place-items:center;position:relative;"><div class="dec ' + cls + ' dec-center"></div><div style="font-size:0.62rem;color:rgba(255,255,255,0.5);font-family:ui-monospace,monospace;z-index:1;">' + cls + '</div></div>';
        }).join('') +
      '</div>';
  };

  // ===== Section bg pack =====
  P['layout/section-bg-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0.7rem;max-width:760px;">' +
        ['sbg-aurora','sbg-mesh','sbg-grid','sbg-dots','sbg-retro','sbg-conic','sbg-spot','sbg-stripes','sbg-blob','sbg-vline','sbg-grain','sbg-stars'].map(function (cls) {
          return '<section class="sbg ' + cls + '" style="padding:1.4rem;min-height:140px;border-radius:10px;display:grid;place-items:center;"><div style="font-size:0.78rem;font-family:ui-monospace,monospace;color:rgba(255,255,255,0.7);position:relative;z-index:1;">.' + cls + '</div></section>';
        }).join('') +
      '</div>';
  };

  // ===== Decorative borders pack 2 =====
  P['effects/borders-pack-2.css'] = function (target) {
    target.innerHTML =
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:0.8rem;max-width:760px;">' +
        ['bd2-ants','bd2-flow','bd2-wash','bd2-glow','bd2-corner','bd2-neon','bd2-conic','bd2-particle','bd2-snake','bd2-stripe','bd2-mosaic','bd2-trace-sq'].map(function (cls) {
          return '<div class="bd2 ' + cls + '" style="text-align:center;font-size:0.78rem;">' + cls.replace('bd2-', '') + '</div>';
        }).join('') +
      '</div>';
  };

  // ===== Maps pack =====
  P['components/maps-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center;justify-content:center;max-width:720px;">' +
        '<span class="mp-pin"></span>' +
        '<span class="mp-pin mp-pin-pink"></span>' +
        '<span class="mp-pin mp-pin-cyan"></span>' +
        '<span class="mp-pulse"></span>' +
        '<div class="mp-tip"><div class="mp-tip-title">Acme HQ</div><div class="mp-tip-sub">San Francisco, CA</div></div>' +
        '<div class="mp-leg"><div class="mp-leg-title">Legend</div><div class="mp-leg-row"><div class="mp-leg-swatch"></div>Office</div><div class="mp-leg-row"><div class="mp-leg-swatch" style="background:#ec4899;"></div>Hub</div></div>' +
        '<div class="mp-clust">14</div>' +
        '<div class="mp-clust mp-clust-pink mp-clust-md">3</div>' +
        '<div class="mp-route" style="max-width:340px;"><span class="mp-route-dot"></span><span class="mp-route-line" style="width:60px;"></span><span class="mp-route-dot to"></span><div class="mp-route-meta"><b>24 min</b> · 18 mi</div></div>' +
        '<div class="mp-dist"><b>2.4 mi</b><span>away</span></div>' +
        '<div class="mp-mini"><div class="mp-mini-road"></div><div class="mp-mini-pin"><span class="mp-pin"></span></div><div class="mp-mini-cap">Apollo HQ</div></div>' +
      '</div>';
  };

  // ===== Crypto pack =====
  P['components/crypto-pack.css'] = function (target) {
    packGrid(target, [
      { label: 'aave',     html: '<div class="crp-aave" style="max-width:320px;"><div class="crp-aave-head"><div class="crp-aave-logo"></div><h3>Aave Pool</h3></div><div class="crp-aave-row"><div>Supplied</div><div><b>$12,500</b></div></div><div class="crp-aave-row"><div>Borrowed</div><div><b>$4,200</b></div></div><div class="crp-aave-health"><div class="crp-aave-health-bar"><i style="--hf:72%"></i></div><div class="crp-aave-health-val">1.84</div></div><button class="crp-aave-cta">Supply more</button></div>' },
      { label: 'uniswap',  html: '<div class="crp-uniswap" style="max-width:320px;"><div class="crp-uniswap-head"><h3>Swap</h3><div class="crp-uniswap-tools"><button class="crp-uniswap-tool">⚙</button></div></div><div class="crp-uniswap-pane"><input class="crp-uniswap-amount" value="1.5" readonly><div class="crp-uniswap-token"><span class="crp-uniswap-token-coin"></span>ETH</div></div><button class="crp-uniswap-flip">↕</button><div class="crp-uniswap-pane"><input class="crp-uniswap-amount" value="2,418" readonly><div class="crp-uniswap-token"><span class="crp-uniswap-token-coin" style="background:linear-gradient(135deg,#2775ca,#0066ff);"></span>USDC</div></div><div class="crp-uniswap-rate">1 ETH = 1,612 USDC</div><button class="crp-uniswap-cta">Swap</button></div>' },
      { label: 'returns',  html: '<div class="crp-returns" style="max-width:300px;"><h3>Returns calculator</h3><div class="crp-returns-input"><label>Stake</label><input value="$1,000" readonly></div><div class="crp-returns-input"><label>APR</label><input value="12.4%" readonly></div><div class="crp-returns-out"><div class="crp-returns-out-label">After 1 year</div><div class="crp-returns-out-val">$1,124</div></div></div>' },
      { label: 'gas',      html: '<div class="crp-gas"><span class="crp-gas-val">14</span> gwei</div>' },
      { label: 'slip',     html: '<div class="crp-slip"><button class="crp-slip-opt">0.1%</button><button class="crp-slip-opt is-active">0.5%</button><button class="crp-slip-opt">1%</button><input class="crp-slip-custom" value="0.7" placeholder="Custom"></div>' }
    ], null, 280);
  };

  // ===== Social pack 2 =====
  P['components/social-pack-2.css'] = function (target) {
    packGrid(target, [
      { label: 'thread',  html: '<div class="s2-thread" style="max-width:340px;"><div class="s2-thread-avatar"></div><div><div class="s2-thread-head"><span class="s2-thread-name">Maria</span><span class="s2-thread-time">2m ago</span></div><div class="s2-thread-body">Initial design ready for review!</div><div class="s2-thread-replies"><div class="s2-thread-avatars"><div></div><div></div><div></div></div>3 replies</div></div></div>' },
      { label: 'vote',    html: '<div class="s2-vote"><button class="s2-vote-btn up is-on">▲</button><div class="s2-vote-score">+248</div><button class="s2-vote-btn down">▼</button></div>' },
      { label: 'pile',    html: '<div class="s2-pile"><span class="s2-pile-chip is-mine">👍<span class="s2-pile-count">12</span></span><span class="s2-pile-chip">❤️<span class="s2-pile-count">8</span></span><span class="s2-pile-chip">🎉<span class="s2-pile-count">5</span></span><button class="s2-pile-add">+</button></div>' },
      { label: 'poll',    html: '<div class="s2-poll" style="max-width:340px;"><h4>Favorite framework?</h4><div class="s2-poll-opt voted is-pick" style="--pct:50%"><span class="s2-poll-text">React</span><span class="s2-poll-pct">50%</span></div><div class="s2-poll-opt voted" style="--pct:30%"><span class="s2-poll-text">Vue</span><span class="s2-poll-pct">30%</span></div><div class="s2-poll-opt voted" style="--pct:20%"><span class="s2-poll-text">Svelte</span><span class="s2-poll-pct">20%</span></div><div class="s2-poll-meta"><span>248 votes</span><span>2d left</span></div></div>' }
    ], null, 280);
  };

  // ===== Social pack 1 =====
  P['components/social-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:1rem;max-width:540px;width:100%;">' +
        '<div class="soc-xpost"><div class="soc-xpost-avatar"></div><div><div class="soc-xpost-head"><span class="soc-xpost-name soc-xpost-verified">Maria Rivera</span><span class="soc-xpost-handle">@maria</span><span class="soc-xpost-time">2h</span></div><div class="soc-xpost-body">Just shipped Aurora 2.0! Big improvements to forms, animations, and developer experience. Check it out: <a>aurora.app</a></div><div class="soc-xpost-actions"><button class="soc-xpost-action">💬 24</button><button class="soc-xpost-action retweet">↻ 89</button><button class="soc-xpost-action like is-liked">❤️ 248</button><button class="soc-xpost-action">↗️</button></div></div></div>' +
      '</div>';
  };

  // ===== Onboarding checklist =====
  P['components/onboarding-checklist.css'] = function (target) {
    target.innerHTML =
      '<div class="ochk" style="max-width:340px;width:100%;">' +
        '<div class="ochk-head"><h3>Get started</h3><span class="ochk-progress">2 of 5</span></div>' +
        '<div class="ochk-bar"><i style="--ochk-pct:40%"></i></div>' +
        '<ul class="ochk-list">' +
          '<li class="ochk-item is-done"><button class="ochk-tick"></button>Connect Slack</li>' +
          '<li class="ochk-item is-done"><button class="ochk-tick"></button>Invite team</li>' +
          '<li class="ochk-item"><button class="ochk-tick"></button>Add billing <span class="ochk-rew">+50 XP</span></li>' +
          '<li class="ochk-item"><button class="ochk-tick"></button>Create first project</li>' +
          '<li class="ochk-item"><button class="ochk-tick"></button>Customize dashboard</li>' +
        '</ul>' +
      '</div>';
  };

  // ===== Timeline pack 2 =====
  P['components/timeline-pack-2.css'] = function (target) {
    target.innerHTML =
      '<div style="display:grid;grid-template-columns:1fr;gap:1.4rem;max-width:600px;width:100%;">' +
        '<div class="tl-yr"><div class="tl-yr-group"><h3>2024</h3><ul class="tl-yr-list"><li class="is-key"><b>Launched Aurora 2.0</b><span>Aug 2024</span></li><li><b>Reached 10k users</b><span>Jun 2024</span></li><li><b>Series A funding</b><span>Mar 2024</span></li></ul></div></div>' +
        '<div class="tl-chunk"><div class="tl-chunk-item violet"><h4 class="tl-chunk-title">Design system</h4><p class="tl-chunk-body">Released the v2 design tokens.</p></div><div class="tl-chunk-item pink"><h4 class="tl-chunk-title">User research</h4><p class="tl-chunk-body">Interviewed 24 teams.</p></div><div class="tl-chunk-item cyan"><h4 class="tl-chunk-title">Launch</h4><p class="tl-chunk-body">Public release.</p></div></div>' +
      '</div>';
  };

  // ===== Disclosure pack =====
  P['components/disclosure-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:1rem;max-width:420px;width:100%;">' +
        '<div class="dp-drop is-open"><div class="dp-drop-head">More options</div><div class="dp-drop-body">Hidden content revealed when expanded — perfect for advanced settings.</div></div>' +
        '<div class="dp-switch is-on" style="max-width:340px;"><div class="dp-switch-head"><h4>Email notifications</h4><button class="dp-switch-toggle"></button></div><div class="dp-switch-body">You\'ll receive email alerts for new comments and mentions.</div></div>' +
        '<div class="dp-task is-open" style="max-width:340px;"><div class="dp-task-head"><div class="dp-task-icon">📊</div><div class="dp-task-name">Weekly report</div><div class="dp-task-meta">In progress</div></div><div class="dp-task-body"><div class="dp-task-progress"><i style="--pct:62%"></i></div><div class="dp-task-row"><span>Data collection</span><b>Done</b></div><div class="dp-task-row"><span>Analysis</span><b>62%</b></div></div></div>' +
      '</div>';
  };

  // ===== Datetime pack =====
  P['components/datetime-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;max-width:760px;">' +
        '<div class="dt-year" style="max-width:300px;"><div class="dt-year-mo"><div class="dt-year-name">Jan</div><div class="dt-year-meta">3 events</div></div><div class="dt-year-mo is-active"><div class="dt-year-name">Feb</div><div class="dt-year-meta">8 events</div></div><div class="dt-year-mo"><div class="dt-year-name">Mar</div><div class="dt-year-meta">1 event</div></div><div class="dt-year-mo"><div class="dt-year-name">Apr</div><div class="dt-year-meta">5 events</div></div><div class="dt-year-mo"><div class="dt-year-name">May</div><div class="dt-year-meta">2 events</div></div><div class="dt-year-mo"><div class="dt-year-name">Jun</div><div class="dt-year-meta">7 events</div></div><div class="dt-year-mo"><div class="dt-year-name">Jul</div><div class="dt-year-meta">4 events</div></div><div class="dt-year-mo"><div class="dt-year-name">Aug</div><div class="dt-year-meta">6 events</div></div><div class="dt-year-mo"><div class="dt-year-name">Sep</div><div class="dt-year-meta">3 events</div></div><div class="dt-year-mo"><div class="dt-year-name">Oct</div><div class="dt-year-meta">2 events</div></div><div class="dt-year-mo"><div class="dt-year-name">Nov</div><div class="dt-year-meta">1 event</div></div><div class="dt-year-mo"><div class="dt-year-name">Dec</div><div class="dt-year-meta">9 events</div></div></div>' +
        '<div class="dt-rec" style="max-width:300px;"><div class="dt-rec-row"><label>Every</label><input class="dt-rec-input" value="1" readonly><select class="dt-rec-select"><option>week</option></select></div><div class="dt-rec-row"><label>On</label><div class="dt-rec-days"><button class="dt-rec-day">S</button><button class="dt-rec-day is-picked">M</button><button class="dt-rec-day">T</button><button class="dt-rec-day is-picked">W</button><button class="dt-rec-day">T</button><button class="dt-rec-day is-picked">F</button><button class="dt-rec-day">S</button></div></div><div class="dt-rec-summary">Every <b>Mon, Wed, Fri</b></div></div>' +
      '</div>';
  };

  // ===== Color tools pack =====
  P['components/color-tools-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;max-width:680px;">' +
        '<div class="ct-sq"><div class="ct-sq-area" style="--h:280;"><div class="ct-sq-cursor" style="--sx:70%;--sy:30%;"></div></div><div class="ct-sq-hue"><div class="ct-sq-hue-thumb" style="--hp:78%;"></div></div><div class="ct-sq-out"><div class="ct-sq-swatch" style="--out:#c4b5fd;"></div><input class="ct-sq-hex" value="#C4B5FD" readonly></div></div>' +
        '<div class="ct-ctr" style="max-width:300px;"><div class="ct-ctr-preview"><h4>Sample heading</h4><p>Body text passes WCAG AAA standards.</p></div><div class="ct-ctr-result"><div class="ct-ctr-ratio"><b>12.4</b> : 1</div><div class="ct-ctr-grades"><span class="ct-ctr-grade pass">AA</span><span class="ct-ctr-grade pass">AAA</span></div></div></div>' +
      '</div>';
  };

  // ===== Permissions pack =====
  P['components/permissions-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:1rem;max-width:540px;width:100%;">' +
        '<div class="pm-role" style="max-width:300px;"><div class="pm-role-head"><div class="pm-role-ic">A</div><div><div class="pm-role-name">Admin</div><div class="pm-role-count">5 members</div></div></div><ul class="pm-role-perms"><li>Read all</li><li>Write all</li><li>Manage members</li><li class="no">Delete workspace</li></ul></div>' +
        '<div class="pm-cmp" style="max-width:540px;"><div class="pm-cmp-col"><div class="pm-cmp-name">Viewer</div><ul class="pm-cmp-perms"><li>Read</li><li class="no">Write</li><li class="no">Delete</li></ul></div><div class="pm-cmp-col is-active"><div class="pm-cmp-name">Member</div><ul class="pm-cmp-perms"><li>Read</li><li>Write</li><li class="no">Delete</li></ul></div><div class="pm-cmp-col"><div class="pm-cmp-name">Admin</div><ul class="pm-cmp-perms"><li>Read</li><li>Write</li><li>Delete</li></ul></div></div>' +
      '</div>';
  };

  // ===== Team org pack =====
  P['components/team-org-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:0.6rem;max-width:540px;width:100%;">' +
        '<div class="to-member" style="max-width:540px;"><div class="to-member-avatar"></div><div><div class="to-member-name">Maria Rivera</div><div class="to-member-email">maria@acme.io</div></div><div class="to-member-last">2h ago</div><button class="to-member-role">Admin</button><button class="to-member-more">⋯</button></div>' +
        '<div class="to-pending" style="max-width:540px;"><div class="to-pending-ic"></div><div><div class="to-pending-email">ben@acme.io</div><div class="to-pending-meta">Invited 2 days ago · Viewer</div></div><div class="to-pending-actions"><button>Resend</button><button class="revoke">Revoke</button></div></div>' +
        '<div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="to-role owner">Owner</span><span class="to-role admin">Admin</span><span class="to-role member">Member</span><span class="to-role viewer">Viewer</span><span class="to-role billing">Billing</span><span class="to-role guest">Guest</span></div>' +
      '</div>';
  };

  // ===== API keys pack =====
  P['components/api-keys-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:0.7rem;max-width:540px;width:100%;">' +
        '<div class="ak-row" style="max-width:540px;"><div><div class="ak-row-name">Production key</div><div class="ak-row-value"><div class="ak-row-key">sk-live-3a2b1c8d9f87...4321</div><button class="ak-row-copy">⧉</button></div><div class="ak-row-meta"><span>Created <b>Aug 1</b></span><span>Last used <b>2h ago</b></span></div></div><button class="ak-row-revoke">Revoke</button></div>' +
        '<div class="ak-rate" style="max-width:340px;"><div class="ak-rate-head"><div class="ak-rate-label">Rate limit</div><div class="ak-rate-val">7,200 / 10,000</div></div><div class="ak-rate-bar"><i style="--p:72%"></i></div><div class="ak-rate-meta"><span>Resets in 18 min</span><span>72%</span></div></div>' +
        '<div class="ak-log ak-log-GET" style="max-width:540px;"><div class="ak-log-method GET">GET</div><div class="ak-log-path">/v1/users/me</div><div class="ak-log-code ok">200</div><div class="ak-log-time">42ms</div></div>' +
      '</div>';
  };

  // ===== Dashboard blocks =====
  P['components/dashboard-blocks.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:1rem;max-width:680px;width:100%;">' +
        '<div class="db db-rev" style="max-width:540px;"><div class="db-head"><h2 class="db-title">Revenue</h2><a class="db-action">View →</a></div><div class="db-rev-amt">$48,210</div><div class="db-rev-delta">+18%</div><div class="db-rev-chart"></div></div>' +
        '<div class="db db-top" style="max-width:420px;"><div class="db-head"><h2 class="db-title">Top products</h2></div><div class="db-top-list"><div class="db-top-row"><div class="db-top-rank">1</div><div class="db-top-thumb"></div><div><div class="db-top-name">Aurora Pro</div><div class="db-top-sales">428 sold</div></div><div class="db-top-amt">$12,420</div></div><div class="db-top-row"><div class="db-top-rank">2</div><div class="db-top-thumb" style="background:linear-gradient(135deg,#06b6d4,#8b5cf6);"></div><div><div class="db-top-name">Apollo Mini</div><div class="db-top-sales">312 sold</div></div><div class="db-top-amt">$8,210</div></div></div></div>' +
        '<div class="db db-board" style="max-width:340px;"><div class="db-head"><h2 class="db-title">Leaderboard</h2></div><div class="db-board-row"><div class="db-board-rank">1</div><div class="db-board-avatar"></div><div class="db-board-name">Maria Rivera</div><div class="db-board-pts">8,240</div></div><div class="db-board-row"><div class="db-board-rank">2</div><div class="db-board-avatar" style="background:linear-gradient(135deg,#06b6d4,#8b5cf6);"></div><div class="db-board-name">Lena Park</div><div class="db-board-pts">7,180</div></div><div class="db-board-row"><div class="db-board-rank">3</div><div class="db-board-avatar" style="background:linear-gradient(135deg,#f59e0b,#ef4444);"></div><div class="db-board-name">Ben Tan</div><div class="db-board-pts">6,420</div></div></div>' +
      '</div>';
  };

  // ===== Misc watermelon pack =====
  P['components/misc-watermelon-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center;justify-content:center;max-width:680px;">' +
        '<button class="mwm-theme is-dark"></button>' +
        '<div class="mwm-info" style="max-width:320px;"><div class="mwm-info-icon">i</div><div class="mwm-info-body"><b>FYI</b>Your trial expires in 7 days.</div></div>' +
        '<div class="mwm-info mwm-info-warn" style="max-width:320px;"><div class="mwm-info-icon">!</div><div class="mwm-info-body"><b>Heads up</b>Two-factor required.</div></div>' +
        '<div class="mwm-info mwm-info-success" style="max-width:320px;"><div class="mwm-info-icon">✓</div><div class="mwm-info-body"><b>Synced</b>All changes saved to cloud.</div></div>' +
        '<div class="mwm-stat" style="max-width:200px;"><div class="mwm-stat-label">Active users</div><div class="mwm-stat-value">1,284</div><div class="mwm-stat-change up">+12%</div></div>' +
        '<div class="mwm-bctrail"><a>Workspace</a><span class="mwm-bctrail-sep">›</span><a>Projects</a><span class="mwm-bctrail-sep">›</span><span class="is-current">Aurora 2.0</span></div>' +
      '</div>';
  };

  // ===== Blocks watermelon pack =====
  P['blocks/blocks-watermelon-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center;justify-content:center;max-width:680px;">' +
        '<div class="bw-freq"><button class="bw-freq-opt">Daily</button><button class="bw-freq-opt is-active">Weekly</button><button class="bw-freq-opt">Monthly</button></div>' +
        '<div class="bw-statp">Operational</div>' +
        '<div class="bw-statp bw-statp-warn">Degraded</div>' +
        '<div class="bw-statp bw-statp-error">Outage</div>' +
        '<div class="bw-statp bw-statp-info">Maintenance</div>' +
        '<span class="bw-chip">design<button class="bw-chip-x">×</button></span>' +
        '<span class="bw-chip">motion<button class="bw-chip-x">×</button></span>' +
        '<div class="bw-avstack"><div class="bw-avstack-item">A</div><div class="bw-avstack-item" style="background:linear-gradient(135deg,#06b6d4,#8b5cf6);">B</div><div class="bw-avstack-item" style="background:linear-gradient(135deg,#f59e0b,#ef4444);">C</div><div class="bw-avstack-item bw-avstack-more">+8</div></div>' +
        '<div class="bw-dropbtn"><button class="bw-dropbtn-main">Deploy</button><button class="bw-dropbtn-chev"></button></div>' +
        '<div class="bw-fab-bar"><button class="bw-fab-btn is-active">📝</button><div class="bw-fab-divider"></div><button class="bw-fab-btn">📷</button><button class="bw-fab-btn">🎬</button><button class="bw-fab-btn">📊</button></div>' +
      '</div>';
  };

  // ===== Stepper pack =====
  P['blocks/stepper-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center;justify-content:center;">' +
        ['stp-clean','stp-pill','stp-large','stp-gradient','stp-outline','stp-bordered'].map(function (cls) {
          return '<div class="stp ' + cls + '"><button class="stp-minus">−</button><input class="stp-val" value="3" readonly><button class="stp-plus">+</button></div>';
        }).join('') +
      '</div>';
  };

  // ===== Quick pack (blocks) =====
  P['blocks/quick-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:flex-start;justify-content:center;max-width:680px;">' +
        '<div class="qp-step"><span class="qp-step-dot is-done"></span><span class="qp-step-dot is-done"></span><span class="qp-step-dot is-active"></span><span class="qp-step-dot"></span><span class="qp-step-dot"></span></div>' +
        '<div class="qp-frac"><button class="qp-frac-opt">⅓</button><button class="qp-frac-opt is-picked">½</button><button class="qp-frac-opt">⅔</button><button class="qp-frac-opt">¾</button></div>' +
        '<div class="qp-paste" style="max-width:280px;"><div class="qp-paste-head"><span>Recent clipboard</span></div><div class="qp-paste-item"><div class="qp-paste-icon">T</div><div class="qp-paste-prev">npm install aurora-ui</div><kbd>⌘1</kbd></div><div class="qp-paste-item"><div class="qp-paste-icon">U</div><div class="qp-paste-prev">https://aurora.app/docs</div><kbd>⌘2</kbd></div></div>' +
        '<div class="qp-switch"><div class="qp-switch-tile is-active"><span class="qp-switch-tile-name">Aurora</span></div><div class="qp-switch-tile"><span class="qp-switch-tile-name">Slack</span></div><div class="qp-switch-tile"><span class="qp-switch-tile-name">Mail</span></div></div>' +
      '</div>';
  };

  // ===== Pagination pack =====
  P['components/pagination-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:1rem;align-items:center;">' +
        '<div class="pg"><button>‹</button><button>1</button><button class="is-active">2</button><button>3</button><span class="pg-ellipsis">…</span><button>10</button><button>›</button></div>' +
        '<div class="pg pg-compact"><button>‹</button><button class="is-active">1</button><button>2</button><button>3</button><button>›</button></div>' +
        '<div class="pg pg-arrow"><button>‹ Prev</button><div class="pg-arrow-info">Page <b>2</b> of <b>14</b></div><button>Next ›</button></div>' +
        '<button class="pg-load">Load more <span class="pg-load-meta">(120 of 480)</span></button>' +
      '</div>';
  };

  // ===== Breadcrumb pack =====
  P['components/breadcrumb-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:0.7rem;align-items:flex-start;">' +
        '<div class="bc bc-slash"><a>Home</a><span class="bc-sep"></span><a>Projects</a><span class="bc-sep"></span><span class="is-current">Aurora 2.0</span></div>' +
        '<div class="bc bc-chev"><a>Home</a><span class="bc-sep"></span><a>Projects</a><span class="bc-sep"></span><span class="is-current">Aurora 2.0</span></div>' +
        '<div class="bc bc-pill"><a>Home</a><a>Projects</a><span class="is-current">Aurora</span></div>' +
        '<div class="bc bc-cap"><a>Home</a><a>Projects</a><span class="is-current">Aurora</span></div>' +
        '<button class="bc-mob">Back to Projects</button>' +
      '</div>';
  };

  // ===== Feature comparison =====
  P['components/feature-comparison.css'] = function (target) {
    target.innerHTML =
      '<table class="fcmp fcmp-3col fcmp-compact" style="max-width:680px;">' +
        '<thead><tr><th>Feature</th><th>Free</th><th class="is-featured"><span class="fcmp-plan-name">Pro</span><span class="fcmp-plan-price">$29</span><button class="fcmp-plan-cta">Upgrade</button></th><th>Enterprise</th></tr></thead>' +
        '<tbody>' +
          '<tr><td>Projects</td><td>3</td><td class="is-featured">Unlimited</td><td>Unlimited</td></tr>' +
          '<tr><td>Storage</td><td>10 GB</td><td class="is-featured">100 GB</td><td>1 TB</td></tr>' +
          '<tr><td>Priority support</td><td class="fcmp-no"></td><td class="fcmp-yes is-featured"></td><td class="fcmp-yes"></td></tr>' +
          '<tr><td>SSO</td><td class="fcmp-no"></td><td class="fcmp-no is-featured"></td><td class="fcmp-prem"></td></tr>' +
        '</tbody>' +
      '</table>';
  };

  // ===== Inline edit pack =====
  P['blocks/inline-edit-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:flex-start;justify-content:center;max-width:680px;">' +
        '<div class="iep-action"><button class="iep-action-btn is-primary">Save</button><button class="iep-action-btn">Discard <kbd>⌘Z</kbd></button></div>' +
        '<div class="iep-status iep-status-doing">In progress</div>' +
        '<div class="iep-status iep-status-done">Done</div>' +
        '<div class="iep-status iep-status-todo">To do</div>' +
        '<div class="iep-splitbtn"><button class="iep-splitbtn-main">Save</button><button class="iep-splitbtn-toggle"></button></div>' +
        '<div class="iep-labels"><div class="iep-label iep-label-bug">bug</div><div class="iep-label iep-label-feat is-picked">feat</div><div class="iep-label iep-label-design">design</div><div class="iep-label iep-label-docs">docs</div></div>' +
        '<div class="iep-floatin"><input value="Maria Rivera" placeholder=" "><label>Full name</label></div>' +
      '</div>';
  };

  // ===== Carousel pack =====
  P['components/carousel-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:1rem;max-width:560px;width:100%;">' +
        '<div class="car-split is-open" style="max-width:380px;"><div class="car-split-head"><div class="car-split-icon">📋</div><div class="car-split-title">Project details</div><div class="car-split-toggle"></div></div><div class="car-split-body">Click to expand and see the full project description here.</div></div>' +
        '<div class="car-rad" style="max-width:280px;height:280px;"><div class="car-rad-center">⌘</div><div class="car-rad-item">A</div><div class="car-rad-item">B</div><div class="car-rad-item">C</div><div class="car-rad-item">D</div><div class="car-rad-item">E</div><div class="car-rad-item">F</div></div>' +
      '</div>';
  };

  // ===== Announcement bars =====
  P['components/announcement-bars.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:0.5rem;max-width:680px;width:100%;">' +
        '<div class="an an-grad">🎉 <b>Black Friday: 50% off</b> all plans this weekend! <a>Get the deal →</a></div>' +
        '<div class="an an-sale"><span class="an-sale-tag">SALE</span>Limited offer · Use code <span class="an-sale-code">BLACK50</span></div>' +
        '<div class="an an-beta">Aurora 2.0 is now in public beta · <a style="color:#fbbf24;">Learn more</a></div>' +
        '<div class="an an-status">All systems operational</div>' +
        '<div class="an an-status is-warn">⚠ Degraded performance · investigating</div>' +
      '</div>';
  };

  // ===== Share cards =====
  P['components/share-cards.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:1rem;max-width:540px;width:100%;">' +
        '<a class="sh-og" style="max-width:520px;"><div class="sh-og-img"></div><div class="sh-og-body"><div class="sh-og-host">AURORA.APP</div><div class="sh-og-title">Build at the speed of thought</div><div class="sh-og-desc">Aurora gives your team the design system, components, and primitives from day one.</div></div></a>' +
        '<a class="sh-og-c" style="max-width:520px;"><div class="sh-og-c-img"></div><div class="sh-og-c-body"><div class="sh-og-c-host">DOCS.AURORA.APP</div><div class="sh-og-c-title">Quickstart guide</div><div class="sh-og-c-desc">Get up and running in 5 minutes.</div></div></a>' +
      '</div>';
  };

  // ===== Gallery pack =====
  P['components/gallery-pack.css'] = function (target) {
    target.innerHTML =
      '<div class="gal-mos" style="max-width:680px;height:280px;"><div></div><div></div><div></div><div></div><div></div></div>';
  };

  // ===== Chat bubble pack =====
  P['components/chat-bubble-pack.css'] = function (target) {
    target.innerHTML =
      '<div class="cb-imessage" style="display:flex;flex-direction:column;gap:0.3rem;max-width:380px;width:100%;padding:1rem;background:#000;border-radius:14px;">' +
        '<div class="cb them">Hey! How\'s the project going?<span class="cb-time">10:42</span></div>' +
        '<div class="cb mine">Pretty good, shipped yesterday 🎉<span class="cb-time">10:43</span></div>' +
        '<div class="cb them">Amazing! Coffee soon?<span class="cb-time">10:43</span></div>' +
        '<div class="cb mine">Definitely. Tuesday work?<span class="cb-time">10:45</span></div>' +
      '</div>';
  };

  // ===== Header pack additional rendering =====

  // ===== Carousel pack tile fallback content =====

  // ===== ai inputs pack =====
  P['ai/ai-inputs-pack.css'] = function (target) {
    packGrid(target, [
      { label: 'clean',    html: '<div class="aip aip-1" style="max-width:340px;width:100%;"><textarea class="aip-input" placeholder="Ask Aurora anything..." rows="2"></textarea><button class="aip-send">↑</button></div>' },
      { label: 'pill',     html: '<div class="aip aip-2" style="max-width:340px;width:100%;"><textarea class="aip-input" placeholder="Type your message..." rows="2"></textarea><button class="aip-send">↑</button></div>' },
      { label: 'large',    html: '<div class="aip aip-3" style="max-width:340px;width:100%;"><textarea class="aip-input" placeholder="Compose an email..." rows="3"></textarea></div>' },
      { label: 'minimal',  html: '<div class="aip aip-4" style="max-width:340px;width:100%;"><textarea class="aip-input" placeholder="Search..." rows="1"></textarea></div>' },
      { label: 'gradient', html: '<div class="aip aip-5" style="max-width:340px;width:100%;"><textarea class="aip-input" placeholder="Generate with AI..." rows="2"></textarea><button class="aip-send">→</button></div>' }
    ], null, 380);
  };

  // ===== Nav pack =====
  P['components/nav-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:1rem;max-width:540px;width:100%;align-items:center;">' +
        '<div class="segctl"><button class="segctl-opt is-active">Day</button><button class="segctl-opt">Week</button><button class="segctl-opt">Month</button><div class="segctl-pill" style="--segctl-x:3px;--segctl-w:62px;"></div></div>' +
        '<div style="display:flex;gap:0.6rem;align-items:center;">' +
          '<a class="ghs"><span class="ghs-label">Star</span><span class="ghs-count">12.4k</span></a>' +
          '<button class="nbell"><span class="nbell-icon"></span><span class="nbell-dot">3</span></button>' +
        '</div>' +
      '</div>';
  };

  // ===== Tree menu =====
  P['components/tree-menu.css'] = function (target) {
    target.innerHTML =
      '<ul class="tmenu" style="max-width:280px;">' +
        '<li class="tmenu-node is-open"><button class="tmenu-row"><span class="tmenu-arr"></span><span class="tmenu-icon"></span>Workspace</button><ul class="tmenu-children"><li class="tmenu-node is-open"><button class="tmenu-row"><span class="tmenu-arr"></span><span class="tmenu-icon"></span>Projects</button><ul class="tmenu-children"><li class="tmenu-node is-leaf is-active"><button class="tmenu-row"><span class="tmenu-arr"></span><span class="tmenu-icon" style="background:rgba(139,92,246,0.3);"></span>Aurora 2.0</button></li><li class="tmenu-node is-leaf"><button class="tmenu-row"><span class="tmenu-arr"></span><span class="tmenu-icon"></span>Apollo</button></li></ul></li><li class="tmenu-node is-leaf"><button class="tmenu-row"><span class="tmenu-arr"></span><span class="tmenu-icon"></span>Settings</button></li></ul></li>' +
      '</ul>';
  };
  P['components/tree-menu.js'] = P['components/tree-menu.css'];

  // ===== List pack =====
  P['components/list-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:1rem;max-width:480px;width:100%;">' +
        '<div class="lp-todo">' +
          '<div class="lp-todo-item is-done"><button class="lp-todo-tick"></button><span class="lp-todo-text">Set up workspace</span></div>' +
          '<div class="lp-todo-item is-done"><button class="lp-todo-tick"></button><span class="lp-todo-text">Invite team</span></div>' +
          '<div class="lp-todo-item"><button class="lp-todo-tick"></button><span class="lp-todo-text">Ship first feature</span><span class="lp-todo-tag urgent">Urgent</span></div>' +
        '</div>' +
        '<div class="lp-act">' +
          '<a class="lp-act-item"><div class="lp-act-ic">⚙</div><div class="lp-act-body"><b>Settings</b><small>Account, billing, notifications</small></div><div class="lp-act-chev">›</div></a>' +
          '<a class="lp-act-item"><div class="lp-act-ic">🔑</div><div class="lp-act-body"><b>API keys</b><small>Manage your tokens</small></div><div class="lp-act-chev">›</div></a>' +
          '<a class="lp-act-item danger"><div class="lp-act-ic">⚠</div><div class="lp-act-body"><b>Delete account</b><small>Permanent action</small></div><div class="lp-act-chev">›</div></a>' +
        '</div>' +
      '</div>';
  };

  // ===== Tabs pack 1 (existing) — already covered? skip =====

  // ====================================================
  // DATA-VIZ CHARTS — every chart JS gets a working preview with sample data
  // ====================================================

  function chartStage(target, w, h) {
    target.innerHTML = '<div class="dapp-chart-stage" style="width:100%;display:flex;align-items:center;justify-content:center;padding:0.5rem;"></div>';
    var stage = target.querySelector('.dapp-chart-stage');
    if (w) stage.style.maxWidth = w + 'px';
    return stage;
  }

  P['data-viz/chart-bar.js'] = function (target) {
    var stage = chartStage(target, 540);
    if (window.ChartBar) ChartBar.create(stage, {
      data: [
        { label: 'Jan', value: 30 }, { label: 'Feb', value: 45 },
        { label: 'Mar', value: 28 }, { label: 'Apr', value: 62 },
        { label: 'May', value: 51 }, { label: 'Jun', value: 78 },
        { label: 'Jul', value: 66 }, { label: 'Aug', value: 89 }
      ],
      color: '#8b5cf6', width: 520, height: 240, showAxis: true, showGrid: true
    });
  };

  P['data-viz/chart-line.js'] = function (target) {
    var stage = chartStage(target, 540);
    if (window.ChartLine) ChartLine.create(stage, {
      data: [
        { label: 'Mon', value: 12 }, { label: 'Tue', value: 18 },
        { label: 'Wed', value: 14 }, { label: 'Thu', value: 22 },
        { label: 'Fri', value: 28 }, { label: 'Sat', value: 24 },
        { label: 'Sun', value: 32 }
      ],
      color: '#8b5cf6', fill: 'rgba(139,92,246,0.2)', smooth: true,
      width: 520, height: 240, dots: true, showAxis: true, showGrid: true
    });
  };

  P['data-viz/chart-area.js'] = function (target) {
    var stage = chartStage(target, 540);
    if (window.ChartArea) ChartArea.create(stage, {
      data: [
        { label: 'Mon', values: [4, 6, 3] }, { label: 'Tue', values: [8, 4, 6] },
        { label: 'Wed', values: [6, 8, 5] }, { label: 'Thu', values: [10, 6, 4] },
        { label: 'Fri', values: [12, 8, 7] }, { label: 'Sat', values: [9, 11, 6] },
        { label: 'Sun', values: [14, 10, 8] }
      ],
      colors: ['#8b5cf6', '#22d3ee', '#ec4899'], stacked: true,
      width: 520, height: 240, showAxis: true, showGrid: true
    });
  };

  P['data-viz/chart-pie.js'] = function (target) {
    var stage = chartStage(target, 360);
    if (window.ChartPie) ChartPie.create(stage, {
      data: [
        { label: 'Direct', value: 40, color: '#8b5cf6' },
        { label: 'Search', value: 25, color: '#22d3ee' },
        { label: 'Social', value: 20, color: '#ec4899' },
        { label: 'Other',  value: 15, color: '#fbbf24' }
      ],
      width: 300, donut: true, donutThickness: 28, showLegend: true,
      centerLabel: '100%', centerMeta: 'visits'
    });
  };

  P['data-viz/chart-gauge.js'] = function (target) {
    var stage = chartStage(target, 300);
    if (window.ChartGauge) ChartGauge.create(stage, {
      value: 72, max: 100, size: 200, label: '72%',
      color: '#8b5cf6', thickness: 18, arc: 270, startAngle: -135
    });
  };

  P['data-viz/chart-radar.js'] = function (target) {
    var stage = chartStage(target, 380);
    if (window.ChartRadar) ChartRadar.create(stage, {
      axes: ['Speed', 'Power', 'Range', 'Agility', 'Cost', 'Style'],
      series: [
        { name: 'Model A', values: [80, 60, 90, 70, 50, 85], color: '#8b5cf6' },
        { name: 'Model B', values: [60, 90, 50, 80, 70, 65], color: '#ec4899' }
      ],
      max: 100, size: 320, rings: 4
    });
  };

  P['data-viz/chart-funnel.js'] = function (target) {
    var stage = chartStage(target, 400);
    if (window.ChartFunnel) ChartFunnel.create(stage, {
      data: [
        { label: 'Visits',  value: 1000 },
        { label: 'Signups', value: 320 },
        { label: 'Active',  value: 110 },
        { label: 'Paying',  value: 32 }
      ],
      color: '#8b5cf6', showPercent: true, showAbs: true
    });
  };

  P['data-viz/chart-sankey.js'] = function (target) {
    var stage = chartStage(target, 640);
    if (window.ChartSankey) ChartSankey.create(stage, {
      nodes: ['Start', 'Visit', 'Signup', 'Active', 'Churned', 'Paying'],
      links: [
        { from: 0, to: 1, value: 1000 },
        { from: 1, to: 2, value: 320 },
        { from: 1, to: 4, value: 680 },
        { from: 2, to: 3, value: 220 },
        { from: 2, to: 4, value: 100 },
        { from: 3, to: 5, value: 90 }
      ],
      width: 620, height: 320
    });
  };

  P['data-viz/chart-treemap.js'] = function (target) {
    var stage = chartStage(target, 540);
    if (window.ChartTreemap) ChartTreemap.create(stage, {
      data: [
        { label: 'Engineering', value: 40, color: '#8b5cf6' },
        { label: 'Design',      value: 25, color: '#22d3ee' },
        { label: 'Product',     value: 20, color: '#ec4899' },
        { label: 'Marketing',   value: 10, color: '#fbbf24' },
        { label: 'Other',       value: 5,  color: '#4ade80' }
      ],
      width: 520, height: 300
    });
  };

  P['data-viz/chart-network.js'] = function (target) {
    var stage = chartStage(target, 620);
    if (!window.ChartNetwork) return;
    var nodes = [];
    var groups = [1, 2, 3, 4];
    for (var i = 0; i < 14; i++) {
      nodes.push({ id: 'n' + i, label: 'N' + i, group: groups[i % groups.length] });
    }
    var links = [
      { source: 'n0', target: 'n1' }, { source: 'n0', target: 'n2' },
      { source: 'n0', target: 'n3' }, { source: 'n1', target: 'n4' },
      { source: 'n1', target: 'n5' }, { source: 'n2', target: 'n6' },
      { source: 'n2', target: 'n7' }, { source: 'n3', target: 'n8' },
      { source: 'n4', target: 'n9' }, { source: 'n5', target: 'n10' },
      { source: 'n6', target: 'n11' }, { source: 'n7', target: 'n12' },
      { source: 'n8', target: 'n13' }, { source: 'n9', target: 'n10' },
      { source: 'n11', target: 'n12' }
    ];
    ChartNetwork.create(stage, { nodes: nodes, links: links, width: 600, height: 320 });
  };

  P['data-viz/count-up.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.9rem;">' +
        '<button class="dapp-cu-replay" style="padding:0.45rem 1rem;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:6px;color:#fff;font-weight:600;cursor:pointer;font-size:0.82rem;">↻ Replay</button>' +
        '<div style="display:flex;gap:2.4rem;flex-wrap:wrap;justify-content:center;">' +
          '<div style="text-align:center;"><div data-cu="1248" style="font-size:3rem;font-weight:800;letter-spacing:-0.03em;background:linear-gradient(135deg,#8b5cf6,#ec4899);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;">0</div><div style="font-size:0.74rem;color:rgba(255,255,255,0.55);letter-spacing:0.04em;text-transform:uppercase;">Users</div></div>' +
          '<div style="text-align:center;"><div data-cu="89" data-cu-suffix="%" style="font-size:3rem;font-weight:800;letter-spacing:-0.03em;background:linear-gradient(135deg,#22d3ee,#8b5cf6);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;">0</div><div style="font-size:0.74rem;color:rgba(255,255,255,0.55);letter-spacing:0.04em;text-transform:uppercase;">Uptime</div></div>' +
          '<div style="text-align:center;"><div data-cu="42500" data-cu-prefix="$" style="font-size:3rem;font-weight:800;letter-spacing:-0.03em;background:linear-gradient(135deg,#f59e0b,#ef4444);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;">$0</div><div style="font-size:0.74rem;color:rgba(255,255,255,0.55);letter-spacing:0.04em;text-transform:uppercase;">Revenue</div></div>' +
        '</div>' +
      '</div>';
    function run() {
      target.querySelectorAll('[data-cu]').forEach(function (el) {
        var target_v = parseInt(el.dataset.cu, 10);
        var pre = el.dataset.cuPrefix || '';
        var suf = el.dataset.cuSuffix || '';
        var dur = 1400, t0 = performance.now();
        (function tick(now) {
          var p = Math.min(1, (now - t0) / dur);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = pre + Math.floor(target_v * eased).toLocaleString() + suf;
          if (p < 1) requestAnimationFrame(tick);
        })(performance.now());
      });
    }
    run();
    target.querySelector('.dapp-cu-replay').addEventListener('click', run);
  };

  P['data-viz/heatmap-calendar.js'] = function (target) {
    var stage = chartStage(target, 720);
    stage.style.justifyContent = 'flex-start';
    if (!window.HeatmapCalendar) return;
    var today = new Date();
    var data = [];
    for (var i = 0; i < 365; i++) {
      var d = new Date(today); d.setDate(d.getDate() - i);
      var iso = d.toISOString().split('T')[0];
      var v = Math.random() < 0.35 ? Math.floor(Math.random() * 10) : 0;
      if (v) data.push({ date: iso, value: v });
    }
    HeatmapCalendar.create(stage, { data: data, weeks: 52 });
  };

  P['data-viz/progress-ring.js'] = function (target) {
    target.innerHTML = '<div style="display:flex;gap:1.4rem;flex-wrap:wrap;justify-content:center;" id="dapp-rings"></div>';
    var host = target.querySelector('#dapp-rings');
    [25, 50, 75, 90].forEach(function (v) {
      var d = document.createElement('div');
      d.style.cssText = 'text-align:center;';
      d.innerHTML = '<div class="pring" data-progress="' + v + '" data-size="100"></div><div style="font-size:0.75rem;color:rgba(255,255,255,0.55);margin-top:0.4rem;">' + v + '%</div>';
      host.appendChild(d);
    });
    if (window.ProgressRing) ProgressRing.init('.pring');
  };

  P['data-viz/sparkline.js'] = function (target) {
    target.innerHTML = '<div style="display:flex;flex-direction:column;gap:1rem;width:100%;max-width:480px;"></div>';
    var host = target.firstChild;
    [
      [4, 6, 3, 8, 5, 9, 6, 10, 7, 11, 8, 12, 9, 14],
      [12, 10, 11, 9, 8, 9, 7, 8, 6, 7, 5, 6, 4, 5],
      [3, 5, 4, 7, 6, 9, 8, 6, 9, 11, 8, 12, 10, 13]
    ].forEach(function (data, i) {
      var label = ['Revenue', 'Churn', 'Sessions'][i];
      var trend = ['↑ +24%', '↓ -12%', '↑ +18%'][i];
      var color = ['#10b981', '#ef4444', '#8b5cf6'][i];
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:1rem;padding:0.7rem 1rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;';
      row.innerHTML =
        '<div style="flex:1;"><div style="font-size:0.78rem;color:rgba(255,255,255,0.5);">' + label + '</div><div style="font-size:1.1rem;font-weight:700;color:' + color + ';">' + trend + '</div></div>' +
        '<div class="dapp-spark-' + i + '" style="width:120px;height:40px;"></div>';
      host.appendChild(row);
      if (window.Sparkline) Sparkline.create(row.querySelector('.dapp-spark-' + i), {
        data: data, color: color, width: 120, height: 40, smooth: true, fill: true
      });
    });
  };

  P['data-viz/table.js'] = function (target) {
    target.innerHTML =
      '<table class="data-table" style="width:100%;max-width:640px;border-collapse:collapse;font-size:0.85rem;">' +
        '<thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr></thead>' +
        '<tbody>' +
          [
            ['Alice Chen','alice@acme.io','Admin','Active'],
            ['Ben Romero','ben@acme.io','Member','Active'],
            ['Cara Wu','cara@acme.io','Viewer','Invited'],
            ['Dan Park','dan@acme.io','Member','Active'],
            ['Eve Singh','eve@acme.io','Admin','Inactive']
          ].map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') +
        '</tbody>' +
      '</table>';
    if (window.Table) Table.init('.data-table', { sortable: true, hoverable: true });
  };

  P['data-viz/charts-pro.js'] = function (target) {
    target.innerHTML =
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem;width:100%;max-width:760px;">' +
        '<div class="cp-heat" data-cp-heat style="width:100%;"></div>' +
        '<div class="cp-donut" data-cp-donut style="margin:0 auto;"></div>' +
        '<div class="cp-sgrid" data-cp-sgrid style="grid-column:span 2;"></div>' +
      '</div>';
    if (window.ChartsPro) {
      ChartsPro.heatmap('[data-cp-heat]', { cols: 30, rows: 7 });
      ChartsPro.donut('[data-cp-donut]', {
        segments: [
          { value: 40, color: '#8b5cf6' },
          { value: 30, color: '#ec4899' },
          { value: 30, color: '#06b6d4' }
        ],
        centerLabel: '100', centerSub: 'total'
      });
      ChartsPro.sparkGrid('[data-cp-sgrid]', {
        cards: [
          { name: 'Visits',  value: '12.4k', dir: 'up',   bars: [0.4,0.6,0.5,0.7,0.6,0.8,0.7,0.9] },
          { name: 'Signups', value: '2.1k',  dir: 'up',   bars: [0.3,0.5,0.6,0.4,0.7,0.6,0.8,0.9] },
          { name: 'Churn',   value: '1.2%',  dir: 'down', bars: [0.9,0.7,0.8,0.6,0.5,0.6,0.4,0.3] }
        ]
      });
    }
  };

  // ====================================================
  // ANIMATIONS — replayable previews for every motion file
  // ====================================================

  function escA(s) {
    return String(s == null ? '' : s).replace(/[<>&"]/g, function (c) {
      return ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]);
    });
  }

  // Render a wall of animated tiles with a Replay button that re-triggers.
  function animWall(target, opts) {
    var items = opts.items || [];
    var defaultStyle = 'display:grid;place-items:center;padding:0.75rem 1rem;background:linear-gradient(135deg,#8b5cf6,#ec4899);color:#fff;font-weight:600;font-size:0.78rem;border-radius:8px;min-width:96px;min-height:48px;font-family:ui-monospace,monospace;';
    var tilesHtml = items.map(function (it, i) {
      var lbl = it.label != null ? it.label : it.cls.split(' ').pop();
      var style = it.style || defaultStyle;
      var caption = it.cls.split(' ').pop();
      return '<div class="dapp-anim-tile" style="display:flex;flex-direction:column;align-items:center;gap:0.35rem;">' +
        '<div class="' + escA(it.cls) + '" data-orig="' + escA(it.cls) + '" style="' + style + '">' + escA(lbl) + '</div>' +
        '<div style="font-size:0.62rem;color:rgba(255,255,255,0.5);font-family:ui-monospace,monospace;">' + escA(caption) + '</div>' +
      '</div>';
    }).join('');

    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.9rem;width:100%;">' +
        '<button class="dapp-anim-replay" style="padding:0.5rem 1.1rem;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:8px;color:#fff;font-weight:600;cursor:pointer;font-size:0.85rem;display:inline-flex;align-items:center;gap:0.4rem;">' +
          '<span style="font-size:0.95rem;">↻</span> Replay animations' +
        '</button>' +
        '<div style="display:flex;flex-wrap:wrap;gap:0.7rem 0.9rem;align-items:center;justify-content:center;max-width:760px;width:100%;padding:1rem;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:10px;">' +
          tilesHtml +
        '</div>' +
      '</div>';

    target.querySelector('.dapp-anim-replay').addEventListener('click', function () {
      target.querySelectorAll('.dapp-anim-tile > div[data-orig]').forEach(function (el) {
        var orig = el.dataset.orig;
        el.className = '';
        el.offsetHeight; // force reflow
        el.className = orig;
      });
    });
  }

  // ===== keyframes-pack.css =====
  P['animations/keyframes-pack.css'] = function (target) {
    animWall(target, {
      items: [
        { cls: 'kp kp-rubber-band' },
        { cls: 'kp kp-bounce-in' },
        { cls: 'kp kp-zoom-in' },
        { cls: 'kp kp-fade-in' },
        { cls: 'kp kp-shake' },
        { cls: 'kp kp-flip-in-x' },
        { cls: 'kp kp-roll-in' },
        { cls: 'kp kp-jello' }
      ]
    });
  };

  // ===== keyframes-pack-2.css =====
  P['animations/keyframes-pack-2.css'] = function (target) {
    animWall(target, {
      items: [
        { cls: 'kf2 kf2-jelly' },
        { cls: 'kf2 kf2-rubber' },
        { cls: 'kf2 kf2-jello' },
        { cls: 'kf2 kf2-wobble' },
        { cls: 'kf2 kf2-tada' },
        { cls: 'kf2 kf2-heartbeat' },
        { cls: 'kf2 kf2-pop-in' },
        { cls: 'kf2 kf2-bounce-strong' },
        { cls: 'kf2 kf2-zoom-in' },
        { cls: 'kf2 kf2-flip-x' },
        { cls: 'kf2 kf2-roll-in' },
        { cls: 'kf2 kf2-light-in' },
        { cls: 'kf2 kf2-blur-in' },
        { cls: 'kf2 kf2-drop-in' },
        { cls: 'kf2 kf2-swing' },
        { cls: 'kf2 kf2-slide-in-up' }
      ]
    });
  };

  // ===== keyframes.css =====
  P['animations/keyframes.css'] = function (target) {
    animWall(target, {
      items: [
        { cls: 'animate-fadeIn' },
        { cls: 'animate-fadeInUp' },
        { cls: 'animate-fadeInDown' },
        { cls: 'animate-fadeInLeft' },
        { cls: 'animate-fadeInRight' },
        { cls: 'animate-slideUp' },
        { cls: 'animate-slideDown' },
        { cls: 'animate-pulse' },
        { cls: 'animate-bounce' },
        { cls: 'animate-spin' }
      ]
    });
  };

  // ===== entry-exit-pack.css =====
  P['animations/entry-exit-pack.css'] = function (target) {
    animWall(target, {
      items: [
        { cls: 'ee ee-fade-in' },
        { cls: 'ee ee-fade-up' },
        { cls: 'ee ee-fade-down' },
        { cls: 'ee ee-fade-left' },
        { cls: 'ee ee-fade-right' },
        { cls: 'ee ee-zoom-in' },
        { cls: 'ee ee-scale-in' },
        { cls: 'ee ee-blur-in' },
        { cls: 'ee ee-slide-in-up' },
        { cls: 'ee ee-slide-in-down' },
        { cls: 'ee ee-rotate-in' },
        { cls: 'ee ee-bounce-in' },
        { cls: 'ee ee-flip-in-x' },
        { cls: 'ee ee-flip-in-y' },
        { cls: 'ee ee-wipe-in-right' },
        { cls: 'ee ee-wipe-in-bottom' }
      ]
    });
  };

  // ===== lottie-look.css =====
  P['animations/lottie-look.css'] = function (target) {
    animWall(target, {
      items: [
        { cls: 'lot lot-check',         label: '' },
        { cls: 'lot lot-cross',         label: '' },
        { cls: 'lot lot-spinner-orb',   label: '' },
        { cls: 'lot lot-heart-burst',   label: '' },
        { cls: 'lot lot-confetti-burst',label: '' },
        { cls: 'lot lot-rocket',        label: '' },
        { cls: 'lot lot-bell-shake',    label: '' },
        { cls: 'lot lot-thumbs-up-pop', label: '' },
        { cls: 'lot lot-clock-spin',    label: '' },
        { cls: 'lot lot-cloud-rain',    label: '' }
      ].map(function (it) {
        return Object.assign({}, it, { style: 'width:96px;height:96px;display:inline-block;background:rgba(255,255,255,0.04);border-radius:10px;padding:0;' });
      })
    });
  };

  // ===== page-transitions-2.css =====
  P['animations/page-transitions-2.css'] = function (target) {
    animWall(target, {
      items: [
        { cls: 'pt2 pt2-slide-up is-in' },
        { cls: 'pt2 pt2-fade-cross is-in' },
        { cls: 'pt2 pt2-curtain-up' },
        { cls: 'pt2 pt2-iris' },
        { cls: 'pt2 pt2-morph-clip is-in' },
        { cls: 'pt2 pt2-perspective-flip is-in' },
        { cls: 'pt2 pt2-ribbon-wipe' }
      ].map(function (it) {
        return Object.assign({}, it, { style: 'min-width:140px;min-height:80px;display:grid;place-items:center;background:linear-gradient(135deg,#8b5cf6,#ec4899);color:#fff;font-weight:600;border-radius:8px;font-size:0.78rem;overflow:hidden;position:relative;' });
      })
    });
  };

  // ===== transitions.css — hover-triggered =====
  P['animations/transitions.css'] = function (target) {
    var names = ['lift', 'scale', 'scale-sm', 'press', 'rotate', 'rotate-3d', 'glow', 'shimmer', 'underline', 'border'];
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.7rem;">' +
        '<div style="font-size:0.78rem;color:rgba(255,255,255,0.55);">Hover any tile to see its transition</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:0.7rem;align-items:center;justify-content:center;max-width:720px;padding:1.2rem;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:10px;">' +
          names.map(function (n) {
            return '<div class="tr-' + n + '" style="padding:0.75rem 1.1rem;background:linear-gradient(135deg,#8b5cf6,#ec4899);color:#fff;font-weight:600;border-radius:8px;font-size:0.78rem;cursor:pointer;font-family:ui-monospace,monospace;">' + n + '</div>';
          }).join('') +
        '</div>' +
      '</div>';
  };

  // ===== inview.css — IntersectionObserver entrance (apply is-inview to show) =====
  P['animations/inview.css'] = function (target) {
    animWall(target, {
      items: [
        { cls: 'inview-fade-up is-inview' },
        { cls: 'inview-fade-down is-inview' },
        { cls: 'inview-fade-left is-inview' },
        { cls: 'inview-fade-right is-inview' },
        { cls: 'inview-zoom is-inview' },
        { cls: 'inview-flip is-inview' },
        { cls: 'inview-blur is-inview' }
      ]
    });
  };

  // ===== aos-lite (CSS + JS) =====
  P['animations/aos-lite.css'] = function (target) {
    animWall(target, {
      items: [
        { cls: 'aos aos-fade is-aos-in' },
        { cls: 'aos aos-fade-up is-aos-in' },
        { cls: 'aos aos-fade-down is-aos-in' },
        { cls: 'aos aos-zoom-in is-aos-in' },
        { cls: 'aos aos-zoom-out is-aos-in' },
        { cls: 'aos aos-flip-up is-aos-in' }
      ]
    });
  };
  P['animations/aos-lite.js'] = P['animations/aos-lite.css'];

  // ===== scroll-animations.css — apply is-visible to trigger =====
  P['animations/scroll-animations.css'] = function (target) {
    animWall(target, {
      items: [
        { cls: 'scroll-fade-in is-visible' },
        { cls: 'scroll-slide-up is-visible' },
        { cls: 'scroll-slide-left is-visible' },
        { cls: 'scroll-slide-right is-visible' },
        { cls: 'scroll-scale-in is-visible' },
        { cls: 'scroll-rotate-in is-visible' }
      ]
    });
  };

  // ===== scroll-animations.js =====
  P['animations/scroll-animations.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.7rem;">' +
        '<div style="font-size:0.85rem;color:rgba(255,255,255,0.75);max-width:480px;text-align:center;">' +
          '<b>ScrollAnim</b> wires IntersectionObserver-based entrance, scroll-scrubbed progress, and parallax to your elements.' +
        '</div>' +
        '<pre style="margin:0.3rem 0;padding:0.7rem 0.9rem;background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.08);border-radius:8px;font-family:ui-monospace,monospace;font-size:0.78rem;line-height:1.55;color:#d4d4dc;max-width:540px;white-space:pre-wrap;">' +
          'ScrollAnim.reveal(\'.fade-up\', { threshold: 0.2 });\nScrollAnim.scrub(\'.hero\', { onUpdate: p =&gt; { /* 0..1 */ } });\nScrollAnim.progress(\'.progress-bar\');' +
        '</pre>' +
      '</div>';
  };

  // ===== spring.js — interactive drag-spring =====
  P['animations/spring.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.85rem;width:100%;max-width:520px;">' +
        '<div style="font-size:0.78rem;color:rgba(255,255,255,0.55);">Drag the dot — release to spring back.</div>' +
        '<div id="dapp-spring-stage" style="position:relative;width:100%;height:140px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;overflow:hidden;">' +
          '<div id="dapp-spring-dot" style="position:absolute;top:50%;left:50%;width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#8b5cf6,#ec4899);transform:translate(-50%,-50%);cursor:grab;box-shadow:0 8px 20px -4px rgba(139,92,246,0.5);touch-action:none;"></div>' +
        '</div>' +
      '</div>';
    var dot = document.getElementById('dapp-spring-dot');
    var dragging = false, sx = 0, sy = 0, cx = 0, cy = 0, raf;
    dot.addEventListener('pointerdown', function (e) {
      dragging = true; sx = e.clientX; sy = e.clientY;
      dot.style.cursor = 'grabbing';
      try { dot.setPointerCapture(e.pointerId); } catch (_) {}
      cancelAnimationFrame(raf);
    });
    dot.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      cx = e.clientX - sx; cy = e.clientY - sy;
      dot.style.transform = 'translate(calc(-50% + ' + cx + 'px), calc(-50% + ' + cy + 'px))';
    });
    dot.addEventListener('pointerup', function () {
      dragging = false; dot.style.cursor = 'grab';
      var start = performance.now();
      var sxn = cx, syn = cy;
      (function tick(now) {
        var t = (now - start) / 700;
        if (t >= 1) { dot.style.transform = 'translate(-50%, -50%)'; return; }
        var b = Math.exp(-5 * t) * Math.cos(11 * t);
        dot.style.transform = 'translate(calc(-50% + ' + (sxn * b) + 'px), calc(-50% + ' + (syn * b) + 'px))';
        raf = requestAnimationFrame(tick);
      })(performance.now());
    });
  };

  // ===== stagger.js — staggered fade-in =====
  P['animations/stagger.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.85rem;">' +
        '<button class="dapp-stagger-replay" style="padding:0.5rem 1.1rem;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:8px;color:#fff;font-weight:600;cursor:pointer;font-size:0.85rem;">↻ Replay stagger</button>' +
        '<div id="dapp-stagger-row" style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;">' +
          [1,2,3,4,5,6,7,8,9,10].map(function (n, i) {
            return '<div class="dapp-stagger-tile" style="width:48px;height:48px;background:linear-gradient(135deg,#8b5cf6,#ec4899);border-radius:8px;display:grid;place-items:center;color:#fff;font-weight:700;animation:dapp-stagger-fade 0.6s cubic-bezier(0.32,0.72,0,1) both;animation-delay:' + (i * 0.08) + 's;">' + n + '</div>';
          }).join('') +
        '</div>' +
        '<style>@keyframes dapp-stagger-fade {from{opacity:0;transform:translateY(20px) scale(0.8);}to{opacity:1;transform:none;}}</style>' +
      '</div>';
    target.querySelector('.dapp-stagger-replay').addEventListener('click', function () {
      target.querySelectorAll('.dapp-stagger-tile').forEach(function (t) {
        t.style.animation = 'none'; t.offsetHeight; t.style.animation = '';
      });
    });
  };

  // ===== timeline.js — sequenced animation demo =====
  P['animations/timeline.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.85rem;">' +
        '<button class="dapp-tl-replay" style="padding:0.5rem 1.1rem;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:8px;color:#fff;font-weight:600;cursor:pointer;font-size:0.85rem;">↻ Replay timeline</button>' +
        '<div style="display:flex;gap:1rem;align-items:center;padding:1rem;background:rgba(255,255,255,0.02);border-radius:10px;">' +
          '<div class="dapp-tl-a" style="width:48px;height:48px;background:#8b5cf6;border-radius:8px;animation:dapp-tl-a 0.5s ease both;"></div>' +
          '<div class="dapp-tl-b" style="width:48px;height:48px;background:#ec4899;border-radius:8px;animation:dapp-tl-b 0.5s ease 0.4s both;"></div>' +
          '<div class="dapp-tl-c" style="width:48px;height:48px;background:#06b6d4;border-radius:8px;animation:dapp-tl-c 0.5s ease 0.8s both;"></div>' +
        '</div>' +
        '<style>' +
          '@keyframes dapp-tl-a{from{transform:translateY(-30px);opacity:0;}to{transform:none;opacity:1;}}' +
          '@keyframes dapp-tl-b{from{transform:scale(0);}to{transform:scale(1);}}' +
          '@keyframes dapp-tl-c{from{transform:translateX(30px) rotate(90deg);opacity:0;}to{transform:none;opacity:1;}}' +
        '</style>' +
      '</div>';
    target.querySelector('.dapp-tl-replay').addEventListener('click', function () {
      ['.dapp-tl-a', '.dapp-tl-b', '.dapp-tl-c'].forEach(function (s) {
        var el = target.querySelector(s); if (!el) return;
        el.style.animation = 'none'; el.offsetHeight; el.style.animation = '';
      });
    });
  };

  // ===== physics.js — falling-ball demo =====
  P['animations/physics.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.6rem;">' +
        '<button class="dapp-phys-drop" style="padding:0.5rem 1.1rem;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:8px;color:#fff;font-weight:600;cursor:pointer;font-size:0.85rem;">Drop ball</button>' +
        '<div id="dapp-phys-stage" style="position:relative;width:100%;max-width:400px;height:220px;background:linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.2));border:1px solid rgba(255,255,255,0.06);border-radius:10px;overflow:hidden;">' +
          '<div style="position:absolute;left:0;right:0;bottom:0;height:2px;background:rgba(255,255,255,0.18);"></div>' +
        '</div>' +
      '</div>';
    var stage = target.querySelector('#dapp-phys-stage');
    target.querySelector('.dapp-phys-drop').addEventListener('click', function () {
      var ball = document.createElement('div');
      ball.style.cssText = 'position:absolute;left:50%;top:0;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 30% 30%,#ec4899,#8b5cf6);transform:translate(-50%,0);box-shadow:0 4px 12px rgba(139,92,246,0.5);';
      stage.appendChild(ball);
      var y = 0, v = 0, bouncing = true, last = performance.now();
      function tick(now) {
        var dt = Math.min(40, now - last) / 1000;
        last = now;
        v += 900 * dt;
        y += v * dt;
        var floor = stage.clientHeight - 28;
        if (y >= floor) { y = floor; v = -v * 0.55; if (Math.abs(v) < 30) bouncing = false; }
        ball.style.transform = 'translate(-50%, ' + y + 'px)';
        if (bouncing) requestAnimationFrame(tick);
        else setTimeout(function () { ball.remove(); }, 200);
      }
      requestAnimationFrame(tick);
    });
  };

  // ===== anime-recipes.js — colorful staggered pop =====
  P['animations/anime-recipes.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.85rem;">' +
        '<button class="dapp-rec-replay" style="padding:0.5rem 1.1rem;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:8px;color:#fff;font-weight:600;cursor:pointer;font-size:0.85rem;">↻ Replay recipes</button>' +
        '<div style="display:grid;grid-template-columns:repeat(5,44px);gap:0.45rem;padding:1.2rem;background:rgba(255,255,255,0.02);border-radius:10px;">' +
          [0,1,2,3,4,5,6,7,8,9].map(function (i) {
            return '<div class="dapp-rec-dot" style="width:44px;height:44px;background:hsl(' + (i*36) + ',80%,60%);border-radius:50%;animation:dapp-rec 1.4s cubic-bezier(0.32,1.5,0.5,1) both;animation-delay:' + (i * 0.08) + 's;"></div>';
          }).join('') +
        '</div>' +
        '<style>@keyframes dapp-rec{0%{transform:scale(0) rotate(-180deg);opacity:0;}60%{transform:scale(1.15) rotate(0);opacity:1;}100%{transform:scale(1) rotate(0);}}</style>' +
      '</div>';
    target.querySelector('.dapp-rec-replay').addEventListener('click', function () {
      target.querySelectorAll('.dapp-rec-dot').forEach(function (d) {
        d.style.animation = 'none'; d.offsetHeight; d.style.animation = '';
      });
    });
  };

  // ============================================
  // 3D scenes — common host helper
  // ============================================
  function threeStage(target, opts) {
    opts = opts || {};
    var h = opts.height || 320;
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.6rem;width:100%;">' +
        '<div id="dapp-three-host" style="width:100%;max-width:560px;height:' + h + 'px;background:#050510;border-radius:10px;overflow:hidden;position:relative;"></div>' +
        (opts.note ? '<div style="font-size:0.7rem;color:rgba(255,255,255,0.45);max-width:540px;text-align:center;">' + opts.note + '</div>' : '') +
      '</div>';
    return target.querySelector('#dapp-three-host');
  }
  function waitForThree(cb, tries) {
    tries = tries || 0;
    if (window.THREE) return cb();
    if (tries > 50) return;
    setTimeout(function () { waitForThree(cb, tries + 1); }, 80);
  }

  P['3d/scene-runner.js'] = function (target) {
    var host = threeStage(target, { height: 280, note: 'Bootstrap helper — renders a spinning torus knot to prove the scene context works.' });
    waitForThree(function () {
      if (!window.SceneRunner) return;
      var T = window.THREE;
      var mesh;
      window.SceneRunner.create(host, {
        cameraPosition: [0, 0, 4],
        background: '#0a0a18',
        onTick: function (ctx, t) {
          if (!mesh) {
            mesh = new T.Mesh(
              new T.TorusKnotGeometry(0.7, 0.22, 100, 16),
              new T.MeshStandardMaterial({ color: 0x8b5cf6, metalness: 0.4, roughness: 0.25 })
            );
            ctx.scene.add(mesh);
            var l1 = new T.DirectionalLight(0xffffff, 1.2); l1.position.set(2, 3, 4); ctx.scene.add(l1);
            ctx.scene.add(new T.AmbientLight(0x8888ff, 0.4));
          }
          mesh.rotation.x = t * 0.6;
          mesh.rotation.y = t * 0.8;
        }
      });
    });
  };

  // (three addons are now loaded as ES modules via the importmap — see the
  // postprocessing-bloom preview below — so the old examples/js script loader,
  // whose URLs were removed at three r160, is gone.)

  function showThreeError(target, msg) {
    var host = target.querySelector('#dapp-three-host');
    if (!host) return;
    host.innerHTML =
      '<div style="height:100%;display:grid;place-items:center;color:rgba(255,255,255,0.55);font-size:0.78rem;padding:1rem;text-align:center;">' +
        '⚠ ' + msg +
      '</div>';
  }

  P['3d/particles-galaxy.js'] = function (target) {
    var host = threeStage(target, { height: 320, note: '8000 points forming a spiral galaxy. Branches + spin + randomness.' });
    waitForThree(function () {
      if (!window.ParticlesGalaxy) return showThreeError(target, 'ParticlesGalaxy module not loaded');
      try {
        window.ParticlesGalaxy.init(host, {
          count: 12000,
          size: 0.06,
          radius: 4,
          branches: 5,
          insideColor: '#ffd166',
          outsideColor: '#3a3aff'
        });
      } catch (e) { showThreeError(target, 'init failed: ' + e.message); }
    });
  };

  P['3d/wave-plane.js'] = function (target) {
    var host = threeStage(target, { height: 300, note: 'Vertex-displaced plane animated by simplex noise.' });
    waitForThree(function () {
      if (!window.WavePlane) return showThreeError(target, 'WavePlane module not loaded');
      try { window.WavePlane.init(host); }
      catch (e) { showThreeError(target, 'init failed: ' + e.message); }
    });
  };

  P['3d/cube-morph.js'] = function (target) {
    var host = threeStage(target, { height: 300, note: 'Geometry morph between box / sphere / torus.' });
    waitForThree(function () {
      if (!window.CubeMorph) return showThreeError(target, 'CubeMorph module not loaded');
      try { window.CubeMorph.init(host, { color: '#ec4899' }); }
      catch (e) { showThreeError(target, 'init failed: ' + e.message); }
    });
  };

  P['3d/instanced-grid.js'] = function (target) {
    var host = threeStage(target, { height: 320, note: 'Wave function across an InstancedMesh of 1296 cubes.' });
    waitForThree(function () {
      if (!window.InstancedGrid) return showThreeError(target, 'InstancedGrid module not loaded');
      try { window.InstancedGrid.init(host, { cols: 30, rows: 30 }); }
      catch (e) { showThreeError(target, 'init failed: ' + e.message); }
    });
  };

  P['3d/floating-text.js'] = function (target) {
    // TextGeometry/FontLoader are ESM-only (examples/jsm) at the pinned three@0.160
    // — the old examples/js <script> globals were removed. Rather than load dead
    // URLs, render the snippet's built-in fallback (extruded plate), which is what
    // a page without the ESM addons gets. See the snippet header for the real setup.
    var host = threeStage(target, { height: 300, note: 'Extruded 3D text — fallback plate (TextGeometry needs the ESM font addon).' });
    waitForThree(function () {
      if (!window.FloatingText) return showThreeError(target, 'FloatingText module not loaded');
      try { window.FloatingText.init(host, { text: 'HELLO', size: 0.7 }); }
      catch (e) { showThreeError(target, 'init failed: ' + e.message); }
    });
  };

  P['3d/postprocessing-bloom.js'] = function (target) {
    var host = threeStage(target, { height: 320, note: 'EffectComposer + UnrealBloom — emissive orbs glow.' });
    // Wait for window.THREE (the ESM three), then import the jsm postprocessing
    // addons — they resolve bare "three" via the importmap to the SAME instance, so
    // attaching their classes to window.THREE keeps the snippet's T.EffectComposer
    // contract intact (it doesn't import anything; it reads them off window.THREE).
    waitForThree(function () {
      Promise.all([
        import('three/addons/postprocessing/EffectComposer.js'),
        import('three/addons/postprocessing/RenderPass.js'),
        import('three/addons/postprocessing/ShaderPass.js'),
        import('three/addons/postprocessing/UnrealBloomPass.js')
      ]).then(function (mods) {
        var T = window.THREE;
        T.EffectComposer = mods[0].EffectComposer;
        T.RenderPass = mods[1].RenderPass;
        T.ShaderPass = mods[2].ShaderPass;
        T.UnrealBloomPass = mods[3].UnrealBloomPass;
        if (!window.PostBloom) return showThreeError(target, 'PostBloom module not loaded (global is `PostBloom`)');
        try { window.PostBloom.init(host); }
        catch (e) { showThreeError(target, 'init failed: ' + e.message); }
      }).catch(function (e) { showThreeError(target, 'bloom addon load failed: ' + e.message); });
    });
  };

  P['3d/raycast-hover.js'] = function (target) {
    var host = threeStage(target, { height: 300, note: 'Hover the cubes — raycaster highlights the one under the cursor.' });
    waitForThree(function () {
      if (!window.RaycastHover) return showThreeError(target, 'RaycastHover module not loaded');
      try { window.RaycastHover.init(host); }
      catch (e) { showThreeError(target, 'init failed: ' + e.message); }
    });
  };

  P['3d/scenes-pack.js'] = function (target) {
    // Render six tabs that swap between the pack's 6 scenes.
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;width:100%;">' +
        '<div style="display:flex;flex-wrap:wrap;gap:0.3rem;justify-content:center;">' +
          ['shaderBall','gltfCards','ascii','hologram','gradientCubeArray','ribbonTrail'].map(function (name, i) {
            return '<button class="dapp-sp-tab" data-scene="' + name + '" style="padding:0.3rem 0.7rem;background:' + (i === 0 ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.04)') + ';border:1px solid ' + (i === 0 ? '#a78bfa' : 'rgba(255,255,255,0.1)') + ';border-radius:5px;color:#fff;font-size:0.7rem;cursor:pointer;font-family:monospace;">' + name + '</button>';
          }).join('') +
        '</div>' +
        '<div id="dapp-three-host" style="width:100%;max-width:560px;height:320px;background:#050510;border-radius:10px;overflow:hidden;position:relative;"></div>' +
        '<div style="font-size:0.68rem;color:rgba(255,255,255,0.45);text-align:center;">6 self-contained Three.js scenes — click a tab to switch.</div>' +
      '</div>';
    var host = target.querySelector('#dapp-three-host');
    var current = null;
    function activate(name) {
      if (current && current.destroy) try { current.destroy(); } catch (e) {}
      host.innerHTML = '';
      if (!window.ScenesPack || typeof window.ScenesPack[name] !== 'function') {
        host.innerHTML = '<div style="height:100%;display:grid;place-items:center;color:rgba(255,255,255,0.5);font-size:0.78rem;">scene `' + name + '` not available</div>';
        return;
      }
      try { current = window.ScenesPack[name](host); }
      catch (e) {
        host.innerHTML = '<div style="height:100%;display:grid;place-items:center;color:rgba(255,255,255,0.5);font-size:0.78rem;padding:1rem;text-align:center;">⚠ ' + e.message + '</div>';
      }
    }
    target.querySelectorAll('.dapp-sp-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        target.querySelectorAll('.dapp-sp-tab').forEach(function (b) {
          b.style.background = 'rgba(255,255,255,0.04)';
          b.style.borderColor = 'rgba(255,255,255,0.1)';
        });
        btn.style.background = 'rgba(139,92,246,0.25)';
        btn.style.borderColor = '#a78bfa';
        activate(btn.getAttribute('data-scene'));
      });
    });
    waitForThree(function () { activate('shaderBall'); });
  };

  // ============================================
  // AI components — chat / artifact / model picker
  // ============================================
  P['ai/streaming-text.js'] = function (target) {
    target.innerHTML =
      '<div style="width:100%;max-width:520px;padding:1rem 1.2rem;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;">' +
        '<div id="dapp-stream-target" style="font-size:0.9rem;line-height:1.55;color:#e6e6f0;min-height:5em;"></div>' +
        '<button id="dapp-stream-go" style="margin-top:0.8rem;padding:0.4rem 0.95rem;background:rgba(139,92,246,0.2);border:1px solid rgba(139,92,246,0.4);border-radius:6px;color:#c4b5fd;font-size:0.75rem;cursor:pointer;">▶ Stream</button>' +
      '</div>';
    var run = function () {
      var el = target.querySelector('#dapp-stream-target');
      if (!el || !window.StreamingText) return;
      el.textContent = '';
      var text = 'This is a token-by-token streaming response with **markdown-lite** support. Notice how the cursor blinks at the end and the panel auto-scrolls.';
      var i = 0;
      var id = setInterval(function () {
        el.textContent += text[i++];
        if (i >= text.length) clearInterval(id);
      }, 25);
    };
    target.querySelector('#dapp-stream-go').addEventListener('click', run);
    setTimeout(run, 200);
  };

  P['ai/reasoning-block.js'] = function (target) {
    target.innerHTML =
      '<div style="width:100%;max-width:500px;padding:0.95rem 1.1rem;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;">' +
        '<details open style="font-size:0.85rem;color:#e6e6f0;">' +
          '<summary style="cursor:pointer;font-weight:600;color:#a78bfa;">💭 Thinking… <span style="font-weight:400;color:rgba(255,255,255,0.45);font-size:0.78rem;">3.2s</span></summary>' +
          '<div style="margin-top:0.7rem;padding:0.7rem 0.9rem;background:rgba(0,0,0,0.3);border-radius:6px;line-height:1.55;color:rgba(255,255,255,0.7);font-family:ui-monospace,monospace;font-size:0.78rem;">First I need to parse the user\'s request, then plan the API calls, then draft a response that doesn\'t reveal the chain-of-thought.</div>' +
        '</details>' +
      '</div>';
  };

  P['ai/tool-call-card.js'] = function (target) {
    target.innerHTML =
      '<div style="width:100%;max-width:480px;display:flex;flex-direction:column;gap:0.5rem;">' +
        ['search_docs', 'list_files', 'run_test'].map(function (name, i) {
          var states = ['running', 'success', 'success'];
          var icons = ['◐', '✓', '✓'];
          var colors = ['#facc15', '#22c55e', '#22c55e'];
          return '<div style="padding:0.7rem 0.95rem;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-left:3px solid ' + colors[i] + ';border-radius:8px;font-family:ui-monospace,monospace;font-size:0.78rem;color:#e6e6f0;">' +
            '<span style="color:' + colors[i] + ';margin-right:0.5rem;">' + icons[i] + '</span>' +
            '<span style="color:#a78bfa;font-weight:600;">' + name + '</span>' +
            '<span style="color:rgba(255,255,255,0.5);"> · ' + states[i] + '</span>' +
          '</div>';
        }).join('') +
      '</div>';
  };

  P['ai/agent-trace.js'] = function (target) {
    var steps = [
      { t: 'tool', n: 'search', d: 'searched 4 docs' },
      { t: 'think', n: 'analyze', d: 'comparing context to query' },
      { t: 'tool', n: 'fetch_url', d: 'fetched results.json' },
      { t: 'speak', n: 'reply', d: 'final answer drafted' }
    ];
    target.innerHTML =
      '<div style="width:100%;max-width:440px;display:flex;flex-direction:column;gap:0;">' +
        steps.map(function (s, i) {
          var icon = s.t === 'tool' ? '🔧' : s.t === 'think' ? '🧠' : '💬';
          var color = s.t === 'tool' ? '#60a5fa' : s.t === 'think' ? '#a78bfa' : '#22c55e';
          return '<div style="display:flex;gap:0.7rem;padding:0.55rem 0.2rem;position:relative;">' +
            '<div style="width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.06);border:1px solid ' + color + ';display:grid;place-items:center;font-size:0.85rem;flex-shrink:0;">' + icon + '</div>' +
            (i < steps.length - 1 ? '<div style="position:absolute;left:14px;top:38px;width:1px;height:24px;background:rgba(255,255,255,0.12);"></div>' : '') +
            '<div><div style="font-size:0.8rem;color:#fff;font-weight:600;">' + s.n + '</div><div style="font-size:0.72rem;color:rgba(255,255,255,0.5);">' + s.d + '</div></div>' +
          '</div>';
        }).join('') +
      '</div>';
  };

  P['ai/model-picker.js'] = function (target) {
    target.innerHTML =
      '<div style="width:100%;max-width:380px;display:flex;flex-direction:column;gap:0.4rem;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:0.5rem;">' +
        [
          { n: 'Claude Opus 4.7', p: 'Anthropic', c: '#c4b5fd', sel: true, b: ['🧠 Smart','📷 Vision','⚡ 200k'] },
          { n: 'GPT-4 Turbo', p: 'OpenAI', c: '#86efac', sel: false, b: ['🧠 Smart','📷 Vision'] },
          { n: 'Gemini 1.5 Pro', p: 'Google', c: '#fcd34d', sel: false, b: ['📷 Vision','⚡ 1M'] }
        ].map(function (m) {
          return '<div style="padding:0.55rem 0.7rem;background:' + (m.sel ? 'rgba(139,92,246,0.18)' : 'transparent') + ';border-radius:6px;border:1px solid ' + (m.sel ? 'rgba(139,92,246,0.4)' : 'transparent') + ';cursor:pointer;">' +
            '<div style="display:flex;align-items:center;gap:0.5rem;"><span style="color:' + m.c + ';font-size:0.78rem;font-weight:700;">' + m.p + '</span><span style="color:#fff;font-size:0.85rem;font-weight:600;">' + m.n + '</span></div>' +
            '<div style="display:flex;gap:0.3rem;margin-top:0.25rem;flex-wrap:wrap;">' + m.b.map(function (x) { return '<span style="font-size:0.65rem;color:rgba(255,255,255,0.6);background:rgba(255,255,255,0.06);padding:0.1rem 0.4rem;border-radius:4px;">' + x + '</span>'; }).join('') + '</div>' +
          '</div>';
        }).join('') +
      '</div>';
  };

  P['ai/token-usage-pill.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:0.6rem;align-items:center;">' +
        [
          { l: '12.4k / 200k', c: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
          { l: '124.5k / 200k', c: '#facc15', bg: 'rgba(250,204,21,0.15)' },
          { l: '189.2k / 200k', c: '#ef4444', bg: 'rgba(239,68,68,0.15)' }
        ].map(function (u) {
          return '<div style="display:inline-flex;align-items:center;gap:0.4rem;padding:0.3rem 0.7rem;background:' + u.bg + ';border:1px solid ' + u.c + ';border-radius:999px;color:' + u.c + ';font-family:ui-monospace,monospace;font-size:0.78rem;font-weight:600;">' +
            '<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:' + u.c + ';"></span>' + u.l + ' tokens' +
          '</div>';
        }).join('') +
      '</div>';
  };

  P['ai/artifact-split.js'] = function (target) {
    target.innerHTML =
      '<div style="width:100%;max-width:620px;display:grid;grid-template-columns:1fr 1.2fr;gap:0.5rem;height:280px;">' +
        '<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0.7rem;display:flex;flex-direction:column;gap:0.5rem;overflow:hidden;">' +
          '<div style="font-size:0.7rem;color:rgba(255,255,255,0.5);font-family:monospace;">Chat</div>' +
          '<div style="font-size:0.78rem;color:#e6e6f0;line-height:1.5;">Sure — here\'s a React button with a hover glow effect. Click the artifact on the right to preview or copy.</div>' +
          '<div style="margin-top:auto;padding:0.5rem;background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.3);border-radius:6px;color:#c4b5fd;font-size:0.72rem;cursor:pointer;">📎 GlowButton.tsx · v3</div>' +
        '</div>' +
        '<div style="background:#0a0a14;border:1px solid rgba(255,255,255,0.08);border-radius:10px;display:flex;flex-direction:column;overflow:hidden;">' +
          '<div style="display:flex;padding:0.4rem 0.5rem;gap:0.4rem;border-bottom:1px solid rgba(255,255,255,0.08);">' +
            '<button style="padding:0.2rem 0.7rem;background:rgba(139,92,246,0.25);border:none;border-radius:4px;color:#c4b5fd;font-size:0.7rem;cursor:pointer;">Preview</button>' +
            '<button style="padding:0.2rem 0.7rem;background:transparent;border:none;color:rgba(255,255,255,0.5);font-size:0.7rem;cursor:pointer;">Code</button>' +
            '<span style="margin-left:auto;font-size:0.7rem;color:rgba(255,255,255,0.4);">v3/3 ◀ ▶</span>' +
          '</div>' +
          '<div style="flex:1;display:grid;place-items:center;background:radial-gradient(circle at center,rgba(139,92,246,0.15),transparent 60%);">' +
            '<button style="padding:0.6rem 1.6rem;background:linear-gradient(135deg,#8b5cf6,#ec4899);border:none;border-radius:8px;color:#fff;font-weight:700;font-size:0.95rem;box-shadow:0 0 30px rgba(139,92,246,0.5);cursor:pointer;">Click me ✨</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  };

  P['ai/citation-popover.js'] = function (target) {
    target.innerHTML =
      '<div style="max-width:500px;font-size:0.9rem;line-height:1.7;color:#e6e6f0;padding:1rem 1.2rem;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;">' +
        'According to the latest research<sup style="display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;background:rgba(139,92,246,0.25);color:#c4b5fd;border-radius:4px;font-size:0.65rem;margin:0 0.15rem;cursor:pointer;font-weight:700;">1</sup>, retrieval-augmented generation produces 35% fewer hallucinations<sup style="display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;background:rgba(34,197,94,0.25);color:#86efac;border-radius:4px;font-size:0.65rem;margin:0 0.15rem;cursor:pointer;font-weight:700;">2</sup> than vanilla generation<sup style="display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;background:rgba(250,204,21,0.25);color:#fcd34d;border-radius:4px;font-size:0.65rem;margin:0 0.15rem;cursor:pointer;font-weight:700;">3</sup>.' +
      '</div>';
  };

  P['ai/voice-input.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.7rem;">' +
        '<button style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#ef4444,#f97316);border:none;display:grid;place-items:center;cursor:pointer;box-shadow:0 0 32px rgba(239,68,68,0.5);animation:dapp-pulse 1.6s ease-in-out infinite;">' +
          '<svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/></svg>' +
        '</button>' +
        '<div style="display:flex;align-items:center;gap:2px;height:36px;">' +
          [12,28,18,34,22,16,30,24,14,20,26,18,32,22].map(function (h) {
            return '<div style="width:3px;height:' + h + 'px;background:#c4b5fd;border-radius:2px;animation:dapp-wave 0.9s ease-in-out infinite;animation-delay:' + (Math.random() * 0.9) + 's;"></div>';
          }).join('') +
        '</div>' +
        '<div style="font-size:0.78rem;color:rgba(255,255,255,0.6);">Listening… speak now</div>' +
        '<style>@keyframes dapp-pulse{0%,100%{transform:scale(1);}50%{transform:scale(1.06);}}@keyframes dapp-wave{0%,100%{transform:scaleY(0.5);}50%{transform:scaleY(1.2);}}</style>' +
      '</div>';
  };

  P['ai/sources-panel.js'] = function (target) {
    target.innerHTML =
      '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:0.6rem;max-width:560px;">' +
        [
          { t: 'docs.anthropic.com', h: 'Tool use overview', s: 0.94, c: '#c4b5fd' },
          { t: 'arxiv.org/2310.06770', h: 'SWE-bench: an evaluation', s: 0.87, c: '#86efac' },
          { t: 'github.com/repo', h: 'README.md#installation', s: 0.81, c: '#fcd34d' },
          { t: 'blog.example.com', h: 'Building agents in 2025', s: 0.73, c: '#fda4af' }
        ].map(function (s) {
          return '<div style="padding:0.65rem 0.8rem;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;">' +
            '<div style="display:flex;align-items:center;gap:0.4rem;margin-bottom:0.3rem;">' +
              '<span style="width:6px;height:6px;border-radius:50%;background:' + s.c + ';"></span>' +
              '<span style="font-size:0.65rem;color:rgba(255,255,255,0.5);font-family:monospace;">' + s.t + '</span>' +
              '<span style="margin-left:auto;font-size:0.66rem;color:' + s.c + ';font-weight:700;">' + Math.round(s.s * 100) + '%</span>' +
            '</div>' +
            '<div style="font-size:0.78rem;color:#fff;font-weight:600;">' + s.h + '</div>' +
          '</div>';
        }).join('') +
      '</div>';
  };

  P['ai/suggested-replies.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-wrap:wrap;gap:0.5rem;max-width:500px;justify-content:center;">' +
        ['Tell me more', 'How does it work?', 'Show me an example', 'What\'s next?'].map(function (s, i) {
          return '<button style="padding:0.45rem 0.95rem;background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.3);border-radius:999px;color:#c4b5fd;font-size:0.82rem;cursor:pointer;transition:all 0.18s ease;" onmouseenter="this.style.background=\'rgba(139,92,246,0.2)\'" onmouseleave="this.style.background=\'rgba(139,92,246,0.1)\'">' + s + '</button>';
        }).join('') +
      '</div>';
  };

  P['ai/attachment-chips.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-wrap:wrap;gap:0.45rem;max-width:520px;justify-content:center;">' +
        [
          { i: '📄', n: 'design-spec.pdf', s: '4.2 MB' },
          { i: '🖼', n: 'screenshot.png', s: '1.1 MB' },
          { i: '📊', n: 'data.csv', s: '892 KB' },
          { i: '🎬', n: 'demo.mp4', s: '12.4 MB' }
        ].map(function (a) {
          return '<div style="display:inline-flex;align-items:center;gap:0.4rem;padding:0.35rem 0.7rem 0.35rem 0.45rem;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#fff;font-size:0.75rem;">' +
            '<span style="font-size:1rem;">' + a.i + '</span>' +
            '<span style="font-weight:600;">' + a.n + '</span>' +
            '<span style="font-size:0.65rem;color:rgba(255,255,255,0.45);">· ' + a.s + '</span>' +
            '<span style="margin-left:0.2rem;color:rgba(255,255,255,0.4);cursor:pointer;">×</span>' +
          '</div>';
        }).join('') +
      '</div>';
  };

  P['ai/inline-controls.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;gap:0.35rem;flex-wrap:wrap;justify-content:center;">' +
        [
          { i: '⏹', l: 'Stop' },
          { i: '↻', l: 'Regenerate' },
          { i: '📋', l: 'Copy' },
          { i: '👍', l: 'Good' },
          { i: '👎', l: 'Bad' },
          { i: '🌿', l: 'Branch' },
          { i: '✎', l: 'Edit' },
          { i: '🔊', l: 'TTS' }
        ].map(function (b) {
          return '<button style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.3rem 0.7rem;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#e6e6f0;font-size:0.72rem;cursor:pointer;">' + b.i + ' ' + b.l + '</button>';
        }).join('') +
      '</div>';
  };

  P['ai/ai-diff.js'] = function (target) {
    target.innerHTML =
      '<div style="width:100%;max-width:520px;background:#0a0a14;border:1px solid rgba(255,255,255,0.08);border-radius:10px;overflow:hidden;font-family:ui-monospace,monospace;font-size:0.78rem;">' +
        '<div style="background:rgba(34,197,94,0.1);padding:0.4rem 0.7rem;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;gap:0.4rem;">' +
          '<span style="color:#86efac;">+ Hunk 1</span>' +
          '<span style="margin-left:auto;display:flex;gap:0.3rem;">' +
            '<button style="padding:0.15rem 0.5rem;background:#22c55e;border:none;border-radius:3px;color:#fff;font-size:0.7rem;cursor:pointer;font-weight:700;">✓ Accept</button>' +
            '<button style="padding:0.15rem 0.5rem;background:rgba(239,68,68,0.15);border:1px solid #ef4444;border-radius:3px;color:#ef4444;font-size:0.7rem;cursor:pointer;font-weight:700;">✕ Reject</button>' +
          '</span>' +
        '</div>' +
        '<div style="padding:0.5rem 0;">' +
          '<div style="padding:0 0.7rem;color:rgba(239,68,68,0.85);background:rgba(239,68,68,0.06);">- function add(a, b) { return a + b }</div>' +
          '<div style="padding:0 0.7rem;color:rgba(34,197,94,0.85);background:rgba(34,197,94,0.08);">+ function add(a, b) {</div>' +
          '<div style="padding:0 0.7rem;color:rgba(34,197,94,0.85);background:rgba(34,197,94,0.08);">+   if (typeof a !== \'number\') throw new TypeError();</div>' +
          '<div style="padding:0 0.7rem;color:rgba(34,197,94,0.85);background:rgba(34,197,94,0.08);">+   return a + b;</div>' +
          '<div style="padding:0 0.7rem;color:rgba(34,197,94,0.85);background:rgba(34,197,94,0.08);">+ }</div>' +
        '</div>' +
      '</div>';
  };

  // ============================================
  // Distinctive effects: text + visual
  // ============================================
  P['effects/text-flipping-board.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.7rem;">' +
        '<div style="display:flex;gap:0.2rem;font-family:ui-monospace,monospace;font-size:1.6rem;font-weight:700;">' +
          'DEPARTURES'.split('').map(function (ch, i) {
            return '<span class="dapp-flip-char" style="display:inline-block;min-width:1.2em;padding:0.25rem 0.4rem;background:#1a1a2e;color:#fcd34d;border-radius:4px;text-align:center;box-shadow:inset 0 -1px 0 rgba(0,0,0,0.3);animation:dapp-flipchar 0.6s ease-out both;animation-delay:' + (i * 0.07) + 's;">' + ch + '</span>';
          }).join('') +
        '</div>' +
        '<div style="font-size:0.7rem;color:rgba(255,255,255,0.45);">Airport split-flap board</div>' +
        '<style>@keyframes dapp-flipchar{0%{transform:rotateX(90deg);}100%{transform:rotateX(0);}}</style>' +
      '</div>';
  };

  P['effects/encrypted-text.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.7rem;">' +
        '<div id="dapp-enc" style="font-family:ui-monospace,monospace;font-size:1.4rem;font-weight:700;color:#86efac;letter-spacing:0.05em;min-width:14em;text-align:center;">SCRAMBLING</div>' +
        '<button id="dapp-enc-go" style="padding:0.4rem 0.95rem;background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.4);border-radius:6px;color:#86efac;font-size:0.78rem;cursor:pointer;font-weight:600;">▶ Decode</button>' +
      '</div>';
    var go = function () {
      var el = target.querySelector('#dapp-enc');
      if (!el) return;
      var target_str = 'UNLOCKED ✓';
      var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*';
      var locked = '';
      var i = 0;
      var id = setInterval(function () {
        if (i >= target_str.length) {
          clearInterval(id);
          el.textContent = target_str;
          return;
        }
        locked = target_str.slice(0, i);
        var rest = '';
        for (var j = i; j < target_str.length; j++) rest += chars[Math.floor(Math.random() * chars.length)];
        el.textContent = locked + rest;
        if (Math.random() > 0.6) i++;
      }, 50);
    };
    target.querySelector('#dapp-enc-go').addEventListener('click', go);
    setTimeout(go, 200);
  };

  P['effects/variable-font-cursor.js'] = function (target) {
    target.innerHTML =
      '<div style="font-family:\'Inter\',system-ui,sans-serif;font-size:2.4rem;font-weight:800;line-height:1.1;letter-spacing:-0.02em;color:#fff;text-align:center;max-width:420px;">' +
        'TYPE'.split('').map(function (ch, i) { return '<span style="display:inline-block;font-variation-settings:\'wght\' ' + (300 + (i * 200) % 600) + ';margin:0 0.05em;">' + ch + '</span>'; }).join('') +
        '<br>' +
        'VARIATIONS'.split('').map(function (ch, i) { return '<span style="display:inline-block;font-variation-settings:\'wght\' ' + (400 + (Math.abs(i - 5) * 80)) + ';margin:0 0.02em;">' + ch + '</span>'; }).join('') +
      '</div>' +
      '<div style="font-size:0.7rem;color:rgba(255,255,255,0.5);margin-top:0.7rem;">Per-glyph weight by cursor distance</div>';
  };

  P['effects/image-cursor-trail.js'] = function (target) {
    target.innerHTML =
      '<div id="dapp-trail-stage" style="width:100%;max-width:540px;height:280px;background:radial-gradient(circle at center,rgba(139,92,246,0.15),transparent 70%);border:1px solid rgba(255,255,255,0.08);border-radius:10px;position:relative;overflow:hidden;cursor:crosshair;display:grid;place-items:center;">' +
        '<div style="font-size:0.95rem;color:rgba(255,255,255,0.5);pointer-events:none;">Move cursor here</div>' +
      '</div>';
    var stage = target.querySelector('#dapp-trail-stage');
    var lastX = 0, lastY = 0;
    var colors = ['#8b5cf6','#ec4899','#f97316','#22c55e','#60a5fa'];
    stage.addEventListener('mousemove', function (e) {
      var rect = stage.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      if (Math.hypot(x - lastX, y - lastY) < 24) return;
      lastX = x; lastY = y;
      var d = document.createElement('div');
      d.style.cssText = 'position:absolute;left:' + (x - 14) + 'px;top:' + (y - 14) + 'px;width:28px;height:28px;border-radius:50%;background:' + colors[Math.floor(Math.random() * colors.length)] + ';opacity:0.85;pointer-events:none;animation:dapp-trail 0.9s ease-out forwards;';
      stage.appendChild(d);
      setTimeout(function () { d.remove(); }, 900);
    });
    var s = document.createElement('style');
    s.textContent = '@keyframes dapp-trail{0%{transform:scale(0.4);}100%{transform:scale(1.6);opacity:0;}}';
    stage.appendChild(s);
  };

  // ============================================
  // Notable JS components — explicit live setups
  // ============================================
  P['components/focus-mode.js'] = function (target) {
    target.innerHTML =
      '<div style="width:100%;max-width:480px;display:flex;flex-direction:column;gap:0.4rem;position:relative;">' +
        [
          'Quarterly OKRs draft',
          'Stand-up notes',
          '<b>→ Writing: AI agent design</b>',
          'Bugs to triage',
          'Inbox zero'
        ].map(function (t, i) {
          var on = i === 2;
          return '<div style="padding:0.7rem 0.95rem;background:' + (on ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.02)') + ';border:1px solid ' + (on ? 'rgba(139,92,246,0.35)' : 'rgba(255,255,255,0.06)') + ';border-radius:8px;color:' + (on ? '#fff' : 'rgba(255,255,255,0.35)') + ';font-size:0.85rem;line-height:1.4;transition:all 0.4s ease;">' + t + '</div>';
        }).join('') +
        '<div style="margin-top:0.4rem;display:flex;align-items:center;gap:0.5rem;justify-content:center;">' +
          '<svg width="34" height="34" viewBox="0 0 36 36" style="transform:rotate(-90deg);"><circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="3"/><circle cx="18" cy="18" r="14" fill="none" stroke="#c4b5fd" stroke-width="3" stroke-dasharray="' + (88 * 0.65) + ' ' + 88 + '" stroke-linecap="round"/></svg>' +
          '<span style="font-size:0.8rem;color:#c4b5fd;font-weight:700;">16:23 left</span>' +
        '</div>' +
      '</div>';
  };

  P['components/triage-row.js'] = function (target) {
    target.innerHTML =
      '<div style="width:100%;max-width:540px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:10px;overflow:hidden;">' +
        [
          { id: 'BUG-481', t: 'OAuth callback drops state param', p: 'P0', pc: '#ef4444', a: 'JD' },
          { id: 'BUG-482', t: 'Settings page leaks Listener on unmount', p: 'P1', pc: '#facc15', a: 'AS', sel: true },
          { id: 'FEAT-93', t: 'Add bulk export to CSV', p: 'P2', pc: '#60a5fa', a: 'KR' },
          { id: 'BUG-485', t: 'Tooltip overflow on RTL languages', p: 'P3', pc: '#a78bfa', a: 'MP' }
        ].map(function (r, i) {
          return '<div style="display:flex;align-items:center;gap:0.6rem;padding:0.55rem 0.8rem;border-top:' + (i === 0 ? 'none' : '1px solid rgba(255,255,255,0.05)') + ';background:' + (r.sel ? 'rgba(139,92,246,0.12)' : 'transparent') + ';">' +
            '<input type="checkbox"' + (r.sel ? ' checked' : '') + ' style="accent-color:#a78bfa;">' +
            '<span style="font-family:monospace;font-size:0.7rem;color:rgba(255,255,255,0.45);min-width:64px;">' + r.id + '</span>' +
            '<span style="padding:0.05rem 0.4rem;background:rgba(255,255,255,0.05);border:1px solid ' + r.pc + ';border-radius:3px;color:' + r.pc + ';font-size:0.65rem;font-weight:700;">' + r.p + '</span>' +
            '<span style="flex:1;font-size:0.82rem;color:#fff;">' + r.t + '</span>' +
            '<span style="width:22px;height:22px;border-radius:50%;background:#8b5cf6;color:#fff;font-size:0.66rem;display:grid;place-items:center;font-weight:700;">' + r.a + '</span>' +
          '</div>';
        }).join('') +
      '</div>' +
      '<div style="margin-top:0.5rem;font-size:0.7rem;color:rgba(255,255,255,0.5);text-align:center;">Keyboard: <code style="background:rgba(255,255,255,0.06);padding:0.05rem 0.25rem;border-radius:3px;">j/k</code> nav · <code style="background:rgba(255,255,255,0.06);padding:0.05rem 0.25rem;border-radius:3px;">x</code> select · <code style="background:rgba(255,255,255,0.06);padding:0.05rem 0.25rem;border-radius:3px;">⌫</code> delete</div>';
  };

  P['components/changelog-popover.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;justify-content:flex-end;width:100%;max-width:460px;position:relative;padding-right:0.5rem;">' +
        '<button style="position:relative;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#fff;cursor:pointer;font-size:1rem;">🔔<span style="position:absolute;top:5px;right:6px;width:8px;height:8px;border-radius:50%;background:#ef4444;border:1.5px solid #0a0a14;"></span></button>' +
        '<div style="position:absolute;top:46px;right:0;width:300px;background:#15152a;border:1px solid rgba(255,255,255,0.12);border-radius:10px;padding:0.8rem;box-shadow:0 12px 40px rgba(0,0,0,0.5);">' +
          '<div style="font-weight:700;color:#fff;font-size:0.95rem;margin-bottom:0.6rem;">What\'s new</div>' +
          [
            { d: 'Today', t: 'Slash commands beta', new: true, tag: 'feature' },
            { d: '2d ago', t: 'Faster cold-start times', new: false, tag: 'perf' },
            { d: '4d ago', t: 'Fixed: settings sidebar crash', new: false, tag: 'fix' }
          ].map(function (it) {
            var tagColor = it.tag === 'feature' ? '#86efac' : it.tag === 'perf' ? '#fcd34d' : '#fda4af';
            return '<div style="display:flex;gap:0.5rem;padding:0.4rem 0;border-top:1px solid rgba(255,255,255,0.04);">' +
              '<span style="width:6px;height:6px;border-radius:50%;background:' + (it.new ? '#ef4444' : 'transparent') + ';margin-top:0.5rem;flex-shrink:0;"></span>' +
              '<div style="flex:1;"><span style="font-size:0.55rem;color:' + tagColor + ';text-transform:uppercase;letter-spacing:0.06em;font-weight:700;">' + it.tag + '</span>' +
              '<div style="font-size:0.78rem;color:#fff;">' + it.t + '</div><div style="font-size:0.65rem;color:rgba(255,255,255,0.4);">' + it.d + '</div></div>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</div>';
  };

  // ============================================
  // Media — distinctive visual files
  // ============================================
  P['media/signature-pad.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.6rem;">' +
        '<div style="width:380px;height:160px;background:rgba(255,255,255,0.95);border-radius:10px;display:grid;place-items:center;font-family:\'Brush Script MT\',cursive;font-size:2.4rem;color:#1a1a2e;font-style:italic;border:1px dashed rgba(0,0,0,0.2);position:relative;">' +
          '<span>frontendmaxxing</span>' +
          '<svg style="position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;" viewBox="0 0 380 160">' +
            '<path d="M40 110 Q 80 60, 120 90 T 200 80 T 280 100 T 340 70" stroke="#1a1a2e" stroke-width="2.4" fill="none" stroke-linecap="round" opacity="0.4"/>' +
          '</svg>' +
        '</div>' +
        '<div style="display:flex;gap:0.5rem;">' +
          '<button style="padding:0.4rem 0.95rem;background:rgba(239,68,68,0.15);border:1px solid #ef4444;border-radius:6px;color:#fca5a5;font-size:0.78rem;cursor:pointer;">Clear</button>' +
          '<button style="padding:0.4rem 0.95rem;background:#22c55e;border:none;border-radius:6px;color:#fff;font-size:0.78rem;cursor:pointer;font-weight:700;">Save PNG</button>' +
        '</div>' +
      '</div>';
  };

  P['media/waveform-regions.js'] = function (target) {
    target.innerHTML =
      '<div style="width:100%;max-width:560px;background:#0a0a14;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0.8rem;">' +
        '<div style="position:relative;height:60px;display:flex;align-items:center;">' +
          '<div style="position:absolute;left:8%;right:18%;top:0;bottom:0;background:rgba(139,92,246,0.18);border-left:2px solid #c4b5fd;border-right:2px solid #c4b5fd;border-radius:4px;"></div>' +
          '<div style="position:absolute;left:60%;right:5%;top:0;bottom:0;background:rgba(34,197,94,0.15);border-left:2px solid #86efac;border-right:2px solid #86efac;border-radius:4px;"></div>' +
          '<div style="display:flex;align-items:center;gap:1px;height:100%;width:100%;position:relative;">' +
            Array.from({ length: 80 }, function (_, i) {
              var h = 16 + Math.abs(Math.sin(i * 0.4) * 32) + Math.random() * 12;
              return '<div style="width:4px;height:' + h + 'px;background:rgba(255,255,255,0.55);"></div>';
            }).join('') +
          '</div>' +
          '<div style="position:absolute;left:38%;top:-4px;bottom:-4px;width:2px;background:#ef4444;box-shadow:0 0 8px #ef4444;"></div>' +
        '</div>' +
        '<div style="display:flex;justify-content:space-between;font-family:monospace;font-size:0.65rem;color:rgba(255,255,255,0.4);margin-top:0.4rem;">' +
          '<span>00:00</span><span>01:23 / 03:14</span><span>03:14</span>' +
        '</div>' +
      '</div>';
  };

  // ============================================
  // Cursor folder previews
  // ============================================
  P['cursor/custom-cursor.css'] = function (target) {
    target.innerHTML =
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.7rem;max-width:520px;">' +
        ['Dot', 'Ring', 'Cross', 'Star', 'Blob', 'Magnetic'].map(function (n, i) {
          var colors = ['#8b5cf6','#ec4899','#22c55e','#fcd34d','#60a5fa','#f97316'];
          return '<div style="height:90px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;display:grid;place-items:center;position:relative;">' +
            '<span style="width:16px;height:16px;border-radius:50%;background:' + colors[i] + ';box-shadow:0 0 16px ' + colors[i] + ';"></span>' +
            '<span style="position:absolute;bottom:6px;left:8px;font-size:0.7rem;color:rgba(255,255,255,0.55);">' + n + '</span>' +
          '</div>';
        }).join('') +
      '</div>';
  };

  // ============================================
  // Shaders — when running standalone via runner.js
  // ============================================
  function shaderStage(target, globalName, opts) {
    opts = opts || {};
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;">' +
        '<div id="dapp-shader-host" style="width:100%;max-width:540px;height:320px;border-radius:10px;background:#000;overflow:hidden;"></div>' +
        (opts.note ? '<div style="font-size:0.7rem;color:rgba(255,255,255,0.5);">' + opts.note + '</div>' : '') +
      '</div>';
    var host = target.querySelector('#dapp-shader-host');
    // opts.prop picks which fragment export to run — image shaders ship a
    // texture-free `proceduralFragment` for standalone display (no photo needed).
    var prop = opts.prop || 'fragment';
    var attempt = function (n) {
      var Shader = window[globalName];
      var frag = Shader && (Shader[prop] || Shader.fragment);
      if (window.ShaderRunner && frag) {
        try {
          window.ShaderRunner.create(host, {
            fragmentShader: frag,
            uniforms: Shader.defaults || {}
          });
          return;
        } catch (e) { console.warn('shader init', e); return; }
      }
      if (n < 40) setTimeout(function () { attempt(n + 1); }, 80);
    };
    attempt(0);
  }

  P['shaders/noise-flow.glsl.js']        = function (t) { shaderStage(t, 'NoiseFlowShader',        { note: 'Flowing simplex noise' }); };
  P['shaders/gradient-mesh.glsl.js']     = function (t) { shaderStage(t, 'GradientMeshShader',     { note: 'Animated 4-stop gradient mesh' }); };
  P['shaders/liquid-distortion.glsl.js'] = function (t) { shaderStage(t, 'LiquidDistortionShader', { note: 'Fluid-like UV distortion', prop: 'proceduralFragment' }); };
  P['shaders/voronoi.glsl.js']           = function (t) { shaderStage(t, 'VoronoiShader',          { note: 'Worley/Voronoi cells' }); };
  P['shaders/kaleidoscope.glsl.js']      = function (t) { shaderStage(t, 'KaleidoscopeShader',     { note: 'Sector-folding kaleidoscope' }); };
  P['shaders/raymarch-sdf.glsl.js']      = function (t) { shaderStage(t, 'RaymarchSDFShader',      { note: 'SDF raymarched primitives' }); };
  P['shaders/godrays.glsl.js']           = function (t) { shaderStage(t, 'GodraysShader',          { note: 'Volumetric god rays' }); };
  P['shaders/plasma.glsl.js']            = function (t) { shaderStage(t, 'PlasmaShader',           { note: 'Classic demoscene plasma' }); };
  P['shaders/fluid.glsl.js']             = function (t) { shaderStage(t, 'FluidShader',            { note: 'Curl-noise fluid simulation' }); };
  P['shaders/sdf-text.glsl.js']          = function (t) { shaderStage(t, 'SDFTextShader',          { note: 'Signed-distance-field text + glow', prop: 'proceduralFragment' }); };
  P['shaders/halftone.glsl.js']          = function (t) { shaderStage(t, 'HalftoneShader',         { note: 'Halftone dot pattern', prop: 'proceduralFragment' }); };
  P['shaders/gradient-flow.glsl.js']     = function (t) { shaderStage(t, 'GradientFlowShader',     { note: 'Smooth gradient flow' }); };
  P['shaders/mesh-gradient-wgl.glsl.js'] = function (t) { shaderStage(t, 'MeshGradientWGLShader',  { note: 'Whatamesh-style WebGL mesh gradient' }); };
  P['shaders/aurora.glsl.js']            = function (t) { shaderStage(t, 'AuroraShader',            { note: 'Flowing northern-lights curtains — move your mouse to drift them' }); };
  P['shaders/pointer-ripple.glsl.js']    = function (t) { shaderStage(t, 'PointerRippleShader',    { note: 'Concentric ripples from the cursor — move your mouse over it' }); };

  // pointer-displace needs an image; supply a self-contained data-URI gradient so
  // the preview (and the render harness) needs no external asset to draw.
  P['shaders/pointer-displace.glsl.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;">' +
        '<div id="dapp-shader-host" style="width:100%;max-width:540px;height:320px;border-radius:10px;background:#000;overflow:hidden;"></div>' +
        '<div style="font-size:0.7rem;color:rgba(255,255,255,0.5);">Lens warp that pulls the image toward the cursor</div>' +
      '</div>';
    var host = target.querySelector('#dapp-shader-host');
    var tex = document.createElement('canvas'); tex.width = 512; tex.height = 320;
    var c = tex.getContext('2d');
    var g = c.createLinearGradient(0, 0, 512, 320);
    g.addColorStop(0, '#7c5cff'); g.addColorStop(0.5, '#ec4899'); g.addColorStop(1, '#22d3ee');
    c.fillStyle = g; c.fillRect(0, 0, 512, 320);
    c.fillStyle = 'rgba(255,255,255,0.16)';
    for (var i = 0; i < 12; i++) c.fillRect(i * 44, 0, 22, 320);   // stripes make the warp visible
    var src = tex.toDataURL('image/png');
    var attempt = function (n) {
      if (window.ShaderRunner && window.PointerDisplaceShader) {
        try {
          window.ShaderRunner.create(host, {
            fragmentShader: window.PointerDisplaceShader.fragment,
            uniforms: window.PointerDisplaceShader.defaults,
            imageUniforms: { u_tex: src }
          });
        } catch (e) { console.warn('shader init', e); }
        return;
      }
      if (n < 40) setTimeout(function () { attempt(n + 1); }, 80);
    };
    attempt(0);
  };

  // ============================================
  // Remaining major packs — hand-crafted markup
  // ============================================

  P['blocks/progress-pack.css'] = function (target) {
    packGrid(target, [
      { label: 'gauge', html: '<div class="gauge" style="--g-pct:72;width:140px;height:140px;"></div>' },
      { label: 'adaptive slider', html: '<div class="aslider" style="width:220px;"><div class="aslider-track"><div class="aslider-fill" style="width:65%;"></div><div class="aslider-bubble" style="left:65%;">65</div></div><div class="aslider-ticks"><span></span><span></span><span></span><span></span><span></span></div></div>' },
      { label: 'labeled', html: '<div class="lprog" style="width:220px;"><div class="lprog-track"><div class="lprog-fill" style="width:48%;"></div></div><div class="lprog-label">48% · Compiling…</div></div>' }
    ], null, 260);
  };

  P['components/admin-pack.css'] = function (target) {
    packGrid(target, [
      { label: 'server health', html: '<div class="adm-srv" style="width:260px;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;"><span style="font-weight:600;">web-01</span><span style="color:#10b981;font-size:0.7rem;">● healthy</span></div><div style="display:grid;gap:0.35rem;font-size:0.72rem;"><div>CPU <div style="height:6px;background:rgba(255,255,255,0.08);border-radius:3px;margin-top:2px;"><div style="height:100%;background:#10b981;width:42%;border-radius:3px;"></div></div></div><div>RAM <div style="height:6px;background:rgba(255,255,255,0.08);border-radius:3px;margin-top:2px;"><div style="height:100%;background:#f59e0b;width:78%;border-radius:3px;"></div></div></div><div>Disk <div style="height:6px;background:rgba(255,255,255,0.08);border-radius:3px;margin-top:2px;"><div style="height:100%;background:#8b5cf6;width:35%;border-radius:3px;"></div></div></div></div></div>' },
      { label: 'build pipeline', html: '<div class="adm-pipe" style="display:flex;align-items:center;gap:0.3rem;font-size:0.72rem;"><span style="padding:0.3rem 0.55rem;background:rgba(16,185,129,0.15);border:1px solid #10b981;border-radius:5px;color:#86efac;">✓ Lint</span>→<span style="padding:0.3rem 0.55rem;background:rgba(16,185,129,0.15);border:1px solid #10b981;border-radius:5px;color:#86efac;">✓ Build</span>→<span style="padding:0.3rem 0.55rem;background:rgba(245,158,11,0.15);border:1px solid #f59e0b;border-radius:5px;color:#fcd34d;">◐ Test</span>→<span style="padding:0.3rem 0.55rem;background:rgba(255,255,255,0.05);border:1px dashed rgba(255,255,255,0.15);border-radius:5px;color:rgba(255,255,255,0.5);">Deploy</span></div>' },
      { label: 'api endpoint', html: '<div class="adm-api" style="font-family:monospace;font-size:0.78rem;padding:0.6rem 0.8rem;background:rgba(255,255,255,0.04);border-left:3px solid #8b5cf6;border-radius:6px;"><span style="padding:0.05rem 0.4rem;background:#22c55e;color:#000;border-radius:3px;font-size:0.65rem;font-weight:700;">GET</span> <span style="color:#fff;">/api/users/:id</span><div style="margin-top:0.3rem;font-size:0.65rem;color:rgba(255,255,255,0.45);">200 · 24ms · v2</div></div>' },
      { label: 'env secret', html: '<div class="adm-env" style="font-family:monospace;font-size:0.78rem;padding:0.5rem 0.7rem;background:rgba(255,255,255,0.04);border-radius:6px;display:flex;align-items:center;gap:0.5rem;"><span style="color:#a78bfa;">DATABASE_URL</span><span style="background:rgba(0,0,0,0.4);padding:0.15rem 0.4rem;border-radius:3px;letter-spacing:0.2em;">••••••••</span><button style="background:rgba(139,92,246,0.18);border:1px solid #a78bfa;border-radius:4px;color:#c4b5fd;font-size:0.65rem;padding:0.15rem 0.4rem;cursor:pointer;">Reveal</button></div>' },
      { label: 'queue', html: '<div class="adm-q" style="width:240px;font-size:0.72rem;"><div style="display:flex;justify-content:space-between;margin-bottom:0.4rem;"><span style="font-weight:600;">image-resize</span><span style="color:#fcd34d;">142 pending</span></div><div style="height:6px;background:rgba(255,255,255,0.06);border-radius:3px;"><div style="height:100%;background:linear-gradient(90deg,#8b5cf6,#ec4899);width:62%;border-radius:3px;"></div></div><div style="display:flex;gap:0.7rem;margin-top:0.35rem;font-size:0.65rem;color:rgba(255,255,255,0.5);"><span>✓ 826</span><span>◐ 4</span><span>✗ 3</span></div></div>' },
      { label: 'audit log', html: '<div class="adm-audit" style="width:240px;font-family:monospace;font-size:0.72rem;"><div style="padding:0.35rem 0.5rem;background:rgba(255,255,255,0.04);border-radius:4px;margin-bottom:0.2rem;"><span style="color:#86efac;">CREATE</span> alice@co.com · users.456 <span style="opacity:0.5;">· 2m ago</span></div><div style="padding:0.35rem 0.5rem;background:rgba(255,255,255,0.04);border-radius:4px;"><span style="color:#fca5a5;">DELETE</span> bob@co.com · keys.7 <span style="opacity:0.5;">· 11m ago</span></div></div>' }
    ], null, 280);
  };

  P['components/auth-pack-2.css'] = function (target) {
    packGrid(target, [
      { label: '2FA OTP', html: '<div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;"><div style="font-size:0.75rem;color:rgba(255,255,255,0.6);">Enter 6-digit code</div><div style="display:flex;gap:0.4rem;">' + [1,2,3,4,5,6].map(function(d,i){return '<input value="' + (i<4?d:'') + '" style="width:38px;height:46px;background:rgba(255,255,255,0.05);border:1.5px solid ' + (i<4?'#a78bfa':'rgba(255,255,255,0.12)') + ';border-radius:6px;text-align:center;font-size:1.2rem;font-weight:700;color:#fff;">';}).join('') + '</div></div>' },
      { label: 'SSO', html: '<div style="display:flex;flex-direction:column;gap:0.4rem;width:220px;">' + [['🔍','Google','#fff'],['🐙','GitHub','#fff'],['🍎','Apple','#fff'],['Ⓜ','Microsoft','#fff']].map(function(p){return '<button style="display:flex;align-items:center;gap:0.5rem;padding:0.55rem 0.85rem;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:7px;color:' + p[2] + ';font-size:0.82rem;cursor:pointer;text-align:left;"><span style="font-size:1.05rem;">' + p[0] + '</span> Continue with ' + p[1] + '</button>';}).join('') + '</div>' },
      { label: 'magic link', html: '<div style="text-align:center;padding:1rem;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;max-width:260px;"><div style="font-size:2rem;margin-bottom:0.4rem;">📧</div><div style="font-size:0.85rem;color:#fff;font-weight:600;margin-bottom:0.3rem;">Check your email</div><div style="font-size:0.7rem;color:rgba(255,255,255,0.55);">Link sent to <span style="color:#c4b5fd;">you@example.com</span></div></div>' },
      { label: 'session row', html: '<div style="display:flex;align-items:center;gap:0.7rem;padding:0.6rem 0.8rem;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:7px;width:280px;"><span style="font-size:1.4rem;">💻</span><div style="flex:1;"><div style="font-size:0.78rem;color:#fff;font-weight:600;">MacBook Pro · Chrome</div><div style="font-size:0.65rem;color:rgba(255,255,255,0.45);">San Francisco · current</div></div><button style="background:rgba(239,68,68,0.15);border:1px solid #ef4444;border-radius:4px;color:#fca5a5;font-size:0.65rem;padding:0.2rem 0.5rem;cursor:pointer;">Revoke</button></div>' },
      { label: 'account locked', html: '<div style="padding:0.8rem 1rem;background:rgba(239,68,68,0.1);border-left:3px solid #ef4444;border-radius:6px;max-width:280px;"><div style="display:flex;align-items:center;gap:0.4rem;color:#fca5a5;font-weight:700;font-size:0.85rem;margin-bottom:0.3rem;">🔒 Account locked</div><div style="font-size:0.72rem;color:rgba(255,255,255,0.6);line-height:1.4;">Too many failed attempts. Try again in 15 minutes or reset your password.</div></div>' }
    ], null, 280);
  };

  P['components/cards-pack.css'] = function (target) {
    packGrid(target, [
      { label: 'basic', html: '<div style="width:200px;padding:0.9rem;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;"><div style="font-weight:700;color:#fff;margin-bottom:0.3rem;">Basic card</div><div style="font-size:0.78rem;color:rgba(255,255,255,0.6);">Simple container with padding and border.</div></div>' },
      { label: 'glass', html: '<div style="width:200px;padding:0.9rem;background:linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04));backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.2);border-radius:10px;"><div style="font-weight:700;color:#fff;margin-bottom:0.3rem;">Glass</div><div style="font-size:0.78rem;color:rgba(255,255,255,0.7);">Frosted backdrop blur.</div></div>' },
      { label: 'gradient border', html: '<div style="width:200px;padding:2px;background:linear-gradient(135deg,#8b5cf6,#ec4899);border-radius:10px;"><div style="padding:0.85rem;background:#15152a;border-radius:8px;"><div style="font-weight:700;color:#fff;margin-bottom:0.3rem;">Gradient</div><div style="font-size:0.78rem;color:rgba(255,255,255,0.6);">Gradient border ring.</div></div></div>' },
      { label: 'glow', html: '<div style="width:200px;padding:0.9rem;background:rgba(255,255,255,0.04);border:1px solid rgba(139,92,246,0.4);border-radius:10px;box-shadow:0 0 24px rgba(139,92,246,0.35);"><div style="font-weight:700;color:#fff;margin-bottom:0.3rem;">Glow</div><div style="font-size:0.78rem;color:rgba(255,255,255,0.6);">Soft purple glow.</div></div>' },
      { label: 'stat', html: '<div style="width:200px;padding:0.9rem;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;"><div style="font-size:0.65rem;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.08em;">Revenue</div><div style="font-size:1.8rem;font-weight:800;color:#fff;line-height:1.1;">$48.2k</div><div style="font-size:0.72rem;color:#86efac;">↑ 12.4%</div></div>' },
      { label: 'media', html: '<div style="width:200px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;overflow:hidden;"><div style="height:80px;background:linear-gradient(135deg,#8b5cf6,#ec4899);"></div><div style="padding:0.7rem 0.85rem;"><div style="font-weight:700;color:#fff;font-size:0.85rem;">With media</div><div style="font-size:0.7rem;color:rgba(255,255,255,0.55);">Image / gradient header.</div></div></div>' }
    ], null, 220);
  };

  P['components/checkout-pack.css'] = function (target) {
    packGrid(target, [
      { label: 'step progress', html: '<div style="display:flex;align-items:center;gap:0.4rem;width:280px;">' + ['Cart','Shipping','Payment','Done'].map(function(s,i){var on=i<=1;var cur=i===1;return '<div style="display:flex;align-items:center;gap:0.4rem;font-size:0.7rem;flex:1;"><span style="width:22px;height:22px;border-radius:50%;background:' + (on?'#8b5cf6':'rgba(255,255,255,0.1)') + ';color:#fff;display:grid;place-items:center;font-weight:700;font-size:0.7rem;border:' + (cur?'2px solid #c4b5fd':'none') + ';">' + (on&&!cur?'✓':(i+1)) + '</span><span style="color:' + (on?'#fff':'rgba(255,255,255,0.45)') + ';">' + s + '</span>' + (i<3?'<span style="flex:1;height:1px;background:' + (i<1?'#8b5cf6':'rgba(255,255,255,0.12)') + ';"></span>':'') + '</div>';}).join('') + '</div>' },
      { label: 'payment methods', html: '<div style="display:flex;flex-direction:column;gap:0.35rem;width:240px;">' + [['💳','Card ending 4242',true],['🍎','Apple Pay',false],['🟢','Google Pay',false]].map(function(p){return '<div style="display:flex;align-items:center;gap:0.6rem;padding:0.55rem 0.8rem;background:' + (p[2]?'rgba(139,92,246,0.12)':'rgba(255,255,255,0.04)') + ';border:1px solid ' + (p[2]?'#a78bfa':'rgba(255,255,255,0.1)') + ';border-radius:7px;"><span style="font-size:1.1rem;">' + p[0] + '</span><span style="font-size:0.8rem;color:#fff;flex:1;">' + p[1] + '</span>' + (p[2]?'<span style="color:#86efac;">✓</span>':'') + '</div>';}).join('') + '</div>' },
      { label: 'order summary', html: '<div style="width:240px;padding:0.9rem;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;font-size:0.78rem;"><div style="display:flex;justify-content:space-between;color:rgba(255,255,255,0.7);margin-bottom:0.3rem;">Subtotal<span>$84.00</span></div><div style="display:flex;justify-content:space-between;color:rgba(255,255,255,0.7);margin-bottom:0.3rem;">Shipping<span>$8.00</span></div><div style="display:flex;justify-content:space-between;color:#86efac;margin-bottom:0.6rem;">Discount<span>−$10.00</span></div><div style="display:flex;justify-content:space-between;font-weight:700;color:#fff;padding-top:0.5rem;border-top:1px solid rgba(255,255,255,0.1);">Total<span>$82.00</span></div></div>' },
      { label: 'discount input', html: '<div style="display:flex;align-items:center;gap:0;width:280px;background:rgba(255,255,255,0.05);border:1px solid #22c55e;border-radius:8px;overflow:hidden;"><span style="padding:0 0.6rem;color:#86efac;">🎟</span><input value="WELCOME10" style="flex:1;padding:0.55rem 0;background:transparent;border:none;color:#fff;font-family:monospace;font-size:0.85rem;outline:none;letter-spacing:0.1em;font-weight:700;"><span style="padding:0 0.7rem;color:#86efac;font-size:0.75rem;font-weight:700;">−$10.00 ✓</span></div>' },
      { label: 'success receipt', html: '<div style="text-align:center;padding:1.2rem 1rem;background:rgba(34,197,94,0.08);border:1px solid #22c55e;border-radius:10px;max-width:240px;"><div style="width:50px;height:50px;border-radius:50%;background:#22c55e;display:grid;place-items:center;font-size:1.6rem;margin:0 auto 0.5rem;">✓</div><div style="font-weight:700;color:#fff;margin-bottom:0.2rem;">Order placed!</div><div style="font-size:0.72rem;color:rgba(255,255,255,0.55);">#A1B2C3 · $82.00</div></div>' }
    ], null, 280);
  };

  P['components/commerce-pack.css'] = function (target) {
    packGrid(target, [
      { label: 'add to cart', html: '<button style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.55rem 1.1rem;background:linear-gradient(135deg,#8b5cf6,#ec4899);border:none;border-radius:8px;color:#fff;font-weight:700;font-size:0.85rem;cursor:pointer;box-shadow:0 4px 16px rgba(139,92,246,0.4);">🛒 Add to cart · $48</button>' },
      { label: 'qty stepper', html: '<div style="display:inline-flex;align-items:center;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.12);border-radius:7px;overflow:hidden;"><button style="padding:0.4rem 0.7rem;background:transparent;border:none;color:#fff;cursor:pointer;font-size:1rem;">−</button><span style="padding:0 0.7rem;color:#fff;font-weight:700;min-width:34px;text-align:center;">3</span><button style="padding:0.4rem 0.7rem;background:transparent;border:none;color:#fff;cursor:pointer;font-size:1rem;">+</button></div>' },
      { label: 'color swatches', html: '<div style="display:flex;gap:0.4rem;">' + [['#1a1a2e',true],['#8b5cf6',false],['#ec4899',false],['#22c55e',false],['#facc15',false],['#0a0a14',false,true]].map(function(c){return '<button style="width:30px;height:30px;border-radius:50%;background:' + c[0] + ';border:2px solid ' + (c[1]?'#fff':'transparent') + ';position:relative;cursor:pointer;' + (c[2]?'opacity:0.4;':'') + '">' + (c[2]?'<span style="position:absolute;inset:0;display:grid;place-items:center;color:#fff;">×</span>':'') + '</button>';}).join('') + '</div>' },
      { label: 'size picker', html: '<div style="display:flex;gap:0.3rem;">' + ['XS','S','M','L','XL'].map(function(s,i){var on=i===2;var dis=i===4;return '<button style="width:38px;height:38px;border-radius:6px;background:' + (on?'#fff':'rgba(255,255,255,0.04)') + ';border:1px solid ' + (on?'#fff':'rgba(255,255,255,0.12)') + ';color:' + (on?'#000':dis?'rgba(255,255,255,0.25)':'#fff') + ';font-weight:700;font-size:0.78rem;cursor:pointer;text-decoration:' + (dis?'line-through':'none') + ';">' + s + '</button>';}).join('') + '</div>' },
      { label: 'price strike', html: '<div style="display:inline-flex;align-items:baseline;gap:0.5rem;"><span style="font-size:1.4rem;font-weight:800;color:#ec4899;">$24</span><span style="color:rgba(255,255,255,0.4);text-decoration:line-through;font-size:0.95rem;">$48</span><span style="padding:0.15rem 0.45rem;background:rgba(239,68,68,0.15);color:#fca5a5;border-radius:4px;font-size:0.65rem;font-weight:700;">−50%</span></div>' },
      { label: 'stock status', html: '<div style="display:inline-flex;align-items:center;gap:0.4rem;font-size:0.78rem;padding:0.3rem 0.6rem;background:rgba(34,197,94,0.1);border:1px solid #22c55e;border-radius:5px;color:#86efac;"><span style="width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 8px #22c55e;animation:dapp-pulse 1.6s ease-in-out infinite;"></span>In stock · 4 left</div>' }
    ], null, 250);
  };

  P['components/cta-sections.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:0.8rem;width:100%;max-width:520px;">' +
        '<div style="padding:1.4rem;background:linear-gradient(135deg,#1a1a2e,#15152a);border:1px solid rgba(255,255,255,0.08);border-radius:12px;text-align:center;">' +
          '<div style="font-size:1.4rem;font-weight:800;color:#fff;margin-bottom:0.3rem;">Ship faster. Sleep better.</div>' +
          '<div style="font-size:0.85rem;color:rgba(255,255,255,0.6);margin-bottom:0.8rem;">Drop-in components your team will love.</div>' +
          '<button style="padding:0.6rem 1.3rem;background:linear-gradient(135deg,#8b5cf6,#ec4899);border:none;border-radius:8px;color:#fff;font-weight:700;cursor:pointer;">Get started — it\'s free</button>' +
        '</div>' +
        '<div style="padding:1rem 1.2rem;background:rgba(139,92,246,0.08);border:1px solid rgba(139,92,246,0.25);border-radius:10px;display:flex;align-items:center;gap:0.8rem;">' +
          '<div style="font-size:1.8rem;">🎯</div>' +
          '<div style="flex:1;"><div style="font-weight:700;color:#fff;">Save 30% on Pro</div><div style="font-size:0.75rem;color:rgba(255,255,255,0.6);">Black Friday — ends in 2 days.</div></div>' +
          '<button style="padding:0.4rem 0.95rem;background:#fff;border:none;border-radius:6px;color:#000;font-weight:700;font-size:0.8rem;cursor:pointer;">Claim →</button>' +
        '</div>' +
      '</div>';
  };

  P['components/editor-pack.css'] = function (target) {
    packGrid(target, [
      { label: 'find-replace', html: '<div style="display:flex;flex-direction:column;gap:0.3rem;padding:0.5rem;background:#1a1a2e;border-radius:7px;width:280px;border:1px solid rgba(255,255,255,0.1);"><div style="display:flex;gap:0.3rem;align-items:center;"><input value="useEffect" style="flex:1;padding:0.3rem 0.5rem;background:rgba(255,255,255,0.05);border:1px solid rgba(139,92,246,0.4);border-radius:4px;color:#fff;font-family:monospace;font-size:0.78rem;outline:none;"><span style="font-size:0.65rem;color:rgba(255,255,255,0.6);font-family:monospace;">3 of 12</span></div><div style="display:flex;gap:0.3rem;align-items:center;"><input value="useLayoutEffect" placeholder="Replace" style="flex:1;padding:0.3rem 0.5rem;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:4px;color:#fff;font-family:monospace;font-size:0.78rem;outline:none;"><div style="display:flex;gap:0.15rem;"><button style="padding:0.15rem 0.35rem;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:3px;color:#c4b5fd;font-size:0.65rem;cursor:pointer;font-family:monospace;">Aa</button><button style="padding:0.15rem 0.35rem;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:3px;color:#c4b5fd;font-size:0.65rem;cursor:pointer;font-family:monospace;">W</button><button style="padding:0.15rem 0.35rem;background:rgba(139,92,246,0.25);border:1px solid #a78bfa;border-radius:3px;color:#c4b5fd;font-size:0.65rem;cursor:pointer;font-family:monospace;">.*</button></div></div></div>' },
      { label: 'gutter', html: '<div style="display:flex;background:#0a0a14;border:1px solid rgba(255,255,255,0.08);border-radius:7px;overflow:hidden;font-family:ui-monospace,monospace;font-size:0.78rem;line-height:1.6;">' + '<div style="padding:0.5rem 0.6rem;background:rgba(255,255,255,0.03);color:rgba(255,255,255,0.35);text-align:right;border-right:1px solid rgba(255,255,255,0.06);">' + [42,43,44,45,46].map(function(n,i){var dot = i===1?'<span style="color:#22c55e;">+</span>':i===3?'<span style="color:#ef4444;">●</span>':'';return n + ' ' + dot;}).join('<br>') + '</div>' + '<div style="padding:0.5rem 0.7rem;color:#e6e6f0;">' + ['<span style="color:#c4b5fd;">function</span> add(a, b) {','&nbsp;&nbsp;<span style="color:#86efac;">// validate inputs</span>','&nbsp;&nbsp;<span style="color:#c4b5fd;">if</span> (!a) <span style="color:#c4b5fd;">return</span>;','&nbsp;&nbsp;<span style="color:#fda4af;">throw new Error()</span>;','}'].join('<br>') + '</div></div>' },
      { label: 'tab strip', html: '<div style="display:flex;background:#0a0a14;border-radius:7px 7px 0 0;overflow:hidden;border:1px solid rgba(255,255,255,0.1);">' + [['App.tsx',false,false],['index.tsx',true,true],['utils.ts',false,false],['types.d.ts',false,false]].map(function(t){return '<div style="display:flex;align-items:center;gap:0.4rem;padding:0.4rem 0.7rem;background:' + (t[1]?'#1a1a2e':'transparent') + ';border-right:1px solid rgba(255,255,255,0.06);font-size:0.72rem;font-family:monospace;color:' + (t[1]?'#fff':'rgba(255,255,255,0.55)') + ';cursor:pointer;border-bottom:2px solid ' + (t[1]?'#8b5cf6':'transparent') + ';">' + t[0] + (t[2]?' <span style="color:#fcd34d;">●</span>':'') + ' <span style="opacity:0.5;">×</span></div>';}).join('') + '</div>' },
      { label: 'git status', html: '<div style="display:flex;align-items:center;gap:0.5rem;padding:0.4rem 0.7rem;background:#1a1a2e;border:1px solid rgba(255,255,255,0.08);border-radius:6px;font-family:monospace;font-size:0.72rem;"><span style="color:#a78bfa;">⌥ feature/auth</span><span style="color:rgba(255,255,255,0.4);">|</span><span style="color:#86efac;">↑2</span><span style="color:#fcd34d;">↓1</span><span style="color:rgba(255,255,255,0.4);">|</span><span style="color:#86efac;">+12</span><span style="color:#fcd34d;">~3</span><span style="color:#fca5a5;">−5</span></div>' }
    ], null, 320);
  };

  P['components/email-pack.css'] = function (target) {
    packGrid(target, [
      { label: 'email row', html: '<div style="display:flex;align-items:center;gap:0.6rem;padding:0.55rem 0.85rem;background:rgba(139,92,246,0.08);border-left:3px solid #a78bfa;border-radius:6px;width:320px;"><span style="width:28px;height:28px;border-radius:50%;background:#8b5cf6;color:#fff;font-size:0.7rem;display:grid;place-items:center;font-weight:700;">AS</span><div style="flex:1;min-width:0;"><div style="font-size:0.8rem;color:#fff;font-weight:700;">Alice Sterling <span style="color:rgba(255,255,255,0.5);font-weight:400;font-size:0.7rem;float:right;">2h</span></div><div style="font-size:0.72rem;color:rgba(255,255,255,0.55);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">Quick question about the integration plan…</div></div><span style="padding:0.05rem 0.35rem;background:rgba(139,92,246,0.3);color:#c4b5fd;border-radius:3px;font-size:0.6rem;font-weight:700;">WORK</span></div>' },
      { label: 'compose modal', html: '<div style="width:300px;background:#1a1a2e;border:1px solid rgba(255,255,255,0.12);border-radius:8px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,0.5);"><div style="padding:0.5rem 0.7rem;background:rgba(255,255,255,0.04);display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.05);"><span style="font-size:0.78rem;color:#fff;font-weight:600;">New message</span><span style="color:rgba(255,255,255,0.5);font-size:1rem;">_ □ ×</span></div><div style="padding:0.7rem;"><input value="alice@co.com" style="width:100%;padding:0.25rem 0;background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,0.06);color:#fff;font-size:0.78rem;outline:none;margin-bottom:0.4rem;"><input value="Re: design review" style="width:100%;padding:0.25rem 0;background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,0.06);color:#fff;font-size:0.78rem;outline:none;font-weight:700;margin-bottom:0.4rem;"><div style="min-height:54px;color:rgba(255,255,255,0.45);font-size:0.78rem;line-height:1.5;">Thanks for the notes — I\'ll have v2 ready by EOD.</div></div></div>' },
      { label: 'label sidebar', html: '<div style="display:flex;flex-direction:column;gap:0.2rem;width:200px;padding:0.6rem;background:rgba(255,255,255,0.02);border-radius:7px;">' + [['📥','Inbox',24,true],['⭐','Starred',8,false],['📤','Sent',0,false],['📁','Archive',0,false]].map(function(it){return '<div style="display:flex;align-items:center;gap:0.5rem;padding:0.4rem 0.6rem;background:' + (it[3]?'rgba(139,92,246,0.15)':'transparent') + ';border-radius:5px;font-size:0.78rem;color:' + (it[3]?'#fff':'rgba(255,255,255,0.7)') + ';cursor:pointer;"><span>' + it[0] + '</span><span style="flex:1;font-weight:' + (it[3]?'700':'400') + ';">' + it[1] + '</span>' + (it[2]>0?'<span style="font-size:0.65rem;color:rgba(255,255,255,0.55);">' + it[2] + '</span>':'') + '</div>';}).join('') + '</div>' }
    ], null, 320);
  };

  P['components/form-pack.css'] = function (target) {
    packGrid(target, [
      { label: 'multi-step', html: '<div style="width:300px;"><div style="display:flex;gap:0.4rem;margin-bottom:0.6rem;">' + [1,2,3,4].map(function(n,i){return '<div style="flex:1;height:4px;background:' + (i<2?'#8b5cf6':'rgba(255,255,255,0.08)') + ';border-radius:2px;"></div>';}).join('') + '</div><div style="font-size:0.7rem;color:rgba(255,255,255,0.5);">Step 2 of 4 — Your profile</div></div>' },
      { label: 'field validation', html: '<div style="display:flex;flex-direction:column;gap:0.3rem;width:240px;"><label style="font-size:0.7rem;color:rgba(255,255,255,0.7);font-weight:600;">Email</label><div style="position:relative;"><input value="alice@" style="width:100%;padding:0.5rem 2rem 0.5rem 0.7rem;background:rgba(255,255,255,0.05);border:1.5px solid #ef4444;border-radius:6px;color:#fff;font-size:0.85rem;outline:none;"><span style="position:absolute;right:0.6rem;top:50%;transform:translateY(-50%);color:#ef4444;">⚠</span></div><div style="font-size:0.7rem;color:#fca5a5;">✕ Invalid email format</div></div>' },
      { label: 'password meter', html: '<div style="width:240px;"><input type="password" value="Tr0ub4dor!" style="width:100%;padding:0.5rem 0.7rem;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);border-radius:6px;color:#fff;font-size:0.85rem;outline:none;font-family:monospace;margin-bottom:0.4rem;"><div style="display:flex;gap:0.25rem;margin-bottom:0.3rem;"><div style="flex:1;height:3px;background:#22c55e;border-radius:2px;"></div><div style="flex:1;height:3px;background:#22c55e;border-radius:2px;"></div><div style="flex:1;height:3px;background:#22c55e;border-radius:2px;"></div><div style="flex:1;height:3px;background:#fcd34d;border-radius:2px;"></div></div><div style="font-size:0.7rem;color:#fcd34d;">Strong · 3/4</div></div>' },
      { label: 'file upload', html: '<div style="width:260px;height:120px;border:2px dashed rgba(139,92,246,0.4);border-radius:10px;background:rgba(139,92,246,0.05);display:grid;place-items:center;text-align:center;"><div><div style="font-size:1.8rem;margin-bottom:0.2rem;">📤</div><div style="font-size:0.78rem;color:#c4b5fd;font-weight:600;">Drop files here</div><div style="font-size:0.65rem;color:rgba(255,255,255,0.5);">or click to browse</div></div></div>' },
      { label: 'captcha', html: '<div style="display:flex;align-items:center;gap:0.7rem;padding:0.7rem 1rem;background:#fff;border-radius:6px;width:240px;"><input type="checkbox" checked style="width:22px;height:22px;accent-color:#22c55e;"><span style="font-size:0.85rem;color:#000;font-weight:600;flex:1;">I\'m not a robot</span><div style="font-size:0.55rem;color:#666;font-weight:700;text-align:center;line-height:1;">reCAPTCHA<br><span style="font-weight:400;">privacy</span></div></div>' }
    ], null, 280);
  };

  P['components/input-pack.css'] = function (target) {
    packGrid(target, [
      { label: 'basic', html: '<input placeholder="Email" style="padding:0.55rem 0.85rem;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);border-radius:7px;color:#fff;font-size:0.85rem;outline:none;width:220px;">' },
      { label: 'underline', html: '<input value="Alice" style="padding:0.4rem 0;background:transparent;border:none;border-bottom:1.5px solid #a78bfa;color:#fff;font-size:0.95rem;outline:none;width:220px;">' },
      { label: 'pill', html: '<input placeholder="Search…" style="padding:0.55rem 1.1rem;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);border-radius:999px;color:#fff;font-size:0.85rem;outline:none;width:220px;">' },
      { label: 'with icon', html: '<div style="position:relative;width:220px;"><span style="position:absolute;left:0.7rem;top:50%;transform:translateY(-50%);color:rgba(255,255,255,0.55);">🔍</span><input placeholder="Search" style="width:100%;padding:0.55rem 0.85rem 0.55rem 2rem;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);border-radius:7px;color:#fff;font-size:0.85rem;outline:none;"></div>' },
      { label: 'gradient border', html: '<div style="padding:1.5px;background:linear-gradient(135deg,#8b5cf6,#ec4899);border-radius:8px;width:220px;"><input value="Premium" style="width:100%;padding:0.5rem 0.85rem;background:#15152a;border:none;border-radius:6.5px;color:#fff;font-size:0.85rem;outline:none;"></div>' },
      { label: 'floating label', html: '<div style="position:relative;width:220px;"><input value="alice@co" style="width:100%;padding:1.1rem 0.85rem 0.4rem;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);border-radius:7px;color:#fff;font-size:0.85rem;outline:none;"><label style="position:absolute;left:0.85rem;top:0.35rem;font-size:0.6rem;color:#a78bfa;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Email</label></div>' }
    ], null, 240);
  };

  P['components/ratings-pack.css'] = function (target) {
    packGrid(target, [
      { label: 'stars', html: '<div style="font-size:1.4rem;letter-spacing:0.1em;color:#fcd34d;">★★★★<span style="color:rgba(255,255,255,0.15);">★</span></div>' },
      { label: 'distribution', html: '<div style="width:240px;font-family:monospace;font-size:0.72rem;color:#fff;">' + [[5,68],[4,18],[3,8],[2,4],[1,2]].map(function(r){return '<div style="display:flex;align-items:center;gap:0.4rem;margin-bottom:0.25rem;"><span style="color:#fcd34d;">' + r[0] + '★</span><div style="flex:1;height:6px;background:rgba(255,255,255,0.06);border-radius:3px;"><div style="width:' + r[1] + '%;height:100%;background:#fcd34d;border-radius:3px;"></div></div><span style="color:rgba(255,255,255,0.5);">' + r[1] + '%</span></div>';}).join('') + '</div>' },
      { label: 'review card', html: '<div style="padding:0.8rem;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;width:280px;"><div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;"><span style="width:30px;height:30px;border-radius:50%;background:#8b5cf6;color:#fff;font-size:0.78rem;display:grid;place-items:center;font-weight:700;">AS</span><div style="flex:1;"><div style="font-size:0.78rem;color:#fff;font-weight:600;">Alice S. <span style="color:#22c55e;font-size:0.62rem;">✓ Verified</span></div><div style="font-size:1rem;letter-spacing:0.05em;color:#fcd34d;">★★★★★</div></div></div><div style="font-size:0.78rem;color:rgba(255,255,255,0.7);line-height:1.5;">Game-changer. Saved us weeks of frontend work.</div></div>' },
      { label: 'NPS', html: '<div style="display:flex;gap:0.2rem;">' + [0,1,2,3,4,5,6,7,8,9,10].map(function(n){var c=n<=6?'#ef4444':n<=8?'#fcd34d':'#22c55e';var on=n===9;return '<button style="width:28px;height:28px;border-radius:5px;background:' + (on?c:'rgba(255,255,255,0.04)') + ';border:1.5px solid ' + (on?c:'rgba(255,255,255,0.1)') + ';color:' + (on?'#000':'#fff') + ';font-weight:700;font-size:0.72rem;cursor:pointer;">' + n + '</button>';}).join('') + '</div>' },
      { label: 'thumbs', html: '<div style="display:flex;gap:0.4rem;"><button style="padding:0.5rem 1.1rem;background:rgba(34,197,94,0.15);border:1px solid #22c55e;border-radius:7px;color:#86efac;font-size:0.85rem;cursor:pointer;">👍 124</button><button style="padding:0.5rem 1.1rem;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.3);border-radius:7px;color:rgba(255,255,255,0.55);font-size:0.85rem;cursor:pointer;">👎 3</button></div>' }
    ], null, 300);
  };

  P['components/scheduler-pack.css'] = function (target) {
    packGrid(target, [
      { label: 'availability grid', html: '<div style="width:280px;"><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-bottom:0.4rem;">' + ['M','T','W','T','F','S','S'].map(function(d){return '<div style="text-align:center;font-size:0.65rem;color:rgba(255,255,255,0.5);font-weight:600;">' + d + '</div>';}).join('') + '</div><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;">' + Array.from({length:35},function(_,i){var on=[2,3,4,5,9,10,11,12,16,17,18,23,24,25].indexOf(i)!==-1;return '<div style="height:14px;background:' + (on?'#8b5cf6':'rgba(255,255,255,0.05)') + ';border-radius:2px;"></div>';}).join('') + '</div></div>' },
      { label: 'calendar strip', html: '<div style="display:flex;gap:0.3rem;overflow-x:auto;padding-bottom:0.3rem;max-width:300px;">' + ['Mon 12','Tue 13','Wed 14','Thu 15','Fri 16','Sat 17'].map(function(d,i){var on=i===2;return '<button style="flex-shrink:0;padding:0.5rem 0.7rem;background:' + (on?'#8b5cf6':'rgba(255,255,255,0.04)') + ';border:1px solid ' + (on?'#a78bfa':'rgba(255,255,255,0.1)') + ';border-radius:7px;color:#fff;font-size:0.72rem;font-weight:' + (on?'700':'500') + ';cursor:pointer;">' + d + '</button>';}).join('') + '</div>' },
      { label: 'timeline slots', html: '<div style="width:280px;font-size:0.72rem;font-family:monospace;">' + ['09:00 — Standup','11:30 — Design review','14:00 — 1:1 with Alice','16:30 — Demo'].map(function(s,i){var c=['#a78bfa','#86efac','#fcd34d','#fda4af'][i];return '<div style="display:flex;align-items:center;gap:0.4rem;padding:0.35rem 0.55rem;background:rgba(255,255,255,0.03);border-left:3px solid ' + c + ';border-radius:0 5px 5px 0;margin-bottom:3px;color:#fff;">' + s + '</div>';}).join('') + '</div>' }
    ], null, 300);
  };

  P['components/search-pack.css'] = function (target) {
    packGrid(target, [
      { label: 'search input', html: '<div style="position:relative;width:280px;"><span style="position:absolute;left:0.7rem;top:50%;transform:translateY(-50%);color:rgba(255,255,255,0.55);">🔍</span><input value="React hooks" style="width:100%;padding:0.55rem 4rem 0.55rem 2.2rem;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);border-radius:7px;color:#fff;font-size:0.85rem;outline:none;"><span style="position:absolute;right:2.4rem;top:50%;transform:translateY(-50%);color:rgba(255,255,255,0.4);font-size:0.75rem;cursor:pointer;">×</span><kbd style="position:absolute;right:0.5rem;top:50%;transform:translateY(-50%);padding:0.15rem 0.4rem;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:4px;font-size:0.65rem;color:rgba(255,255,255,0.55);font-family:monospace;">⌘K</kbd></div>' },
      { label: 'filter chips', html: '<div style="display:flex;flex-wrap:wrap;gap:0.3rem;max-width:300px;">' + [['Frontend',true],['React',true],['TypeScript',false],['CSS',false]].map(function(c){return '<span style="padding:0.25rem 0.65rem 0.25rem 0.7rem;background:' + (c[1]?'rgba(139,92,246,0.15)':'rgba(255,255,255,0.04)') + ';border:1px solid ' + (c[1]?'#a78bfa':'rgba(255,255,255,0.1)') + ';border-radius:999px;color:' + (c[1]?'#c4b5fd':'rgba(255,255,255,0.7)') + ';font-size:0.7rem;cursor:pointer;">' + c[0] + (c[1]?' <span style="opacity:0.6;">×</span>':'') + '</span>';}).join('') + ' <button style="padding:0.25rem 0.65rem;background:transparent;border:none;color:rgba(255,255,255,0.5);font-size:0.7rem;cursor:pointer;text-decoration:underline;">Clear all</button></div>' },
      { label: 'result card', html: '<div style="padding:0.6rem 0.85rem;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:7px;width:300px;"><div style="font-size:0.85rem;color:#fff;font-weight:600;margin-bottom:0.2rem;">Build a custom <mark style="background:rgba(252,211,77,0.3);color:#fcd34d;padding:0.05rem 0.2rem;border-radius:2px;">hook</mark> in React</div><div style="font-size:0.7rem;color:rgba(255,255,255,0.55);">react.dev · Docs · 4 min read</div></div>' },
      { label: 'no results', html: '<div style="text-align:center;padding:1.2rem 1rem;width:280px;"><div style="font-size:2.5rem;margin-bottom:0.4rem;">🔍</div><div style="font-size:0.9rem;color:#fff;font-weight:600;margin-bottom:0.3rem;">No results for "xyzzy"</div><div style="font-size:0.72rem;color:rgba(255,255,255,0.5);">Try different keywords or check spelling.</div></div>' }
    ], null, 320);
  };

  P['components/table-pack-2.css'] = function (target) {
    target.innerHTML =
      '<div style="width:100%;max-width:520px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.1);border-radius:10px;overflow:hidden;">' +
        '<div style="display:grid;grid-template-columns:1fr 1fr 80px 80px;gap:0;font-size:0.72rem;">' +
          ['Name','Email','Role','Status'].map(function(h){return '<div style="padding:0.55rem 0.8rem;background:rgba(255,255,255,0.04);color:rgba(255,255,255,0.55);font-weight:700;text-transform:uppercase;letter-spacing:0.05em;font-size:0.65rem;">' + h + '</div>';}).join('') +
          [
            ['Alice Sterling','alice@co.com','Admin','#22c55e'],
            ['Bob Jensen','bob@co.com','Member','#22c55e'],
            ['Carol Diaz','carol@co.com','Member','#facc15'],
            ['Dan Park','dan@co.com','Viewer','#ef4444']
          ].map(function(r,i){return r.slice(0,3).map(function(c){return '<div style="padding:0.55rem 0.8rem;border-top:1px solid rgba(255,255,255,0.05);color:#fff;font-size:0.78rem;">' + c + '</div>';}).join('') + '<div style="padding:0.55rem 0.8rem;border-top:1px solid rgba(255,255,255,0.05);"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + r[3] + ';"></span></div>';}).join('') +
        '</div>' +
        '<div style="padding:0.4rem 0.8rem;background:rgba(255,255,255,0.02);border-top:1px solid rgba(255,255,255,0.05);display:flex;justify-content:space-between;align-items:center;font-size:0.7rem;color:rgba(255,255,255,0.5);">' +
          '<span>Page 1 of 4 · 24 rows</span>' +
          '<div style="display:flex;gap:0.3rem;"><button style="padding:0.2rem 0.55rem;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:4px;color:#fff;cursor:pointer;">←</button><button style="padding:0.2rem 0.55rem;background:rgba(139,92,246,0.2);border:1px solid #a78bfa;border-radius:4px;color:#fff;cursor:pointer;">→</button></div>' +
        '</div>' +
      '</div>';
  };

  P['components/timer-pack.css'] = function (target) {
    packGrid(target, [
      { label: 'pomodoro', html: '<div style="display:flex;flex-direction:column;align-items:center;gap:0.4rem;padding:0.8rem;background:rgba(239,68,68,0.05);border:1px solid rgba(239,68,68,0.25);border-radius:10px;width:160px;"><div style="font-family:ui-monospace,monospace;font-size:2.2rem;font-weight:800;color:#fff;">23:47</div><div style="display:flex;gap:0.3rem;">' + [true,true,true,false].map(function(on,i){return '<span style="width:8px;height:8px;border-radius:50%;background:' + (on?'#ef4444':'rgba(255,255,255,0.15)') + ';"></span>';}).join('') + '</div><div style="font-size:0.7rem;color:rgba(255,255,255,0.6);">Pomodoro 4</div></div>' },
      { label: 'focus ring', html: '<div style="position:relative;width:120px;height:120px;"><svg viewBox="0 0 120 120" style="transform:rotate(-90deg);"><circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="8"/><circle cx="60" cy="60" r="52" fill="none" stroke="#8b5cf6" stroke-width="8" stroke-dasharray="' + (Math.PI*2*52*0.68) + ' ' + (Math.PI*2*52) + '" stroke-linecap="round"/></svg><div style="position:absolute;inset:0;display:grid;place-items:center;"><div style="font-family:monospace;font-size:1.4rem;font-weight:800;color:#fff;">17:32</div></div></div>' },
      { label: 'stopwatch', html: '<div style="text-align:center;padding:0.7rem;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:8px;width:180px;"><div style="font-family:monospace;font-size:1.8rem;font-weight:800;color:#fff;">01:42<span style="color:rgba(255,255,255,0.4);font-size:1.2rem;">.83</span></div><div style="display:flex;justify-content:center;gap:0.7rem;font-size:0.65rem;color:rgba(255,255,255,0.55);margin-top:0.3rem;"><span>BEST 00:42</span><span>AVG 01:18</span></div></div>' },
      { label: 'race clock', html: '<div style="text-align:center;padding:0.6rem 1rem;background:#000;border:2px solid #fcd34d;border-radius:6px;box-shadow:0 0 24px rgba(252,211,77,0.4);"><div style="font-family:\'Digital\',monospace;font-size:2rem;font-weight:800;color:#fcd34d;text-shadow:0 0 12px #fcd34d;">2:31.42</div></div>' }
    ], null, 200);
  };

  P['components/widget-cards-pack.css'] = function (target) {
    packGrid(target, [
      { label: 'weather', html: '<div style="width:180px;padding:0.95rem;background:linear-gradient(135deg,#3b82f6,#1e40af);border-radius:14px;color:#fff;"><div style="font-size:0.78rem;opacity:0.85;">San Francisco</div><div style="font-size:2.2rem;font-weight:300;line-height:1.1;">68°</div><div style="font-size:0.72rem;opacity:0.85;margin-top:0.2rem;">☁ Partly cloudy</div></div>' },
      { label: 'activity', html: '<div style="width:180px;padding:0.95rem;background:linear-gradient(135deg,#000,#1a1a2e);border-radius:14px;color:#fff;"><div style="font-size:0.65rem;color:rgba(255,255,255,0.55);text-transform:uppercase;letter-spacing:0.06em;">Move</div><div style="font-size:1.6rem;font-weight:800;">420<span style="font-size:0.8rem;color:rgba(255,255,255,0.5);">/500</span></div><div style="height:5px;background:rgba(255,255,255,0.08);border-radius:3px;margin-top:0.3rem;"><div style="width:84%;height:100%;background:linear-gradient(90deg,#ef4444,#f97316);border-radius:3px;"></div></div></div>' },
      { label: 'meeting', html: '<div style="width:180px;padding:0.85rem;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;"><div style="font-size:0.65rem;color:#86efac;text-transform:uppercase;letter-spacing:0.05em;font-weight:700;">Next · 15m</div><div style="font-size:0.95rem;color:#fff;font-weight:700;margin-top:0.3rem;">Design review</div><div style="font-size:0.7rem;color:rgba(255,255,255,0.55);">3 attendees · Zoom</div></div>' }
    ], null, 200);
  };

  P['data-viz/charts-pro.css'] = function (target) {
    packGrid(target, [
      { label: 'heatmap', html: '<div style="display:grid;grid-template-columns:repeat(12,12px);grid-auto-rows:12px;gap:2px;">' + Array.from({length:84},function(){var v=Math.random();var op=v<0.25?0.08:v<0.5?0.3:v<0.75?0.6:1;return '<div style="background:rgba(34,197,94,' + op + ');border-radius:2px;"></div>';}).join('') + '</div>' },
      { label: 'donut', html: '<svg width="120" height="120" viewBox="0 0 42 42"><circle cx="21" cy="21" r="15.9" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="6"/><circle cx="21" cy="21" r="15.9" fill="none" stroke="#8b5cf6" stroke-width="6" stroke-dasharray="40 100" transform="rotate(-90 21 21)"/><circle cx="21" cy="21" r="15.9" fill="none" stroke="#ec4899" stroke-width="6" stroke-dasharray="25 100" stroke-dashoffset="-40" transform="rotate(-90 21 21)"/><circle cx="21" cy="21" r="15.9" fill="none" stroke="#22c55e" stroke-width="6" stroke-dasharray="20 100" stroke-dashoffset="-65" transform="rotate(-90 21 21)"/></svg>' },
      { label: 'gauge', html: '<svg width="160" height="100" viewBox="0 0 160 100"><path d="M 20 90 A 60 60 0 0 1 140 90" stroke="rgba(255,255,255,0.08)" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M 20 90 A 60 60 0 0 1 110 30" stroke="url(#gg1)" stroke-width="14" fill="none" stroke-linecap="round"/><defs><linearGradient id="gg1"><stop offset="0" stop-color="#22c55e"/><stop offset="1" stop-color="#facc15"/></linearGradient></defs><text x="80" y="80" text-anchor="middle" fill="#fff" font-size="18" font-weight="800">72%</text></svg>' },
      { label: 'candlestick', html: '<svg width="200" height="80" viewBox="0 0 200 80">' + Array.from({length:14},function(_,i){var x=10+i*14;var h=20+Math.random()*40;var y=20+Math.random()*20;var bull=Math.random()>0.5;var c=bull?'#22c55e':'#ef4444';return '<line x1="' + (x+3) + '" y1="' + (y-6) + '" x2="' + (x+3) + '" y2="' + (y+h+6) + '" stroke="' + c + '" stroke-width="1"/><rect x="' + x + '" y="' + y + '" width="6" height="' + h + '" fill="' + c + '"/>';}).join('') + '</svg>' }
    ], null, 220);
  };

  P['effects/hover-effects.css'] = function (target) {
    packGrid(target, [
      { label: 'lift', html: '<div style="padding:1rem 1.4rem;background:linear-gradient(135deg,#1a1a2e,#15152a);border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:#fff;font-weight:700;transition:transform 0.25s ease,box-shadow 0.25s ease;cursor:pointer;" onmouseenter="this.style.transform=\'translateY(-3px)\';this.style.boxShadow=\'0 10px 30px rgba(139,92,246,0.3)\'" onmouseleave="this.style.transform=\'\';this.style.boxShadow=\'\'">Hover lift</div>' },
      { label: 'glow', html: '<div style="padding:1rem 1.4rem;background:#1a1a2e;border:1px solid rgba(139,92,246,0.3);border-radius:10px;color:#fff;font-weight:700;transition:box-shadow 0.3s ease;cursor:pointer;" onmouseenter="this.style.boxShadow=\'0 0 30px rgba(139,92,246,0.6)\'" onmouseleave="this.style.boxShadow=\'\'">Hover glow</div>' },
      { label: 'shine', html: '<div style="position:relative;overflow:hidden;padding:1rem 1.4rem;background:linear-gradient(135deg,#8b5cf6,#ec4899);border-radius:10px;color:#fff;font-weight:700;cursor:pointer;">Hover shine<span style="position:absolute;inset:0;background:linear-gradient(115deg,transparent 30%,rgba(255,255,255,0.4) 50%,transparent 70%);transform:translateX(-100%);transition:transform 0.6s ease;" onmouseenter="this.style.transform=\'translateX(100%)\'"></span></div>' },
      { label: 'tilt-3d', html: '<div style="padding:1rem 1.4rem;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.12);border-radius:10px;color:#fff;font-weight:700;transition:transform 0.3s cubic-bezier(0.2,1,0.3,1);cursor:pointer;transform-style:preserve-3d;perspective:600px;" onmouseenter="this.style.transform=\'perspective(600px) rotateX(8deg) rotateY(-8deg)\'" onmouseleave="this.style.transform=\'\'">Hover tilt</div>' },
      { label: 'underline grow', html: '<a style="position:relative;color:#fff;font-weight:700;font-size:1rem;text-decoration:none;cursor:pointer;display:inline-block;padding-bottom:2px;" onmouseenter="this.querySelector(\'span\').style.width=\'100%\'" onmouseleave="this.querySelector(\'span\').style.width=\'0\'">Hover underline<span style="position:absolute;bottom:0;left:0;width:0;height:2px;background:#a78bfa;transition:width 0.25s ease;"></span></a>' }
    ], null, 220);
  };

  P['layout/dashboard-grids.css'] = function (target) {
    target.innerHTML =
      '<div style="display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:60px;gap:0.4rem;width:100%;max-width:500px;">' +
        ['#8b5cf6','#ec4899','#22c55e','#fcd34d','#60a5fa','#f97316'].map(function(c,i){
          var spans=[['1/3','1/2'],['3/5','1/2'],['1/2','2/3'],['2/3','2/3'],['3/4','2/3'],['1/5','3/4']];
          return '<div style="grid-column:' + spans[i][0] + ';grid-row:' + spans[i][1] + ';background:linear-gradient(135deg,' + c + ',rgba(0,0,0,0.3));border-radius:7px;display:grid;place-items:center;color:#fff;font-weight:700;font-size:0.78rem;">Tile ' + (i+1) + '</div>';
        }).join('') +
      '</div>';
  };

  P['layout/landing-sections.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:0.5rem;width:100%;max-width:520px;">' +
        '<div style="height:80px;background:linear-gradient(135deg,#1a1a2e,#0a0a14);border-radius:8px;border:1px solid rgba(255,255,255,0.06);display:grid;place-items:center;color:#fff;font-weight:700;">Hero — full-width</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;"><div style="height:60px;background:rgba(139,92,246,0.15);border:1px solid rgba(139,92,246,0.3);border-radius:7px;display:grid;place-items:center;color:#c4b5fd;font-size:0.78rem;">Feature</div><div style="height:60px;background:rgba(236,72,153,0.12);border:1px solid rgba(236,72,153,0.3);border-radius:7px;display:grid;place-items:center;color:#fbcfe8;font-size:0.78rem;">Feature</div></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.5rem;"><div style="height:50px;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.25);border-radius:7px;display:grid;place-items:center;color:#86efac;font-size:0.72rem;">Pricing</div><div style="height:50px;background:rgba(34,197,94,0.15);border:1px solid #22c55e;border-radius:7px;display:grid;place-items:center;color:#86efac;font-size:0.72rem;">Pro ★</div><div style="height:50px;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.25);border-radius:7px;display:grid;place-items:center;color:#86efac;font-size:0.72rem;">Team</div></div>' +
        '<div style="height:60px;background:linear-gradient(135deg,#0a0a14,#1a1a2e);border-radius:7px;display:grid;place-items:center;color:rgba(255,255,255,0.6);font-size:0.72rem;">Footer · social · legal</div>' +
      '</div>';
  };

  P['media/image-tools.css'] = function (target) {
    packGrid(target, [
      { label: 'compare', html: '<div style="position:relative;width:220px;height:120px;border-radius:8px;overflow:hidden;background:linear-gradient(90deg,#1a1a2e 0%,#1a1a2e 60%,#8b5cf6 60%,#ec4899 100%);"><div style="position:absolute;top:0;bottom:0;left:60%;width:2px;background:#fff;box-shadow:0 0 12px rgba(255,255,255,0.5);"></div><div style="position:absolute;top:50%;left:60%;transform:translate(-50%,-50%);width:24px;height:24px;border-radius:50%;background:#fff;display:grid;place-items:center;color:#000;font-size:0.7rem;font-weight:700;">⇄</div></div>' },
      { label: 'crop', html: '<div style="position:relative;width:200px;height:120px;background:linear-gradient(135deg,#8b5cf6,#ec4899);border-radius:6px;"><div style="position:absolute;inset:15% 20% 15% 12%;border:2px dashed #fff;background:rgba(0,0,0,0.2);"><div style="position:absolute;top:-5px;left:-5px;width:10px;height:10px;background:#fff;"></div><div style="position:absolute;top:-5px;right:-5px;width:10px;height:10px;background:#fff;"></div><div style="position:absolute;bottom:-5px;left:-5px;width:10px;height:10px;background:#fff;"></div><div style="position:absolute;bottom:-5px;right:-5px;width:10px;height:10px;background:#fff;"></div></div></div>' },
      { label: 'gallery shimmer', html: '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.3rem;width:200px;">' + [1,2,3,4,5,6].map(function(i){return '<div style="height:50px;background:linear-gradient(110deg,rgba(255,255,255,0.04) 30%,rgba(255,255,255,0.12) 50%,rgba(255,255,255,0.04) 70%);background-size:200% 100%;border-radius:5px;animation:dapp-shim 1.5s linear infinite;"></div>';}).join('') + '<style>@keyframes dapp-shim{0%{background-position:200% 0;}100%{background-position:-200% 0;}}</style></div>' }
    ], null, 240);
  };

  P['micro/micro-interactions-pack.css'] = function (target) {
    packGrid(target, [
      { label: 'like burst', html: '<button style="display:inline-flex;align-items:center;gap:0.4rem;padding:0.45rem 0.85rem;background:rgba(239,68,68,0.1);border:1px solid #ef4444;border-radius:7px;color:#fca5a5;font-size:0.85rem;cursor:pointer;font-weight:600;">❤ 1.2k</button>' },
      { label: 'copy tick', html: '<button style="display:inline-flex;align-items:center;gap:0.4rem;padding:0.45rem 0.85rem;background:rgba(34,197,94,0.1);border:1px solid #22c55e;border-radius:7px;color:#86efac;font-size:0.85rem;cursor:pointer;font-weight:600;">✓ Copied!</button>' },
      { label: 'notification ping', html: '<button style="position:relative;width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#fff;font-size:1.05rem;cursor:pointer;">🔔<span style="position:absolute;top:6px;right:7px;width:8px;height:8px;border-radius:50%;background:#ef4444;border:1.5px solid #0a0a14;animation:dapp-pulse 1.6s ease-in-out infinite;"></span></button>' },
      { label: 'status dot', html: '<div style="display:inline-flex;align-items:center;gap:0.4rem;font-size:0.78rem;color:#86efac;"><span style="width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 0 rgba(34,197,94,0.6);animation:dapp-radar 1.8s ease-out infinite;"></span>Live<style>@keyframes dapp-radar{0%{box-shadow:0 0 0 0 rgba(34,197,94,0.6);}100%{box-shadow:0 0 0 8px rgba(34,197,94,0);}}</style></div>' },
      { label: 'draft saved', html: '<div style="display:inline-flex;align-items:center;gap:0.4rem;padding:0.35rem 0.7rem;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:5px;color:rgba(255,255,255,0.6);font-size:0.72rem;font-family:monospace;"><span style="color:#86efac;">●</span>Draft saved · 2s ago</div>' },
      { label: 'kbd combo', html: '<div style="display:inline-flex;gap:0.2rem;align-items:center;font-size:0.78rem;color:rgba(255,255,255,0.7);"><kbd style="padding:0.2rem 0.45rem;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.15);border-radius:4px;font-family:monospace;font-size:0.7rem;box-shadow:0 1.5px 0 rgba(255,255,255,0.1);">⌘</kbd>+<kbd style="padding:0.2rem 0.45rem;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.15);border-radius:4px;font-family:monospace;font-size:0.7rem;box-shadow:0 1.5px 0 rgba(255,255,255,0.1);">K</kbd></div>' }
    ], null, 220);
  };

  // ============================================
  // Interactive small modules
  // ============================================
  P['effects/text-wave.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.7rem;">' +
        '<h2 class="dapp-tw-target" style="font-size:2.4rem;font-weight:800;color:#fff;margin:0;letter-spacing:-0.02em;">FRONTENDMAXXING</h2>' +
        '<button class="dapp-tw-go" style="padding:0.4rem 0.95rem;background:rgba(139,92,246,0.18);border:1px solid #a78bfa;border-radius:6px;color:#c4b5fd;font-size:0.78rem;cursor:pointer;font-weight:600;">▶ Wave</button>' +
      '</div>';
    var run = function () {
      if (window.TextWave) try { window.TextWave.init(target.querySelector('.dapp-tw-target'), { speed: 'normal', blur: 1.5 }); } catch (e) {}
    };
    target.querySelector('.dapp-tw-go').addEventListener('click', run);
    setTimeout(run, 300);
  };

  P['feedback/sparkle-click.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.7rem;">' +
        '<button class="dapp-spark-btn" style="padding:0.7rem 1.4rem;background:linear-gradient(135deg,#ec4899,#8b5cf6);border:none;border-radius:9px;color:#fff;font-weight:700;font-size:1rem;cursor:pointer;box-shadow:0 6px 20px rgba(236,72,153,0.4);">Click me ✨</button>' +
        '<div style="font-size:0.7rem;color:rgba(255,255,255,0.45);">Click for a sparkle burst</div>' +
      '</div>';
    if (window.SparkleClick) {
      try { window.SparkleClick.attach(target.querySelector('.dapp-spark-btn'), { count: 14, colors: ['#fcd34d','#f472b6','#22d3ee','#a78bfa'] }); } catch (e) {}
    }
  };

  P['utils/palette-generator.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.7rem;width:100%;max-width:480px;">' +
        '<div style="display:flex;align-items:center;gap:0.5rem;"><span style="font-size:0.78rem;color:rgba(255,255,255,0.65);">Seed:</span><div style="width:24px;height:24px;border-radius:6px;background:#ec4899;border:1.5px solid #fff;"></div><code style="font-family:monospace;font-size:0.8rem;color:#fff;">#ec4899</code></div>' +
        '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:0.5rem;width:100%;">' +
          [
            { name: 'complementary', colors: ['#ec4899','#48ecae'] },
            { name: 'triadic',       colors: ['#ec4899','#99ec48','#4899ec'] },
            { name: 'analogous',     colors: ['#ec48b1','#ec4899','#ec5a48','#ec8748'] },
            { name: 'tints',         colors: ['#ec4899','#f06bad','#f48dc1','#f8afd5','#fcd1e9'] }
          ].map(function (p) {
            return '<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:7px;padding:0.5rem 0.6rem;">' +
              '<div style="font-size:0.65rem;color:rgba(255,255,255,0.55);text-transform:uppercase;letter-spacing:0.05em;font-weight:700;margin-bottom:0.3rem;">' + p.name + '</div>' +
              '<div style="display:flex;height:24px;border-radius:5px;overflow:hidden;">' + p.colors.map(function (c) { return '<div style="flex:1;background:' + c + ';" title="' + c + '"></div>'; }).join('') + '</div>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</div>';
  };

  P['interactions/swipe.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.6rem;">' +
        '<div class="dapp-swipe-area" style="width:240px;height:160px;background:linear-gradient(135deg,#1a1a2e,#0a0a14);border:2px dashed rgba(139,92,246,0.4);border-radius:12px;display:grid;place-items:center;text-align:center;cursor:grab;touch-action:none;user-select:none;color:rgba(255,255,255,0.6);font-size:0.85rem;">Swipe / drag here<br><span style="font-size:0.7rem;color:rgba(255,255,255,0.4);">← ↑ ↓ →</span></div>' +
        '<div class="dapp-swipe-log" style="font-family:monospace;font-size:0.78rem;color:#86efac;min-height:1.2em;">awaiting…</div>' +
      '</div>';
    var area = target.querySelector('.dapp-swipe-area');
    var log = target.querySelector('.dapp-swipe-log');
    var sx = 0, sy = 0, active = false;
    area.addEventListener('pointerdown', function (e) { sx = e.clientX; sy = e.clientY; active = true; area.setPointerCapture(e.pointerId); });
    area.addEventListener('pointerup', function (e) {
      if (!active) return; active = false;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.hypot(dx, dy) < 24) return;
      var dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? '→ right' : '← left') : (dy > 0 ? '↓ down' : '↑ up');
      log.textContent = 'swipe ' + dir + ' · ' + Math.round(Math.hypot(dx, dy)) + 'px';
    });
  };

  P['scroll/scroll-fx-pack.css'] = function (target) {
    target.innerHTML =
      '<div style="width:100%;max-width:480px;height:280px;overflow-y:auto;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:1rem;">' +
        '<div style="height:60px;background:linear-gradient(135deg,#8b5cf6,#ec4899);border-radius:8px;margin-bottom:0.5rem;display:grid;place-items:center;color:#fff;font-weight:700;">Parallax bg layer 1</div>' +
        '<div style="height:80px;background:linear-gradient(135deg,rgba(139,92,246,0.15),transparent);border:1px solid rgba(139,92,246,0.3);border-radius:8px;margin-bottom:0.5rem;display:grid;place-items:center;color:#c4b5fd;">Sticky stagger row 1</div>' +
        '<div style="height:80px;background:linear-gradient(135deg,rgba(236,72,153,0.15),transparent);border:1px solid rgba(236,72,153,0.3);border-radius:8px;margin-bottom:0.5rem;display:grid;place-items:center;color:#fbcfe8;">Reveal-on-view ↓</div>' +
        '<div style="height:80px;background:linear-gradient(135deg,rgba(34,197,94,0.15),transparent);border:1px solid rgba(34,197,94,0.3);border-radius:8px;margin-bottom:0.5rem;display:grid;place-items:center;color:#86efac;">Scroll text zoom</div>' +
        '<div style="height:60px;background:linear-gradient(135deg,#1a1a2e,#0a0a14);border:1px solid rgba(255,255,255,0.06);border-radius:8px;display:grid;place-items:center;color:rgba(255,255,255,0.5);font-size:0.78rem;">↑ Scroll to see effects</div>' +
      '</div>';
  };

  // ============================================
  // iOS / iPhone-frame previews
  // ============================================

  // Empty frame for the iphone-frame.css preview
  P['mobile/iphone-frame.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;align-items:flex-start;">' +
        '<div class="iph iph-sm"><div class="iph-island"></div><div class="iph-screen iph-wp-aurora"></div><div class="iph-home"></div></div>' +
        '<div class="iph iph-sm iph-light"><div class="iph-island"></div><div class="iph-screen"></div><div class="iph-home" style="background:#000;"></div></div>' +
        '<div class="iph iph-sm"><div class="iph-island"></div><div class="iph-screen iph-wp-sunset"></div><div class="iph-home"></div></div>' +
      '</div>';
  };

  P['mobile/ios-status-bar.css'] = function (target) {
    var screen = iphoneFrame(target, { caption: '14px tall, time + signal + wifi + battery. Auto white/dark text.' });
    screen.innerHTML =
      '<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.7rem;padding:1rem;">' +
        '<div style="color:rgba(255,255,255,0.5);font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;">Battery levels</div>' +
        '<div class="ios-status-battery" style="--ios-batt:78%;color:#fff;"></div>' +
        '<div class="ios-status-battery is-low" style="--ios-batt:18%;color:#fff;"></div>' +
        '<div class="ios-status-battery is-charging" style="--ios-batt:64%;color:#fff;"></div>' +
      '</div>';
  };

  P['mobile/ios-nav-bar.css'] = function (target) {
    var screen = iphoneFrame(target, { caption: 'Large title that collapses on scroll. Scroll the list below.' });
    screen.innerHTML =
      '<div class="ios-nav ios-nav-blur" data-ios-nav>' +
        '<div class="ios-nav-top">' +
          '<button class="ios-nav-back">←</button>' +
          '<button class="ios-nav-action is-bold">Edit</button>' +
        '</div>' +
        '<div class="ios-nav-large">Mailboxes</div>' +
        '<div class="ios-nav-sub">23 unread</div>' +
      '</div>' +
      '<div class="ios-list" data-ios-nav-scroll style="flex:1;">' +
        '<ul class="ios-group">' +
          [['Inbox','24','#0a84ff','✉'],['VIP','3','#ff9500','⭐'],['Flagged','','#ff3b30','🚩'],['Drafts','12','#8e8e93','📝'],['Sent','','#34c759','↗'],['Junk','','#ffcc00','🛑'],['Trash','','#ff3b30','🗑']].map(function(r){
            return '<li class="ios-row"><span class="ios-row-icon" style="background:' + r[2] + ';">' + r[3] + '</span><span class="ios-row-label">' + r[0] + '</span>' + (r[1]?'<span class="ios-row-value">' + r[1] + '</span>':'') + '<span class="ios-row-chevron">›</span></li>';
          }).join('') +
        '</ul>' +
      '</div>';
    setTimeout(function () { if (window.IosNav) try { window.IosNav.init(screen.querySelector('[data-ios-nav]')); } catch (e) {} }, 100);
  };

  P['mobile/ios-tab-bar.css'] = function (target) {
    var screen = iphoneFrame(target, { caption: 'Bottom tab bar with frosted backdrop + active accent.' });
    screen.innerHTML =
      '<div style="flex:1;background:linear-gradient(180deg,#1a1a2e,#0f0f1e);padding:1rem;color:#fff;">' +
        '<h3 style="font-size:18px;font-weight:700;margin:0 0 0.5rem;">For You</h3>' +
        '<p style="font-size:14px;color:rgba(255,255,255,0.65);">Featured content above the tab bar.</p>' +
      '</div>' +
      '<div class="ios-tabs">' +
        [
          {icon:'🏠',label:'Home',active:true},
          {icon:'🔍',label:'Search'},
          {icon:'📚',label:'Library',badge:'3'},
          {icon:'👤',label:'Profile'}
        ].map(function(t){
          return '<button class="ios-tab' + (t.active?' is-active':'') + (t.badge?' ios-tab-badge" data-badge="' + t.badge:'') + '">' +
            '<span class="ios-tab-icon" style="font-size:22px;">' + t.icon + '</span>' +
            '<span class="ios-tab-label">' + t.label + '</span>' +
          '</button>';
        }).join('') +
      '</div>';
  };

  P['mobile/ios-list-grouped.css'] = function (target) {
    var screen = iphoneFrame(target, { caption: 'Settings-app inset-grouped list with icons, toggles, chevrons.' });
    screen.innerHTML =
      '<div class="ios-list" style="flex:1;">' +
        '<div class="ios-list-section-header">PERSONAL</div>' +
        '<ul class="ios-group">' +
          '<li class="ios-row"><span class="ios-row-icon" style="background:#0a84ff;">✈</span><span class="ios-row-label">Airplane Mode</span><span class="ios-row-toggle"><span class="ios-toggle"></span></span></li>' +
          '<li class="ios-row"><span class="ios-row-icon" style="background:#34c759;">📶</span><span class="ios-row-label">Wi-Fi</span><span class="ios-row-value">FastNet 5G</span><span class="ios-row-chevron">›</span></li>' +
          '<li class="ios-row"><span class="ios-row-icon" style="background:#007aff;">🔵</span><span class="ios-row-label">Bluetooth</span><span class="ios-row-value">On</span><span class="ios-row-chevron">›</span></li>' +
        '</ul>' +
        '<div class="ios-list-section-header">DISPLAY & SOUND</div>' +
        '<ul class="ios-group">' +
          '<li class="ios-row"><span class="ios-row-icon" style="background:#ff9500;">🔔</span><span class="ios-row-label">Notifications</span><span class="ios-row-chevron">›</span></li>' +
          '<li class="ios-row"><span class="ios-row-icon" style="background:#5e5ce6;">🌙</span><span class="ios-row-label">Focus</span><span class="ios-row-toggle"><span class="ios-toggle is-on"></span></span></li>' +
        '</ul>' +
        '<div class="ios-list-section-header">ACCOUNT</div>' +
        '<ul class="ios-group">' +
          '<li class="ios-row ios-row-link is-destructive"><span class="ios-row-label" style="text-align:center;">Sign Out</span></li>' +
        '</ul>' +
        '<div class="ios-list-section-footer">Some features may be limited when offline.</div>' +
      '</div>';
  };

  P['mobile/ios-home-screen.css'] = function (target) {
    var screen = iphoneFrame(target, { wallpaper: 'aurora', caption: 'Home screen with app icon grid + frosted dock.' });
    var apps = [
      ['#0a84ff','✉','Mail','5'],['#34c759','💬','Messages','2'],['#ff9500','☎','Phone'],['#ff3b30','♥','Health'],
      ['#5e5ce6','🎵','Music'],['#8b5cf6','📷','Photos'],['#facc15','🗓','Calendar'],['#22c55e','🧭','Maps'],
      ['#000','📺','TV'],['#1a1a2e','🌐','Safari'],['#ec4899','🛍','Wallet'],['#06b6d4','⛅','Weather']
    ];
    var dockApps = [['#34c759','☎','Phone'],['#0a84ff','✉','Mail'],['#1a1a2e','🌐','Safari'],['#8b5cf6','📷','Photos']];
    screen.innerHTML =
      '<div class="ios-home">' +
        '<div class="ios-home-grid">' +
          apps.map(function(a){return '<div class="ios-app"><div class="ios-app-icon' + (a[3]?' has-badge" data-badge="' + a[3]:'') + '" style="background:' + a[0] + ';">' + a[1] + '</div><div class="ios-app-label">' + a[2] + '</div></div>';}).join('') +
        '</div>' +
        '<div class="ios-dock">' +
          dockApps.map(function(a){return '<div class="ios-app"><div class="ios-app-icon" style="background:' + a[0] + ';">' + a[1] + '</div></div>';}).join('') +
        '</div>' +
      '</div>';
  };

  P['mobile/ios-action-sheet.css'] = function (target) {
    var screen = iphoneFrame(target, { caption: 'Bottom-slide action sheet — tap "Show" to re-open.' });
    screen.innerHTML =
      '<div style="flex:1;background:#1a1a2e;padding:1rem;display:flex;align-items:flex-start;">' +
        '<button class="dapp-ios-as-open" style="padding:0.5rem 1rem;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:7px;color:#fff;cursor:pointer;font-size:13px;">▶ Show sheet</button>' +
      '</div>';
    function showSheet() {
      if (!window.IosActionSheet) return;
      window.IosActionSheet.show(screen, {
        title: 'Delete photo?',
        subtitle: 'This action cannot be undone.',
        actions: [
          { label: 'Delete', destructive: true },
          { label: 'Save to Files' },
          { label: 'Duplicate' }
        ],
        cancelLabel: 'Cancel'
      });
    }
    screen.querySelector('.dapp-ios-as-open').addEventListener('click', showSheet);
    setTimeout(showSheet, 350);
  };

  P['mobile/ios-alert.css'] = function (target) {
    var screen = iphoneFrame(target, { caption: 'Centered alert dialog. Tap "Show" to re-open.' });
    screen.innerHTML =
      '<div style="flex:1;background:#1a1a2e;padding:1rem;display:flex;align-items:flex-start;">' +
        '<button class="dapp-ios-al-open" style="padding:0.5rem 1rem;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:7px;color:#fff;cursor:pointer;font-size:13px;">▶ Show alert</button>' +
      '</div>';
    function showAlert() {
      if (!window.IosAlert) return;
      window.IosAlert.show(screen, {
        title: 'Discard changes?',
        message: 'Your edits won\'t be saved.',
        buttons: [{ label: 'Cancel' }, { label: 'Discard', destructive: true, bold: true }]
      });
    }
    screen.querySelector('.dapp-ios-al-open').addEventListener('click', showAlert);
    setTimeout(showAlert, 350);
  };

  P['mobile/ios-modal-sheet.css'] = function (target) {
    var screen = iphoneFrame(target, { caption: 'Drag the handle up/down to snap small/medium/large.' });
    screen.innerHTML =
      '<div style="flex:1;background:linear-gradient(180deg,#1a1a2e,#0f0f1e);padding:1rem;color:#fff;">' +
        '<button class="dapp-ios-ms-open" style="padding:0.5rem 1rem;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:7px;color:#fff;cursor:pointer;font-size:13px;">▶ Open sheet</button>' +
      '</div>';
    function openSheet() {
      if (!window.IosModalSheet) return;
      window.IosModalSheet.open(screen, {
        initial: 'medium',
        content:
          '<div class="ios-sheet-title">Edit Place</div>' +
          '<p style="font-size:14px;color:rgba(235,235,245,0.65);margin:0 0 1rem;">Drag the handle to resize this sheet.</p>' +
          '<div style="display:flex;flex-direction:column;gap:0.4rem;">' +
            ['Add note','Change pin color','Share location','Remove from favorites'].map(function(t,i){
              var c = i===3?'#ff3b30':'#fff';
              return '<button style="padding:0.7rem 0.9rem;background:rgba(255,255,255,0.05);border:0;border-radius:8px;color:' + c + ';font-size:15px;text-align:left;cursor:pointer;">' + t + '</button>';
            }).join('') +
          '</div>'
      });
    }
    screen.querySelector('.dapp-ios-ms-open').addEventListener('click', openSheet);
    setTimeout(openSheet, 400);
  };

  P['mobile/ios-activity-sheet.css'] = function (target) {
    var screen = iphoneFrame(target, { caption: 'Share sheet with app row + actions.' });
    screen.innerHTML =
      '<div style="flex:1;background:#1a1a2e;"></div>' +
      '<div class="ios-share-overlay">' +
        '<div class="ios-share">' +
          '<div class="ios-share-handle"></div>' +
          '<div class="ios-share-header"><div class="ios-share-preview">' +
            '<div class="ios-share-thumb"></div>' +
            '<div><div class="ios-share-title">design-doc.pdf</div><div class="ios-share-meta">4.2 MB · PDF Document</div></div>' +
          '</div></div>' +
          '<div class="ios-share-apps">' +
            [['#34c759','💬','Messages'],['#0a84ff','✉','Mail'],['#5e5ce6','✈','Telegram'],['#000','𝕏','X'],['#25d366','💚','WhatsApp']].map(function(a){return '<button class="ios-share-app"><span class="ios-share-app-icon" style="background:' + a[0] + ';">' + a[1] + '</span><span class="ios-share-app-label">' + a[2] + '</span></button>';}).join('') +
          '</div>' +
          '<div class="ios-share-actions">' +
            '<button class="ios-share-action"><span>Copy</span><span class="ios-share-action-icon">⎘</span></button>' +
            '<button class="ios-share-action"><span>Save to Files</span><span class="ios-share-action-icon">📁</span></button>' +
            '<button class="ios-share-action"><span>Print</span><span class="ios-share-action-icon">🖨</span></button>' +
          '</div>' +
        '</div>' +
      '</div>';
  };

  P['mobile/ios-context-menu.css'] = function (target) {
    var screen = iphoneFrame(target, { caption: 'Long-press the photo → blurred menu with preview + actions.' });
    screen.innerHTML =
      '<div style="flex:1;background:#1a1a2e;padding:1rem;display:grid;place-items:center;">' +
        '<div class="dapp-ios-cm-target" style="width:140px;height:180px;background:linear-gradient(135deg,#ff7e5f,#feb47b);border-radius:14px;display:grid;place-items:center;color:#fff;font-weight:700;cursor:pointer;-webkit-touch-callout:none;">Long press</div>' +
      '</div>';
    var tgt = screen.querySelector('.dapp-ios-cm-target');
    function showMenu() {
      if (!window.IosContextMenu) return;
      window.IosContextMenu.open(tgt, {
        host: screen,
        preview: function () { return tgt.cloneNode(true); },
        actions: [
          { label: 'Copy', icon: '⎘' },
          { label: 'Duplicate', icon: '⧉' },
          { label: 'Share…', icon: '↗' },
          { label: 'Delete', icon: '🗑', destructive: true }
        ]
      });
    }
    tgt.addEventListener('click', showMenu);
    if (window.IosContextMenu) try { window.IosContextMenu.attach(tgt, { host: screen, preview: function () { return tgt.cloneNode(true); }, actions: [ { label: 'Copy', icon: '⎘' }, { label: 'Duplicate', icon: '⧉' }, { label: 'Share…', icon: '↗' }, { label: 'Delete', icon: '🗑', destructive: true } ] }); } catch (e) {}
    setTimeout(showMenu, 500);
  };

  P['mobile/ios-segmented-control.css'] = function (target) {
    var screen = iphoneFrame(target, { caption: 'Tap segments — the pill slides to the active option.' });
    screen.innerHTML =
      '<div style="flex:1;background:#1a1a2e;padding:1.5rem 1rem;display:flex;flex-direction:column;gap:1rem;color:#fff;">' +
        '<div class="ios-seg" data-ios-seg>' +
          '<span class="ios-seg-thumb"></span>' +
          '<button class="ios-seg-item is-active">Today</button>' +
          '<button class="ios-seg-item">Week</button>' +
          '<button class="ios-seg-item">Month</button>' +
          '<button class="ios-seg-item">Year</button>' +
        '</div>' +
        '<div class="ios-seg" data-ios-seg>' +
          '<span class="ios-seg-thumb"></span>' +
          '<button class="ios-seg-item is-active">Light</button>' +
          '<button class="ios-seg-item">Dark</button>' +
          '<button class="ios-seg-item">Auto</button>' +
        '</div>' +
        '<div style="font-size:0.7rem;color:rgba(255,255,255,0.45);">Auto-counts items via --ios-seg-count.</div>' +
      '</div>';
    setTimeout(function () { if (window.IosSegmented) try { window.IosSegmented.init(screen.querySelectorAll('[data-ios-seg]')); } catch (e) {} }, 100);
  };

  P['mobile/ios-search-bar.css'] = function (target) {
    var screen = iphoneFrame(target, { caption: 'Tap the field — Cancel button slides in from the right.' });
    screen.innerHTML =
      '<div style="flex:1;background:#1a1a2e;padding-top:0.5rem;color:#fff;">' +
        '<div class="ios-search" data-ios-search>' +
          '<label class="ios-search-field">' +
            '<span class="ios-search-icon">🔍</span>' +
            '<input type="text" placeholder="Search">' +
            '<button class="ios-search-clear">×</button>' +
          '</label>' +
          '<button class="ios-search-cancel">Cancel</button>' +
        '</div>' +
        '<div style="padding:1rem;font-size:14px;color:rgba(235,235,245,0.55);">Recent searches</div>' +
        '<ul style="list-style:none;padding:0;margin:0 0 0 1rem;font-size:15px;">' +
          ['Pizza near me','Pharmacy','Coffee shop'].map(function(r){return '<li style="padding:0.5rem 0;border-bottom:0.5px solid rgba(255,255,255,0.08);"><span style="opacity:0.5;margin-right:0.5rem;">🕒</span>' + r + '</li>';}).join('') +
        '</ul>' +
      '</div>';
    setTimeout(function () { if (window.IosSearch) try { window.IosSearch.init(screen.querySelector('[data-ios-search]')); } catch (e) {} }, 100);
  };

  P['mobile/ios-picker.css'] = function (target) {
    var screen = iphoneFrame(target, { caption: 'Three-column wheel picker — scroll each column.' });
    var hours = []; for (var h = 1; h <= 12; h++) hours.push(h);
    var mins = []; for (var m = 0; m < 60; m += 5) mins.push(m < 10 ? '0' + m : String(m));
    var ampm = ['AM','PM'];
    function colHtml(items, selectedIdx) {
      return '<div class="ios-picker-col" data-ios-picker-col>' +
        items.map(function (v, i) { return '<div class="ios-picker-row' + (i === selectedIdx ? ' is-selected' : '') + '">' + v + '</div>'; }).join('') +
      '</div>';
    }
    screen.innerHTML =
      '<div style="flex:1;background:#1a1a2e;padding:1.5rem 1rem;color:#fff;display:flex;flex-direction:column;gap:0.8rem;">' +
        '<div style="font-size:15px;color:rgba(255,255,255,0.65);">Choose a time</div>' +
        '<div class="ios-picker" data-ios-picker style="height:180px;">' +
          colHtml(hours, 8) +
          colHtml(mins, 5) +
          colHtml(ampm, 0) +
          '<div class="ios-picker-selection"></div>' +
        '</div>' +
      '</div>';
    setTimeout(function () {
      if (window.IosPicker) try { window.IosPicker.init(screen.querySelector('[data-ios-picker]')); } catch (e) {}
      // pre-scroll to selected
      var cols = screen.querySelectorAll('.ios-picker-col');
      [8, 5, 0].forEach(function (idx, i) {
        if (cols[i]) cols[i].scrollTop = idx * 36;
      });
    }, 150);
  };

  P['mobile/ios-dynamic-island.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.7rem;">' +
        '<div class="iph iph-sm">' +
          '<div class="ios-di" data-ios-di></div>' +
          '<div class="iph-screen iph-wp-night">' +
            '<div class="ios-status" style="margin-top:14px;color:#fff;">' +
              '<span class="ios-status-time">9:41</span>' +
              '<div class="ios-status-right"><span class="ios-status-signal"></span><span class="ios-status-wifi"></span><span class="ios-status-battery"></span></div>' +
            '</div>' +
            '<div style="flex:1;padding:1rem;color:#fff;font-size:14px;opacity:0.85;text-align:center;">Tap a button to morph →</div>' +
          '</div>' +
          '<div class="iph-home"></div>' +
        '</div>' +
        '<div style="display:flex;gap:0.3rem;flex-wrap:wrap;justify-content:center;max-width:340px;">' +
          ['idle','dot','compact','music','call','expand'].map(function (s) {
            return '<button class="dapp-di-' + s + '" style="padding:0.3rem 0.7rem;background:rgba(139,92,246,0.12);border:1px solid rgba(139,92,246,0.4);border-radius:5px;color:#c4b5fd;font-size:0.72rem;cursor:pointer;">' + s + '</button>';
          }).join('') +
        '</div>' +
      '</div>';
    setTimeout(function () {
      if (!window.IosDynamicIsland) return;
      var di = window.IosDynamicIsland.init(target.querySelector('[data-ios-di]'));
      target.querySelector('.dapp-di-idle').addEventListener('click', function () { di.idle(); });
      target.querySelector('.dapp-di-dot').addEventListener('click', function () { di.dot('green'); });
      target.querySelector('.dapp-di-compact').addEventListener('click', function () { di.compact({ icon: '✓', title: 'Saved', sub: 'iCloud', time: '0:12' }); });
      target.querySelector('.dapp-di-music').addEventListener('click', function () { di.music({ title: 'Coffee Shop', artist: 'Lana Del Rey' }); });
      target.querySelector('.dapp-di-call').addEventListener('click', function () { di.call({ name: 'Alice Sterling', sub: 'mobile · 0:14' }); });
      target.querySelector('.dapp-di-expand').addEventListener('click', function () { di.expand({ html: '<div style="font-size:13px;font-weight:600;text-align:center;">⌛ Timer · 24:13 remaining</div>' }); });
      di.dot('green');
    }, 200);
  };

  P['mobile/ios-onboarding.css'] = function (target) {
    var screen = iphoneFrame(target, { caption: 'Swipe pages or tap Continue to advance.' });
    screen.innerHTML =
      '<div class="ios-onb">' +
        '<div class="ios-onb-pages" data-ios-onb-pages>' +
          [
            { i: '👋', t: 'Welcome', x: 'Get started in three quick steps.', g: 'linear-gradient(135deg,#0a84ff,#5e5ce6)' },
            { i: '⚡', t: 'Lightning Fast', x: 'Sync instantly across all your devices.', g: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
            { i: '🔐', t: 'Private', x: 'Your data is encrypted end-to-end.', g: 'linear-gradient(135deg,#10b981,#06b6d4)' }
          ].map(function (p) {
            return '<section class="ios-onb-page">' +
              '<div class="ios-onb-icon" style="background:' + p.g + ';">' + p.i + '</div>' +
              '<h2 class="ios-onb-title">' + p.t + '</h2>' +
              '<p class="ios-onb-text">' + p.x + '</p>' +
            '</section>';
          }).join('') +
        '</div>' +
        '<div class="ios-onb-dots"><span class="is-active"></span><span></span><span></span></div>' +
        '<button class="ios-onb-cta">Continue</button>' +
      '</div>';
    setTimeout(function () { if (window.IosOnboarding) try { window.IosOnboarding.init(screen.querySelector('.ios-onb')); } catch (e) {} }, 100);
  };

  // ============================================
  // Fixes for previously-broken effects/ entries
  // ============================================

  P['effects/animated-beam.css'] = function (target) {
    target.innerHTML =
      '<div class="animated-beam-container" style="position:relative;width:100%;max-width:420px;height:200px;display:flex;align-items:center;justify-content:space-between;padding:0 1.5rem;background:radial-gradient(circle at center,rgba(139,92,246,0.08),transparent 70%);border-radius:12px;">' +
        '<div id="dapp-beam-from" style="width:56px;height:56px;border-radius:14px;background:linear-gradient(135deg,#8b5cf6,#6366f1);display:grid;place-items:center;color:#fff;font-size:1.4rem;box-shadow:0 8px 20px rgba(139,92,246,0.4);">🅰</div>' +
        '<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;" preserveAspectRatio="none"><defs><linearGradient id="dapp-beam-grad" x1="0" x2="1"><stop offset="0" stop-color="transparent"/><stop offset="0.5" stop-color="#a78bfa" stop-opacity="0.9"/><stop offset="1" stop-color="transparent"/></linearGradient></defs><line x1="60" y1="100" x2="360" y2="100" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" stroke-dasharray="3 4"/><line x1="60" y1="100" x2="360" y2="100" stroke="url(#dapp-beam-grad)" stroke-width="2.5"><animate attributeName="stroke-dashoffset" values="-300;300" dur="2s" repeatCount="indefinite"/></line></svg>' +
        '<div id="dapp-beam-to" style="width:56px;height:56px;border-radius:14px;background:linear-gradient(135deg,#ec4899,#f43f5e);display:grid;place-items:center;color:#fff;font-size:1.4rem;box-shadow:0 8px 20px rgba(236,72,153,0.4);">🅱</div>' +
      '</div>';
  };
  P['effects/animated-beam.js'] = P['effects/animated-beam.css'];
  P['effects/backlight-halo.js'] = P['effects/backlight-halo.css'];

  P['effects/backlight-halo.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-wrap:wrap;gap:2rem;justify-content:center;align-items:center;padding:2rem;">' +
        '<div class="bhalo bhalo-md bhalo-rounded" style="--bh-color:#ec4899;width:160px;height:200px;"><div class="bhalo-media" style="background:linear-gradient(135deg,#ec4899,#f97316);"></div></div>' +
        '<div class="bhalo bhalo-md bhalo-circle bhalo-anim" style="--bh-color:#8b5cf6;width:140px;height:140px;"><div class="bhalo-media" style="background:radial-gradient(circle at 30% 30%,#a78bfa,#5b21b6);border-radius:50%;"></div></div>' +
        '<div class="bhalo bhalo-md bhalo-rounded" style="--bh-color:#22d3ee;width:160px;height:200px;"><div class="bhalo-media" style="background:linear-gradient(135deg,#06b6d4,#3b82f6);"></div></div>' +
      '</div>';
  };

  P['effects/cursor-effects.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:1rem;width:100%;">' +
        '<div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;">' +
          '<button class="dapp-cfx-magnetic" style="padding:0.6rem 1.2rem;background:rgba(139,92,246,0.18);border:1px solid #a78bfa;border-radius:8px;color:#c4b5fd;font-weight:600;cursor:pointer;transition:transform 0.18s ease;">🧲 Magnetic</button>' +
          '<button class="dapp-cfx-trail" style="padding:0.6rem 1.2rem;background:rgba(236,72,153,0.18);border:1px solid #f472b6;border-radius:8px;color:#fbcfe8;font-weight:600;cursor:pointer;">✨ Trail area</button>' +
        '</div>' +
        '<div id="dapp-cfx-trail-area" style="position:relative;width:100%;max-width:420px;height:160px;background:radial-gradient(circle at center,rgba(236,72,153,0.12),transparent 65%);border:1px dashed rgba(255,255,255,0.1);border-radius:10px;cursor:crosshair;overflow:hidden;display:grid;place-items:center;color:rgba(255,255,255,0.45);font-size:0.78rem;">Move your cursor inside this area</div>' +
      '</div>';
    var mag = target.querySelector('.dapp-cfx-magnetic');
    mag.addEventListener('mousemove', function (e) {
      var r = mag.getBoundingClientRect();
      var dx = (e.clientX - r.left - r.width / 2) * 0.3;
      var dy = (e.clientY - r.top - r.height / 2) * 0.3;
      mag.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
    });
    mag.addEventListener('mouseleave', function () { mag.style.transform = ''; });
    var trailArea = target.querySelector('#dapp-cfx-trail-area');
    trailArea.addEventListener('mousemove', function (e) {
      var r = trailArea.getBoundingClientRect();
      var d = document.createElement('div');
      d.style.cssText = 'position:absolute;left:' + (e.clientX - r.left - 6) + 'px;top:' + (e.clientY - r.top - 6) + 'px;width:12px;height:12px;border-radius:50%;background:#f472b6;opacity:0.9;pointer-events:none;animation:dapp-cfx 0.7s ease-out forwards;';
      trailArea.appendChild(d);
      setTimeout(function () { d.remove(); }, 700);
    });
    var s = document.createElement('style');
    s.textContent = '@keyframes dapp-cfx{0%{transform:scale(0.5);}100%{transform:scale(2);opacity:0;}}';
    target.appendChild(s);
  };

  P['effects/duotone.css'] = function (target) {
    target.innerHTML =
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.6rem;width:100%;max-width:500px;">' +
        [
          ['classic-blue', 'linear-gradient(135deg,#1e3a8a,#facc15)'],
          ['coral',        'linear-gradient(135deg,#831843,#fde68a)'],
          ['cyber',        'linear-gradient(135deg,#0891b2,#ec4899)'],
          ['cosmic',       'linear-gradient(135deg,#3b0764,#f0abfc)'],
          ['deep-purple',  'linear-gradient(135deg,#1e1b4b,#a5b4fc)'],
          ['blueprint',    'linear-gradient(135deg,#0c4a6e,#bae6fd)']
        ].map(function (d) {
          return '<div style="position:relative;">' +
            '<div class="dt dt-' + d[0] + '" style="height:120px;border-radius:8px;background:' + d[1] + ';"></div>' +
            '<div style="font-size:0.65rem;color:rgba(255,255,255,0.55);text-align:center;margin-top:0.2rem;font-family:monospace;">' + d[0] + '</div>' +
          '</div>';
        }).join('') +
      '</div>';
  };

  P['effects/duotone.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.7rem;">' +
        '<svg width="200" height="200" viewBox="0 0 200 200" style="border-radius:12px;background:#0a0a14;">' +
          '<defs><filter id="dapp-dt"><feColorMatrix type="matrix" values="0.6 0.2 0.0 0 0  0.0 0.1 0.6 0 0  0.2 0.4 0.5 0 0  0 0 0 1 0"/></filter></defs>' +
          '<g filter="url(#dapp-dt)">' +
            '<rect width="200" height="200" fill="#fff"/>' +
            '<circle cx="60" cy="80" r="44" fill="#ffd700"/>' +
            '<rect x="100" y="110" width="80" height="80" fill="#94a3b8"/>' +
            '<path d="M 20 200 L 100 80 L 180 200 Z" fill="#475569"/>' +
          '</g>' +
        '</svg>' +
        '<div style="font-size:0.7rem;color:rgba(255,255,255,0.5);">SVG-filter true duotone (cyan + magenta)</div>' +
      '</div>';
  };

  P['effects/encrypted-text.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:1rem;align-items:center;padding:1rem;">' +
        ['enctxt-classified', 'enctxt-cyber', 'enctxt-acid'].map(function (v) {
          return '<div class="enctxt ' + v + '" style="font-family:ui-monospace,monospace;font-size:1.2rem;letter-spacing:0.1em;color:#86efac;font-weight:700;text-transform:uppercase;">' +
            (v === 'enctxt-classified' ? '<span style="color:#ef4444;">█ CLASSIFIED █</span>' :
             v === 'enctxt-cyber' ? '<span style="color:#22d3ee;text-shadow:0 0 8px #22d3ee;">ACCESS_GRANTED</span>' :
             '<span style="color:#86efac;text-shadow:0 0 8px #86efac;">UNLOCKED ✓</span>') +
          '</div>';
        }).join('') +
        '<div style="font-size:0.7rem;color:rgba(255,255,255,0.45);text-align:center;">Three preset styles. Pair with encrypted-text.js for the scramble-in reveal animation.</div>' +
      '</div>';
  };

  P['effects/glitch.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:1.2rem;align-items:center;padding:1.4rem;">' +
        '<h2 class="glitch" data-text="GLITCHED" style="font-family:ui-monospace,monospace;font-size:2.5rem;font-weight:800;color:#fff;letter-spacing:0.04em;margin:0;">GLITCHED</h2>' +
        '<div class="glitch glitch-block" data-text="ERROR_404" style="font-family:ui-monospace,monospace;font-size:1.4rem;font-weight:700;color:#fff;letter-spacing:0.08em;">ERROR_404</div>' +
        '<div style="display:flex;gap:0.6rem;">' +
          '<div class="glitch-image" style="width:90px;height:90px;background:linear-gradient(135deg,#ec4899,#8b5cf6);border-radius:6px;position:relative;"></div>' +
          '<div class="glitch-image glitch-scanlines" style="width:90px;height:90px;background:linear-gradient(135deg,#22d3ee,#8b5cf6);border-radius:6px;position:relative;"></div>' +
        '</div>' +
      '</div>';
  };

  P['effects/gradient-animations.css'] = function (target) {
    target.innerHTML =
      '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:0.5rem;width:100%;max-width:520px;">' +
        ['aurora','drift','sunset','ocean','breathe','conic-spin'].map(function (n) {
          return '<div style="position:relative;height:90px;border-radius:8px;overflow:hidden;">' +
            '<div class="ganm ganm-' + n + '" style="width:100%;height:100%;"></div>' +
            '<span style="position:absolute;bottom:6px;left:8px;font-size:0.65rem;color:rgba(255,255,255,0.85);font-family:monospace;text-shadow:0 1px 4px rgba(0,0,0,0.5);">ganm-' + n + '</span>' +
          '</div>';
        }).join('') +
      '</div>';
  };

  P['effects/gradient-borders.css'] = function (target) {
    target.innerHTML =
      '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:0.7rem;width:100%;max-width:520px;">' +
        [
          ['aurora','Aurora ring'],
          ['cosmic','Cosmic'],
          ['cyber','Cyber'],
          ['beam','Beam (anim)'],
          ['breathing','Breathing'],
          ['rainbow','Rainbow']
        ].map(function (b) {
          return '<div class="gbord gbord-' + b[0] + '" style="padding:2px;border-radius:10px;">' +
            '<div class="gbord-content" style="padding:0.9rem 1rem;background:#0a0a14;border-radius:8px;color:#fff;font-weight:600;font-size:0.85rem;">' + b[1] + '</div>' +
          '</div>';
        }).join('') +
      '</div>';
  };

  P['effects/gradient-mask.css'] = function (target) {
    target.innerHTML =
      '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:0.5rem;width:100%;max-width:520px;">' +
        ['bottom','vignette','radial','iris','soft-edges','spotlight'].map(function (m) {
          return '<div style="position:relative;height:120px;border-radius:8px;overflow:hidden;">' +
            '<div class="gmask gmask-' + m + '" style="height:100%;background:linear-gradient(135deg,#8b5cf6,#ec4899,#f97316);"></div>' +
            '<span style="position:absolute;bottom:6px;left:8px;font-size:0.65rem;color:rgba(255,255,255,0.95);font-family:monospace;text-shadow:0 1px 4px rgba(0,0,0,0.6);">gmask-' + m + '</span>' +
          '</div>';
        }).join('') +
      '</div>';
  };

  P['effects/gradient-mesh.css'] = function (target) {
    target.innerHTML =
      '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:0.5rem;width:100%;max-width:520px;">' +
        ['stripe','linear','vercel','aurora','cosmic','sunrise','ocean','cyberpunk'].map(function (m) {
          return '<div style="position:relative;height:100px;border-radius:8px;overflow:hidden;">' +
            '<div class="gmesh gmesh-' + m + '" style="width:100%;height:100%;"></div>' +
            '<span style="position:absolute;bottom:6px;left:8px;font-size:0.65rem;color:rgba(255,255,255,0.95);font-family:monospace;text-shadow:0 1px 4px rgba(0,0,0,0.6);font-weight:600;">gmesh-' + m + '</span>' +
          '</div>';
        }).join('') +
      '</div>';
  };

  P['effects/image-distortion-hover.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;gap:0.6rem;flex-wrap:wrap;justify-content:center;padding:0.5rem;">' +
        ['idh-soft','idh-strong','idh-rgb'].map(function (v) {
          return '<div style="display:flex;flex-direction:column;align-items:center;gap:0.4rem;">' +
            '<div class="idh ' + v + '" style="width:120px;height:140px;background:linear-gradient(135deg,#06b6d4,#8b5cf6,#ec4899);border-radius:10px;cursor:pointer;"></div>' +
            '<span style="font-size:0.65rem;color:rgba(255,255,255,0.55);font-family:monospace;">' + v + '</span>' +
          '</div>';
        }).join('') +
        '<div style="width:100%;text-align:center;font-size:0.7rem;color:rgba(255,255,255,0.45);">Hover the tiles to see SVG-filter warp.</div>' +
      '</div>';
  };

  P['effects/image-gradient.css'] = function (target) {
    target.innerHTML =
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.6rem;width:100%;max-width:520px;">' +
        [
          ['aurora','Aurora'],
          ['cosmic','Cosmic'],
          ['sunset','Sunset'],
          ['instagram','Instagram'],
          ['vercel','Vercel'],
          ['holo','Holo']
        ].map(function (g) {
          return '<div style="display:flex;flex-direction:column;align-items:center;gap:0.3rem;">' +
            '<div class="imggrad imggrad-' + g[0] + '" style="width:90px;height:90px;border-radius:18px;display:grid;place-items:center;font-size:2.4rem;color:#fff;font-weight:900;text-shadow:0 2px 8px rgba(0,0,0,0.3);">★</div>' +
            '<span style="font-size:0.65rem;color:rgba(255,255,255,0.55);font-family:monospace;">' + g[1] + '</span>' +
          '</div>';
        }).join('') +
      '</div>';
  };

  P['effects/image-gradient.js'] = P['effects/image-gradient.css'];

  P['effects/image-reveal-mask.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;gap:0.7rem;align-items:center;">' +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;width:100%;max-width:380px;">' +
          ['up','down','left','right','iris','diamond'].map(function (v) {
            return '<div style="position:relative;height:90px;border-radius:8px;overflow:hidden;">' +
              '<div class="irm irm-' + v + ' dapp-irm-tile" style="width:100%;height:100%;background:linear-gradient(135deg,#8b5cf6,#ec4899,#06b6d4);"></div>' +
              '<span style="position:absolute;bottom:4px;left:6px;font-size:0.62rem;color:rgba(255,255,255,0.95);font-family:monospace;text-shadow:0 1px 4px rgba(0,0,0,0.5);">irm-' + v + '</span>' +
            '</div>';
          }).join('') +
        '</div>' +
        '<button class="dapp-irm-replay" style="padding:0.4rem 1rem;background:rgba(139,92,246,0.18);border:1px solid #a78bfa;border-radius:6px;color:#c4b5fd;font-size:0.78rem;cursor:pointer;font-weight:600;">↻ Replay reveals</button>' +
      '</div>';
    target.querySelector('.dapp-irm-replay').addEventListener('click', function () {
      target.querySelectorAll('.dapp-irm-tile').forEach(function (t) {
        t.style.animation = 'none';
        t.offsetHeight;
        t.style.animation = '';
      });
    });
  };

  // ============================================
  // Mobile app screens — render inside iPhone frame
  // ============================================

  P['mobile/app-login.css'] = function (target) {
    var screen = iphoneFrame(target, { caption: 'Full-page mobile login — email + social + sign-up footer.' });
    screen.innerHTML =
      '<div class="applogin">' +
        '<div class="applogin-head">' +
          '<div class="applogin-logo">●</div>' +
          '<h1 class="applogin-title">Welcome back</h1>' +
          '<p class="applogin-sub">Sign in to continue</p>' +
        '</div>' +
        '<form class="applogin-form" onsubmit="event.preventDefault();">' +
          '<label class="applogin-field"><span class="applogin-label">Email</span><input type="email" placeholder="you@example.com" value="alex@example.com"></label>' +
          '<label class="applogin-field"><span class="applogin-label">Password</span><input type="password" placeholder="••••••••" value="password"></label>' +
          '<a class="applogin-forgot">Forgot password?</a>' +
          '<button type="button" class="applogin-primary">Sign in</button>' +
        '</form>' +
        '<div class="applogin-divider"><span>or</span></div>' +
        '<div class="applogin-social">' +
          '<button class="applogin-social-btn">  Continue with Apple</button>' +
          '<button class="applogin-social-btn">G&nbsp;&nbsp;Continue with Google</button>' +
        '</div>' +
        '<p class="applogin-footer">Don\'t have an account? <a>Sign up</a></p>' +
      '</div>';
  };

  P['mobile/app-signup.css'] = function (target) {
    var screen = iphoneFrame(target, { caption: 'Create-account: name/email/password + strength meter.' });
    screen.innerHTML =
      '<div class="appsignup">' +
        '<button class="appsignup-back">←</button>' +
        '<div class="appsignup-head">' +
          '<h1 class="appsignup-title">Create account</h1>' +
          '<p class="appsignup-sub">Free forever. No credit card required.</p>' +
        '</div>' +
        '<form class="appsignup-form" onsubmit="event.preventDefault();">' +
          '<label class="appsignup-field"><span class="appsignup-label">Full name</span><input type="text" placeholder="Alex Morgan"></label>' +
          '<label class="appsignup-field"><span class="appsignup-label">Email</span><input type="email" placeholder="alex@example.com"></label>' +
          '<label class="appsignup-field">' +
            '<span class="appsignup-label">Password</span>' +
            '<div class="appsignup-pw"><input type="password" value="••••••••" placeholder="8+ characters"><button type="button" class="appsignup-eye">👁</button></div>' +
            '<div class="appsignup-meter"><span class="appsignup-meter-bar is-on" style="--c:#22c55e;"></span><span class="appsignup-meter-bar is-on" style="--c:#22c55e;"></span><span class="appsignup-meter-bar is-on" style="--c:#facc15;"></span><span class="appsignup-meter-bar"></span></div>' +
            '<span class="appsignup-meter-label">Strong password ✓</span>' +
          '</label>' +
          '<label class="appsignup-check"><input type="checkbox" checked><span>I agree to the <a>Terms</a> and <a>Privacy Policy</a></span></label>' +
        '</form>' +
        '<div class="appsignup-foot">' +
          '<button class="appsignup-primary">Create account</button>' +
          '<p class="appsignup-already">Already have an account? <a>Sign in</a></p>' +
        '</div>' +
      '</div>';
  };

  P['mobile/app-magic-link-sent.css'] = function (target) {
    var screen = iphoneFrame(target, { caption: 'Magic-link confirmation with floating envelope animation.' });
    screen.innerHTML =
      '<div class="apmlink">' +
        '<div class="apmlink-art">📧</div>' +
        '<h1 class="apmlink-title">Check your email</h1>' +
        '<p class="apmlink-text">We sent a sign-in link to<br><b>alex@example.com</b></p>' +
        '<div class="apmlink-actions">' +
          '<button class="apmlink-primary">Open mail app</button>' +
          '<button class="apmlink-secondary">Resend link</button>' +
        '</div>' +
        '<p class="apmlink-help">Didn\'t get it? Check spam or <a>use a different email</a>.</p>' +
      '</div>';
  };

  P['mobile/app-onboarding-welcome.css'] = function (target) {
    var screen = iphoneFrame(target, { caption: 'Animated conic-gradient orb + welcome CTA.', statusBarColor: '#fff' });
    screen.innerHTML =
      '<div class="apwelcome">' +
        '<div class="apwelcome-bg"></div>' +
        '<div class="apwelcome-art"><div class="apwelcome-art-orb"></div></div>' +
        '<div class="apwelcome-content">' +
          '<p class="apwelcome-eyebrow">FRONTENDMAXXING</p>' +
          '<h1 class="apwelcome-title">Build apps<br>users love.</h1>' +
          '<p class="apwelcome-sub">Beautiful components, native interactions, zero compromise.</p>' +
          '<div class="apwelcome-actions">' +
            '<button class="apwelcome-primary">Get started</button>' +
            '<button class="apwelcome-text">I already have an account</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  };

  P['mobile/app-onboarding-value-props.css'] = function (target) {
    var screen = iphoneFrame(target, { caption: 'Feature highlight list (Notion/Calm style).' });
    screen.innerHTML =
      '<div class="apvprop">' +
        '<div class="apvprop-head"><h1 class="apvprop-title">What you\'ll love about it</h1></div>' +
        '<ul class="apvprop-list">' +
          [
            ['#0a84ff','⚡','Lightning fast','Optimized for instant interactions and offline use.'],
            ['#ec4899','🎨','Beautiful by default','Every screen feels native and looks polished.'],
            ['#22c55e','🔒','Private & secure','End-to-end encryption, zero tracking.'],
            ['#fbbf24','🔄','Sync everywhere','Pick up where you left off on any device.']
          ].map(function (r) {
            return '<li class="apvprop-row">' +
              '<span class="apvprop-icon" style="background:' + r[0] + ';">' + r[1] + '</span>' +
              '<div><div class="apvprop-row-title">' + r[2] + '</div><div class="apvprop-row-text">' + r[3] + '</div></div>' +
            '</li>';
          }).join('') +
        '</ul>' +
        '<button class="apvprop-cta">Continue</button>' +
      '</div>';
  };

  P['mobile/app-onboarding-pick-goals.css'] = function (target) {
    var screen = iphoneFrame(target, { caption: 'Multi-select chip grid for personalization.' });
    var goals = [
      ['😴','Sleep better',true],['🧘','Reduce stress',false],
      ['💪','Build habits',true],['🧠','Stay focused',false],
      ['⚡','Boost energy',false],['❤','Be happier',true],
      ['🥗','Eat better',false],['📚','Learn more',false]
    ];
    screen.innerHTML =
      '<div class="apgoals">' +
        '<div class="apgoals-head">' +
          '<p class="apgoals-step">Step 2 of 4</p>' +
          '<h1 class="apgoals-title">What brings you here?</h1>' +
          '<p class="apgoals-sub">Pick all that apply. We\'ll tailor your experience.</p>' +
        '</div>' +
        '<div class="apgoals-grid">' +
          goals.map(function (g) {
            return '<button class="apgoals-chip' + (g[2] ? ' is-selected' : '') + '">' +
              '<span class="apgoals-chip-icon">' + g[0] + '</span>' +
              '<span class="apgoals-chip-label">' + g[1] + '</span>' +
            '</button>';
          }).join('') +
        '</div>' +
        '<button class="apgoals-cta">Continue</button>' +
      '</div>';
    screen.querySelectorAll('.apgoals-chip').forEach(function (c) {
      c.addEventListener('click', function () { c.classList.toggle('is-selected'); });
    });
  };

  P['mobile/app-paywall.css'] = function (target) {
    var screen = iphoneFrame(target, { caption: 'Pro subscription paywall — gold hero + feature list + plan toggle.' });
    screen.innerHTML =
      '<div class="appaywall">' +
        '<button class="appaywall-close">×</button>' +
        '<div class="appaywall-hero">' +
          '<div class="appaywall-badge">PRO</div>' +
          '<h1 class="appaywall-title">Unlock<br>everything</h1>' +
          '<p class="appaywall-sub">7 days free, then $9.99 / month</p>' +
        '</div>' +
        '<ul class="appaywall-features">' +
          [
            ['Unlimited components','across all categories'],
            ['Premium themes','and full source export'],
            ['Priority updates','and team licensing']
          ].map(function (f) {
            return '<li class="appaywall-feat"><span class="appaywall-feat-check">✓</span><span><b>' + f[0] + '</b> ' + f[1] + '</span></li>';
          }).join('') +
        '</ul>' +
        '<div class="appaywall-plans">' +
          '<button class="appaywall-plan"><div class="appaywall-plan-name">Monthly</div><div class="appaywall-plan-price">$9.99 / month</div></button>' +
          '<button class="appaywall-plan is-active"><span class="appaywall-plan-deal">SAVE 50%</span><div class="appaywall-plan-name">Yearly</div><div class="appaywall-plan-price">$4.99 / month <span>($59.88 / yr)</span></div></button>' +
        '</div>' +
        '<button class="appaywall-cta">Start 7-day free trial</button>' +
        '<p class="appaywall-foot">Cancel anytime · <a>Restore</a> · <a>Terms</a></p>' +
      '</div>';
    screen.querySelectorAll('.appaywall-plan').forEach(function (p) {
      p.addEventListener('click', function () {
        screen.querySelectorAll('.appaywall-plan').forEach(function (x) { x.classList.remove('is-active'); });
        p.classList.add('is-active');
      });
    });
  };

  P['mobile/app-subscription-tiers.css'] = function (target) {
    var screen = iphoneFrame(target, { caption: 'Plan picker with monthly/yearly toggle.' });
    screen.innerHTML =
      '<div class="aptiers">' +
        '<button class="aptiers-back">←</button>' +
        '<h1 class="aptiers-title">Choose your plan</h1>' +
        '<div class="aptiers-toggle" data-aptiers-toggle data-period="yearly">' +
          '<span class="aptiers-toggle-thumb"></span>' +
          '<button class="aptiers-toggle-opt" data-period="monthly">Monthly</button>' +
          '<button class="aptiers-toggle-opt is-active" data-period="yearly">Yearly · -20%</button>' +
        '</div>' +
        '<div class="aptiers-cards">' +
          '<button class="aptiers-card"><div class="aptiers-card-name">Free</div><div class="aptiers-card-price">$0<span>/mo</span></div><ul class="aptiers-card-feats"><li>10 projects</li><li>Community support</li></ul></button>' +
          '<button class="aptiers-card is-active"><div class="aptiers-card-tag">POPULAR</div><div class="aptiers-card-name">Pro</div><div class="aptiers-card-price" data-monthly="$12" data-yearly="$9">$9<span>/mo</span></div><ul class="aptiers-card-feats"><li>Unlimited projects</li><li>Priority support</li><li>Custom domains</li></ul></button>' +
          '<button class="aptiers-card"><div class="aptiers-card-name">Team</div><div class="aptiers-card-price" data-monthly="$25" data-yearly="$20">$20<span>/mo</span></div><ul class="aptiers-card-feats"><li>Everything in Pro</li><li>SSO + audit logs</li><li>Team seats</li></ul></button>' +
        '</div>' +
        '<button class="aptiers-cta">Continue with Pro</button>' +
      '</div>';
    setTimeout(function () { if (window.AppSubTiers) try { window.AppSubTiers.init(screen.querySelector('.aptiers')); } catch (e) {} }, 100);
  };

  P['mobile/app-payment-card.css'] = function (target) {
    var screen = iphoneFrame(target, { caption: 'Card payment form with Apple Pay + Google Pay quick buttons.' });
    screen.innerHTML =
      '<div class="appay">' +
        '<button class="appay-back">←</button>' +
        '<h1 class="appay-title">Payment</h1>' +
        '<div class="appay-amount">' +
          '<span class="appay-amount-label">You\'ll be charged</span>' +
          '<span class="appay-amount-value">$59.88</span>' +
          '<span class="appay-amount-note">Annual · 7-day free trial</span>' +
        '</div>' +
        '<div class="appay-quick">' +
          '<button class="appay-quick-btn appay-applepay">&nbsp; Pay</button>' +
          '<button class="appay-quick-btn appay-gpay">G&nbsp;Pay</button>' +
        '</div>' +
        '<div class="appay-or"><span>or pay with card</span></div>' +
        '<div class="appay-form">' +
          '<label class="appay-field"><span class="appay-label">Card number</span><div class="appay-card-input"><input value="4242 4242 4242 4242"><span class="appay-brand">VISA</span></div></label>' +
          '<div class="appay-row"><label class="appay-field"><span class="appay-label">Expiry</span><input value="12 / 27"></label><label class="appay-field"><span class="appay-label">CVC</span><input value="•••"></label></div>' +
          '<label class="appay-field"><span class="appay-label">Name on card</span><input value="Alex Morgan"></label>' +
        '</div>' +
        '<button class="appay-cta">Pay $59.88</button>' +
        '<p class="appay-foot">🔒 Secured by Stripe · 256-bit encryption</p>' +
      '</div>';
  };

  P['mobile/app-trial-locked.css'] = function (target) {
    var screen = iphoneFrame(target, { caption: 'Locked-feature upgrade screen with blurred preview.' });
    screen.innerHTML =
      '<div class="aplock">' +
        '<button class="aplock-close">×</button>' +
        '<div class="aplock-feature">' +
          '<div class="aplock-feature-img"></div>' +
          '<div class="aplock-lock-icon">🔒</div>' +
        '</div>' +
        '<h1 class="aplock-title">Unlock advanced analytics</h1>' +
        '<p class="aplock-text">See detailed insights, custom reports, and exportable charts with Pro.</p>' +
        '<ul class="aplock-list">' +
          '<li>📊 Advanced charts & exports</li>' +
          '<li>📈 Custom dashboards</li>' +
          '<li>📁 Bulk export to CSV / PDF</li>' +
          '<li>⚡ Priority support</li>' +
        '</ul>' +
        '<button class="aplock-cta">Upgrade to Pro</button>' +
        '<button class="aplock-later">Maybe later</button>' +
      '</div>';
  };

  P['mobile/app-receipt.css'] = function (target) {
    var screen = iphoneFrame(target, { caption: 'Order success — animated checkmark + summary card.' });
    screen.innerHTML =
      '<div class="aprecpt">' +
        '<div class="aprecpt-tick"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" stroke-width="3"/><path d="M 20 32 L 28 40 L 44 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>' +
        '<h1 class="aprecpt-title">Payment successful</h1>' +
        '<p class="aprecpt-sub">Your subscription is now active.</p>' +
        '<div class="aprecpt-card">' +
          '<div class="aprecpt-row"><span>Order #</span><span class="aprecpt-row-mono">A1B2-C3D4</span></div>' +
          '<div class="aprecpt-row"><span>Plan</span><span>Pro Annual</span></div>' +
          '<div class="aprecpt-row"><span>Date</span><span>May 17, 2026</span></div>' +
          '<div class="aprecpt-row"><span>Payment</span><span>Visa •• 4242</span></div>' +
          '<div class="aprecpt-divider"></div>' +
          '<div class="aprecpt-row aprecpt-total"><span>Total</span><span>$59.88</span></div>' +
        '</div>' +
        '<button class="aprecpt-cta">Done</button>' +
        '<button class="aprecpt-receipt">Email receipt</button>' +
      '</div>';
  };

  P['mobile/app-billing-history.css'] = function (target) {
    var screen = iphoneFrame(target, { caption: 'Past charges + current-plan card + paid/failed pills.' });
    screen.innerHTML =
      '<div class="apbill">' +
        '<div class="apbill-head"><button class="apbill-back">←</button><h1 class="apbill-title">Billing</h1></div>' +
        '<div class="apbill-card">' +
          '<div class="apbill-card-label">Current plan</div>' +
          '<div class="apbill-card-plan">Pro Annual · $59.88/yr</div>' +
          '<div class="apbill-card-next">Next charge Mar 15, 2027</div>' +
          '<button class="apbill-card-link">Manage plan →</button>' +
        '</div>' +
        '<h2 class="apbill-section">Past charges</h2>' +
        '<ul class="apbill-list">' +
          [
            ['Mar 15, 2026','Visa •• 4242','$59.88','paid'],
            ['Mar 15, 2025','Visa •• 4242','$49.99','paid'],
            ['Aug 02, 2024','Visa •• 1115','$9.99','failed'],
            ['Mar 15, 2024','Visa •• 1115','$4.99','refunded']
          ].map(function (r) {
            return '<li class="apbill-row">' +
              '<div class="apbill-row-meta"><div class="apbill-row-date">' + r[0] + '</div><div class="apbill-row-card">' + r[1] + '</div></div>' +
              '<div class="apbill-row-right"><span class="apbill-row-amount">' + r[2] + '</span><span class="apbill-pill is-' + r[3] + '">' + r[3] + '</span></div>' +
            '</li>';
          }).join('') +
        '</ul>' +
      '</div>';
  };

  P['mobile/app-age-picker.css'] = function (target) {
    var screen = iphoneFrame(target, { caption: 'Birthday wheel picker — scroll each column.' });
    screen.innerHTML =
      '<div class="apage">' +
        '<button class="apage-back">←</button>' +
        '<div class="apage-step">Step 1 of 3</div>' +
        '<h1 class="apage-title">When were you born?</h1>' +
        '<p class="apage-sub">We\'ll use this to personalize your experience.</p>' +
        '<div class="apage-picker" data-app-age-picker>' +
          '<div class="apage-col" data-col="month"></div>' +
          '<div class="apage-col" data-col="day"></div>' +
          '<div class="apage-col" data-col="year"></div>' +
          '<div class="apage-selection"></div>' +
        '</div>' +
        '<div class="apage-summary">You\'ll be turning <b>25</b></div>' +
        '<button class="apage-cta">Continue</button>' +
      '</div>';
    setTimeout(function () { if (window.AppAgePicker) try { window.AppAgePicker.init(screen.querySelector('[data-app-age-picker]'), { summarySel: '.apage-summary' }); } catch (e) {} }, 150);
  };

  P['mobile/app-name-input.css'] = function (target) {
    var screen = iphoneFrame(target, { caption: 'Single large field + bottom Continue / Skip.' });
    screen.innerHTML =
      '<div class="apname">' +
        '<button class="apname-back">←</button>' +
        '<div class="apname-step">Step 1 of 4</div>' +
        '<h1 class="apname-title">What should we call you?</h1>' +
        '<p class="apname-sub">First name is fine. You can change this later.</p>' +
        '<input class="apname-input" type="text" placeholder="Your name" value="Alex">' +
        '<div class="apname-foot">' +
          '<button class="apname-cta">Continue</button>' +
          '<button class="apname-skip">Skip</button>' +
        '</div>' +
      '</div>';
    var input = screen.querySelector('.apname-input');
    var cta = screen.querySelector('.apname-cta');
    var sync = function () { cta.disabled = !input.value.trim(); };
    input.addEventListener('input', sync); sync();
  };

  P['mobile/app-email-verify.css'] = function (target) {
    var screen = iphoneFrame(target, { caption: '6-digit OTP with auto-advance + paste. Try the inputs.' });
    screen.innerHTML =
      '<div class="apverify">' +
        '<button class="apverify-back">←</button>' +
        '<h1 class="apverify-title">Enter verification code</h1>' +
        '<p class="apverify-sub">We sent a 6-digit code to<br><b>alex@example.com</b></p>' +
        '<div class="apverify-otp" data-app-otp data-length="6">' +
          '<input maxlength="1" inputmode="numeric" pattern="[0-9]*">' +
          '<input maxlength="1" inputmode="numeric" pattern="[0-9]*">' +
          '<input maxlength="1" inputmode="numeric" pattern="[0-9]*">' +
          '<input maxlength="1" inputmode="numeric" pattern="[0-9]*">' +
          '<input maxlength="1" inputmode="numeric" pattern="[0-9]*">' +
          '<input maxlength="1" inputmode="numeric" pattern="[0-9]*">' +
        '</div>' +
        '<div class="apverify-error">Incorrect code. Try again.</div>' +
        '<button class="apverify-resend">Resend code <span>00:24</span></button>' +
        '<button class="apverify-cta" disabled>Verify</button>' +
      '</div>';
    setTimeout(function () {
      if (window.AppOtp) try {
        var verifyEl = screen.querySelector('.apverify');
        var ctaEl = screen.querySelector('.apverify-cta');
        window.AppOtp.init(screen.querySelector('[data-app-otp]'), {
          onChange: function (code) { ctaEl.disabled = code.length !== 6; },
          onComplete: function (code) {
            if (code !== '123456') verifyEl.classList.add('is-error');
            setTimeout(function () { verifyEl.classList.remove('is-error'); }, 600);
          }
        });
      } catch (e) {}
    }, 100);
  };

  P['mobile/app-pin-create.css'] = function (target) {
    var screen = iphoneFrame(target, { caption: '4-digit PIN with keypad. Try typing or tapping.' });
    screen.innerHTML =
      '<div class="appin">' +
        '<button class="appin-back">←</button>' +
        '<div class="appin-head">' +
          '<h1 class="appin-title">Create a PIN</h1>' +
          '<p class="appin-sub">You\'ll use this to unlock the app</p>' +
        '</div>' +
        '<div class="appin-dots" data-app-pin data-length="4">' +
          '<span class="appin-dot"></span>' +
          '<span class="appin-dot"></span>' +
          '<span class="appin-dot"></span>' +
          '<span class="appin-dot"></span>' +
        '</div>' +
        '<div class="appin-keys">' +
          '<button class="appin-key" data-key="1">1</button>' +
          '<button class="appin-key" data-key="2">2<span>ABC</span></button>' +
          '<button class="appin-key" data-key="3">3<span>DEF</span></button>' +
          '<button class="appin-key" data-key="4">4<span>GHI</span></button>' +
          '<button class="appin-key" data-key="5">5<span>JKL</span></button>' +
          '<button class="appin-key" data-key="6">6<span>MNO</span></button>' +
          '<button class="appin-key" data-key="7">7<span>PQRS</span></button>' +
          '<button class="appin-key" data-key="8">8<span>TUV</span></button>' +
          '<button class="appin-key" data-key="9">9<span>WXYZ</span></button>' +
          '<button class="appin-key appin-key-faceid">😊</button>' +
          '<button class="appin-key" data-key="0">0</button>' +
          '<button class="appin-key appin-key-back" data-key="back">⌫</button>' +
        '</div>' +
      '</div>';
    setTimeout(function () { if (window.AppPin) try { window.AppPin.init(screen.querySelector('.appin')); } catch (e) {} }, 100);
  };

  P['mobile/app-language-picker.css'] = function (target) {
    var screen = iphoneFrame(target, { caption: 'Searchable language list with flag emojis.' });
    var langs = [
      ['🇺🇸','English','',true],
      ['🇪🇸','Español','Spanish'],
      ['🇫🇷','Français','French'],
      ['🇩🇪','Deutsch','German'],
      ['🇯🇵','日本語','Japanese'],
      ['🇰🇷','한국어','Korean'],
      ['🇨🇳','中文','Chinese'],
      ['🇮🇹','Italiano','Italian'],
      ['🇵🇹','Português','Portuguese']
    ];
    screen.innerHTML =
      '<div class="aplang">' +
        '<button class="aplang-back">←</button>' +
        '<h1 class="aplang-title">Choose your language</h1>' +
        '<div class="aplang-search"><span class="aplang-search-icon">🔍</span><input placeholder="Search languages"></div>' +
        '<div class="aplang-section">SUGGESTED</div>' +
        '<ul class="aplang-list">' +
          langs.map(function (l) {
            return '<li class="aplang-row' + (l[3] ? ' is-active' : '') + '">' +
              '<span class="aplang-flag">' + l[0] + '</span>' +
              '<span class="aplang-name">' + l[1] + (l[2] ? '<span class="aplang-native">' + l[2] + '</span>' : '') + '</span>' +
              (l[3] ? '<span class="aplang-check">✓</span>' : '') +
            '</li>';
          }).join('') +
        '</ul>' +
        '<button class="aplang-cta">Continue</button>' +
      '</div>';
    screen.querySelectorAll('.aplang-row').forEach(function (r) {
      r.addEventListener('click', function () {
        screen.querySelectorAll('.aplang-row').forEach(function (x) { x.classList.remove('is-active'); x.querySelector('.aplang-check') && x.querySelector('.aplang-check').remove(); });
        r.classList.add('is-active');
        if (!r.querySelector('.aplang-check')) { var s = document.createElement('span'); s.className = 'aplang-check'; s.textContent = '✓'; r.appendChild(s); }
      });
    });
  };

  P['mobile/app-state-screens.css'] = function (target) {
    var variants = [
      { cls: 'apstate-error',   art: '😵', title: 'Something went wrong', text: 'We couldn\'t load this content. Check your connection and try again.', primary: 'Try again' },
      { cls: 'apstate-success', art: '🎉', title: 'You\'re all set!',       text: 'Your account has been created successfully. Welcome aboard.',            primary: 'Get started' },
      { cls: 'apstate-empty',   art: '📭', title: 'Nothing here yet',       text: 'When you create your first project, it\'ll show up here.',               primary: 'Create project' },
      { cls: 'apstate-offline', art: '☁',  title: 'You\'re offline',         text: 'Some features need a connection. We\'ll sync once you\'re back online.',  primary: 'Try again' },
      { cls: 'apstate-404',     art: '404', title: 'Page not found',         text: 'The page you\'re looking for doesn\'t exist or was moved.',              primary: 'Go home' }
    ];
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.8rem;width:100%;">' +
        '<div style="display:flex;gap:0.3rem;flex-wrap:wrap;justify-content:center;">' +
          variants.map(function (v, i) {
            return '<button class="dapp-state-tab" data-idx="' + i + '" style="padding:0.3rem 0.7rem;background:' + (i === 0 ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.04)') + ';border:1px solid ' + (i === 0 ? '#a78bfa' : 'rgba(255,255,255,0.1)') + ';border-radius:5px;color:#fff;font-size:0.7rem;cursor:pointer;font-family:monospace;">' + v.cls.replace('apstate-', '') + '</button>';
          }).join('') +
        '</div>' +
        '<div data-state-host style="width:100%;display:flex;justify-content:center;"></div>' +
      '</div>';
    var host = target.querySelector('[data-state-host]');
    function render(idx) {
      var v = variants[idx];
      host.innerHTML = '';
      var screen = iphoneFrame(host, {});
      screen.innerHTML =
        '<div class="apstate ' + v.cls + '">' +
          '<div class="apstate-art">' + v.art + '</div>' +
          '<h1 class="apstate-title">' + v.title + '</h1>' +
          '<p class="apstate-text">' + v.text + '</p>' +
          '<button class="apstate-primary">' + v.primary + '</button>' +
          '<button class="apstate-secondary">Go back</button>' +
        '</div>';
    }
    target.querySelectorAll('.dapp-state-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        target.querySelectorAll('.dapp-state-tab').forEach(function (b) {
          b.style.background = 'rgba(255,255,255,0.04)';
          b.style.borderColor = 'rgba(255,255,255,0.1)';
        });
        btn.style.background = 'rgba(139,92,246,0.25)';
        btn.style.borderColor = '#a78bfa';
        render(parseInt(btn.getAttribute('data-idx'), 10));
      });
    });
    render(0);
  };

  P['mobile/app-permission-prompt.css'] = function (target) {
    var screen = iphoneFrame(target, { caption: 'Pre-permission screen (pulsing icon).' });
    screen.innerHTML =
      '<div class="apperm">' +
        '<div class="apperm-icon">🔔</div>' +
        '<h1 class="apperm-title">Stay in the loop</h1>' +
        '<p class="apperm-text">Get notified when there\'s an update, important message, or new feature.</p>' +
        '<ul class="apperm-list">' +
          '<li>📨 Direct messages</li>' +
          '<li>🎉 New features & releases</li>' +
          '<li>📅 Reminders you set yourself</li>' +
        '</ul>' +
        '<p class="apperm-fine">You can change this anytime in Settings.</p>' +
        '<button class="apperm-allow">Enable notifications</button>' +
        '<button class="apperm-skip">Not now</button>' +
      '</div>';
  };

  P['mobile/app-rating-prompt.css'] = function (target) {
    var screen = iphoneFrame(target, { caption: 'Rate-this-app screen with stars + reason chips.' });
    screen.innerHTML =
      '<div class="aprate">' +
        '<div class="aprate-art">🌟</div>' +
        '<h1 class="aprate-title">Enjoying frontendmaxxing?</h1>' +
        '<p class="aprate-text">Your rating helps others discover the app.</p>' +
        '<div class="aprate-stars" data-app-rate>' +
          [1,2,3,4,5].map(function (i) { return '<span class="aprate-star' + (i <= 4 ? ' is-on' : '') + '">★</span>'; }).join('') +
        '</div>' +
        '<div class="aprate-feedback">' +
          '<p class="aprate-feedback-title">What did you love?</p>' +
          '<div class="aprate-chips">' +
            ['Easy to use','Fast','Looks great','Useful features','Customer support'].map(function (c, i) {
              return '<button class="aprate-chip' + ((i === 0 || i === 2) ? ' is-selected' : '') + '">' + c + '</button>';
            }).join('') +
          '</div>' +
        '</div>' +
        '<button class="aprate-cta">Rate on App Store</button>' +
        '<button class="aprate-skip">No thanks</button>' +
      '</div>';
    // Star interaction
    var stars = screen.querySelectorAll('.aprate-star');
    stars.forEach(function (s, i) {
      s.addEventListener('click', function () {
        stars.forEach(function (x, j) { x.classList.toggle('is-on', j <= i); });
      });
    });
    screen.querySelectorAll('.aprate-chip').forEach(function (c) {
      c.addEventListener('click', function () { c.classList.toggle('is-selected'); });
    });
  };

  P['mobile/app-logout-confirm.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.8rem;width:100%;">' +
        '<div style="display:flex;gap:0.3rem;justify-content:center;">' +
          '<button class="dapp-confirm-warn" style="padding:0.3rem 0.7rem;background:rgba(251,191,36,0.18);border:1px solid #fbbf24;border-radius:5px;color:#fbbf24;font-size:0.7rem;cursor:pointer;font-family:monospace;">warn (sign out)</button>' +
          '<button class="dapp-confirm-danger" style="padding:0.3rem 0.7rem;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:5px;color:#fff;font-size:0.7rem;cursor:pointer;font-family:monospace;">danger (delete acct)</button>' +
        '</div>' +
        '<div data-confirm-host style="width:100%;display:flex;justify-content:center;"></div>' +
      '</div>';
    var host = target.querySelector('[data-confirm-host]');
    function renderWarn() {
      host.innerHTML = '';
      var screen = iphoneFrame(host, {});
      screen.innerHTML =
        '<div class="apconfirm apconfirm-warn">' +
          '<div class="apconfirm-icon">⚠</div>' +
          '<h1 class="apconfirm-title">Sign out of Acme?</h1>' +
          '<p class="apconfirm-text">You\'ll need to sign in again to use the app.</p>' +
          '<div class="apconfirm-list">' +
            '<div class="apconfirm-row"><span>Account</span><span>alex@example.com</span></div>' +
            '<div class="apconfirm-row"><span>Drafts saved</span><span>4</span></div>' +
            '<div class="apconfirm-row"><span>Last sync</span><span>2 min ago</span></div>' +
          '</div>' +
          '<button class="apconfirm-destructive">Sign out</button>' +
          '<button class="apconfirm-cancel">Cancel</button>' +
        '</div>';
    }
    function renderDanger() {
      host.innerHTML = '';
      var screen = iphoneFrame(host, {});
      screen.innerHTML =
        '<div class="apconfirm apconfirm-danger">' +
          '<div class="apconfirm-icon">🗑</div>' +
          '<h1 class="apconfirm-title">Delete account</h1>' +
          '<p class="apconfirm-text">This permanently deletes your data. <b>This cannot be undone.</b></p>' +
          '<label class="apconfirm-check"><input type="checkbox"><span>I understand my data will be permanently deleted</span></label>' +
          '<label class="apconfirm-field"><span>Type <b>DELETE</b> to confirm</span><input placeholder="DELETE"></label>' +
          '<button class="apconfirm-destructive" disabled>Delete account</button>' +
          '<button class="apconfirm-cancel">Cancel</button>' +
        '</div>';
      // wire checkbox + typed confirm → enable button
      var screenEl = host.querySelector('.apconfirm');
      var checkbox = screenEl.querySelector('.apconfirm-check input');
      var typeInput = screenEl.querySelector('.apconfirm-field input');
      var btn = screenEl.querySelector('.apconfirm-destructive');
      function sync() { btn.disabled = !(checkbox.checked && typeInput.value.trim().toUpperCase() === 'DELETE'); }
      checkbox.addEventListener('change', sync);
      typeInput.addEventListener('input', sync);
    }
    target.querySelector('.dapp-confirm-warn').addEventListener('click', renderWarn);
    target.querySelector('.dapp-confirm-danger').addEventListener('click', renderDanger);
    renderWarn();
  };

  P['mobile/ios-notification-banner.css'] = function (target) {
    var screen = iphoneFrame(target, { wallpaper: 'night', caption: 'Lock-screen notification stack + top-slide banner.' });
    screen.innerHTML =
      '<div style="flex:1;padding-top:1rem;display:flex;flex-direction:column;">' +
        '<div class="ios-notif-stack" style="padding:0 8px;">' +
          '<div class="ios-notif"><div class="ios-banner-icon" style="background:#34c759;">💬</div><div class="ios-banner-body"><div class="ios-banner-head"><span class="ios-banner-title">Messages</span><span class="ios-banner-time">9:38 AM</span></div><div class="ios-banner-from">Alice Sterling</div><div class="ios-banner-msg">Sounds great! Let\'s meet at 11.</div></div></div>' +
          '<div class="ios-notif"><div class="ios-banner-icon" style="background:#0a84ff;">✉</div><div class="ios-banner-body"><div class="ios-banner-head"><span class="ios-banner-title">Mail</span><span class="ios-banner-time">9:32 AM</span></div><div class="ios-banner-from">Linear</div><div class="ios-banner-msg">5 new comments on BUG-481</div></div></div>' +
          '<div class="ios-notif"><div class="ios-banner-icon" style="background:#ff3b30;">▶</div><div class="ios-banner-body"><div class="ios-banner-head"><span class="ios-banner-title">YouTube</span><span class="ios-banner-time">8:12 AM</span></div><div class="ios-banner-from">Fireship uploaded</div><div class="ios-banner-msg">React 19 in 100 seconds</div></div></div>' +
        '</div>' +
      '</div>';
  };

  // ============================================
  // GSAP snippets — loaded via CDN by _app.js
  // ============================================
  function waitForGsap(cb, tries) {
    tries = tries || 0;
    if (window.gsap) return cb();
    if (tries > 60) return;
    setTimeout(function () { waitForGsap(cb, tries + 1); }, 80);
  }
  function gsapStage(target, inner, note) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.7rem;width:100%;">' +
        '<div data-gsap-stage style="width:100%;max-width:540px;background:#0b0b16;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:1.2rem;overflow:hidden;">' + inner + '</div>' +
        (note ? '<div style="font-size:0.7rem;color:rgba(255,255,255,0.5);text-align:center;max-width:480px;">' + note + '</div>' : '') +
        '<button data-gsap-replay style="padding:0.4rem 1rem;background:rgba(34,197,94,0.16);border:1px solid #22c55e;border-radius:6px;color:#86efac;font-size:0.78rem;cursor:pointer;font-weight:600;">↻ Replay</button>' +
      '</div>';
    return target.querySelector('[data-gsap-stage]');
  }
  function gsapReplay(target, fn) {
    var btn = target.querySelector('[data-gsap-replay]');
    if (btn) btn.addEventListener('click', fn);
  }

  P['gsap/scroll-reveal.js'] = function (target) {
    var cells = [1,2,3,4,5,6].map(function (i) {
      return '<div class="dapp-gr-cell" style="height:54px;border-radius:8px;background:linear-gradient(135deg,#8b5cf6,#ec4899);display:grid;place-items:center;color:#fff;font-weight:700;">' + i + '</div>';
    }).join('');
    var stage = gsapStage(target,
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.6rem;">' + cells + '</div>',
      'In-page ScrollReveal demo (plays immediately here; in real use it triggers on scroll).');
    function run() {
      waitForGsap(function () {
        var els = stage.querySelectorAll('.dapp-gr-cell');
        window.gsap.set(els, { y: 40, autoAlpha: 0 });
        window.gsap.to(els, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out' });
      });
    }
    run(); gsapReplay(target, run);
  };

  P['gsap/stagger-grid.js'] = function (target) {
    var cells = Array.from({ length: 25 }, function (_, i) {
      return '<div class="dapp-sg-cell" style="aspect-ratio:1;border-radius:6px;background:hsl(' + (i * 14) + ',75%,60%);"></div>';
    }).join('');
    var stage = gsapStage(target,
      '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:0.4rem;max-width:280px;margin:0 auto;">' + cells + '</div>',
      'Advanced grid stagger — from:"center".');
    function run() {
      waitForGsap(function () {
        var els = stage.querySelectorAll('.dapp-sg-cell');
        window.gsap.set(els, { autoAlpha: 0, scale: 0.4 });
        window.gsap.to(els, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)', stagger: { amount: 0.9, grid: [5,5], from: 'center' } });
      });
    }
    run(); gsapReplay(target, run);
  };

  P['gsap/split-text.js'] = function (target) {
    var stage = gsapStage(target,
      '<h2 class="dapp-split" style="font-size:2.4rem;font-weight:800;color:#fff;text-align:center;margin:0;letter-spacing:-0.02em;">Frontend Maxxing</h2>',
      'Dependency-free char split + reveal (SplitReveal global).');
    function run() {
      waitForGsap(function () {
        if (!window.SplitReveal) return;
        var h = stage.querySelector('.dapp-split');
        if (h._sr) h._sr.revert();
        h._sr = window.SplitReveal.init(h, { type: 'chars', duration: 0.8, stagger: 0.03 });
      });
    }
    run(); gsapReplay(target, run);
  };

  P['gsap/counter.js'] = function (target) {
    var stage = gsapStage(target,
      '<div style="display:flex;justify-content:space-around;text-align:center;color:#fff;">' +
        '<div><div class="dapp-ct" data-to="12480" style="font-size:2.2rem;font-weight:800;">0</div><div style="font-size:0.72rem;color:rgba(255,255,255,0.5);">Users</div></div>' +
        '<div><div class="dapp-ct2" style="font-size:2.2rem;font-weight:800;">0</div><div style="font-size:0.72rem;color:rgba(255,255,255,0.5);">Uptime</div></div>' +
      '</div>',
      'Animated count-up with separators / suffix.');
    function run() {
      waitForGsap(function () {
        if (!window.Counter) return;
        window.Counter.init(stage.querySelector('.dapp-ct'), { to: 12480, separator: ',', duration: 1.8, scroll: false });
        window.Counter.init(stage.querySelector('.dapp-ct2'), { to: 99.9, decimals: 1, suffix: '%', duration: 1.8, scroll: false });
      });
    }
    run(); gsapReplay(target, run);
  };

  P['gsap/marquee.js'] = function (target) {
    var items = ['DESIGN','★','MOTION','★','GSAP','★','VANILLA','★','ZERO-BUILD','★'].map(function (t) {
      return '<span style="font-size:1.4rem;font-weight:800;color:#fff;letter-spacing:0.05em;">' + t + '</span>';
    }).join('');
    var stage = gsapStage(target,
      '<div class="dapp-mq" style="display:flex;gap:40px;">' + items + '</div>',
      'Seamless infinite loop · hover to pause.');
    function run() {
      waitForGsap(function () {
        if (!window.GsapMarquee) return;
        var el = stage.querySelector('.dapp-mq');
        if (el._mq) el._mq.destroy();
        el._mq = window.GsapMarquee.init(el, { speed: 90 });
      });
    }
    run(); gsapReplay(target, run);
  };

  P['gsap/magnetic.js'] = function (target) {
    var stage = gsapStage(target,
      '<div style="display:grid;place-items:center;min-height:120px;">' +
        '<button class="dapp-mag" style="padding:1rem 2rem;background:linear-gradient(135deg,#8b5cf6,#ec4899);border:0;border-radius:12px;color:#fff;font-weight:700;font-size:1rem;cursor:pointer;"><span class="dapp-mag-l" style="display:inline-block;">Hover me ✨</span></button>' +
      '</div>',
      'Move your cursor near the button — it follows magnetically.');
    waitForGsap(function () {
      if (!window.Magnetic) return;
      window.Magnetic.init(stage.querySelector('.dapp-mag'), { strength: 0.5, innerSelector: '.dapp-mag-l', innerStrength: 0.8 });
    });
    var btn = target.querySelector('[data-gsap-replay]');
    if (btn) btn.style.display = 'none';
  };

  P['gsap/text-scramble.js'] = function (target) {
    var stage = gsapStage(target,
      '<div class="dapp-scr" style="font-family:ui-monospace,monospace;font-size:1.8rem;font-weight:700;color:#22c55e;text-align:center;letter-spacing:0.06em;">SYSTEM ONLINE</div>',
      'Dependency-free ScrambleText-style decode.');
    function run() {
      waitForGsap(function () {
        if (!window.TextScramble) return;
        var el = stage.querySelector('.dapp-scr');
        if (el._ts) el._ts.destroy();
        el._ts = window.TextScramble.init(el, { duration: 1.4 });
      });
    }
    run(); gsapReplay(target, run);
  };

  P['gsap/flip-layout.js'] = function (target) {
    var cells = [1,2,3,4,5,6].map(function (i) {
      return '<div class="dapp-fl-cell" style="border-radius:8px;background:linear-gradient(135deg,#06b6d4,#8b5cf6);color:#fff;font-weight:700;display:grid;place-items:center;height:60px;">' + i + '</div>';
    }).join('');
    var stage = gsapStage(target,
      '<div class="dapp-fl" style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;">' + cells + '</div>',
      'Click Replay to FLIP-shuffle the grid order.');
    var grid = stage.querySelector('.dapp-fl');
    function run() {
      waitForGsap(function () {
        if (!window.FlipLayout) return;
        if (!grid._fl) grid._fl = window.FlipLayout.init(grid);
        grid._fl.animate(function () {
          var kids = Array.prototype.slice.call(grid.children);
          for (var i = kids.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            grid.appendChild(kids[j]);
            kids.splice(j, 1);
          }
        }, { duration: 0.7, ease: 'power2.inOut', stagger: 0.04 });
      });
    }
    gsapReplay(target, run);
  };

  P['gsap/draggable.js'] = function (target) {
    var stage = gsapStage(target,
      '<div class="dapp-dg-area" style="position:relative;height:200px;border:1px dashed rgba(255,255,255,0.15);border-radius:10px;">' +
        '<div class="dapp-dg" style="position:absolute;left:20px;top:20px;width:80px;height:80px;border-radius:14px;background:linear-gradient(135deg,#f59e0b,#ef4444);display:grid;place-items:center;color:#fff;font-weight:700;cursor:grab;">drag</div>' +
      '</div>',
      'Drag the tile — throw it (inertia) within bounds.');
    waitForGsap(function () {
      if (!window.GsapDraggable) return;
      window.GsapDraggable.init(stage.querySelector('.dapp-dg'), { type: 'x,y', bounds: stage.querySelector('.dapp-dg-area'), inertia: true });
    });
    var btn = target.querySelector('[data-gsap-replay]');
    if (btn) btn.style.display = 'none';
  };

  // ScrollTrigger-bound snippets: explain + show a static representative frame
  function gsapScrollNote(target, title, body, demoHtml) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.8rem;width:100%;">' +
        '<div style="width:100%;max-width:540px;background:#0b0b16;border:1px solid rgba(255,255,255,0.08);border-radius:12px;overflow:hidden;">' + demoHtml + '</div>' +
        '<div style="font-size:0.74rem;color:rgba(255,255,255,0.6);max-width:500px;text-align:center;line-height:1.5;"><b style="color:#86efac;">' + title + '</b><br>' + body + '</div>' +
      '</div>';
  }

  P['gsap/pin-section.js'] = function (target) {
    gsapScrollNote(target, 'ScrollTrigger pin + scrub',
      'Drop into a real page: pins a section while an inner timeline scrubs to scroll. <code style="color:#c4b5fd;">PinSection.init(\'.host\', { end:\'+=1200\', build })</code>',
      '<div style="height:170px;background:radial-gradient(circle at 50% 40%,rgba(139,92,246,0.3),transparent 70%);display:grid;place-items:center;color:#fff;font-weight:800;font-size:1.4rem;">📌 Pinned section</div>');
  };

  P['gsap/horizontal-scroll.js'] = function (target) {
    gsapScrollNote(target, 'Pinned horizontal scroll',
      'Vertical scroll drives a horizontal panel track. <code style="color:#c4b5fd;">HorizontalScroll.init(\'.hscroll\')</code> — panels flex 0 0 100vw.',
      '<div style="display:flex;gap:6px;padding:1rem;overflow:hidden;">' + [1,2,3,4].map(function (i) { return '<div style="flex:0 0 60%;height:130px;border-radius:10px;background:linear-gradient(135deg,hsl(' + (i*60) + ',70%,55%),hsl(' + (i*60+40) + ',70%,45%));display:grid;place-items:center;color:#fff;font-weight:800;font-size:1.6rem;">' + i + '</div>'; }).join('') + '</div>');
  };

  P['gsap/parallax.js'] = function (target) {
    gsapScrollNote(target, 'Multi-layer scroll parallax',
      'Each layer gets <code style="color:#c4b5fd;">data-speed</code> (1 normal, &lt;1 slow, &gt;1 fast). <code style="color:#c4b5fd;">Parallax.init(\'[data-speed]\')</code>',
      '<div style="position:relative;height:170px;overflow:hidden;background:linear-gradient(180deg,#1e1b4b,#0b0b16);">' +
        '<div style="position:absolute;inset:0;background:radial-gradient(circle at 30% 30%,rgba(139,92,246,0.4),transparent 50%);"></div>' +
        '<div style="position:absolute;bottom:10px;left:0;right:0;text-align:center;color:#fff;font-weight:800;font-size:1.5rem;">Parallax hero</div>' +
      '</div>');
  };

  P['gsap/smooth-scroll.js'] = function (target) {
    gsapScrollNote(target, 'Smooth scroll + scroll-to',
      'Uses ScrollSmoother when present (honors data-speed/data-lag), else smooth anchor jumps. <code style="color:#c4b5fd;">SmoothScroll.init(); SmoothScroll.to(\'#sec\')</code>',
      '<div style="height:150px;display:grid;place-items:center;color:#fff;font-weight:700;background:linear-gradient(135deg,#0f172a,#1e293b);">🪄 Inertial smooth scrolling</div>');
  };

  // ===== Gradient builder (JS) — live linear + mesh output, randomizable =====
  P['utils/gradient-builder.js'] = function (target) {
    html(target,
      '<div style="display:flex;flex-direction:column;gap:0.7rem;width:100%;max-width:420px;">' +
        '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:0.6rem;">' +
          '<div class="gb-cell" style="height:78px;border-radius:12px;"></div>'.repeat(4) +
        '</div>' +
        '<button id="gb-rand" style="align-self:center;cursor:pointer;border:1px solid rgba(255,255,255,0.18);background:rgba(255,255,255,0.06);color:#fff;border-radius:999px;padding:0.4rem 0.95rem;font-size:0.8rem;">↻ Randomize</button>' +
      '</div>');
    function paint() {
      var GB = window.GradientBuilder; if (!GB) return;
      var pals = ['aurora', 'sunset', 'ocean', 'candy'];
      var hues = ['#c084fc', '#38bdf8', '#f472b6', '#34d399', '#fbbf24', '#f87171'];
      target.querySelectorAll('.gb-cell').forEach(function (c, i) {
        if (i % 2 === 0) {
          var pick = hues.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 3);
          c.style.background = GB.linear(pick, Math.round(Math.random() * 360));
        } else {
          var m = GB.randomMesh({ palette: pals[i % pals.length], stops: 4 });
          c.style.background = m.background; c.style.backgroundColor = m.backgroundColor;
        }
      });
    }
    setTimeout(function () { paint(); var b = target.querySelector('#gb-rand'); if (b) b.addEventListener('click', paint); }, 30);
  };

  // ===== Gradient extract (JS) — pull a palette from a synthetic image =====
  P['utils/gradient-extract.js'] = function (target) {
    html(target, '<div style="color:rgba(255,255,255,0.5);font-size:0.78rem;padding:1.2rem;">Extracting palette…</div>');
    setTimeout(function () {
      var GE = window.GradientExtract; if (!GE) return;
      var cv = document.createElement('canvas'); cv.width = 160; cv.height = 110;
      var ctx = cv.getContext('2d');
      var g = ctx.createLinearGradient(0, 0, 160, 110);
      ['#ff6b6b', '#feca57', '#48dbfb', '#5f27cd'].forEach(function (col, i, a) { g.addColorStop(i / (a.length - 1), col); });
      ctx.fillStyle = g; ctx.fillRect(0, 0, 160, 110);
      var url = cv.toDataURL();
      GE.fromImage(url).then(function (p) {
        var sw = (p.palette || []).map(function (h) { return '<div style="flex:1;height:34px;background:' + h + ';" title="' + h + '"></div>'; }).join('');
        target.innerHTML =
          '<div style="display:flex;flex-direction:column;gap:0.6rem;width:100%;max-width:380px;align-items:center;">' +
            '<img src="' + url + '" alt="source" style="width:160px;height:110px;border-radius:10px;">' +
            '<div style="font-size:0.7rem;color:rgba(255,255,255,0.45);">↓ extracted palette</div>' +
            '<div style="display:flex;width:100%;border-radius:8px;overflow:hidden;">' + sw + '</div>' +
          '</div>';
      }).catch(function () { html(target, '<div style="color:rgba(255,255,255,0.4);font-size:0.78rem;padding:1.2rem;">GradientExtract.fromImage(src) → { dominant, accent, palette[] }</div>'); });
    }, 40);
  };

  // ===== Page-transition morph (JS) — shared-element morph on click =====
  P['transitions/page-transition-morph.js'] = function (target) {
    html(target,
      '<div style="display:flex;flex-direction:column;gap:1rem;align-items:center;width:100%;">' +
        '<div style="display:flex;gap:1.4rem;align-items:center;">' +
          '<div id="ptm-thumb" style="width:58px;height:58px;border-radius:10px;background:linear-gradient(135deg,#8b5cf6,#ec4899);box-shadow:0 6px 18px -6px rgba(139,92,246,0.6);"></div>' +
          '<span style="color:rgba(255,255,255,0.35);font-size:1.2rem;">→</span>' +
          '<div id="ptm-hero" style="width:150px;height:90px;border-radius:14px;background:linear-gradient(135deg,#8b5cf6,#ec4899);opacity:0.22;"></div>' +
        '</div>' +
        '<button id="ptm-go" style="cursor:pointer;border:1px solid rgba(139,92,246,0.4);background:rgba(139,92,246,0.14);color:#ddd6fe;border-radius:999px;padding:0.4rem 1rem;font-size:0.8rem;">▶ Morph thumb → hero</button>' +
      '</div>');
    setTimeout(function () {
      var b = target.querySelector('#ptm-go'), M = window.PageTransitionMorph;
      if (b && M) b.addEventListener('click', function () {
        try { M.morph('#ptm-thumb', '#ptm-hero', { duration: 600 }); } catch (e) {}
      });
    }, 30);
  };

  // ===== Hover Pro — 8 cursor-aware hover effects (CSS + JS) =====
  P['effects/hover-pro.css'] = function (target) {
    function card(cls, attr, label) {
      return '<div class="hvp ' + cls + '" ' + (attr || '') +
        ' tabindex="0" style="background:#16161f;border:1px solid rgba(255,255,255,0.08);min-height:78px;' +
        'display:flex;align-items:center;justify-content:center;padding:0.8rem;color:#e5e7eb;font-size:0.8rem;' +
        'font-weight:600;text-align:center;cursor:pointer;"><span>' + label + '</span></div>';
    }
    html(target,
      '<div style="width:100%;max-width:560px;">' +
        '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:0.7rem;">' +
          card('hvp-glow', '', 'Glow + lift') +
          card('hvp-border-run', '', 'Running border') +
          card('hvp-liquid', '', 'Liquid fill') +
          card('hvp-depth', '', '3D depth') +
          card('hvp-holo-sheen', '', 'Holo sheen') +
          card('hvp-spotlight', 'data-hover="spotlight"', 'Spotlight ✦') +
          card('hvp-border-spotlight', 'data-hover="border"', 'Border spotlight ✦') +
          card('hvp-glare', 'data-hover="glare"', 'Glare tilt ✦') +
        '</div>' +
        '<div style="margin-top:0.6rem;font-size:0.68rem;color:rgba(255,255,255,0.4);text-align:center;">✦ = cursor-tracked — move the mouse across the card</div>' +
      '</div>');
    setTimeout(function () {
      if (window.HoverPro) window.HoverPro.init(target.querySelectorAll('[data-hover]'));
    }, 30);
  };

  // ===== Hover FX — 8 more hover effects (magnetic/ripple/parallax/reveal + CSS) =====
  P['effects/hover-fx.css'] = function (target) {
    var box = 'background:#16161f;border:1px solid rgba(255,255,255,0.08);border-radius:12px;min-height:74px;' +
      'display:flex;align-items:center;justify-content:center;padding:0.8rem;color:#e5e7eb;font-size:0.82rem;font-weight:700;cursor:pointer;text-align:center;';
    var grad = 'display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;';
    html(target,
      '<div style="width:100%;max-width:560px;">' +
        '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:0.7rem;">' +
          '<a class="hfx hfx-text-flow" tabindex="0" style="' + box + 'font-size:1.05rem;">Flowing text</a>' +
          '<div class="hfx hfx-ring" tabindex="0" style="' + box + '">Pulsing ring</div>' +
          '<button class="hfx hfx-squash" style="' + box + 'border:1px solid rgba(255,255,255,0.08);">Squash</button>' +
          '<button class="hfx hfx-slide-swap" style="' + box + 'border:1px solid rgba(255,255,255,0.08);"><span class="hfx-slide-front">Hover me</span><span class="hfx-slide-back" style="color:#c4b5fd;">Let\'s go →</span></button>' +
          '<button class="hfx hfx-magnetic" data-hover-fx="magnetic" style="' + box + 'border:1px solid rgba(139,92,246,0.4);background:rgba(139,92,246,0.14);">Magnetic ✦</button>' +
          '<div class="hfx hfx-ripple" data-hover-fx="ripple" style="' + box + '">Ripple ✦</div>' +
          '<div class="hfx hfx-parallax" data-hover-fx="parallax" style="' + box + 'flex-direction:column;gap:0.1rem;"><span data-depth="0.3" style="opacity:0.5;font-size:0.7rem;">layer</span><span data-depth="0.9">Parallax ✦</span></div>' +
          '<div class="hfx hfx-reveal" data-hover-fx="reveal" style="' + box + 'overflow:hidden;padding:0;"><div class="hfx-reveal-base" style="' + grad + 'background:linear-gradient(135deg,#334155,#0f172a);">Before</div><div class="hfx-reveal-top" style="' + grad + 'background:linear-gradient(135deg,#8b5cf6,#ec4899);">After ✦</div></div>' +
        '</div>' +
        '<div style="margin-top:0.6rem;font-size:0.68rem;color:rgba(255,255,255,0.4);text-align:center;">✦ = cursor-tracked — move the mouse across the card</div>' +
      '</div>');
    setTimeout(function () { if (window.HoverFX) window.HoverFX.init(target.querySelectorAll('[data-hover-fx]')); }, 30);
  };

  // ===== Transitions Pro — overlay cover→swap→reveal, 6 effects =====
  P['transitions/transitions-pro.css'] = function (target) {
    var effects = (window.TransitionsPro && window.TransitionsPro.effects) ||
      ['fade', 'circle', 'curtain', 'panels', 'diagonal', 'glitch', 'slide', 'zoom', 'stripes', 'rows', 'blocks'];
    var btns = effects.map(function (e) {
      return '<button class="txp-demo-btn" data-fx="' + e + '" style="cursor:pointer;border:1px solid rgba(255,255,255,0.18);' +
        'background:rgba(255,255,255,0.06);color:#fff;border-radius:999px;padding:0.3rem 0.7rem;font-size:0.72rem;">' + e + '</button>';
    }).join('');
    html(target,
      '<div style="width:100%;max-width:520px;display:flex;flex-direction:column;gap:0.7rem;">' +
        '<div id="txp-stage" style="position:relative;overflow:hidden;border-radius:12px;height:160px;border:1px solid rgba(255,255,255,0.08);">' +
          '<div id="txp-pageA" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:1.4rem;font-weight:800;color:#fff;background:linear-gradient(135deg,#1e1b4b,#4c1d95);">Page A</div>' +
          '<div id="txp-pageB" style="position:absolute;inset:0;display:none;align-items:center;justify-content:center;font-size:1.4rem;font-weight:800;color:#fff;background:linear-gradient(135deg,#0f766e,#155e75);">Page B</div>' +
        '</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:0.4rem;justify-content:center;">' + btns + '</div>' +
      '</div>');
    var stage = target.querySelector('#txp-stage');
    var a = target.querySelector('#txp-pageA'), b = target.querySelector('#txp-pageB');
    var showingA = true;
    target.querySelectorAll('.txp-demo-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!window.TransitionsPro) return;
        window.TransitionsPro.run(btn.getAttribute('data-fx'), {
          container: stage, scoped: true, duration: 550,
          onSwap: function () {
            showingA = !showingA;
            a.style.display = showingA ? 'flex' : 'none';
            b.style.display = showingA ? 'none' : 'flex';
          }
        });
      });
    });
  };

  // ===== Luxe Hover — 10 luxurious box/card hovers (CSS-only) =====
  P['effects/luxe-hover.css'] = function (target) {
    var box = 'background:#15151d;border:1px solid rgba(255,255,255,0.08);min-height:80px;display:flex;' +
      'align-items:center;justify-content:center;padding:0.9rem;color:#e9e7ef;font-size:0.82rem;font-weight:700;text-align:center;';
    var v = ['gold-foil', 'glass', 'emboss', 'breathe', 'shimmer', 'frame', 'rise', 'velvet', 'spotlight', 'tilt'];
    html(target,
      '<div style="width:100%;max-width:560px;display:grid;grid-template-columns:repeat(2,1fr);gap:0.75rem;">' +
        v.map(function (x) { return '<div class="lux lux-' + x + '" tabindex="0" style="' + box + '">' + x + '</div>'; }).join('') +
      '</div>');
  };

  // ===== Buttons FX — 12 creative button hovers (CSS-only) =====
  P['blocks/buttons-fx.css'] = function (target) {
    grid(target,
      '<div style="display:flex;flex-wrap:wrap;gap:0.7rem;justify-content:center;align-items:center;max-width:560px;">' +
        '<button class="bfx bfx-fill-up">Fill up</button>' +
        '<button class="bfx bfx-fill-diag">Diagonal</button>' +
        '<button class="bfx bfx-conic">Conic</button>' +
        '<button class="bfx bfx-arrow"><span>Continue</span></button>' +
        '<button class="bfx bfx-glitch">Glitch</button>' +
        '<button class="bfx bfx-gold">Gold</button>' +
        '<button class="bfx bfx-press">3D press</button>' +
        '<button class="bfx bfx-dot">Dot fill</button>' +
        '<button class="bfx bfx-draw">Border draw</button>' +
        '<button class="bfx bfx-shine">Shine</button>' +
        '<button class="bfx bfx-neon">Neon</button>' +
        '<button class="bfx bfx-swap" data-text="Let\'s go →">Hover me</button>' +
      '</div>');
  };

  // ===== Interactive Canvas — cursor-reactive backgrounds =====
  P['backgrounds/interactive-canvas.css'] = function (target) {
    var modes = ['network', 'field', 'spotlight', 'mesh', 'dot-grid', 'aurora', 'ripple', 'confetti'];
    var btns = modes.map(function (m) {
      return '<button data-m="' + m + '" style="cursor:pointer;border:1px solid rgba(255,255,255,0.18);background:rgba(255,255,255,0.06);color:#fff;border-radius:999px;padding:0.3rem 0.7rem;font-size:0.72rem;">' + m + '</button>';
    }).join('');
    html(target,
      '<div style="width:100%;max-width:560px;display:flex;flex-direction:column;gap:0.6rem;">' +
        '<div id="icv-stage" style="height:200px;border-radius:12px;border:1px solid rgba(255,255,255,0.08);"></div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:0.4rem;justify-content:center;">' + btns + '</div>' +
        '<div style="font-size:0.68rem;color:rgba(255,255,255,0.4);text-align:center;">move the cursor over the canvas · click for ripple</div>' +
      '</div>');
    var stage = target.querySelector('#icv-stage');
    var current = null;
    function set(mode) {
      if (current) current.forEach(function (i) { i.destroy(); });
      stage.className = '';
      stage.innerHTML = '';
      stage.setAttribute('data-canvas', mode);
      current = window.InteractiveCanvas ? window.InteractiveCanvas.init(stage, { mode: mode }) : null;
    }
    setTimeout(function () { set('network'); }, 30);
    target.querySelectorAll('[data-m]').forEach(function (b) { b.addEventListener('click', function () { set(b.getAttribute('data-m')); }); });
  };

  // ===== Card FX — holo / flip / bento / duotone / peek / zoom =====
  P['effects/card-fx.css'] = function (target) {
    var box = 'background:#15151d;border:1px solid rgba(255,255,255,0.08);min-height:96px;display:flex;align-items:center;justify-content:center;color:#e9e7ef;font-weight:700;font-size:0.8rem;text-align:center;';
    var img = 'background:linear-gradient(135deg,#8b5cf6,#ec4899);width:100%;height:96px;';
    html(target,
      '<div style="width:100%;max-width:560px;display:grid;grid-template-columns:repeat(3,1fr);gap:0.7rem;">' +
        '<div class="cfx cfx-holo" data-card-fx="holo" tabindex="0" style="' + box + '">Holo ✦</div>' +
        '<div class="cfx cfx-flip" tabindex="0" style="height:96px;"><div class="cfx-inner"><div class="cfx-front" style="' + box + '">Front</div><div class="cfx-back" style="' + box + 'background:linear-gradient(135deg,#0f766e,#155e75);">Back</div></div></div>' +
        '<div class="cfx cfx-bento" tabindex="0" style="' + box + 'flex-direction:column;gap:0.2rem;"><span>1</span><span>2</span><span>3</span></div>' +
        '<figure class="cfx cfx-duotone" tabindex="0" style="height:96px;margin:0;"><div class="cfx-img" style="' + img + '"></div></figure>' +
        '<div class="cfx cfx-peek" tabindex="0" style="' + box + 'background:linear-gradient(135deg,#8b5cf6,#ec4899);color:#fff;">Peek<div class="cfx-peek-body" style="background:rgba(0,0,0,0.65);color:#fff;padding:0.4rem;font-size:0.68rem;">revealed body</div></div>' +
        '<figure class="cfx cfx-zoom" tabindex="0" style="height:96px;margin:0;"><div class="cfx-img" style="' + img + '"></div></figure>' +
      '</div>');
    setTimeout(function () { if (window.CardFX) window.CardFX.init(target.querySelectorAll('[data-card-fx]')); }, 30);
  };

  // ===== Buttons FX 2 — icon-rail / fab / elastic / spread / stripe / corner / burst =====
  P['blocks/buttons-fx2.css'] = function (target) {
    grid(target,
      '<div style="display:flex;flex-wrap:wrap;gap:0.7rem;justify-content:center;align-items:center;max-width:560px;">' +
        '<button class="bf2 bf2-icon-rail">Download</button>' +
        '<button class="bf2 bf2-fab">★<span class="bf2-label">Favorite</span></button>' +
        '<button class="bf2 bf2-elastic">Elastic</button>' +
        '<button class="bf2 bf2-spread">Spread</button>' +
        '<button class="bf2 bf2-stripe">Stripe</button>' +
        '<button class="bf2 bf2-corner">Corner</button>' +
        '<button class="bf2 bf2-burst" data-button-fx="burst">Celebrate 🎉</button>' +
      '</div>');
    setTimeout(function () { if (window.ButtonFX) window.ButtonFX.init(target.querySelectorAll('[data-button-fx]')); }, 30);
  };

  // ===== Canvas FX — matrix code rain + gooey metaballs =====
  P['backgrounds/canvas-fx.css'] = function (target) {
    var modes = ['matrix', 'metaballs'];
    var btns = modes.map(function (m) {
      return '<button data-cm="' + m + '" style="cursor:pointer;border:1px solid rgba(255,255,255,0.18);background:rgba(255,255,255,0.06);color:#fff;border-radius:999px;padding:0.3rem 0.8rem;font-size:0.72rem;">' + m + '</button>';
    }).join('');
    html(target,
      '<div style="width:100%;max-width:560px;display:flex;flex-direction:column;gap:0.6rem;">' +
        '<div id="cvfx-stage" style="height:210px;border-radius:12px;border:1px solid rgba(255,255,255,0.08);"></div>' +
        '<div style="display:flex;gap:0.4rem;justify-content:center;">' + btns + '</div>' +
        '<div style="font-size:0.68rem;color:rgba(255,255,255,0.4);text-align:center;">metaballs follows the cursor</div>' +
      '</div>');
    var stage = target.querySelector('#cvfx-stage');
    var current = null;
    function set(mode) {
      if (current) current.forEach(function (i) { i.destroy(); });
      stage.className = ''; stage.innerHTML = ''; stage.setAttribute('data-canvas-fx', mode);
      current = window.CanvasFX ? window.CanvasFX.init(stage, { mode: mode }) : null;
    }
    setTimeout(function () { set('matrix'); }, 30);
    target.querySelectorAll('[data-cm]').forEach(function (b) { b.addEventListener('click', function () { set(b.getAttribute('data-cm')); }); });
  };

  // ===== Buttons FX 3 — metal / wave / shutter / glow-trail / hold-to-confirm =====
  P['blocks/buttons-fx3.css'] = function (target) {
    grid(target,
      '<div style="display:flex;flex-wrap:wrap;gap:0.7rem;justify-content:center;align-items:center;max-width:560px;">' +
        '<button class="bf3 bf3-metal">Liquid metal</button>' +
        '<button class="bf3 bf3-wave"><span class="bf3-bars"><i></i><i></i><i></i><i></i></span>Playing</button>' +
        '<button class="bf3 bf3-shutter">Shutter</button>' +
        '<button class="bf3 bf3-glow-trail">Glow trail</button>' +
        '<button class="bf3 bf3-hold" data-hold>Hold to confirm</button>' +
      '</div>');
    setTimeout(function () { if (window.HoldConfirm) window.HoldConfirm.init(target.querySelectorAll('[data-hold]'), { duration: 900 }); }, 30);
  };

  // ===== Checkboxes (uiverse) =====
  P['blocks/checkboxes-uiverse.css'] = function (target) {
    var v = ['draw', 'fill', 'bounce', 'flip', 'glow', 'ripple', 'heart'];
    grid(target, '<div style="display:flex;flex-wrap:wrap;gap:1rem 1.5rem;justify-content:center;max-width:540px;color:#e9e7ef;font-size:0.85rem;">' +
      v.map(function (x, i) { return '<label class="cbu cbu-' + x + '"><input type="checkbox" class="cbu-input"' + (i % 2 ? ' checked' : '') + '><span class="cbu-box"></span><span class="cbu-label">' + x + '</span></label>'; }).join('') +
      '</div>');
  };

  // ===== Toggles (uiverse) =====
  P['blocks/toggles-uiverse.css'] = function (target) {
    var v = ['ios', 'gradient', 'daynight', 'neumorph', 'power', 'emoji', 'square'];
    grid(target, '<div style="display:flex;flex-wrap:wrap;gap:1.1rem 1.4rem;justify-content:center;align-items:center;max-width:540px;">' +
      v.map(function (x, i) { return '<label class="tgu tgu-' + x + '" title="' + x + '"><input type="checkbox" class="tgu-input"' + (i % 2 ? ' checked' : '') + '><span class="tgu-track"><span class="tgu-thumb"></span></span></label>'; }).join('') +
      '</div>');
  };

  // ===== Social icons (uiverse) =====
  P['blocks/social-icons.css'] = function (target) {
    var combos = [['fill', 'twitter', '🐦'], ['3d', 'github', '★'], ['bounce', 'youtube', '▶'], ['ring', 'discord', '✦'], ['tooltip', 'linkedin', 'in'], ['slide', 'instagram', '◎']];
    html(target, '<div style="display:flex;flex-wrap:wrap;gap:0.9rem;justify-content:center;align-items:center;max-width:540px;padding:1.6rem 0;">' +
      combos.map(function (c) { return '<a class="soc soc-' + c[0] + ' soc-' + c[1] + '" data-tip="' + c[1] + '">' + c[2] + '</a>'; }).join('') +
      '</div>');
  };

  // ===== Tooltips (fancy / directional) =====
  P['blocks/tooltips-fancy.css'] = function (target) {
    function chip(cls, tip, label) { return '<span class="ttu ' + cls + '" data-tip="' + tip + '" tabindex="0" style="padding:0.5rem 0.9rem;border-radius:9px;background:#16161f;border:1px solid rgba(255,255,255,0.1);color:#e9e7ef;font-size:0.82rem;cursor:default;">' + label + '</span>'; }
    html(target, '<div style="display:flex;flex-wrap:wrap;gap:1.3rem;justify-content:center;align-items:center;max-width:540px;padding:2.2rem 0;">' +
      chip('ttu-top', 'Top tooltip', 'Top') +
      chip('ttu-bottom', 'Bottom tooltip', 'Bottom') +
      chip('ttu-left', 'Left tooltip', 'Left') +
      chip('ttu-right', 'Right tooltip', 'Right') +
      chip('ttu-top ttu-neon', 'Neon glow', 'Neon') +
      chip('ttu-top ttu-gradient', 'Gradient', 'Gradient') +
      '</div><div style="font-size:0.68rem;color:rgba(255,255,255,0.4);text-align:center;">hover or focus each chip</div>');
  };

  // ===== Radios (uiverse) =====
  P['blocks/radios-uiverse.css'] = function (target) {
    grid(target, '<div style="display:flex;flex-direction:column;gap:0.9rem;max-width:440px;color:#e9e7ef;font-size:0.85rem;">' +
      '<div style="display:flex;gap:1.3rem;flex-wrap:wrap;">' +
        ['grow', 'fill', 'square', 'glow'].map(function (x, i) { return '<label class="rdu rdu-' + x + '"><input type="radio" name="rdua" class="rdu-input"' + (i === 0 ? ' checked' : '') + '><span class="rdu-dot"></span><span class="rdu-label">' + x + '</span></label>'; }).join('') +
      '</div>' +
      '<div style="display:flex;gap:0.7rem;flex-wrap:wrap;">' +
        ['Starter', 'Pro', 'Team'].map(function (x, i) { return '<label class="rdu rdu-card"><input type="radio" name="rdub" class="rdu-input"' + (i === 1 ? ' checked' : '') + '><span class="rdu-dot"></span><span class="rdu-label">' + x + '</span></label>'; }).join('') +
      '</div>' +
      '</div>');
  };

  // ===== CSS 3D — cube / flip-box / stack / coverflow =====
  P['components/css-3d.css'] = function (target) {
    var faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
    html(target,
      '<div style="display:flex;flex-wrap:wrap;gap:1.8rem;justify-content:center;align-items:center;padding:1.2rem 0;max-width:560px;">' +
        '<div class="c3d c3d-cube" style="--c3d-size:88px;"><div class="c3d-cube-inner">' +
          faces.map(function (f, i) { return '<span class="c3d-face c3d-' + f + '">' + (i + 1) + '</span>'; }).join('') + '</div></div>' +
        '<div class="c3d c3d-flip-box" tabindex="0" style="--c3d-size:88px;"><div class="c3d-fb-inner"><div class="c3d-fb-front">Hover</div><div class="c3d-fb-back" style="background:linear-gradient(135deg,#0f766e,#155e75);">Back</div></div></div>' +
        '<div class="c3d c3d-stack" tabindex="0" style="--c3d-size:88px;"><div class="c3d-stack-item"></div><div class="c3d-stack-item"></div><div class="c3d-stack-item"></div></div>' +
      '</div>' +
      '<div class="c3d c3d-coverflow" data-c3d="coverflow" style="max-width:540px;">' +
        [1, 2, 3, 4, 5, 6, 7].map(function (n) { return '<div class="c3d-cf-item">' + n + '</div>'; }).join('') + '</div>');
    setTimeout(function () { if (window.CSS3D) window.CSS3D.init(target.querySelectorAll('[data-c3d]')); }, 50);
  };

  // ===== Loaders Mega =====
  P['blocks/loaders-mega.css'] = function (target) {
    var solo = ['pacman', 'hourglass', 'coin', 'clock', 'jelly', 'bounce', 'square', 'typing', 'pulse', 'wifi', 'propeller'];
    var kids = { bars: 5, newton: 5 };
    function cell(x, inner) { return '<div style="display:flex;flex-direction:column;align-items:center;gap:0.4rem;"><div class="ldm ldm-' + x + '">' + (inner || '') + '</div><span style="font-size:0.64rem;color:rgba(255,255,255,0.4);">' + x + '</span></div>'; }
    var cells = solo.map(function (x) { return cell(x); });
    Object.keys(kids).forEach(function (x) { var inner = ''; for (var i = 0; i < kids[x]; i++) inner += '<i></i>'; cells.push(cell(x, inner)); });
    grid(target, '<div style="display:flex;flex-wrap:wrap;gap:1.5rem;justify-content:center;align-items:center;padding:1rem;max-width:560px;">' + cells.join('') + '</div>');
  };

  // ===== Patterns Mega =====
  P['backgrounds/patterns-mega.css'] = function (target) {
    var v = ['dots', 'grid', 'lines', 'vlines', 'diagonal', 'plaid', 'checker', 'zigzag', 'rings', 'polka', 'isometric', 'cross', 'carbon', 'starburst', 'brick', 'triangles'];
    grid(target, '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0.5rem;max-width:540px;">' +
      v.map(function (x) { return '<div class="pat pat-' + x + '" style="--pat-bg:#13131a;height:70px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);position:relative;"><span style="position:absolute;bottom:3px;left:5px;font-size:0.6rem;color:rgba(255,255,255,0.55);">' + x + '</span></div>'; }).join('') + '</div>');
  };

  // ===== Login Form =====
  P['components/login-form.css'] = function (target) {
    grid(target, '<form class="lf" onsubmit="return false" style="margin:0 auto;">' +
      '<label class="lf-label">Email</label>' +
      '<div class="lf-input"><span class="lf-ico">✉</span><input type="email" placeholder="Enter your email"></div>' +
      '<label class="lf-label">Password</label>' +
      '<div class="lf-input"><span class="lf-ico">🔒</span><input type="password" placeholder="Enter your password"><span class="lf-ico lf-eye">👁</span></div>' +
      '<div class="lf-row"><label class="lf-remember"><input type="checkbox"> Remember me</label><a class="lf-link">Forgot password?</a></div>' +
      '<button class="lf-submit">Sign In</button>' +
      '<p class="lf-alt">Don\'t have an account? <a class="lf-link">Sign Up</a></p>' +
      '<p class="lf-or">Or With</p>' +
      '<div class="lf-row lf-oauth"><button class="lf-prov">G&nbsp;Google</button><button class="lf-prov">Apple</button></div>' +
      '</form>');
  };

  // ===== Glow Search =====
  P['components/glow-search.css'] = function (target) {
    html(target, '<div style="padding:2.2rem 0;display:flex;justify-content:center;"><div class="gsb"><span class="gsb-icon">⌕</span><input class="gsb-input" type="text" placeholder="Search..."><button class="gsb-filter" aria-label="Filter">⛯</button></div></div>');
  };

  // ===== Buttons Sleek =====
  P['blocks/buttons-sleek.css'] = function (target) {
    grid(target, '<div style="display:flex;flex-wrap:wrap;gap:0.7rem;justify-content:center;align-items:center;max-width:540px;">' +
      '<button class="slk slk-ghost">Ghost</button>' +
      '<button class="slk slk-soft">Soft</button>' +
      '<a class="slk slk-line" tabindex="0">Read more</a>' +
      '<button class="slk slk-kbd">Command <kbd>⌘K</kbd></button>' +
      '<button class="slk slk-dot">Status</button>' +
      '<button class="slk slk-icon">Continue <span class="slk-chev">›</span></button>' +
      '<button class="slk slk-quiet">Quiet</button>' +
      '<button class="slk slk-outline">Outline</button>' +
      '</div>');
  };

  // ===== Theme Switch =====
  P['components/theme-switch.css'] = function (target) {
    html(target, '<div style="display:flex;flex-direction:column;align-items:center;gap:0.9rem;padding:1.5rem;">' +
      '<div style="display:flex;gap:1.2rem;align-items:center;"><button class="thsw"><span class="thsw-orb"></span></button><button class="thsw is-dark"><span class="thsw-orb"></span></button></div>' +
      '<div style="font-size:0.68rem;color:rgba(255,255,255,0.4);">click the left one — it toggles + persists</div>' +
      '</div>');
    setTimeout(function () { var b = target.querySelector('.thsw'); if (window.ThemeSwitch && b) window.ThemeSwitch.init(b, { target: target, storageKey: 'fm-theme-demo' }); }, 30);
  };

  // ===== Profile Card =====
  P['components/profile-card.css'] = function (target) {
    var av = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='76' height='76'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%238b5cf6'/><stop offset='1' stop-color='%23ec4899'/></linearGradient></defs><rect width='76' height='76' fill='url(%23g)'/></svg>";
    grid(target, '<article class="pfc" style="margin:0 auto;">' +
      '<div class="pfc-cover"></div>' +
      '<img class="pfc-avatar" src="' + av + '" alt="">' +
      '<div class="pfc-body">' +
        '<h3 class="pfc-name">Ada Lovelace</h3>' +
        '<p class="pfc-role">Product Designer</p>' +
        '<p class="pfc-bio">Designing calm, useful interfaces.</p>' +
        '<div class="pfc-stats"><div class="pfc-stat"><span class="pfc-num">128</span><span class="pfc-label">Posts</span></div><div class="pfc-stat"><span class="pfc-num">8.4k</span><span class="pfc-label">Followers</span></div><div class="pfc-stat"><span class="pfc-num">312</span><span class="pfc-label">Following</span></div></div>' +
        '<div class="pfc-actions"><button class="pfc-btn pfc-btn-primary">Follow</button><button class="pfc-btn pfc-btn-ghost">Message</button></div>' +
      '</div>' +
      '</article>');
  };

  // ===== TASTE · Aesthetic master profiles =====
  // Self-contained: each card sets data-aesthetic and reads the taste vars inline
  // (structure.css is NOT loaded in the demo, so we don't rely on .struct).
  P['taste/aesthetic.css'] = function (target) {
    var profiles = [
      ['minimal', 'Minimal', 'Quiet, airy, restrained.'],
      ['editorial', 'Editorial', 'Serif voice, generous rhythm.'],
      ['energetic', 'Energetic', 'Loud accent, fast snap.'],
      ['luxury', 'Luxury', 'High-contrast, slow glide.'],
      ['playful', 'Playful', 'Rounded, bouncy, friendly.'],
      ['technical', 'Technical', 'Mono, compact, crisp.'],
    ];
    var cards = profiles.map(function (p) {
      return '<div class="taes-card" data-aesthetic="' + p[0] + '" style="' +
        'background:#15151f;border:1px solid rgba(255,255,255,0.09);color:#f2f3f7;' +
        'border-radius:var(--radius);box-shadow:var(--ts-elevation);padding:1.1rem 1.15rem;' +
        'transition:transform var(--m-dur) var(--m-ease),box-shadow var(--m-dur) var(--m-ease);">' +
        '<div style="font-size:0.62rem;letter-spacing:0.14em;text-transform:uppercase;color:#7c5cff;font-family:var(--font-body);">' + p[0] + '</div>' +
        '<div style="font-family:var(--font-head);font-size:1.55rem;line-height:1.1;margin:0.25rem 0 0.35rem;font-weight:700;">' + p[1] + '</div>' +
        '<div style="font-family:var(--font-body);font-size:0.82rem;color:rgba(242,243,247,0.66);line-height:1.45;">' + p[2] + '</div>' +
        '<button class="taes-btn" style="margin-top:0.85rem;font-family:var(--font-body);font-size:0.78rem;color:#fff;' +
          'background:#7c5cff;border:0;border-radius:var(--radius-sm);padding:0.5rem 0.9rem;cursor:pointer;' +
          'transition:transform var(--m-dur-fast) var(--m-ease);">Action ›</button>' +
        '</div>';
    }).join('');
    html(target,
      '<style>' +
        '.taes-grid .taes-card:hover{transform:translateY(var(--ts-hover-lift));}' +
        '.taes-grid .taes-btn:hover{transform:translateY(-1px) scale(1.02);}' +
      '</style>' +
      '<div class="taes-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:1rem;width:100%;max-width:760px;margin:0 auto;">' +
        cards +
      '</div>' +
      '<div style="text-align:center;font-size:0.68rem;color:rgba(255,255,255,0.4);margin-top:1rem;">one attribute — <code>data-aesthetic</code> — sets font + motion + spacing + elevation. hover a card.</div>');
  };

  // ===== TASTE · Density rhythm =====
  P['taste/density.css'] = function (target) {
    function block(d) {
      return '<div data-density="' + d + '" style="flex:1;min-width:150px;">' +
        '<div style="font-size:0.62rem;letter-spacing:0.12em;text-transform:uppercase;color:#7c5cff;margin-bottom:0.5rem;">' + d + '</div>' +
        '<div style="display:flex;flex-direction:column;gap:var(--gap);background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:var(--radius);padding:var(--gutter);">' +
          '<div style="background:#7c5cff;border-radius:var(--radius-sm);height:34px;"></div>' +
          '<div style="background:rgba(255,255,255,0.13);border-radius:var(--radius-sm);height:34px;"></div>' +
          '<div style="background:rgba(255,255,255,0.13);border-radius:var(--radius-sm);height:34px;"></div>' +
        '</div></div>';
    }
    html(target,
      '<div style="display:flex;gap:1.4rem;align-items:flex-start;width:100%;max-width:680px;margin:0 auto;">' +
        block('compact') + block('normal') + block('airy') +
      '</div>' +
      '<div style="text-align:center;font-size:0.68rem;color:rgba(255,255,255,0.4);margin-top:1rem;"><code>data-density</code> retunes gap · gutter · radius together.</div>');
  };

  // ===== TASTE · Motion timing =====
  P['taste/motion.css'] = function (target) {
    function chip(m, label) {
      return '<div data-motion="' + m + '" style="text-align:center;">' +
        '<button class="tmot-btn" style="font:600 0.85rem/1 system-ui;color:#fff;background:#15151f;' +
          'border:1px solid rgba(255,255,255,0.12);border-radius:12px;padding:1rem 1.3rem;cursor:pointer;' +
          'transition:transform var(--m-dur) var(--m-ease),background var(--m-dur) var(--m-ease);">' + label + '</button>' +
        '<div style="font-size:0.64rem;color:rgba(255,255,255,0.5);margin-top:0.55rem;font-family:ui-monospace,monospace;">' +
          'dur var(--m-dur)<br>ease ' + m + '</div>' +
        '</div>';
    }
    html(target,
      '<style>' +
        '.tmot-row [data-motion] .tmot-btn:hover{transform:translateY(-6px) scale(1.04);background:#7c5cff;}' +
      '</style>' +
      '<div class="tmot-row" style="display:flex;gap:1.6rem;justify-content:center;align-items:flex-start;flex-wrap:wrap;">' +
        chip('minimal', 'Minimal') + chip('standard', 'Standard') + chip('playful', 'Playful') +
      '</div>' +
      '<div style="text-align:center;font-size:0.68rem;color:rgba(255,255,255,0.4);margin-top:1.1rem;">hover each — same gesture, different <code>data-motion</code> timing/easing.</div>');
  };

  // ===== TASTE · Motion profiles (JS) =====
  P['taste/motion-profiles.js'] = function (target) {
    html(target,
      '<div data-motion-demo style="width:100%;max-width:560px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:0.9rem;">' +
        '<div data-motion="minimal" data-slot="minimal"></div>' +
        '<div data-motion="standard" data-slot="standard"></div>' +
        '<div data-motion="playful" data-slot="playful"></div>' +
      '</div>' +
      '<div style="text-align:center;font-size:0.68rem;color:rgba(255,255,255,0.4);margin-top:1rem;"><code>MotionProfile.get(el)</code> resolves these from the nearest <code>[data-motion]</code>.</div>');
    setTimeout(function () {
      var MP = window.MotionProfile;
      target.querySelectorAll('[data-slot]').forEach(function (el) {
        var name = el.getAttribute('data-slot');
        var t = MP ? MP.get(el) : { durFast: '?', dur: '?', durSlow: '?', ease: '?', stagger: '?' };
        if (MP) MP.apply(el, name);
        el.style.cssText += ';background:#15151f;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:0.95rem 0.8rem;color:#f2f3f7;';
        el.innerHTML =
          '<div style="font:700 0.9rem/1 system-ui;color:#7c5cff;text-transform:capitalize;margin-bottom:0.55rem;">' + name + '</div>' +
          '<div style="font:0.66rem/1.7 ui-monospace,monospace;color:rgba(242,243,247,0.72);">' +
            'fast ' + t.durFast + '<br>dur ' + t.dur + '<br>slow ' + t.durSlow + '<br>stag ' + t.stagger + '</div>';
      });
    }, 40);
  };

  // ===== TASTE · Presets registry (JS) =====
  P['taste/presets.js'] = function (target) {
    html(target,
      '<div data-presets-grid style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:0.85rem;width:100%;max-width:760px;margin:0 auto;"></div>' +
      '<div style="text-align:center;font-size:0.68rem;color:rgba(255,255,255,0.4);margin-top:1rem;"><code>TastePresets.get(name)</code> → aesthetic · palette · font · motion · density · house pack.</div>');
    setTimeout(function () {
      var TP = window.TastePresets;
      var grid = target.querySelector('[data-presets-grid]');
      if (!TP || !grid) { if (grid) grid.innerHTML = '<div style="color:rgba(255,255,255,0.5);">TastePresets not loaded</div>'; return; }
      grid.innerHTML = TP.presets.map(function (p) {
        var chips = [p.aesthetic, p.palette, p.fontPair, p.motion + ' motion', p.density].map(function (c) {
          return '<span style="display:inline-block;font:0.6rem/1 ui-monospace,monospace;color:rgba(242,243,247,0.7);background:rgba(124,92,255,0.16);border:1px solid rgba(124,92,255,0.3);border-radius:6px;padding:0.25rem 0.4rem;margin:0.15rem 0.15rem 0 0;">' + c + '</span>';
        }).join('');
        return '<div style="background:#15151f;border:1px solid rgba(255,255,255,0.09);border-radius:14px;padding:0.95rem 1rem;text-align:left;">' +
          '<div style="font:700 0.95rem/1.15 system-ui;color:#f2f3f7;">' + p.label + '</div>' +
          '<div style="font:0.74rem/1.4 system-ui;color:rgba(242,243,247,0.6);margin:0.3rem 0 0.5rem;">' + p.summary + '</div>' +
          '<div>' + chips + '</div>' +
          '<div style="font:0.62rem/1.5 ui-monospace,monospace;color:rgba(242,243,247,0.45);margin-top:0.55rem;">house.button → ' + p.house.button + '</div>' +
          '</div>';
      }).join('');
    }, 40);
  };

  // ===== TASTE · Font pairings =====
  P['taste/fonts.css'] = function (target) {
    var pairs = ['system-clean', 'grotesk-tech', 'editorial-serif', 'luxury-serif', 'geometric-warm', 'mono-technical', 'display-bold', 'humanist-soft'];
    var specimens = pairs.map(function (p) {
      return '<div data-font-pair="' + p + '" style="background:#15151f;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:1rem 1.15rem;">' +
        '<div style="font-size:0.6rem;letter-spacing:0.13em;text-transform:uppercase;color:#7c5cff;font-family:ui-monospace,monospace;margin-bottom:0.4rem;">' + p + '</div>' +
        '<div style="font-family:var(--font-head);font-size:1.7rem;line-height:1.05;font-weight:700;color:#f2f3f7;">Aa Quietly bold</div>' +
        '<div style="font-family:var(--font-body);font-size:0.84rem;line-height:1.5;color:rgba(242,243,247,0.7);margin-top:0.4rem;">The body reads in a paired companion face.</div>' +
        '</div>';
    }).join('');
    grid(target,
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:0.9rem;width:100%;max-width:740px;margin:0 auto;">' +
        specimens +
      '</div>');
  };


  // ===== Phase wow-screens previews =====
  P['components/splash-intro.css'] = function (target) {
    html(target,
      '<div style="display:grid;gap:12px">' +
        '<div class="spl-demo-stage" style="position:relative;height:320px;border-radius:14px;overflow:hidden;background:linear-gradient(160deg,#12121c,#1a1430)">' +
          '<div style="position:absolute;inset:0;display:grid;place-content:center;gap:8px;text-align:center;color:#f5f6fa;padding:1rem">' +
            '<div style="font-size:1.5rem;font-weight:800;letter-spacing:-0.02em">The page underneath</div>' +
            '<div style="font-size:.85rem;color:rgba(245,246,250,.55)">unveiled once the splash completes</div>' +
          '</div>' +
        '</div>' +
        '<div class="spl-demo-btns" style="display:flex;gap:8px;flex-wrap:wrap"></div>' +
      '</div>');
    var stage = target.querySelector('.spl-demo-stage');
    var btns = target.querySelector('.spl-demo-btns');
    function play(unveil) {
      var old = stage.querySelector('.spl');
      if (old) old.remove();
      var spl = document.createElement('div');
      spl.className = 'spl';
      spl.style.position = 'absolute'; /* contain the fixed overlay inside the card */
      spl.innerHTML =
        '<div class="spl-logo spl-logo--letters">NOVA</div>' +
        '<div class="spl-bar"></div>' +
        '<div class="spl-status" data-spl-percent>0%</div>';
      stage.appendChild(spl);
      var inst = SplashIntro.init(spl, { minDuration: 1500, unveil: unveil });
      inst.auto();
      setTimeout(function () { inst.done(); }, 1300);
    }
    ['fade', 'curtain', 'iris', 'split'].forEach(function (u) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = u;
      b.style.cssText = 'padding:6px 14px;border-radius:999px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.05);color:inherit;font:inherit;font-size:.8rem;cursor:pointer';
      b.addEventListener('click', function () { play(u); });
      btns.appendChild(b);
    });
    setTimeout(function () { play('curtain'); }, 40);
  };

  P['feedback/celebration-screen.css'] = function (target) {
      html(target,
        '<div style="display:flex;flex-direction:column;align-items:center;gap:0.8rem;width:100%;">' +
          '<div style="position:relative;width:min(560px,100%);height:360px;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">' +
            '<div class="cel cel--burst cel--inline is-in" style="--cel-mark-size:72px;--cel-title-size:1.5rem;--cel-sub-size:0.8rem;--cel-rise:14px;padding:1.2rem;">' +
              '<div class="cel-rays"></div>' +
              '<div class="cel-stage" style="gap:0.4rem;width:min(330px,92%);">' +
                '<div class="cel-mark is-in"><svg viewBox="0 0 96 96" aria-hidden="true"><circle class="cel-mark-ring" cx="48" cy="48" r="44"></circle><path class="cel-mark-check" d="M30 50 L44 64 L68 36"></path></svg></div>' +
                '<h2 class="cel-title is-in">Payment successful</h2>' +
                '<p class="cel-sub is-in">Receipt sent to you@example.com</p>' +
                '<div class="cel-detail-card is-in" style="margin-top:0.4rem;">' +
                  '<div class="cel-row" style="padding:0.45rem 0;font-size:0.74rem;"><span class="cel-row-label">Plan</span><span class="cel-row-value">Pro · annual</span></div>' +
                  '<div class="cel-row" style="padding:0.45rem 0;font-size:0.74rem;"><span class="cel-row-label">Total</span><span class="cel-row-value">$144.00</span></div>' +
                '</div>' +
                '<div class="cel-actions is-in" style="margin-top:0.55rem;">' +
                  '<button class="cel-btn cel-btn--primary" type="button" style="padding:0.5rem 1.05rem;font-size:0.76rem;">Go to dashboard</button>' +
                  '<button class="cel-btn cel-btn--ghost" type="button" style="padding:0.5rem 1.05rem;font-size:0.76rem;">Invite team</button>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<button id="dapp-cel-launch" style="padding:0.7rem 1.5rem;background:linear-gradient(180deg,#3ee0a4,#34d399);border:0;border-radius:10px;color:#06281c;font-weight:700;font-size:0.92rem;cursor:pointer;box-shadow:0 10px 26px -10px rgba(52,211,153,0.65);">Launch full-screen takeover</button>' +
          '<div style="font-size:0.7rem;color:rgba(255,255,255,0.45);">Plays mark → title → receipt → actions with confetti · ESC or overlay click closes</div>' +
        '</div>');
      setTimeout(function () {
        var b = document.getElementById('dapp-cel-launch');
        if (!b || !window.CelebrationScreen) return;
        b.addEventListener('click', function () {
          window.CelebrationScreen.show({
            title: 'Order confirmed',
            subtitle: 'We emailed your receipt — it ships Friday.',
            detail: [['Order', '#FE-48211'], ['Items', '3'], ['Total', '$249.00']],
            actions: [{ label: 'Track package', primary: true }, { label: 'Keep browsing' }],
            variant: 'burst',
            confetti: true
          });
        });
      }, 40);
    };

  P['components/onboarding-flow.css'] = function (target) {
      var chip = function (label, icon) {
        return '<button type="button" data-obf-chip style="appearance:none;font:inherit;font-size:0.85rem;font-weight:600;color:#f4f4f8;background:rgba(255,255,255,0.05);border:1.5px solid rgba(255,255,255,0.1);border-radius:999px;padding:0.5rem 1rem;cursor:pointer;">' + icon + ' ' + label + '</button>';
      };
      html(target,
        '<div class="obf" data-finish-label="Open dashboard" style="min-height:440px;max-width:720px;margin:0 auto;border:1px solid rgba(255,255,255,0.08);border-radius:20px;">' +
          '<header class="obf-head">' +
            '<div class="obf-progress" aria-label="Onboarding progress"></div>' +
            '<button class="obf-skip" type="button">Skip</button>' +
          '</header>' +
          '<div class="obf-steps">' +
            '<section class="obf-step is-active">' +
              '<div class="obf-art">🛰️</div>' +
              '<h2 class="obf-title">Welcome to Orbit</h2>' +
              '<p class="obf-sub">Your team\'s mission control. Three quick steps and you\'re ready for launch.</p>' +
              '<div class="obf-body" style="display:flex;gap:0.5rem;justify-content:center;flex-wrap:wrap;">' +
                chip('Design', '🎨') + chip('Engineering', '⚙️') + chip('Product', '📐') +
              '</div>' +
            '</section>' +
            '<section class="obf-step">' +
              '<div class="obf-art">🪐</div>' +
              '<h2 class="obf-title">Name your workspace</h2>' +
              '<p class="obf-sub">This is the home for your projects — you can rename it anytime. Leave it empty to see async validation block Next.</p>' +
              '<div class="obf-body" style="max-width:340px;margin-inline:auto;">' +
                '<input data-obf-name placeholder="e.g. Apollo Labs" style="width:100%;box-sizing:border-box;padding:0.8rem 1rem;border-radius:12px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.04);color:#f4f4f8;font:inherit;font-size:0.92rem;">' +
              '</div>' +
            '</section>' +
            '<section class="obf-step">' +
              '<div class="obf-art">🚀</div>' +
              '<h2 class="obf-title">Invite your crew</h2>' +
              '<p class="obf-sub">Orbit is better together — teammates see every change live. Try ← → keys to navigate, then hit Finish.</p>' +
            '</section>' +
          '</div>' +
          '<footer class="obf-foot">' +
            '<button class="obf-back" type="button">Back</button>' +
            '<div class="obf-dots" aria-hidden="true"></div>' +
            '<button class="obf-next" type="button">Continue</button>' +
          '</footer>' +
        '</div>'
      );
      setTimeout(function () {
        if (!window.OnboardingFlow) return;
        var root = target.querySelector('.obf');
        Array.prototype.forEach.call(root.querySelectorAll('[data-obf-chip]'), function (c) {
          c.addEventListener('click', function () {
            var on = c.getAttribute('aria-pressed') === 'true';
            c.setAttribute('aria-pressed', String(!on));
            c.style.borderColor = on ? 'rgba(255,255,255,0.1)' : '#8b5cf6';
            c.style.background = on ? 'rgba(255,255,255,0.05)' : 'rgba(139,92,246,0.12)';
          });
        });
        window.OnboardingFlow.init(root, {
          validate: function (i, stepEl) {
            var inp = stepEl.querySelector('[data-obf-name]');
            if (inp && !inp.value.trim()) return 'Give your workspace a name to continue.';
            return true;
          },
          onSkip: function () {
            var sub = root.querySelector('.obf-step.is-active .obf-sub');
            if (sub) sub.textContent = 'onSkip(i) fired — wire it to dismiss or fast-forward the flow.';
          },
          onComplete: function () {
            root.querySelector('.obf-steps').innerHTML =
              '<section class="obf-step is-active is-enter-fwd">' +
                '<div class="obf-art">🎉</div>' +
                '<h2 class="obf-title">You\'re in!</h2>' +
                '<p class="obf-sub">onComplete() fired — hand off to your app here.</p>' +
              '</section>';
            root.querySelector('.obf-foot').style.visibility = 'hidden';
          }
        });
      }, 40);
    };

  P['components/email-receipt.css'] = function (target) {
      html(target,
        '<div style="display:flex;flex-wrap:wrap;gap:1.2rem;justify-content:center;align-items:flex-start;width:100%;padding:0.4rem 0;">' +
          // Light order-confirmation receipt
          '<div style="flex:1 1 300px;max-width:380px;min-width:280px;">' +
            '<div class="rcpt">' +
              '<div class="rcpt-head">' +
                '<div class="rcpt-brand"><span class="rcpt-logo"></span>Acme Supply Co.</div>' +
                '<h1 class="rcpt-title">Order confirmed</h1>' +
                '<p class="rcpt-meta">Order #10482 &middot; June 12, 2026</p>' +
              '</div>' +
              '<div class="rcpt-status rcpt-status--paid">Paid &mdash; $214.00 charged to Visa &middot;&middot;4242</div>' +
              '<table class="rcpt-items">' +
                '<thead><tr><th>Item</th><th class="rcpt-qty">Qty</th><th class="rcpt-amt">Price</th></tr></thead>' +
                '<tbody>' +
                  '<tr><td>Field Jacket<span class="rcpt-item-sub">Olive &middot; M</span></td><td class="rcpt-qty">1</td><td class="rcpt-amt">$148.00</td></tr>' +
                  '<tr><td>Merino Beanie<span class="rcpt-item-sub">Charcoal</span></td><td class="rcpt-qty">2</td><td class="rcpt-amt">$48.00</td></tr>' +
                '</tbody>' +
              '</table>' +
              '<table class="rcpt-totals"><tbody>' +
                '<tr><td>Subtotal</td><td class="rcpt-amt">$196.00</td></tr>' +
                '<tr><td>Shipping</td><td class="rcpt-amt">$8.00</td></tr>' +
                '<tr><td>Tax</td><td class="rcpt-amt">$10.00</td></tr>' +
                '<tr class="rcpt-grand"><td>Total</td><td class="rcpt-amt">$214.00</td></tr>' +
              '</tbody></table>' +
              '<div class="rcpt-card"><span class="rcpt-card-chip">VISA</span><span class="rcpt-card-digits">&bull;&bull;&bull;&bull; 4242</span><span class="rcpt-card-exp">exp 09/28</span></div>' +
              '<div class="rcpt-cta"><a class="rcpt-btn" href="#" onclick="return false">View your order</a>' +
              '<p class="rcpt-help">Questions? Just reply to this email.</p></div>' +
              '<div class="rcpt-foot">Acme Supply Co &middot; San Francisco, CA &middot; <a href="#" onclick="return false">Unsubscribe</a></div>' +
            '</div>' +
          '</div>' +
          // Dark invoice variant
          '<div style="flex:1 1 300px;max-width:380px;min-width:280px;">' +
            '<div class="rcpt rcpt--dark rcpt--invoice">' +
              '<div class="rcpt-head">' +
                '<div class="rcpt-brand"><span class="rcpt-logo"></span>Stellar Labs</div>' +
                '<h1 class="rcpt-title">Invoice</h1>' +
                '<p class="rcpt-meta">INV-0042 &middot; issued June 12, 2026</p>' +
              '</div>' +
              '<div class="rcpt-due">Payment due June 30, 2026 <span class="rcpt-due-amt">$1,240.00</span></div>' +
              '<div class="rcpt-invoice-meta">' +
                '<div class="rcpt-invoice-cell"><span class="rcpt-invoice-label">Invoice</span><b>INV-0042</b></div>' +
                '<div class="rcpt-invoice-cell"><span class="rcpt-invoice-label">Due date</span><b>Jun 30, 2026</b></div>' +
                '<div class="rcpt-invoice-cell"><span class="rcpt-invoice-label">Bill to</span><b>Northwind GmbH</b></div>' +
              '</div>' +
              '<table class="rcpt-items">' +
                '<thead><tr><th>Service</th><th class="rcpt-qty">Hrs</th><th class="rcpt-amt">Amount</th></tr></thead>' +
                '<tbody>' +
                  '<tr><td>Design retainer<span class="rcpt-item-sub">May 2026</span></td><td class="rcpt-qty">24</td><td class="rcpt-amt">$960.00</td></tr>' +
                  '<tr><td>Icon set<span class="rcpt-item-sub">48 glyphs</span></td><td class="rcpt-qty">&mdash;</td><td class="rcpt-amt">$280.00</td></tr>' +
                '</tbody>' +
              '</table>' +
              '<table class="rcpt-totals"><tbody>' +
                '<tr><td>Subtotal</td><td class="rcpt-amt">$1,240.00</td></tr>' +
                '<tr><td>Tax (reverse charge)</td><td class="rcpt-amt">$0.00</td></tr>' +
                '<tr class="rcpt-grand"><td>Amount due</td><td class="rcpt-amt">$1,240.00</td></tr>' +
              '</tbody></table>' +
              '<div class="rcpt-cta"><a class="rcpt-btn" href="#" onclick="return false">Pay invoice</a></div>' +
              '<div class="rcpt-foot">Stellar Labs Inc. &middot; <a href="#" onclick="return false">Billing portal</a></div>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    };


  // ===== Phase creative-assets previews =====
  P['svg/illustrations.js'] = function (target) {
    target.innerHTML =
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:0.7rem;max-width:760px;width:100%;">' +
        ['sleeping-child','crescent-moon','night-sky','meditating-figure','cat-sleeping','reading-lamp','plant-duo','calm-waves','mountain-dawn','hot-drink','paper-plane','abstract-arches'].map(function (n) {
          return '<div style="background:#14141e;border-radius:10px;padding:0.6rem;color:rgba(255,255,255,0.8);--ill-accent:#8b5cf6;">' +
            '<div data-ill="' + n + '"></div>' +
            '<div style="font-size:0.62rem;color:rgba(255,255,255,0.45);font-family:ui-monospace,monospace;text-align:center;margin-top:0.3rem;">' + n + '</div>' +
          '</div>';
        }).join('') +
      '</div>';
    setTimeout(function () {
      if (!window.Illustrations) return;
      target.querySelectorAll('[data-ill]').forEach(function (el) {
        Illustrations.mount(el, el.getAttribute('data-ill'), { title: el.getAttribute('data-ill') });
      });
    }, 40);
  };
  
  P['svg/illustrations.css'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-wrap:wrap;gap:0.8rem;align-items:flex-end;max-width:740px;">' +
        '<div data-illv="sleeping-child" data-cls="ill--framed" style="width:220px;color:rgba(255,255,255,0.8);--ill-accent:#fbbf24;--ill-bg:rgba(255,255,255,0.06);"></div>' +
        '<div data-illv="cat-sleeping" data-cls="ill--framed ill--float" style="width:220px;color:rgba(255,255,255,0.8);--ill-accent:#34d399;--ill-bg:rgba(255,255,255,0.06);cursor:pointer;"></div>' +
        '<div data-illv="hot-drink" data-cls="ill--sm" style="color:rgba(255,255,255,0.8);--ill-accent:#f472b6;"></div>' +
      '</div>' +
      '<div style="font-size:0.65rem;color:rgba(255,255,255,0.4);margin-top:0.5rem;">.ill--framed / .ill--framed.ill--float (hover) / .ill--sm</div>';
    setTimeout(function () {
      if (!window.Illustrations) return;
      target.querySelectorAll('[data-illv]').forEach(function (el) {
        var svg;
        Illustrations.mount(el, el.getAttribute('data-illv'), { title: el.getAttribute('data-illv') });
        svg = el.querySelector('svg');
        el.getAttribute('data-cls').split(' ').forEach(function (c) { svg.classList.add(c); });
      });
    }, 40);
  };

  P['typography/ascii-banner.js'] = function (target) {
      target.innerHTML =
        '<div style="display:flex;flex-direction:column;align-items:center;gap:1.1rem;overflow:auto;max-width:100%;">' +
          '<div id="ab-demo-hero" style="font-size:9px;background:linear-gradient(135deg,#8b5cf6,#ec4899,#06b6d4);-webkit-background-clip:text;background-clip:text;color:transparent;"></div>' +
          '<div id="ab-demo-404" style="font-size:9px;color:#6ee7b7;"></div>' +
          '<pre id="ab-demo-box" style="font-family:ui-monospace,monospace;line-height:1.25;letter-spacing:0;white-space:pre;margin:0;font-size:11px;color:rgba(255,255,255,0.65);"></pre>' +
        '</div>';
      setTimeout(function () {
        if (typeof AsciiBanner === 'undefined') return;
        AsciiBanner.mount('#ab-demo-hero', 'SOLACE');
        AsciiBanner.mount('#ab-demo-404', '404 - LOST!');
        var box = document.getElementById('ab-demo-box');
        if (box) box.textContent = AsciiBanner.box('frontendmaxxing v2 - zero deps', { pad: 2 });
      }, 40);
    };

  // ---- cool-design first batch (visu.haus-frontier primitives) ----
  P['shaders/gl-transition-runner.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;">' +
        '<div id="dapp-glt-host" style="width:100%;max-width:540px;height:320px;border-radius:10px;background:#000;overflow:hidden;"></div>' +
        '<div style="font-size:0.7rem;color:rgba(255,255,255,0.5);">GPU image-to-image transition (crosswarp) — looping A&#8596;B</div>' +
      '</div>';
    var host = target.querySelector('#dapp-glt-host');
    function tex(c1, c2, label) {
      var c = document.createElement('canvas'); c.width = c.height = 256;
      var g = c.getContext('2d');
      var grad = g.createLinearGradient(0, 0, 256, 256);
      grad.addColorStop(0, c1); grad.addColorStop(1, c2);
      g.fillStyle = grad; g.fillRect(0, 0, 256, 256);
      g.fillStyle = 'rgba(255,255,255,0.9)';
      g.font = 'bold 110px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(label, 128, 132);
      return c.toDataURL();
    }
    (function attempt(n) {
      if (window.GLTransition && window.ShaderRunner) {
        var t = window.GLTransition.create(host, {
          from: tex('#0ea5e9', '#1e1b4b', 'A'),
          to:   tex('#f59e0b', '#7c2d12', 'B'),
          name: 'crosswarp', duration: 1400, autoplay: true
        });
        if (t) { var fwd = true; setInterval(function () { fwd = !fwd; t.play(!fwd); }, 2200); }
        return;
      }
      if (n < 40) setTimeout(function () { attempt(n + 1); }, 80);
    })(0);
  };

  P['utils/live-controls.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;gap:1.2rem;align-items:flex-start;flex-wrap:wrap;padding:0.5rem;">' +
        '<div id="dapp-lc-panel"></div>' +
        '<div id="dapp-lc-swatch" style="width:140px;height:140px;border-radius:14px;background:hsl(200 80% 55%);"></div>' +
      '</div>';
    var panel = target.querySelector('#dapp-lc-panel');
    var swatch = target.querySelector('#dapp-lc-swatch');
    var state = { hue: 200, size: 140, round: 14 };
    function apply() {
      swatch.style.background = 'hsl(' + state.hue + ' 80% 55%)';
      swatch.style.width = state.size + 'px';
      swatch.style.height = state.size + 'px';
      swatch.style.borderRadius = state.round + 'px';
    }
    function go() {
      if (!window.LiveControls) { setTimeout(go, 80); return; }
      window.LiveControls.bind(panel, state, {
        hue:   { min: 0, max: 360, step: 1 },
        size:  { min: 80, max: 200, step: 1 },
        round: { min: 0, max: 70, step: 1 }
      }, { title: 'Live Controls', onChange: apply });
      apply();
    }
    if (window.Tweakpane) return go();
    var s = document.createElement('script');
    s.src = (window.LiveControls && window.LiveControls.cdn) || 'https://cdn.jsdelivr.net/npm/tweakpane@3.1.10/dist/tweakpane.min.js';
    s.onload = go; s.onerror = go;
    document.head.appendChild(s);
  };

  P['3d/model-viewer.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;">' +
        '<div id="dapp-mv-host" style="width:100%;max-width:540px;height:340px;border-radius:10px;background:#11131a;overflow:hidden;"></div>' +
        '<div style="font-size:0.7rem;color:rgba(255,255,255,0.5);">Declarative 3D — drag to orbit (Google &lt;model-viewer&gt;)</div>' +
      '</div>';
    var host = target.querySelector('#dapp-mv-host');
    (function attempt(n) {
      if (window.ModelViewer) {
        window.ModelViewer.init(host, {
          src: 'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/Duck/glTF-Binary/Duck.glb',
          alt: 'A rubber duck, lit and orbitable',
          autoRotate: true, cameraControls: true, shadow: 1, exposure: 1
        });
        return;
      }
      if (n < 40) setTimeout(function () { attempt(n + 1); }, 80);
    })(0);
  };

  // ---- cool-design rung 2 (webcam reactive · gyro tilt) ----
  P['interactions/vision-react.js'] = function (target) {
    target.innerHTML =
      '<div id="dapp-vr-stage" style="position:relative;width:100%;max-width:520px;height:300px;margin:0 auto;border-radius:14px;overflow:hidden;background:radial-gradient(120% 120% at 50% 0%, #15213c, #090d18);">' +
        '<div style="position:absolute;width:90px;height:90px;border-radius:50%;margin:-45px 0 0 -45px;left:calc(var(--vr-x,0.5)*100%);top:calc(var(--vr-y,0.5)*100%);background:radial-gradient(circle, rgba(56,189,248,0.9), rgba(99,102,241,0.1));box-shadow:0 0 60px rgba(56,189,248,0.6);"></div>' +
        '<div style="position:absolute;left:0;right:0;bottom:0;padding:0.8rem;text-align:center;">' +
          '<button id="dapp-vr-cam" style="font:600 0.8rem system-ui;padding:0.5rem 1rem;border-radius:999px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.08);color:#fff;cursor:pointer;">Enable camera (hand tracking)</button>' +
        '</div>' +
      '</div>' +
      '<div style="text-align:center;font-size:0.7rem;color:rgba(255,255,255,0.5);margin-top:0.5rem;">Pointer-driven now — click to opt into on-device webcam hand tracking</div>';
    if (!window.VisionReact) return;
    var vr = window.VisionReact.init(target.querySelector('#dapp-vr-stage'));
    var btn = target.querySelector('#dapp-vr-cam');
    if (btn) btn.addEventListener('click', function () { vr.enableCamera(); btn.textContent = 'Camera enabling…'; });
  };

  P['effects/device-tilt.js'] = function (target) {
    target.innerHTML =
      '<div id="dapp-dt-stage" style="position:relative;width:100%;max-width:520px;height:320px;margin:0 auto;border-radius:14px;overflow:hidden;background:radial-gradient(120% 100% at 30% 20%, #1b2440, #0a0e1c);perspective:800px;">' +
        '<div style="position:absolute;inset:0;transform:translate(calc(var(--tilt-x,0)*10px), calc(var(--tilt-y,0)*10px));background:radial-gradient(60% 60% at 70% 80%, rgba(99,102,241,0.35), transparent);"></div>' +
        '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;transform:translate(calc(var(--tilt-x,0)*26px), calc(var(--tilt-y,0)*26px));">' +
          '<div style="width:120px;height:120px;border-radius:24px;background:linear-gradient(135deg,#38bdf8,#6366f1);box-shadow:0 30px 60px rgba(56,189,248,0.4);"></div>' +
        '</div>' +
        '<div style="position:absolute;left:0;right:0;bottom:14px;text-align:center;transform:translate(calc(var(--tilt-x,0)*42px), calc(var(--tilt-y,0)*42px));font:700 1.1rem system-ui;color:#fff;letter-spacing:0.04em;">TILT ME</div>' +
      '</div>' +
      '<div style="text-align:center;font-size:0.7rem;color:rgba(255,255,255,0.5);margin-top:0.5rem;">Move your pointer (or tilt your phone) — layers parallax by depth</div>';
    if (window.DeviceTilt) window.DeviceTilt.init(target.querySelector('#dapp-dt-stage'), { max: 14 });
  };

  // ---- cool-design rung 3 (velocity-warped infinite WebGL drag gallery) ----
  P['media/webgl-drag-gallery.js'] = function (target) {
    target.innerHTML =
      '<div id="dapp-dg-stage" style="width:100%;height:360px;border-radius:14px;overflow:hidden;background:#0a0d18;cursor:grab;"></div>' +
      '<div style="text-align:center;font-size:0.7rem;color:rgba(255,255,255,0.5);margin-top:0.5rem;">Drag or scroll — images bow + RGB-split with velocity, wrapping infinitely</div>';
    function tile(i, c1, c2) {
      var c = document.createElement('canvas'); c.width = 600; c.height = 400;
      var g = c.getContext('2d');
      var grad = g.createLinearGradient(0, 0, 600, 400);
      grad.addColorStop(0, c1); grad.addColorStop(1, c2);
      g.fillStyle = grad; g.fillRect(0, 0, 600, 400);
      g.fillStyle = 'rgba(255,255,255,0.92)';
      g.font = 'bold 190px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(String(i + 1), 300, 212);
      return c.toDataURL();
    }
    var pal = [['#0ea5e9', '#1e1b4b'], ['#f59e0b', '#7c2d12'], ['#22d3ee', '#0f766e'], ['#a855f7', '#3b0764'], ['#ef4444', '#450a0a'], ['#34d399', '#064e3b']];
    var images = pal.map(function (p, i) { return tile(i, p[0], p[1]); });
    (function attempt(n) {
      if (window.DragGallery) { window.DragGallery.init(target.querySelector('#dapp-dg-stage'), { images: images, planeWidth: 7, planeHeight: 5, gap: 1.2 }); return; }
      if (n < 40) setTimeout(function () { attempt(n + 1); }, 80);
    })(0);
  };

  // ---- multi-pass GPU compute (FBO ping-pong → reaction-diffusion) ----
  P['shaders/pingpong.js'] = function (target) {
    target.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;">' +
        '<div id="dapp-pp-host" style="--accent:#22d3ee;width:100%;max-width:560px;height:320px;border-radius:10px;overflow:hidden;background:#0a0d18;"></div>' +
        '<div style="font-size:0.7rem;color:rgba(255,255,255,0.5);">Gray-Scott reaction-diffusion — multi-pass GPU compute (FBO ping-pong), themed from --accent</div>' +
      '</div>';
    var host = target.querySelector('#dapp-pp-host');
    (function attempt(n) {
      if (window.PingPong) { window.PingPong.init(host, { steps: 10, scale: 0.5 }); return; }
      if (n < 40) setTimeout(function () { attempt(n + 1); }, 80);
    })(0);
  };

  // ---- determinism substrate: seeded PRNG + simplex noise ----
  P['utils/noise.js'] = function (target) {
    var c = document.createElement('canvas'); c.width = 560; c.height = 320;
    c.style.cssText = 'width:100%;max-width:560px;border-radius:10px;background:#0a0d18;display:block;margin:0 auto;';
    target.appendChild(c);
    var note = document.createElement('div'); note.style.cssText = 'text-align:center;font-size:0.7rem;color:rgba(255,255,255,0.5);margin-top:0.5rem;';
    note.textContent = "Seeded simplex flow field — same seed → identical field (deterministic)"; target.appendChild(note);
    (function draw(n) {
      if (!window.Noise) { if (n < 40) setTimeout(function () { draw(n + 1); }, 80); return; }
      // self-contained seed (prng.js isn't loaded on the noise route) — inline mulberry32
      var seed = 20240601;
      var rand = function () { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; var t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
      var N = window.Noise.create(rand);
      var g = c.getContext('2d'); g.fillStyle = '#0a0d18'; g.fillRect(0, 0, 560, 320); g.lineCap = 'round';
      for (var y = 12; y < 320; y += 14) for (var x = 12; x < 560; x += 14) {
        var a = N.noise2D(x * 0.006, y * 0.006) * Math.PI * 2;
        var len = 6 + (N.noise2D(x * 0.02 + 99, y * 0.02) * 0.5 + 0.5) * 7;
        var hue = 185 + N.noise2D(x * 0.004, y * 0.004 + 50) * 55;
        g.strokeStyle = 'hsl(' + hue + ' 82% 62% / 0.85)'; g.lineWidth = 1.6;
        g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len); g.stroke();
      }
    })(0);
  };

  P['utils/prng.js'] = function (target) {
    var c = document.createElement('canvas'); c.width = 560; c.height = 280;
    c.style.cssText = 'width:100%;max-width:560px;border-radius:10px;background:#0a0d18;display:block;margin:0 auto;';
    target.appendChild(c);
    var note = document.createElement('div'); note.style.cssText = 'text-align:center;font-size:0.7rem;color:rgba(255,255,255,0.5);margin-top:0.5rem;';
    note.textContent = "Seeded scatter — PRNG.create('apex-7') → identical layout every run"; target.appendChild(note);
    (function draw(n) {
      if (!window.PRNG) { if (n < 40) setTimeout(function () { draw(n + 1); }, 80); return; }
      var R = window.PRNG.create('apex-7'); var g = c.getContext('2d'); g.fillStyle = '#0a0d18'; g.fillRect(0, 0, 560, 280);
      var pal = ['#22d3ee', '#6366f1', '#f59e0b', '#34d399', '#ec4899'];
      for (var i = 0; i < 150; i++) { g.fillStyle = R.pick(pal); g.globalAlpha = R.float(0.35, 0.9); g.beginPath(); g.arc(R.float(20, 540), R.float(20, 260), R.float(3, 16), 0, 7); g.fill(); }
      g.globalAlpha = 1;
    })(0);
  };

  // ---- OKLCH perceptually-even palette ramps ----
  P['utils/oklch-ramp.js'] = function (target) {
    (function go(n) {
      if (!window.OklchRamp) { if (n < 40) setTimeout(function () { go(n + 1); }, 80); return; }
      var c = document.createElement('canvas'); c.width = 620; c.height = 250;
      c.style.cssText = 'width:100%;max-width:620px;display:block;margin:0 auto;';
      target.appendChild(c);
      var g = c.getContext('2d');
      var rows = [['Indigo', 264], ['Emerald', 150], ['Rose', 12], ['Amber', 72], ['Cyan', 210]];
      var rowH = 48, padL = 92, swW = (620 - padL - 14) / 9;
      rows.forEach(function (pair, ri) {
        var y = ri * rowH + 8;
        g.fillStyle = 'rgba(255,255,255,0.78)'; g.font = '600 13px system-ui, sans-serif'; g.textBaseline = 'middle'; g.textAlign = 'left';
        g.fillText(pair[0], 12, y + 18);
        window.OklchRamp.ramp(pair[1], { steps: 9, chroma: 0.14 }).forEach(function (s, i) {
          g.fillStyle = s.hex; g.fillRect(padL + i * swW, y, Math.ceil(swW) - 1, 36);
        });
      });
      var note = document.createElement('div'); note.style.cssText = 'text-align:center;font-size:0.7rem;color:rgba(255,255,255,0.5);margin-top:0.5rem;';
      note.textContent = 'OKLCH ramps — lightness stepped uniformly (perceptually even), chroma boosted at the extremes'; target.appendChild(note);
    })(0);
  };

})();
