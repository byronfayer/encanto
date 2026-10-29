import { query } from '../_lib/db.js'
import { requireAdmin } from '../_lib/auth.js'

export default async function handler(req, res) {
  const id = Number(req.query.id)
  if (!id) return res.status(400).json({ error: 'ID inválido' })
  const admin = requireAdmin(req, res)
  if (!admin) return

  if (req.method === 'PUT') {
    const { rows: [cur] } = await query('SELECT * FROM categories WHERE id = $1', [id])
    if (!cur) return res.status(404).json({ error: 'No existe' })
    const name = req.body?.name != null ? String(req.body.name).trim() : cur.name
    const sort_order = req.body?.sort_order != null ? Number(req.body.sort_order) : cur.sort_order
    const image_url = req.body?.image_url !== undefined ? (req.body.image_url ? String(req.body.image_url).trim() : null) : cur.image_url
    const { rows: [cat] } = await query(
      'UPDATE categories SET name = $1, sort_order = $2, image_url = $3 WHERE id = $4 RETURNING *',
      [name, sort_order, image_url, id]
    )
    return res.json(cat)
  }
  if (req.method === 'DELETE') {
    await query('DELETE FROM categories WHERE id = $1', [id])
    return res.json({ ok: true })
  }
  res.status(405).json({ error: 'Method not allowed' })
}
