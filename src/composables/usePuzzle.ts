import { ref, computed } from 'vue'
import { shuffleScatter } from '../utils/shuffle'
import { isSolved } from '../utils/puzzleMath'
import type { PuzzleAPI, GamePhase, HeldPiece, NailongImage } from '../types'

export const GameState: { MENU: GamePhase; PLAYING: GamePhase; WIN: GamePhase } = {
  MENU: 'MENU',
  PLAYING: 'PLAYING',
  WIN: 'WIN',
}

const defaultNailongImage: NailongImage = {
  displayName: '',
  imageUrl: '',
  description: '',
  audioUrl: '',
}

export function usePuzzle(): PuzzleAPI {
  const gameState = ref<GamePhase>(GameState.MENU)
  const gridColumns = ref(4)
  const gridRows = ref(4)
  const grid = ref<(number | null)[]>([])
  const basket = ref<number[]>([])
  const heldPiece = ref<HeldPiece | null>(null)
  const currentImage = ref<NailongImage>({ ...defaultNailongImage })
  const imageRatio = ref(1)
  const moves = ref(0)
  const hasStarted = ref(false)

  const initialGridSnapshot = ref<(number | null)[] | null>(null)

  const totalCells = computed(() => gridColumns.value * gridRows.value)

  function startGame(columns: number, rows: number, image: NailongImage, imgRatio: number) {
    gridColumns.value = columns
    gridRows.value = rows
    currentImage.value = image
    imageRatio.value = imgRatio
    const scattered = shuffleScatter(columns, rows)
    grid.value = [...scattered]
    basket.value = []
    heldPiece.value = null
    initialGridSnapshot.value = [...scattered]
    moves.value = 0
    hasStarted.value = false
    gameState.value = GameState.PLAYING
  }

  function restart() {
    if (!initialGridSnapshot.value) return
    grid.value = [...initialGridSnapshot.value]
    basket.value = []
    heldPiece.value = null
    moves.value = 0
    hasStarted.value = false
    gameState.value = GameState.PLAYING
  }

  function backToMenu() {
    gameState.value = GameState.MENU
    hasStarted.value = false
    grid.value = []
    basket.value = []
    heldPiece.value = null
    initialGridSnapshot.value = null
    moves.value = 0
  }

  function checkWin() {
    if (heldPiece.value !== null) return
    if (basket.value.length > 0) return
    if (isSolved(grid.value, totalCells.value)) {
      gameState.value = GameState.WIN
    }
  }

  function markFirstMove() {
    if (!hasStarted.value) {
      hasStarted.value = true
    }
  }

  function pickUpFromGrid(pos: number) {
    if (heldPiece.value !== null) return
    if (gameState.value !== GameState.PLAYING) return
    const pieceId = grid.value[pos]
    if (pieceId == null) return

    heldPiece.value = { pieceId, fromGridIndex: pos }
    const newGrid = [...grid.value]
    newGrid[pos] = null
    grid.value = newGrid

    markFirstMove()
  }

  function placeOnGrid(pos: number) {
    if (heldPiece.value === null) return
    if (gameState.value !== GameState.PLAYING) return

    const hp = heldPiece.value

    if (hp.fromGridIndex === pos) {
      cancelHold()
      return
    }
    const newGrid = [...grid.value]
    const targetPiece = newGrid[pos]

    if (targetPiece === null) {
      newGrid[pos] = hp.pieceId
      moves.value++
    } else {
      basket.value = [...basket.value, targetPiece]
      newGrid[pos] = hp.pieceId
      moves.value++
    }

    grid.value = newGrid
    heldPiece.value = null
    markFirstMove()
    checkWin()
  }

  function cancelHold() {
    if (heldPiece.value === null) return
    const hp = heldPiece.value
    if (hp.fromGridIndex !== null) {
      const newGrid = [...grid.value]
      newGrid[hp.fromGridIndex] = hp.pieceId
      grid.value = newGrid
    } else {
      basket.value = [...basket.value, hp.pieceId]
    }
    heldPiece.value = null
  }

  function pickUpFromBasket(pieceId: number) {
    if (heldPiece.value !== null) return
    if (gameState.value !== GameState.PLAYING) return
    basket.value = basket.value.filter(id => id !== pieceId)
    heldPiece.value = { pieceId, fromGridIndex: null }
    markFirstMove()
  }

  function dropIntoBasket() {
    if (heldPiece.value === null) return
    basket.value = [...basket.value, heldPiece.value.pieceId]
    heldPiece.value = null
  }

  return {
    GameState,
    gameState,
    gridColumns,
    gridRows,
    grid,
    basket,
    heldPiece,
    currentImage,
    imageRatio,
    moves,
    hasStarted,
    totalCells,
    startGame,
    restart,
    backToMenu,
    pickUpFromGrid,
    placeOnGrid,
    cancelHold,
    pickUpFromBasket,
    dropIntoBasket,
    checkWin,
  }
}
