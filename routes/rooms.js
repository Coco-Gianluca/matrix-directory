import express from 'express'
import pool from '../db.js'

const router = express.Router()

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

// Middleware für Admin-Schutz
function adminAuth(req, res, next) {
  const password = req.headers['x-admin-password']
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Nicht autorisiert' })
  }
  next()
}

// Nur akzeptierte Räume laden (DB + Matrix API)
router.get('/', async (req, res) => {
  const search = req.query.search || ''

  try {
    let dbResult
    if (search) {
      dbResult = await pool.query(
        `SELECT *, 'custom' as source FROM rooms WHERE status = 'accepted' AND (name ILIKE $1 OR description ILIKE $1 OR category ILIKE $1) ORDER BY created_at DESC`,
        [`%${search}%`]
      )
    } else {
      dbResult = await pool.query(`SELECT *, 'custom' as source FROM rooms WHERE status = 'accepted' ORDER BY created_at DESC`)
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

// Neuen Raum eintragen (status = pending)
router.post('/', async (req, res) => {
  const { name, description, room_id, category } = req.body
  if (!name || !room_id) {
    return res.status(400).json({ error: 'Name und Room-ID sind pflicht' })
  }
  try {
    const result = await pool.query(
      'INSERT INTO rooms (name, description, room_id, category, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, room_id, category, 'pending']
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Speichern' })
  }
})

// Admin: Alle ausstehenden Anträge laden
router.get('/admin/pending', adminAuth, async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM rooms WHERE status = 'pending' ORDER BY created_at DESC`)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Laden' })
  }
})

// Admin: Antrag akzeptieren
router.patch('/admin/:id/accept', adminAuth, async (req, res) => {
  try {
    await pool.query(`UPDATE rooms SET status = 'accepted' WHERE id = $1`, [req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Akzeptieren' })
  }
})

// Admin: Antrag ablehnen
router.patch('/admin/:id/reject', adminAuth, async (req, res) => {
  try {
    await pool.query(`UPDATE rooms SET status = 'rejected' WHERE id = $1`, [req.params.id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Ablehnen' })
  }
})

export default router
