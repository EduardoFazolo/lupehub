# Lupe Agent Workflow

Lupe is agent-native source control. It is not Git, and it does not use GitHub,
Docker, Postgres, or a server in the current implementation.

Use Lupe whenever you are acting as an agent in a workspace and may change files.

## Core Concepts

- `prompt` records a user prompt and creates the meaningful checkpoint/task node.
- A `checkpoint` is the meaningful prompt/task node. Prefer `lupe prompt` so the full prompt is always attached.
- A `save` is a cheap source-state snapshot inside the current checkpoint. Create saves freely during work.
- A `fork` is a named pointer to a save — a named branch point you can restore to by name.
- `history` shows checkpoints with prompt snippets.
- `prompts` shows the full prompt history.
- `saves` shows saved states.
- `graph` shows a colored terminal graph of checkpoints and nested saves.
- `diff` with no args compares the latest two saves in the current checkpoint.
- `restore` restores a saved state (by UUID or fork name) into the workspace.
- `search` searches remembered checkpoint/save text.

## Project Setup — Do This First

At the start of any session in a new project, check for `.lupeignore`. If missing,
detect the stack and create it.

**Detect stack by looking for:**
- `package.json` → Node/JS/TS
- `Cargo.toml` → Rust
- `requirements.txt` / `pyproject.toml` / `uv.lock` → Python
- `go.mod` → Go
- `pom.xml` / `build.gradle` → Java/Kotlin
- Multiple of the above → monorepo, include all

**`.lupeignore`** — what lupe will NOT snapshot (auto-created on first `lupe prompt`
with generic defaults, but create it earlier with stack-specific content):

```
# Node
node_modules
dist
.next
.nuxt
out

# Rust
target

# Python
.venv
__pycache__
*.pyc
.pytest_cache

# General
.git
.lupe
build
```

## Required Agent Behavior

The stop hook auto-captures every user message and agent response.
If the host has `lupe install-hooks` configured, `lupe prompt` and `lupe respond`
are called automatically after each turn — no manual calls needed.

During work, still run saves manually:

```bash
lupe save "<short description of what now works or changed>"
```

If hooks are NOT installed (e.g. a plain terminal), call manually:

```bash
lupe prompt "<full user prompt>"
# ... do work ...
lupe respond "<full agent response text>"
```

Save after each coherent functional unit, including:

- after a meaningful edit batch
- before a risky refactor
- before trying a different approach
- after tests pass
- after fixing a failing test/build
- before a restore or other potentially destructive operation

Do not treat Lupe saves like serious public commits. They are intentionally cheap.

## Forks — Named Branch Points

A fork is a named pointer to a save. Use it when you want to be able to jump back
to a specific state by name rather than by UUID.

```bash
lupe fork "before-big-refactor"   # tag current HEAD save with a name
lupe forks                        # list all named forks
lupe restore before-big-refactor  # restore by name (or by UUID)
```

**When to create a fork proactively:**
- Before any risky or experimental change
- Before trying two different approaches to the same problem
- When the user says "don't break what's working" or "try this"
- Before a large refactor
- At any stable state the user might want to return to

Workflow for trying an alternative approach:
1. `lupe fork "stable"` — name the current stable state
2. Make the experimental change
3. `lupe save "experiment done"`
4. If it works: keep going. If not: `lupe restore stable` → dead branch appears in graph.

## Recovery And Recall

```bash
lupe history
lupe prompts
lupe saves
lupe forks
lupe graph
lupe search "<topic>"
lupe diff
lupe diff <save-uuid>
lupe diff <from-save-uuid> <to-save-uuid>
lupe restore <save-uuid-or-fork-name>
```

**Never revert or undo work by manually editing or deleting files.** Always use
`lupe restore` to move HEAD back. This preserves dropped work as a dead branch
visible in `lupe graph`.

Workflow for dropping a feature:
1. `lupe save "feature complete before drop"` — preserve the current state
2. `lupe saves` — find the save before the feature was started
3. `lupe restore <pre-feature-save-uuid>` — move HEAD back

## Current CLI

```bash
lupe status
lupe prompt "full user prompt"
lupe checkpoint "task summary" --prompt "full user prompt"
lupe save "save summary"
lupe fork "name"
lupe forks
lupe history
lupe prompts
lupe saves
lupe graph
lupe search "query"
lupe diff
lupe diff <save-uuid>
lupe diff <save-a-uuid> <save-b-uuid>
lupe restore <save-uuid-or-fork-name>
lupe respond "full agent response"
lupe author
lupe author --name "Your Name" --email "your@email.com"
lupe install-agent
lupe install-hooks
```

Storage starts automatically. If Lupe finds `.lupe` in the current directory or
a parent, it uses that project store. If not, it creates `.lupe` in the current
workspace. `lupe status` shows the active database/object-store paths and mode.
Use `LUPE_HOME` or `--home` to override the storage location.

`lupe author` reads the current author name and email for this project store.
`lupe author --name X --email Y` sets them (both optional; partial updates OK).
If author is not configured when starting a session, ask the user for name and
email and set them with `lupe author --name "..." --email "..."`.

## Keep This Updated

Whenever Lupe behavior, commands, storage, or terminology change, update this
file in the same change. Agents depend on this file to know how to use Lupe.
