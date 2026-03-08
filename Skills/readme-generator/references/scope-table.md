# Shared Scope / Installation Block

Use this block in every component README that has an installation section.
Adapt the commands to the component type (plugin install vs cp).

---

## Scope Table (always include this)

| Scope | Who it affects | Config location |
|-------|---------------|-----------------|
| `user` (default) | You, across all projects | `~/.claude/settings.json` |
| `project` | Everyone on the repo | `.claude/settings.json` (committed) |
| `local` | You, this project only | `.claude/settings.local.json` (gitignored) |

---

## Plugin install commands

```bash
# Global — available in all your projects
claude plugin install ./[plugin-folder-name]

# Project — shared with the team (commit .claude/settings.json)
claude plugin install ./[plugin-folder-name] --scope project

# Local — only you, only this project (gitignored)
claude plugin install ./[plugin-folder-name] --scope local
```

Try without installing (one session only):
```bash
claude --plugin-dir ./[plugin-folder-name]
```

---

## Hook / Agent install commands (cp-based)

Each scope section follows this pattern:

### Global (user scope)
```bash
cp hooks/[hook-file].js ~/.claude/hooks/
```
Then add to `~/.claude/settings.json`:
```json
{
  "hooks": {
    "[PreToolUse|PostToolUse]": [
      {
        "matcher": "[matcher-pattern]",
        "hooks": [{ "type": "command", "command": "node ~/.claude/hooks/[hook-file].js" }]
      }
    ]
  }
}
```

### Project scope
```bash
mkdir -p .claude/hooks
cp hooks/[hook-file].js .claude/hooks/
```
Add to `.claude/settings.json` (committed):
```json
{
  "hooks": {
    "[PreToolUse|PostToolUse]": [
      {
        "matcher": "[matcher-pattern]",
        "hooks": [{ "type": "command", "command": "node $PWD/.claude/hooks/[hook-file].js" }]
      }
    ]
  }
}
```

### Local scope
Same as project but add to `.claude/settings.local.json` (gitignored).
Add `.claude/settings.local.json` to `.gitignore`.
