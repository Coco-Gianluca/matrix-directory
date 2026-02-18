import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/rooms', async (req, res) => {
  const url = `https://matrix-client.matrix.org/_matrix/client/v3/publicRooms?limit=100`

  try {
    const response = await fetch(url)
    const data = await response.json()
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Laden der Räume' })
  }
})

app.listen(3001, () => {
  console.log('Backend läuft auf http://localhost:3001')
})
