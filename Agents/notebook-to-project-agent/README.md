# notebook-to-project Agent

A drop-in Claude Code agent that converts Jupyter Notebooks (`.ipynb`) into clean, well-structured Python projects. Drop it into any repo and Claude will handle the full pipeline: notebook detection, `.py` conversion, code analysis, project scaffolding, and test stub generation — all in one guided session.

---

## Installation

Copy the `.claude/` folder from this package into your project root:

```bash
cp -r .claude/ /path/to/your/project/
```

That's it. The next time you open Claude Code in your project, the agent is available.

---

## Usage

Open Claude Code in your project and ask:

```
Convert my notebook analysis.ipynb into a proper Python project.
```

Or let Claude pick it up automatically — if you drop a `.ipynb` file into the conversation, Claude will offer to use the agent.

The agent will guide you through each step and ask for confirmation before scaffolding.

---

## Requirements

- [Claude Code](https://claude.ai/claude-code) installed and authenticated
- Python 3.8+ in the target project environment
- The `.ipynb` notebook file present in (or provided to) the project

---

## What the Agent Generates

```
<project_name>/
├── README.md
├── requirements.txt
├── setup.py (or pyproject.toml)
├── .gitignore
├── config/
│   └── config.yaml
├── data/
│   ├── raw/
│   └── processed/
├── notebooks/
│   └── <original>.ipynb
├── src/
│   └── <project_name>/
│       ├── __init__.py
│       ├── data/
│       │   ├── __init__.py
│       │   └── loader.py
│       ├── processing/
│       │   ├── __init__.py
│       │   └── transformers.py
│       ├── models/
│       │   ├── __init__.py
│       │   └── model.py
│       ├── evaluation/
│       │   ├── __init__.py
│       │   └── metrics.py
│       └── utils/
│           ├── __init__.py
│           └── helpers.py
├── tests/
│   ├── __init__.py
│   └── test_<module>.py
└── main.py
```

The structure adapts to the notebook's domain (data science, data engineering, visualization, automation).

---

## Agent Memory

The agent stores learned patterns in `.claude/agent-memory/notebook-to-project/MEMORY.md`. Over time it will record your preferred project structure, common libraries, naming conventions, and domain-specific patterns — so each subsequent conversion improves.

---

## Source

This agent is part of the [Agents Creation](https://github.com/placeholder/agents-creation) repository, a workspace for building and sharing reusable Claude Code agents.
