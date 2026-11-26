import { reactive } from 'vue'

/**
 * App-wide toasts without a store library — render <AppToaster /> once,
 * call toast() from anywhere.
 *
 *   import { toast } from '@nebojsab/vue-ui-kit'
 *   toast('Activity logged')            // success
 *   toast('+50 pts', 'reward')          // 'success' | 'reward' | 'danger'
 */
export const toasts = reactive([])

export function toast(message, tone = 'success', ms = 4000) {
  const id = Date.now() + Math.random()
  toasts.push({ id, message, tone })
  setTimeout(() => {
    const i = toasts.findIndex((t) => t.id === id)
    if (i >= 0) toasts.splice(i, 1)
  }, ms)
  return id
}
