import { format, formatDistanceToNow, differenceInSeconds } from 'date-fns'

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd MMM yyyy')
}

export function formatDateShort(date: string | Date): string {
  return format(new Date(date), 'dd/MM')
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'dd MMM yyyy, HH:mm')
}

export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m.toString().padStart(2, '0')}m`
  if (m > 0) return `${m}m ${s.toString().padStart(2, '0')}s`
  return `${s}s`
}

export function formatWeight(kg: number): string {
  return `${kg} kg`
}

export function sessionDuration(startedAt: string, endedAt: string | null): string {
  if (!endedAt) return 'In progress'
  const secs = differenceInSeconds(new Date(endedAt), new Date(startedAt))
  return formatDuration(secs)
}
