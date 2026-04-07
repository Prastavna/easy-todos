<script setup lang="ts">
import { computed } from 'vue'
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
  compact?: boolean
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

const contentClass = computed(() =>
  props.compact
    ? 'space-y-4 px-0 py-0'
    : 'space-y-4',
)

const cardClass = computed(() =>
  props.compact
    ? 'border-none bg-transparent shadow-none backdrop-blur-0 py-0'
    : 'border-white/70 bg-white/88 shadow-[0_18px_70px_-45px_rgba(15,23,42,0.5)] backdrop-blur py-0',
)
</script>

<template>
  <Card :class="cardClass">
    <CardContent :class="contentClass">
      <div :class="props.compact ? 'space-y-4' : 'flex flex-wrap items-end gap-3'">
        <div :class="props.compact ? 'flex items-center gap-2' : 'min-w-[220px] flex-[1.6] space-y-2'">
          <div class="relative min-w-0 flex-1">
            <Icon class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" icon="solar:magnifer-linear" />
            <Input
              :model-value="props.search"
              class="h-11 rounded-xl border-slate-200 bg-white pl-9"
              placeholder="Find a todo"
              @update:model-value="updateSearch"
            />
          </div>

          <DropdownMenu v-if="props.compact">
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

        <template v-if="!props.compact">
          <div class="min-w-[150px] flex-1 space-y-2">
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

          <div class="min-w-[150px] flex-1 space-y-2">
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

          <div class="min-w-[150px] flex-1 space-y-2">
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

          <div class="min-w-[150px] flex-1 space-y-2">
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

          <div class="min-w-[150px] flex-1 space-y-2">
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

          <div class="min-w-[140px] sm:ml-auto">
            <Button class="h-11 w-full rounded-xl px-4 sm:w-auto" variant="outline" @click="emit('reset')">
              Reset filters
            </Button>
          </div>
        </template>
      </div>
    </CardContent>
  </Card>
</template>
