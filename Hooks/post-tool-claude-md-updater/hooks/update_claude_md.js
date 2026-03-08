import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Anthropic from "@anthropic-ai/sdk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const CLAUDE_MD_PATH = path.join(projectRoot, "CLAUDE.md");
const SECTION_HEADER = "## Recent Changes";

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString());
}

function truncate(str, max = 1500) {
  if (!str) return "";
  if (str.length <= max) return str;
  return str.slice(0, max) + "\n... [truncated]";
}

async function getSummary(toolName, toolInput) {
  const client = new Anthropic();

  let changeDescription;
  if (toolName === "Write") {
    changeDescription = `Tool: Write\nFile: ${toolInput.file_path}\nContent written:\n${truncate(toolInput.content)}`;
  } else {
    changeDescription = `Tool: Edit\nFile: ${toolInput.file_path}\nRemoved:\n${truncate(toolInput.old_string, 700)}\nAdded:\n${truncate(toolInput.new_string, 700)}`;
  }

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 80,
    messages: [
      {
        role: "user",
        content: `Summarize this file change in ONE sentence (max 15 words). Use an action verb. Be specific about what changed.\n\n${changeDescription}`,
      },
    ],
  });

  return response.content[0].text.trim().replace(/\.$/, "");
}

function updateClaudeMd(filePath, summary) {
  const date = new Date().toISOString().split("T")[0];
  // Normalize to forward slashes for cross-platform display
  const relPath = path
    .relative(projectRoot, filePath)
    .replace(/\\/g, "/") || filePath;
  const entry = `- **${date}** \`${relPath}\` — ${summary}`;

  let content = "";
  if (fs.existsSync(CLAUDE_MD_PATH)) {
    content = fs.readFileSync(CLAUDE_MD_PATH, "utf8");
  }

  const lines = content.split("\n");
  const sectionIdx = lines.findIndex((l) => l.trim() === SECTION_HEADER);

  if (sectionIdx === -1) {
    const prefix = content.trimEnd();
    const separator = prefix ? "\n\n" : "";
    fs.writeFileSync(
      CLAUDE_MD_PATH,
      `${prefix}${separator}${SECTION_HEADER}\n\n${entry}\n`,
      "utf8"
    );
  } else {
    // Insert right after the header so newest entries appear first
    lines.splice(sectionIdx + 1, 0, entry);
    fs.writeFileSync(CLAUDE_MD_PATH, lines.join("\n"), "utf8");
  }
}

async function main() {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      process.exit(0);
    }

    const data = await readStdin();
    const { tool_name, tool_input } = data;

    if (!["Write", "Edit"].includes(tool_name)) {
      process.exit(0);
    }

    const filePath = tool_input?.file_path;
    if (!filePath) {
      process.exit(0);
    }

    // Prevent infinite loop: skip writes to CLAUDE.md itself
    const resolvedPath = path.resolve(filePath);
    if (
      resolvedPath === path.resolve(CLAUDE_MD_PATH) ||
      path.basename(filePath) === "CLAUDE.md"
    ) {
      process.exit(0);
    }

    // Skip .git internals
    const normalizedPath = filePath.replace(/\\/g, "/");
    if (normalizedPath.includes("/.git/")) {
      process.exit(0);
    }

    // Skip sensitive files — never send their content to the external API
    const sensitivePatterns = [
      /\.env(rc|\.|$)/i,
      /\.(pem|key|p12|pfx|crt|cer|der)$/i,
      /\.(sqlite|sqlite3|db)$/i,
      /(^|\/)id_(rsa|ecdsa|ed25519|dsa)$/i,
      /(secret|credential|password|token|private[_-]?key)/i,
    ];
    const basename = path.basename(filePath);
    if (sensitivePatterns.some((re) => re.test(basename) || re.test(normalizedPath))) {
      process.exit(0);
    }

    const summary = await getSummary(tool_name, tool_input);
    updateClaudeMd(filePath, summary);

    process.exit(0);
  } catch {
    // Never block Claude's work on failure
    process.exit(0);
  }
}

main();
