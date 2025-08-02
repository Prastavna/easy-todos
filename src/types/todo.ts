import type { Priority } from "../contansts/todo";

export type TodoForm = Pick<
	Todo,
	"title" | "description" | "priority" | "deadline"
>;

export interface Todo {
	id: string;
	title: string | undefined;
	description: string;
	completed: boolean;
	priority: Priority;
	deadline: Date | undefined;
	createdAt: Date;
	updatedAt: Date;
}
