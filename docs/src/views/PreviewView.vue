<template>
  <component :is="page" v-if="page" />
  <p v-else-if="missing" class="p-8 text-sm text-fg-muted">No template called “{{ name }}”.</p>
  <AppToaster />
</template>

<script setup>
// Full-screen template preview (/preview/:name?theme=light|dark) — no docs chrome.
// The template pages embed this route in an iframe, so breakpoints follow the frame width.
import { shallowRef, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { AppToaster } from '@nebojsab/vue-ui-kit'
import { templates } from '../templates'

const route = useRoute()
const name = ref('')
const page = shallowRef(null)
const missing = ref(false)

const theme = new URLSearchParams(location.search).get('theme')
if (theme === 'light' || theme === 'dark') document.documentElement.classList.toggle('dark', theme === 'dark')

watch(() => route.params.name, async (n) => {
  name.value = n
  const t = templates[n]
  missing.value = !t
  page.value = t ? (await t.load()).default : null
  document.title = t ? `${t.title} template — Vue UI Kit` : 'Vue UI Kit'
}, { immediate: true })
</script>
