import { useState, useEffect } from 'react'
import RoomCard from './components/RoomCard'
import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'
import RoomForm from './components/RoomForm'

function App() {
  const [search, setSearch] = useState('')
  const [servers, setServers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('Alle')
  const [showForm, setShowForm] = useState(false)

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

  const handleCategory = (cat) => {
    setActiveCategory(cat)
    setSearch('')
    if (cat === 'Alle') {
      fetchRooms()
    } else {
      fetchRooms(cat)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      <Navbar onAddServer={() => setShowForm(true)} />

      {showForm && (
        <RoomForm
          onClose={() => setShowForm(false)}
          onSuccess={fetchRooms}
        />
      )}

      <SearchBar
        search={search}
        onSearchChange={setSearch}
        onSearch={handleSearch}
        activeCategory={activeCategory}
        onCategoryChange={handleCategory}
      />

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
              <RoomCard key={room.id || room.room_id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
