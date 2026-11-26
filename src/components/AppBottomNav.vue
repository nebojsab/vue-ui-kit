<template>
  <!-- Phones only (below md): 5-slot tab bar — two tabs · main action · one tab · More.
       The sidebar (AppSidebar) takes over from md up. -->
  <nav
    :aria-label="navLabel"
    :class="[
      'inset-x-0 bottom-0 z-40 border-t border-line bg-surface-1/95 backdrop-blur-md',
      preview ? 'absolute' : 'md:hidden fixed pb-[env(safe-area-inset-bottom)]',
    ]"
  >
    <ul class="grid grid-cols-5 h-[68px]">
      <li v-for="item in left" :key="item.label">
        <component :is="tagFor(item)" v-bind="attrsFor(item)" :class="tabClass(active(item))" @click="item.onClick?.()">
          <component :is="item.icon" class="w-6 h-6" aria-hidden="true" />
          <span>{{ item.label }}</span>
        </component>
      </li>

      <!-- Main action, raised above the bar -->
      <li class="flex justify-center">
        <button
          type="button"
          class="-mt-6 w-[60px] h-[60px] rounded-full bg-brand text-brand-on flex items-center justify-center ring-[6px] ring-page shadow-[0_10px_30px_-6px_rgb(var(--ui-brand)/0.8)] active:scale-95 transition-transform"
          :aria-label="action.label"
          @click="$emit('action')"
        >
          <component :is="action.icon ?? PlusIcon" class="w-7 h-7 stroke-[2.5]" aria-hidden="true" />
        </button>
      </li>

      <li v-for="item in right" :key="item.label">
        <component :is="tagFor(item)" v-bind="attrsFor(item)" :class="tabClass(active(item))" @click="item.onClick?.()">
          <component :is="item.icon" class="w-6 h-6" aria-hidden="true" />
          <span>{{ item.label }}</span>
        </component>
      </li>

      <li v-if="more.length">
        <button
          type="button"
          :class="tabClass(moreOpen || moreActive)"
          aria-haspopup="dialog"
          :aria-expanded="moreOpen"
          @click="moreOpen = true"
        >
          <Squares2X2Icon class="w-6 h-6" aria-hidden="true" />
          <span>More</span>
        </button>
      </li>
    </ul>
  </nav>

  <!-- More: bottom sheet with the rest of the nav -->
  <Teleport to="body" :disabled="preview">
    <Transition name="sheet">
      <div
        v-if="moreOpen"
        :class="['inset-0 z-[60] flex flex-col justify-end', preview ? 'absolute' : 'md:hidden fixed']"
        @keydown.esc="moreOpen = false"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-[2px]" aria-hidden="true" @click="moreOpen = false" />
        <div
          ref="sheet"
          role="dialog"
          aria-modal="true"
          aria-label="More"
          tabindex="-1"
          class="sheet-panel relative rounded-t-[28px] bg-surface-1 border-t border-line px-4 pt-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))] outline-none max-h-[85vh] overflow-y-auto"
        >
          <div class="mx-auto mb-4 w-10 h-1.5 rounded-full bg-line" aria-hidden="true" />
          <ul class="space-y-1">
            <li v-for="item in more" :key="item.label">
              <component
                :is="tagFor(item)"
                v-bind="attrsFor(item)"
                :class="[
                  'flex items-center gap-3 h-12 px-3 rounded-xl text-[15px] font-bold w-full text-left',
                  active(item) ? 'bg-surface-2 text-fg ring-1 ring-inset ring-line [&>svg]:text-brand' : 'text-fg-2',
                ]"
                @click="item.onClick?.(); moreOpen = false"
              >
                <component :is="item.icon" class="w-5 h-5" aria-hidden="true" />
                {{ item.label }}
                <ChevronRightIcon class="w-4 h-4 ml-auto text-fg-muted" aria-hidden="true" />
              </component>
            </li>
          </ul>
          <slot name="more" :close="() => (moreOpen = false)" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, getCurrentInstance, resolveDynamicComponent } from 'vue'
import { PlusIcon, Squares2X2Icon, ChevronRightIcon } from '@heroicons/vue/24/outline'

/**
 * Items: { label, icon, to? | onClick?, active? }
 *   tabs:   up to 3 — the first two sit left of the action, the third right of it
 *   more:   everything else, in a bottom sheet behind "More"
 *   action: { label, icon? } — the raised centre button; listen to @action
 */
const props = defineProps({
  tabs:     { type: Array, required: true },
  more:     { type: Array, default: () => [] },
  action:   { type: Object, default: () => ({ label: 'Add' }) },
  isActive: { type: Function, default: null },
  navLabel: { type: String, default: 'Main' },
  /** Docs / previews: render inside the nearest positioned box (absolute, not fixed) at any width,
   *  and open More inside it too. Leave off in apps. */
  preview:  { type: Boolean, default: false },
})
defineEmits(['action'])

const instance = getCurrentInstance()
const router = instance?.appContext.config.globalProperties.$router
const RouterLink = router ? resolveDynamicComponent('RouterLink') : 'a'

const left = computed(() => props.tabs.slice(0, 2))
const right = computed(() => props.tabs.slice(2, props.more.length ? 3 : 4))

const tagFor = (item) => (item.to ? RouterLink : 'button')
// RouterLink gets `to`, a plain <a> gets `href` — never both (a fallthrough href would override RouterLink's)
const attrsFor = (item) => item.to
  ? { ...(RouterLink === 'a' ? { href: item.to } : { to: item.to }), 'aria-current': active(item) ? 'page' : undefined }
  : { type: 'button', 'aria-pressed': item.active ?? undefined }

function active(item) {
  if (item.active !== undefined) return item.active
  if (!item.to) return false
  if (props.isActive) return props.isActive(item)
  const path = router?.currentRoute.value.path ?? window.location.pathname
  return item.to === '/' ? path === '/' : path.startsWith(item.to)
}
const moreActive = computed(() => props.more.some(active))

const moreOpen = ref(false)
const sheet = ref(null)
if (router) watch(() => router.currentRoute.value.fullPath, () => { moreOpen.value = false })
watch(moreOpen, async (open) => { if (open) { await nextTick(); sheet.value?.focus() } })

function tabClass(on) {
  return [
    'w-full h-full flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition-colors',
    on ? 'text-brand' : 'text-fg-muted active:text-fg',
  ]
}
</script>

<style scoped>
.sheet-enter-active, .sheet-leave-active { transition: opacity .2s ease; }
.sheet-enter-active .sheet-panel, .sheet-leave-active .sheet-panel { transition: transform .25s cubic-bezier(.2, .8, .2, 1); }
.sheet-enter-from, .sheet-leave-to { opacity: 0; }
.sheet-enter-from .sheet-panel, .sheet-leave-to .sheet-panel { transform: translateY(100%); }
</style>
