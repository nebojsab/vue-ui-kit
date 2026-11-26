// Guides: design principles and the live theming playground
import { ref, computed, watch, onBeforeUnmount, defineComponent, h } from 'vue'
import { CheckIcon, XMarkIcon, ArrowPathIcon, SparklesIcon } from '@heroicons/vue/24/outline'
import AppButton from '@ds/components/AppButton.vue'
import AppBadge from '@ds/components/AppBadge.vue'
import AppInput from '@ds/components/AppInput.vue'
import AppToggle from '@ds/components/AppToggle.vue'
import AppAlert from '@ds/components/AppAlert.vue'
import AppTabs from '@ds/components/AppTabs.vue'
import AppProgressBar from '@ds/components/AppProgressBar.vue'
import AppCopyButton from '@ds/components/AppCopyButton.vue'

// ── Principles ─────────────────────────────────────────────────────────────
const PRINCIPLES = [
  {
    title: 'One colour, one meaning',
    body: 'Indigo (brand) means "you can act here". Gold means reward. Green, amber and red mean status. An accent stands for one category across the whole app. If a colour means two things, it means nothing.',
    do: 'bg-brand on the main button, text-success on "Completed"',
    dont: 'A red "New" badge, or brand-coloured body text',
  },
  {
    title: 'Tokens before hex',
    body: 'Every colour, radius and surface is a token that switches with the theme. A raw hex value breaks dark mode and theming, so add a token instead.',
    do: 'bg-surface-1 border-line text-fg-2',
    dont: 'bg-white dark:bg-[#111827] text-[#334155]',
  },
  {
    title: 'Focus is always visible',
    body: 'Everything you can click can also be reached and used with the keyboard, and shows a focus ring when it is. Menus, tabs and dialogs follow the WAI-ARIA patterns, so arrow keys and Esc work as people expect.',
    do: 'Icon-only buttons with aria-label and a Tooltip',
    dont: 'outline-none without a ring, or a div with @click',
  },
  {
    title: 'Quiet surfaces, loud actions',
    body: 'Pages are calm: layered surfaces, hairline borders, very few shadows. Attention goes to the one or two actions that matter on the screen.',
    do: 'One primary button per view; secondary for the rest',
    dont: 'Three primary buttons in one card',
  },
  {
    title: 'Never colour alone',
    body: 'Status always combines an icon or a word with the colour, so it works for colour-blind people and in grayscale. Text meets WCAG AA contrast in both themes.',
    do: 'Alert with its icon and title; Badge with a word',
    dont: 'A red dot as the only sign of an error',
  },
]

