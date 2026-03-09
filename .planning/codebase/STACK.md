# Technology Stack

**Analysis Date:** 2026-03-09

## Overview

This is a **Claude Code subagent** — not a runnable application. The agent lives at
`.claude/agents/judge-llm.md` and is invoked inside Claude Code sessions. Its sole purpose
is to **generate** a production-ready Python module (`judge_llm.py`) into the user's project.
There is no application runtime of this repo itself.

## Languages

**Primary:**
- Python 3 (generated output only) — the `JudgeLLM` class written to the user's project

**Agent definition:**
- Markdown (`.md`) — the subagent spec at `.claude/agents/judge-llm.md`

## Runtime

**Environment:**
- The subagent executes inside Claude Code (Anthropic's Claude Agent SDK)
- The **generated** `judge_llm.py` runs in any CPython 3.x environment with pip-installed dependencies

**Package Manager (generated project):**
- pip — a `requirements.txt` is generated alongside `judge_llm.py`
- Lockfile: not generated (requirements.txt uses `>=` version pins only)

## Frameworks

**Agent platform:**
- Claude Code subagent protocol — triggered by natural language or `@judge-llm` invocation

**Generated code — Core class:**
- `JudgeLLM` Python class (no framework; plain stdlib + provider SDK)

**Generated code — Data processing:**
- pandas `>=2.0.0` — DataFrame input/output and batch join logic
- tqdm `>=4.0.0` — progress bars during batch evaluation

**Generated code — Async (optional):**
- asyncio (Python stdlib) — bounded concurrency via `asyncio.Semaphore` and `run_in_executor`

## Key Dependencies (Generated `requirements.txt`)

Dependencies are provider-specific; only the needed subset is written:

**Anthropic provider:**
- `anthropic>=0.40.0` — Anthropic Python SDK; uses `client.messages.create()`

**OpenAI / Azure / OpenAI-compatible provider:**
- `openai>=1.0.0` — OpenAI Python SDK; used for OpenAI, Azure OpenAI, Ollama, LM Studio

**Gemini provider:**
- `google-generativeai>=0.8.0` — Google Generative AI SDK; uses `genai.GenerativeModel`

**All providers:**
- `pandas>=2.0.0`
- `tqdm>=4.0.0`

**Optional (detected at runtime, auto-imported):**
- `python-dotenv` — used if `load_dotenv` is already present in the target project (detected via grep)

## Configuration

**Environment (generated project):**
- API keys are read exclusively via `os.getenv("VAR_NAME")` — never hardcoded
- A `.env.example` placeholder file is generated; user copies it to `.env`
- `.env` must be added to `.gitignore` by the user
- The agent never reads `.env` itself; it only notes the variable name the user provides

**Required env vars (provider-dependent):**
- Anthropic: `ANTHROPIC_API_KEY`
- OpenAI: `OPENAI_API_KEY`
- Gemini: `GOOGLE_API_KEY`
- Azure OpenAI: `AZURE_OPENAI_API_KEY` + `AZURE_OPENAI_ENDPOINT`
- Custom/Ollama: user-defined variable name

**Build:**
- No build step. The agent writes `.py` source files directly; no compilation or bundling.

## Generated Output Files

The agent writes exactly these files into the user's working directory:

| File | Purpose |
|---|---|
| `judge_llm.py` | Importable `JudgeLLM` class module (no `__main__` block) |
| `requirements.txt` | Provider-specific pip dependencies |
| `.env.example` | Placeholder showing the required env var name |

## Platform Requirements

**Development (agent execution):**
- Claude Code with subagent support
- Agent file: `.claude/agents/judge-llm.md` (project, local, or global scope)

**Generated project runtime:**
- Python 3.x
- pip
- Network access to chosen LLM provider API endpoint
- Environment variable set for the provider API key

---

*Stack analysis: 2026-03-09*
