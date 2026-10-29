import { query } from '../_lib/db.js'
import { requireAdmin } from '../_lib/auth.js'

const COLS = `p.id, p.name, p.slug, p.description, p.price, p.category_id,
  c.name AS category_name, c.slug AS category_slug,
  p.image_url, p.sizes, p.colors, p.status, p.active, p.featured, p.created_at`

export default async function handler(req, res) {
  const { param } = req.query

  if (req.method === 'GET') {
    const { rows: [product] } = await query(
      `SELECT ${COLS} FROM products p LEFT JOIN categories c ON c.id = p.category_id
       WHERE p.slug = $1 AND p.active = true`, [param]
    )
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' })
    return res.json(product)
  }

  const admin = requireAdmin(req, res)
  if (!admin) return
  const id = Number(param)
  if (!id) return res.status(400).json({ error: 'ID inválido' })

  if (req.method === 'PUT') {
    const { rows: [cur] } = await query('SELECT * FROM products WHERE id = $1', [id])
    if (!cur) return res.status(404).json({ error: 'No existe' })
    const b = req.body || {}
    const name = b.name != null ? String(b.name).trim() : cur.name
    const desc = b.description != null ? (String(b.description).trim() || null) : cur.description
    const price = b.price != null && b.price !== '' ? Number(b.price) : cur.price
    const cat_id = b.category_id !== undefined ? (b.category_id ? Number(b.category_id) : null) : cur.category_id
    const img = b.image_url != null ? (String(b.image_url).trim() || null) : cur.image_url
    const sizes = b.sizes != null ? String(b.sizes).trim() : cur.sizes
    const colors = b.colors != null ? String(b.colors).trim() : cur.colors
    const status = b.status != null ? String(b.status) : cur.status
    const active = b.active != null ? Boolean(b.active) : cur.active
    const feat = b.featured != null ? Boolean(b.featured) : cur.featured

    await query(
      `UPDATE products SET name=$1, description=$2, price=$3, category_id=$4,
       image_url=$5, sizes=$6, colors=$7, status=$8, active=$9, featured=$10, updated_at=NOW()
       WHERE id=$11`,
      [name, desc, price, cat_id, img, sizes, colors, status, active, feat, id]
    )

    const { rows: [full] } = await query(
      `SELECT ${COLS} FROM products p LEFT JOIN categories c ON c.id = p.category_id WHERE p.id = $1`, [id]
    )
    return res.json(full)
  }

  if (req.method === 'DELETE') {
    await query('DELETE FROM products WHERE id = $1', [id])
    return res.json({ ok: true })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
