// Docs site config — the DS preset plus the docs and component sources
import uiKitPreset from './tailwind-preset.js'

export default {
  presets: [uiKitPreset],
  content: ['./docs/index.html', './docs/src/**/*.{vue,js}', './src/**/*.{vue,js}'],
}
