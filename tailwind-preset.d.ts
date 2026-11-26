import type { Config } from 'tailwindcss'

/** Vue UI Kit Tailwind preset (Tailwind CSS v3, or v4 through @config) */
declare const preset: Partial<Config>
export default preset

/** Globs for the kit's components — add to `content` so their classes are generated */
export declare const uiKitContent: string[]
