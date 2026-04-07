import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { openAppInTab } from '@/lib/extension'
import type { Todo } from '@/lib/todos'

vi.mock('@/lib/extension', () => ({
  openAppInTab: vi.fn(),
}))

import TodoApp from '@/components/todos/TodoApp.vue'

const ButtonStub = defineComponent({
  name: 'Button',
  emits: ['click'],
  template: '<button v-bind="$attrs" @click="$emit(\'click\', $event)"><slot /></button>',
})

const TodoStatsStub = defineComponent({
  name: 'TodoStats',
  props: {
    activeCount: { type: Number, required: true },
    dueTodayCount: { type: Number, required: true },
    overdueCount: { type: Number, required: true },
  },
  template: '<div data-test="stats">{{ activeCount }}|{{ dueTodayCount }}|{{ overdueCount }}</div>',
})

const TodoFiltersStub = defineComponent({
  name: 'TodoFilters',
  props: {
    search: { type: String, required: true },
    statusFilter: { type: String, required: true },
    priorityFilter: { type: String, required: true },
    deadlineFilter: { type: String, required: true },
    groupFilter: { type: String, required: true },
    groupBy: { type: String, required: true },
    hasActiveFilters: { type: Boolean, default: false },
  },
  emits: ['update:search', 'update:statusFilter', 'update:priorityFilter', 'update:deadlineFilter', 'update:groupFilter', 'update:groupBy', 'reset'],
  setup(props, { emit }) {
    return {
      props,
      emitSearch: () => emit('update:search', 'alpha'),
      emitStatus: () => emit('update:statusFilter', 'completed'),
      emitReset: () => emit('reset'),
    }
  },
  template: `
    <div
      data-test="filters"
      :data-search="props.search"
      :data-status="props.statusFilter"
      :data-priority="props.priorityFilter"
      :data-deadline="props.deadlineFilter"
      :data-group="props.groupFilter"
      :data-group-by="props.groupBy"
      :data-active="String(props.hasActiveFilters)"
    >
      <input id="todo-search" :value="props.search">
      <button data-test="filters-search" @click="emitSearch">search</button>
      <button data-test="filters-status" @click="emitStatus">status</button>
      <button data-test="filters-reset" @click="emitReset">reset</button>
    </div>
  `,
})

const TodoSectionsStub = defineComponent({
  name: 'TodoSections',
  props: {
    sections: { type: Array, required: true },
    expandedSections: { type: Array, required: true },
  },
  emits: ['update:expandedSections', 'toggle', 'edit', 'remove'],
  setup(props, { emit }) {
    const firstTodo = () => (props.sections as Array<{ items: Todo[] }>)[0]?.items[0]
    return {
      props,
      toggleFirst: () => {
        const todo = firstTodo()
        if (todo) emit('toggle', todo.id)
      },
      editFirst: () => {
        const todo = firstTodo()
        if (todo) emit('edit', todo)
      },
      removeFirst: () => {
        const todo = firstTodo()
        if (todo) emit('remove', todo.id)
      },
      collapseAll: () => emit('update:expandedSections', []),
    }
  },
  template: `
    <div data-test="sections">
      <div v-for="section in props.sections" :key="section.key" class="section">
        <strong>{{ section.label }}</strong>
        <span v-for="todo in section.items" :key="todo.id" class="todo-title">{{ todo.title }}</span>
      </div>
      <button data-test="toggle-first" @click="toggleFirst">toggle</button>
      <button data-test="edit-first" @click="editFirst">edit</button>
      <button data-test="remove-first" @click="removeFirst">remove</button>
      <button data-test="collapse-all" @click="collapseAll">collapse</button>
    </div>
  `,
})

