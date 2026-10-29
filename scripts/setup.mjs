/*
 * ENCANTO — Setup de la base de datos (Vercel Postgres)
 *
 * Usa schema "encanto" dentro de neondb para separar de otros proyectos.
 *
 * Uso:
 *   node --env-file=.env.local scripts/setup.mjs
 */

import { createPool } from '@vercel/postgres'
import bcrypt from 'bcryptjs'

const pool = createPool()
const q = (text, params) => pool.query(text, params)

console.log('Creando schema y tablas...')

await q('CREATE SCHEMA IF NOT EXISTS encanto')
await q('SET search_path TO encanto, public')

await q(`CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)`)

await q(`CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)`)

await q(`CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  category_id INTEGER REFERENCES encanto.categories(id) ON DELETE SET NULL,
  image_url TEXT,
  sizes TEXT,
  colors TEXT,
  status TEXT NOT NULL DEFAULT 'disponible',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)`)

await q(`CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
)`)

await q(`CREATE OR REPLACE FUNCTION encanto.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$`)

await q('DROP TRIGGER IF EXISTS products_touch ON encanto.products')
await q(`CREATE TRIGGER products_touch BEFORE UPDATE ON encanto.products
FOR EACH ROW EXECUTE FUNCTION encanto.touch_updated_at()`)

console.log('✓ Tablas creadas en schema encanto')

/* ---------- Admin ---------- */
const email = (process.env.ADMIN_EMAIL || 'admin@encanto.com').toLowerCase()
const password = process.env.ADMIN_PASSWORD || 'encanto1234'
const hash = bcrypt.hashSync(password, 10)

const { rows: [existingAdmin] } = await q('SELECT 1 FROM admins WHERE email = $1', [email])
if (!existingAdmin) {
  await q('INSERT INTO admins (email, password_hash) VALUES ($1, $2)', [email, hash])
  console.log(`✓ Admin creado: ${email}`)
} else {
  console.log(`· Admin ya existe: ${email}`)
}

/* ---------- Settings por defecto ---------- */
const defaults = [
  ['brand_name', 'Encanto'],
  ['tagline', 'Indumentaria'],
  ['whatsapp', '5493511234567'],
  ['instagram', '@eencantoc_'],
  ['instagram_url', 'https://www.instagram.com/eencantoc_/'],
  ['location', 'Córdoba Capital, Argentina'],
  ['hours', 'Lunes a sábados, 10 a 20 hs'],
]
for (const [key, value] of defaults) {
  await q('INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING', [key, value])
}
console.log('✓ Settings')

/* ---------- Categorías ---------- */
const cats = [
  ['Conjuntos', 'conjuntos', 1],
  ['Vestidos', 'vestidos', 2],
  ['Casuits', 'casuits', 3],
  ['Tops', 'tops', 4],
  ['Enteritos', 'enteritos', 5],
  ['Accesorios', 'accesorios', 6],
]
for (const [name, slug, order] of cats) {
  await q('INSERT INTO categories (name, slug, sort_order) VALUES ($1, $2, $3) ON CONFLICT (slug) DO NOTHING', [name, slug, order])
}
console.log('✓ Categorías')

/* ---------- Productos ---------- */
const { rows: [anyProd] } = await q('SELECT 1 FROM products LIMIT 1')
if (!anyProd) {
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
  console.log('✓ Productos creados')
} else {
  console.log('· Productos ya existen, no se tocaron')
}

console.log('\n✅ Base lista. Ya podés deployar.')
await pool.end()
process.exit(0)
