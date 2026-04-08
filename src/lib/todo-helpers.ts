import type { GroupBy, Priority, Todo, TodoSection } from '@/lib/todos'

export function normalizeGroup(value: string) {
  const normalized = value.trim()
  return normalized ? normalized : 'General'
}

export function getDateValue(date: string) {
  return new Date(`${date}T00:00:00`).getTime()
}

export function getTodayValue(now = new Date()) {
  const date = new Date(now)
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

export function isOverdue(todo: Todo, now = new Date()) {
  return Boolean(todo.deadline) && getDateValue(todo.deadline) < getTodayValue(now) && !todo.completed
}

export function isDueToday(todo: Todo, now = new Date()) {
  return Boolean(todo.deadline) && getDateValue(todo.deadline) === getTodayValue(now)
}

export function isUpcoming(todo: Todo, now = new Date()) {
  return Boolean(todo.deadline) && getDateValue(todo.deadline) > getTodayValue(now)
}

export function formatDeadline(value: string, now = new Date()) {
  if (!value) {
    return 'No deadline'
  }

  const date = new Date(`${value}T00:00:00`)
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    ...(date.getFullYear() !== now.getFullYear() ? { year: 'numeric' } : {}),
  }).format(date)
}

export function getDeadlineLabel(todo: Todo, now = new Date()) {
  if (!todo.deadline) {
    return 'No deadline'
  }
  if (isOverdue(todo, now)) {
    return `Overdue · ${formatDeadline(todo.deadline)}`
  }
  if (isDueToday(todo, now)) {
    return 'Due today'
  }

  return formatDeadline(todo.deadline)
}

export function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export function getSectionStorageKey(groupBy: GroupBy, sectionKey: string) {
  return `${groupBy}:${sectionKey}`
}

export function getPriorityTone(priority: Priority) {
  if (priority === 'high') {
    return 'bg-rose-100 text-rose-700 border-rose-200'
  }
  if (priority === 'medium') {
    return 'bg-amber-100 text-amber-700 border-amber-200'
  }

  return 'bg-emerald-100 text-emerald-700 border-emerald-200'
}

export function getStatusTone(todo: Todo) {
  return todo.completed
    ? 'bg-slate-200 text-slate-700 border-slate-300'
    : 'bg-sky-100 text-sky-700 border-sky-200'
}

export function compareTodos(a: Todo, b: Todo) {
  if (a.completed !== b.completed) {
    return Number(a.completed) - Number(b.completed)
  }

  const aDeadline = a.deadline ? getDateValue(a.deadline) : Number.MAX_SAFE_INTEGER
  const bDeadline = b.deadline ? getDateValue(b.deadline) : Number.MAX_SAFE_INTEGER

  if (aDeadline !== bDeadline) {
    return aDeadline - bDeadline
  }

  return b.updatedAt.localeCompare(a.updatedAt)
}

export function getSectionMeta(todo: Todo, groupBy: GroupBy, now = new Date()) {
  if (groupBy === 'priority') {
    const orderMap: Record<Priority, number> = { high: 0, medium: 1, low: 2 }
    const labelMap: Record<Priority, string> = { high: 'High priority', medium: 'Medium priority', low: 'Low priority' }
    return { key: todo.priority, label: labelMap[todo.priority], order: orderMap[todo.priority] }
  }

  if (groupBy === 'status') {
    return todo.completed
      ? { key: 'completed', label: 'Completed', order: 1 }
      : { key: 'active', label: 'Active', order: 0 }
  }

  if (groupBy === 'deadline') {
    if (!todo.deadline) {
      return { key: 'no-deadline', label: 'No deadline', order: Number.MAX_SAFE_INTEGER }
    }
    if (isOverdue(todo, now)) {
      return { key: 'overdue', label: 'Overdue', order: -2 }
    }
    if (isDueToday(todo, now)) {
      return { key: 'today', label: 'Due today', order: -1 }
    }

    return {
      key: todo.deadline,
      label: formatDeadline(todo.deadline),
      order: getDateValue(todo.deadline),
    }
  }

  if (groupBy === 'group') {
    const label = normalizeGroup(todo.group)
    return {
      key: label.toLowerCase(),
      label,
      order: label.toLowerCase().charCodeAt(0),
    }
  }

  return { key: 'all', label: 'All todos', order: 0 }
}

export function groupTodos(items: Todo[], groupBy: GroupBy, now = new Date()) {
  const sections = new Map<string, TodoSection>()

  for (const todo of items) {
    const meta = getSectionMeta(todo, groupBy, now)
    const existing = sections.get(meta.key)

    if (existing) {
      existing.items.push(todo)
      continue
    }

    sections.set(meta.key, {
      key: meta.key,
      label: meta.label,
      order: meta.order,
      items: [todo],
    })
  }

  return [...sections.values()].sort((a, b) => {
    if (a.order !== b.order) {
      return a.order - b.order
    }

    return a.label.localeCompare(b.label)
  })
}
