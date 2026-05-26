<script setup lang="ts">
import { computed, watch, onMounted, provide } from 'vue'
import { usePuzzle } from './composables/usePuzzle'
import { useTimer } from './composables/useTimer'
import { useTheme } from './composables/useTheme'
import { useAudio } from './composables/useAudio'
import { useDragDrop } from './composables/useDragDrop'
import { gridIndexToRowCol } from './utils/puzzleMath'
import { ThemeKey, DragKey, type StartGamePayload } from './types'
import BackgroundLayer from './components/BackgroundLayer.vue'
import MainMenu from './components/MainMenu.vue'
import TopBar from './components/TopBar.vue'
import PuzzleBoard from './components/PuzzleBoard.vue'
import BasketBar from './components/BasketBar.vue'
import WinOverlay from './components/WinOverlay.vue'

const puzzle = usePuzzle()
const timer = useTimer()
const theme = useTheme()
const audio = useAudio()
const drag = useDragDrop(puzzle)

provide(ThemeKey, theme)
provide(DragKey, drag)

onMounted(() => {
  theme.init()
})

watch(puzzle.hasStarted, (started) => {
  if (started) {
    timer.elapsedSeconds.value = 0
    timer.running.value = true
  }
})

watch(puzzle.gameState, (state) => {
  if (state === puzzle.GameState.WIN) {
    timer.running.value = false
    audio.playWin()
  }
  if (state === puzzle.GameState.MENU) {
    timer.reset()
  }
})

function handleStart({ columns, rows, imageUrl, imageRatio }: StartGamePayload) {
  puzzle.startGame(columns, rows, imageUrl, imageRatio)
}

function handleRestart() {
  puzzle.restart()
  timer.reset()
}

function handleBackToMenu() {
  puzzle.backToMenu()
  timer.reset()
}

function handleCancelHold() {
  puzzle.cancelHold()
}

const dragCloneStyle = computed(() => {
  if (!drag.isDragging.value || !puzzle.heldPiece.value || !puzzle.imageUrl.value) return {}
  const pieceId = puzzle.heldPiece.value.pieceId
  const cols = puzzle.gridColumns.value
  const rows = puzzle.gridRows.value
  const { row, col } = gridIndexToRowCol(pieceId - 1, cols)
  const pctX = (col / (cols - 1)) * 100
  const pctY = (row / (rows - 1)) * 100
  return {
    left: drag.dragPosition.value.x + 'px',
    top: drag.dragPosition.value.y + 'px',
    backgroundImage: `url(${puzzle.imageUrl.value})`,
    backgroundSize: `${cols * 100}% ${rows * 100}%`,
    backgroundPosition: `${pctX}% ${pctY}%`,
  }
})
</script>
<template>
  <BackgroundLayer />
  <div class="app-container">
    <MainMenu
      v-if="puzzle.gameState.value === puzzle.GameState.MENU"
      @start="handleStart"
    />

    <template v-if="puzzle.gameState.value === puzzle.GameState.PLAYING || puzzle.gameState.value === puzzle.GameState.WIN">
      <TopBar
        :elapsedSeconds="timer.elapsedSeconds.value"
        :moves="puzzle.moves.value"
        :heldPiece="puzzle.heldPiece.value"
        :imageUrl="puzzle.imageUrl.value"
        :gridColumns="puzzle.gridColumns.value"
        :gridRows="puzzle.gridRows.value"
        :isDragging="drag.isDragging.value"
        @restart="handleRestart"
        @back-to-menu="handleBackToMenu"
        @cancel-hold="handleCancelHold"
      />
      <div class="board-area">
        <PuzzleBoard
          :grid="puzzle.grid.value"
          :gridColumns="puzzle.gridColumns.value"
          :gridRows="puzzle.gridRows.value"
          :imageUrl="puzzle.imageUrl.value"
          :imageRatio="puzzle.imageRatio.value"
          :heldPiece="puzzle.heldPiece.value"
        />
      </div>
      <BasketBar
        :basket="puzzle.basket.value"
        :gridColumns="puzzle.gridColumns.value"
        :gridRows="puzzle.gridRows.value"
        :imageUrl="puzzle.imageUrl.value"
        :heldPiece="puzzle.heldPiece.value"
      />
    </template>

    <WinOverlay
      v-if="puzzle.gameState.value === puzzle.GameState.WIN"
      :elapsedSeconds="timer.elapsedSeconds.value"
      :moves="puzzle.moves.value"
      @back-to-menu="handleBackToMenu"
    />
  </div>

  <div
    v-if="drag.isDragging.value && puzzle.heldPiece.value"
    class="drag-clone"
    :style="dragCloneStyle"
  ></div>
</template>
<style scoped>
.app-container {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.board-area {
  flex: 1;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 0 8px;
}
.drag-clone {
  position: fixed;
  z-index: 200;
  pointer-events: none;
  width: 56px;
  height: 56px;
  border-radius: var(--tile-radius);
  transform: translate(-50%, -50%) scale(1.08);
  box-shadow: 0 8px 24px rgba(0,0,0,0.4), 0 0 12px rgba(var(--color-primary-rgb), 0.3);
  transition: none;
  background-repeat: no-repeat;
}
</style>
