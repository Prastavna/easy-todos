import { mount } from "@vue/test-utils";
import { defineComponent } from "vue";
import { describe, expect, it } from "vitest";

import TodoFilters from "@/components/todos/TodoFilters.vue";
import { deadlineOptions, groupByOptions, priorityOptions, statusOptions } from "@/lib/todos";

const InputStub = defineComponent({
  name: "Input",
  props: {
    modelValue: { type: [String, Number], default: "" },
  },
  emits: ["update:modelValue"],
  template:
    '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)">',
});

const ButtonStub = defineComponent({
  name: "Button",
  emits: ["click"],
  template: '<button v-bind="$attrs" @click="$emit(\'click\', $event)"><slot /></button>',
});

const SelectStub = defineComponent({
  name: "Select",
  props: {
    modelValue: { type: String, default: "" },
  },
  emits: ["update:modelValue"],
  template: "<div><slot /></div>",
});

const stubs = {
  Button: ButtonStub,
  Card: { template: "<div><slot /></div>" },
  CardContent: { template: "<div><slot /></div>" },
  DropdownMenu: { template: "<div><slot /></div>" },
  DropdownMenuTrigger: { template: "<div><slot /></div>" },
  DropdownMenuContent: { template: "<div><slot /></div>" },
  Input: InputStub,
  Select: SelectStub,
  SelectTrigger: { template: "<div><slot /></div>" },
  SelectValue: { template: "<div><slot /></div>" },
  SelectContent: { template: "<div><slot /></div>" },
  SelectItem: { template: "<div><slot /></div>" },
  Icon: { template: "<i />" },
};

function mountFilters() {
  return mount(TodoFilters, {
    props: {
      search: "",
      statusFilter: "all",
      priorityFilter: "all",
      deadlineFilter: "all",
      groupFilter: "all",
      groupBy: "group",
      availableGroups: ["General", "Ops"],
      statusOptions,
      priorityOptions,
      deadlineOptions,
      groupByOptions,
      hasActiveFilters: true,
    },
    global: { stubs },
  });
}

describe("TodoFilters", () => {
  it("emits a string search value from the search input", async () => {
    const wrapper = mountFilters();
    const input = wrapper.findComponent(InputStub);

    input.vm.$emit("update:modelValue", 42);
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("update:search")).toEqual([["42"]]);
  });

  it("emits reset when reset buttons are clicked", async () => {
    const wrapper = mountFilters();
    const resetButtons = wrapper
      .findAll("button")
      .filter((button) => button.text().includes("Reset"));

    await resetButtons[0]!.trigger("click");
    await resetButtons[1]!.trigger("click");

    expect(wrapper.emitted("reset")).toHaveLength(2);
  });

  it("shows the active filter indicator when filters are active", () => {
    const wrapper = mountFilters();

    expect(wrapper.html()).toContain("bg-teal-500");
  });

  it("renders available group labels and option labels", () => {
    const wrapper = mountFilters();
    const text = wrapper.text();

    expect(text).toContain("Status");
    expect(text).toContain("Priority");
    expect(text).toContain("Deadline");
    expect(text).toContain("Group");
    expect(text).toContain("Group list by");
    expect(text).toContain("General");
    expect(text).toContain("Ops");
    expect(text).toContain("All tasks");
    expect(text).toContain("No grouping");
  });
});
