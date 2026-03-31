Never touch the global ~/.claude/CLAUDE.md. This command operates only on the project-level CLAUDE.md in the current working directory.

---

## PATH A — CLAUDE.md does not exist

Ask the user: "No CLAUDE.md found. Would you like me to create one?"
- If No: stop entirely.
- If Yes: analyze the project (stack, entry points, build/test/lint commands, conventions, env requirements) and create the file.

Write only high-signal content:
- Non-obvious commands and dev workflows
- Constraints Claude would violate by default
- Gotchas not visible from reading the code
- Required env vars or auth setup
- Critical architecture decisions

Do NOT include:
- File/folder listings (Claude can Glob)
- Dependency lists (already in package files)
- "Follow existing conventions" — Claude does this anyway
- Anything obvious for the stack

---

## PATH B — CLAUDE.md exists

**Step 1 — Ask the user how to proceed:**
"A) One-by-one — you approve each change
 B) Auto-accept — I apply all changes, you review the result"

**Step 2 — Read the CLAUDE.md**
The file is self-describing. Trust it as the project context. Do not re-scan the whole codebase.

**Step 3 — Targeted staleness check**
For each concrete reference in the file (file paths, scripts, commands, env vars):
- Does this path still exist? (use Glob/Grep to verify)
- Does this command still exist in package.json / Makefile / pyproject.toml?

Also check: are there important new files (new configs, entry points, scripts) not yet reflected in the file?

**Step 4 — Noise audit**
Classify each section or rule:

| Classification | Criteria |
|---|---|
| Stale | References that no longer exist |
| Redundant | Things Claude can derive by reading the code |
| Noise | Generic advice, obvious conventions for the stack |
| Signal | Non-obvious, constraining, or not visible in the code |

**Step 5 — Present findings**

First, group obvious cases and present them together:
> "These items are clearly stale or redundant — [list with one-line reason each]. Remove all?"
> Options: yes / no / let me pick

Then, for ambiguous cases, go one-by-one:
> Show the content → explain why it may be noise → ask: keep / remove / rewrite

**Step 6 — Discovery pass (opt-in)**
After the audit, ask: "Scan for missing high-value context?"
If yes: look for non-obvious commands, constraints, gotchas, or architecture decisions not currently documented. Present each finding and ask before adding anything.

**Step 7 — Apply and summarize**
Apply all confirmed changes. Show a concise summary of what was added, removed, or updated.
