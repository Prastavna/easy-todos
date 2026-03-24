<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'

import TodoFilters from '@/components/todos/TodoFilters.vue'
import TodoFormDialog from '@/components/todos/TodoFormDialog.vue'
import TodoSections from '@/components/todos/TodoSections.vue'
import TodoStats from '@/components/todos/TodoStats.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  deadlineOptions,
  groupByOptions,
  priorityOptions,
  statusOptions,
  type DeadlineFilter,
  type GroupBy,
  type Priority,
  type Todo,
  type TodoForm,
  type TodoSection,
} from '@/lib/todos'

const STORAGE_KEY = 'easy-todos.todos'
const COLLAPSE_STORAGE_KEY = 'easy-todos.section-collapse'

const todos = ref<Todo[]>([])
const search = ref('')
const statusFilter = ref<'all' | 'active' | 'completed'>('all')
const priorityFilter = ref<'all' | Priority>('all')
const deadlineFilter = ref<DeadlineFilter>('all')
const groupFilter = ref('all')
const groupBy = ref<GroupBy>('group')
const dialogOpen = ref(false)
const editingId = ref<string | null>(null)
const form = ref<TodoForm>(createEmptyForm())
const collapsedSections = ref<Record<string, boolean>>({})

function createEmptyForm(): TodoForm {
  return {
    title: '',
    description: '',
    priority: 'medium',
    deadline: '',
    group: 'General',
  }
}

function normalizeGroup(value: string) {
  const normalized = value.trim()
  return normalized ? normalized : 'General'
}

function getDateValue(date: string) {
  return new Date(`${date}T00:00:00`).getTime()
}

function getTodayValue() {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

function isOverdue(todo: Todo) {
  return Boolean(todo.deadline) && getDateValue(todo.deadline) < getTodayValue() && !todo.completed
}

function isDueToday(todo: Todo) {
  return Boolean(todo.deadline) && getDateValue(todo.deadline) === getTodayValue()
}

function isUpcoming(todo: Todo) {
  return Boolean(todo.deadline) && getDateValue(todo.deadline) > getTodayValue()
}

function loadTodos() {
  if (typeof window === 'undefined') {
    return
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return
  }

  try {
    const parsed = JSON.parse(raw) as Todo[]
    todos.value = Array.isArray(parsed) ? parsed : []
  }
  catch {
    todos.value = []
  }
}

function loadCollapsedSections() {
  if (typeof window === 'undefined') {
    return
  }

  const raw = window.localStorage.getItem(COLLAPSE_STORAGE_KEY)
  if (!raw) {
    return
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, boolean>
    collapsedSections.value = parsed && typeof parsed === 'object' ? parsed : {}
  }
  catch {
    collapsedSections.value = {}
  }
}

function saveTodos() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value))
}

function saveCollapsedSections() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(COLLAPSE_STORAGE_KEY, JSON.stringify(collapsedSections.value))
}

function resetForm() {
  form.value = createEmptyForm()
  editingId.value = null
}

function openCreateDialog() {
  resetForm()
  dialogOpen.value = true
}

function openEditDialog(todo: Todo) {
  editingId.value = todo.id
  form.value = {
    title: todo.title,
    description: todo.description,
    priority: todo.priority,
    deadline: todo.deadline,
    group: todo.group,
  }
  dialogOpen.value = true
}

function saveTodo() {
  const title = form.value.title.trim()
  if (!title) {
    return
  }

  const now = new Date().toISOString()
  const payload = {
    title,
    description: form.value.description.trim(),
    priority: form.value.priority,
    deadline: form.value.deadline,
    group: normalizeGroup(form.value.group),
  }

  if (editingId.value) {
    todos.value = todos.value.map((todo) =>
      todo.id === editingId.value
        ? { ...todo, ...payload, updatedAt: now }
        : todo,
    )
  }
  else {
    todos.value.unshift({
      id: crypto.randomUUID(),
      completed: false,
      createdAt: now,
      updatedAt: now,
      ...payload,
    })
  }

  dialogOpen.value = false
  resetForm()
}

function toggleTodo(id: string) {
  todos.value = todos.value.map((todo) =>
    todo.id === id
      ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() }
      : todo,
  )
}

function removeTodo(id: string) {
  todos.value = todos.value.filter((todo) => todo.id !== id)
}

function clearFilters() {
  search.value = ''
  statusFilter.value = 'all'
  priorityFilter.value = 'all'
  deadlineFilter.value = 'all'
  groupFilter.value = 'all'
  groupBy.value = 'group'
}

