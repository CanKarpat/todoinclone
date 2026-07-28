import { toaster } from '../components/ui/toaster'

function notifyAchievements(newlyUnlocked) {
  newlyUnlocked?.forEach((ach) => {
    toaster.create({
      title: `Başarım açıldı: ${ach.icon} ${ach.title}`,
      description: ach.description,
      type: 'success',
      duration: 4000,
    })
  })
}

export function notifyXPResult(result, xpDelta) {
  if (!result) return
  if (xpDelta > 0) {
    toaster.create({ title: `+${xpDelta} XP kazandın!`, type: 'success', duration: 2500 })
  }
  if (result.leveledUp) {
    toaster.create({
      title: `Seviye ${result.level}'e ulaştın!`,
      description: 'Yeni bir güç kazandın.',
      type: 'success',
      duration: 3500,
    })
  }
  notifyAchievements(result.newlyUnlocked)
}

export function notifyStreakResult(result) {
  if (!result) return
  toaster.create({ title: `🔥 Seri: ${result.streak} gün`, type: 'info', duration: 2500 })
  notifyAchievements(result.newlyUnlocked)
}

export function notifyMissedMeetings(count, penaltyTotal) {
  toaster.create({
    title: count === 1 ? 'Kaçırılan toplantı' : `${count} kaçırılan toplantı`,
    description: `Serin ${penaltyTotal} azaldı.`,
    type: 'warning',
    duration: 4000,
  })
}
