import { describe, expect, it } from 'vitest'

import { compareTodos, getDeadlineLabel, getSectionMeta, getSectionStorageKey, groupTodos, isDueToday, isOverdue, isUpcoming, normalizeGroup } from '@/lib/todo-helpers'
import type { Todo } from '@/lib/todos'

function createTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    id: '1',
    title: 'Task',
    description: '',
    priority: 'medium',
    deadline: '',
    group: 'General',
    completed: false,
    createdAt: '2026-03-24T10:00:00.000Z',
    updatedAt: '2026-03-24T10:00:00.000Z',
    ...overrides,
  }
}

describe('todo helpers', () => {
  it('normalizes empty groups', () => {
    expect(normalizeGroup('   ')).toBe('General')
    expect(normalizeGroup(' Product ')).toBe('Product')
  })

  it('detects due date states correctly', () => {
    const now = new Date('2026-03-24T09:00:00.000Z')

    expect(isOverdue(createTodo({ deadline: '2026-03-23' }), now)).toBe(true)
    expect(isDueToday(createTodo({ deadline: '2026-03-24' }), now)).toBe(true)
    expect(isUpcoming(createTodo({ deadline: '2026-03-25' }), now)).toBe(true)
    expect(isOverdue(createTodo({ deadline: '2026-03-23', completed: true }), now)).toBe(false)
  })

  it('builds deadline labels for special states', () => {
    const now = new Date('2026-03-24T09:00:00.000Z')

    expect(getDeadlineLabel(createTodo(), now)).toBe('No deadline')
    expect(getDeadlineLabel(createTodo({ deadline: '2026-03-24' }), now)).toBe('Due today')
    expect(getDeadlineLabel(createTodo({ deadline: '2026-03-23' }), now)).toContain('Overdue')
  })

  it('sorts active todos before completed and by deadline', () => {
    const activeSoon = createTodo({ id: 'a', deadline: '2026-03-24' })
    const activeLater = createTodo({ id: 'b', deadline: '2026-03-30' })
    const completed = createTodo({ id: 'c', completed: true, deadline: '2026-03-20' })

    const sorted = [completed, activeLater, activeSoon].sort(compareTodos)

    expect(sorted.map((todo) => todo.id)).toEqual(['a', 'b', 'c'])
  })

  it('builds correct section metadata', () => {
    const now = new Date('2026-03-24T09:00:00.000Z')
    const todo = createTodo({ priority: 'high', deadline: '2026-03-24', group: 'Ops' })

    expect(getSectionMeta(todo, 'priority', now)).toEqual({ key: 'high', label: 'High priority', order: 0 })
    expect(getSectionMeta(todo, 'status', now)).toEqual({ key: 'active', label: 'Active', order: 0 })
    expect(getSectionMeta(todo, 'deadline', now)).toEqual({ key: 'today', label: 'Due today', order: -1 })
    expect(getSectionMeta(todo, 'group', now)).toEqual({ key: 'ops', label: 'Ops', order: 'o'.charCodeAt(0) })
  })

  it('groups todos into sorted sections', () => {
    const now = new Date('2026-03-24T09:00:00.000Z')
    const sections = groupTodos([
      createTodo({ id: '1', priority: 'low' }),
      createTodo({ id: '2', priority: 'high' }),
      createTodo({ id: '3', priority: 'medium' }),
    ], 'priority', now)

    expect(sections.map((section) => section.key)).toEqual(['high', 'medium', 'low'])
    expect(sections[0]?.items[0]?.id).toBe('2')
  })

  it('names collapse storage keys by group mode', () => {
    expect(getSectionStorageKey('group', 'ops')).toBe('group:ops')
    expect(getSectionStorageKey('priority', 'high')).toBe('priority:high')
  })
})
