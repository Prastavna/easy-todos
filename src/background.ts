import { syncActiveTodoBadge } from "@/lib/extension";
import { TODO_STORAGE_KEY } from "@/lib/todo-storage";
import type { Todo } from "@/lib/todos";

async function loadTodosFromStorage() {
  const stored = await chrome.storage.local.get(TODO_STORAGE_KEY);
  return Array.isArray(stored[TODO_STORAGE_KEY]) ? (stored[TODO_STORAGE_KEY] as Todo[]) : [];
}

async function refreshBadge() {
  await syncActiveTodoBadge(await loadTodosFromStorage());
}

chrome.runtime.onInstalled.addListener(() => {
  void refreshBadge();
});

chrome.runtime.onStartup.addListener(() => {
  void refreshBadge();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local" || !changes[TODO_STORAGE_KEY]) {
    return;
  }

  const nextTodos = changes[TODO_STORAGE_KEY].newValue;
  void syncActiveTodoBadge(Array.isArray(nextTodos) ? (nextTodos as Todo[]) : []);
});

void refreshBadge();