export const guidesDocs = {
  principles: {
    title: 'Principles',
    description: 'Five rules behind every component. When a decision isn\'t covered by a component page, these settle it.',
    stories: [
      {
        name: 'The five rules',
        snippet: `1. One colour, one meaning
2. Tokens before hex
3. Focus is always visible
4. Quiet surfaces, loud actions
5. Never colour alone`,
        demo: defineComponent({ setup() {
          return () => h('ol', { class: 'grid grid-cols-1 lg:grid-cols-2 gap-4' }, PRINCIPLES.map((p, i) =>
            h('li', { class: 'card p-5 flex flex-col' }, [
              h('div', { class: 'flex items-center gap-3' }, [
                h('span', { class: 'w-8 h-8 rounded-lg bg-brand/15 text-brand text-sm font-bold flex items-center justify-center tabular' }, String(i + 1)),
                h('h3', { class: 'font-display font-bold text-lg' }, p.title),
              ]),
              h('p', { class: 'text-sm text-fg-2 mt-3 flex-1' }, p.body),
              h('div', { class: 'mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs' }, [
                h('p', { class: 'flex gap-2 rounded-lg bg-success/[0.08] p-2.5 text-fg-2' }, [h(CheckIcon, { class: 'w-4 h-4 text-success flex-shrink-0' }), p.do]),
                h('p', { class: 'flex gap-2 rounded-lg bg-danger/[0.08] p-2.5 text-fg-2' }, [h(XMarkIcon, { class: 'w-4 h-4 text-danger flex-shrink-0' }), p.dont]),
              ]),
            ])))
        } }),
      },
    ],
  },

  theming: {
    title: 'Theming',
    description: 'Every colour and radius is a CSS variable, so you can retheme the whole kit without touching a component. Pick a brand colour and a corner style here, and the entire docs site changes live. Then copy the generated CSS into your app.',
    whenToUse: [
      'Matching the kit to your product\'s brand colour',
      'Making corners sharper or rounder',
      'Override variables in your own CSS, after the kit\'s styles.css',
    ],
    whenNotTo: [
      "Don't edit the kit's source to change colours — override the variables",
      "Don't pick a brand colour that fails contrast with white text in light mode",
    ],
    stories: [
      {
        name: 'Playground',
        description: 'Changes apply to the whole site until you reset or leave this page.',
        snippet: `/* your app's main.css — after @import '@nebojsab/vue-ui-kit/styles.css' */
:root {
  --ui-brand: 79 70 229;        /* r g b, no commas */
  --ui-radius-card: 1.25rem;
}
html.dark {
  --ui-brand: 129 140 248;
}`,
        demo: defineComponent({ setup() {
          const PRESETS = [
            { name: 'Indigo', hex: '#4F46E5' }, { name: 'Emerald', hex: '#059669' }, { name: 'Rose', hex: '#E11D48' },
            { name: 'Sky', hex: '#0284C7' }, { name: 'Amber', hex: '#D97706' }, { name: 'Slate', hex: '#334155' },
          ]
          const brand = ref('#4F46E5')
          const radius = ref(1) // multiplier
          const toggle = ref(true)
          const tab = ref('a')
          const css = computed(() => themeCss(brand.value, radius.value))
          let el = null
          watch(css, (v) => {
            if (!el) { el = document.createElement('style'); el.id = 'ui-theme-playground'; document.head.appendChild(el) }
            el.textContent = v
          }, { immediate: true })
          onBeforeUnmount(() => el?.remove())
          const reset = () => { brand.value = '#4F46E5'; radius.value = 1 }

          return () => h('div', { class: 'grid grid-cols-1 lg:grid-cols-[18rem_1fr] gap-6' }, [
            // Controls
            h('div', { class: 'space-y-5' }, [
              h('div', [
                h('p', { class: 'text-overline text-fg-muted mb-2' }, 'Brand colour'),
                h('div', { class: 'flex flex-wrap gap-2' }, PRESETS.map((p) => h('button', {
                  type: 'button', 'aria-label': p.name, title: p.name, 'aria-pressed': brand.value.toLowerCase() === p.hex.toLowerCase(),
                  class: ['w-9 h-9 rounded-full ring-offset-2 ring-offset-surface-1 transition', brand.value.toLowerCase() === p.hex.toLowerCase() ? 'ring-2 ring-fg' : 'hover:scale-110'],
                  style: { background: p.hex }, onClick: () => { brand.value = p.hex },
                }))),
                h('label', { class: 'mt-3 flex items-center gap-3 text-sm text-fg-2' }, [
                  h('input', { type: 'color', value: brand.value, class: 'w-9 h-9 rounded-lg border border-line bg-transparent cursor-pointer', onInput: (e) => { brand.value = e.target.value } }),
                  h('span', { class: 'font-mono' }, brand.value.toUpperCase()),
                ]),
              ]),
              h('div', [
                h('label', { for: 'pg-radius', class: 'text-overline text-fg-muted' }, 'Corners'),
                h('input', {
                  id: 'pg-radius', type: 'range', min: 0, max: 2, step: 0.25, value: radius.value, class: 'w-full mt-2 accent-[rgb(var(--ui-brand))]',
                  onInput: (e) => { radius.value = Number(e.target.value) },
                }),
                h('div', { class: 'flex justify-between text-xs text-fg-muted' }, [h('span', 'Sharp'), h('span', `${radius.value}×`), h('span', 'Round')]),
              ]),
              h('div', { class: 'flex gap-2' }, [
                h(AppCopyButton, { text: css.value, what: 'Theme CSS', label: 'Copy CSS' }),
                h(AppButton, { variant: 'ghost', size: 'sm', onClick: reset }, () => [h(ArrowPathIcon, { class: 'w-4 h-4 mr-1.5' }), 'Reset']),
              ]),
            ]),
            // Preview
            h('div', { class: 'rounded-panel border border-line bg-page p-5 space-y-4' }, [
              h('div', { class: 'card p-5 space-y-4' }, [
                h('div', { class: 'flex items-center justify-between gap-3' }, [
                  h('div', [h('p', { class: 'font-display font-bold text-lg' }, 'Workspace'), h('p', { class: 'text-sm text-fg-muted' }, 'Acme Inc. · Pro plan')]),
                  h(AppBadge, { color: 'brand' }, () => 'Active'),
                ]),
                h(AppTabs, {
                  modelValue: tab.value, 'onUpdate:modelValue': (v) => { tab.value = v }, variant: 'pills', panelClass: 'pt-4', ariaLabel: 'Preview',
                  tabs: [{ value: 'a', label: 'General' }, { value: 'b', label: 'Members' }],
                }, {
                  a: () => h('div', { class: 'space-y-3' }, [
                    h(AppInput, { modelValue: 'Acme website', placeholder: 'Name' }),
                    h('div', { class: 'flex items-center justify-between text-sm' }, [h('span', 'Public'), h(AppToggle, { modelValue: toggle.value, 'onUpdate:modelValue': (v) => { toggle.value = v } })]),
                    h(AppProgressBar, { value: 68, label: 'Storage used' }),
                  ]),
                  b: () => h('p', { class: 'text-sm text-fg-2' }, '12 members'),
                }),
                h('div', { class: 'flex gap-2' }, [h(AppButton, () => 'Save changes'), h(AppButton, { variant: 'secondary' }, () => 'Cancel')]),
              ]),
              h(AppAlert, { tone: 'brand', icon: SparklesIcon, title: 'Looks good?' }, () => 'Copy the CSS and paste it after the kit\'s styles.'),
            ]),
          ])
        } }),
      },
    ],
  },
}

// ── Colour helpers ─────────────────────────────────────────────────────────
function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t))
const chan = (rgb) => rgb.join(' ')
function luminance([r, g, b]) {
  const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4 }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
const onColor = (rgb) => (luminance(rgb) > 0.4 ? '15 23 42' : '255 255 255')

function themeCss(hex, k) {
  const base = hexToRgb(hex)
  const darkBrand = mix(base, [255, 255, 255], 0.35)
  const r = (rem) => `${+(rem * k).toFixed(3)}rem`
  return `:root {
  --ui-brand: ${chan(base)};
  --ui-brand-hover: ${chan(mix(base, [0, 0, 0], 0.15))};
  --ui-on-brand: ${onColor(base)};
  --ui-radius-control: ${r(0.75)};
  --ui-radius-card: ${r(1.25)};
  --ui-radius-panel: ${r(1.5)};
}
html.dark {
  --ui-brand: ${chan(darkBrand)};
  --ui-brand-hover: ${chan(mix(darkBrand, [255, 255, 255], 0.25))};
  --ui-on-brand: ${onColor(darkBrand)};
}`
}
