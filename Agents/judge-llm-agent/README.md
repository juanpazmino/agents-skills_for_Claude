# Judge LLM Agent

A Claude Code subagent that generates a production-ready **Judge LLM** — a Python script that uses an LLM to evaluate and score outputs from other LLMs.

## What It Does

When invoked, the agent:
1. Asks which provider and model to use as the judge (Claude, OpenAI, Gemini, or any OpenAI-compatible API)
2. Asks what input format your data is in (DataFrame/CSV, prompt+response, or dictionary)
3. Collects schema details (column names, batch size, concurrency)
4. Asks for evaluation criteria (default: accuracy, helpfulness, clarity, safety)
5. Generates `judge_llm.py` and `requirements.txt` in your working directory

## Installation

Copy the `.claude/` folder into your project root (or any parent directory Claude Code will search):

```bash
cp -r .claude/ /your/project/
```

Or copy it to `~/.claude/` to make it available globally across all projects.

## How to Invoke

In Claude Code, just describe what you want:

```
create a judge LLM
evaluate my LLM responses
build a judge to score model outputs
I need an LLM evaluator
```

Or explicitly: `@judge-llm create a judge for my CSV outputs`

## What Gets Generated

### `judge_llm.py`

A complete Python script containing:

- **Client setup** — provider-specific SDK initialization; validates the env var is set and raises `RuntimeError` immediately if missing
- **`JUDGE_SYSTEM_PROMPT`** — customized for your chosen evaluation criteria
- **`judge_response(input_data)`** — accepts `dict`, `str`, or any value; returns parsed JSON dict or raw string on JSON parse failure
- **`judge_dataframe(outputs_df, reference_df, ...)`** — generic N-column batch judge; works with any CSV schema; returns merged DataFrame with `judge_result` column
- **`judge_dataframe_async(...)`** — optional async version with bounded concurrency (if requested)
- **`if __name__ == "__main__"`** — runnable demo matching your chosen input format

### `requirements.txt`

Only the dependencies needed for your chosen provider:

| Provider | Package |
|---|---|
| Claude (Anthropic) | `anthropic>=0.40.0` |
| OpenAI / Custom / Azure | `openai>=1.0.0` |
| Gemini | `google-generativeai>=0.8.0` |
| All modes | `pandas>=2.0.0`, `tqdm>=4.0.0` |

## API Key Handling

> **Never share your actual API key with the agent.** When asked, provide only the **environment variable name** (e.g., `ANTHROPIC_API_KEY`), not the key value itself. The agent will never read your `.env` file.

The agent handles key loading in this order:
1. **`load_dotenv` detected** — if your project already uses `python-dotenv`, the generated code will call `load_dotenv()` automatically so your `.env` variables are available at runtime.
2. **No `load_dotenv`** — the agent asks for the variable name and generates `os.getenv("YOUR_VARIABLE_NAME")`. You are responsible for setting that variable in your shell before running the script.

In both cases, only the **variable name** is ever referenced in the generated code. The actual key value is never stored, logged, or passed through the agent.

### Setting env vars safely

Add the variable to your shell profile (`~/.zshrc`, `~/.bashrc`) or a secrets manager. **Do not run `export MY_KEY=actual_value` directly in the terminal** — it gets saved to shell history in plaintext.

### Custom / remote endpoints

If you use a custom `base_url` (Ollama, Azure, LM Studio), ensure it uses `https://` for any non-localhost address. Sending an API key over plain `http://` to a remote host exposes it in transit.

### Data privacy

Your CSV rows, prompts, and dictionary values are sent **verbatim** to the chosen provider's API. If your data contains PII or confidential information, review your provider's data retention policy before running.

## Supported Providers

| Provider | SDK | API Key Env Var |
|---|---|---|
| Claude (Anthropic) | `anthropic` | `ANTHROPIC_API_KEY` |
| OpenAI | `openai` | `OPENAI_API_KEY` |
| Gemini (Google) | `google-generativeai` | `GOOGLE_API_KEY` |
| Ollama (local) | `openai` (custom base_url) | any string |
| Azure OpenAI | `openai` (AzureOpenAI) | `AZURE_OPENAI_API_KEY` |
| LM Studio / any OpenAI-compatible | `openai` (custom base_url) | varies |

## Input Format Support

### DataFrame / CSV (primary)
Two CSVs joined on an ID column. Best for batch evaluation of many rows.

```python
outputs = pd.read_csv("outputs.csv")
reference = pd.read_csv("reference.csv")
result = judge_dataframe(
    outputs, reference,
    join_col="id",
    output_cols=["response", "summary"],
    reference_cols=["ground_truth"],
)
result.to_csv("judged_outputs.csv", index=False)
```

### Prompt + Response
Evaluate a single string response:

```python
result = judge_response("The capital of France is Berlin.")
print(result)
# {"scores": {"accuracy": 1, ...}, "explanation": "..."}
```

### Dictionary
Evaluate structured key-value data:

```python
result = judge_response({
    "question": "What is the capital of France?",
    "response": "Berlin",
    "ground_truth": "Paris",
})
```

## Example Output

After generation, the agent shows:

```
Files created:
  judge_llm.py
  requirements.txt

Setup:
  # Ensure your API key variable is set in your environment (e.g., ANTHROPIC_API_KEY)
  pip install -r requirements.txt

Run demo:
  python judge_llm.py

Use in your code:
  from judge_llm import judge_dataframe, judge_response
```

The `judge_result` column in the output CSV contains structured JSON scores:

```json
{
  "scores": {
    "accuracy": 8,
    "helpfulness": 9,
    "clarity": 7,
    "safety": 10
  },
  "overall": 8,
  "explanation": "Response is mostly accurate and very helpful, though clarity could be improved."
}
```

## Verification

> **TODO**: Manually test the agent by invoking it in a project and verifying:
> - All four providers generate valid, runnable code
> - DataFrame mode handles inner join edge cases (mismatched IDs)
> - Async mode works without deadlocks
> - `judge_response` gracefully handles non-JSON LLM output
> - `requirements.txt` only includes provider-specific deps
> - Env var validation raises `RuntimeError` when variable is unset
> - Agent never asks for a real API key — only the variable name
> - HTTP warning appears when a non-localhost `base_url` is provided
> - Data privacy reminder appears in the post-generation summary
