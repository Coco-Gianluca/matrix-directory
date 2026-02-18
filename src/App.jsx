import { useState, useEffect } from 'react'

function App() {
  const [search, setSearch] = useState('')
  const [allRooms, setAllRooms] = useState([])
  const [servers, setServers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:3001/rooms')
      .then((res) => res.json())
      .then((data) => {
        const rooms = data.chunk || []
        setAllRooms(rooms)
        setServers(rooms)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSearch = () => {
    if (!search.trim()) {
      setServers(allRooms)
      return
    }
    const term = search.toLowerCase()
    const filtered = allRooms.filter((room) =>
      (room.name || '').toLowerCase().includes(term) ||
      (room.topic || '').toLowerCase().includes(term)
    )
    setServers(filtered)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-purple-400">MatrixRooms</h1>
        <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition">
          Server eintragen
        </button>
      </nav>

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
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16">
        <h3 className="text-xl font-semibold mb-6 text-gray-300">
          {search ? `Ergebnisse für "${search}"` : 'Beliebte Matrix-Räume'}
        </h3>
        {loading ? (
          <p className="text-gray-500 text-center py-12">Räume werden geladen...</p>
        ) : servers.length === 0 ? (
          <p className="text-gray-500 text-center py-12">Keine Räume gefunden.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {servers.map((room) => (
              <div key={room.room_id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-purple-500 transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs bg-purple-900 text-purple-300 px-2 py-1 rounded-full">Matrix</span>
                  <span className="text-xs text-gray-500">{room.num_joined_members} Mitglieder</span>
                </div>
                <h4 className="font-bold text-lg mb-2">{room.name || 'Unbenannter Raum'}</h4>
                <p className="text-gray-400 text-sm mb-4">{room.topic || 'Keine Beschreibung vorhanden.'}</p>
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
