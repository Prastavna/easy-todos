# Architecture

Contributor overview for Easy Todos.

## Tech Stack

| Tool | Role |
|---|---|
| Vue 3 (Composition API) | UI framework |
| TypeScript | Type safety throughout |
| Vite | Dev server and bundler |
| Tailwind CSS | Utility-first styling |
| shadcn/ui (Reka UI) | Accessible component primitives |
| Vitest | Unit testing |
| crxjs vite plugin | Browser extension bundling |

## Project Structure

```
src/
  lib/
    todos.ts          # Domain types (Todo, TodoForm, etc.) and option constants
    todo-helpers.ts   # Pure functions: filtering, grouping, sorting, formatting
    todo-helpers.test.ts
    todos.test.ts
    extension.ts      # Chrome extension helpers (open app in tab)
    utils.ts          # Tailwind cn() utility
  components/
    todos/            # Feature components (see Component Overview below)
    ui/               # shadcn/ui primitives (accordion, badge, button, card, …)
  popup/
    main.ts           # Extension popup entry point
  app-tab/
    main.ts           # Full-tab extension entry point
  App.vue             # Web app root
  main.ts             # Web app entry point
  style.css           # Global styles
```

## Extension Modes

`TodoApp.vue` accepts a `mode` prop (`"web" | "popup" | "tab"`, default `"web"`) that controls layout and feature availability:

| Mode | Entry point | Notes |
|---|---|---|
| `web` | `src/main.ts` → `App.vue` | Full-width layout, no extension chrome |
| `popup` | `src/popup/main.ts` | Narrow fixed-width layout; shows an "open in tab" button |
| `tab` | `src/app-tab/main.ts` | Same as web layout but rendered in a full browser tab |

## Data Layer

**`src/lib/todos.ts`** — Types (`Todo`, `TodoForm`, `TodoSection`, `Priority`, `GroupBy`, `StatusFilter`, `DeadlineFilter`) and option arrays used by filter/select components.

**`src/lib/todo-helpers.ts`** — Pure, testable functions:

| Function | Purpose |
|---|---|
| `groupTodos` | Buckets a flat todo array into `TodoSection[]` by the active `GroupBy` |
| `compareTodos` | Sort order: active before completed, then by deadline, then by `updatedAt` |
| `getSectionMeta` | Returns `key`, `label`, and `order` for a todo under a given grouping |
| `isOverdue` / `isDueToday` / `isUpcoming` | Deadline classification |
| `getDeadlineLabel` | Human-readable deadline string shown on cards |
| `getPriorityTone` / `getStatusTone` | Tailwind class strings for badge colours |
| `normalizeGroup` | Trims and defaults empty group to `"General"` |

**localStorage keys** (all prefixed `easy-todos.`):

| Key | Contents |
|---|---|
| `easy-todos.todos` | JSON array of `Todo` objects |
| `easy-todos.section-collapse` | `Record<string, boolean>` — collapsed state per section, keyed as `"groupBy:sectionKey"` |
| `easy-todos.filters` | Object with `statusFilter`, `priorityFilter`, `deadlineFilter`, `groupFilter`, `groupBy` |

## Component Overview

All feature components live in `src/components/todos/`:

| Component | Purpose |
|---|---|
| `TodoApp.vue` | Root component — owns all state, handles storage, keyboard shortcuts, and computed filtering/grouping |
| `TodoSections.vue` | Renders grouped accordion sections; each section shows a grid of todo cards |
| `TodoFilters.vue` | Filter bar — search input, status/priority/deadline/group selects, group-by picker, reset button |
| `TodoFormDialog.vue` | Create/edit dialog — controlled form passed down as a `TodoForm` ref |
| `TodoStats.vue` | Summary bar showing active, due today, and overdue counts |
| `PriorityIcon.vue` | Small icon component that maps a `Priority` value to an iconify icon |

## Running & Testing

```bash
pnpm dev        # Start dev server (web mode)
pnpm build      # Build extension + web app to dist/
pnpm test       # Run Vitest unit tests
pnpm test --ui  # Run tests with the Vitest browser UI
```
