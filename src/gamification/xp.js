export const XP_PER_LEVEL = 100

export const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Kolay', xp: 10 },
  { value: 'medium', label: 'Orta', xp: 25 },
  { value: 'hard', label: 'Zor', xp: 50 },
  { value: 'boss', label: 'Boss', xp: 100 },
]

export function difficultyMeta(value) {
  return DIFFICULTY_OPTIONS.find((d) => d.value === value) || DIFFICULTY_OPTIONS[0]
}

export function levelForXP(xp) {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

export function xpProgress(totalXP) {
  const level = levelForXP(totalXP)
  const currentLevelFloor = (level - 1) * XP_PER_LEVEL
  const xpIntoLevel = totalXP - currentLevelFloor
  const percent = Math.min(100, (xpIntoLevel / XP_PER_LEVEL) * 100)
  return { level, xpIntoLevel, xpForNextLevel: XP_PER_LEVEL, percent }
}
