import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { describe, expect, it } from 'vitest'

import TodoFormDialog from '@/components/todos/TodoFormDialog.vue'
import { priorityOptions, type TodoForm } from '@/lib/todos'

const ButtonStub = defineComponent({
  name: 'Button',
  emits: ['click'],
  template: '<button v-bind="$attrs" @click="$emit(\'click\', $event)"><slot /></button>',
})

const InputStub = defineComponent({
  name: 'Input',
  props: {
    modelValue: { type: [String, Number], default: '' },
  },
  emits: ['update:modelValue'],
  template: '<input :value="modelValue">',
})

const TextareaStub = defineComponent({
  name: 'Textarea',
  props: {
    modelValue: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
  template: '<textarea :value="modelValue"></textarea>',
})

const SelectStub = defineComponent({
  name: 'Select',
  props: {
    modelValue: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
  template: '<div><slot /></div>',
})

const stubs = {
  Button: ButtonStub,
  Dialog: { template: '<div><slot /></div>' },
  DialogContent: { template: '<div><slot /></div>' },
  DialogDescription: { template: '<p><slot /></p>' },
  DialogFooter: { template: '<div><slot /></div>' },
  DialogHeader: { template: '<div><slot /></div>' },
  DialogTitle: { template: '<h2><slot /></h2>' },
  Input: InputStub,
  Select: SelectStub,
  SelectContent: { template: '<div><slot /></div>' },
  SelectItem: { template: '<div><slot /></div>' },
  SelectTrigger: { template: '<div><slot /></div>' },
  SelectValue: { template: '<div><slot /></div>' },
  Textarea: TextareaStub,
}

function createForm(): TodoForm {
  return {
    title: '',
    description: '',
    priority: 'medium',
    deadline: '',
    group: 'General',
  }
}

function mountDialog(overrides: Partial<InstanceType<typeof TodoFormDialog>['$props']> = {}) {
  return mount(TodoFormDialog, {
    props: {
      open: true,
      title: 'Create task',
      description: 'Capture the details',
      form: createForm(),
      canSubmit: true,
      isEditing: false,
      priorityOptions,
      ...overrides,
    },
    global: { stubs },
  })
}

describe('TodoFormDialog', () => {
  it('renders create mode content and emits submit', async () => {
    const wrapper = mountDialog()

    expect(wrapper.text()).toContain('Create task')
    expect(wrapper.text()).toContain('Create todo')

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')).toHaveLength(1)
  })

  it('renders editing mode copy', () => {
    const wrapper = mountDialog({
      title: 'Edit task',
      isEditing: true,
    })

    expect(wrapper.text()).toContain('Edit task')
    expect(wrapper.text()).toContain('Save changes')
  })

  it('emits update:open when cancel is clicked', async () => {
    const wrapper = mountDialog()
    const buttons = wrapper.findAll('button')

    await buttons[1]!.trigger('click')

    expect(wrapper.emitted('update:open')).toEqual([[false]])
  })

  it('updates the provided form object through v-model inputs', async () => {
    const form = createForm()
    const wrapper = mountDialog({ form })
    const inputs = wrapper.findAllComponents(InputStub)
    const textarea = wrapper.findComponent(TextareaStub)
    const select = wrapper.findComponent(SelectStub)

    inputs[0]!.vm.$emit('update:modelValue', 'Write tests')
    textarea.vm.$emit('update:modelValue', 'Cover the dialog behavior')
    select.vm.$emit('update:modelValue', 'high')
    inputs[1]!.vm.$emit('update:modelValue', '2026-04-08')
    inputs[2]!.vm.$emit('update:modelValue', 'Engineering')
    await wrapper.vm.$nextTick()

    expect(form).toEqual({
      title: 'Write tests',
      description: 'Cover the dialog behavior',
      priority: 'high',
      deadline: '2026-04-08',
      group: 'Engineering',
    })
  })
})
