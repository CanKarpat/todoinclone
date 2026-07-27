import { useEffect, useState } from 'react'
import {
  Box,
  Badge,
  Button,
  Flex,
  Grid,
  IconButton,
  Input,
  Stack,
  Text,
  NativeSelectRoot,
  NativeSelectField,
} from '@chakra-ui/react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import { useGameLogic } from '../hooks/useGameLogic'
import { DIFFICULTY_OPTIONS, difficultyMeta } from '../gamification/xp'
import { todayDateStr } from '../utils/date'
import { Checkbox } from '../components/ui/checkbox'
import { PlayerProfileCard } from '../components/game/PlayerProfileCard'
import { QuestColumn } from '../components/game/QuestColumn'
import { AchievementsPanel } from '../components/game/AchievementsPanel'

const TAG_OPTIONS = [
  { value: '', label: 'Etiket yok' },
  { value: 'iş', label: 'İş' },
  { value: 'kişisel', label: 'Kişisel' },
]

const DIFFICULTY_COLORS = {
  easy: { border: 'blue.300', bg: 'difficultyEasyBg', color: 'difficultyEasy' },
  medium: { border: 'amber.400', bg: 'difficultyMediumBg', color: 'difficultyMedium' },
  hard: { border: 'red.300', bg: 'difficultyHardBg', color: 'difficultyHard' },
  boss: { border: 'brand.300', bg: 'difficultyBossBg', color: 'difficultyBoss' },
}

function tagColorPalette(tag) {
  return tag === 'iş' ? 'blue' : 'green'
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

function ArchiveIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="21 8 21 21 3 21 3 8" />
      <rect x="1" y="3" width="22" height="5" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  )
}

function RestoreIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <polyline points="3 3 3 9 9 9" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
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
  const { profile } = useAuth()
  const [todos, setTodos] = useState([])
  const [routines, setRoutines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [title, setTitle] = useState('')
  const [tag, setTag] = useState('')
  const [difficulty, setDifficulty] = useState('easy')
  const [routineTitle, setRoutineTitle] = useState('')
  const { addXP, checkStreak } = useGameLogic()

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
      .insert({
        title: title.trim(),
        tag: tag || null,
        difficulty,
        xp_value: difficultyMeta(difficulty).xp,
        is_today: false,
        done: false,
      })
      .select()
      .single()
    if (!error) {
      setTodos((prev) => [data, ...prev])
      setTitle('')
      setTag('')
      setDifficulty('easy')
    }
  }

  async function toggleDone(todo) {
    const nextDone = !todo.done
    const updates = {
      done: nextDone,
      completed_at: nextDone ? new Date().toISOString() : null,
      restored_from_completed: nextDone ? todo.restored_from_completed : false,
    }
    const { error } = await supabase.from('todos').update(updates).eq('id', todo.id)
    if (!error) {
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? { ...t, ...updates } : t)))
      const completedCount = todos.filter((t) => t.done).length + (nextDone ? 1 : -1)
      const xpDelta = nextDone ? todo.xp_value : -todo.xp_value
      await addXP(xpDelta, { completedCount })
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
    const updates = { moved_to_completed: true, restored_from_completed: false }
    if (!todo.completed_at) updates.completed_at = new Date().toISOString()
    const { error } = await supabase.from('todos').update(updates).eq('id', todo.id)
    if (!error) {
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? { ...t, ...updates } : t)))
    }
  }

  async function restoreFromCompleted(todo) {
    const updates = { moved_to_completed: false, restored_from_completed: true }
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
      if (!isDoneToday) await checkStreak()
    }
  }

  async function deleteRoutine(id) {
    const { error } = await supabase.from('routines').delete().eq('id', id)
    if (!error) {
      setRoutines((prev) => prev.filter((r) => r.id !== id))
    }
  }

  if (loading) return <Text color="fg.muted">Yükleniyor...</Text>

  const today = todayDateStr()
  const activeTodos = todos.filter((t) => !t.moved_to_completed)
  const todayTodos = activeTodos.filter((t) => t.is_today)
  const otherTodos = activeTodos.filter((t) => !t.is_today)
  const completedGroups = groupByCompletedDate(todos.filter((t) => t.moved_to_completed))
  const completedTotal = todos.filter((t) => t.moved_to_completed).length

  return (
    <Box>
      <PlayerProfileCard profile={profile} />

      {error && <Text color="red.500" mb={4}>{error}</Text>}

      <Grid templateColumns="repeat(auto-fit, minmax(280px, 1fr))" gap={5} alignItems="start">
        <QuestColumn
          emoji="🔄"
          title="Günlük Rutinler"
          subtitle={`${routines.length} rutin`}
          gradientLight="linear-gradient(135deg, {colors.brand.50}, {colors.brand.200})"
          gradientDark="linear-gradient(135deg, {colors.brand.900}, {colors.brand.800})"
          titleColorLight="{colors.brand.700}"
          titleColorDark="{colors.brand.200}"
        >
          <form onSubmit={handleAddRoutine}>
            <Stack gap={2} mb={3}>
              <Input
                size="sm"
                placeholder="Yeni rutin"
                value={routineTitle}
                onChange={(e) => setRoutineTitle(e.target.value)}
              />
              <Button type="submit" size="sm" colorPalette="brand">Ekle</Button>
            </Stack>
          </form>
          {routines.length === 0 ? (
            <Text fontSize="sm" color="fg.muted">Henüz rutin eklenmedi.</Text>
          ) : (
            <Stack gap={2}>
              {routines.map((routine) => (
                <RoutineCard
                  key={routine.id}
                  routine={routine}
                  doneToday={routine.last_completed_date === today}
                  onToggle={toggleRoutineDone}
                  onDelete={deleteRoutine}
                />
              ))}
            </Stack>
          )}
        </QuestColumn>

        <QuestColumn
          emoji="🎯"
          title="Bugün Yapılacaklar"
          subtitle={`${todayTodos.length} görev`}
          gradientLight="linear-gradient(135deg, {colors.blue.50}, {colors.blue.200})"
          gradientDark="linear-gradient(135deg, {colors.blue.900}, {colors.blue.800})"
          titleColorLight="{colors.blue.700}"
          titleColorDark="{colors.blue.300}"
        >
          {todayTodos.length === 0 ? (
            <Text fontSize="sm" color="fg.muted">Bugün için işaretli görev yok.</Text>
          ) : (
            <Stack gap={2}>
              {todayTodos.map((todo) => (
                <QuestCard
                  key={todo.id}
                  todo={todo}
                  onToggleDone={toggleDone}
                  onToggleToday={toggleToday}
                  onMoveToCompleted={moveToCompleted}
                  onDelete={deleteTodo}
                />
              ))}
            </Stack>
          )}
        </QuestColumn>

        <QuestColumn
          emoji="🏋️"
          title="Eğitimde"
          subtitle={`${otherTodos.length} görev`}
          gradientLight="linear-gradient(135deg, {colors.amber.50}, {colors.amber.200})"
          gradientDark="linear-gradient(135deg, {colors.amber.900}, {colors.amber.800})"
          titleColorLight="{colors.amber.700}"
          titleColorDark="{colors.amber.300}"
        >
          <form onSubmit={handleAdd}>
            <Stack gap={2} mb={3}>
              <Input
                size="sm"
                placeholder="Yeni görev başlığı"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <NativeSelectRoot size="sm">
                <NativeSelectField value={tag} onChange={(e) => setTag(e.target.value)}>
                  {TAG_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </NativeSelectField>
              </NativeSelectRoot>
              <NativeSelectRoot size="sm">
                <NativeSelectField value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  {DIFFICULTY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label} · {opt.xp} XP</option>
                  ))}
                </NativeSelectField>
              </NativeSelectRoot>
              <Button type="submit" size="sm" colorPalette="brand">Ekle</Button>
            </Stack>
          </form>
          {otherTodos.length === 0 ? (
            <Text fontSize="sm" color="fg.muted">Görev yok.</Text>
          ) : (
            <Stack gap={2}>
              {otherTodos.map((todo) => (
                <QuestCard
                  key={todo.id}
                  todo={todo}
                  onToggleDone={toggleDone}
                  onToggleToday={toggleToday}
                  onMoveToCompleted={moveToCompleted}
                  onDelete={deleteTodo}
                />
              ))}
            </Stack>
          )}
        </QuestColumn>

        <QuestColumn
          emoji="✨"
          title="Ustalaşıldı"
          subtitle={`${completedTotal} tamamlandı`}
          gradientLight="linear-gradient(135deg, {colors.green.50}, {colors.green.200})"
          gradientDark="linear-gradient(135deg, {colors.green.900}, {colors.green.800})"
          titleColorLight="{colors.green.700}"
          titleColorDark="{colors.green.300}"
        >
          {completedGroups.length === 0 ? (
            <Text fontSize="sm" color="fg.muted">Tamamlanmış görev yok.</Text>
          ) : (
            <Stack gap={3}>
              {completedGroups.map((group) => (
                <Box key={group.key}>
                  <Text fontSize="xs" fontWeight="medium" color="fg.muted" mb={2}>
                    {formatDateHeading(group.date)}
                  </Text>
                  <Stack gap={2}>
                    {group.items.map((todo) => (
                      <CompletedCard
                        key={todo.id}
                        todo={todo}
                        onRestore={restoreFromCompleted}
                        onDelete={deleteTodo}
                      />
                    ))}
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </QuestColumn>
      </Grid>

      <AchievementsPanel unlockedIds={profile?.unlocked_achievements || []} />
    </Box>
  )
}

function QuestCard({ todo, onToggleDone, onToggleToday, onMoveToCompleted, onDelete }) {
  const dc = DIFFICULTY_COLORS[todo.difficulty] || DIFFICULTY_COLORS.easy
  return (
    <Box
      bg={todo.is_today ? 'todayBg' : 'bg.panel'}
      borderWidth="1px"
      borderColor={dc.border}
      borderRadius="lg"
      p={3}
    >
      <Flex align="start" gap={2}>
        {todo.restored_from_completed && (
          <Box color="textAccent" title="Tamamlananlardan geri döndü" flexShrink={0} mt="2px">
            <RestoreIcon />
          </Box>
        )}
        <Checkbox checked={todo.done} onCheckedChange={() => onToggleDone(todo)} mt="1px" />
        <Box flex="1" minW={0}>
          <Text
            fontSize="sm"
            fontWeight="medium"
            textDecoration={todo.done ? 'line-through' : 'none'}
            color={todo.done ? 'fg.muted' : 'fg'}
          >
            {todo.title}
          </Text>
          <Flex gap={2} mt={2} wrap="wrap" align="center">
            {todo.tag && (
              <Badge colorPalette={tagColorPalette(todo.tag)} borderRadius="full" size="sm">
                {todo.tag}
              </Badge>
            )}
            {todo.difficulty && (
              <Badge bg={dc.bg} color={dc.color} borderRadius="full" size="sm" fontWeight="medium">
                {difficultyMeta(todo.difficulty).label} · {todo.xp_value} XP
              </Badge>
            )}
          </Flex>
          <Flex mt={2} gap={2} align="center">
            <Checkbox size="sm" checked={todo.is_today} onCheckedChange={() => onToggleToday(todo)}>
              <Text fontSize="xs" color="fg.muted">Bugün</Text>
            </Checkbox>
            <Box flex="1" />
            {todo.done && (
              <IconButton
                aria-label="Tamamlananlara taşı"
                title="Tamamlananlara taşı"
                size="xs"
                variant="outline"
                onClick={() => onMoveToCompleted(todo)}
              >
                <ArchiveIcon />
              </IconButton>
            )}
            <IconButton
              aria-label="Sil"
              title="Sil"
              size="xs"
              variant="ghost"
              colorPalette="red"
              onClick={() => onDelete(todo.id)}
            >
              <TrashIcon />
            </IconButton>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}

function RoutineCard({ routine, doneToday, onToggle, onDelete }) {
  return (
    <Box bg="bg.panel" borderWidth="1px" borderColor="border" borderRadius="lg" p={3}>
      <Flex align="start" gap={2}>
        <Checkbox checked={doneToday} onCheckedChange={() => onToggle(routine)} mt="1px" />
        <Box flex="1">
          <Text
            fontSize="sm"
            fontWeight="medium"
            textDecoration={doneToday ? 'line-through' : 'none'}
            color={doneToday ? 'fg.muted' : 'fg'}
          >
            {routine.title}
          </Text>
          <Text fontSize="xs" color="fg.muted" mt="1">Günlük seriye katkı sağlar</Text>
        </Box>
        <IconButton
          aria-label="Sil"
          title="Sil"
          size="xs"
          variant="ghost"
          colorPalette="red"
          onClick={() => onDelete(routine.id)}
        >
          <TrashIcon />
        </IconButton>
      </Flex>
    </Box>
  )
}

function CompletedCard({ todo, onRestore, onDelete }) {
  return (
    <Box bg="bg.panel" borderWidth="1px" borderColor="border.success" borderRadius="lg" p={3} opacity={0.85}>
      <Flex align="start" gap={2}>
        <Text fontSize="sm" mt="1px">✅</Text>
        <Box flex="1" minW={0}>
          <Text fontSize="sm" textDecoration="line-through" color="fg.muted">{todo.title}</Text>
          <Flex gap={2} mt={1} wrap="wrap" align="center">
            {todo.tag && (
              <Badge colorPalette={tagColorPalette(todo.tag)} borderRadius="full" size="sm">
                {todo.tag}
              </Badge>
            )}
            {todo.difficulty && (
              <Text fontSize="xs" color="fg.subtle">+{todo.xp_value} XP</Text>
            )}
          </Flex>
        </Box>
        <Flex gap={1}>
          <IconButton
            aria-label="Görevi geri döndür"
            title="Görevi geri döndür"
            size="xs"
            variant="ghost"
            onClick={() => onRestore(todo)}
          >
            <RestoreIcon />
          </IconButton>
          <IconButton
            aria-label="Sil"
            title="Sil"
            size="xs"
            variant="ghost"
            colorPalette="red"
            onClick={() => onDelete(todo.id)}
          >
            <TrashIcon />
          </IconButton>
        </Flex>
      </Flex>
    </Box>
  )
}
