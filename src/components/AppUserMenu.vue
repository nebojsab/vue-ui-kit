<template>
  <!-- User menu for the topbar: avatar + name/role (lg), opens a menu with who you are,
       your links and Sign out. The same in every app. -->
  <div ref="root" class="relative">
    <button
      type="button"
      class="flex items-center gap-2 pl-1.5 pr-2 h-11 rounded-control hover:bg-surface-2 transition-colors"
      aria-haspopup="menu"
      :aria-expanded="open"
      :aria-label="`Account menu for ${name}`"
      @click="open = !open"
    >
      <AppAvatar :name="name" size="sm" />
      <span class="hidden lg:flex flex-col items-start text-left leading-tight max-w-[160px]">
        <span class="text-sm font-bold truncate max-w-full">{{ name }}</span>
        <span v-if="role" class="text-[10px] font-bold uppercase tracking-[0.1em] text-fg-muted mt-0.5">{{ role }}</span>
      </span>
      <ChevronDownIcon :class="['w-4 h-4 text-fg-muted transition-transform', open && 'rotate-180']" aria-hidden="true" />
    </button>

    <Transition name="menu">
      <div
        v-if="open"
        role="menu"
        class="absolute right-0 top-full mt-1 z-50 w-60 rounded-xl border border-line bg-surface-1 shadow-lg overflow-hidden"
        @keydown.esc.stop="close(true)"
      >
        <div class="px-4 py-3 border-b border-line">
          <p class="text-sm font-bold truncate">{{ name }}</p>
          <p v-if="email" class="text-[13px] text-fg-muted truncate">{{ email }}</p>
          <slot name="header" />
        </div>
        <div v-if="items.length" class="py-1">
          <component
            :is="item.to ? linkTag : 'button'"
            v-for="item in items"
            :key="item.label"
            role="menuitem"
            v-bind="item.to ? linkProps(item.to) : {}"
            :type="item.to ? undefined : 'button'"
            class="menu-item"
            @click="item.onClick?.(); close()"
          >
            <component :is="item.icon" v-if="item.icon" class="w-4 h-4" aria-hidden="true" />{{ item.label }}
          </component>
        </div>
        <div class="py-1 border-t border-line">
          <button type="button" role="menuitem" class="menu-item text-danger hover:text-danger" @click="$emit('sign-out'); close()">
            <ArrowRightOnRectangleIcon class="w-4 h-4" aria-hidden="true" />{{ signOutLabel }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, getCurrentInstance, resolveDynamicComponent } from 'vue'
import { ChevronDownIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'
import AppAvatar from './AppAvatar.vue'

/** items: [{ label, icon?, to? | onClick? }] — links use <RouterLink> when the app has vue-router */
defineProps({
  name:         { type: String, required: true },
  email:        { type: String, default: '' },
  /** Short role under the name, e.g. 'Admin' */
  role:         { type: String, default: '' },
  items:        { type: Array, default: () => [] },
  signOutLabel: { type: String, default: 'Sign out' },
})
defineEmits(['sign-out'])

const router = getCurrentInstance()?.appContext.config.globalProperties.$router
const linkTag = router ? resolveDynamicComponent('RouterLink') : 'a'
// RouterLink gets `to`, a plain <a> gets `href` — never both (a fallthrough href would override RouterLink's)
const linkProps = (to) => (linkTag === 'a' ? { href: to } : { to })

const root = ref(null)
const open = ref(false)
function close(refocus = false) {
  open.value = false
  if (refocus) root.value?.querySelector('button')?.focus()
}
function onDoc(e) { if (open.value && !root.value?.contains(e.target)) close() }
onMounted(() => document.addEventListener('mousedown', onDoc))
onUnmounted(() => document.removeEventListener('mousedown', onDoc))
</script>

<style scoped>
.menu-item {
  @apply flex items-center gap-3 w-full px-4 py-2.5 text-sm font-semibold text-fg-2 text-left
    hover:bg-surface-2 hover:text-fg transition-colors cursor-pointer;
}
.menu-enter-active, .menu-leave-active { transition: opacity .15s ease, transform .15s ease; }
.menu-enter-from, .menu-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
