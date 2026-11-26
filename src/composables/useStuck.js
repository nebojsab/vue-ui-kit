import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Is a sticky element currently stuck? Put `sentinel` on an empty element right
 * before it; once that sentinel scrolls past the top of the scroller, it's stuck.
 *
 *   const { sentinel, stuck } = useStuck()           // scroller: the app shell's <main>
 *   <div ref="sentinel" /> <div class="sticky top-0" :class="stuck && 'shadow'">…
 */
export function useStuck({ scroller = 'main' } = {}) {
  const sentinel = ref(null)
  const stuck = ref(false)
  let el = null

  function update() {
    if (!sentinel.value) return
    const top = el === window ? 0 : el.getBoundingClientRect().top
    stuck.value = sentinel.value.getBoundingClientRect().top < top + 1
  }
  onMounted(() => {
    el = typeof scroller === 'string' ? document.querySelector(scroller) ?? window : scroller ?? window
    el.addEventListener('scroll', update, { passive: true })
    update()
  })
  onUnmounted(() => el?.removeEventListener('scroll', update))

  return { sentinel, stuck, update }
}
