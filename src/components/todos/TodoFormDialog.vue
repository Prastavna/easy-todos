<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { computed, ref } from "vue";
import type { Priority, SelectOption, TodoForm } from "@/lib/todos";
import PriorityIcon from "./PriorityIcon.vue";

const props = defineProps<{
  open: boolean;
  title: string;
  description: string;
  form: TodoForm;
  canSubmit: boolean;
  isEditing: boolean;
  priorityOptions: SelectOption<Priority>[];
  availableGroups?: string[];
}>();

const groupDropdownOpen = ref(false);

const filteredGroups = computed(() => {
  if (!props.availableGroups?.length) return [];
  const q = props.form.group.toLowerCase();
  return props.availableGroups.filter(
    (g) => g.toLowerCase().includes(q) && g !== props.form.group,
  );
});

function selectGroup(group: string) {
  props.form.group = group;
  groupDropdownOpen.value = false;
}

function onGroupInput() {
  groupDropdownOpen.value = true;
}

function onGroupBlur() {
  setTimeout(() => {
    groupDropdownOpen.value = false;
  }, 150);
}

const emit = defineEmits<{
  "update:open": [value: boolean];
  submit: [];
}>();
</script>

<template>
  <Dialog :open="props.open" @update:open="emit('update:open', $event)">
    <DialogContent
      class="max-h-[calc(100vh-1.5rem)] overflow-y-auto border-white/70 bg-white/96 p-4 sm:max-w-xl sm:p-5"
    >
      <DialogHeader class="gap-1">
        <DialogTitle class="text-2xl text-slate-900 sm:text-3xl">
          {{ props.title }}
        </DialogTitle>
        <DialogDescription class="hidden sm:block">
          {{ props.description }}
        </DialogDescription>
      </DialogHeader>

      <form class="space-y-4" @submit.prevent="emit('submit')">
        <div class="space-y-1.5">
          <label class="text-sm font-medium text-slate-700"
            >Title <span class="text-rose-500">*</span></label
          >
          <Input
            v-model="props.form.title"
            class="h-10 rounded-xl border-slate-200"
            placeholder="Ship landing page copy"
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-slate-700">Description</label>
          <Textarea
            v-model="props.form.description"
            class="min-h-24 max-h-48 rounded-xl border-slate-200"
            placeholder="Optional notes, links, or context for the task"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-slate-700">Priority</label>
            <Select v-model="props.form.priority">
              <SelectTrigger class="h-10 w-full rounded-xl border-slate-200">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="option in props.priorityOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  <span class="flex items-center gap-1.5">
                    <PriorityIcon :priority="option.value" class="size-3" />
                    {{ option.label }}
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium text-slate-700">Deadline</label>
            <Input
              v-model="props.form.deadline"
              class="h-10 rounded-xl border-slate-200"
              type="date"
            />
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-slate-700">Group</label>
          <div class="relative">
            <Input
              v-model="props.form.group"
              class="h-10 rounded-xl border-slate-200"
              placeholder="Design, Ops, Personal"
              autocomplete="off"
              @input="onGroupInput"
              @focus="onGroupInput"
              @blur="onGroupBlur"
            />
            <ul
              v-if="groupDropdownOpen && filteredGroups.length"
              class="absolute z-50 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-md overflow-hidden"
            >
              <li
                v-for="group in filteredGroups"
                :key="group"
                class="cursor-pointer px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                @mousedown.prevent="selectGroup(group)"
              >
                {{ group }}
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter class="gap-2 pt-1 sm:justify-end grid grid-cols-2">
          <Button type="submit" class="rounded-xl" :disabled="!props.canSubmit">
            {{ props.isEditing ? "Save changes" : "Create todo" }}
          </Button>
          <Button
            type="button"
            class="rounded-xl"
            variant="outline"
            @click="emit('update:open', false)"
          >
            Cancel
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
