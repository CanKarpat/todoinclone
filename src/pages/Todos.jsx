import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const TAG_OPTIONS = [
  { value: '', label: 'Etiket yok' },
  { value: 'iş', label: 'İş' },
  { value: 'kişisel', label: 'Kişisel' },
]

function tagClass(tag) {
  if (tag === 'iş') return 'tag tag-work'
  if (tag === 'kişisel') return 'tag tag-personal'
  return 'tag'
}

function todayDateStr() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function dateKey(iso) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function formatDateHeading(iso) {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function groupByCompletedDate(items) {
  const sorted = [...items].sort(
    (a, b) => new Date(b.completed_at) - new Date(a.completed_at)
  )
  const groups = []
  let currentKey = null
  for (const item of sorted) {
    const key = dateKey(item.completed_at)
    if (key !== currentKey) {
      groups.push({ key, date: item.completed_at, items: [] })
      currentKey = key
    }
    groups[groups.length - 1].items.push(item)
  }
  return groups
}

export default function Todos() {
  const [todos, setTodos] = useState([])
  const [routines, setRoutines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [title, setTitle] = useState('')
  const [tag, setTag] = useState('')
  const [routineTitle, setRoutineTitle] = useState('')

  useEffect(() => {
    fetchTodos()
    fetchRoutines()
  }, [])

  async function fetchTodos() {
    setLoading(true)
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setError('Görevler yüklenemedi.')
    else setTodos(data)
    setLoading(false)
  }

  async function fetchRoutines() {
    const { data, error } = await supabase
      .from('routines')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setRoutines(data)
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!title.trim()) return
    const { data, error } = await supabase
      .from('todos')
      .insert({ title: title.trim(), tag: tag || null, is_today: false, done: false })
      .select()
      .single()
    if (!error) {
      setTodos((prev) => [data, ...prev])
      setTitle('')
      setTag('')
    }
  }

  async function toggleDone(todo) {
    const nextDone = !todo.done
    const updates = { done: nextDone, completed_at: nextDone ? new Date().toISOString() : null }
    const { error } = await supabase.from('todos').update(updates).eq('id', todo.id)
    if (!error) {
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? { ...t, ...updates } : t)))
    }
  }

  async function toggleToday(todo) {
    const { error } = await supabase
      .from('todos')
      .update({ is_today: !todo.is_today })
      .eq('id', todo.id)
    if (!error) {
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? { ...t, is_today: !t.is_today } : t)))
    }
  }

  async function moveToCompleted(todo) {
    const updates = { moved_to_completed: true }
    if (!todo.completed_at) updates.completed_at = new Date().toISOString()
    const { error } = await supabase.from('todos').update(updates).eq('id', todo.id)
    if (!error) {
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? { ...t, ...updates } : t)))
    }
  }

  async function deleteTodo(id) {
    const { error } = await supabase.from('todos').delete().eq('id', id)
    if (!error) {
      setTodos((prev) => prev.filter((t) => t.id !== id))
    }
  }

  async function handleAddRoutine(e) {
    e.preventDefault()
    if (!routineTitle.trim()) return
    const { data, error } = await supabase
      .from('routines')
      .insert({ title: routineTitle.trim() })
      .select()
      .single()
    if (!error) {
      setRoutines((prev) => [data, ...prev])
      setRoutineTitle('')
    }
  }

  async function toggleRoutineDone(routine) {
    const today = todayDateStr()
    const isDoneToday = routine.last_completed_date === today
    const nextValue = isDoneToday ? null : today
    const { error } = await supabase
      .from('routines')
      .update({ last_completed_date: nextValue })
      .eq('id', routine.id)
    if (!error) {
      setRoutines((prev) =>
        prev.map((r) => (r.id === routine.id ? { ...r, last_completed_date: nextValue } : r))
      )
    }
  }

  async function deleteRoutine(id) {
    const { error } = await supabase.from('routines').delete().eq('id', id)
    if (!error) {
      setRoutines((prev) => prev.filter((r) => r.id !== id))
    }
  }

  if (loading) return <p className="empty-text">Yükleniyor...</p>

  const today = todayDateStr()
  const activeTodos = todos.filter((t) => !t.moved_to_completed)
  const todayTodos = activeTodos.filter((t) => t.is_today)
  const otherTodos = activeTodos.filter((t) => !t.is_today)
  const completedGroups = groupByCompletedDate(todos.filter((t) => t.moved_to_completed))

  return (
    <div>
      <h1>Görevler</h1>

      {error && <p className="error-text">{error}</p>}

      <div className="board">
        <section className="board-column">
          <h2 className="section-title">Günlük Rutinler</h2>
          <form className="add-form" onSubmit={handleAddRoutine}>
            <input
              type="text"
              placeholder="Yeni rutin"
              value={routineTitle}
              onChange={(e) => setRoutineTitle(e.target.value)}
            />
            <button type="submit" className="btn-primary">Ekle</button>
          </form>
          {routines.length === 0 ? (
            <p className="empty-text">Henüz rutin eklenmedi.</p>
          ) : (
            <ul className="list">
              {routines.map((routine) => (
                <RoutineItem
                  key={routine.id}
                  routine={routine}
                  doneToday={routine.last_completed_date === today}
                  onToggle={toggleRoutineDone}
                  onDelete={deleteRoutine}
                />
              ))}
            </ul>
          )}
        </section>

        <section className="board-column">
          <h2 className="section-title">Bugün Yapılacaklar</h2>
          {todayTodos.length === 0 ? (
            <p className="empty-text">Bugün için işaretli görev yok.</p>
          ) : (
            <ul className="list">
              {todayTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggleDone={toggleDone}
                  onToggleToday={toggleToday}
                  onMoveToCompleted={moveToCompleted}
                  onDelete={deleteTodo}
                />
              ))}
            </ul>
          )}
        </section>

        <section className="board-column">
          <h2 className="section-title">Tüm Görevler</h2>
          <form className="add-form" onSubmit={handleAdd}>
            <input
              type="text"
              placeholder="Yeni görev başlığı"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <select value={tag} onChange={(e) => setTag(e.target.value)}>
              {TAG_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button type="submit" className="btn-primary">Ekle</button>
          </form>
          {otherTodos.length === 0 ? (
            <p className="empty-text">Görev yok.</p>
          ) : (
            <ul className="list">
              {otherTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggleDone={toggleDone}
                  onToggleToday={toggleToday}
                  onMoveToCompleted={moveToCompleted}
                  onDelete={deleteTodo}
                />
              ))}
            </ul>
          )}
        </section>

        <section className="board-column">
          <h2 className="section-title">Tamamlananlar</h2>
          {completedGroups.length === 0 ? (
            <p className="empty-text">Tamamlanmış görev yok.</p>
          ) : (
            completedGroups.map((group) => (
              <div key={group.key}>
                <h3 className="date-heading">{formatDateHeading(group.date)}</h3>
                <ul className="list">
                  {group.items.map((todo) => (
                    <li key={todo.id} className="list-item completed">
                      <span className="item-title done">{todo.title}</span>
                      {todo.tag && <span className={tagClass(todo.tag)}>{todo.tag}</span>}
                      <button className="btn-danger" onClick={() => deleteTodo(todo.id)}>Sil</button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  )
}

function TodoItem({ todo, onToggleDone, onToggleToday, onMoveToCompleted, onDelete }) {
  return (
    <li className={`list-item${todo.is_today ? ' today' : ''}`}>
      <input type="checkbox" checked={todo.done} onChange={() => onToggleDone(todo)} />
      <span className={`item-title${todo.done ? ' done' : ''}`}>{todo.title}</span>
      {todo.tag && <span className={tagClass(todo.tag)}>{todo.tag}</span>}
      <label className="today-toggle">
        <input type="checkbox" checked={todo.is_today} onChange={() => onToggleToday(todo)} />
        Bugün
      </label>
      {todo.done && (
        <button className="btn-ghost" onClick={() => onMoveToCompleted(todo)}>
          Tamamlananlara taşı
        </button>
      )}
      <button className="btn-danger" onClick={() => onDelete(todo.id)}>Sil</button>
    </li>
  )
}

function RoutineItem({ routine, doneToday, onToggle, onDelete }) {
  return (
    <li className="list-item">
      <input type="checkbox" checked={doneToday} onChange={() => onToggle(routine)} />
      <span className={`item-title${doneToday ? ' done' : ''}`}>{routine.title}</span>
      <button className="btn-danger" onClick={() => onDelete(routine.id)}>Sil</button>
    </li>
  )
}
