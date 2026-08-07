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

**`claude plugin install` only reads from a marketplace — it cannot take a folder path.**
`claude plugin install ./my-plugin` fails with "not found in any configured marketplace".
There are two real paths:

Use it for one session, straight from the folder — no install, no marketplace:
```bash
claude --plugin-dir ./[plugin-folder-name]
```

Install it persistently — register the repo as a marketplace first, then install by name.
This needs a `.claude-plugin/marketplace.json` at the repo root listing the plugin:
```bash
claude plugin marketplace add [repo-path-or-URL]
claude plugin install [plugin-name]@[marketplace-name]

# --scope picks who it applies to (default: user)
claude plugin install [plugin-name]@[marketplace-name] --scope project
claude plugin install [plugin-name]@[marketplace-name] --scope local
```

The scope table above applies to the marketplace flow. `--plugin-dir` is session-only and
has no scope.

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
