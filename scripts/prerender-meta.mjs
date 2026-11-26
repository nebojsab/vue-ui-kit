#!/usr/bin/env node
// After `vite build`: writes docs-dist/<slug>/index.html for every docs page with its own
// <title>, description, canonical and social tags (so links preview well and pages are
// served with 200, not via 404.html), plus sitemap.xml, robots.txt and the SPA 404.html.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs'
import { navGroups } from '../docs/src/nav-data.js'

const OUT = 'docs-dist'
const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
const SITE = (process.env.SITE_URL ?? pkg.homepage).replace(/\/$/, '')
const html = readFileSync(`${OUT}/index.html`, 'utf8')

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const attr = (h, re, value) => h.replace(re, (_, a, b) => `${a}${esc(value)}${b}`)

function page({ title, description, url }) {
  let h = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
  h = attr(h, /(<meta name="description" content=")[^"]*(")/, description)
  h = attr(h, /(<link rel="canonical" href=")[^"]*(")/, url)
  h = attr(h, /(<meta property="og:title" content=")[^"]*(")/, title)
  h = attr(h, /(<meta property="og:description" content=")[^"]*(")/, description)
  h = attr(h, /(<meta property="og:url" content=")[^"]*(")/, url)
  h = attr(h, /(<meta name="twitter:title" content=")[^"]*(")/, title)
  h = attr(h, /(<meta name="twitter:description" content=")[^"]*(")/, description)
  return h
}

const urls = [`${SITE}/`]
for (const group of navGroups) {
  for (const item of group.items) {
    const url = `${SITE}/${item.slug}/`
    const kind = /Foundations|Get started/.test(group.label) ? 'Guide' : 'Vue 3 component'
    const description = `${item.label}: ${item.description}. ${kind} in Vue UI Kit, an open-source Vue 3 + Tailwind CSS library with light and dark themes.`
    mkdirSync(`${OUT}/${item.slug}`, { recursive: true })
    writeFileSync(`${OUT}/${item.slug}/index.html`, page({ title: `${item.label} — Vue UI Kit`, description, url }))
    urls.push(url)
  }
}

const today = new Date().toISOString().slice(0, 10)
writeFileSync(`${OUT}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`)
writeFileSync(`${OUT}/robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`)
copyFileSync(`${OUT}/index.html`, `${OUT}/404.html`)
console.log(`✓ ${urls.length - 1} pages, sitemap.xml, robots.txt, 404.html`)
