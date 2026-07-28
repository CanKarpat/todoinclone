import { useAuth } from '../context/AuthContext'
import { levelForXP } from '../gamification/xp'
import { ACHIEVEMENTS, checkNewAchievements } from '../gamification/achievements'
import { nextStreakState } from '../gamification/streak'

function resolveAchievements(ids) {
  return ids
    .map((id) => ACHIEVEMENTS.find((a) => a.id === id))
    .filter(Boolean)
}

export function useGameLogic() {
  const { profile, updateProfile } = useAuth()

  async function addXP(amount, { completedCount = 0 } = {}) {
    if (!profile) return null
    const previousLevel = profile.player_level
    const nextXP = Math.max(0, profile.total_xp + amount)
    const nextLevel = levelForXP(nextXP)
    const context = { completedCount, streak: profile.daily_streak, level: nextLevel }
    const newlyUnlocked = checkNewAchievements(profile.unlocked_achievements || [], context)

    const patch = { total_xp: nextXP, player_level: nextLevel }
    if (newlyUnlocked.length > 0) {
      patch.unlocked_achievements = [...(profile.unlocked_achievements || []), ...newlyUnlocked]
    }
    await updateProfile(patch)
    return {
      level: nextLevel,
      previousLevel,
      leveledUp: nextLevel > previousLevel,
      newlyUnlocked: resolveAchievements(newlyUnlocked),
    }
  }

  async function checkStreak() {
    if (!profile) return null
    const streakPatch = nextStreakState(profile)
    if (!streakPatch) return null

    const context = { completedCount: 0, streak: streakPatch.daily_streak, level: profile.player_level }
    const newlyUnlocked = checkNewAchievements(profile.unlocked_achievements || [], context)

    const patch = { ...streakPatch }
    if (newlyUnlocked.length > 0) {
      patch.unlocked_achievements = [...(profile.unlocked_achievements || []), ...newlyUnlocked]
    }
    await updateProfile(patch)
    return { streak: streakPatch.daily_streak, newlyUnlocked: resolveAchievements(newlyUnlocked) }
  }

  async function penalizeStreak(amount) {
    if (!profile) return null
    const nextStreak = Math.max(0, profile.daily_streak - amount)
    await updateProfile({ daily_streak: nextStreak })
    return { streak: nextStreak }
  }

  return { addXP, checkStreak, penalizeStreak }
}
