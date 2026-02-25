# read_hook Starter

A self-contained, drop-in folder that enables a `PreToolUse` guard for Claude Code's Read tool. The hook blocks Claude from reading `.env` files and exits with code 2 if attempted.

## Folder Structure

```
read-hook-starter/
├── .claude/
│   └── settings.example.json   # Hook registration (contains $PWD placeholder)
│   └── settings.local.json     # Hook registration (contains the actual path placeholder)
├── hooks/
│   └── read_hook.js          # Hook logic — blocks reads of .env files
├── scripts/
│   └── init-read-hook.js     # Setup script — resolves $PWD to an absolute path
└── package.json              # Exposes the hook_env_prevent script
```

## Usage

### 1. Copy the folder into your project root

```bash
cp -r read-hook-starter/hooks   /path/to/your/project/
cp -r read-hook-starter/.claude /path/to/your/project/
cp -r read-hook-starter/scripts /path/to/your/project/
cp    read-hook-starter/package.json /path/to/your/project/
```

### 2. Run the setup script

From your project root:

```bash
npm run hook_env_prevent
```

This replaces the `$PWD` placeholder in `.claude/settings.local.json` with the real absolute path to your project, so the hook command resolves correctly regardless of how Claude Code invokes it.

You should see:

```
✅ Successfully created .claude/settings.local.json
   Replaced $PWD with: /path/to/your/project
```

## How it works

`settings.local.json` registers `hooks/read_hook.js` as a `PreToolUse` hook that fires whenever Claude uses the Read, Grep, or Bash tools. The hook reads the tool input from stdin, checks if the target path contains `.env`, and exits with code 2 (blocking the action) if it does.

The `$PWD` placeholder in the hook command must be an absolute path — `npm run hook_env_prevent` resolves it once at setup time.

## Extending the hook

Edit `hooks/read_hook.js` to add more path checks. The hook uses only Node.js built-ins (`process.stdin`, `Buffer`) — no dependencies needed.
