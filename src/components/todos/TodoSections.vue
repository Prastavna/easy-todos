<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Priority, Todo, TodoSection } from '@/lib/todos'

const props = defineProps<{
  sections: TodoSection[]
  expandedSections: string[]
  getPriorityTone: (priority: Priority) => string
  getStatusTone: (todo: Todo) => string
  normalizeGroup: (value: string) => string
  getDeadlineLabel: (todo: Todo) => string
  formatUpdatedAt: (value: string) => string
}>()

const emit = defineEmits<{
  'update:expandedSections': [value: string[]]
  toggle: [id: string]
  edit: [todo: Todo]
  remove: [id: string]
}>()
</script>

<template>
  <Accordion
    :model-value="props.expandedSections"
    type="multiple"
    class="space-y-3"
    @update:model-value="emit('update:expandedSections', $event as string[])"
  >
    <AccordionItem
      v-for="section in props.sections"
      :key="section.key"
      :value="section.key"
      class="rounded-[1.5rem] border border-white/70 bg-white/40 px-1 shadow-[0_12px_50px_-40px_rgba(15,23,42,0.45)]"
    >
      <AccordionTrigger class="px-3 py-3 hover:no-underline">
        <div class="flex min-w-0 flex-1 items-center gap-3">
          <div class="min-w-0 text-left">
            <h2 class="truncate font-display text-2xl text-slate-900">{{ section.label }}</h2>
            <p class="text-sm text-slate-500">{{ section.items.length }} task{{ section.items.length === 1 ? '' : 's' }}</p>
          </div>
          <Separator class="hidden flex-1 bg-slate-200 sm:block" />
        </div>
      </AccordionTrigger>

      <AccordionContent class="pb-1">
        <div class="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4 px-2 pb-3">
          <Card
            v-for="todo in section.items"
            :key="todo.id"
            class="border-white/80 bg-white/92 shadow-[0_16px_60px_-44px_rgba(15,23,42,0.55)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            <CardHeader class="gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div class="min-w-0 space-y-3">
                <div class="flex flex-wrap items-center gap-2">
                  <Badge :class="props.getPriorityTone(todo.priority)">
                    {{ todo.priority }} priority
                  </Badge>
                  <Badge :class="props.getStatusTone(todo)">
                    {{ todo.completed ? 'completed' : 'active' }}
                  </Badge>
                  <Badge class="border-slate-200 bg-slate-100 text-slate-700">
                    {{ props.normalizeGroup(todo.group) }}
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
                    {{ props.getDeadlineLabel(todo) }}
                  </span>
                  <span class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                    <Icon class="size-4 text-slate-500" icon="solar:clock-circle-linear" />
                    Updated {{ props.formatUpdatedAt(todo.updatedAt) }}
                  </span>
                </div>

                <div class="flex shrink-0 items-center justify-end gap-2">
                  <Button
                    class="rounded-full"
                    size="icon"
                    :variant="todo.completed ? 'secondary' : 'outline'"
                    @click="emit('toggle', todo.id)"
                  >
                    <Icon :icon="todo.completed ? 'solar:check-circle-bold' : 'solar:check-circle-linear'" class="size-5" />
                  </Button>
                  <Button class="rounded-full" size="icon" variant="outline" aria-label="Edit todo" title="Edit todo" @click="emit('edit', todo)">
                    <Icon class="size-4" icon="solar:pen-linear" />
                  </Button>
                  <Button class="rounded-full" size="icon" variant="destructive" aria-label="Delete todo" title="Delete todo" @click="emit('remove', todo.id)">
                    <Icon class="size-4" icon="solar:trash-bin-trash-linear" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
