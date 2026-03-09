# External Integrations

**Analysis Date:** 2026-03-09

## Overview

This agent generates code that integrates with external LLM provider APIs. The integrations
described below exist in the **generated `judge_llm.py`**, not in the agent definition file itself.
The agent definition (`.claude/agents/judge-llm.md`) contains no runtime integrations.

## LLM Provider APIs

The generated module supports one provider per invocation, chosen interactively:

**Anthropic (Claude):**
- What it's used for: Judge LLM inference — evaluating and scoring other LLM outputs
- SDK: `anthropic>=0.40.0`
- Client: `from anthropic import Anthropic`
- API call: `client.messages.create(model=MODEL, max_tokens=1024, system=..., messages=[...])`
- Auth env var: `ANTHROPIC_API_KEY`
- Supported models: `claude-opus-4-6`, `claude-sonnet-4-6`, `claude-haiku-4-5-20251001`, or user-specified

**OpenAI:**
- What it's used for: Judge LLM inference
- SDK: `openai>=1.0.0`
- Client: `from openai import OpenAI`
- API call: `client.chat.completions.create(model=MODEL, messages=[...], max_tokens=1024)`
- Auth env var: `OPENAI_API_KEY`
- Supported models: `gpt-4o`, `gpt-4`, `gpt-3.5-turbo`, or user-specified

**Google Gemini:**
- What it's used for: Judge LLM inference
- SDK: `google-generativeai>=0.8.0`
- Client: `import google.generativeai as genai; genai.configure(api_key=...)`
- API call: `client.generate_content(f"{JUDGE_SYSTEM_PROMPT}\n\n{content}")`
- Auth env var: `GOOGLE_API_KEY`
- Supported models: `gemini-2.0-flash`, `gemini-1.5-pro`, `gemini-1.5-flash`, or user-specified

**Azure OpenAI:**
- What it's used for: Judge LLM inference via Azure-hosted OpenAI models
- SDK: `openai>=1.0.0` (uses `AzureOpenAI` client class)
- Client: `from openai import AzureOpenAI`
- Auth env vars: `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_ENDPOINT`
- Endpoint requirement: must use `https://` (enforced by agent security rule)
- API version: `2024-02-01`

**Custom / OpenAI-compatible (Ollama, LM Studio, other):**
- What it's used for: Judge LLM inference via local or self-hosted endpoints
- SDK: `openai>=1.0.0` (OpenAI SDK with custom `base_url`)
- Client: `OpenAI(api_key=..., base_url="http://localhost:11434/v1")`
- Auth env var: user-defined (agent asks for the variable name, never the value)
- Security constraint: `http://` only permitted for `localhost`/`127.0.0.1`; remote endpoints must use `https://`
- Example local model: Ollama with `llama3`

## Data Storage

**Databases:**
- None. The agent and generated code use no database layer.

**File Storage:**
- Local filesystem only. The agent writes `judge_llm.py`, `requirements.txt`, and `.env.example`
  directly to the user's current working directory via Claude Code's Write tool.
- Output data (judged DataFrames) is written to CSV by the user's calling code, e.g.,
  `result.to_csv("judged_outputs.csv", index=False)`.

**Caching:**
- None detected.

## Authentication & Identity

**Auth Provider:**
- No centralized auth provider. Each LLM provider uses its own API key.
- Pattern: `os.getenv("VAR_NAME")` → raises `RuntimeError` immediately if unset.
- The agent never stores, requests, or uses real API key values — only env var names.

## Monitoring & Observability

**Error Tracking:**
- None. The generated code surfaces errors via Python exceptions (`RuntimeError`, `json.JSONDecodeError`).

**Logs:**
- None. Progress is surfaced via `tqdm` progress bars during batch processing.

## CI/CD & Deployment

**Hosting:**
- Not applicable. This is a Claude Code subagent, not a deployed service.

**CI Pipeline:**
- None detected.

## Environment Configuration

**Required env vars (set by user before running generated code):**
- `ANTHROPIC_API_KEY` — Anthropic provider
- `OPENAI_API_KEY` — OpenAI provider
- `GOOGLE_API_KEY` — Gemini provider
- `AZURE_OPENAI_API_KEY` + `AZURE_OPENAI_ENDPOINT` — Azure OpenAI provider
- Custom variable name (user-defined) — Ollama / LM Studio / custom providers

**Secrets location:**
- User's `.env` file (gitignored) or shell environment (`~/.zshrc` / `~/.bashrc`)
- Agent explicitly warns users NOT to run `export API_KEY=actual_value` in the terminal
  (shell history exposure)

## Webhooks & Callbacks

**Incoming:**
- None.

**Outgoing:**
- LLM provider API calls only (synchronous via SDK, or async via `asyncio.run_in_executor`)

## Data Privacy Notes

The agent surfaces an explicit warning to users: CSV rows, prompt strings, and dictionary values
are sent verbatim to the chosen provider's external API. Users with PII or confidential data
are directed to review their provider's data retention policy before use.

---

*Integration audit: 2026-03-09*
