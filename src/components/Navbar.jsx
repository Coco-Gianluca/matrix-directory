function Navbar({ onAddServer }) {
  return (
    <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-purple-400">MatrixRooms</h1>
      <button
        onClick={onAddServer}
        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition"
      >
        Server eintragen
      </button>
    </nav>
  )
}

export default Navbar
