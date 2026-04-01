# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Unofficial build of Claude Code CLI (v2.1.88-custom) — Anthropic's terminal-based AI coding assistant. Compiled from source using Bun, runs on Node.js >= 18. The terminal UI uses React with a custom Ink renderer.

## Build & Run

```bash
bun install                    # Install dependencies
bun run build                  # Build via build.ts → dist/cli.js
node dist/cli.js               # Run (requires ANTHROPIC_API_KEY env var)
```

There are no test or lint scripts. Custom API endpoints: set `ANTHROPIC_BASE_URL`.

## Build System

`build.ts` uses Bun's bundler with a plugin system that:
- **Feature flags**: All 80+ flags (`feature('FLAG_NAME')` from `bun:bundle`) resolve to `false` at build time via `shim/bun-bundle.ts`, enabling dead-code elimination of internal/experimental paths.
- **Module stubs**: Missing npm packages (Bedrock, Vertex, Azure SDKs, NAPI addons, internal `@ant/*` packages) and missing source files (behind feature flags) are stubbed automatically.
- **Build macros**: `MACRO.VERSION`, `MACRO.BUILD_TIME`, etc. are inlined string constants via Bun's `define`.
- Entry point: `src/entrypoints/cli.tsx` → output: `dist/cli.js` (ESM, no minification, linked sourcemaps).

## Architecture

**Entry & Core Loop**:
- `src/entrypoints/cli.tsx` — CLI bootstrap
- `src/main.tsx` — Interactive session logic
- `src/QueryEngine.ts` — Core conversation loop
- `src/query.ts` — Lower-level query execution with compaction/retry

**Tool System** (`src/tools/`):
Each tool is a directory containing:
- `<ToolName>.ts(x)` — Implementation
- `prompt.ts` — Tool description/schema for the model
- `UI.tsx` — Terminal UI rendering
- `constants.ts` — Tool name constants

Tools are registered in `src/tools.ts`.

**Key Directories**:
- `src/services/` — API client, MCP, analytics, compaction, LSP, OAuth
- `src/components/` — React/Ink terminal UI components
- `src/commands/` — Slash-command implementations
- `src/hooks/` — React hooks
- `src/utils/` — Utilities (model selection, settings, permissions)
- `src/state/` — App state store
- `src/ink/` — Custom terminal React renderer (Ink fork)
- `src/skills/` — Skill system (slash-command plugins)
- `src/coordinator/` — Multi-agent coordinator mode

**Patterns**:
- Both `src/` prefix imports and relative imports are used. `tsconfig.json` maps `src/*` → `./src/*`.
- Components use React compiler output (`_c` memoization cache from `react/compiler-runtime`).
- Permission modes (`default`, `acceptEdits`, `dontAsk`, `bypassPermissions`, `plan`) are enforced throughout tools.
- `process.env.USER_TYPE === 'ant'` branches are dead-coded away in external builds.
