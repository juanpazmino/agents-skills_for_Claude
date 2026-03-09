# Codebase Structure

**Analysis Date:** 2026-03-09

## Directory Layout

```
Agents/judge-llm-agent/
├── .claude/
│   └── agents/
│       └── judge-llm.md    # Agent definition: YAML front matter + full behavior spec
├── README.md               # Installation, invocation, generated file docs, security notes
└── plan.md                 # Design rationale, key decisions, verification checklist
```

**Repo-level context (sibling agents follow same pattern):**
```
Agents/
├── judge-llm-agent/        # This agent
└── notebook-to-project-agent/
    ├── .claude/
    │   ├── agent-memory/   # Persistent memory files (not present in judge-llm-agent)
    │   └── agents/
    │       └── notebook-to-project.md
    └── README.md
```

## Directory Purposes

**`.claude/agents/`:**
- Purpose: Holds the agent definition file that Claude Code loads when the agent is invoked
- Contains: One `.md` file per agent, named to match the agent's `name` field in YAML front matter
- Key files: `Agents/judge-llm-agent/.claude/agents/judge-llm.md`

**Root of `judge-llm-agent/`:**
- Purpose: Top-level container for all files shipped with this agent
- Contains: The `.claude/` config directory, human-facing README, and design plan
- Key files: `Agents/judge-llm-agent/README.md`, `Agents/judge-llm-agent/plan.md`

## Key File Locations

**Agent Definition (primary artifact):**
- `Agents/judge-llm-agent/.claude/agents/judge-llm.md`: YAML front matter declaring `name`, `description`, `model`, `color`; full workflow instructions; all code generation templates; system prompt template; requirements templates

**Documentation:**
- `Agents/judge-llm-agent/README.md`: End-user guide — installation (project/local/global scopes), invocation phrases, generated file descriptions, provider table, usage examples, security notes

**Design Record:**
- `Agents/judge-llm-agent/plan.md`: Original design plan — agent workflow outline, key design decisions, security decisions, manual verification checklist

## Naming Conventions

**Files:**
- Agent definition files use kebab-case matching the agent `name` field: `judge-llm.md` for `name: judge-llm`
- Documentation files use standard names: `README.md` (uppercase), `plan.md` (lowercase by convention in this repo)

**Directories:**
- Agent container directories use kebab-case with `-agent` suffix: `judge-llm-agent/`
- Claude Code config directory follows the fixed convention: `.claude/agents/`

**Agent names (YAML `name` field):**
- kebab-case: `judge-llm`
- Must match the filename of the agent `.md` file (without extension)

## Where to Add New Code

**New agent workflow step:**
- Edit: `Agents/judge-llm-agent/.claude/agents/judge-llm.md`
- Add a new `### Step N` section inside the `## Your Workflow` block
- Follow the existing pattern: bold heading, instruction to ask and wait, explicit STOP directive

**New provider support:**
- Edit: `Agents/judge-llm-agent/.claude/agents/judge-llm.md`
- Add provider to the Step 1 options list
- Add a client setup block under `### Client Setup (per provider)`
- Add an API call block under `### API Call Pattern (per provider)`
- Add an entry under `### Requirements.txt Templates`
- Update: `Agents/judge-llm-agent/README.md` — add row to the supported providers table

**New agent (following this pattern):**
- Create: `Agents/<name>-agent/.claude/agents/<name>.md`
- Create: `Agents/<name>-agent/README.md`
- Optionally create: `Agents/<name>-agent/plan.md`

**Agent memory (persistent cross-session context):**
- Create: `Agents/<name>-agent/.claude/agent-memory/<name>/MEMORY.md`
- Pattern observed in: `Agents/notebook-to-project-agent/.claude/agent-memory/`

## Special Directories

**`.claude/agents/`:**
- Purpose: Claude Code reads this directory to discover and register available subagents
- Generated: No — manually authored
- Committed: Yes for project-scope agents; add to `.gitignore` for local-only agents

**`Agents/judge-llm-agent/` (the shipping container):**
- Purpose: Isolates the agent and its docs so it can be copied independently into any project
- Generated: No
- Committed: Yes

---

*Structure analysis: 2026-03-09*
