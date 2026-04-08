# Easy Todos

A local-first todo app with priorities, deadlines, groups, and filters. Runs as a browser extension (popup + full tab) and as a standalone web app. All data stays in your browser via `localStorage` — no account or server required.

## Features

- Create todos with a title, description, priority (low / medium / high), deadline, and group
- Filter by status, priority, deadline, or group; search by title, description, or group
- Group todos by group, priority, deadline, or status
- Show or hide completed tasks per section
- Stats bar showing active, due today, and overdue counts
- Keyboard shortcuts for fast access
- Persistent filters and section collapse state across sessions

## Installation (Browser Extension)

1. Run `pnpm build` to produce the `dist/` folder
2. Open `chrome://extensions`, enable **Developer mode**
3. Click **Load unpacked** and select the `dist/` folder
4. The Easy Todos icon appears in your toolbar — click it to open the popup, or use the options page for the full tab view

## Usage

**Creating a todo** — Click **Create todo** (or press `n`) to open the form. Title is required; all other fields are optional. Group defaults to "General".

**Editing a todo** — Click the pen icon on any card to open the edit form pre-filled with that todo's details.

**Completing a todo** — Click the checkmark button on a card to toggle completion. Completed todos are dimmed and moved to the bottom of their section.

**Show/hide completed** — Each section with completed items shows a toggle at the bottom. Click it to reveal or hide completed todos for that section.

**Filtering** — Use the filter bar to narrow by status, priority, deadline, or group. The search box matches against title, description, and group. Click **Reset** to clear all filters.

**Grouping** — Use the group-by selector to arrange todos by group, priority, deadline, or status. "No grouping" shows all todos in a single flat list.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `n` | Open the create todo dialog |
| `/` | Focus the search input |

Shortcuts are ignored while typing in inputs, textareas, selects, or editable content. `n` is also ignored while the dialog is already open.

## Development

```bash
pnpm install
pnpm dev
```

See [docs/architecture.md](docs/architecture.md) for a contributor overview.
