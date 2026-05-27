import { MIN_GRID_SIZE } from '../config'

export function shuffleScatter(columns: number, rows: number): number[] {
  if (columns < MIN_GRID_SIZE || rows < MIN_GRID_SIZE) {
    throw new Error(`Grid size must be at least ${MIN_GRID_SIZE}`)
  }
  const total = columns * rows
  let pieces: number[]
  do {
    pieces = Array.from({ length: total }, (_, i) => i + 1)
    for (let i = pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pieces[i], pieces[j]] = [pieces[j], pieces[i]]
    }
  } while (pieces.every((v, i) => v === i + 1))
  return pieces
}
