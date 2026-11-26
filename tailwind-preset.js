/** @type {import('tailwindcss').Config} */
// Vue UI Kit — Tailwind preset. Apps use it with:
//   presets: [uiKitPreset],
//   content: ['./index.html', './src/**/*.{vue,js}', ...uiKitContent],

// Semantic tokens live as RGB channels in CSS variables (src/styles/index.css),
// so one class (e.g. `bg-surface-1`) works in both themes and still supports
// Tailwind opacity modifiers (`bg-brand/10`).
const v = (name) => `rgb(var(--ui-${name}) / <alpha-value>)`

export default {
  // Dark mode via class — toggle by adding/removing 'dark' on <html>
  darkMode: 'class',


  theme: {
    extend: {
      colors: {
        // ── Semantic (theme-aware) ────────────────────────────────────
        // Prefer these in new code. Each pairs light + dark via CSS vars.
        // NOTE: not `base` — that would collide with the text-base font size
        page: v('page'),                 // page background
        line: v('border'),               // default borders / dividers
        fg: {
          DEFAULT: v('text'),            // primary text
          2:       v('text-2'),          // secondary text
          muted:   v('muted'),           // meta, captions
        },

        // ── Brand accent ──────────────────────────────────────────────
        // `brand` / `brand-on` = action color (theme-aware).
        // Numeric scale kept for existing views.
        brand: {
          DEFAULT: v('brand'),
          hover:   v('brand-hover'),
          on:      v('on-brand'),
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',  // ← action colour in light mode
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },

        // ── Surface / background (theme-aware) ────────────────────────
        surface: {
          1: v('surface-1'),   // cards, panels
          2: v('surface-2'),   // controls, rows inside cards
          3: v('surface-3'),   // hover, active segment, overlays
        },

        // ── Semantic status colors ─────────────────────────────────────
        // Keep these strict — each color means ONE thing
        success: {
          light: '#D1FAE5',
          DEFAULT: '#10B981',
          dark: '#065F46',
        },
        warning: {
          light: '#FEF3C7',
          DEFAULT: '#F59E0B',
          dark: '#92400E',
        },
        danger: {
          light: '#FEE2E2',
          DEFAULT: '#EF4444',
          dark: '#991B1B',
        },

        // ── Gamification (gold) — use ONLY for points / levels / rewards ──
        // `reward` = gold text/accent, `reward-fill` = gold button/bar fill.
        reward: {
          DEFAULT: v('reward'),
          fill:    v('reward-fill'),
          on:      v('on-reward'),
          light: '#FEF9C3',
          dark: '#854D0E',
        },

        // ── Podium — rank 1/2/3 only ───────────────────────────────────
        podium: {
          gold:   '#FBBF24',   // amber-400
          silver: '#C3D3DC',
          bronze: '#D98E5B',
        },

        // ── Activity category colors (theme-aware) ───────────────────────
        // Sales = blue · Pre-Sales = purple · Marketing = pink
        sales:     v('sales'),
        presales:  v('presales'),
        marketing: v('marketing'),

        // ── Company kinds (chips, pickers, form labels) ───────────────────
        // Vendor = purple/pink · Reseller = blue · End user = yellow
        vendor:   v('vendor'),
        reseller: v('reseller'),
        enduser:  v('enduser'),
      },

      // ── Typography ────────────────────────────────────────────────────
      // Inter everywhere — display, sans and mono alike.
      // `display` is kept as an alias so headings can diverge later if needed.
      // `mono` is Inter too; styles.css adds tabular figures to .font-mono so countdowns don't jiggle.
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans:    ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono:    ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        '2xs':   ['0.625rem', { lineHeight: '0.875rem' }],                          // 10px — avoid for text
        label:   ['0.75rem',  { lineHeight: '1rem', letterSpacing: '0.1em', fontWeight: '500' }],  // 12px overline — Inter Medium +100
        'num-lg': ['2.5rem',  { lineHeight: '1', letterSpacing: '-0.02em' }],       // 40px KPI numbers
        'num-xl': ['3rem',    { lineHeight: '1', letterSpacing: '-0.02em' }],       // 48px hero numbers
      },

      // ── Spacing extras ────────────────────────────────────────────────
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },

      // ── Border radius ─────────────────────────────────────────────────
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
        control: '0.75rem',  // 12px — buttons, inputs, segments
        card: '1.25rem',     // 20px — cards
        panel: '1.5rem',     // 24px — large sections
      },

      // ── Backdrop blur ─────────────────────────────────────────────────
      backdropBlur: {
        xs: '2px',
      },

      // ── Box shadow ────────────────────────────────────────────────────
      boxShadow: {
        'card-dark': '0 1px 3px 0 rgba(0,0,0,0.4), 0 1px 2px -1px rgba(0,0,0,0.4)',
        'card-light': '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.06)',
        'glow-brand': '0 8px 24px -8px rgb(var(--ui-brand) / 0.6)',
        'glow-reward': '0 24px 60px -30px rgb(var(--ui-reward-fill) / 0.55)',
      },

      // ── Transition ────────────────────────────────────────────────────
      transitionDuration: {
        '250': '250ms',
      },

      // ── Animation ────────────────────────────────────────────────────
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
    },
  },

  plugins: [],
}

/** Globs for the kit's components — add to the app's `content` so their classes are generated */
export const uiKitContent = ['./node_modules/@nebojsab/vue-ui-kit/src/**/*.{vue,js}']
