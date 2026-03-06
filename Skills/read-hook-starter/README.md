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

### 1. Copy the folder into your project root

```bash
cp -r your_project/hooks
cp -r your_project/.claude 
cp -r ryour_project/scripts 
cp    your_project/package.json 
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

`settings.local.json` registers `hooks/read_hook.js` as a `PreToolUse` hook that fires whenever Claude uses the Read, Grep, or Bash tools. The hook reads the tool input from stdin and exits with code 2 (blocking the action) if a sensitive file is detected.

**For Read and Grep** — checks the `file_path` argument against sensitive patterns.
**For Bash** — checks the full command string for sensitive file references, preventing bypasses via `cat`, `grep`, etc.

The `$PWD` placeholder in the hook command must be an absolute path — `npm run hook_env_prevent` resolves it once at setup time.

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
