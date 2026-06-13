# frontendmaxxing-mcp

> An MCP server (v2) that gives Claude Desktop, Cursor, Claude Code, and other MCP-compatible AI agents instant access to the **800+ snippets** in [frontendmaxxing](https://github.com/sirdath/frontendmaxxing).

When connected, your AI assistant gains 22 tools that make the **entire** vault queryable — no cloning, no grepping, no copy-pasting paths. Ask for "a streaming chat component" or "a hero with aurora background" and the agent gets the paste-ready code (CSS + JS companion + usage) back instantly. Or go bigger: `compose_page("saas", preset: "luxury-noir")` assembles a whole themed page scaffold with a real snippet picked per section.

**Everything is queryable:** snippets, skill decision-trees, reference guides, the bundled claude-skills packages (blender/web3d/webgpu), the 55 color palettes as structured token data, and the conventions — all through the MCP surface.

**v2 highlights**

- **BM25 search** with synonym expansion and typo/plural tolerance — search the *vibe*, not the exact tag.
- **Companion-aware bundling** — `get_snippet` returns the CSS+JS pair, the Usage block, variants, and the live-demo link as one unit.
- **Structured output** — discovery tools return typed `structuredContent` (not just prose), so agents consume results reliably.
- **Full doc catalog** — `list_docs`/`get_doc` cover every markdown in the repo (skills, guides, meta, packages); `list_palettes`/`get_palette` expose color themes as data.
- **`overview()`** — one call to orient: totals, folders, skills, palette groups.
- **Taste layer** — `compose_page` assembles a whole themed page from the vault; taste presets bind aesthetic + palette + type + motion + density; `coherence_check` scores output for AI-slop tells.
- **Read-only tool annotations** + a `scaffold-page` prompt + `doc/{name}`, `palette/{name}`, `source/{path}` resource templates.

## What it exposes

### Tools

**Orientation & search**

| Tool | Description |
| --- | --- |
| `overview()` | One-call orientation: totals, folders, skills, palette groups. **Structured.** |
| `list_categories()` | All folders with counts + descriptions. **Structured.** |
| `list_components(folder?, kind?, limit?)` | Browse the catalog, filter by folder/kind. **Structured.** |
| `search_components(query, limit?)` | BM25 search — synonym + fuzzy aware. **Structured (with scores).** |
| `recommend(description, limit?)` | "I need X" → ranked matches with rationale; flags companions. **Structured.** |

**Use a snippet**

| Tool | Description |
| --- | --- |
| `get_snippet(path)` | **The one to use.** Paste-ready bundle: file + CSS/JS companion + Usage + Variants + demo link. |
| `get_source(path)` | Full source of a single file. |
| `get_examples(path)` | Just the Usage + Variants blocks. |
| `get_related(path, limit?)` | Companion + tag-similar neighbours. **Structured.** |

**Docs, skills & palettes**

| Tool | Description |
| --- | --- |
| `list_docs(kind?)` | Every markdown doc — skills, guides, meta, claude-skills packages. **Structured.** |
| `get_doc(name)` | Any doc by name (flexible: `gradients`, `creative-arsenal`, `AGENTS`, `blender-shader-nodes`). |
| `list_skills()` / `get_skill(name)` | Domain skill decision-trees (gradients, color, gsap, structure, dataviz…). **Structured.** |
| `list_palettes(mode?, query?)` | The 55 color themes; filter by light/dark or industry. **Structured.** |
| `get_palette(name)` | A palette's full design tokens + ready-to-paste CSS. **Structured.** |
| `get_agents_doc()` | AGENTS.md — conventions for **adding** snippets. |

**Design systems** (DESIGN.md, both directions — the refero.design pattern)

| Tool | Description |
| --- | --- |
| `design_system(palette?)` | **Generate** a ready DESIGN.md (colors/type/spacing/motion + component→snippet map) from any of the 50 repo palettes. |
| `apply_design_md(design, genre?)` | **Consume** an external DESIGN.md (or any spec with hex colors) → matched palette + exact-hex override + section-by-section snippet build plan. **Structured.** |

**Taste & composition** (the cohesion layer — see `get_skill("taste")`)

| Tool | Description |
| --- | --- |
| `list_taste_presets(aesthetic?)` | The ~12 ready taste bundles (aesthetic + palette + font pair + motion + density + house packs). **Structured.** |
| `get_taste_preset(name)` | One preset resolved: palette tokens, house component map, avoid-list, paste-ready apply block. **Structured.** |
| `compose_page(genre, preset?, …, variety_seed?)` | **The headline tool.** Assemble a full renderable page scaffold for a genre with a coordinated taste and a real snippet picked per section slot; `variety_seed` rotates picks for diversity. **Structured.** |
| `coherence_check(html)` | Score HTML 0–100 for taste-cohesion and list the AI-slop tells to fix (hardcoded hex, unblessed durations, px radii, scale-hovers). **Structured.** |

### Resources

- `frontendmaxxing://index` — the full tagged inventory
- `frontendmaxxing://agents` — conventions doc
- `frontendmaxxing://doc/{name}` — any markdown doc (templated; `list` enumerates all ~67)
- `frontendmaxxing://palette/{name}` — a palette's tokens as JSON (templated; `list` enumerates all 55)
- `frontendmaxxing://source/{path}` — raw source of any snippet by path (templated)

### Prompts

- `scaffold-page(genre)` — plans a full page for a site genre using the structure skill, a palette, and concrete vault snippets.

## Install

### Option A — `npx` (once published to npm)

In your MCP client config (e.g. Claude Desktop's `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "frontendmaxxing": {
      "command": "npx",
      "args": ["-y", "frontendmaxxing-mcp"]
    }
  }
}
```

### Option B — clone & run locally

```bash
git clone https://github.com/sirdath/frontendmaxxing.git
cd frontendmaxxing/mcp-server
npm install
```

Then point your client at the local script:

```json
{
  "mcpServers": {
    "frontendmaxxing": {
      "command": "node",
      "args": ["/absolute/path/to/frontendmaxxing/mcp-server/server.js"]
    }
  }
}
```

The server auto-detects the library at `../` from its own location. To override:

```json
{
  "mcpServers": {
    "frontendmaxxing": {
      "command": "node",
      "args": ["/path/to/server.js"],
      "env": {
        "FRONTENDMAXXING_PATH": "/absolute/path/to/frontendmaxxing"
      }
    }
  }
}
```

## Client configs

### Claude Desktop

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

Add the `frontendmaxxing` entry to `mcpServers` (see snippets above) and restart Claude Desktop.

### Cursor

In Cursor settings → MCP → add a new server using either config above.

### Claude Code (`~/.claude.json` or `.claude/settings.json`)

```json
{
  "mcpServers": {
    "frontendmaxxing": {
      "command": "node",
      "args": ["/absolute/path/to/frontendmaxxing/mcp-server/server.js"]
    }
  }
}
```

## Usage examples (what an agent does with it)

**Finding a component**

> User: "I need a chat message that streams token-by-token"
>
> Agent calls `search_components("streaming chat token-by-token markdown")` → gets back `ai/streaming-text.css` + `ai/streaming-text.js`
> Agent calls `get_source("ai/streaming-text.js")` → gets full implementation
> Agent uses it directly in user's project

**Browsing**

> User: "What do you have for hero backgrounds?"
>
> Agent calls `list_categories()` to see all folders → picks `backgrounds`
> Agent calls `list_components("backgrounds")` → returns 5 snippets
> Agent recommends `aurora-bg.css`, `mesh-bg-stripe.css`, or `gradient-orbs.css`

**Adding a new snippet (advanced)**

> User: "Add a new toast variant that slides from the top"
>
> Agent calls `get_agents_doc()` → reads conventions
> Agent calls `get_source("blocks/toasts.css")` → sees existing patterns
> Agent writes a new variant following the same conventions
> Agent (with file system access) updates INDEX.md with the new entry

## Local testing

```bash
cd mcp-server
npm install
npm test     # unit tests for the search/parse/relation helpers (node:test)
npm run smoke  # boots the server over stdio and exercises it as a real client
npm start    # run the server (stdio on stdout, logs on stderr)
# Or inspect interactively:
npx @modelcontextprotocol/inspector node server.js
```

## How it works

On startup:
1. Resolves the library root (env var → parent dir → cwd)
2. Parses INDEX.md (snippets), every markdown doc in the repo (skills/guides/meta/packages), and `colors/palettes.css` (55 themes)
3. Builds a BM25 search index + companion/relation maps + doc/palette registries
4. Connects via stdio transport

**Search** ranks with BM25 over weighted fields (file name > tags > global > folder > description), then layers on:
- **Synonym expansion** — a curated vibe-synonym map (e.g. `ticker`→`marquee`, `graph`→`chart`, `popup`→`modal`) so a search hits even when the exact tag isn't present.
- **Fuzzy matching** — plural/singular folding and edit-distance-1 / prefix completion against the vocabulary, so `buttn`→`button` and `gradien`→`gradient` still resolve.

Everything is zero-dependency and offline — no embeddings service required.

## License

MIT — same as the parent project.
