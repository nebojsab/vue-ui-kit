import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// Dev server / build for the docs site (docs/). The package itself ships source.
// GitHub Pages serves the docs from /vue-ui-kit/ — the workflow sets BASE_PATH.
export default defineConfig({
  root: 'docs',
  base: process.env.BASE_PATH ?? '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@ds': fileURLToPath(new URL('./src', import.meta.url)),
      '@nebojsab/vue-ui-kit': fileURLToPath(new URL('./src/index.js', import.meta.url)),
    },
  },
  build: { outDir: '../docs-dist', emptyOutDir: true },
})