const TodoFormDialogStub = defineComponent({
  name: 'TodoFormDialog',
  props: {
    open: { type: Boolean, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    form: { type: Object, required: true },
    canSubmit: { type: Boolean, required: true },
    isEditing: { type: Boolean, required: true },
  },
  emits: ['update:open', 'submit'],
  setup(props, { emit }) {
    return {
      props,
      closeDialog: () => emit('update:open', false),
      submitDialog: () => emit('submit'),
      setCreateValues: () => {
        const form = props.form as Todo
        form.title = 'Alpha task'
        form.description = 'Created from test'
        form.priority = 'high'
        form.deadline = '2026-04-08'
        form.group = 'Ops'
      },
      setEditedTitle: () => {
        const form = props.form as Todo
        form.title = 'Alpha task updated'
      },
    }
  },
  template: `
    <div
      data-test="dialog"
      :data-open="String(props.open)"
      :data-title="props.title"
      :data-description="props.description"
      :data-can-submit="String(props.canSubmit)"
      :data-editing="String(props.isEditing)"
      :data-form-title="props.form.title"
    >
      <button data-test="dialog-close" @click="closeDialog">close</button>
      <button data-test="dialog-submit" @click="submitDialog">submit</button>
      <button data-test="dialog-fill-create" @click="setCreateValues">fill-create</button>
      <button data-test="dialog-fill-edit" @click="setEditedTitle">fill-edit</button>
    </div>
  `,
})

const stubs = {
  TodoStats: TodoStatsStub,
  TodoFilters: TodoFiltersStub,
  TodoSections: TodoSectionsStub,
  TodoFormDialog: TodoFormDialogStub,
  Button: ButtonStub,
  Card: { template: '<div><slot /></div>' },
  CardContent: { template: '<div><slot /></div>' },
  Icon: { template: '<i />' },
}

function createTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    id: 'todo-1',
    title: 'Alpha task',
    description: 'First task',
    priority: 'medium',
    deadline: '',
    group: 'General',
    completed: false,
    createdAt: '2026-04-07T10:00:00.000Z',
    updatedAt: '2026-04-07T10:00:00.000Z',
    ...overrides,
  }
}

async function mountTodoApp(mode: 'web' | 'popup' | 'tab' = 'tab') {
  const wrapper = mount(TodoApp, {
    attachTo: document.body,
    props: { mode },
    global: { stubs },
  })

  await nextTick()

  return wrapper
}

