# Plan: Judge LLM Agent

## Context
A Claude Code subagent that creates a **Judge LLM** — a Python script that evaluates/scores the outputs of other LLMs. The agent asks which provider and model to use, then generates the appropriate Python code with client setup, judge logic, and batching. Supports Claude (Anthropic), OpenAI, Gemini (Google), and any Custom/OpenAI-compatible API (Ollama, Azure, etc.).

Follows the existing agent pattern from `Agents/notebook-to-project-agent/`.

---

## Files Created

### 1. `Agents/judge-llm-agent/.claude/agents/judge-llm.md`
The agent definition (YAML front matter + behavior spec).

**Agent workflow:**
1. Ask which provider + model — for each provider suggest common models but always offer **"Other: ____"**:
   - **Claude (Anthropic SDK)**: `claude-opus-4-6`, `claude-sonnet-4-6`, `claude-haiku-4-5-20251001`, Other: ____
   - **OpenAI**: `gpt-4o`, `gpt-4`, `gpt-3.5-turbo`, Other: ____
   - **Gemini (Google)**: `gemini-2.0-flash`, `gemini-1.5-pro`, `gemini-1.5-flash`, Other: ____
   - **Custom / OpenAI-compatible** (Ollama, Azure OpenAI, LM Studio, etc.): user provides `base_url`, **env variable name** for the api_key (never the key itself), and model name
2. Ask what **input format** the data will be:
   - **DataFrame/CSV** (most common)
   - **Prompt + response**
   - **Dictionary**
3. If DataFrame: ask for join/ID column, output columns, reference columns, batch size, async preference
4. Ask for evaluation criteria (default: accuracy, helpfulness, clarity, safety)
5. Generate `judge_llm.py` with SDK setup, judge prompt, `judge_response()`, `judge_dataframe()`, `__main__` demo
6. Generate `requirements.txt` with only the deps for the chosen provider
7. Show usage summary

### 2. `Agents/judge-llm-agent/README.md`
Documentation covering what the agent does, installation, invocation, generated files, and examples.

---

## Input Format Support

1. **DataFrame/CSV (primary, generic N-column)** — Two DataFrames joined on an ID column. Fully parameterized — no hardcoded column names. Supports batching (configurable batch_size, tqdm progress, optional asyncio concurrency).
2. **Simple prompt+response** — A single string evaluated at a time.
3. **Dictionary** — A `dict` mapping field names to values.

---

## Key Design Decisions

- `judge_dataframe()` returns the **merged** df (not original) to avoid length mismatch after inner join — `judge_result` column always aligns with rows.
- `judge_response()` wraps JSON parse in try/except and falls back to raw string — handles models that don't always return valid JSON.
- `requirements.txt` includes **only** provider-specific deps — no bloat.
- Async version uses `asyncio.Semaphore` for bounded concurrency via `run_in_executor` — no async SDK required.

## Security Decisions

- **API key handling order**: (1) detect `load_dotenv` in project → use it; (2) if not found, ask for the env variable name; (3) generate `os.getenv("VAR_NAME")`. The agent never asks for or stores real key values.
- **Env var validation**: generated code assigns `os.getenv()` to a temp variable and raises `RuntimeError` immediately if it is `None` — prevents silent auth failures.
- **HTTP warning**: if `base_url` is not `localhost`/`127.0.0.1`, the agent warns the user to use `https://` to avoid transmitting the API key in plaintext.
- **Shell history**: agent instructs users to set env vars via shell profile or secrets manager — not via `export KEY=value` in the terminal (gets saved to history).
- **Data privacy**: agent reminds users that CSV rows / prompts / dicts are sent verbatim to the chosen external API — they should review their provider's data retention policy if data contains PII.

---

## Verification (TODO — user will do manually)

- [ ] Invoke agent in a test project, go through full flow for each provider
- [ ] Verify all 4 providers generate valid, runnable Python code
- [ ] Test DataFrame mode with mismatched IDs (inner join edge case)
- [ ] Test async mode for deadlocks or errors
- [ ] Confirm `judge_response()` gracefully handles non-JSON LLM output
- [ ] Confirm `requirements.txt` only includes provider-specific packages
- [ ] Confirm env var validation raises `RuntimeError` when variable is unset
- [ ] Confirm agent never asks for a real API key value — only variable name
- [ ] Confirm HTTP warning appears when a non-localhost `base_url` is used
- [ ] Confirm data privacy reminder appears in the post-generation summary
