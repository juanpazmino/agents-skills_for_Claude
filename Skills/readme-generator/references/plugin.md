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

**2. Try it without installing** (one session only)

\```bash
claude --plugin-dir ./[plugin-name]
\```

**3. Install it persistently**

`claude plugin install` reads from a marketplace, not a folder path — so register the repo
as a marketplace first, then install by name. Requires a `.claude-plugin/marketplace.json`
at the repo root.

\```bash
claude plugin marketplace add [repo-path-or-URL]
claude plugin install [plugin-name]@[marketplace-name]
\```

Choose the scope that fits your use case:

| Scope | Who it affects | Config location |
|-------|---------------|-----------------|
| `user` (default) | You, across all projects | `~/.claude/settings.json` |
| `project` | Everyone on the repo | `.claude/settings.json` (committed) |
| `local` | You, this project only | `.claude/settings.local.json` (gitignored) |

\```bash
claude plugin install [plugin-name]@[marketplace-name] --scope project
claude plugin install [plugin-name]@[marketplace-name] --scope local
\```

---

## Verify the skill is loaded

Inside any Claude Code session run:
\```
/[plugin-name]:[skill-name]
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

- If the user did NOT provide a GitHub URL, omit the "Clone the repository" step entirely and start at "Try it without installing".
- The folder tree must reflect the actual files in the component — glob them first.
- plugin.json must be shown at `.claude-plugin/plugin.json`, not at the root.
- The skill folder inside `skills/` must match the actual folder name on disk.
- **Never write `claude plugin install ./folder`** — install resolves names from a marketplace, not paths. That command always fails.
- The invocation is `/[plugin-name]:[skill-name]`, not `/[plugin-name]`. Both halves are required, even when they are the same word.
