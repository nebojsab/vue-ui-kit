// Foundations (shape, motion & layers) and the two atoms that had no page (OTP input, tooltip)
import { ref, defineComponent, h } from 'vue'
import { InformationCircleIcon, ClipboardDocumentIcon } from '@heroicons/vue/24/outline'
import AppOtpInput from '@ds/components/AppOtpInput.vue'
import AppTooltip from '@ds/components/AppTooltip.vue'
import AppButton from '@ds/components/AppButton.vue'

const tile = (cls, name, use) => h('div', { class: 'rounded-xl border border-line bg-surface-1 overflow-hidden' }, [
  h('div', { class: 'h-20 flex items-center justify-center bg-surface-2' }, h('div', { class: `w-16 h-12 bg-brand/80 ${cls}` })),
  h('div', { class: 'p-3' }, [h('p', { class: 'text-xs font-bold font-mono' }, name), h('p', { class: 'text-xs text-fg-muted mt-0.5' }, use)]),
])

export const foundationsDocs = {
  // ── Shape: radius & elevation ────────────────────────────────────────────
  shape: {
    title: 'Radius & Elevation',
    description: 'There are three named radii. Controls use rounded-control (12px), cards rounded-card (20px) and large sections rounded-panel (24px). Elevation stays quiet: a hairline border does most of the work, and a shadow appears only on surfaces that float above the page (menus, popovers, modals) or that you can pick up and move.',
    whenToUse: [
      'rounded-control for buttons, inputs, segments and chips that are not pills',
      'rounded-card (or .card) for cards and panels; rounded-panel for hero sections',
      'A shadow only on floating layers; borders everywhere else',
    ],
    whenNotTo: [
      "Don't mix radii inside one component — a 20px card holds 12px controls",
      "Don't use shadows to separate cards on the page — use border-line",
      "Don't use shadow-glow-brand on more than one call to action per screen",
    ],
    stories: [
      {
        name: 'Radius scale',
        snippet: `rounded-control  /* 12px — buttons, inputs, segments */
rounded-card     /* 20px — cards (.card) */
rounded-panel    /* 24px — hero sections, large panels */
rounded-full     /* pills, avatars, badges */`,
        demo: defineComponent({ setup() {
          return () => h('div', { class: 'grid grid-cols-2 sm:grid-cols-4 gap-3' }, [
            tile('rounded-control', 'rounded-control', '12px · controls'),
            tile('rounded-card', 'rounded-card', '20px · cards'),
            tile('rounded-panel', 'rounded-panel', '24px · panels'),
            tile('rounded-full', 'rounded-full', 'pills, avatars'),
          ])
        } }),
      },
      {
        name: 'Elevation',
        description: 'From flat to floating. Switch the theme: in dark mode borders carry more of the weight.',
        snippet: `border border-line                                   /* 0 — cards on the page */
shadow-card-light dark:shadow-card-dark              /* 1 — raised a little */
shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]           /* 2 — menus, popovers */
shadow-glow-brand                                    /* accent — one key CTA */`,
        demo: defineComponent({ setup() {
          const box = (cls, name, use) => h('div', { class: `rounded-card bg-surface-1 p-4 ${cls}` }, [
            h('p', { class: 'text-xs font-bold font-mono' }, name), h('p', { class: 'text-xs text-fg-muted mt-1' }, use),
          ])
          return () => h('div', { class: 'grid grid-cols-1 sm:grid-cols-4 gap-5 p-2' }, [
            box('border border-line', 'border-line', 'Cards on the page'),
            box('border border-line shadow-card-light dark:shadow-card-dark', 'shadow-card', 'Raised a little'),
            box('border border-line shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]', 'floating', 'Menus, popovers, modals'),
            box('border border-brand/40 shadow-glow-brand', 'glow-brand', 'One key call to action'),
          ])
        } }),
      },
    ],
  },

  // ── Motion & layers ──────────────────────────────────────────────────────
  motion: {
    title: 'Motion & Layers',
    description: 'Motion is short and has a purpose: it shows where something came from or that something changed. Hovers take 150ms, panels and accordions 200ms, and theme changes 250ms. Larger movement is turned off under prefers-reduced-motion. Layers follow one z-index scale, so a toast always sits above a drawer, which sits above a modal.',
    whenToUse: [
      'duration-150 for hover and focus; duration-200 for opening panels; animate-fade-in for content that arrives',
      'animate-pulse-soft for "live" indicators only',
      'The z-index scale below for anything fixed or floating',
    ],
    whenNotTo: [
      "Don't animate for longer than 300ms in the UI — it feels slow by the third time",
      "Don't move things people are reading; fade instead",
      "Don't invent a z-index — pick the layer it belongs to",
    ],
    stories: [
      {
        name: 'Durations',
        description: 'Hover each bar to feel the difference.',
        snippet: `transition-colors duration-150   /* hover, focus */
transition-all duration-200      /* panels, accordion, sidebar */
duration-250                     /* theme switch (body) */
animate-fade-in                  /* 200ms fade + 4px rise */
animate-pulse-soft               /* live indicator, 2s loop */`,
        demo: defineComponent({ setup() {
          const bar = (d, name) => h('div', { class: 'group flex items-center gap-4' }, [
            h('span', { class: 'w-28 text-xs font-mono text-fg-muted' }, name),
            h('div', { class: 'flex-1 h-9 rounded-control bg-surface-2 overflow-hidden' },
              h('div', { class: `h-full w-12 rounded-control bg-brand transition-all ease-out ${d} group-hover:w-full` })),
          ])
          return () => h('div', { class: 'space-y-3 max-w-xl' }, [
            bar('duration-150', '150ms · hover'), bar('duration-200', '200ms · panels'), bar('duration-500', '500ms · too slow'),
            h('div', { class: 'flex items-center gap-3 pt-2' }, [
              h('span', { class: 'w-2.5 h-2.5 rounded-full bg-success animate-pulse-soft' }),
              h('span', { class: 'text-sm text-fg-2' }, 'animate-pulse-soft — live'),
            ]),
          ])
        } }),
      },
      {
        name: 'Layer scale',
        description: 'Higher layers cover lower ones.',
        snippet: `z-10    /* sticky headers inside a page */
z-30    /* sidebar, back to top */
z-40    /* bottom nav */
z-50    /* modal, tooltip, user menu */
z-[60]  /* drawer, bottom sheet */
z-[70]  /* toasts */
z-[90]  /* popover, dropdown menu, combobox list (teleported) */`,
        demo: defineComponent({ setup() {
          const layers = [
            ['z-[90]', 'Popover · Dropdown · Combobox'], ['z-[70]', 'Toasts'], ['z-[60]', 'Drawer · Bottom sheet'],
            ['z-50', 'Modal · Tooltip · User menu'], ['z-40', 'Bottom nav'], ['z-30', 'Sidebar · Back to top'], ['z-10', 'Sticky headers'],
          ]
          return () => h('div', { class: 'space-y-1.5 max-w-lg' }, layers.map(([z, use], i) =>
            h('div', { class: 'flex items-center gap-3 rounded-lg border border-line bg-surface-1 px-3 h-10', style: { marginLeft: `${i * 12}px` } }, [
              h('span', { class: 'w-16 text-xs font-mono font-bold text-brand' }, z),
              h('span', { class: 'text-sm text-fg-2' }, use),
            ])))
        } }),
      },
    ],
  },

  // ── OTP input ────────────────────────────────────────────────────────────
  'otp-input': {
    title: 'OTP Input',
    description: 'A one-time code input with one box per digit. It moves to the next box as you type and goes back on Backspace. Pasting fills every box, and the arrow keys move between boxes. The first box has autocomplete="one-time-code", so phones can offer the code from an SMS.',
    whenToUse: ['Two-factor and email verification codes', 'Short numeric codes (4–8 digits)'],
    whenNotTo: ["Don't use it for passwords or long codes people paste from a password manager", "Don't auto-submit without showing what was entered"],
    props: [
      { name: 'v-model', type: 'String', default: "''", description: 'The digits entered so far' },
      { name: 'length', type: 'Number', default: '6', description: 'Number of boxes' },
      { name: 'label', type: 'String', default: "'Verification code'", description: 'Group name for screen readers' },
      { name: 'error', type: 'Boolean', default: 'false', description: 'Red borders, aria-invalid' },
      { name: 'disabled', type: 'Boolean', default: 'false', description: '—' },
      { name: 'autofill', type: 'String', default: "''", description: 'Prototypes only: clicking an empty box fills this code' },
      { name: '@complete', type: '(code) => void', default: '—', description: 'All boxes filled' },
    ],
    stories: [
      {
        name: 'Verification code',
        description: 'Type, paste, or use ← →. Entering 000000 shows the error state.',
        snippet: `<AppOtpInput v-model="code" :error="wrong" @complete="verify" />`,
        demo: defineComponent({ setup() {
          const code = ref('')
          const wrong = ref(false)
          return () => h('div', { class: 'max-w-sm mx-auto text-center space-y-3' }, [
            h(AppOtpInput, {
              modelValue: code.value, error: wrong.value,
              'onUpdate:modelValue': (v) => { code.value = v; wrong.value = false },
              onComplete: (c) => { wrong.value = c === '000000' },
            }),
            h('p', { class: ['text-sm', wrong.value ? 'text-danger' : 'text-fg-muted'], 'aria-live': 'polite' },
              wrong.value ? 'That code is not right — try again.' : code.value.length === 6 ? 'Code complete ✓' : 'Enter the 6-digit code we sent you.'),
          ])
        } }),
      },
    ],
  },

  // ── Tooltip ──────────────────────────────────────────────────────────────
  tooltip: {
    title: 'Tooltip',
    description: 'A short label that appears on hover and on keyboard focus, built with CSS only. Use it to name an icon-only button or to add a brief hint. Because touch screens have no hover, the label must also be the element\'s aria-label.',
    whenToUse: ['Naming icon-only buttons (with the same text as aria-label)', 'A short hint of a few words'],
    whenNotTo: ["Don't put anything people need to act on inside a tooltip", "Don't use it for long help — use a Popover", "Don't rely on it on phones; there is no hover there"],
    props: [
      { name: 'text', type: 'String', default: '—', description: 'Tooltip text' },
      { name: 'position', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Side of the trigger' },
      { name: 'align', type: "'center' | 'start' | 'end'", default: "'center'", description: 'For top/bottom: which edges line up' },
    ],
    stories: [
      {
        name: 'Positions',
        description: 'Hover or Tab to the buttons.',
        snippet: `<AppTooltip text="Copy link">
  <button aria-label="Copy link"><ClipboardDocumentIcon /></button>
</AppTooltip>
<AppTooltip text="More info" position="right">…</AppTooltip>`,
        demo: defineComponent({ setup() {
          const iconBtn = (label, icon) => h('button', {
            type: 'button', 'aria-label': label,
            class: 'w-10 h-10 flex items-center justify-center rounded-control border border-line bg-surface-1 text-fg-2 hover:text-fg hover:bg-surface-2',
          }, h(icon, { class: 'w-5 h-5' }))
          return () => h('div', { class: 'flex flex-wrap items-center gap-10 py-8 px-4' }, [
            h(AppTooltip, { text: 'Copy link' }, () => iconBtn('Copy link', ClipboardDocumentIcon)),
            h(AppTooltip, { text: 'Shown below', position: 'bottom' }, () => iconBtn('Shown below', InformationCircleIcon)),
            h(AppTooltip, { text: 'More info', position: 'right' }, () => iconBtn('More info', InformationCircleIcon)),
            h(AppTooltip, { text: 'Saves a draft' }, () => h(AppButton, { variant: 'secondary', size: 'sm' }, () => 'Save')),
          ])
        } }),
      },
    ],
  },
}
