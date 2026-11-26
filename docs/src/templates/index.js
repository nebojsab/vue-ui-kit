// Full-page templates: shown in an iframe on their docs page and full screen at /preview/<name>.
// Each is a plain SFC that imports from '@nebojsab/vue-ui-kit', so its source is copy-paste ready.
export const templates = {
  dashboard: {
    title: 'Dashboard',
    load: () => import('./Dashboard.vue'),
    source: () => import('./Dashboard.vue?raw'),
  },
  settings: {
    title: 'Settings',
    load: () => import('./Settings.vue'),
    source: () => import('./Settings.vue?raw'),
  },
  'sign-in': {
    title: 'Sign in',
    load: () => import('./SignIn.vue'),
    source: () => import('./SignIn.vue?raw'),
  },
  projects: {
    title: 'Projects',
    load: () => import('./Projects.vue'),
    source: () => import('./Projects.vue?raw'),
  },
}
