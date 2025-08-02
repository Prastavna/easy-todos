<template>
    <UForm :schema="schema" :state="newTodo" class="w-full border p-2 rounded">
        <div class="relative">
          <UFormGroup class="flex flex-col gap-2">
            <UFormField name="title">
                <UInput v-model="newTodo.title" placeholder="Title" class="w-full" variant="ghost" />
            </UFormField>
            <USeparator />
            <UFormField name="description">
                <UTextarea :rows="3" v-model="newTodo.description" placeholder="Description" class="w-full" variant="ghost" required />
            </UFormField>
          </UFormGroup>
          
          <UFormGroup class="fixed bottom-2 right-2 flex gap-2">
            <UFormField name="priority">
                <USelect v-model="newTodo.priority" :items="priorityOptions" class="w-24 capitalize"/>
            </UFormField>
            <UFormField name="deadline">
                <UInput v-model="newTodo.deadline" type="date" icon="i-heroicons-clock" />
            </UFormField>
            <UButton type="submit" variant="ghost" color="success" icon="i-heroicons-paper-airplane-solid">
            </UButton>
          </UFormGroup>
        </div>
    </UForm>
</template>

<script setup lang="ts">
import { defineEmits, reactive } from "vue";
import z from "zod";
import { Priority } from "../../../contansts/todo";
import type { TodoForm } from "../../../types/todo";

const emit = defineEmits<{
	addTodo: [todo: TodoForm];
}>();

const toast = useToast();

const schema = z.object({
	title: z.string().max(100).optional().default(undefined),
	description: z.string().min(1),
	priority: z.enum(Priority).optional().default(Priority.LOW),
	deadline: z.date().optional().default(undefined),
});
type Schema = z.infer<typeof schema>;

const priorityOptions = Object.values(Priority).map((priority) => ({
	label: priority,
	value: priority,
}));

const newTodo = reactive<TodoForm>({
	title: undefined,
	description: "",
	priority: Priority.LOW,
	deadline: undefined,
});

const onSubmit = (state: Schema) => {
	console.log(state);
	toast.add({
		title: "Todo added",
		description: "Todo added successfully",
		color: "success",
	});
	emit("addTodo", state);
};
</script>