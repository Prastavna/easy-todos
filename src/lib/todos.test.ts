import { describe, expect, it } from 'vitest'

import { deadlineOptions, groupByOptions, priorityOptions, statusOptions } from '@/lib/todos'

describe('todo constants', () => {
  it('defines all priority options in display order', () => {
    expect(priorityOptions).toEqual([
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High', value: 'high' },
    ])
  })

  it('defines all grouping options', () => {
    expect(groupByOptions.map(option => option.value)).toEqual(['none', 'group', 'priority', 'deadline', 'status'])
  })

  it('defines status filter options', () => {
    expect(statusOptions.map(option => option.value)).toEqual(['all', 'active', 'completed'])
  })

  it('defines deadline filter options', () => {
    expect(deadlineOptions.map(option => option.value)).toEqual(['all', 'today', 'upcoming', 'overdue', 'none'])
  })
})
