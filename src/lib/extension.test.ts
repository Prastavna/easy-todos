import { describe, expect, it, vi } from "vitest";

import { formatActiveTodoBadgeText, getActiveTodoCount, syncActiveTodoBadge } from "@/lib/extension";
import type { Todo } from "@/lib/todos";

function createTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    id: "1",
    title: "Task",
    description: "",
    priority: "medium",
    deadline: "",
    group: "General",
    completed: false,
    createdAt: "2026-03-24T10:00:00.000Z",
    updatedAt: "2026-03-24T10:00:00.000Z",
    ...overrides,
  };
}

describe("extension badge helpers", () => {
  it("counts only active todos", () => {
    expect(getActiveTodoCount([createTodo(), createTodo({ id: "2", completed: true })])).toBe(1);
  });

  it("formats badge text for supported count ranges", () => {
    expect(formatActiveTodoBadgeText(0)).toBe("");
    expect(formatActiveTodoBadgeText(1)).toBe("1");
    expect(formatActiveTodoBadgeText(9)).toBe("9");
    expect(formatActiveTodoBadgeText(10)).toBe("9+");
  });

  it("syncs the action badge text", async () => {
    const setBadgeBackgroundColor = vi.fn().mockResolvedValue(undefined);
    const setBadgeText = vi.fn().mockResolvedValue(undefined);

    vi.stubGlobal("chrome", {
      action: {
        setBadgeBackgroundColor,
        setBadgeText,
      },
    });

    await syncActiveTodoBadge([
      createTodo(),
      createTodo({ id: "2" }),
      createTodo({ id: "3", completed: true }),
    ]);

    expect(setBadgeBackgroundColor).toHaveBeenCalledWith({ color: "#2563eb" });
    expect(setBadgeText).toHaveBeenCalledWith({ text: "2" });

    vi.unstubAllGlobals();
  });
});
