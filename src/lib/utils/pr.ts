/** Epley formula for estimated 1 rep max */
export function epley1RM(weightKg: number, reps: number): number {
  if (reps === 1) return weightKg
  return Math.round(weightKg * (1 + reps / 30) * 10) / 10
}
