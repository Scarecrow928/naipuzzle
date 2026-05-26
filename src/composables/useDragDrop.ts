import { ref } from 'vue'
import type { PuzzleAPI, DragTarget, DragDropAPI } from '../types'

const DRAG_THRESHOLD = 5

export function useDragDrop(puzzle: PuzzleAPI): DragDropAPI {
  const isDragging = ref(false)
  const dragArmed = ref(false)
  const dragPosition = ref({ x: 0, y: 0 })
  const hoverTarget = ref<DragTarget | null>(null)
  const startPosition = ref({ x: 0, y: 0 })
  const hadHeldBeforePointerDown = ref(false)

  function detectTarget(clientX: number, clientY: number) {
    const el = document.elementFromPoint(clientX, clientY)
    if (!el) { hoverTarget.value = null; return }

    const gridCell = el.closest('[data-grid-cell]') as HTMLElement | null
    if (gridCell) {
      const index = parseInt(gridCell.dataset.gridCell!)
      if (!isNaN(index)) {
        hoverTarget.value = { type: 'grid', index }
        return
      }
    }

    const basketEl = el.closest('[data-basket]')
    if (basketEl) {
      hoverTarget.value = { type: 'basket' }
      return
    }

    hoverTarget.value = null
  }

  function cleanup() {
    isDragging.value = false
    dragArmed.value = false
    hoverTarget.value = null
    document.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('pointerup', onPointerUp)
  }

  function onPointerMove(event: PointerEvent) {
    if (!dragArmed.value) return
    event.preventDefault()

    const dx = event.clientX - startPosition.value.x
    const dy = event.clientY - startPosition.value.y

    if (!isDragging.value && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
      isDragging.value = true
    }

    if (isDragging.value) {
      dragPosition.value = { x: event.clientX, y: event.clientY }
      detectTarget(event.clientX, event.clientY)
    }
  }

  function onPointerUp(event: PointerEvent) {
    if (!dragArmed.value) return

    if (isDragging.value) {
      if (hoverTarget.value?.type === 'grid') {
        puzzle.placeOnGrid(hoverTarget.value.index)
      } else if (hoverTarget.value?.type === 'basket') {
        puzzle.dropIntoBasket()
      } else {
        puzzle.cancelHold()
      }
    } else if (hadHeldBeforePointerDown.value && puzzle.heldPiece.value) {
      detectTarget(event.clientX, event.clientY)
      if (hoverTarget.value?.type === 'grid') {
        puzzle.placeOnGrid(hoverTarget.value.index)
      } else if (hoverTarget.value?.type === 'basket') {
        puzzle.dropIntoBasket()
      }
    }

    cleanup()
  }

  function onTilePointerDown(gridIndex: number, event: PointerEvent) {
    if (puzzle.gameState.value !== puzzle.GameState.PLAYING) return
    event.preventDefault()

    hadHeldBeforePointerDown.value = puzzle.heldPiece.value !== null
    startPosition.value = { x: event.clientX, y: event.clientY }

    if (!puzzle.heldPiece.value && puzzle.grid.value[gridIndex] != null) {
      puzzle.pickUpFromGrid(gridIndex)
    }

    dragArmed.value = true
    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', onPointerUp)
  }

  function onBasketPiecePointerDown(pieceId: number, event: PointerEvent) {
    if (puzzle.gameState.value !== puzzle.GameState.PLAYING) return
    if (puzzle.heldPiece.value) return
    event.preventDefault()

    hadHeldBeforePointerDown.value = false
    startPosition.value = { x: event.clientX, y: event.clientY }
    puzzle.pickUpFromBasket(pieceId)

    dragArmed.value = true
    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', onPointerUp)
  }

  function onBasketBarPointerDown(_event: PointerEvent) {
    if (puzzle.heldPiece.value) {
      puzzle.dropIntoBasket()
    }
  }

  return {
    isDragging,
    dragPosition,
    hoverTarget,
    onTilePointerDown,
    onBasketPiecePointerDown,
    onBasketBarPointerDown,
  }
}
