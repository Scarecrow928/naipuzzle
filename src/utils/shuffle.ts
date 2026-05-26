export function shuffleScatter(columns: number, rows: number): number[] {
  const total = columns * rows
  const pieces = Array.from({ length: total }, (_, i) => i + 1)
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[pieces[i], pieces[j]] = [pieces[j], pieces[i]]
  }
  return pieces
}
