# Geo-Explorer MCP Server

The MCP (Model Context Protocol) server lets IBM Bob — or any MCP-compatible client — call Geo-Explorer's core features as tools, without using the CLI directly.

---

## Architecture

```
IBM Bob / MCP Client
        │
        │  stdio (JSON-RPC)
        ▼
geo-explorer MCP server  (mcp-server/build/index.js)
        │
        │  reads
        ▼
data/trilhas.json
```

The server is a **local stdio server** built with the [`@modelcontextprotocol/sdk`](https://github.com/modelcontextprotocol/typescript-sdk) and TypeScript.

---

## Tools

### `listar_trilhas`

**Description:** List all available learning tracks.

**Input:** *(none)*

**Example response:**
```
• javascript     — JavaScript: From browser scripting to full-stack development with Node.js.
• python         — Python: General-purpose language beloved for scripting, data science and AI.
• react          — React: Component-based UI library for building modern web interfaces.
• nodejs         — Node.js: Server-side JavaScript runtime built on Chrome's V8 engine.
• typescript     — TypeScript: Typed superset of JavaScript for large-scale application development.
```

---

### `obter_trilha`

**Description:** Get the study plan (modules per level) for a technology.

**Input:**

| Field       | Type   | Required | Description                                      |
|-------------|--------|----------|--------------------------------------------------|
| tecnologia  | string | ✅       | Track id: javascript, python, react, nodejs, typescript |
| level       | string | ❌       | Filter by level: iniciante, intermediario, avancado |

---

### `obter_desafio`

**Description:** Get a code challenge for a technology and level.

**Input:**

| Field       | Type                                      | Required | Description    |
|-------------|-------------------------------------------|----------|----------------|
| tecnologia  | string                                    | ✅       | Track id        |
| level       | iniciante \| intermediario \| avancado    | ✅       | Difficulty level |

---

### `gerar_certificado`

**Description:** Generate a fictional completion certificate.

**Input:**

| Field       | Type                                      | Required | Default    | Description                  |
|-------------|-------------------------------------------|----------|------------|------------------------------|
| tecnologia  | string                                    | ✅       | —          | Track id                      |
| name        | string                                    | ✅       | —          | Recipient's full name         |
| level       | iniciante \| intermediario \| avancado    | ❌       | avancado   | Level completed               |

---

## Building

```bash
cd mcp-server
npm install
npm run build
# output: mcp-server/build/index.js
```

---

## Registration (IBM Bob)

Create or edit `.bob/mcp.json` in your workspace:

```json
{
  "mcpServers": {
    "geo-explorer": {
      "command": "node",
      "args": ["C:/absolute/path/to/Geo-Explorer/mcp-server/build/index.js"]
    }
  }
}
```

Bob hot-reloads the server on file save. Confirm it appears as **Connected** in Bob's MCP panel.

---

## Example Bob interactions

| Ask Bob                                                                 | Tool called          |
|-------------------------------------------------------------------------|----------------------|
| "List all Geo-Explorer tracks"                                          | `listar_trilhas`     |
| "Show me the React study plan for beginners"                           | `obter_trilha`       |
| "Give me an advanced TypeScript challenge"                              | `obter_desafio`      |
| "Generate a certificate for Ada Lovelace on the Python advanced track" | `gerar_certificado`  |
