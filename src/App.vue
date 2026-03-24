<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

type Priority = 'low' | 'medium' | 'high'
type StatusFilter = 'all' | 'active' | 'completed'
type DeadlineFilter = 'all' | 'today' | 'upcoming' | 'overdue' | 'none'
type GroupBy = 'none' | 'group' | 'priority' | 'deadline' | 'status'

interface Todo {
  id: string
  title: string
  description: string
  priority: Priority
  deadline: string
  group: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

interface TodoForm {
  title: string
  description: string
  priority: Priority
  deadline: string
  group: string
}

interface TodoSection {
  key: string
  label: string
  order: number
  items: Todo[]
}

const STORAGE_KEY = 'easy-todos.todos'

const priorityOptions: Array<{ label: string; value: Priority }> = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
]

const groupByOptions: Array<{ label: string; value: GroupBy }> = [
  { label: 'No grouping', value: 'none' },
  { label: 'Group', value: 'group' },
  { label: 'Priority', value: 'priority' },
  { label: 'Deadline', value: 'deadline' },
  { label: 'Status', value: 'status' },
]

const statusOptions: Array<{ label: string; value: StatusFilter }> = [
  { label: 'All tasks', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
]

const deadlineOptions: Array<{ label: string; value: DeadlineFilter }> = [
  { label: 'Any deadline', value: 'all' },
  { label: 'Due today', value: 'today' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'No deadline', value: 'none' },
]

const todos = ref<Todo[]>([])
const search = ref('')
const statusFilter = ref<StatusFilter>('all')
const priorityFilter = ref<'all' | Priority>('all')
const deadlineFilter = ref<DeadlineFilter>('all')
const groupFilter = ref('all')
const groupBy = ref<GroupBy>('group')
const dialogOpen = ref(false)
const editingId = ref<string | null>(null)
const form = ref<TodoForm>(createEmptyForm())

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

function saveTodos() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value))
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
    return {
      key: normalizeGroup(todo.group).toLowerCase(),
      label: normalizeGroup(todo.group),
      order: normalizeGroup(todo.group).toLowerCase().charCodeAt(0),
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
      if (statusFilter.value === 'active' && todo.completed) {
        return false
      }

      if (statusFilter.value === 'completed' && !todo.completed) {
        return false
      }

      if (priorityFilter.value !== 'all' && todo.priority !== priorityFilter.value) {
        return false
      }

      if (groupFilter.value !== 'all' && normalizeGroup(todo.group) !== groupFilter.value) {
        return false
      }

      if (deadlineFilter.value === 'today' && !isDueToday(todo)) {
        return false
      }

      if (deadlineFilter.value === 'upcoming' && !isUpcoming(todo)) {
        return false
      }

      if (deadlineFilter.value === 'overdue' && !isOverdue(todo)) {
        return false
      }

      if (deadlineFilter.value === 'none' && todo.deadline) {
        return false
      }

      if (!query) {
        return true
      }

      return [todo.title, todo.description, todo.group].some((value) =>
        value.toLowerCase().includes(query),
      )
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

onMounted(loadTodos)
watch(todos, saveTodos, { deep: true })
</script>

<template>
  <Dialog v-model:open="dialogOpen">
    <div class="app-shell min-h-screen">
      <div class="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col gap-4 px-4 py-5 sm:px-5 lg:px-6 lg:py-8">
        <section class="rounded-[2rem] border border-white/70 bg-white/85 p-4 shadow-[0_20px_80px_-40px_rgba(10,61,72,0.45)] backdrop-blur xl:p-6">
          <div class="space-y-4">
            <div class="grid gap-3 sm:grid-cols-3">
              <div class="rounded-2xl border border-teal-100 bg-teal-50/80 px-4 py-3">
                <p class="text-xs uppercase tracking-[0.24em] text-teal-700">Active</p>
                <p class="mt-2 text-3xl font-semibold text-slate-900">{{ activeCount }}</p>
              </div>
              <div class="rounded-2xl border border-amber-100 bg-amber-50/80 px-4 py-3">
                <p class="text-xs uppercase tracking-[0.24em] text-amber-700">Due today</p>
                <p class="mt-2 text-3xl font-semibold text-slate-900">{{ dueTodayCount }}</p>
              </div>
              <div class="rounded-2xl border border-rose-100 bg-rose-50/80 px-4 py-3">
                <p class="text-xs uppercase tracking-[0.24em] text-rose-700">Overdue</p>
                <p class="mt-2 text-3xl font-semibold text-slate-900">{{ overdueCount }}</p>
              </div>
            </div>
          </div>
        </section>

        <div class="space-y-4">
          <Card class="border-white/70 bg-white/88 shadow-[0_18px_70px_-45px_rgba(15,23,42,0.5)] backdrop-blur">
              <CardHeader>
                <CardTitle class="flex items-center gap-2 text-lg">
                  <Icon class="size-5 text-teal-700" icon="solar:tuning-4-bold-duotone" />
                  Focus filters
                </CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <div class="flex flex-wrap items-end gap-3">
                  <div class="min-w-[220px] flex-[1.6] space-y-2">
                  <label class="text-sm font-medium text-slate-700">Search</label>
                  <div class="relative">
                    <Icon class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" icon="solar:magnifer-linear" />
                    <Input v-model="search" class="h-11 rounded-xl border-slate-200 bg-white pl-9" placeholder="Find a todo" />
                  </div>
                  </div>

                  <div class="min-w-[150px] flex-1 space-y-2">
                    <label class="text-sm font-medium text-slate-700">Status</label>
                    <Select v-model="statusFilter">
                      <SelectTrigger class="h-11 w-full rounded-xl border-slate-200 bg-white">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-for="option in statusOptions" :key="option.value" :value="option.value">
                          {{ option.label }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div class="min-w-[150px] flex-1 space-y-2">
                    <label class="text-sm font-medium text-slate-700">Priority</label>
                    <Select v-model="priorityFilter">
                      <SelectTrigger class="h-11 w-full rounded-xl border-slate-200 bg-white">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All priorities</SelectItem>
                        <SelectItem v-for="option in priorityOptions" :key="option.value" :value="option.value">
                          {{ option.label }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div class="min-w-[150px] flex-1 space-y-2">
                    <label class="text-sm font-medium text-slate-700">Deadline</label>
                    <Select v-model="deadlineFilter">
                      <SelectTrigger class="h-11 w-full rounded-xl border-slate-200 bg-white">
                        <SelectValue placeholder="Deadline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-for="option in deadlineOptions" :key="option.value" :value="option.value">
                          {{ option.label }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div class="min-w-[150px] flex-1 space-y-2">
                    <label class="text-sm font-medium text-slate-700">Group</label>
                    <Select v-model="groupFilter">
                      <SelectTrigger class="h-11 w-full rounded-xl border-slate-200 bg-white">
                        <SelectValue placeholder="Group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All groups</SelectItem>
                        <SelectItem v-for="group in availableGroups" :key="group" :value="group">
                          {{ group }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div class="min-w-[150px] flex-1 space-y-2">
                    <label class="text-sm font-medium text-slate-700">Group list by</label>
                    <Select v-model="groupBy">
                      <SelectTrigger class="h-11 w-full rounded-xl border-slate-200 bg-white">
                        <SelectValue placeholder="Grouping" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-for="option in groupByOptions" :key="option.value" :value="option.value">
                          {{ option.label }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div class="min-w-[140px] sm:ml-auto">
                    <Button class="h-11 w-full rounded-xl px-4 sm:w-auto" variant="outline" @click="clearFilters">
                      Reset filters
                    </Button>
                  </div>
                </div>
              </CardContent>
          </Card>

          <main class="space-y-4">
            <div class="flex flex-col gap-3 rounded-[1.75rem] border border-white/70 bg-white/88 px-4 py-3 shadow-[0_18px_70px_-45px_rgba(15,23,42,0.5)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="text-sm font-medium text-slate-900">{{ filteredTodos.length }} visible todos</p>
              </div>
              <Button class="rounded-xl" @click="openCreateDialog">
                <Icon class="size-4" icon="solar:add-circle-linear" />
                Add todo
              </Button>
            </div>

            <div v-if="groupedTodos.length" class="space-y-4">
              <section v-for="section in groupedTodos" :key="section.key" class="space-y-2">
                <div class="flex items-center justify-between gap-3 px-1">
                  <div>
                    <h2 class="font-display text-2xl text-slate-900">{{ section.label }}</h2>
                    <p class="text-sm text-slate-500">{{ section.items.length }} task{{ section.items.length === 1 ? '' : 's' }}</p>
                  </div>
                  <Separator class="hidden flex-1 bg-slate-200 sm:block" />
                </div>

                <div class="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">
                  <Card
                    v-for="todo in section.items"
                    :key="todo.id"
                    class="border-white/80 bg-white/92 shadow-[0_16px_60px_-44px_rgba(15,23,42,0.55)] transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <CardHeader class="gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div class="min-w-0 space-y-3">
                        <div class="flex flex-wrap items-center gap-2">
                          <Badge :class="getPriorityTone(todo.priority)">
                            {{ todo.priority }} priority
                          </Badge>
                          <Badge :class="getStatusTone(todo)">
                            {{ todo.completed ? 'completed' : 'active' }}
                          </Badge>
                          <Badge class="border-slate-200 bg-slate-100 text-slate-700">
                            {{ normalizeGroup(todo.group) }}
                          </Badge>
                        </div>
                        <div>
                          <CardTitle class="text-xl text-slate-900" :class="todo.completed ? 'line-through opacity-55' : ''">
                            {{ todo.title }}
                          </CardTitle>
                          <CardDescription v-if="todo.description" class="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                            {{ todo.description }}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent class="space-y-3">
                      <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div class="flex flex-wrap items-center gap-3 text-sm text-slate-500 sm:max-w-[60%]">
                          <span class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                            <Icon class="size-4 text-slate-500" icon="solar:calendar-mark-linear" />
                            {{ getDeadlineLabel(todo) }}
                          </span>
                          <span class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                            <Icon class="size-4 text-slate-500" icon="solar:clock-circle-linear" />
                            Updated {{ formatUpdatedAt(todo.updatedAt) }}
                          </span>
                        </div>

                        <div class="flex shrink-0 items-center justify-end gap-2">
                        <Button
                          class="rounded-full"
                          size="icon"
                          :variant="todo.completed ? 'secondary' : 'outline'"
                          @click="toggleTodo(todo.id)"
                        >
                          <Icon :icon="todo.completed ? 'solar:check-circle-bold' : 'solar:check-circle-linear'" class="size-5" />
                        </Button>
                        <Button class="rounded-full" size="icon" variant="outline" @click="openEditDialog(todo)" aria-label="Edit todo" title="Edit todo">
                          <Icon class="size-4" icon="solar:pen-linear" />
                        </Button>
                        <Button class="rounded-full" size="icon" variant="destructive" @click="removeTodo(todo.id)" aria-label="Delete todo" title="Delete todo">
                          <Icon class="size-4" icon="solar:trash-bin-trash-linear" />
                        </Button>
                      </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>
            </div>

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
    </div>

    <DialogContent class="border-white/70 bg-white/96 sm:max-w-xl">
      <DialogHeader>
        <DialogTitle class="font-display text-3xl text-slate-900">
          {{ dialogTitle }}
        </DialogTitle>
        <DialogDescription>
          {{ dialogDescription }}
        </DialogDescription>
      </DialogHeader>

      <form class="space-y-5" @submit.prevent="saveTodo">
        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-700">Title</label>
          <Input v-model="form.title" class="h-11 rounded-xl border-slate-200" placeholder="Ship landing page copy" />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-700">Description</label>
          <Textarea
            v-model="form.description"
            class="min-h-28 rounded-xl border-slate-200"
            placeholder="Optional notes, links, or context for the task"
          />
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700">Priority</label>
            <Select v-model="form.priority">
              <SelectTrigger class="h-11 w-full rounded-xl border-slate-200">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="option in priorityOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700">Deadline</label>
            <Input v-model="form.deadline" class="h-11 rounded-xl border-slate-200" type="date" />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-700">Group</label>
          <Input v-model="form.group" class="h-11 rounded-xl border-slate-200" placeholder="Design, Ops, Personal" />
        </div>

        <DialogFooter class="gap-2 sm:justify-end">
          <Button type="button" class="rounded-xl" variant="outline" @click="dialogOpen = false">
            Cancel
          </Button>
          <Button type="submit" class="rounded-xl" :disabled="!canSubmit">
            {{ editingId ? 'Save changes' : 'Create todo' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
