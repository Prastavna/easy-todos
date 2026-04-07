<script setup lang="ts">
import { Button } from '@/components/ui/button'
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
import { Textarea } from '@/components/ui/textarea'
import type { Priority, SelectOption, TodoForm } from '@/lib/todos'

const props = defineProps<{
  open: boolean
  title: string
  description: string
  form: TodoForm
  canSubmit: boolean
  isEditing: boolean
  priorityOptions: SelectOption<Priority>[]
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  submit: []
}>()
</script>

<template>
  <Dialog :open="props.open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-h-[calc(100vh-1.5rem)] overflow-y-auto border-white/70 bg-white/96 p-4 sm:max-w-xl sm:p-5">
      <DialogHeader class="gap-1">
        <DialogTitle class="font-display text-2xl text-slate-900 sm:text-3xl">
          {{ props.title }}
        </DialogTitle>
        <DialogDescription class="hidden sm:block">
          {{ props.description }}
        </DialogDescription>
      </DialogHeader>

      <form class="space-y-4" @submit.prevent="emit('submit')">
        <div class="space-y-1.5">
          <label class="text-sm font-medium text-slate-700">Title <span class="text-rose-500">*</span></label>
          <Input v-model="props.form.title" class="h-10 rounded-xl border-slate-200" placeholder="Ship landing page copy" />
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-slate-700">Description</label>
          <Textarea
            v-model="props.form.description"
            class="min-h-24 rounded-xl border-slate-200"
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
                <SelectItem v-for="option in props.priorityOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium text-slate-700">Deadline</label>
            <Input v-model="props.form.deadline" class="h-10 rounded-xl border-slate-200" type="date" />
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-slate-700">Group</label>
          <Input v-model="props.form.group" class="h-10 rounded-xl border-slate-200" placeholder="Design, Ops, Personal" />
        </div>

        <DialogFooter class="gap-2 pt-1 sm:justify-end grid grid-cols-2">
          <Button type="submit" class="rounded-xl" :disabled="!props.canSubmit">
            {{ props.isEditing ? 'Save changes' : 'Create todo' }}
          </Button>
          <Button type="button" class="rounded-xl" variant="outline" @click="emit('update:open', false)">
            Cancel
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
