import { createPool } from '@vercel/postgres'

const SCHEMA = 'encanto'

let _pool
function getPool() {
  if (!_pool) _pool = createPool()
  return _pool
}

export { SCHEMA }

export async function query(text, params) {
  const pool = getPool()
  const client = await pool.connect()
  try {
    await client.query(`SET search_path TO ${SCHEMA}, public`)
    return await client.query(text, params)
  } finally {
    client.release()
  }
}
