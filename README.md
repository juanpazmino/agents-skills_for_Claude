# Agents, Skills & Plugins for Claude

A curated collection of reusable **agents**, **skills**, **plugins**, and **hooks** for [Claude Code](https://docs.anthropic.com/en/docs/claude-code). Each component is self-contained and drop-in — copy it into any project and start using it immediately.

---

## Repository Structure

```
├── Agents/
│   ├── judge-llm-agent/               # Generate a Python Judge LLM to evaluate model outputs
│   └── notebook-to-project-agent/     # Convert Jupyter notebooks into structured Python projects
├── Commands/
│   ├── commit-push.md                 # Stage-aware commit and push with safety checks
│   └── update_md_file.md              # Audit and update a project's CLAUDE.md
├── Plugins/
│   └── formatting_py_files/           # Clean and reformat Python files exported from notebooks
└── Skills/
    ├── readme-generator/              # Generate consistent READMEs for Claude Code components
    └── structured-outputs/            # Refactor JSON-string prompting into Pydantic structured outputs
```

---

## Agents

### [judge-llm-agent](Agents/judge-llm-agent/)

A Claude Code agent that generates a production-ready Python Judge LLM — a script that uses an LLM to evaluate and score outputs from other LLMs. Supports Claude, OpenAI, Gemini, and any OpenAI-compatible endpoint. Handles DataFrame/CSV batch evaluation, single prompt+response, and dictionary inputs.

### [notebook-to-project-agent](Agents/notebook-to-project-agent/)

A Claude Code agent that converts Jupyter Notebooks (`.ipynb`) into clean, well-structured Python projects. Handles the full pipeline: notebook detection, `.py` conversion, code analysis, project scaffolding, and test stub generation — all in one guided session.

---

## Plugins

### [formatting_py_files](Plugins/formatting_py_files/)

A Claude Code skill packaged as a plugin. Reformats a `.py` file exported from a Jupyter notebook into a clean, production-ready script — removes `# %%` markers, dead code, and unused imports, then restructures into standard sections.

---

## Skills

### [readme-generator](Skills/readme-generator/)

A Claude Code skill that generates a `README.md` for any component in this repo (Plugin, Hook, Agent, or Skill). Follows a consistent style: GitHub-visitor perspective, folder tree diagram, three-scope installation table, no hallucinated URLs, imperative tone.

### [structured-outputs](Skills/structured-outputs/)

A Claude Code skill that refactors fragile JSON-string prompting (`json.loads()`, "Reply ONLY with valid JSON") into provider-native structured outputs with Pydantic models. Proposes the model set for approval before rewriting any code.

---

## Commands

### [commit-push](Commands/commit-push.md)

A Haiku-powered slash command for routine commits. Scans for secrets before staging, warns on protected branches, and asks for explicit approval before both the commit and the push. Never amends, never force-pushes, never adds a `Co-Authored-By` trailer.

### [update_md_file](Commands/update_md_file.md)

A slash command that audits a project's `CLAUDE.md` — checks every path and command it references still exists, classifies each section as signal or noise, and applies only what you approve. Never touches the global `~/.claude/CLAUDE.md`.

---

## Contributing

To add a new component:

1. Create a folder under the appropriate category (`Agents/`, `Commands/`, `Plugins/`, or `Skills/`).
2. Include a `README.md` explaining installation, usage, and how it works.
3. Keep the component self-contained — no cross-dependencies between entries.

## License

This project is licensed under the [Apache License 2.0](LICENSE).

Copyright 2026 Juan Pazmino B — see [NOTICE](NOTICE) for details.
