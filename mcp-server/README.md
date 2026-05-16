# frontendmaxxing-mcp

> An MCP server that gives Claude Desktop, Cursor, Claude Code, and other MCP-compatible AI agents instant access to the **481 snippets** in [frontendmaxxing](https://github.com/sirdath/frontendmaxxing).

When connected, your AI assistant gains 7 new tools for finding and using vanilla CSS+JS UI snippets — no cloning, no grepping, no copy-pasting paths. Ask for "a streaming chat component" or "a hero with aurora background" and the agent gets the source code back instantly.

## What it exposes

### Tools

| Tool | Description |
| --- | --- |
| `list_components(folder?, kind?, limit?)` | Browse the catalog. Filter by folder (`components`, `ai`, `effects`, etc.) or kind (`CSS` / `JS`). |
| `search_components(query, limit?)` | Keyword search across tags, descriptions, file names, synonyms. Returns ranked matches. |
| `recommend(description, limit?)` | Free-form "I need X" → top 5 matches with rationale and matched terms. |
| `get_source(path)` | Return the full source file. |
| `get_examples(path)` | Extract the **Usage** block from a file header — quick reference. |
| `list_categories()` | List all 22 folders with counts + descriptions. |
| `get_agents_doc()` | Read AGENTS.md — needed if the agent is **adding** new snippets following library conventions. |

### Resources

- `frontendmaxxing://index` — the full tagged inventory
- `frontendmaxxing://agents` — conventions doc
- `frontendmaxxing://gradients` — gradient subsystem skill ref

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
node server.js
# stdio messages on stdout, logs on stderr
# To test interactively, use the MCP Inspector:
npx @modelcontextprotocol/inspector node server.js
```

## How it works

On startup:
1. Resolves the library root (env var → parent dir → cwd)
2. Reads INDEX.md and parses 481 entries
3. Builds in-memory maps by path / folder / key
4. Connects via stdio transport

Search uses simple keyword tokenization with weighted scoring (file name match weighted higher than tag match weighted higher than description match). Good enough for an agent's first pass; the agent can refine.

## License

MIT — same as the parent project.
