import type { Todo } from "@/lib/todos";

export const TODO_STORAGE_KEY = "easy-todos.todos";

function hasChromeStorage() {
  return typeof chrome !== "undefined" && Boolean(chrome.storage?.local);
}

function parseLegacyTodos(raw: string | null) {
  if (!raw) {
    return [] as Todo[];
  }

  try {
    const parsed = JSON.parse(raw) as Todo[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function toPlainTodos(todos: Todo[]) {
  return JSON.parse(JSON.stringify(todos)) as Todo[];
}

export async function loadStoredTodos() {
  if (hasChromeStorage()) {
    const stored = await chrome.storage.local.get(TODO_STORAGE_KEY);
    if (Array.isArray(stored[TODO_STORAGE_KEY])) {
      return stored[TODO_STORAGE_KEY] as Todo[];
    }

    const legacyTodos = parseLegacyTodos(window.localStorage.getItem(TODO_STORAGE_KEY));
    if (legacyTodos.length > 0) {
      await chrome.storage.local.set({ [TODO_STORAGE_KEY]: legacyTodos });
      return legacyTodos;
    }

    return [] as Todo[];
  }

  return parseLegacyTodos(window.localStorage.getItem(TODO_STORAGE_KEY));
}

export async function saveStoredTodos(todos: Todo[]) {
  if (hasChromeStorage()) {
    await chrome.storage.local.set({ [TODO_STORAGE_KEY]: toPlainTodos(todos) });
    return;
  }

  window.localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
}

export function subscribeToStoredTodos(listener: (todos: Todo[]) => void) {
  if (hasChromeStorage()) {
    const handleChange = (
      changes: Record<string, chrome.storage.StorageChange>,
      areaName: string,
    ) => {
      if (areaName !== "local" || !changes[TODO_STORAGE_KEY]) {
        return;
      }

      const nextTodos = changes[TODO_STORAGE_KEY].newValue;
      listener(Array.isArray(nextTodos) ? (nextTodos as Todo[]) : []);
    };

    chrome.storage.onChanged.addListener(handleChange);
    return () => chrome.storage.onChanged.removeListener(handleChange);
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== TODO_STORAGE_KEY) {
      return;
    }

    listener(parseLegacyTodos(event.newValue));
  };

  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}
