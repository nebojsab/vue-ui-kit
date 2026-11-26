<template>
  <div
    v-if="visible"
    :role="tone === 'danger' || tone === 'warning' ? 'alert' : 'status'"
    :class="['flex gap-3 rounded-card border p-4', TONE[tone]?.box ?? TONE.info.box]"
  >
    <component
      :is="icon ?? TONE[tone]?.icon ?? TONE.info.icon"
      v-if="icon !== false"
      :class="['w-5 h-5 flex-shrink-0 mt-px', TONE[tone]?.text ?? TONE.info.text]"
      aria-hidden="true"
    />
    <div class="flex-1 min-w-0 text-sm">
      <p v-if="title" class="font-semibold text-fg">{{ title }}</p>
      <div v-if="$slots.default" :class="['text-fg-2', title && 'mt-0.5']"><slot /></div>
      <div v-if="$slots.actions" class="mt-3 flex flex-wrap gap-2"><slot name="actions" /></div>
    </div>
    <button
      v-if="dismissible"
      type="button"
      class="-m-1 p-1 h-8 w-8 flex items-center justify-center rounded-lg text-fg-muted hover:text-fg hover:bg-surface-3/60 transition-colors flex-shrink-0"
      :aria-label="dismissLabel"
      @click="dismiss"
    >
      <XMarkIcon class="w-4 h-4" aria-hidden="true" />
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  InformationCircleIcon, CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, SparklesIcon, XMarkIcon,
} from '@heroicons/vue/24/outline'

/**
 * Inline message in the page flow — not a toast (gone after seconds) and not a
 * modal (blocks). Danger and warning are announced right away (role="alert"),
 * the rest politely (role="status").
 */
const props = defineProps({
  /** 'info' | 'success' | 'warning' | 'danger' | 'brand' */
  tone: { type: String, default: 'info' },
  title: { type: String, default: null },
  /** Heroicon component, or false for no icon. Default: one per tone */
  icon: { type: [Object, Function, Boolean], default: null },
  dismissible: { type: Boolean, default: false },
  dismissLabel: { type: String, default: 'Dismiss' },
})
const emit = defineEmits(['dismiss'])

const visible = ref(true)
function dismiss() {
  visible.value = false
  emit('dismiss')
}

const TONE = {
  info:    { box: 'bg-surface-2 border-line',                     text: 'text-fg-2',    icon: InformationCircleIcon },
  success: { box: 'bg-success/[0.08] border-success/30',          text: 'text-success', icon: CheckCircleIcon },
  warning: { box: 'bg-warning/[0.08] border-warning/40',          text: 'text-warning', icon: ExclamationTriangleIcon },
  danger:  { box: 'bg-danger/[0.08] border-danger/35',            text: 'text-danger',  icon: XCircleIcon },
  brand:   { box: 'bg-brand/[0.08] border-brand/30',              text: 'text-brand',   icon: SparklesIcon },
}
</script>
