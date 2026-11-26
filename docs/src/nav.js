// Docs navigation — data in nav-data.js (plain ESM, also read by the build's meta script)
import * as kit from '@ds/index.js'
export { navGroups } from './nav-data.js'

/** Number of components the package exports (art, logos, composables and toast() not counted) */
export const componentCount = Object.keys(kit).filter((k) => /^(App|DataTable$|StatCard$)/.test(k)).length
