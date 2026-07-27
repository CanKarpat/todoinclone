export function todayDateStr() {
  return dateStr(new Date())
}

export function dateStr(date) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function isYesterday(dateString, todayString) {
  if (!dateString) return false
  const today = new Date(`${todayString}T00:00:00`)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  return dateString === dateStr(yesterday)
}
