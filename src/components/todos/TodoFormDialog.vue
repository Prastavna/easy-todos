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
    <DialogContent class="border-white/70 bg-white/96 sm:max-w-xl">
      <DialogHeader>
        <DialogTitle class="font-display text-3xl text-slate-900">
          {{ props.title }}
        </DialogTitle>
        <DialogDescription>
          {{ props.description }}
        </DialogDescription>
      </DialogHeader>

      <form class="space-y-5" @submit.prevent="emit('submit')">
        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-700">Title</label>
          <Input v-model="props.form.title" class="h-11 rounded-xl border-slate-200" placeholder="Ship landing page copy" />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-700">Description</label>
          <Textarea
            v-model="props.form.description"
            class="min-h-28 rounded-xl border-slate-200"
            placeholder="Optional notes, links, or context for the task"
          />
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700">Priority</label>
            <Select v-model="props.form.priority">
              <SelectTrigger class="h-11 w-full rounded-xl border-slate-200">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="option in props.priorityOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700">Deadline</label>
            <Input v-model="props.form.deadline" class="h-11 rounded-xl border-slate-200" type="date" />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-700">Group</label>
          <Input v-model="props.form.group" class="h-11 rounded-xl border-slate-200" placeholder="Design, Ops, Personal" />
        </div>

        <DialogFooter class="gap-2 sm:justify-end">
          <Button type="button" class="rounded-xl" variant="outline" @click="emit('update:open', false)">
            Cancel
          </Button>
          <Button type="submit" class="rounded-xl" :disabled="!props.canSubmit">
            {{ props.isEditing ? 'Save changes' : 'Create todo' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
