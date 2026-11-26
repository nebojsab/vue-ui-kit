#!/usr/bin/env node
// Screenshot a page with headless Chrome — used for the social preview and README images.
//   node scripts/shoot.mjs <url-or-file> <out.png> [width] [height] [scale]
// CHROME=/path/to/chrome overrides the default macOS location.
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const [src, out, w = '1280', h = '640', scale = '1'] = process.argv.slice(2)
if (!src || !out) { console.error('usage: shoot.mjs <url-or-file> <out.png> [width] [height] [scale]'); process.exit(1) }
const chrome = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const url = /^https?:/.test(src) ? src : pathToFileURL(resolve(src)).href

execFileSync(chrome, [
  '--headless=new', '--hide-scrollbars', '--disable-gpu', '--allow-file-access-from-files',
  `--window-size=${w},${h}`, `--force-device-scale-factor=${scale}`,
  '--virtual-time-budget=4000', `--screenshot=${resolve(out)}`, url,
], { stdio: 'inherit' })
console.log(`✓ ${out}`)
