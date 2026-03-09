# Testing Patterns

**Analysis Date:** 2026-03-09

## Overview

The `judge-llm-agent` directory contains no test files, no test framework configuration,
and no test runner setup. Testing is explicitly deferred to manual verification by the
user, as documented in `Agents/judge-llm-agent/plan.md`.

This document captures the manual test protocol specified in the plan and the testability
patterns built into the generated code, which are the closest analogs to a formal test
strategy for this codebase.

---

## Test Framework

**Runner:** None detected
**Assertion library:** None detected
**Config file:** None detected

No `pytest`, `unittest`, `jest`, or any other test framework is present or configured
in `Agents/judge-llm-agent/`.

---

## Manual Verification Protocol

The plan file (`Agents/judge-llm-agent/plan.md`) specifies a manual checklist under
`## Verification (TODO — user will do manually)`. This checklist is the authoritative
test plan for the agent.

**Checklist items (from `plan.md`):**

```
- [ ] Invoke agent in a test project, go through full flow for each provider
- [ ] Verify all 4 providers generate valid, runnable Python code
- [ ] Test DataFrame mode with mismatched IDs (inner join edge case)
- [ ] Test async mode for deadlocks or errors
- [ ] Confirm judge_response() gracefully handles non-JSON LLM output
- [ ] Confirm requirements.txt only includes provider-specific packages
- [ ] Confirm env var validation raises RuntimeError when variable is unset
- [ ] Confirm agent never asks for a real API key value — only variable name
- [ ] Confirm HTTP warning appears when a non-localhost base_url is used
- [ ] Confirm data privacy reminder appears in the post-generation summary
```

**How to run:** Invoke the agent in a Claude Code session using one of the trigger
phrases (e.g., "create a judge LLM"), walk through all five setup steps, and validate
each generated file against the checklist above.

---

## Testability Patterns in Generated Code

Although the agent itself has no automated tests, it is instructed to generate Python
code with testability built in. These patterns are enforced by the agent's code
generation rules.

### Fail-Fast Initialization

Generated `JudgeLLM.__init__` raises `RuntimeError` immediately if the API key env
var is unset:

```python
_api_key = os.getenv("ANTHROPIC_API_KEY")
if not _api_key:
    raise RuntimeError("ANTHROPIC_API_KEY environment variable is not set")
```

**Testability implication:** A test can verify this behavior by unsetting the env var
and asserting a `RuntimeError` is raised on class instantiation — no API call needed.

### JSON Fallback Return

Generated `judge()` returns either a `dict` (parsed JSON) or a `str` (raw response)
and never raises on a malformed API response:

```python
try:
    return json.loads(raw)
except json.JSONDecodeError:
    return raw
```

**Testability implication:** Tests can mock the API call to return invalid JSON and
assert the method returns a plain string rather than raising.

### Parameterized DataFrame Method

`judge_dataframe()` accepts all column names as parameters with no hardcoded schema:

```python
def judge_dataframe(
    self,
    outputs_df: pd.DataFrame,
    reference_df: pd.DataFrame,
    join_col: str,
    output_cols: list[str],
    reference_cols: list[str],
    batch_size: int = 10,
) -> pd.DataFrame:
```

**Testability implication:** Tests can pass minimal synthetic DataFrames to exercise
join logic, batch slicing, and result column alignment without requiring real API calls.

### No Side Effects Outside Return Values

The generated class stores no mutable state after `__init__`. All methods take inputs
and return outputs. No global state, no file I/O inside methods, no logging side effects.

**Testability implication:** All methods are pure functions of their inputs after
construction, making them straightforward to unit test with a mocked client.

---

## Recommended Test Approach (if tests are added)

Given the generated code's structure, the recommended approach for automated testing
would be:

**Framework:** `pytest` (standard Python choice; no reason to use anything else for
a single-module library)

**Mocking:** `unittest.mock.patch` to mock the provider SDK client and control API
responses

**Test file location:** Co-located at `judge_llm_test.py` or in a `tests/` directory
alongside the generated `judge_llm.py` in the user's project

**Example test structure:**

```python
# tests/test_judge_llm.py
import pytest
from unittest.mock import MagicMock, patch
from judge_llm import JudgeLLM

def test_raises_on_missing_api_key(monkeypatch):
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    with pytest.raises(RuntimeError, match="ANTHROPIC_API_KEY"):
        JudgeLLM()

def test_judge_returns_dict_on_valid_json(mock_client):
    judge = JudgeLLM()
    judge.client = mock_client  # inject mock
    mock_client.messages.create.return_value.content[0].text = '{"scores": {"accuracy": 5}}'
    result = judge.judge("some response")
    assert isinstance(result, dict)
    assert "scores" in result

def test_judge_returns_string_on_invalid_json(mock_client):
    judge = JudgeLLM()
    judge.client = mock_client
    mock_client.messages.create.return_value.content[0].text = "not json"
    result = judge.judge("some response")
    assert isinstance(result, str)

def test_judge_dataframe_adds_result_column():
    import pandas as pd
    judge = JudgeLLM()
    judge.judge = MagicMock(return_value={"scores": {"accuracy": 5}})
    outputs_df = pd.DataFrame({"id": [1, 2], "response": ["a", "b"]})
    reference_df = pd.DataFrame({"id": [1, 2], "ground_truth": ["x", "y"]})
    result = judge.judge_dataframe(
        outputs_df, reference_df,
        join_col="id",
        output_cols=["response"],
        reference_cols=["ground_truth"],
    )
    assert "judge_result" in result.columns
    assert len(result) == 2
```

**What to mock:**
- Provider SDK client (`.messages.create`, `.chat.completions.create`, etc.)
- `os.getenv` when testing key validation

**What NOT to mock:**
- The `json.loads` / `json.JSONDecodeError` path — test with real strings
- DataFrame merge logic — test with real `pd.DataFrame` objects

---

## Edge Cases Specified in Plan

These edge cases are explicitly called out in `Agents/judge-llm-agent/plan.md` and
should be covered if automated tests are ever added:

| Edge Case | Method | Assertion |
|---|---|---|
| Missing API key env var | `__init__` | `RuntimeError` raised |
| Non-JSON LLM response | `judge()` | Returns raw `str`, no exception |
| Mismatched IDs in DataFrames | `judge_dataframe()` | Rows without match are dropped (inner join) |
| Async deadlocks | `judge_dataframe_async()` | Completes without hanging |
| `requirements.txt` bloat | File generation | Only provider-specific packages included |

---

## Coverage

**Requirements:** None enforced (no coverage tooling configured)
**Current state:** No automated tests exist; all verification is manual

---

*Testing analysis: 2026-03-09*
