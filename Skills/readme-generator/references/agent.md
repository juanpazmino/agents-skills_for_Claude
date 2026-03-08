# Agent README Template

Use this template when the component type is an Agent.

---

## Template

```markdown
# [agent-name]

[One sentence: what the agent does and the key outcome it produces.]

---

## Installation

Download or clone this folder, then register it in Claude Code under your preferred scope.

### Project (shared with team)

\```bash
mkdir -p .claude/agents
cp -r [agent-name] .claude/agents/
\```

Commit `.claude/agents/[agent-name]/` to share it with the team.

### Local (you, this project only)

\```bash
mkdir -p .claude/agents
cp -r [agent-name] .claude/agents/
\```

Add to `.gitignore`:
\```
.claude/agents/
\```

### Global (you, all projects)

\```bash
cp -r [agent-name] ~/.claude/agents/
\```

---

## How to invoke

Say any of the following in a Claude Code session:

- "[natural language example 1]"
- "[natural language example 2]"
- "[natural language example 3]"

Or invoke explicitly:
\```
/[agent-name] [args or target]
\```

---

## What the agent generates

\```
[output-folder or project-name]/
├── [file or folder 1]      # description
├── [file or folder 2]      # description
└── [file or folder 3]      # description
\```

---

## Requirements

- [Requirement 1 — e.g. Python 3.9+]
- [Requirement 2 — e.g. ANTHROPIC_API_KEY set]
- [Requirement 3 — e.g. Node.js 18+]

---

## Security

- [Security point 1 — e.g. never commits .env files]
- [Security point 2 — e.g. validates all shell commands before execution]
- [Security point 3 — e.g. sandbox directory scan bounded to project root]
```

---

## Rules

- Installation always shows all three scopes: Project, Local, Global — in that order.
- The "What the agent generates" tree must reflect the actual output structure; read the agent's AGENT.md or source files to determine this accurately.
- The "How to invoke" examples must use natural language the user would actually say, not technical commands.
- Only include a Security section if the agent performs file operations, shell execution, or network calls.
- If the user did NOT provide a GitHub URL, omit any clone step.
- Requirements must list only real dependencies found in the agent's package.json or AGENT.md — never invent them.
