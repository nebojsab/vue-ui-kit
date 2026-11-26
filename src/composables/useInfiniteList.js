import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

/**
 * Show a long list in pages that load as you scroll — no "Load more" button.
 * Put <div ref="sentinel" /> after the list; when it nears the bottom of the
 * scroller, the next page is added.
 *
 *   const { shown, hasMore, loading, loadingMore, sentinel } =
 *     useInfiniteList(list, { pageSize: 20, resetOn: [() => route.query] })
 *
 * `loading` = first page (on mount and whenever resetOn changes), `loadingMore` = next page.
 * firstDelay / nextDelay stand in for the network in prototypes (default 0).
 * Swap in a real fetch later: the template contract stays the same.
 */
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

export function useInfiniteList(list, {
  pageSize = 20,
  resetOn = [],
  scroller = 'main',
  firstDelay = 0,
  nextDelay = 0,
  rootMargin = 400,
} = {}) {
  const limit = ref(0)
  const loading = ref(false)
  const loadingMore = ref(false)
  const sentinel = ref(null)
  const shown = computed(() => list.value.slice(0, limit.value))
  const hasMore = computed(() => limit.value < list.value.length)
  let root = null

  // Each reset gets a ticket so a slow, outdated response can't overwrite a newer one
  let ticket = 0
  async function reset() {
    const t = ++ticket
    loading.value = true
    loadingMore.value = false
    limit.value = 0
    if (firstDelay) await wait(firstDelay)
    if (t !== ticket) return
    limit.value = pageSize
    loading.value = false
    checkFill()
  }

  async function loadMore() {
    if (loading.value || loadingMore.value || !hasMore.value) return
    const t = ticket
    loadingMore.value = true
    if (nextDelay) await wait(nextDelay)
    if (t !== ticket) return
    limit.value += pageSize
    loadingMore.value = false
    checkFill()
  }

  // A page that doesn't fill the screen leaves the sentinel in view — the observer
  // won't fire again for it, so check after each page lands.
  function checkFill() {
    requestAnimationFrame(() => {
      const el = sentinel.value
      if (!el) return
      const bottom = root && root !== window ? root.getBoundingClientRect().bottom : window.innerHeight
      if (el.getBoundingClientRect().top - bottom < rootMargin) loadMore()
    })
  }

  if (resetOn.length) watch(resetOn, reset)

  let observer
  onMounted(() => {
    root = typeof scroller === 'string' ? document.querySelector(scroller) : scroller
    observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) loadMore()
    }, { root: root ?? null, rootMargin: `0px 0px ${rootMargin}px 0px` })
    watch(sentinel, (el, old) => {
      if (old) observer.unobserve(old)
      if (el) observer.observe(el)
    }, { immediate: true })
    reset()
  })
  onUnmounted(() => { ticket++; observer?.disconnect() })

  return { shown, hasMore, loading, loadingMore, sentinel, reset, loadMore }
}
