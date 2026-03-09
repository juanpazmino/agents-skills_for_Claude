# Coding Conventions

**Analysis Date:** 2026-03-09

## Context

This codebase consists of Claude Code subagent definitions. The primary artifact is
`.claude/agents/judge-llm.md` — a Markdown document with YAML front matter that specifies
agent behavior and code generation templates. The agent itself generates Python files
(`judge_llm.py`, `requirements.txt`, `.env.example`) into user projects. Conventions
below cover both the agent definition format and the Python code the agent produces.

---

## Agent Definition Format (`.claude/agents/*.md`)

### Front Matter

Every agent definition opens with a YAML front matter block. Required fields:

```yaml
---
name: judge-llm
description: "Use this agent when... <trigger phrases>"
model: sonnet
color: purple
---
```

- `name`: kebab-case, matches the filename without the `.md` extension
- `description`: begins with "Use this agent when..." framing and lists natural-language
  invocation phrases inside the string
- `model`: `sonnet` across all agents in this repo
- `color`: arbitrary label; no enforced palette

Reference file: `Agents/judge-llm-agent/.claude/agents/judge-llm.md`
Comparison reference: `Agents/notebook-to-project-agent/.claude/agents/notebook-to-project.md`

### Workflow Step Pattern

Each step that requires user input follows this exact pattern:

```markdown
### Step N: Step Title

**Ask the following, then wait for the user's reply before continuing to Step N+1.**

[Question text]
```

The bolded "Ask... then wait" instruction is required on every blocking step. This is
the canonical signal to the agent to pause and not proceed until the user replies.

### Section Hierarchy

```
## Your Workflow
  ### Step 1: ...
  ### Step N: ...
## Code Generation Templates
  ### Client Setup (per provider)
  ### API Call Pattern (per provider)
  ### JudgeLLM Class Template
## Judge System Prompt Template
## Requirements.txt Templates
## After Generating Files
```

Templates are placed after workflow steps, separated by `---` horizontal rules between
major sections.

### Code Blocks in Agent Definitions

All code samples use fenced code blocks with explicit language identifiers:

- ` ```python ` for Python
- ` ```bash ` for shell commands
- ` ```yaml ` for YAML

No unlabeled code blocks. Template insertion points use `<<< UPPERCASE DESCRIPTION >>>`
comment markers:

```python
# <<< INSERT PROVIDER-SPECIFIC IMPORTS HERE >>>
# <<< INSERT PROVIDER CLIENT SETUP HERE (from Client Setup templates) >>>
# <<< INSERT PROVIDER API CALL HERE (from API Call Pattern templates) >>>
```

---

## Generated Python Code Conventions

These conventions describe what `judge-llm` is instructed to generate in `judge_llm.py`.

### Naming

**Files:**
- `snake_case.py` for all generated Python files
- `judge_llm.py` — module name matches agent name in snake_case

**Classes:**
- `PascalCase` with acronyms as a single token: `JudgeLLM` not `JudgeLlm`

**Methods:**
- `snake_case`: `judge`, `judge_dataframe`, `judge_async`, `judge_dataframe_async`
- Async variants are named by appending `_async` to the sync counterpart

**Constants (module-level):**
- `SCREAMING_SNAKE_CASE`: `MODEL`, `JUDGE_SYSTEM_PROMPT`

**Private intermediate variables:**
- `_leading_underscore`: `_api_key`

**Local variables:**
- `snake_case`: `raw`, `ref_keep`, `row_data`, `merged`, `batch`

### Import Organization

```python
# 1. Standard library
import os
import json
import asyncio  # only if async mode was requested

# 2. Third-party
import pandas as pd
from tqdm import tqdm
from anthropic import Anthropic  # or provider-specific SDK

# 3. Optional dotenv (only if load_dotenv detected in target project)
from dotenv import load_dotenv
load_dotenv()
```

All imports at module top level. No path aliases. No barrel imports. The `asyncio`
import inside async methods is the only lazy import (used when async was not the
primary generation mode).

### Error Handling

**API key validation — mandatory on every provider, placed in `__init__`:**

```python
_api_key = os.getenv("ANTHROPIC_API_KEY")
if not _api_key:
    raise RuntimeError("ANTHROPIC_API_KEY environment variable is not set")
