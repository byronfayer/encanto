import { query } from '../_lib/db.js'
import { requireAdmin } from '../_lib/auth.js'
import { uniqueSlug } from '../_lib/helpers.js'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { rows } = await query('SELECT * FROM categories ORDER BY sort_order, name')
    return res.json(rows)
  }
  if (req.method === 'POST') {
    const admin = requireAdmin(req, res)
    if (!admin) return
    const name = String(req.body?.name || '').trim()
    if (!name) return res.status(400).json({ error: 'Falta el nombre' })
    const slug = await uniqueSlug(name, 'categories')
    const image_url = req.body?.image_url ? String(req.body.image_url).trim() : null
    const { rows: [{ next_order }] } = await query('SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM categories')
    const { rows: [cat] } = await query(
      'INSERT INTO categories (name, slug, sort_order, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, slug, next_order, image_url]
    )
    return res.status(201).json(cat)
  }
  res.status(405).json({ error: 'Method not allowed' })
}
