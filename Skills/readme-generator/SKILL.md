---
name: readme-generator
description: |
  Generates a README.md for a Claude Code component (Plugin, Hook, or Agent) following
  a consistent project style: GitHub-visitor perspective, folder tree diagram, three-scope
  installation table (user / project / local), no hallucinated URLs, imperative tone.
  Use when the user finishes creating a Plugin, Hook, Agent, or Skill and needs a README,
  or says things like "generate the readme", "write the README for this hook/plugin/agent",
  "document this component", "create the readme".
---

## Steps

1. **Identify the component type** — Plugin, Hook, or Agent. Ask if not clear from context.

2. **Collect required info** — Read the component folder directly if accessible. Ask only for what is missing:
   - Component name
   - One-line description (what it does)
   - Folder structure (glob the actual files, don't guess)
   - Triggers / when to invoke (Plugins and Skills)
   - Hook event + matcher pattern (Hooks: e.g. `PreToolUse`, `Read|Grep|Bash`)
   - What the agent generates / output structure (Agents)
   - Dependencies or requirements (if any)
   - GitHub repo URL — **only if the user explicitly provides it. Never invent one.**

3. **Load the matching reference file** for the component type:
   - Plugin → `references/plugin.md`
   - Hook → `references/hook.md`
   - Agent → `references/agent.md`
   - Also load `references/scope-table.md` for the shared installation block.

4. **Generate the README** following the template exactly:
   - No invented URLs, no cross-references to sibling components
   - Tree diagrams use `├──` / `└──` with inline `# comment` labels
   - Always include the three-scope installation block (user / project / local)
   - Imperative, present-tense tone throughout

5. **Write the file** to `README.md` inside the component's folder.
