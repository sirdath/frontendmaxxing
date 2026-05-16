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

})();
