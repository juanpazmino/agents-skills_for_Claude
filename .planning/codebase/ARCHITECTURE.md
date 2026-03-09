# Architecture

**Analysis Date:** 2026-03-09

## Pattern Overview

**Overall:** Declarative Agent Definition Pattern (Claude Code subagent)

**Key Characteristics:**
- The agent is entirely defined in a single Markdown file with YAML front matter — no runtime source code lives in this repo
- All behavior (workflow, code generation, error handling) is encoded as prose instructions in `.claude/agents/judge-llm.md`
- The agent is a code generator: its output artifacts (`judge_llm.py`, `requirements.txt`, `.env.example`) are written to the user's project, not this repo
- Strictly sequential interaction: each workflow step requires a user response before proceeding to the next

## Layers

**Agent Definition Layer:**
- Purpose: Encodes all agent logic — workflow steps, code templates, security rules, and post-generation guidance
- Location: `Agents/judge-llm-agent/.claude/agents/judge-llm.md`
- Contains: YAML front matter (name, description, model, color), step-by-step workflow instructions, provider-specific code templates, system prompt template
- Depends on: Claude Code runtime (the agent runner that parses and executes `.md` agent definitions)
- Used by: Claude Code sessions that invoke `@judge-llm` or match trigger phrases

**Documentation Layer:**
- Purpose: Human-readable guide for installation, invocation, and understanding generated output
- Location: `Agents/judge-llm-agent/README.md`
- Contains: Installation instructions (project/local/global scopes), invocation examples, generated file descriptions, provider support table, security notes
- Depends on: Nothing at runtime
- Used by: Developers setting up the agent

**Planning/Design Layer:**
- Purpose: Records the design rationale, key decisions, and a manual verification checklist
- Location: `Agents/judge-llm-agent/plan.md`
- Contains: Design decisions, security decisions, file creation rationale, verification TODOs
- Depends on: Nothing at runtime
- Used by: Developers maintaining or extending the agent

## Data Flow

**Agent Invocation Flow:**

1. User triggers the agent in a Claude Code session via `@judge-llm` or a matching natural-language phrase
2. Claude Code runtime loads `.claude/agents/judge-llm.md` and initializes the agent with the specified model (`sonnet`)
3. Agent executes Step 1: asks user for provider and model, waits for reply
4. Agent executes Step 2: asks for input format, waits for reply
5. Agent executes Step 3 (conditional): if DataFrame format chosen, asks for column/batch/async config, waits for reply
6. Agent executes Step 4: asks for evaluation criteria, waits for reply
7. Agent executes Step 5: generates `judge_llm.py`, `requirements.txt`, `.env.example` in user's current working directory
8. Agent displays post-generation summary (file list, API key setup, install command, data privacy reminder, usage snippet)

**API Key Handling Flow:**

1. Agent searches the project for existing `load_dotenv` usage via `grep -r "load_dotenv" .`
2. If found: generated code includes `from dotenv import load_dotenv` + `load_dotenv()`
3. If not found: agent asks for the environment variable name (never the actual key value)
4. Generated code uses `os.getenv("VAR_NAME")` and raises `RuntimeError` immediately if variable is unset

**Generated Code Evaluation Flow (runtime, in user's project):**

1. Caller instantiates `JudgeLLM()` — provider client is initialized, API key validated
2. Caller invokes `.judge(input_data)` with a `str`, `dict`, or other value
3. Agent-generated code formats input into a prompt string and calls the provider API
4. Raw API response text is parsed as JSON; falls back to raw string if JSON parse fails
5. For DataFrame mode: `judge_dataframe()` merges outputs and reference DataFrames on a join column, iterates in batches with tqdm progress, appends `judge_result` column, returns merged DataFrame

**State Management:**
- No persistent state in this repo — the agent definition is stateless
- Conversation state (user's answers to each step) is held in the Claude Code session context during invocation
- Generated files are the sole output artifact; they persist in the user's project

## Key Abstractions

**JudgeLLM Class (generated, not present in this repo):**
- Purpose: Importable module encapsulating a provider client and evaluation logic
- Examples: Generated into user's project as `judge_llm.py`
- Pattern: Single class, provider client initialized in `__init__`, evaluation logic in `.judge()` and `.judge_dataframe()`; no `if __name__ == "__main__"` block (importable only)

**JUDGE_SYSTEM_PROMPT (generated constant):**
- Purpose: Instructs the judge model to return structured JSON scores across configurable criteria
- Examples: Module-level constant in generated `judge_llm.py`
- Pattern: String constant with JSON schema embedded; criteria are customizable at generation time

**Provider Abstraction (code template selection):**
- Purpose: Swaps out the SDK import, client initialization, and API call pattern based on chosen provider
- Examples: Defined in `Agents/judge-llm-agent/.claude/agents/judge-llm.md` under "Client Setup" and "API Call Pattern" sections
- Pattern: Template substitution — agent selects the matching code block and inserts it at `<<< INSERT ... >>>` placeholders in the class template

## Entry Points

**Claude Code Agent Entry Point:**
- Location: `Agents/judge-llm-agent/.claude/agents/judge-llm.md`
- Triggers: `@judge-llm` explicit invocation, or natural-language phrases: "create a judge LLM", "evaluate my LLM responses", "build a judge to score model outputs", "I need an LLM evaluator"
- Responsibilities: Run the 5-step interactive workflow, select provider templates, generate output files

## Error Handling

**Strategy:** Fail-fast at initialization; graceful degradation at response parsing

**Patterns:**
- Generated code assigns `os.getenv("VAR_NAME")` to a temp variable and raises `RuntimeError` immediately if `None` — prevents silent auth failures mid-execution
- `.judge()` wraps JSON parsing in `try/except json.JSONDecodeError` and returns raw string as fallback — handles non-JSON LLM responses without crashing
- Inner join in `judge_dataframe()` intentionally drops unmatched rows — result length is always consistent with `judge_result` column, preventing index misalignment

## Cross-Cutting Concerns

**Security:** API keys accessed only via `os.getenv()`; never asked for or stored; custom remote endpoints warned to use HTTPS; data privacy reminder issued post-generation
**Validation:** API key presence validated at `JudgeLLM()` instantiation via `RuntimeError`
**Async concurrency:** Optional; uses `asyncio.Semaphore` with `run_in_executor` — wraps the synchronous `.judge()` call, so no async SDK is required regardless of provider

---

*Architecture analysis: 2026-03-09*