describe('TodoApp', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('11111111-1111-1111-1111-111111111111')
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.mocked(openAppInTab).mockReset()
    document.body.innerHTML = ''
    localStorage.clear()
  })

  it('loads todos from localStorage and passes them to sections', async () => {
    localStorage.setItem('easy-todos.todos', JSON.stringify([
      createTodo({ id: '1', title: 'Loaded one', group: 'Ops' }),
      createTodo({ id: '2', title: 'Loaded two', group: 'Ops' }),
    ]))

    const wrapper = await mountTodoApp()

    expect(wrapper.get('[data-test="sections"]').text()).toContain('Loaded one')
    expect(wrapper.get('[data-test="sections"]').text()).toContain('Loaded two')
  })

  it('shows stats derived from loaded todos', async () => {
    localStorage.setItem('easy-todos.todos', JSON.stringify([
      createTodo({ id: '1', title: 'Active', deadline: '2026-04-07' }),
      createTodo({ id: '2', title: 'Overdue', deadline: '2026-04-06' }),
      createTodo({ id: '3', title: 'Done', completed: true, deadline: '2026-04-07' }),
    ]))

    const wrapper = await mountTodoApp()

    expect(wrapper.get('[data-test="stats"]').text()).toBe('2|1|1')
  })

  it('opens the create dialog from the floating button', async () => {
    const wrapper = await mountTodoApp()

    await wrapper.get('[aria-label="Add todo"]').trigger('click')

    expect(wrapper.get('[data-test="dialog"]').attributes('data-open')).toBe('true')
    expect(wrapper.get('[data-test="dialog"]').attributes('data-title')).toBe('Create task')
  })

  it('creates a new todo and persists it', async () => {
    const wrapper = await mountTodoApp()

    await wrapper.get('[aria-label="Add todo"]').trigger('click')
    await wrapper.get('[data-test="dialog-fill-create"]').trigger('click')
    await wrapper.get('[data-test="dialog-submit"]').trigger('click')

    expect(wrapper.get('[data-test="sections"]').text()).toContain('Alpha task')

    const saved = JSON.parse(localStorage.getItem('easy-todos.todos') || '[]')
    expect(saved).toHaveLength(1)
    expect(saved[0]).toMatchObject({
      id: '11111111-1111-1111-1111-111111111111',
      title: 'Alpha task',
      priority: 'high',
      deadline: '2026-04-08',
      group: 'Ops',
    })
  })

  it('edits an existing todo', async () => {
    localStorage.setItem('easy-todos.todos', JSON.stringify([
      createTodo({ id: '1', title: 'Original title' }),
    ]))

    const wrapper = await mountTodoApp()

    await wrapper.get('[data-test="edit-first"]').trigger('click')
    expect(wrapper.get('[data-test="dialog"]').attributes('data-editing')).toBe('true')
    expect(wrapper.get('[data-test="dialog"]').attributes('data-form-title')).toBe('Original title')

    await wrapper.get('[data-test="dialog-fill-edit"]').trigger('click')
    await wrapper.get('[data-test="dialog-submit"]').trigger('click')

    expect(wrapper.get('[data-test="sections"]').text()).toContain('Alpha task updated')

    const saved = JSON.parse(localStorage.getItem('easy-todos.todos') || '[]')
    expect(saved[0]?.title).toBe('Alpha task updated')
  })

  it('toggles a todo completion state', async () => {
    localStorage.setItem('easy-todos.todos', JSON.stringify([
      createTodo({ id: '1', title: 'Toggle me', completed: false }),
    ]))

    const wrapper = await mountTodoApp()

    await wrapper.get('[data-test="toggle-first"]').trigger('click')

    const saved = JSON.parse(localStorage.getItem('easy-todos.todos') || '[]')
    expect(saved[0]?.completed).toBe(true)
  })

  it('removes a todo', async () => {
    localStorage.setItem('easy-todos.todos', JSON.stringify([
      createTodo({ id: '1', title: 'Delete me' }),
    ]))

    const wrapper = await mountTodoApp()

    await wrapper.get('[data-test="remove-first"]').trigger('click')

    expect(wrapper.text()).toContain('Nothing matches yet')
    expect(JSON.parse(localStorage.getItem('easy-todos.todos') || '[]')).toHaveLength(0)
  })

  it('filters todos from filter events and resets them', async () => {
    localStorage.setItem('easy-todos.todos', JSON.stringify([
      createTodo({ id: '1', title: 'Alpha task' }),
      createTodo({ id: '2', title: 'Beta task' }),
    ]))

    const wrapper = await mountTodoApp()

    await wrapper.get('[data-test="filters-search"]').trigger('click')
    expect(wrapper.get('[data-test="sections"]').text()).toContain('Alpha task')
    expect(wrapper.get('[data-test="sections"]').text()).not.toContain('Beta task')
    expect(wrapper.get('[data-test="filters"]').attributes('data-active')).toBe('true')

    await wrapper.get('[data-test="filters-reset"]').trigger('click')
    expect(wrapper.get('[data-test="sections"]').text()).toContain('Alpha task')
    expect(wrapper.get('[data-test="sections"]').text()).toContain('Beta task')
    expect(wrapper.get('[data-test="filters"]').attributes('data-search')).toBe('')
  })

  it('updates filter props when status changes', async () => {
    const wrapper = await mountTodoApp()

    await wrapper.get('[data-test="filters-status"]').trigger('click')

    expect(wrapper.get('[data-test="filters"]').attributes('data-status')).toBe('completed')
    expect(wrapper.get('[data-test="filters"]').attributes('data-active')).toBe('true')
  })

  it('stores collapsed section state when sections emit expanded updates', async () => {
    localStorage.setItem('easy-todos.todos', JSON.stringify([
      createTodo({ id: '1', title: 'Alpha task', group: 'General' }),
    ]))

    const wrapper = await mountTodoApp()

    await wrapper.get('[data-test="collapse-all"]').trigger('click')

    expect(JSON.parse(localStorage.getItem('easy-todos.section-collapse') || '{}')).toEqual({
      'group:general': true,
    })
  })

  it('opens the create dialog when pressing n outside typing contexts', async () => {
    const wrapper = await mountTodoApp()

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'n' }))
    await wrapper.vm.$nextTick()

    expect(wrapper.get('[data-test="dialog"]').attributes('data-open')).toBe('true')
  })

  it('does not open the dialog for n while typing in the search input', async () => {
    const wrapper = await mountTodoApp()
    const input = wrapper.get('#todo-search')

    input.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'n', bubbles: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.get('[data-test="dialog"]').attributes('data-open')).toBe('false')
  })

  it('focuses the search input when pressing /', async () => {
    const wrapper = await mountTodoApp()

    window.dispatchEvent(new KeyboardEvent('keydown', { key: '/' }))
    await wrapper.vm.$nextTick()

    expect((document.activeElement as HTMLElement | null)?.id).toBe('todo-search')
  })

  it('ignores n when the dialog is already open', async () => {
    const wrapper = await mountTodoApp()

    await wrapper.get('[aria-label="Add todo"]').trigger('click')
    await wrapper.get('[data-test="dialog-fill-edit"]').trigger('click')
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'n' }))
    await wrapper.vm.$nextTick()

    expect(wrapper.get('[data-test="dialog"]').attributes('data-form-title')).toBe('Alpha task updated')
  })

  it('opens the extension in a tab from popup mode', async () => {
    const wrapper = await mountTodoApp('popup')

    await wrapper.get('[aria-label="Open in tab"]').trigger('click')

    expect(openAppInTab).toHaveBeenCalledTimes(1)
  })
})