client = Anthropic(api_key=_api_key)
```

Rules:
- Assign `os.getenv()` to a temp variable; never pass it directly to the constructor
- Raise `RuntimeError` (not `ValueError`, not `Exception`)
- Message must include the exact env var name
- Fail at module initialization time, not at first API call

**JSON parse fallback — sole try/except in the module:**

```python
try:
    return json.loads(raw)
except json.JSONDecodeError:
    return raw  # return as plain text if model didn't produce valid JSON
```

All other errors propagate naturally without catching.

**Return type annotation:**

```python
def judge(self, input_data) -> dict | str:
```

Uses `dict | str` union (Python 3.10+ syntax) to document the fallback behavior.

### Function Design

**`judge()` — input normalization pattern:**

```python
def judge(self, input_data) -> dict | str:
    if isinstance(input_data, str):
        content = f"Response to evaluate:\n{input_data}"
    elif isinstance(input_data, dict):
        content = "\n".join(f"**{k}**: {v}" for k, v in input_data.items())
    else:
        content = str(input_data)
```

- f-strings for all string formatting (not `.format()` or `%`)
- Generator expressions preferred over list comprehensions when the result is joined
  into a string

**`judge_dataframe()` — batch processing pattern:**

```python
ref_keep = [join_col] + [c for c in reference_cols if c != join_col]
merged = outputs_df.merge(reference_df[ref_keep], on=join_col).reset_index(drop=True)
results = []
for i in tqdm(range(0, len(merged), batch_size), desc="Judging batches"):
    batch = merged.iloc[i:i + batch_size]
    for _, row in batch.iterrows():
        row_data = {col: row[col] for col in reference_cols + output_cols}
        results.append(self.judge(row_data))
merged["judge_result"] = results
return merged
```

- `tqdm` wraps the outer batch loop, not the inner row loop
- Results collected into a plain list then assigned as a column in one operation —
  no row-by-row DataFrame mutation
- `.reset_index(drop=True)` on the merged DataFrame guarantees index alignment with
  the `results` list
- Returns the merged DataFrame (inner join result), not the original input DataFrames

**Async pattern:**

```python
async def judge_async(self, input_data, semaphore) -> dict | str:
    import asyncio
    async with semaphore:
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self.judge, input_data)
```

- Wraps sync SDK calls via `run_in_executor` — no async SDK required
- `asyncio.Semaphore` is passed as a parameter (not created inside the method)
- Generated only when the user requests async mode during setup

### Docstrings

One-line docstring for simple methods. Multi-line for methods with non-obvious behavior:

```python
def judge_dataframe(...) -> pd.DataFrame:
    """Generic N-column judge. No hardcoded schema.
    Returns the MERGED df (inner join on join_col) with 'judge_result' column added.
    Rows without a match in reference_df are dropped by the merge.
    """
```

- First line is a summary sentence
- Subsequent lines explain edge cases and non-obvious behavior
- No `:param:` or `Args:` blocks

### Module Design

- No `if __name__ == "__main__":` block — `judge_llm.py` is explicitly an importable module
- One class per file (`JudgeLLM`)
- Module-level constants appear after imports: `JUDGE_SYSTEM_PROMPT`, `MODEL`
- Class is effectively stateless after `__init__` — only the API client and model
  name are stored as instance attributes; no mutable state

### Security Conventions (enforced by agent code generation rules)

- Never hard-code API key values; always use `os.getenv("VAR_NAME")`
- Warn on `http://` for non-localhost `base_url` in custom provider setup
- `.env.example` uses placeholder values only; real `.env` is always gitignored
- The agent never asks for actual key values, only environment variable names
- Remind users that CSV rows / prompts / dicts are sent verbatim to external APIs;
  review provider data retention policy before using with PII

---

## Markdown / Documentation Conventions

### README.md Structure

```
# Title (H1, matches agent name)
One-sentence description
---
## Installation
  ### Project (shared with team)
  ### Local (you, this project only)
  ### Global (you, all projects)
---
## How to invoke
## What the agent generates
  (output file tree, method table)
## Workflow
## Usage
  (code examples per input format)
## Supported providers
## Security
```

Reference file: `Agents/judge-llm-agent/README.md`

### Table Formatting

```markdown
| Column | Column |
|---|---|
| value  | value  |
```

Minimal padding in the separator row (`|---|---|` not `|:---|:---|`).

### Code Blocks in README

- Always labeled with a language identifier
- Installation bash commands use `cp` / `mkdir` directly without additional prose explanation

---

*Convention analysis: 2026-03-09*
