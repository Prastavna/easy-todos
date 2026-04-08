<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { GroupBy, Priority, Todo, TodoSection } from "@/lib/todos";
import PriorityIcon from "./PriorityIcon.vue";

const props = defineProps<{
  sections: TodoSection[];
  expandedSections: string[];
  groupBy: GroupBy;
  getPriorityTone: (priority: Priority) => string;
  getStatusTone: (todo: Todo) => string;
  normalizeGroup: (value: string) => string;
  getDeadlineLabel: (todo: Todo) => string;
  formatUpdatedAt: (value: string) => string;
}>();

const emit = defineEmits<{
  "update:expandedSections": [value: string[]];
  toggle: [id: string];
  edit: [todo: Todo];
  remove: [id: string];
}>();

const showCompleted = ref<Record<string, boolean>>({});

function toggleShowCompleted(key: string) {
  showCompleted.value[key] = !showCompleted.value[key];
}

function visibleItems(section: TodoSection) {
  return showCompleted.value[section.key]
    ? section.items
    : section.items.filter((t) => !t.completed);
}
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
      class="rounded-xl border! border-slate-300/30 shadow-[0_12px_50px_-40px_rgba(15,23,42,0.45)]"
    >
      <AccordionTrigger class="px-3 py-1.5 hover:no-underline">
        <div class="flex min-w-0 flex-1 items-center gap-3">
          <div class="min-w-0 text-left flex flex-row items-center">
            <h2 class="truncate text-lg text-slate-900">
              {{ section.label }}
            </h2>
            <p class="pl-1 text-xs text-slate-500">
              ({{ section.items.filter((t) => !t.completed).length }} active{{
                section.items.some((t) => t.completed)
                  ? `, ${section.items.filter((t) => t.completed).length} done`
                  : ""
              }})
            </p>
          </div>
          <Separator class="hidden flex-1 bg-slate-200 sm:block" />
        </div>
      </AccordionTrigger>

      <AccordionContent class="pb-0.5">
        <div class="flex flex-col sm:grid sm:grid-cols-2 gap-1.5 px-2 pb-2">
          <Card
            v-for="todo in visibleItems(section)"
            :key="todo.id"
            class="relative border-white/80 bg-white/92 py-0 shadow-[0_16px_60px_-44px_rgba(15,23,42,0.55)] transition-opacity"
            :class="todo.completed ? 'opacity-45 grayscale' : ''"
          >
            <!-- Action buttons: absolutely positioned top-right -->
            <div class="absolute right-2 top-2 flex items-center gap-1">
              <Button
                class="size-7 rounded-full"
                size="icon"
                :variant="todo.completed ? 'secondary' : 'outline'"
                @click="emit('toggle', todo.id)"
              >
                <Icon
                  :icon="todo.completed ? 'solar:check-circle-bold' : 'solar:check-circle-linear'"
                  class="size-3.5"
                />
              </Button>
              <Button
                class="size-7 rounded-full"
                size="icon"
                variant="outline"
                aria-label="Edit todo"
                title="Edit todo"
                @click="emit('edit', todo)"
              >
                <Icon class="size-3.5" icon="solar:pen-linear" />
              </Button>
              <Button
                class="size-7 rounded-full"
                size="icon"
                variant="destructive"
                aria-label="Delete todo"
                title="Delete todo"
                @click="emit('remove', todo.id)"
              >
                <Icon class="size-3.5" icon="solar:trash-bin-trash-linear" />
              </Button>
            </div>

            <!-- Text content — right padding makes room for the floating buttons -->
            <div class="space-y-1.5 px-3 py-2.5">
              <p
                class="pr-26 text-sm font-medium leading-snug text-slate-900 wrap-break-word"
                :class="todo.completed ? 'line-through opacity-55' : ''"
              >
                {{ todo.title }}
              </p>
              <p v-if="todo.description" class="max-h-20 overflow-y-auto text-xs leading-5 text-slate-500">
                {{ todo.description }}
              </p>
              <div class="flex flex-wrap items-center gap-1">
                <Badge
                  :class="[props.getPriorityTone(todo.priority), 'px-1.5']"
                  :title="`${todo.priority} priority`"
                >
                  <PriorityIcon :priority="todo.priority" class="size-3.5" />
                </Badge>
                <!-- <Badge :class="props.getStatusTone(todo)">{{ todo.completed ? 'completed' : 'active' }}</Badge> -->
                <Badge
                  v-if="props.groupBy !== 'group'"
                  class="border-slate-200 bg-slate-100 text-slate-700"
                  >{{ props.normalizeGroup(todo.group) }}</Badge
                >
                <span
                  v-if="todo.deadline"
                  class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500 whitespace-nowrap"
                >
                  <Icon
                    class="size-3.5 shrink-0 text-slate-500"
                    icon="solar:calendar-mark-linear"
                  />
                  {{ props.getDeadlineLabel(todo) }}
                </span>
              </div>
            </div>
          </Card>
        </div>

        <!-- Show completed toggle — only rendered when there are completed items -->
        <div v-if="section.items.some((t) => t.completed)" class="px-3 pb-2.5">
          <button
            class="flex items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-slate-600"
            @click.stop="toggleShowCompleted(section.key)"
          >
            <Icon
              class="size-3.5"
              :icon="showCompleted[section.key] ? 'solar:eye-closed-linear' : 'solar:eye-linear'"
            />
            {{
              showCompleted[section.key]
                ? "Hide completed"
                : `Show ${section.items.filter((t) => t.completed).length} completed`
            }}
          </button>
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
