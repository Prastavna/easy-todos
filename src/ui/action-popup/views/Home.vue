<template>
    <nav class="flex justify-end mr-2">
        <ColorModeButton />
        <RouterLink to="/settings">
            <UButton variant="ghost" icon="i-heroicons-cog"></UButton>
        </RouterLink>
    </nav>

    <main class="flex flex-col h-full justify-between">
        <div class="flex flex-col gap-2 h-full overflow-y-auto">
            List
        </div>
        <div class="flex items-end justify-end ">
            <InputArea @add-todo="addTodo" />
        </div>
    </main>
</template>


<script setup lang="ts">
import { useTodosStore } from "../../../stores/todos";
import type { TodoForm } from "../../../types/todo";
import InputArea from "../components/InputArea.vue";

const todosStore = useTodosStore();

const addTodo = (todo: TodoForm) => {
	todosStore.addTodo(todo);
};
</script>