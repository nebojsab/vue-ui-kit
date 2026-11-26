import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './main.css'
import { navGroups } from './nav-data.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: () => import('./views/HomeView.vue') },
    { path: '/preview/:name', component: () => import('./views/PreviewView.vue') },
    { path: '/:slug', component: () => import('./views/ComponentView.vue') },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

// Title + description per page (the build also writes them into static HTML for crawlers)
const pages = Object.fromEntries(navGroups.flatMap((g) => g.items.map((i) => [i.slug, i])))
const HOME_TITLE = document.title
router.afterEach((to) => {
  const item = pages[to.params.slug]
  document.title = item ? `${item.label} — Vue UI Kit` : HOME_TITLE
  if (item) document.querySelector('meta[name="description"]')?.setAttribute('content', `${item.label}: ${item.description}.`)
})

createApp(App).use(router).mount('#app')
