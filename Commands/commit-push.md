---
description: Stage-aware commit and push with safety checks. Never co-authors. Always asks for approval. Surfaces push errors.
model: claude-haiku-4-5-20251001
allowed-tools: Bash
---

# /commit-push

Routine commit + push flow. Haiku-powered. Safety-first.

**Hard rules — never break these:**
- **NEVER add a `Co-Authored-By` trailer.** No "Generated with Claude" footer either. Plain commit messages only.
- **NEVER use `--no-verify`, `--no-gpg-sign`, or any hook-bypass flag.**
- **NEVER amend** an existing commit. If a hook fails, fix and create a NEW commit.
- **NEVER force-push.** No `--force`, no `--force-with-lease`, no exceptions.
- **NEVER `git add -A` or `git add .`** — stage files by name only.
- The user must explicitly approve before any `git commit` and before any `git push` runs.

---

## Workflow

### Step 1 — Snapshot current state

Run in parallel:
- `git status` (no `-uall`)
- `git diff --staged`
- `git diff` (unstaged)
- `git branch --show-current`
- `git log -5 --oneline` (to learn this repo's commit-message style)

### Step 2 — Empty-staged guard

If `git diff --staged` is empty AND there are no untracked files the user might want to stage → tell the user "Nothing staged to commit." and STOP.

### Step 3 — Sensitive-file scan

Scan staged files AND any untracked files you're about to suggest staging. Flag anything matching:

`.env*`, `*.pem`, `*.key`, `*.p12`, `*.pfx`, `*.jks`, `id_rsa*`, `id_ed25519*`,
`credentials*`, `*.tfstate`, `*.tfvars`, `.npmrc`, `.pypirc`, `.netrc`, `.pgpass`,
`.git-credentials`, `*config.json` inside `.docker/` or `.kube/`, anything under `.aws/` or `.ssh/`,
or filenames containing `secret`, `token`, `password`, `apikey`, `api_key`, `private`.

Also peek at staged diffs for obvious leaks: lines matching `(?i)(api[_-]?key|secret|token|password|bearer)\s*[:=]` with a non-empty value, or things that look like AWS keys (`AKIA[0-9A-Z]{16}`), JWTs, or PEM blocks.

If anything matches → STOP. Show the user exactly what you found and ask:
> "These look sensitive: [list]. Continue anyway, unstage them, or abort?"

Wait for explicit confirmation before proceeding.

### Step 4 — Untracked files

If untracked files exist, list them grouped (source / config / build artifacts / other) and ask once:
> "Untracked files found. Stage any of these? Reply with names, 'all', or 'none'."

Stage only what the user names. Never auto-stage. Re-run Step 3 on anything newly staged.

### Step 5 — Branch protection

If current branch is `main`, `master`, `prod`, `production`, or `release` → warn:
> "You're about to commit and push to `<branch>`. Confirm with 'yes push to <branch>' to proceed."

Anything other than that exact phrase = abort.

### Step 6 — Draft commit message

Match the style you saw in `git log -5`:
- If recent commits use Conventional Commits (`feat:`, `fix:`, `refactor:`, etc.), use that.
- If freeform, mirror the tone and length.
- Focus on the *why*, not a file-by-file *what*.
- 1–2 sentences. No body unless the change genuinely needs one.
- **No `Co-Authored-By`. No "Generated with Claude" line. Nothing of the sort.**

### Step 7 — Approval gate

Show the user:
1. Files that will be committed (staged list).
2. The drafted commit message.
3. The target branch and remote.

Ask:
> "Approve commit + push? (yes / edit message / abort)"

Only proceed on an explicit yes. If "edit message" → ask for the new message and re-show the plan.

### Step 8 — Commit

Use a HEREDOC for the message to preserve formatting:
```
git commit -m "$(cat <<'EOF'
<message>
EOF
)"
```

**If a pre-commit hook fails:**
- Show the hook output to the user.
- Diagnose the root cause. Fix it (or ask the user to fix it if it's outside scope).
- Re-stage the fix. Run a NEW `git commit` — never `--amend`, never `--no-verify`.

### Step 9 — Push

Determine upstream:
- `git rev-parse --abbrev-ref --symbolic-full-name @{u}` — if this fails, branch has no upstream.

If no upstream → `git push -u origin <current-branch>`.
Otherwise → `git push`.

**Never** add `--force` or `--force-with-lease`.

### Step 10 — Verify and report

After push, run `git status` and check the push command's exit code + output.

**Success:** Report "Pushed `<branch>` to `<remote>`. Commit: `<short-sha>`."

**Failure:** Surface the exact error and a one-line diagnosis:
- `rejected ... non-fast-forward` → "Remote has commits you don't. Pull/rebase first — your call on strategy."
- `rejected ... protected branch` → "Branch is protected. Push blocked by remote rules."
- `Permission denied` / `403` / `auth` → "Auth failed. Check credentials or remote URL."
- `Could not resolve host` → "Network/DNS issue reaching the remote."
- Anything else → quote the error verbatim, do not guess.

Never retry a failed push automatically. Report and wait for the user.
