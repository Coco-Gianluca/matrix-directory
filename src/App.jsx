import { useState, useEffect } from 'react'

const CATEGORIES = ['Alle', 'Gaming', 'Musik', 'Technik', 'Deutsch', 'Matrix', 'Allgemein','English']

function App() {
  const [search, setSearch] = useState('')
  const [servers, setServers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('Alle')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', room_id: '', category: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const fetchRooms = (searchTerm = '') => {
    setLoading(true)
    const url = searchTerm
      ? `http://localhost:3001/rooms?search=${encodeURIComponent(searchTerm)}`
      : `http://localhost:3001/rooms`
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setServers(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  const handleSearch = () => {
    setActiveCategory('Alle')
    fetchRooms(search)
  }

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch() }

  const handleCategory = (cat) => {
    setActiveCategory(cat)
    setSearch('')
    if (cat === 'Alle') {
      fetchRooms()
    } else {
      fetchRooms(cat)
    }
  }

  const handleSubmit = async () => {
    if (!form.name || !form.room_id) return
    setSubmitting(true)
    try {
      await fetch('http://localhost:3001/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSuccess(true)
      setForm({ name: '', description: '', room_id: '', category: '' })
      fetchRooms()
      setTimeout(() => { setSuccess(false); setShowForm(false) }, 2000)
    } catch (err) {
      console.error(err)
    }
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-purple-400">MatrixRooms</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          Server eintragen
        </button>
      </nav>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Server eintragen</h2>
            {success ? (
              <p className="text-green-400 text-center py-4">✅ Erfolgreich eingetragen!</p>
            ) : (
              <>
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Name des Servers *"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="text"
                    placeholder="Matrix Room-ID (z.B. #raum:matrix.org) *"
                    value={form.room_id}
                    onChange={(e) => setForm({ ...form, room_id: e.target.value })}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Kategorie wählen...</option>
                    {CATEGORIES.filter(c => c !== 'Alle' && c !== 'Matrix').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <textarea
                    placeholder="Beschreibung"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-medium transition"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !form.name || !form.room_id}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 py-3 rounded-lg font-medium transition"
                  >
                    {submitting ? 'Wird gespeichert...' : 'Eintragen'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col items-center justify-center py-24 px-4">
        <h2 className="text-4xl font-bold mb-4 text-center">Finde deinen Matrix-Server</h2>
        <p className="text-gray-400 mb-8 text-center">Durchsuche tausende öffentliche Matrix-Räume</p>
        <div className="flex w-full max-w-xl gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="z.B. Pokemon, Gaming, Musik..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={handleSearch}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-medium transition"
          >
            Suchen
          </button>
        </div>

        {/* Kategorie Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeCategory === cat
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16">
        <h3 className="text-xl font-semibold mb-6 text-gray-300">
          {search ? `Ergebnisse für "${search}"` : activeCategory !== 'Alle' ? `Kategorie: ${activeCategory}` : 'Alle Server'}
        </h3>
        {loading ? (
          <p className="text-gray-500 text-center py-12">Räume werden geladen...</p>
        ) : servers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Keine Server gefunden.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-medium transition"
            >
              Server eintragen
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {servers.map((room) => (
              <div key={room.id || room.room_id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-purple-500 transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs bg-purple-900 text-purple-300 px-2 py-1 rounded-full">{room.category || 'Allgemein'}</span>
                  {room.members && <span className="text-xs text-gray-500">{room.members} Mitglieder</span>}
                </div>
                <h4 className="font-bold text-lg mb-2">{room.name}</h4>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{room.description || 'Keine Beschreibung vorhanden.'}</p>
                <a
                  href={`https://matrix.to/#/${room.room_id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg text-sm font-medium transition text-center"
                >
                  Beitreten
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
