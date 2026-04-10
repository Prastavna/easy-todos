import type { Todo } from "@/lib/todos";

const ACTIVE_TODOS_BADGE_COLOR = "#2563eb";

export function getAppTabUrl() {
  if (chrome?.runtime?.getURL) {
    return chrome.runtime.getURL("app.html");
  }

  return "/app.html";
}

export async function openAppInTab() {
  const url = getAppTabUrl();

  if (chrome?.tabs?.create) {
    await chrome.tabs.create({ url });
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
}

export function getActiveTodoCount(todos: Todo[]) {
  return todos.filter((todo) => !todo.completed).length;
}

export function formatActiveTodoBadgeText(count: number) {
  if (count <= 0) {
    return "";
  }

  return count > 9 ? "9+" : String(count);
}

export async function syncActiveTodoBadge(todos: Todo[]) {
  if (typeof chrome === "undefined" || !chrome.action?.setBadgeText) {
    return;
  }

  const text = formatActiveTodoBadgeText(getActiveTodoCount(todos));

  await chrome.action.setBadgeBackgroundColor({ color: ACTIVE_TODOS_BADGE_COLOR });
  await chrome.action.setBadgeText({ text });
}
