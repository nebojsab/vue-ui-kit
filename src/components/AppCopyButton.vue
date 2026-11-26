<template>
  <!-- Copies text to the clipboard; says "Copied" for a moment, and a toast confirms it.
       Looks like a text link, so it sits next to a value (client ID, invite link) without shouting. -->
  <button
    type="button"
    class="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand hover:underline flex-shrink-0 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-brand"
    :aria-label="`Copy ${what.toLowerCase()}`"
    @click="copy"
  >
    <CheckIcon v-if="copied" class="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
    <ClipboardDocumentIcon v-else class="w-4 h-4" aria-hidden="true" />
    <span v-if="!iconOnly">{{ copied ? copiedLabel : label }}</span>
  </button>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { ClipboardDocumentIcon, CheckIcon } from '@heroicons/vue/24/outline'
import { toast } from '../toast.js'

const props = defineProps({
  /** What goes on the clipboard */
  text: { type: String, required: true },
  /** What it is, for the toast and screen readers: "Client ID" → "Client ID copied" */
  what: { type: String, default: 'Text' },
  label: { type: String, default: 'Copy' },
  copiedLabel: { type: String, default: 'Copied' },
  /** Just the icon (tight spots) — the aria-label still says what's copied */
  iconOnly: { type: Boolean, default: false },
  /** Show a toast as well as the "Copied" label */
  notify: { type: Boolean, default: true },
})
const emit = defineEmits(['copied'])

const copied = ref(false)
let timer
async function copy() {
  try {
    await navigator.clipboard.writeText(props.text)
    copied.value = true
    clearTimeout(timer)
    timer = setTimeout(() => { copied.value = false }, 2000)
    if (props.notify) toast(`${props.what} copied`)
    emit('copied')
  } catch {
    toast(`Couldn't copy — select the ${props.what.toLowerCase()} and copy it`, 'danger')
  }
}
onBeforeUnmount(() => clearTimeout(timer))
</script>
