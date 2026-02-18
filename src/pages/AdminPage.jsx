import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminPage() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const fetchPending = async (pw) => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:3001/rooms/admin/pending', {
        headers: { 'x-admin-password': pw }
      })
      if (res.status === 401) {
        setError('Falsches Passwort')
        setAuthenticated(false)
        setLoading(false)
        return
      }
      const data = await res.json()
      setPending(data)
      setAuthenticated(true)
      setError('')
    } catch (err) {
      setError('Verbindungsfehler')
    }
    setLoading(false)
  }

  const handleLogin = () => fetchPending(password)

  const handleAccept = async (id) => {
    await fetch(`http://localhost:3001/rooms/admin/${id}/accept`, {
      method: 'PATCH',
      headers: { 'x-admin-password': password }
    })
    fetchPending(password)
  }

  const handleReject = async (id) => {
    await fetch(`http://localhost:3001/rooms/admin/${id}/reject`, {
      method: 'PATCH',
      headers: { 'x-admin-password': password }
    })
    fetchPending(password)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-purple-400">Admin-Bereich</h1>
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white text-sm transition"
          >
            ← Zurück zur Webseite
          </button>
        </div>

        {!authenticated ? (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 flex flex-col gap-4">
            <p className="text-gray-400">Bitte Admin-Passwort eingeben:</p>
            <input
              type="password"
              placeholder="Admin-Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              onClick={handleLogin}
              className="bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-medium transition"
            >
              Anmelden
            </button>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-300">
              Ausstehende Anträge ({pending.length})
            </h3>
            {loading ? (
              <p className="text-gray-500 text-center py-8">Laden...</p>
            ) : pending.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Keine ausstehenden Anträge 🎉</p>
            ) : (
              <div className="flex flex-col gap-4">
                {pending.map((room) => (
                  <div key={room.id} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-lg">{room.name}</h4>
                        <p className="text-gray-400 text-sm mt-1">{room.description || 'Keine Beschreibung'}</p>
                        <p className="text-purple-400 text-xs mt-2">Room-ID: {room.room_id}</p>
                        <p className="text-gray-500 text-xs">Kategorie: {room.category || 'Keine'}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleAccept(room.id)}
                          className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg text-sm font-medium transition"
                        >
                          ✓ Akzeptieren
                        </button>
                        <button
                          onClick={() => handleReject(room.id)}
                          className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-sm font-medium transition"
                        >
                          ✕ Ablehnen
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage
