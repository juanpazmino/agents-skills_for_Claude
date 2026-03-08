# Plugin README Template

Use this template when the component type is a Plugin.

---

## Template

```markdown
# [plugin-name]

[One sentence: what the plugin does.]

---

## Plugin structure

\```
[plugin-name]/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
├── skills/
│   └── [plugin-name]/
│       └── SKILL.md         # Skill definition
└── README.md
\```

---

## Installation

**1. Clone the repository**

\```bash
git clone [URL-only-if-user-provided]
cd [repo-name]/Plugins
\```

**2. Install the plugin**

Choose the scope that fits your use case:

| Scope | Who it affects | Config location |
|-------|---------------|-----------------|
| `user` (default) | You, across all projects | `~/.claude/settings.json` |
| `project` | Everyone on the repo | `.claude/settings.json` (committed) |
| `local` | You, this project only | `.claude/settings.local.json` (gitignored) |

\```bash
# Global — available in all your projects
claude plugin install ./[plugin-name]

# Project — shared with the team (commit .claude/settings.json)
claude plugin install ./[plugin-name] --scope project

# Local — only you, only this project (gitignored)
claude plugin install ./[plugin-name] --scope local
\```

**3. Try it without installing** (one session only)

\```bash
claude --plugin-dir ./[plugin-name]
\```

---

## Verify the skill is loaded

Inside any Claude Code session run:
\```
/[plugin-name]
\```

---

## Triggers

Use this skill when you need to:

- [trigger 1]
- [trigger 2]
- [trigger 3]

## Usage

\```
/[plugin-name] [args]
\```
```

---

## Rules

- If the user did NOT provide a GitHub URL, omit the "Clone the repository" step entirely and start at "Install the plugin".
- The folder tree must reflect the actual files in the component — glob them first.
- plugin.json must be shown at `.claude-plugin/plugin.json`, not at the root.
- The skill folder inside `skills/` must match the actual folder name on disk.
