import { defineStore } from "pinia";
import type { Todo, TodoForm } from "../types/todo";

export const useTodosStore = defineStore("todos", {
	state: () => ({
		todos: [] as Todo[],
	}),
	persist: true,
	actions: {
		addTodo(todo: TodoForm) {
			this.todos.push({
				id: crypto.randomUUID(),
				title: todo.title,
				description: todo.description,
				completed: false,
				priority: todo.priority,
				deadline: todo.deadline,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
		},
		removeTodo({ id }: { id: string }) {
			this.todos = this.todos.filter((todo) => todo.id !== id);
		},
		updateTodo({ id, ...rest }: { id: string } & Partial<Todo>) {
			this.todos = this.todos.map((todo) =>
				todo.id === id ? { ...todo, ...rest } : todo,
			);
		},
		removeCompletedTodos() {
			this.todos = this.todos.filter((todo) => !todo.completed);
		},
	},
});
