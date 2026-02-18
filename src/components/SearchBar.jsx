const CATEGORIES = ['Alle', 'Gaming', 'Musik', 'Technik', 'Deutsch', 'Matrix', 'Allgemein']

function SearchBar({ search, onSearchChange, onSearch, activeCategory, onCategoryChange }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSearch()
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <h2 className="text-4xl font-bold mb-4 text-center">Finde deinen Matrix-Server</h2>
      <p className="text-gray-400 mb-8 text-center">Durchsuche tausende öffentliche Matrix-Räume</p>
      <div className="flex w-full max-w-xl gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="z.B. Pokemon, Gaming, Musik..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
        />
        <button
          onClick={onSearch}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-medium transition"
        >
          Suchen
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
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
  )
}

export default SearchBar
export { CATEGORIES }
