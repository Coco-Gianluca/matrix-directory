import express from 'express'
import pool from '../db.js'

const router = express.Router()

// Alle Räume laden (DB + Matrix API)
router.get('/', async (req, res) => {
  const search = req.query.search || ''

  try {
    let dbResult
    if (search) {
      dbResult = await pool.query(
        `SELECT *, 'custom' as source FROM rooms WHERE name ILIKE $1 OR description ILIKE $1 OR category ILIKE $1 ORDER BY created_at DESC`,
        [`%${search}%`]
      )
    } else {
      dbResult = await pool.query(`SELECT *, 'custom' as source FROM rooms ORDER BY created_at DESC`)
    }
    const dbRooms = dbResult.rows

    const matrixRes = await fetch('https://matrix-client.matrix.org/_matrix/client/v3/publicRooms?limit=100')
    const matrixData = await matrixRes.json()
    let matrixRooms = (matrixData.chunk || []).map((room) => ({
      id: room.room_id,
      name: room.name || 'Unbenannter Raum',
      description: room.topic || '',
      room_id: room.room_id,
      category: 'Matrix',
      members: room.num_joined_members,
      avatar_url: room.avatar_url || null,
      source: 'matrix',
    }))

    if (search) {
      const term = search.toLowerCase()
      matrixRooms = matrixRooms.filter(
        (r) =>
          r.name.toLowerCase().includes(term) ||
          r.description.toLowerCase().includes(term)
      )
    }

    res.json([...dbRooms, ...matrixRooms])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Fehler beim Laden' })
  }
})

// Neuen Raum eintragen
router.post('/', async (req, res) => {
  const { name, description, room_id, category } = req.body
  if (!name || !room_id) {
    return res.status(400).json({ error: 'Name und Room-ID sind pflicht' })
  }
  try {
    const result = await pool.query(
      'INSERT INTO rooms (name, description, room_id, category) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, room_id, category]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Speichern' })
  }
})

export default router
