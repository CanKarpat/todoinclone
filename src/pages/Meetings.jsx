import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

function formatDateTime(iso) {
  return new Date(iso).toLocaleString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function Meetings() {
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [title, setTitle] = useState('')
  const [startsAt, setStartsAt] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => {
    fetchMeetings()
  }, [])

  async function fetchMeetings() {
    setLoading(true)
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .order('starts_at', { ascending: true })
    if (error) setError('Toplantılar yüklenemedi.')
    else setMeetings(data)
    setLoading(false)
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!title.trim() || !startsAt) return
    const { data, error } = await supabase
      .from('meetings')
      .insert({
        title: title.trim(),
        starts_at: new Date(startsAt).toISOString(),
        note: note.trim() || null,
      })
      .select()
      .single()
    if (!error) {
      setMeetings((prev) =>
        [...prev, data].sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at))
      )
      setTitle('')
      setStartsAt('')
      setNote('')
    }
  }

  async function deleteMeeting(id) {
    const { error } = await supabase.from('meetings').delete().eq('id', id)
    if (!error) {
      setMeetings((prev) => prev.filter((m) => m.id !== id))
    }
  }

  if (loading) return <p className="empty-text">Yükleniyor...</p>

  const now = new Date()
  const upcoming = meetings.filter((m) => new Date(m.starts_at) >= now)
  const past = meetings
    .filter((m) => new Date(m.starts_at) < now)
    .sort((a, b) => new Date(b.starts_at) - new Date(a.starts_at))

  return (
    <div className="narrow">
      <h1>Toplantılar</h1>

      <form className="add-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Toplantı başlığı"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="datetime-local"
          value={startsAt}
          onChange={(e) => setStartsAt(e.target.value)}
        />
        <input
          type="text"
          placeholder="Not (isteğe bağlı)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button type="submit" className="btn-primary">Ekle</button>
      </form>

      {error && <p className="error-text">{error}</p>}

      <h2 className="section-title">Yaklaşan Toplantılar</h2>
      {upcoming.length === 0 ? (
        <p className="empty-text">Yaklaşan toplantı yok.</p>
      ) : (
        <ul className="list">
          {upcoming.map((m) => (
            <MeetingItem key={m.id} meeting={m} onDelete={deleteMeeting} />
          ))}
        </ul>
      )}

      <h2 className="section-title">Geçmiş</h2>
      {past.length === 0 ? (
        <p className="empty-text">Geçmiş toplantı yok.</p>
      ) : (
        <ul className="list">
          {past.map((m) => (
            <MeetingItem key={m.id} meeting={m} past onDelete={deleteMeeting} />
          ))}
        </ul>
      )}
    </div>
  )
}

function MeetingItem({ meeting, past, onDelete }) {
  return (
    <li className={`list-item${past ? ' past' : ''}`}>
      <div className="meeting-main">
        <span className="item-title">{meeting.title}</span>
        {meeting.note && <span className="meeting-note">{meeting.note}</span>}
      </div>
      <span className="meeting-datetime">{formatDateTime(meeting.starts_at)}</span>
      <button className="btn-danger" onClick={() => onDelete(meeting.id)}>Sil</button>
    </li>
  )
}