function formatDeadline(value: string) {
  if (!value) {
    return 'No deadline'
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))
}

function getDeadlineLabel(todo: Todo) {
  if (!todo.deadline) {
    return 'No deadline'
  }
  if (isOverdue(todo)) {
    return `Overdue · ${formatDeadline(todo.deadline)}`
  }
  if (isDueToday(todo)) {
    return 'Due today'
  }

  return formatDeadline(todo.deadline)
}

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

function getSectionStorageKey(sectionKey: string) {
  return `${groupBy.value}:${sectionKey}`
}

function getPriorityTone(priority: Priority) {
  if (priority === 'high') {
    return 'bg-rose-100 text-rose-700 border-rose-200'
  }
  if (priority === 'medium') {
    return 'bg-amber-100 text-amber-700 border-amber-200'
  }

  return 'bg-emerald-100 text-emerald-700 border-emerald-200'
}

function getStatusTone(todo: Todo) {
  return todo.completed
    ? 'bg-slate-200 text-slate-700 border-slate-300'
    : 'bg-sky-100 text-sky-700 border-sky-200'
}

function compareTodos(a: Todo, b: Todo) {
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

function getSectionMeta(todo: Todo) {
  if (groupBy.value === 'priority') {
    const orderMap: Record<Priority, number> = { high: 0, medium: 1, low: 2 }
    const labelMap: Record<Priority, string> = { high: 'High priority', medium: 'Medium priority', low: 'Low priority' }
    return { key: todo.priority, label: labelMap[todo.priority], order: orderMap[todo.priority] }
  }

  if (groupBy.value === 'status') {
    return todo.completed
      ? { key: 'completed', label: 'Completed', order: 1 }
      : { key: 'active', label: 'Active', order: 0 }
  }

  if (groupBy.value === 'deadline') {
    if (!todo.deadline) {
      return { key: 'no-deadline', label: 'No deadline', order: Number.MAX_SAFE_INTEGER }
    }
    if (isOverdue(todo)) {
      return { key: 'overdue', label: 'Overdue', order: -2 }
    }
    if (isDueToday(todo)) {
      return { key: 'today', label: 'Due today', order: -1 }
    }

    return {
      key: todo.deadline,
      label: formatDeadline(todo.deadline),
      order: getDateValue(todo.deadline),
    }
  }

  if (groupBy.value === 'group') {
    const label = normalizeGroup(todo.group)
    return {
      key: label.toLowerCase(),
      label,
      order: label.toLowerCase().charCodeAt(0),
    }
  }

  return { key: 'all', label: 'All todos', order: 0 }
}

const canSubmit = computed(() => form.value.title.trim().length > 0)
const dialogTitle = computed(() => (editingId.value ? 'Edit task' : 'Create task'))
const dialogDescription = computed(() =>
  editingId.value
    ? 'Update the details, deadline, or grouping for this todo.'
    : 'Capture a task with a priority, deadline, and group so it stays organized.',
)

const availableGroups = computed(() => {
  const groups = new Set<string>()
  for (const todo of todos.value) {
    groups.add(normalizeGroup(todo.group))
  }
  return [...groups].sort((a, b) => a.localeCompare(b))
})

const activeCount = computed(() => todos.value.filter((todo) => !todo.completed).length)
const overdueCount = computed(() => todos.value.filter((todo) => isOverdue(todo)).length)
const dueTodayCount = computed(() => todos.value.filter((todo) => isDueToday(todo) && !todo.completed).length)

const filteredTodos = computed(() => {
  const query = search.value.trim().toLowerCase()

  return [...todos.value]
    .filter((todo) => {
      if (statusFilter.value === 'active' && todo.completed) return false
      if (statusFilter.value === 'completed' && !todo.completed) return false
      if (priorityFilter.value !== 'all' && todo.priority !== priorityFilter.value) return false
      if (groupFilter.value !== 'all' && normalizeGroup(todo.group) !== groupFilter.value) return false
      if (deadlineFilter.value === 'today' && !isDueToday(todo)) return false
      if (deadlineFilter.value === 'upcoming' && !isUpcoming(todo)) return false
      if (deadlineFilter.value === 'overdue' && !isOverdue(todo)) return false
      if (deadlineFilter.value === 'none' && todo.deadline) return false
      if (!query) return true

      return [todo.title, todo.description, todo.group].some((value) => value.toLowerCase().includes(query))
    })
    .sort(compareTodos)
})

const groupedTodos = computed<TodoSection[]>(() => {
  const sections = new Map<string, TodoSection>()

  for (const todo of filteredTodos.value) {
    const meta = getSectionMeta(todo)
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
})

const expandedSections = computed({
  get: () => groupedTodos.value
    .filter((section) => !collapsedSections.value[getSectionStorageKey(section.key)])
    .map((section) => section.key),
  set: (value: string[] | string) => {
    const expanded = new Set(Array.isArray(value) ? value : [value])
    const nextState = { ...collapsedSections.value }

    for (const section of groupedTodos.value) {
      nextState[getSectionStorageKey(section.key)] = !expanded.has(section.key)
    }

    collapsedSections.value = nextState
  },
})

onMounted(() => {
  loadTodos()
  loadCollapsedSections()
})

watch(todos, saveTodos, { deep: true })
watch(collapsedSections, saveCollapsedSections, { deep: true })
</script>

<template>
  <div class="app-shell min-h-screen">
    <div class="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col gap-4 px-4 py-5 sm:px-5 lg:px-6 lg:py-8">
      <TodoStats :active-count="activeCount" :due-today-count="dueTodayCount" :overdue-count="overdueCount" />

      <div class="space-y-4">
        <TodoFilters
          :search="search"
          :status-filter="statusFilter"
          :priority-filter="priorityFilter"
          :deadline-filter="deadlineFilter"
          :group-filter="groupFilter"
          :group-by="groupBy"
          :available-groups="availableGroups"
          :status-options="statusOptions"
          :priority-options="priorityOptions"
          :deadline-options="deadlineOptions"
          :group-by-options="groupByOptions"
          @update:search="search = $event"
          @update:status-filter="statusFilter = $event"
          @update:priority-filter="priorityFilter = $event"
          @update:deadline-filter="deadlineFilter = $event"
          @update:group-filter="groupFilter = $event"
          @update:group-by="groupBy = $event"
          @reset="clearFilters"
        />

        <main class="space-y-4">
          <div class="flex flex-col gap-3 rounded-[1.75rem] border border-white/70 bg-white/88 px-4 py-3 shadow-[0_18px_70px_-45px_rgba(15,23,42,0.5)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <p class="text-sm font-medium text-slate-900">{{ filteredTodos.length }} visible todos</p>
            <Button class="rounded-xl" @click="openCreateDialog">
              <Icon class="size-4" icon="solar:add-circle-linear" />
              Add todo
            </Button>
          </div>

          <TodoSections
            v-if="groupedTodos.length"
            :sections="groupedTodos"
            :expanded-sections="expandedSections"
            :get-priority-tone="getPriorityTone"
            :get-status-tone="getStatusTone"
            :normalize-group="normalizeGroup"
            :get-deadline-label="getDeadlineLabel"
            :format-updated-at="formatUpdatedAt"
            @update:expanded-sections="expandedSections = $event"
            @toggle="toggleTodo"
            @edit="openEditDialog"
            @remove="removeTodo"
          />

          <Card v-else class="border-dashed border-slate-300 bg-white/85 py-8 shadow-[0_18px_70px_-45px_rgba(15,23,42,0.5)] backdrop-blur">
            <CardContent class="flex flex-col items-center justify-center gap-4 text-center">
              <div class="rounded-full bg-slate-100 p-4 text-slate-600">
                <Icon class="size-8" icon="solar:notes-minimalistic-bold-duotone" />
              </div>
              <div class="space-y-2">
                <h2 class="font-display text-3xl text-slate-900">Nothing matches yet</h2>
                <p class="mx-auto max-w-md text-sm leading-6 text-slate-500">
                  Add your first task or reset the filters to bring hidden todos back into view.
                </p>
              </div>
              <div class="flex flex-col gap-2 sm:flex-row">
                <Button class="rounded-xl" @click="openCreateDialog">
                  Create todo
                </Button>
                <Button class="rounded-xl" variant="outline" @click="clearFilters">
                  Reset filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>

    <TodoFormDialog
      :open="dialogOpen"
      :title="dialogTitle"
      :description="dialogDescription"
      :form="form"
      :can-submit="canSubmit"
      :is-editing="Boolean(editingId)"
      :priority-options="priorityOptions"
      @update:open="dialogOpen = $event"
      @submit="saveTodo"
    />
  </div>
</template>
