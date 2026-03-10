# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Notes

- All skills, agents, and plugins must be created in this project inside their corresponding folders: `Skills/`, `Agents/`, `Plugins/`.

---

## Repository Purpose

A curated collection of drop-in **Agents**, **Skills**, **Plugins**, and **Hooks** for Claude Code. Each component is self-contained — no cross-dependencies between entries.

## Structure

```
Agents/     # .claude/agents/<name>.md — subagent definitions
Hooks/      # Shell scripts registered in settings.json (PreToolUse / PostToolUse)
Plugins/    # .claude-plugin/plugin.json manifest + skills/ subfolder
Skills/     # SKILL.md + optional references/ directory
```

## Component Anatomy

### Agents (`Agents/<name>/.claude/agents/<name>.md`)
Frontmatter: `name`, `description`, `model`, `color`, optionally `memory: project`.
Body: system prompt + step-by-step workflow. Agents are invoked via the Task tool by the orchestrator Claude.

### Skills (`Skills/<name>/SKILL.md`)
Frontmatter: `name`, `description` (includes trigger phrases — this is what Claude Code matches on).
Body: numbered workflow steps. Reference files go in `references/` and are loaded at the step that needs them, not all at once.
Install by copying the folder to `~/.claude/skills/` (user), `.claude/skills/` (project), or `.claude/skills/` + gitignore (local).

### Plugins (`Plugins/<name>/`)
Manifest at `.claude-plugin/plugin.json` — lists `skills` array pointing to `./skills/<skill-name>`.
Install via `claude plugin install ./<plugin-name>`.

### Hooks (`Hooks/<name>/`)
Plain shell/JS scripts. Registered in `settings.json` under `hooks.PreToolUse` or `hooks.PostToolUse` with a `matcher` pattern and `command`.

## Adding a New Component

1. Create the folder under the matching top-level directory.
2. Follow the anatomy for that component type above.
3. Run `/readme-generator` to produce the `README.md`.
4. For skills, run the package script if a `.skill` bundle is needed — but do **not** commit the `.skill` file to the repo; the source folder is the deliverable.

## Key Reference Files

- `Skills/readme-generator/references/` — templates for Plugin, Hook, and Agent READMEs + the shared scope-table block
- `Skills/structured-outputs/references/pydantic-patterns.md` — type mapping and Pydantic model patterns
- `Skills/structured-outputs/references/provider-apis.md` — OpenAI / Azure / Anthropic / LangChain structured output call signatures
