import { todayDateStr, isYesterday } from '../utils/date'

export function nextStreakState(profile) {
  const today = todayDateStr()
  if (profile.last_routine_date === today) return null

  const daily_streak = isYesterday(profile.last_routine_date, today)
    ? profile.daily_streak + 1
    : 1

  return { daily_streak, last_routine_date: today }
}
