export function isSolved(grid: (number | null)[], total: number): boolean {
  for (let i = 0; i < total; i++) {
    if (grid[i] !== i + 1) return false
  }
  return true
}

export function gridIndexToRowCol(index: number, columns: number): { row: number; col: number } {
  return { row: Math.floor(index / columns), col: index % columns }
}
