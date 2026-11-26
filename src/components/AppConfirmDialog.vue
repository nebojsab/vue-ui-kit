<template>
  <!-- Asks before anything that can't be taken back (delete, remove, discard, disconnect…).
       Title is the question, the slot says what happens, the confirm button repeats the verb.
       Focus starts on Cancel, so Enter never destroys by accident. -->
  <AppModal :model-value="modelValue" :title="title" size="sm" @update:model-value="cancel">
    <div class="text-[14.5px] text-fg-2 space-y-3">
      <slot />
    </div>
    <template #footer>
      <AppButton ref="cancelBtn" variant="ghost" @click="cancel">{{ cancelLabel }}</AppButton>
      <AppButton :variant="tone === 'danger' ? 'danger' : 'primary'" @click="$emit('confirm')">{{ confirmLabel }}</AppButton>
    </template>
  </AppModal>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import AppModal from './AppModal.vue'
import AppButton from './AppButton.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  /** The question: "Delete this role?" */
  title: { type: String, required: true },
  /** The verb again: "Delete role" — never "OK" or "Yes" */
  confirmLabel: { type: String, required: true },
  cancelLabel: { type: String, default: 'Cancel' },
  /** 'danger' — gone for good; 'default' — disruptive but reversible (replace a secret) */
  tone: { type: String, default: 'danger' },
})
const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

function cancel() {
  emit('update:modelValue', false)
  emit('cancel')
}

// Safe default: Cancel has focus once the dialog opens
const cancelBtn = ref(null)
watch(() => props.modelValue, async (open) => {
  if (!open) return
  await nextTick()
  await nextTick()
  cancelBtn.value?.$el?.focus?.()
})
</script>
