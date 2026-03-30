import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
  manifest_version: 3,
  name: 'Easy Todos',
  description: 'A local-first todo app with priorities, deadlines, filters, and groups.',
  version: '0.0.0',
  permissions: ['storage'],
  action: {
    default_popup: 'popup.html',
    default_title: 'Easy Todos',
  },
  options_page: 'app.html',
})
