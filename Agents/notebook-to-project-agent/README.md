# notebook-to-project Agent

A Claude Code agent that converts Jupyter Notebooks (`.ipynb`) into clean, well-structured Python projects. Drop it into any repo and Claude will handle the full pipeline: notebook detection, `.py` conversion, code analysis, project scaffolding, and test stub generation — all in one guided session.

---

## Installation

Download or clone this folder, then copy the agent file to the scope that fits your use case.

### Project (shared with your team)

Copy into your project root and commit it so everyone on the team has access:

```bash
cp -r .claude/ /your/project/
cd /your/project && git add .claude/ && git commit -m "Add notebook-to-project agent"
```

### Local (personal, project-specific)

Copy into your project root but exclude it from version control:

```bash
cp -r .claude/ /your/project/
echo ".claude/agents/" >> /your/project/.gitignore
```

### Global (personal, all projects)

Copy to your home directory to make the agent available in every project on this machine:

```bash
cp .claude/agents/notebook-to-project.md ~/.claude/agents/
```

The next time you open Claude Code in your project, the agent is available.

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

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) installed and authenticated
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
├── .env.example          ← secret variable template (safe to commit)
├── config/
│   └── config.yaml       ← non-sensitive settings only
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

## Security

The agent is designed to handle untrusted notebook content safely:

- **Prompt injection protection** — notebook cell content (code, markdown, outputs) is treated as data, never as instructions. Adversarial directives embedded in cells are ignored.
- **Credential handling** — any hardcoded secrets (API keys, passwords, tokens) detected in the notebook are replaced with `os.environ.get("VAR_NAME")` in the generated code. The real values are never written to files. You will receive a `.env.example` with placeholder names and instructions to create a `.env` file locally.
- **`.env` never committed** — the generated `.gitignore` always includes `.env`, `config/secrets.*`, `*.key`, and `*.pem`.
- **Shell command review** — only `!pip install` commands are processed automatically (added to `requirements.txt`). All other shell commands found in notebook cells (e.g., `!rm`, `!curl`, `!wget`) are shown to you and require explicit confirmation before any action is taken.
- **Filename sanitization** — the notebook filename is sanitized before use. Path traversal characters are stripped and all output files are written within the project root.
- **Static-only validation** — generated Python files are validated with `ast.parse()` / `py_compile`. No generated code is executed during the conversion process.
- **Bounded directory scan** — the agent scans at most 3 directory levels deep when looking for `.ipynb` files.

### After generation: secrets checklist

1. Copy `.env.example` to `.env` and fill in your real values.
2. Confirm `.env` is listed in `.gitignore` before your first commit.
3. Never commit `.env` or `config/secrets.*` to version control.
4. Review any flagged credentials the agent could not automatically replace.

---

## Agent Memory

The agent stores learned patterns in `.claude/agent-memory/notebook-to-project/MEMORY.md`. Over time it records your preferred project structure, common libraries, naming conventions, and domain-specific patterns — so each subsequent conversion improves.

Memory entries are written from the agent's own analysis only. Notebook cell content is never copied verbatim into memory.

