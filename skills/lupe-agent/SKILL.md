# Lupe Agent Workflow

Use this skill when working in a repository that uses LupeHub/Lupe for
agent-native source control, or when the user asks you to save/checkpoint agent
work with Lupe.

Lupe is source control for agents:

- `prompt` records a user prompt and creates the meaningful checkpoint/task node.
- `checkpoint` creates a meaningful prompt/task node with the full prompt attached. Prefer `lupe prompt`.
- `save` creates a cheap source-state snapshot inside the current checkpoint.
- Saves are intentionally frequent and local.
- Git/GitHub are not Lupe's backend.

## Project Setup — Do This First

At the start of any session in a new project, check for `.lupeignore` and
`.lupeshared`. If either is missing, detect the stack and create them.

Detect stack: `package.json` → Node, `Cargo.toml` → Rust, `requirements.txt`/
`pyproject.toml` → Python, `go.mod` → Go, `pom.xml`/`build.gradle` → Java.

**`.lupeignore`** — what lupe does NOT snapshot. Auto-created on first
`lupe prompt` with generic defaults, but you should create it early with
stack-specific content (e.g. `dist`, `.next`, `__pycache__`).

**`.lupeshared`** — what gets symlinked instead of copied into `lupe workspace`
forks. List expensive-to-reinstall dirs: `node_modules`, `target`, `.venv`.
Only include entries that exist in the project.

## Workflow

At the start of every user request that may modify files, run:

```bash
lupe prompt "<full user prompt>"
```

Use `--title` only when you need to override the derived short title:

```bash
lupe prompt "<full user prompt>" --title "<short summary>"
```

During implementation, run:

```bash
lupe save "<short description>"
```

Save after each coherent functional unit:

- after a meaningful edit batch
- before a risky refactor
- before trying another approach
- after tests pass
- after fixing a failure
- before restore/destructive operations

Use Lupe for recovery and memory:

```bash
lupe history
lupe prompts
lupe saves
lupe graph
lupe search "<topic>"
lupe diff
lupe diff <from-save-uuid> <to-save-uuid>
lupe restore <save-uuid>
```

Before restoring, create a save if the current workspace has useful changes.

## Current Commands

```bash
lupe status
lupe prompt "full user prompt"
lupe checkpoint "task summary" --prompt "full user prompt"
lupe save "save summary"
lupe history
lupe prompts
lupe saves
lupe graph
lupe search "query"
lupe diff
lupe diff <save-a-uuid> <save-b-uuid>
lupe restore <save-uuid>
lupe install-agent
```

Storage starts automatically. If Lupe finds `.lupe` in the current directory or
a parent, it uses that project store. If not, it creates `.lupe` in the current
workspace. Use `lupe status` to inspect the database/object-store paths and
mode. Use `LUPE_HOME` or `--home` to override the storage location.

`lupe install-agent` writes or appends Lupe instructions to `AGENTS.md` in the
current workspace.

## Maintenance

When Lupe changes, update this skill in the same change:

- command names or flags
- checkpoint/save terminology
- storage behavior
- restore/diff/search behavior
- agent workflow expectations
