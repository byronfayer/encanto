import { query } from './db.js'

export function slugify(s) {
  return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'item'
}

export async function uniqueSlug(base, table) {
  const slug = slugify(base)
  const { rows } = await query(
    `SELECT slug FROM ${table} WHERE slug = $1 OR slug LIKE $2`,
    [slug, slug + '-%']
  )
  const existing = new Set(rows.map(r => r.slug))
  if (!existing.has(slug)) return slug
  let n = 2
  while (existing.has(`${slug}-${n}`)) n++
  return `${slug}-${n}`
}
