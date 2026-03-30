import { createApp } from 'vue'

import TodoApp from '@/components/todos/TodoApp.vue'
import '@/style.css'

createApp(TodoApp, { mode: 'tab' }).mount('#app')
