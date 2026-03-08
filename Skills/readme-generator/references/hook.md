# Hook README Template

Use this template when the component type is a Hook.

---

## Template

```markdown
# [hook-name]

[One sentence: what the hook does, which event it fires on, and what it protects or automates.]

---

## Folder structure

\```
[hook-name]/
├── .claude/
│   └── settings.example.json   # Example hook registration config
├── hooks/
│   └── [hook-file].js          # Hook script
├── scripts/
│   └── init-[hook-name].js     # Setup helper (optional)
└── package.json
\```

---

## Usage

There are three ways to use this hook depending on your scope.

---

### Option A — Local (you, this project only)

#### 1. Copy the hook script

\```bash
mkdir -p .claude/hooks
cp hooks/[hook-file].js .claude/hooks/
\```

#### 2. Register the hook

Add to `.claude/settings.local.json`:

\```json
{
  "hooks": {
    "[PreToolUse|PostToolUse]": [
      {
        "matcher": "[matcher-pattern]",
        "hooks": [
          {
            "type": "command",
            "command": "node $PWD/.claude/hooks/[hook-file].js"
          }
        ]
      }
    ]
  }
}
\```

#### 3. Add to .gitignore

\```
.claude/settings.local.json
\```

✅ Hook is active for you in this project only.

---

### Option B — Project (everyone on the repo)

#### 1. Copy the hook script

\```bash
mkdir -p .claude/hooks
cp hooks/[hook-file].js .claude/hooks/
\```

#### 2. Register the hook

Add to `.claude/settings.json` (commit this file):

\```json
{
  "hooks": {
    "[PreToolUse|PostToolUse]": [
      {
        "matcher": "[matcher-pattern]",
        "hooks": [
          {
            "type": "command",
            "command": "node $PWD/.claude/hooks/[hook-file].js"
          }
        ]
      }
    ]
  }
}
\```

✅ Hook is active for everyone who clones the repo.

---

### Option C — Global (you, all projects)

#### 1. Copy the hook script

\```bash
cp hooks/[hook-file].js ~/.claude/hooks/
\```

#### 2. Register the hook

Add to `~/.claude/settings.json`:

\```json
{
  "hooks": {
    "[PreToolUse|PostToolUse]": [
      {
        "matcher": "[matcher-pattern]",
        "hooks": [
          {
            "type": "command",
            "command": "node ~/.claude/hooks/[hook-file].js"
          }
        ]
      }
    ]
  }
}
\```

✅ Hook is active across all your Claude Code projects.

---

## How it works

[2–4 sentences explaining what the hook script checks, how it decides to block or allow, and what exit code it returns (2 = block, 0 = allow).]

---

## [Blocked patterns / Matched tools] (adapt heading to hook purpose)

[Table or bullet list of what the hook intercepts or blocks. Examples:]

| Pattern | What it covers |
|---------|---------------|
| `.env*` | .env, .envrc, .env.local |
| `*.pem` | Private key files |

[Or for a PostToolUse hook:]

Fires after: `[tool names]`
Skips: `CLAUDE.md` itself, `.git/` internals, sensitive file paths.
```

---

## Rules

- Always show all three options (A Local, B Project, C Global) with this exact naming.
- The JSON config must use `$PWD` for local/project and `~/.claude/hooks/` for global.
- Fold `package.json` details into the folder tree — don't add a separate "Requirements" section unless there are npm deps.
- The hook event (`PreToolUse` / `PostToolUse`) and matcher must match the actual `settings.example.json` in the component folder.
- Read the actual hook JS file to accurately describe "How it works" and the blocked/matched patterns.
