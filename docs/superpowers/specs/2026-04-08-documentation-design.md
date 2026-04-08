---
title: Documentation Design
date: 2026-04-08
status: approved
---

# Easy Todos — Documentation Design

## Goal

Add documentation to the project covering both end users and contributors, without over-structuring a focused codebase.

## Output Files

| File | Audience | Purpose |
|---|---|---|
| `README.md` | End users | Features, install, usage, keyboard shortcuts, quick dev setup |
| `docs/architecture.md` | Contributors | Tech stack, project structure, extension modes, data layer, component overview, running & testing |

## README.md Sections

1. **Description** — one-paragraph summary: local-first todo extension + web app with priorities, deadlines, groups, filters
2. **Features** — bullet list of capabilities
3. **Installation** — load unpacked extension in Chrome; or run as web app via dev server
4. **Usage** — creating/editing todos, grouping, filtering, show/hide completed
5. **Keyboard shortcuts** — `n` (new todo), `/` (focus search); existing content kept and lightly expanded
6. **Development** — install + dev command (existing content, kept)

## docs/architecture.md Sections

1. **Tech stack** — Vue 3, TypeScript, Vite, Tailwind CSS, shadcn/ui, Vitest, crxjs
2. **Project structure** — annotated `src/` tree
3. **Extension modes** — `web` / `popup` / `tab` via `mode` prop on `TodoApp`; entry points explained
4. **Data layer** — types in `todos.ts`, helpers in `todo-helpers.ts`, localStorage keys
5. **Component overview** — one-line purpose per component in `components/todos/`
6. **Running & testing** — `pnpm dev`, `pnpm build`, `pnpm test`

## Constraints

- No inline code comments added to source files
- No new source files created
- Spec location: `docs/superpowers/specs/`; actual docs at repo root and `docs/`
