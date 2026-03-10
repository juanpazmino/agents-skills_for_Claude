---
name: structured-outputs
description: |
  Refactors LLM code from fragile JSON-string prompting patterns (json.loads(),
  "Reply ONLY with valid JSON") to provider-native structured outputs using Pydantic
  models and .parse() / response_format=.
  Use when the user says: "refactor JSON output", "structured outputs",
  "Pydantic response_format", ".parse()", "json.loads on LLM response",
  "stop prompting JSON", "type-safe LLM responses", or wants to replace
  json.loads(), eliminate "Reply ONLY with valid JSON", or use response_format=.
---

## Workflow

### Step 1 — Analyze

Read the target code. Identify:
- **Provider**: OpenAI / AzureOpenAI / Anthropic (raw or instructor) / LangChain
- **JSON schema**: Extract from the prompt string (keys, types, nesting)
- **Enum candidates**: Pipe-delimited literals like `"a|b|c"` → `class T(str, Enum)`
- **Nested objects**: `{...}` fields → separate `BaseModel` subclasses
- **Lists**: `[{...}]` → `List[SubModel]`, `[string]` → `List[str]`
- **Optional/nullable**: Fields described as optional or nullable → `Optional[T] = None`
- **Authoritative schema**: If code ends with `MyModel(**result)`, treat that model as ground truth

Load `references/pydantic-patterns.md` now.

---

### Step 2 — Internal Validation (silent — do not show to user)

Before proposing anything, verify the structure internally:
- All enum values match exactly the literals in the original schema
- All nested models are defined before they are referenced (Enums → leaves → composites)
- Every list field uses `List[T]`, every nullable field uses `Optional[T] = None`
- No circular dependencies between models
- The model hierarchy can round-trip the original JSON schema without data loss

Fix any issues found. Do not show the user a structure that fails internal checks.

---

### Step 3 — Propose

Present the validated Pydantic model set. Order: Enums first, leaf models before composites.
Annotate each non-obvious type decision with a brief inline comment.

**STOP. Do not write any refactored code yet.**

---

### Step 4 — Await Approval (BLOCKING)

Ask explicitly:

> "Does this structure match your intent? Type `yes` to proceed or describe any changes."

Do not continue until the user types `yes` or an explicit approval.

---

### Step 5 — Modification Loop

If the user requests changes:
1. Apply ALL requested changes
2. Re-run internal validation (Step 2 checks)
3. Re-present the **complete** updated model set (never partial)
4. Ask for approval again (return to Step 4)

Repeat until approved.

---

### Step 6 — Refactor

Load `references/provider-apis.md`.

Rewrite the full code block:
- Model definitions at the top
- Simplified prompt (semantic intent only — no JSON schema instructions, no "Reply ONLY with JSON")
- Provider-correct API call with `response_format=` or `.parse()` or equivalent
- Direct result accessor (no `json.loads`, no `**result` unpacking)

Show the **complete** refactored code, never a diff.

---

### Step 7 — Offer Follow-ups

After delivering the refactored code, offer:
- Field-level `Field(description=..., ge=..., le=...)` constraints
- Refusal handling (checking `message.refusal` for OpenAI)
- Additional `Optional` fields for robustness
