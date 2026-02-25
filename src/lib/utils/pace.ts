export function calcPace(distanceKm: number, durationSec: number): number | null {
  if (distanceKm <= 0) return null
  return durationSec / distanceKm
}

export function formatPace(secPerKm: number): string {
  const mins = Math.floor(secPerKm / 60)
  const secs = Math.round(secPerKm % 60).toString().padStart(2, '0')
  return `${mins}:${secs} /km`
}

export function parseDuration(hours: number, minutes: number, seconds: number): number {
  return hours * 3600 + minutes * 60 + seconds
}

export function splitDuration(totalSec: number): { hours: number; minutes: number; seconds: number } {
  const hours = Math.floor(totalSec / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60
  return { hours, minutes, seconds }
}
