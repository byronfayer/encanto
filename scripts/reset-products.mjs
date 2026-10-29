/*
 * Reset: borra productos y categorías viejas, inserta las nuevas.
 * También actualiza el Instagram en settings.
 *
 * Uso:  node --env-file=.env.local scripts/reset-products.mjs
 */

import { createPool } from '@vercel/postgres'

const pool = createPool()
const q = (text, params) => pool.query(text, params)

await q('SET search_path TO encanto, public')

/* ---------- Actualizar settings de Instagram ---------- */
await q("UPDATE settings SET value = $1 WHERE key = 'instagram'", ['@eencantoc_'])
await q("UPDATE settings SET value = $1 WHERE key = 'instagram_url'", ['https://www.instagram.com/eencantoc_/'])
console.log('✓ Instagram actualizado en settings')

/* ---------- Borrar productos viejos ---------- */
await q('DELETE FROM products')
console.log('✓ Productos anteriores eliminados')

/* ---------- Borrar categorías viejas e insertar nuevas ---------- */
await q('DELETE FROM categories')
const cats = [
  ['Conjuntos', 'conjuntos', 1],
  ['Vestidos', 'vestidos', 2],
  ['Casuits', 'casuits', 3],
  ['Tops', 'tops', 4],
  ['Enteritos', 'enteritos', 5],
  ['Accesorios', 'accesorios', 6],
]
for (const [name, slug, order] of cats) {
  await q('INSERT INTO categories (name, slug, sort_order) VALUES ($1, $2, $3)', [name, slug, order])
}
console.log('✓ Categorías actualizadas')

/* ---------- Insertar productos reales ---------- */
async function catId(slug) {
  const { rows: [r] } = await q('SELECT id FROM categories WHERE slug = $1', [slug])
  return r?.id || null
}

const prods = [
  ['Conjunto Rojo Satinado', 'conjuntos', 18000, 'Conjunto de top y short en satén rojo con detalle de argolla.', 'S,M,L', 'Rojo', 'disponible', true],
  ['Vestido Escote V Bordó', 'vestidos', 20000, 'Vestido con escote en V y falda con vuelo, tela satinada.', 'S,M,L', 'Bordó', 'disponible', true],
  ['Casuit de Encaje Blanco', 'casuits', 17000, 'Casuit con cuerpo de encaje y escote halter, elegante y femenino.', 'S,M,L', 'Blanco', 'disponible', true],
  ['Casuit Rojo Intenso', 'casuits', 15000, 'Casuit entero en rojo satinado, ideal para la noche.', 'S,M,L', 'Rojo', 'disponible', true],
  ['Conjunto Satinado Bordó', 'conjuntos', 15000, 'Conjunto de dos piezas en tela satinada con caída suave.', 'S,M,L', 'Bordó,Rojo', 'disponible', false],
  ['Casuit Una Manga', 'casuits', 15000, 'Casuit asimétrico de una sola manga, moderno y audaz.', 'S,M', 'Negro,Rojo', 'disponible', true],
  ['Casuit Brillos Escote V', 'casuits', 17000, 'Casuit con brillos y escote en V profundo.', 'S,M,L', 'Blanco,Negro,Bordó', 'agotado', false],
  ['Conjunto Playero', 'conjuntos', 13000, 'Conjunto fresco y cómodo para el día, ideal para verano.', 'S,M,L', 'Varios', 'disponible', false],
  ['Vestido Negro Clásico', 'vestidos', 16000, 'Vestido negro elegante, perfecto para cualquier ocasión.', 'S,M,L', 'Negro', 'disponible', true],
  ['Conjunto Playero Bicolor', 'conjuntos', 14000, 'Conjunto playero en combinación de dos tonos.', 'S,M,L', 'Negro,Blanco,Marrón', 'agotado', false],
  ['Conjunto Animal Print', 'conjuntos', 18000, 'Conjunto con estampado animal print, fresco y llamativo.', 'S,M,L', 'Animal print', 'disponible', true],
  ['Vestido Tricolor', 'vestidos', 15000, 'Vestido disponible en tres colores, tela suave con caída.', 'S,M,L', 'Marrón,Beige,Negro', 'disponible', false],
]

let seed = 1
for (const [name, catSlug, price, desc, sizes, colors, status, featured] of prods) {
  const cid = await catId(catSlug)
  const slug = name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')
  const img = `https://picsum.photos/seed/enc${seed++}/600/750`
  await q(
    'INSERT INTO products (name, slug, description, price, category_id, image_url, sizes, colors, status, active, featured) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,true,$10)',
    [name, slug, desc, price, cid, img, sizes, colors, status, featured]
  )
}
console.log('✓ 12 productos nuevos insertados')

console.log('\n✅ Reset completado.')
await pool.end()
process.exit(0)
