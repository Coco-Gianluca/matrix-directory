import { useState } from 'react'
import { CATEGORIES } from './SearchBar'

function RoomForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', description: '', room_id: '', category: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

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
      onSuccess()
      setTimeout(() => { setSuccess(false); onClose() }, 2000)
    } catch (err) {
      console.error(err)
    }
    setSubmitting(false)
  }

  return (
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
                onClick={onClose}
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
  )
}

export default RoomForm
