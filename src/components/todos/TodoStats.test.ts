import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import TodoStats from '@/components/todos/TodoStats.vue'

describe('TodoStats', () => {
  it('renders all three counters', () => {
    const wrapper = mount(TodoStats, {
      props: {
        activeCount: 4,
        dueTodayCount: 2,
        overdueCount: 1,
      },
    })

    const text = wrapper.text()

    expect(text).toContain('Active')
    expect(text).toContain('Due today')
    expect(text).toContain('Overdue')
    expect(text).toContain('4')
    expect(text).toContain('2')
    expect(text).toContain('1')
  })
})
