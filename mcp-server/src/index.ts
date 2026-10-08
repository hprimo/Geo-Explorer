#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

// ─── Data helpers ─────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, "../../data/trilhas.json");

interface Module {
  duration: string;
  modules: string[];
}

interface Track {
  id: string;
  name: string;
  description: string;
  levels: Record<string, Module>;
  challenges: Record<string, string>;
}

function loadTrilhas(): Track[] {
  const raw = readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw) as Track[];
}

function findTrilha(id: string): Track | undefined {
  return loadTrilhas().find((t) => t.id.toLowerCase() === id.toLowerCase());
}

const VALID_LEVELS = ["iniciante", "intermediario", "avancado"] as const;
type Level = (typeof VALID_LEVELS)[number];

function isValidLevel(level: string): level is Level {
  return (VALID_LEVELS as readonly string[]).includes(level.toLowerCase());
}

function generateCertId(name: string, track: string, level: string): string {
  const seed = `${name}-${track}-${level}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash * 31) + seed.charCodeAt(i)) >>> 0;
  }
  return `GEO-${hash.toString(16).toUpperCase().padStart(8, "0")}`;
}

// ─── MCP Server ───────────────────────────────────────────────────────────────

const server = new McpServer({ name: "geo-explorer", version: "1.0.0" });

// Tool: list all available tracks
server.registerTool(
  "listar_trilhas",
  {
    description: "List all available learning tracks in Geo-Explorer.",
    inputSchema: z.object({}),
  },
  async () => {
    const trilhas = loadTrilhas();
    const list = trilhas
      .map((t) => `• ${t.id.padEnd(14)} — ${t.name}: ${t.description}`)
      .join("\n");
    return { content: [{ type: "text", text: list }] };
  }
);

// Tool: get the study plan for a track
server.registerTool(
  "obter_trilha",
  {
    description: "Get the full study plan (modules per level) for a learning track.",
    inputSchema: z.object({
      tecnologia: z
        .string()
        .describe("Track id, e.g. javascript, python, react, nodejs, typescript"),
      level: z
        .string()
        .optional()
        .describe("Optional level filter: iniciante | intermediario | avancado"),
    }),
  },
  async ({ tecnologia, level }) => {
    const trilha = findTrilha(tecnologia);
    if (!trilha) {
      return {
        content: [{ type: "text", text: `Track not found: "${tecnologia}"` }],
        isError: true,
      };
    }

    const levelFilter = level ? level.toLowerCase() : null;
    if (levelFilter && !isValidLevel(levelFilter)) {
      return {
        content: [{ type: "text", text: `Invalid level: "${level}". Valid: ${VALID_LEVELS.join(", ")}` }],
        isError: true,
      };
    }

    const levelsToShow = levelFilter
      ? { [levelFilter]: trilha.levels[levelFilter] }
      : trilha.levels;

    let output = `# ${trilha.name} — Learning Track\n${trilha.description}\n\n`;
    for (const [lvl, data] of Object.entries(levelsToShow)) {
      output += `## ${lvl.charAt(0).toUpperCase() + lvl.slice(1)} (${data.duration})\n`;
      data.modules.forEach((m, i) => (output += `${i + 1}. ${m}\n`));
      output += "\n";
    }

    return { content: [{ type: "text", text: output }] };
  }
);

// Tool: get a code challenge
server.registerTool(
  "obter_desafio",
  {
    description: "Get a code challenge for a specific technology and level.",
    inputSchema: z.object({
      tecnologia: z
        .string()
        .describe("Track id, e.g. javascript, python, react, nodejs, typescript"),
      level: z
        .enum(["iniciante", "intermediario", "avancado"])
        .describe("Difficulty level"),
    }),
  },
  async ({ tecnologia, level }) => {
    const trilha = findTrilha(tecnologia);
    if (!trilha) {
      return {
        content: [{ type: "text", text: `Track not found: "${tecnologia}"` }],
        isError: true,
      };
    }

    const challenge = trilha.challenges[level];
    const output = `## ${trilha.name} — ${level.charAt(0).toUpperCase() + level.slice(1)} Challenge\n\n${challenge}`;
    return { content: [{ type: "text", text: output }] };
  }
);

// Tool: generate a fictional certificate
server.registerTool(
  "gerar_certificado",
  {
    description: "Generate a fictional completion certificate for a learning track.",
    inputSchema: z.object({
      tecnologia: z
        .string()
        .describe("Track id, e.g. javascript, python, react, nodejs, typescript"),
      name: z.string().describe("Full name of the certificate recipient"),
      level: z
        .enum(["iniciante", "intermediario", "avancado"])
        .optional()
        .default("avancado")
        .describe("Level completed (default: avancado)"),
    }),
  },
  async ({ tecnologia, name, level = "avancado" }) => {
    const trilha = findTrilha(tecnologia);
    if (!trilha) {
      return {
        content: [{ type: "text", text: `Track not found: "${tecnologia}"` }],
        isError: true,
      };
    }

    const certId = generateCertId(name, trilha.id, level);
    const issueDate = new Date().toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const output = [
      "═".repeat(58),
      "          🏆  GEO-EXPLORER CERTIFICATE  🏆",
      "═".repeat(58),
      "",
      "  This certifies that",
      `  ${name}`,
      "  has successfully completed the",
      `  ${trilha.name} — ${level.charAt(0).toUpperCase() + level.slice(1)} track`,
      "",
      `  Issued on ${issueDate}`,
      `  Certificate ID: ${certId}`,
      "",
      "═".repeat(58),
    ].join("\n");

    return { content: [{ type: "text", text: output }] };
  }
);

// ─── Start ────────────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("geo-explorer MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
