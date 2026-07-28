import { useEffect, useState } from 'react'
import { Badge, Box, Button, Flex, Heading, Input, Stack, Text } from '@chakra-ui/react'
import { supabase } from '../supabaseClient'
import { useGameLogic } from '../hooks/useGameLogic'
import { notifyXPResult, notifyMissedMeetings } from '../gamification/notify'
import { Checkbox } from '../components/ui/checkbox'
import { EmptyState } from '../components/ui/empty-state'
import { Skeleton } from '../components/ui/skeleton'
import { TrashIcon } from '../components/icons'

const MEETING_XP = 50
const MISSED_PENALTY = 10

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
  const { addXP, penalizeStreak } = useGameLogic()

  useEffect(() => {
    fetchMeetings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchMeetings() {
    setLoading(true)
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .order('starts_at', { ascending: true })
    if (error) {
      setError('Toplantılar yüklenemedi.')
    } else {
      setMeetings(data)
      await applyMissedPenalties(data)
    }
    setLoading(false)
  }

  async function applyMissedPenalties(list) {
    const now = new Date()
    const missed = list.filter(
      (m) => !m.is_completed && !m.missed_penalized && new Date(m.starts_at) < now
    )
    if (missed.length === 0) return

    await Promise.all(
      missed.map((m) => supabase.from('meetings').update({ missed_penalized: true }).eq('id', m.id))
    )
    const result = await penalizeStreak(MISSED_PENALTY * missed.length)
    if (result) notifyMissedMeetings(missed.length, MISSED_PENALTY * missed.length)
    setMeetings((prev) =>
      prev.map((m) => (missed.some((x) => x.id === m.id) ? { ...m, missed_penalized: true } : m))
    )
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

  async function toggleCompleted(meeting) {
    const nextCompleted = !meeting.is_completed
    const updates = {
      is_completed: nextCompleted,
      completed_at: nextCompleted ? new Date().toISOString() : null,
    }
    const { error } = await supabase.from('meetings').update(updates).eq('id', meeting.id)
    if (!error) {
      setMeetings((prev) => prev.map((m) => (m.id === meeting.id ? { ...m, ...updates } : m)))
      const xpDelta = nextCompleted ? MEETING_XP : -MEETING_XP
      const result = await addXP(xpDelta)
      notifyXPResult(result, xpDelta)
    }
  }

  async function deleteMeeting(id) {
    const { error } = await supabase.from('meetings').delete().eq('id', id)
    if (!error) {
      setMeetings((prev) => prev.filter((m) => m.id !== id))
    }
  }

  if (loading) {
    return (
      <Box maxW="720px" mx="auto">
        <Skeleton height="32px" width="200px" mb={6} />
        <Skeleton height="90px" borderRadius="lg" mb={6} />
        <Stack gap={2}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} height="70px" borderRadius="lg" />
          ))}
        </Stack>
      </Box>
    )
  }

  const now = new Date()
  const upcoming = meetings.filter((m) => new Date(m.starts_at) >= now)
  const past = meetings
    .filter((m) => new Date(m.starts_at) < now)
    .sort((a, b) => new Date(b.starts_at) - new Date(a.starts_at))

  return (
    <Box maxW="720px" mx="auto">
      <Heading size="lg" mb={5}>Toplantılar</Heading>

      <Box bg="bg.panel" borderWidth="1px" borderColor="border" borderRadius="xl" p={5} mb={6}>
        <form onSubmit={handleAdd}>
          <Stack gap={3}>
            <Input
              placeholder="Toplantı başlığı"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Flex gap={3} wrap="wrap">
              <Input
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                flex="1"
                minW="220px"
              />
              <Input
                placeholder="Not (isteğe bağlı)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                flex="1"
                minW="220px"
              />
            </Flex>
            <Button type="submit" colorPalette="brand" alignSelf="flex-start">Ekle</Button>
          </Stack>
        </form>
      </Box>

      {error && <Text color="red.500" mb={4}>{error}</Text>}

      <Heading size="sm" mb={3} color="fg.muted">Yaklaşan Toplantılar</Heading>
      {upcoming.length === 0 ? (
        <EmptyState
          icon="📅"
          title="Yaklaşan toplantı yok"
          description="Yukarıdan yeni bir toplantı ekleyerek başla."
        />
      ) : (
        <Stack gap={2} mb={6}>
          {upcoming.map((m) => (
            <MeetingCard
              key={m.id}
              meeting={m}
              onToggleCompleted={toggleCompleted}
              onDelete={deleteMeeting}
            />
          ))}
        </Stack>
      )}

      <Heading size="sm" mb={3} color="fg.muted">Geçmiş</Heading>
      {past.length === 0 ? (
        <EmptyState
          icon="🗂️"
          title="Geçmiş toplantı yok"
          description="Geçmiş toplantıların burada listelenecek."
        />
      ) : (
        <Stack gap={2}>
          {past.map((m) => (
            <MeetingCard
              key={m.id}
              meeting={m}
              past
              onToggleCompleted={toggleCompleted}
              onDelete={deleteMeeting}
            />
          ))}
        </Stack>
      )}
    </Box>
  )
}

function MeetingCard({ meeting, past, onToggleCompleted, onDelete }) {
  const missed = meeting.missed_penalized && !meeting.is_completed
  return (
    <Box
      bg="bg.panel"
      borderWidth="1px"
      borderColor={missed ? 'red.300' : 'border'}
      borderRadius="lg"
      p={3}
      opacity={past && !meeting.is_completed ? 0.75 : 1}
    >
      <Flex align="start" gap={3}>
        <Checkbox
          checked={meeting.is_completed}
          onCheckedChange={() => onToggleCompleted(meeting)}
          mt="1px"
          title={`Tamamlandı (+${MEETING_XP} XP)`}
        />
        <Box flex="1" minW={0}>
          <Text
            fontSize="sm"
            fontWeight="medium"
            textDecoration={meeting.is_completed ? 'line-through' : 'none'}
            color={meeting.is_completed ? 'fg.muted' : 'fg'}
          >
            {meeting.title}
          </Text>
          {meeting.note && <Text fontSize="xs" color="fg.muted" mt="1">{meeting.note}</Text>}
          {missed && (
            <Badge colorPalette="red" mt="2" size="sm">
              Kaçırıldı · -{MISSED_PENALTY} seri
            </Badge>
          )}
        </Box>
        <Box textAlign="right" flexShrink={0}>
          <Text fontSize="xs" color="fg.muted" whiteSpace="nowrap">
            {formatDateTime(meeting.starts_at)}
          </Text>
          <Flex justify="flex-end" mt={2}>
            <Box
              as="button"
              type="button"
              aria-label="Sil"
              title="Sil"
              color="red.500"
              _hover={{ color: 'red.600' }}
              onClick={() => onDelete(meeting.id)}
            >
              <TrashIcon />
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}
