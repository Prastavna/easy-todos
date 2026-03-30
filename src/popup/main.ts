import { createApp } from 'vue'

import TodoApp from '@/components/todos/TodoApp.vue'
import '@/style.css'

createApp(TodoApp, { mode: 'popup' }).mount('#app')
