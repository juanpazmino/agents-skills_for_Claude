# structured-outputs

Refactors LLM code from fragile JSON-string prompting patterns (`json.loads()`, "Reply ONLY with valid JSON") to provider-native structured outputs using Pydantic models and `.parse()` / `response_format=`.

---

## Skill structure

```
structured-outputs/
├── SKILL.md                        # Skill definition and 7-step workflow
└── references/
    ├── pydantic-patterns.md        # Type mapping, enums, nested models, Optional, List
    └── provider-apis.md            # OpenAI, Azure, Anthropic, LangChain call signatures
```

---

## Installation

Choose the scope that fits your use case:

| Scope | Who it affects | Config location |
|-------|---------------|-----------------|
| `user` (default) | You, across all projects | `~/.claude/skills/` |
| `project` | Everyone on the repo | `.claude/skills/` (committed) |
| `local` | You, this project only | `.claude/skills/` (gitignored) |

**User — available in all your projects:**

```bash
cp -r structured-outputs ~/.claude/skills/
```

**Project — shared with the team:**

```bash
cp -r structured-outputs .claude/skills/
git add .claude/skills/structured-outputs
git commit -m "Add structured-outputs skill"
```

**Local — only you, only this project:**

```bash
cp -r structured-outputs .claude/skills/
echo ".claude/skills/" >> .gitignore
```

---

## Verify the skill is loaded

Inside any Claude Code session run:

```
/structured-outputs
```

---

## Triggers

Use this skill when you need to:

- Replace `json.loads()` calls on LLM responses with type-safe Pydantic models
- Eliminate "Reply ONLY with valid JSON" instructions from prompts
- Adopt `response_format=` or `.parse()` for OpenAI / Azure structured outputs
- Use `with_structured_output()` in LangChain
- Use tool-forcing or `instructor` for Anthropic structured responses

Trigger phrases: `"refactor JSON output"`, `"structured outputs"`, `"Pydantic response_format"`, `".parse()"`, `"json.loads on LLM response"`, `"stop prompting JSON"`, `"type-safe LLM responses"`.

---

## Usage

```
/structured-outputs
```

Point Claude at the file or paste the code block. The skill reads the code, identifies the provider, proposes the Pydantic model structure, and **waits for your approval** before writing any refactored code. Once approved, it rewrites the full code block with correct provider API calls and removes all JSON-prompting boilerplate.

Supported providers: OpenAI, Azure OpenAI, Anthropic (raw SDK + instructor), LangChain.
