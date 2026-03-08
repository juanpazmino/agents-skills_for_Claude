# readme-generator

Generates a `README.md` for a Claude Code component (Plugin, Hook, Agent, or Skill) following a consistent project style: GitHub-visitor perspective, folder tree diagram, three-scope installation table, no hallucinated URLs, imperative tone.

---

## Skill structure

```
readme-generator/
├── SKILL.md                    # Skill definition and generation steps
└── references/
    ├── agent.md                # Agent README template
    ├── hook.md                 # Hook README template
    ├── plugin.md               # Plugin README template
    └── scope-table.md          # Shared installation scope block
```

---

## Installation

Choose the scope that fits your use case:

| Scope | Who it affects | Config location |
|-------|---------------|-----------------|
| `user` (default) | You, across all projects | `~/.claude/skills/` |
| `project` | Everyone on the repo | `.claude/skills/` (committed) |
| `local` | You, this project only | `.claude/skills/` (gitignored) |

**User — available in all your projects:**

```bash
cp -r readme-generator ~/.claude/skills/
```

**Project — shared with the team:**

```bash
cp -r readme-generator .claude/skills/
git add .claude/skills/readme-generator
git commit -m "Add readme-generator skill"
```

**Local — only you, only this project:**

```bash
cp -r readme-generator .claude/skills/
echo ".claude/skills/" >> .gitignore
```

---

## Verify the skill is loaded

Inside any Claude Code session run:

```
/readme-generator
```

---

## Triggers

Use this skill when you need to:

- Generate a README after creating a new Plugin, Hook, Agent, or Skill
- Document an existing component for the GitHub repo
- Ensure installation instructions follow the three-scope pattern consistently

Trigger phrases: `"generate the readme"`, `"write the README for this hook/plugin/agent"`, `"document this component"`, `"create the readme"`.

---

## Usage

```
/readme-generator
```

The skill will read the component folder, identify the component type, and write `README.md` directly into the component's folder. No arguments needed — it asks only for information it cannot find on disk.
