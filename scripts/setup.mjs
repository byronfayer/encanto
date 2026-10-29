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
  ['instagram', '@encanto.indumentaria'],
  ['instagram_url', 'https://instagram.com/encanto.indumentaria'],
  ['location', 'Córdoba Capital, Argentina'],
  ['hours', 'Lunes a sábados, 10 a 20 hs'],
]
for (const [key, value] of defaults) {
  await q('INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING', [key, value])
}
console.log('✓ Settings')

/* ---------- Categorías ---------- */
const cats = [
  ['Remeras', 'remeras', 1],
  ['Tops', 'tops', 2],
  ['Pantalones', 'pantalones', 3],
  ['Vestidos', 'vestidos', 4],
  ['Conjuntos', 'conjuntos', 5],
  ['Accesorios', 'accesorios', 6],
]
for (const [name, slug, order] of cats) {
  await q('INSERT INTO categories (name, slug, sort_order) VALUES ($1, $2, $3) ON CONFLICT (slug) DO NOTHING', [name, slug, order])
}
console.log('✓ Categorías')

/* ---------- Productos de ejemplo ---------- */
const { rows: [anyProd] } = await q('SELECT 1 FROM products LIMIT 1')
if (!anyProd) {
  async function catId(slug) {
    const { rows: [r] } = await q('SELECT id FROM categories WHERE slug = $1', [slug])
    return r?.id || null
  }
  const prods = [
    ['Vestido Julieta', 'vestidos', 42000, 'Vestido elegante con caída suave, ideal para eventos.', 'S,M,L', 'Bordó,Negro', 'disponible', true],
    ['Conjunto Bruma', 'conjuntos', 38500, 'Conjunto de dos piezas, versátil y femenino.', 'S,M', 'Rosa palo,Crudo', 'disponible', true],
    ['Remera Oversize Luna', 'remeras', 15900, 'Remera oversize de algodón premium.', 'S,M,L,XL', 'Blanco,Negro,Bordó', 'disponible', true],
    ['Jean Recto Alta Cintura', 'pantalones', 33900, 'Jean de corte recto con cintura alta.', '36,38,40,42', 'Azul claro,Azul oscuro', 'agotado', false],
    ['Top Cruzado Ámbar', 'tops', 17200, 'Top cruzado con detalle en la espalda.', 'S,M,L', 'Rosa,Blanco', 'disponible', true],
    ['Pantalón Palazzo Seda', 'pantalones', 29800, 'Palazzo de seda con caída fluida.', 'S,M,L', 'Bordó,Beige', 'disponible', false],
    ['Tapado Paño Aurora', 'conjuntos', 58900, 'Tapado de paño abrigado y elegante.', 'S,M,L', 'Camel,Negro', 'disponible', true],
    ['Vestido Amapola', 'vestidos', 45500, 'Vestido rojo con vuelo y escote en V.', 'S,M,L', 'Rojo', 'agotado', false],
    ['Cinturón Charol Fino', 'accesorios', 9800, 'Cinturón de charol con hebilla dorada.', 'Único', 'Bordó,Negro', 'disponible', false],
    ['Conjunto Blazer + Short', 'conjuntos', 47200, 'Conjunto ejecutivo de blazer y short.', 'S,M,L', 'Rosa viejo', 'disponible', true],
    ['Remera Básica Encanto', 'remeras', 13500, 'Remera básica de algodón con logo bordado.', 'S,M,L,XL', 'Blanco,Rosa claro', 'disponible', false],
    ['Jean Mom Fit', 'pantalones', 35900, 'Jean mom fit de tiro alto, cómodo y moderno.', '36,38,40', 'Azul medio', 'disponible', false],
  ]
  let seed = 1
  for (const [name, catSlug, price, desc, sizes, colors, status, featured] of prods) {
    const cid = await catId(catSlug)
    const slug = name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-')
    const img = `https://picsum.photos/seed/encanto${seed++}/600/750`
    await q(
      'INSERT INTO products (name, slug, description, price, category_id, image_url, sizes, colors, status, active, featured) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,true,$10)',
      [name, slug, desc, price, cid, img, sizes, colors, status, featured]
    )
  }
  console.log('✓ Productos de ejemplo')
} else {
  console.log('· Productos ya existen, no se tocaron')
}

console.log('\n✅ Base lista. Ya podés deployar.')
await pool.end()
process.exit(0)
