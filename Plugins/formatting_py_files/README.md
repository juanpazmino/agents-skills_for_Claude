# formatting_py_files

Reformat a Python file exported from a Jupyter notebook into a clean, production-ready script.

---

## Plugin structure

```
formatting_py_files/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
├── skills/
│   └── formatting_py_files/
│       └── SKILL.md         # Skill definition
└── README.md
```

---

## Installation

**1. Clone the repository**

```bash
git clone https://github.com/juanpazmino/agents-skills_for_Claude.git
cd agents-skills_for_Claude/Plugins
```

**2. Try it without installing** (one session only)

```bash
claude --plugin-dir ./formatting_py_files
```

**3. Install it persistently**

`claude plugin install` resolves plugin names from a marketplace — it does not accept a
folder path. Register the repo as a marketplace first, then install by name. This requires
a `.claude-plugin/marketplace.json` at the repo root.

```bash
claude plugin marketplace add [repo-path-or-URL]
claude plugin install formatting_py_files@[marketplace-name]
```

Choose the scope that fits your use case:

| Scope | Who it affects | Config location |
|-------|---------------|-----------------|
| `user` (default) | You, across all projects | `~/.claude/settings.json` |
| `project` | Everyone on the repo | `.claude/settings.json` (committed) |
| `local` | You, this project only | `.claude/settings.local.json` (gitignored) |

```bash
claude plugin install formatting_py_files@[marketplace-name] --scope project
claude plugin install formatting_py_files@[marketplace-name] --scope local
```

---

## Verify the skill is loaded

Inside any Claude Code session run:
```
/formatting_py_files:formatting_py_files
```

The identifier is `plugin:skill` — both halves are required, even though they are the same
word here.

---

## Triggers

Use this skill when you need to:

- Clean up / reformat a Python file
- Remove `# %%` Jupyter cell markers
- Remove exploration code or unused imports
- Restructure a messy script into standard sections
- Format a `.py` file converted from a notebook

## Usage

```
/formatting_py_files:formatting_py_files your_file.py
```
