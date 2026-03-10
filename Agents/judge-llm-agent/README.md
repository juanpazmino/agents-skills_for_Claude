# judge-llm

A Claude Code subagent that generates a production-ready, importable `JudgeLLM` Python module for evaluating and scoring outputs from other LLMs.

---

## Installation

Download or clone this folder, then register it in Claude Code under your preferred scope.

### Project (shared with team)

```bash
mkdir -p .claude/agents
cp -r judge-llm-agent/.claude/agents/judge-llm.md .claude/agents/
```

Commit `.claude/agents/judge-llm.md` to share it with the team.

### Local (you, this project only)

```bash
mkdir -p .claude/agents
cp -r judge-llm-agent/.claude/agents/judge-llm.md .claude/agents/
```

Add to `.gitignore`:
```
.claude/agents/
```

### Global (you, all projects)

```bash
cp judge-llm-agent/.claude/agents/judge-llm.md ~/.claude/agents/
```

---

## How to invoke

Say any of the following in a Claude Code session:

- "create a judge LLM"
- "evaluate my LLM responses"
- "build a judge to score model outputs"
- "I need an LLM evaluator"

Or invoke explicitly:
```
@judge-llm create a judge for my CSV outputs
```

The agent walks you through setup **one step at a time** — it asks each question and waits for your answer before continuing.

---

## What the agent generates

```
your-project/
├── judge_llm.py       # importable JudgeLLM class module (no __main__ block)
├── requirements.txt   # provider-specific dependencies only
└── .env.example       # placeholder showing the required env var name
```

### `judge_llm.py`

An importable module containing the `JudgeLLM` class:

| Method | Description |
|---|---|
| `JudgeLLM()` | Initializes the provider client; raises `RuntimeError` immediately if the API key env var is not set |
| `.judge(input_data)` | Accepts `dict`, `str`, or any value; returns parsed JSON dict or raw string on JSON parse failure |
| `.judge_dataframe(outputs_df, reference_df, ...)` | Generic N-column batch judge; returns the merged DataFrame with a `judge_result` column |
| `.judge_async(input_data, semaphore)` | Async version of `.judge()` with concurrency control (generated only if requested) |
| `.judge_dataframe_async(...)` | Async batch judge with bounded concurrency (generated only if requested) |
| `.judge_input_response(input_df, response_df, ...)` | Join input CSV (`id`, `text`) with response CSV (`id`, `col1`, ...) on ID, score each response column independently against the original input text |
| `.judge_input_response_async(...)` | Async version of `judge_input_response()` with bounded concurrency via semaphore (generated only if requested) |

### `requirements.txt`

Only the dependencies needed for your chosen provider:

| Provider | Package |
|---|---|
| Claude (Anthropic) | `anthropic>=0.40.0` |
| OpenAI / Custom / Azure | `openai>=1.0.0` |
| Gemini | `google-generativeai>=0.8.0` |
| All modes | `pandas>=2.0.0`, `tqdm>=4.0.0` |

### `.env.example`

```
# Copy this file to .env and fill in your actual key
ANTHROPIC_API_KEY=your-api-key-here
```

The variable name matches whatever you provide during setup. Copy to `.env`, fill in your key, and add `.env` to `.gitignore`.

---

## Workflow

The agent completes five steps in sequence, waiting for your answer at each before moving on:

1. **Provider & model** — Claude, OpenAI, Gemini, or any OpenAI-compatible API (Ollama, Azure, LM Studio)
2. **Input format** — single evaluation, DataFrame/CSV batch, or Input + Response CSVs
3. **DataFrame details** *(if DataFrame chosen)* — join column, output columns, reference columns, batch size, async concurrency
4. **Input + Response CSV details** *(if CSV mode chosen)* — ID column, input text column, response columns, num_batches, global eval type, async concurrency
5. **Evaluation criteria** — defaults: accuracy, helpfulness, clarity, safety; fully customizable
6. **Generate files** — writes `judge_llm.py`, `requirements.txt`, and `.env.example`

---

## Usage

After generation, import and use the class directly — no script execution required.

**DataFrame / CSV:**
```python
from judge_llm import JudgeLLM
import pandas as pd

judge = JudgeLLM()
result = judge.judge_dataframe(
    outputs_df, reference_df,
    join_col="id",
    output_cols=["response", "summary"],
    reference_cols=["ground_truth"],
)
result.to_csv("judged_outputs.csv", index=False)
```

**Input + Response CSVs:**
```python
from judge_llm import JudgeLLM
import pandas as pd

judge = JudgeLLM(client=client, model="<chosen-model>")

input_df = pd.read_csv("inputs.csv")       # columns: id, text
response_df = pd.read_csv("responses.csv") # columns: id, model_a, model_b

result = judge.judge_input_response(
    input_df=input_df,
    response_df=response_df,
    id_col="id",
    input_text_col="text",
    response_cols=["model_a", "model_b"],
    num_batches=10,        # splits data into 10 chunks for processing
    global_eval="average", # "average" | "comparison" | "synthesis"
)
result.to_csv("judged_responses.csv", index=False)
# Output columns: id, text, model_a, model_b,
#                 model_a_judge_result, model_b_judge_result, global_judge_result
```

**Prompt+Response or Dictionary:**
```python
from judge_llm import JudgeLLM

judge = JudgeLLM()
result = judge.judge({
    "question": "What is the capital of France?",
    "response": "Berlin",
    "ground_truth": "Paris",
})
print(result)
# {"scores": {"accuracy": 1, ...}, "overall": 2, "explanation": "..."}
```

---

## Supported providers

| Provider | SDK | Default env var |
|---|---|---|
| Claude (Anthropic) | `anthropic` | `ANTHROPIC_API_KEY` |
| OpenAI | `openai` | `OPENAI_API_KEY` |
| Gemini (Google) | `google-generativeai` | `GOOGLE_API_KEY` |
| Ollama (local) | `openai` (custom base_url) | any string |
| Azure OpenAI | `openai` (AzureOpenAI) | `AZURE_OPENAI_API_KEY` |
| LM Studio / OpenAI-compatible | `openai` (custom base_url) | varies |

---

## Security

- Never ask for your actual API key — only the environment variable name
- Generated code uses `os.getenv("VAR_NAME")` and raises `RuntimeError` immediately if the variable is unset
- `.env.example` uses placeholder values only; your real `.env` should be gitignored
- Custom remote endpoints are warned to use `https://` — plain `http://` to a non-localhost host exposes the key in transit
- CSV rows, prompts, and dictionary values are sent verbatim to the provider's API; review your provider's data retention policy before using with PII or confidential data
