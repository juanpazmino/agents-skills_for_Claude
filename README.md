# Agents, Skills & Plugins for Claude

A curated collection of reusable **agents**, **skills**, **plugins**, and **hooks** for [Claude Code](https://docs.anthropic.com/en/docs/claude-code). Each component is self-contained and drop-in — copy it into any project and start using it immediately.

---

## Repository Structure

```
├── Agents/
│   ├── judge-llm-agent/               # Generate a Python Judge LLM to evaluate model outputs
│   └── notebook-to-project-agent/     # Convert Jupyter notebooks into structured Python projects
├── Hooks/
│   ├── read-hook-starter/              # PreToolUse hook that blocks reads of sensitive files
│   └── post-tool-claude-md-updater/   # PostToolUse hook that logs file changes to CLAUDE.md
├── Plugins/
│   └── formatting_py_files/            # Clean and reformat Python files exported from notebooks
└── Skills/
    └── readme-generator/               # Generate consistent READMEs for Claude Code components
```

---

## Agents

### [judge-llm-agent](Agents/judge-llm-agent/)

A Claude Code agent that generates a production-ready Python Judge LLM — a script that uses an LLM to evaluate and score outputs from other LLMs. Supports Claude, OpenAI, Gemini, and any OpenAI-compatible endpoint. Handles DataFrame/CSV batch evaluation, single prompt+response, and dictionary inputs.

### [notebook-to-project-agent](Agents/notebook-to-project-agent/)

A Claude Code agent that converts Jupyter Notebooks (`.ipynb`) into clean, well-structured Python projects. Handles the full pipeline: notebook detection, `.py` conversion, code analysis, project scaffolding, and test stub generation — all in one guided session.

---

## Hooks

### [read-hook-starter](Hooks/read-hook-starter/)

A drop-in `PreToolUse` hook that prevents Claude Code from reading sensitive files (`.env`, SSH keys, certificates, AWS credentials). Registers a guard on the Read, Grep, and Bash tools and exits with code 2 (blocking the action) whenever the target path matches a sensitive pattern.

### [post-tool-claude-md-updater](Hooks/post-tool-claude-md-updater/)

A `PostToolUse` hook that automatically logs every file change Claude makes into a `## Recent Changes` section in `CLAUDE.md`. Uses Claude Haiku to generate a one-sentence summary of each Write or Edit action.

---

## Plugins

### [formatting_py_files](Plugins/formatting_py_files/)

A Claude Code skill packaged as a plugin. Reformats a `.py` file exported from a Jupyter notebook into a clean, production-ready script — removes `# %%` markers, dead code, and unused imports, then restructures into standard sections.

---

## Skills

### [readme-generator](Skills/readme-generator/)

A Claude Code skill that generates a `README.md` for any component in this repo (Plugin, Hook, Agent, or Skill). Follows a consistent style: GitHub-visitor perspective, folder tree diagram, three-scope installation table, no hallucinated URLs, imperative tone.

---

## Contributing

To add a new component:

1. Create a folder under the appropriate category (`Agents/`, `Hooks/`, `Plugins/`, or `Skills/`).
2. Include a `README.md` explaining installation, usage, and how it works.
3. Keep the component self-contained — no cross-dependencies between entries.

## License

This project is licensed under the [Apache License 2.0](LICENSE).

Copyright 2026 Juan Pazmino B — see [NOTICE](NOTICE) for details.
