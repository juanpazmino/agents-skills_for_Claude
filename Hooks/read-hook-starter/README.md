# read_hook Starter

A self-contained, drop-in folder that enables a `PreToolUse` guard for Claude Code's Read, Grep, and Bash tools. The hook blocks Claude from accessing sensitive files and exits with code 2 if attempted.

## Folder Structure

```
your_project/
├── .claude/
│   └── settings.example.json   # Hook registration (contains $PWD placeholder)
│   └── settings.local.json     # Hook registration (contains the actual path placeholder)
├── hooks/
│   └── read_hook.js          # Hook logic — blocks access to sensitive files
├── scripts/
│   └── init-read-hook.js     # Setup script — resolves $PWD to an absolute path
└── package.json              # Exposes the hook_env_prevent script
```

## Usage

There are three ways to use this hook depending on your scope.

---

### Option A — Local (personal, this project only)

The hook applies only to this project and is not committed to version control. Each team member who wants the hook must run the setup themselves.

#### 1. Copy the files into your project root

```bash
cp -r path/to/read-hook-starter/hooks your_project/
cp -r path/to/read-hook-starter/.claude your_project/
cp -r path/to/read-hook-starter/scripts your_project/
cp    path/to/read-hook-starter/package.json your_project/
```

#### 2. Run the setup script

From your project root:

```bash
npm run hook_env_prevent
```

This replaces the `$PWD` placeholder in `.claude/settings.local.json` with the real absolute path to your project. The result is written to `settings.local.json`, which is gitignored and never committed.

```
✅ Successfully created .claude/settings.local.json
   Replaced $PWD with: /path/to/your/project
```

---

### Option B — Project (shared with your team)

The hook and its registration are committed to the repo so every team member gets it automatically. Because the hook path must resolve correctly on each machine, use a relative path in `.claude/settings.json` instead of an absolute one.

#### 1. Copy the files into your project root

```bash
cp -r path/to/read-hook-starter/hooks your_project/
cp -r path/to/read-hook-starter/.claude your_project/
cp -r path/to/read-hook-starter/scripts your_project/
cp    path/to/read-hook-starter/package.json your_project/
```

#### 2. Register the hook using a relative path

Create or update `.claude/settings.json` in your project root:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Read|Grep|Bash",
        "hooks": [
          {
            "type": "command",
            "command": "node hooks/read_hook.js"
          }
        ]
      }
    ]
  }
}
```

#### 3. Commit both files

```bash
git add .claude/settings.json hooks/read_hook.js
git commit -m "Add read hook for sensitive file protection"
```

> Make sure `.claude/settings.local.json` is in your `.gitignore` so personal overrides are never committed.

---

### Option C — Global (personal, all projects)

One shared hook file in `~/.claude/hooks/` applies to every Claude Code session on this machine.

#### 1. Copy the hook file to your global Claude folder

```bash
mkdir -p ~/.claude/hooks
cp path/to/read-hook-starter/hooks/read_hook.js ~/.claude/hooks/
```

#### 2. Register the hook in your global settings

Add the following to `~/.claude/settings.json` (create it if it doesn't exist):

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Read|Grep|Bash",
        "hooks": [
          {
            "type": "command",
            "command": "node /Users/YOUR_USERNAME/.claude/hooks/read_hook.js"
          }
        ]
      }
    ]
  }
}
```

Replace `/Users/YOUR_USERNAME` with your actual home directory path.

---

## How it works

The hook registers as a `PreToolUse` guard that fires whenever Claude uses the Read, Grep, or Bash tools. It reads the tool input from stdin and exits with code 2 (blocking the action) if a sensitive file is detected.

**For Read and Grep** — checks the `file_path` argument against sensitive patterns.
**For Bash** — checks the full command string for sensitive file references, preventing bypasses via `cat`, `grep`, etc.

**Local setup** uses `$PWD` resolved to an absolute path at setup time via `npm run hook_env_prevent`. The path is wrapped in double quotes so it works correctly on Windows when the project lives in a directory with spaces.
**Project setup** uses a relative path (`node hooks/read_hook.js`) that works on any machine.
**Global setup** uses a hardcoded absolute path directly in `~/.claude/settings.json`. On Windows, wrap the path in double quotes if it contains spaces (e.g. `"node \"C:/Users/My Name/.claude/hooks/read_hook.js\""`).

## Blocked file patterns

| Pattern | Examples |
|---------|---------|
| `.env` files | `.env`, `.env.local`, `.env.production`, `.envrc` |
| Private keys & certs | `id_rsa`, `id_ed25519`, `*.pem`, `*.key`, `*.p12` |
| AWS credentials | `~/.aws/credentials` |
| SSH directory | anything under `.ssh/` |
| Secret config files | `secrets.json`, `credentials.yaml`, etc. |

## Extending the hook

Edit `SENSITIVE_PATTERNS` at the top of `hooks/read_hook.js` to add or remove patterns. The hook uses only Node.js built-ins — no dependencies needed.
