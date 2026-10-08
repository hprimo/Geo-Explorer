# 🌍 Geo-Explorer

> Explore learning tracks, tackle code challenges and earn fictional certificates — all from your terminal.

Geo-Explorer is a Node.js CLI project built with the support of **IBM Bob**. It covers three core commands and ships with an **MCP server** so that Bob (and any MCP-compatible client) can call its tools directly.

---

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [CLI Commands](#cli-commands)
  - [trilha](#trilha)
  - [desafio](#desafio)
  - [certificado](#certificado)
- [Available Tracks](#available-tracks)
- [Running Tests](#running-tests)
- [MCP Server](#mcp-server)
- [Project Structure](#project-structure)

---

## Requirements

- **Node.js** ≥ 18
- **npm** ≥ 9

---

## Installation

```bash
# from the Geo-Explorer directory
npm install
```

---

## CLI Commands

### `trilha`

Prints the study plan for a technology, optionally filtered by level.

```bash
node src/index.js trilha <tecnologia> [--level <level>]
```

**Examples:**

```bash
# Full plan for JavaScript
node src/index.js trilha javascript

# Only the intermediate level for Python
node src/index.js trilha python --level intermediario
```

---

### `desafio`

Generates a code challenge for a technology at the specified level.

```bash
node src/index.js desafio <tecnologia> --level <level>
```

**Examples:**

```bash
node src/index.js desafio react --level iniciante
node src/index.js desafio typescript --level avancado
```

---

### `certificado`

Creates a fictional completion certificate.

```bash
node src/index.js certificado <tecnologia> --name "<your name>" [--level <level>]
```

**Examples:**

```bash
node src/index.js certificado nodejs --name "Ada Lovelace" --level intermediario
node src/index.js certificado python --name "Alan Turing"
```

---

## Available Tracks

| ID           | Name       | Levels                                |
|--------------|------------|---------------------------------------|
| javascript   | JavaScript | iniciante · intermediario · avancado  |
| python       | Python     | iniciante · intermediario · avancado  |
| react        | React      | iniciante · intermediario · avancado  |
| nodejs       | Node.js    | iniciante · intermediario · avancado  |
| typescript   | TypeScript | iniciante · intermediario · avancado  |

Track data lives in [`data/trilhas.json`](data/trilhas.json). Add a new object to extend it.

---

## Running Tests

```bash
npm test
```

Tests are written with [Jest](https://jestjs.io/) and cover:

- Data utilities (`loadTrilhas`, `findTrilha`, `isValidLevel`)
- Track structure validation
- Challenge data completeness
- Certificate ID generation

---

## MCP Server

The `mcp-server/` directory contains a TypeScript MCP server that exposes four tools:

| Tool               | Description                                            |
|--------------------|--------------------------------------------------------|
| `listar_trilhas`   | List all available tracks                              |
| `obter_trilha`     | Get the study plan for a track (optional level filter) |
| `obter_desafio`    | Get a code challenge by technology and level           |
| `gerar_certificado`| Generate a fictional completion certificate            |

### Building the MCP server

```bash
cd mcp-server
npm install
npm run build
```

### Registering with IBM Bob (workspace scope)

Add the following to your workspace `mcp.json`:

```json
{
  "mcpServers": {
    "geo-explorer": {
      "command": "node",
      "args": ["/absolute/path/to/Geo-Explorer/mcp-server/build/index.js"]
    }
  }
}
```

After saving, Bob hot-reloads the server. You can then ask:

> "List all Geo-Explorer tracks."
> "Give me an advanced JavaScript challenge."
> "Generate a certificate for Ada Lovelace on the Python track."

---

## Project Structure

```
Geo-Explorer/
├── data/
│   └── trilhas.json          # Fictional track data
├── src/
│   ├── index.js              # CLI entry point (Commander)
│   ├── commands/
│   │   ├── trilha.js         # trilha command
│   │   ├── desafio.js        # desafio command
│   │   └── certificado.js    # certificado command
│   └── utils/
│       └── data.js           # Data loading helpers
├── tests/
│   ├── data.test.js
│   ├── trilha.test.js
│   ├── desafio.test.js
│   └── certificado.test.js
├── mcp-server/
│   ├── src/index.ts          # MCP server (TypeScript)
│   ├── package.json
│   └── tsconfig.json
├── docs/
│   └── mcp.md                # MCP server documentation
├── package.json
└── README.md
```

---

## License

MIT
