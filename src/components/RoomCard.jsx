import { useState } from 'react'

function mxcToUrl(mxc) {
  if (!mxc) return null
  const withoutPrefix = mxc.replace('mxc://', '')
  return `https://matrix-client.matrix.org/_matrix/media/v3/thumbnail/${withoutPrefix}?width=64&height=64&method=crop`
}

function RoomCard({ room }) {
  const imageUrl = mxcToUrl(room.avatar_url)
  const [imgError, setImgError] = useState(false)

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-purple-500 transition">
      <div className="flex items-center gap-3 mb-3">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={room.name}
            onError={() => setImgError(true)}
            className="w-12 h-12 rounded-full object-cover bg-gray-700"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-purple-900 flex items-center justify-center text-purple-300 font-bold text-lg">
            {(room.name || '?')[0].toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-lg truncate">{room.name}</h4>
          <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full">{room.category || 'Allgemein'}</span>
        </div>
        {room.members && <span className="text-xs text-gray-500 shrink-0">{room.members} 👥</span>}
      </div>
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
  )
}

export default RoomCard
