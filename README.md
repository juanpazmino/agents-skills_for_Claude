# Agents & Skills for Claude

A curated collection of reusable **agents** and **skills** for [Claude Code](https://docs.anthropic.com/en/docs/claude-code). Each component is self-contained and drop-in — copy it into any project and start using it immediately.

---

## Repository Structure

```
├── Agents/
│   └── notebook-to-project-agent/   # Convert Jupyter notebooks into structured Python projects
└── Skills/
    └── read-hook-starter/           # PreToolUse hook that blocks Claude from reading .env files
```

## Agents

### [notebook-to-project-agent](Agents/notebook-to-project-agent/)

A Claude Code agent that converts Jupyter Notebooks (`.ipynb`) into clean, well-structured Python projects. It handles the full pipeline: notebook detection, `.py` conversion, code analysis, project scaffolding, and test stub generation — all in one guided session.

## Skills

### [read-hook-starter](Skills/read-hook-starter/)

A drop-in `PreToolUse` hook that prevents Claude Code from reading `.env` files. It registers a guard on the Read, Grep, and Bash tools and exits with code 2 (blocking the action) whenever the target path contains `.env`.

---

## Contributing

To add a new agent or skill:

1. Create a folder under `Agents/` or `Skills/` with a descriptive name.
2. Include a `README.md` explaining installation, usage, and how it works.
3. Keep the component self-contained — no cross-dependencies between entries.

## License

This project is licensed under the [Apache License 2.0](LICENSE).

Copyright 2026 Juan Pazmino B — see [NOTICE](NOTICE) for details.
