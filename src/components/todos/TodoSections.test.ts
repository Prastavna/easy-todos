import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import TodoSections from "@/components/todos/TodoSections.vue";
import type { Todo } from "@/lib/todos";

function createTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    id: "1",
    title: "Write tests",
    description: "Cover keyboard shortcuts",
    priority: "medium",
    deadline: "",
    group: "General",
    completed: false,
    createdAt: "2026-04-07T10:00:00.000Z",
    updatedAt: "2026-04-07T10:00:00.000Z",
    ...overrides,
  };
}

const stubs = {
  Icon: { template: "<i />" },
  Accordion: { template: "<div><slot /></div>" },
  AccordionItem: { template: "<div><slot /></div>" },
  AccordionTrigger: { template: "<div><slot /></div>" },
  AccordionContent: { template: "<div><slot /></div>" },
  Badge: { template: "<span><slot /></span>" },
  Button: { template: "<button><slot /></button>" },
  Card: { template: "<article><slot /></article>" },
  CardHeader: { template: "<div><slot /></div>" },
  CardContent: { template: "<div><slot /></div>" },
  CardTitle: { template: "<h3><slot /></h3>" },
  CardDescription: { template: "<p><slot /></p>" },
  Separator: { template: "<hr />" },
};

function mountSections(todo: Todo) {
  return mount(TodoSections, {
    props: {
      sections: [{ key: "general", label: "General", items: [todo] }],
      expandedSections: ["general"],
      getPriorityTone: () => "priority-tone",
      getStatusTone: () => "status-tone",
      normalizeGroup: (value: string) => value,
      getDeadlineLabel: () => "Due today",
      formatUpdatedAt: () => "Apr 7, 2026",
    },
    global: {
      stubs,
    },
  });
}

describe("TodoSections", () => {
  it("does not render a deadline pill when a todo has no deadline", () => {
    const wrapper = mountSections(createTodo());

    expect(wrapper.text()).not.toContain("No deadline");
    expect(wrapper.text()).not.toContain("Due today");
  });

  it("renders a deadline pill when a todo has a deadline", () => {
    const wrapper = mountSections(createTodo({ deadline: "2026-04-07" }));

    expect(wrapper.text()).toContain("Due today");
  });
});
