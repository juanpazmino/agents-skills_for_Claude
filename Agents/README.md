# Agents

Reusable Claude Code subagents. Each agent lives in its own folder and is self-contained — copy the `.claude/` folder into your project (or `~/.claude/` for global access) and it becomes available immediately.

---

## Available Agents

### [judge-llm-agent](judge-llm-agent/)

Generates a production-ready Python **Judge LLM** — a script that uses an LLM to evaluate and score outputs from other LLMs.

- Supports Claude (Anthropic), OpenAI, Gemini, and any OpenAI-compatible endpoint (Ollama, Azure, LM Studio)
- Handles DataFrame/CSV batch evaluation, single prompt+response, or dictionary inputs
- Generates `judge_llm.py` + `requirements.txt` tailored to your chosen provider and schema
- Async concurrency support for large-scale evaluation

**Install:**

| Scope | Command |
|---|---|
| Project (team, committed) | `cp -r judge-llm-agent/.claude/ /your/project/ && git add .claude/ && git commit -m "Add judge-llm agent"` |
| Local (personal, project-only) | `cp -r judge-llm-agent/.claude/ /your/project/` then add `.claude/agents/` to `.gitignore` |
| Global (personal, all projects) | `cp judge-llm-agent/.claude/agents/judge-llm.md ~/.claude/agents/` |

**Invoke in Claude Code:**
```
create a judge LLM
evaluate my LLM responses
build a judge to score model outputs
```

---

### [notebook-to-project-agent](notebook-to-project-agent/)

Converts Jupyter Notebooks (`.ipynb`) into clean, well-structured Python projects — full pipeline from notebook detection through scaffolding and test stub generation.

- Detects `.ipynb` files, converts code cells to `.py`, then scaffolds a full project
- Adapts structure to the notebook's domain (data science, data engineering, visualization, automation)
- Handles credential detection and replacement, shell command review, and prompt injection protection
- Stores learned patterns in agent memory to improve across sessions

**Install:**

| Scope | Command |
|---|---|
| Project (team, committed) | `cp -r notebook-to-project-agent/.claude/ /your/project/ && git add .claude/ && git commit -m "Add notebook-to-project agent"` |
| Local (personal, project-only) | `cp -r notebook-to-project-agent/.claude/ /your/project/` then add `.claude/agents/` to `.gitignore` |
| Global (personal, all projects) | `cp notebook-to-project-agent/.claude/agents/notebook-to-project.md ~/.claude/agents/` |

**Invoke in Claude Code:**
```
Convert my notebook analysis.ipynb into a proper Python project.
```

---

## How Agents Work

Agents are defined as Markdown files placed in `.claude/agents/`. When Claude Code detects a relevant request, it automatically routes to the appropriate agent. You can also invoke them explicitly using `@agent-name` in your prompt.

For more details on the Claude Code agents system, see the [official documentation](https://docs.anthropic.com/en/docs/claude-code/sub-agents).
