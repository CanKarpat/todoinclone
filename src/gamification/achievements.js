export const ACHIEVEMENTS = [
  {
    id: 'first_quest',
    title: 'İlk Adım',
    description: 'İlk görevini tamamladın.',
    icon: '🎯',
    check: ({ completedCount }) => completedCount >= 1,
  },
  {
    id: 'ten_quests',
    title: 'Görev Avcısı',
    description: '10 görev tamamladın.',
    icon: '⚔️',
    check: ({ completedCount }) => completedCount >= 10,
  },
  {
    id: 'streak_7',
    title: 'Seri Ustası',
    description: '7 gün üst üste rutin tamamladın.',
    icon: '🔥',
    check: ({ streak }) => streak >= 7,
  },
  {
    id: 'level_5',
    title: 'Deneyimli Kaşif',
    description: 'Seviye 5\'e ulaştın.',
    icon: '🌟',
    check: ({ level }) => level >= 5,
  },
]

export function checkNewAchievements(unlockedIds, context) {
  return ACHIEVEMENTS.filter(
    (a) => !unlockedIds.includes(a.id) && a.check(context)
  ).map((a) => a.id)
}
