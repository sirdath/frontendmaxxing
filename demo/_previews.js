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

  P['3d/particles-galaxy.js'] = function (target) {
    var host = threeStage(target, { height: 320 });
    waitForThree(function () {
      if (window.ParticlesGalaxy) window.ParticlesGalaxy.init(host, { count: 8000 });
    });
  };

  P['3d/wave-plane.js'] = function (target) {
    var host = threeStage(target, { height: 300 });
    waitForThree(function () {
      if (window.WavePlane) window.WavePlane.init(host);
    });
  };

  P['3d/cube-morph.js'] = function (target) {
    var host = threeStage(target, { height: 300 });
    waitForThree(function () {
      if (window.CubeMorph) window.CubeMorph.init(host);
    });
  };

  P['3d/instanced-grid.js'] = function (target) {
    var host = threeStage(target, { height: 320 });
    waitForThree(function () {
      if (window.InstancedGrid) window.InstancedGrid.init(host);
    });
  };

  P['3d/floating-text.js'] = function (target) {
    var host = threeStage(target, { height: 300 });
    waitForThree(function () {
      if (window.FloatingText) window.FloatingText.init(host, { text: 'frontendmax' });
    });
  };

  P['3d/postprocessing-bloom.js'] = function (target) {
    var host = threeStage(target, { height: 320, note: 'EffectComposer + UnrealBloom — emissive orbs glow.' });
    waitForThree(function () {
      if (window.PostprocessingBloom) window.PostprocessingBloom.init(host);
    });
  };

  P['3d/raycast-hover.js'] = function (target) {
    var host = threeStage(target, { height: 300, note: 'Hover over the cubes — raycaster highlights the one under the cursor.' });
    waitForThree(function () {
      if (window.RaycastHover) window.RaycastHover.init(host);
    });
  };

  P['3d/scenes-pack.js'] = function (target) {
    var host = threeStage(target, { height: 340, note: 'Pack of 6 ready scenes — defaults to the first one.' });
    waitForThree(function () {
      if (window.ScenesPack) {
        var keys = window.ScenesPack.list && window.ScenesPack.list();
        var first = (keys && keys[0]) || 'crystals';
        window.ScenesPack.init(host, { scene: first });
      }
    });
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
    var attempt = function (n) {
      var Shader = window[globalName];
      if (window.ShaderRunner && Shader && Shader.fragment) {
        try {
          window.ShaderRunner.create(host, {
            fragmentShader: Shader.fragment,
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
  P['shaders/liquid-distortion.glsl.js'] = function (t) { shaderStage(t, 'LiquidDistortionShader', { note: 'Fluid-like UV distortion' }); };
  P['shaders/voronoi.glsl.js']           = function (t) { shaderStage(t, 'VoronoiShader',          { note: 'Worley/Voronoi cells' }); };
  P['shaders/kaleidoscope.glsl.js']      = function (t) { shaderStage(t, 'KaleidoscopeShader',     { note: 'Sector-folding kaleidoscope' }); };
  P['shaders/raymarch-sdf.glsl.js']      = function (t) { shaderStage(t, 'RaymarchSDFShader',      { note: 'SDF raymarched primitives' }); };
  P['shaders/godrays.glsl.js']           = function (t) { shaderStage(t, 'GodraysShader',          { note: 'Volumetric god rays' }); };
  P['shaders/plasma.glsl.js']            = function (t) { shaderStage(t, 'PlasmaShader',           { note: 'Classic demoscene plasma' }); };
  P['shaders/fluid.glsl.js']             = function (t) { shaderStage(t, 'FluidShader',            { note: 'Curl-noise fluid simulation' }); };
  P['shaders/sdf-text.glsl.js']          = function (t) { shaderStage(t, 'SDFTextShader',          { note: 'Signed-distance-field text + glow' }); };
  P['shaders/halftone.glsl.js']          = function (t) { shaderStage(t, 'HalftoneShader',         { note: 'Halftone dot pattern' }); };
  P['shaders/gradient-flow.glsl.js']     = function (t) { shaderStage(t, 'GradientFlowShader',     { note: 'Smooth gradient flow' }); };
  P['shaders/mesh-gradient-wgl.glsl.js'] = function (t) { shaderStage(t, 'MeshGradientWGLShader',  { note: 'Whatamesh-style WebGL mesh gradient' }); };

})();
