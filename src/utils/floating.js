import { ref, onUnmounted } from 'vue'

/**
 * Floating panels (popover, combobox list) are teleported to <body> with fixed
 * coordinates, so a modal's scrolling body or a card's overflow can't clip them.
 * They open below their anchor, or above when there's clearly more room there.
 *
 *   const { style, placement, update, start, stop } = useFloating(anchorRef, { align: 'start', gap: 8 })
 *   start() when the panel opens · stop() when it closes
 */
const MARGIN = 12 // keep clear of the viewport edge

export function useFloating(anchor, {
  align = 'start',     // 'start' | 'end' | 'stretch' (match the anchor's width)
  gap = 8,
  width = null,        // px; null = anchor width when 'stretch', else the panel's own width
  minBelow = 240,      // flip above when less than this fits below…
} = {}) {
  const style = ref({})
  const placement = ref('bottom')
  const maxHeight = ref(320)

  function update() {
    const el = anchor.value?.$el ?? anchor.value
    if (!el) return
    const r = el.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    const below = vh - r.bottom - gap - MARGIN
    const above = r.top - gap - MARGIN
    const up = below < minBelow && above > below // …and there's more room above
    placement.value = up ? 'top' : 'bottom'
    maxHeight.value = Math.max(120, up ? above : below)

    const w = align === 'stretch' ? r.width : width
    let left = align === 'end' && w ? r.right - w : r.left
    if (w) left = Math.min(Math.max(MARGIN, left), vw - w - MARGIN)

    style.value = {
      position: 'fixed',
      left: `${Math.round(left)}px`,
      ...(w ? { width: `${Math.round(w)}px` } : {}),
      ...(align === 'end' && !w ? { left: 'auto', right: `${Math.round(vw - r.right)}px` } : {}),
      ...(up ? { bottom: `${Math.round(vh - r.top + gap)}px` } : { top: `${Math.round(r.bottom + gap)}px` }),
    }
  }

  // Follow the anchor while open — any scroll (captured, so scrolling modals count) or resize
  let raf = 0
  const onMove = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update) }
  function start() {
    update()
    window.addEventListener('scroll', onMove, true)
    window.addEventListener('resize', onMove)
  }
  function stop() {
    cancelAnimationFrame(raf)
    window.removeEventListener('scroll', onMove, true)
    window.removeEventListener('resize', onMove)
  }
  onUnmounted(stop)

  return { style, placement, maxHeight, update, start, stop }
}
