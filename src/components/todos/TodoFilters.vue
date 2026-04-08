<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { DeadlineFilter, GroupBy, Priority, SelectOption, StatusFilter } from '@/lib/todos'

const props = defineProps<{
  search: string
  statusFilter: StatusFilter
  priorityFilter: 'all' | Priority
  deadlineFilter: DeadlineFilter
  groupFilter: string
  groupBy: GroupBy
  availableGroups: string[]
  statusOptions: SelectOption<StatusFilter>[]
  priorityOptions: SelectOption<Priority>[]
  deadlineOptions: SelectOption<DeadlineFilter>[]
  groupByOptions: SelectOption<GroupBy>[]
  hasActiveFilters?: boolean
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:statusFilter': [value: StatusFilter]
  'update:priorityFilter': [value: 'all' | Priority]
  'update:deadlineFilter': [value: DeadlineFilter]
  'update:groupFilter': [value: string]
  'update:groupBy': [value: GroupBy]
  reset: []
}>()

function updateSearch(value: string | number) {
  emit('update:search', String(value))
}

function updateStatusFilter(value: unknown) {
  if (typeof value === 'string') {
    emit('update:statusFilter', value as StatusFilter)
  }
}

function updatePriorityFilter(value: unknown) {
  if (typeof value === 'string') {
    emit('update:priorityFilter', value as 'all' | Priority)
  }
}

function updateDeadlineFilter(value: unknown) {
  if (typeof value === 'string') {
    emit('update:deadlineFilter', value as DeadlineFilter)
  }
}

function updateGroupFilter(value: unknown) {
  if (typeof value === 'string') {
    emit('update:groupFilter', value)
  }
}

function updateGroupBy(value: unknown) {
  if (typeof value === 'string') {
    emit('update:groupBy', value as GroupBy)
  }
}
</script>

<template>
  <Card class="border-none bg-transparent py-0 shadow-none backdrop-blur-0 sm:border-white/70 sm:bg-white/88 sm:shadow-[0_18px_70px_-45px_rgba(15,23,42,0.5)] sm:backdrop-blur">
    <CardContent class="space-y-4 px-0 py-0 sm:px-6 sm:py-6">
      <div class="sm:flex sm:flex-wrap sm:items-end sm:gap-3 sm:space-y-0">
        <div class="flex items-center gap-2 sm:min-w-55 sm:flex-[1.6] sm:space-y-2">
          <div class="relative min-w-0 flex-1">
            <Icon class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" icon="solar:magnifer-linear" />
            <Input
              id="todo-search"
              :model-value="props.search"
              class="h-11 rounded-xl border-slate-200 bg-white pl-9"
              placeholder="Find a todo"
              @update:model-value="updateSearch"
            />
          </div>

          <DropdownMenu class="sm:hidden">
            <DropdownMenuTrigger as-child>
              <Button class="relative rounded-xl border-slate-200 bg-white" size="icon" variant="outline" aria-label="Open filters" title="Open filters">
                <Icon class="size-4" icon="solar:tuning-2-linear" />
                <span v-if="props.hasActiveFilters" class="absolute right-2 top-2 size-2 rounded-full bg-teal-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-[min(22rem,calc(100vw-2rem))] rounded-2xl border-white/80 bg-white/96 p-0 shadow-[0_20px_80px_-45px_rgba(15,23,42,0.55)]">
              <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <p class="text-sm font-semibold text-slate-900">Filters</p>
                <Button class="h-8 rounded-lg px-3 text-xs" variant="ghost" @click="emit('reset')">
                  Reset
                </Button>
              </div>

              <div class="grid gap-3 p-4 sm:grid-cols-2">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-slate-700">Status</label>
                  <Select :model-value="props.statusFilter" @update:model-value="updateStatusFilter">
                    <SelectTrigger class="h-11 w-full rounded-xl border-slate-200 bg-white">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="option in props.statusOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-slate-700">Priority</label>
                  <Select :model-value="props.priorityFilter" @update:model-value="updatePriorityFilter">
                    <SelectTrigger class="h-11 w-full rounded-xl border-slate-200 bg-white">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All priorities</SelectItem>
                      <SelectItem v-for="option in props.priorityOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-slate-700">Deadline</label>
                  <Select :model-value="props.deadlineFilter" @update:model-value="updateDeadlineFilter">
                    <SelectTrigger class="h-11 w-full rounded-xl border-slate-200 bg-white">
                      <SelectValue placeholder="Deadline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="option in props.deadlineOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-slate-700">Group</label>
                  <Select :model-value="props.groupFilter" @update:model-value="updateGroupFilter">
                    <SelectTrigger class="h-11 w-full rounded-xl border-slate-200 bg-white">
                      <SelectValue placeholder="Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All groups</SelectItem>
                      <SelectItem v-for="group in props.availableGroups" :key="group" :value="group">
                        {{ group }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div class="space-y-2 sm:col-span-2">
                  <label class="text-sm font-medium text-slate-700">Group list by</label>
                  <Select :model-value="props.groupBy" @update:model-value="updateGroupBy">
                    <SelectTrigger class="h-11 w-full rounded-xl border-slate-200 bg-white">
                      <SelectValue placeholder="Grouping" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="option in props.groupByOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div class="hidden min-w-[150px] flex-1 space-y-2 sm:block">
          <label class="text-sm font-medium text-slate-700">Status</label>
          <Select :model-value="props.statusFilter" @update:model-value="updateStatusFilter">
            <SelectTrigger class="h-11 w-full rounded-xl border-slate-200 bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="option in props.statusOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="hidden min-w-[150px] flex-1 space-y-2 sm:block">
            <label class="text-sm font-medium text-slate-700">Priority</label>
            <Select :model-value="props.priorityFilter" @update:model-value="updatePriorityFilter">
              <SelectTrigger class="h-11 w-full rounded-xl border-slate-200 bg-white">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                <SelectItem v-for="option in props.priorityOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
        </div>

        <div class="hidden min-w-[150px] flex-1 space-y-2 sm:block">
            <label class="text-sm font-medium text-slate-700">Deadline</label>
            <Select :model-value="props.deadlineFilter" @update:model-value="updateDeadlineFilter">
              <SelectTrigger class="h-11 w-full rounded-xl border-slate-200 bg-white">
                <SelectValue placeholder="Deadline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="option in props.deadlineOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
        </div>

        <div class="hidden min-w-[150px] flex-1 space-y-2 sm:block">
            <label class="text-sm font-medium text-slate-700">Group</label>
            <Select :model-value="props.groupFilter" @update:model-value="updateGroupFilter">
              <SelectTrigger class="h-11 w-full rounded-xl border-slate-200 bg-white">
                <SelectValue placeholder="Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All groups</SelectItem>
                <SelectItem v-for="group in props.availableGroups" :key="group" :value="group">
                  {{ group }}
                </SelectItem>
              </SelectContent>
            </Select>
        </div>

        <div class="hidden min-w-[150px] flex-1 space-y-2 sm:block">
            <label class="text-sm font-medium text-slate-700">Group list by</label>
            <Select :model-value="props.groupBy" @update:model-value="updateGroupBy">
              <SelectTrigger class="h-11 w-full rounded-xl border-slate-200 bg-white">
                <SelectValue placeholder="Grouping" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="option in props.groupByOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
        </div>

        <div class="hidden min-w-[140px] sm:ml-auto sm:block">
            <Button class="h-11 w-full rounded-xl px-4 sm:w-auto" variant="outline" @click="emit('reset')">
              Reset filters
            </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
