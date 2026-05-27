import type { InjectionKey, Ref, ComputedRef } from 'vue'

export type GamePhase = 'MENU' | 'PLAYING' | 'WIN'

export interface HeldPiece {
  pieceId: number
  fromGridIndex: number | null
}

export type DragTarget =
  | { type: 'grid'; index: number }
  | { type: 'basket' }

export interface ImageLoadResult {
  url: string
  img: HTMLImageElement
  ratio: number
}

export interface NailongImage {
  displayName: string
  imageUrl: string
  description: string
  audioUrl: string
}

export interface StartGamePayload {
  columns: number
  rows: number
  nailong: NailongImage
  imageRatio: number
}

export interface PuzzleAPI {
  GameState: { MENU: GamePhase; PLAYING: GamePhase; WIN: GamePhase }
  gameState: Ref<GamePhase>
  gridColumns: Ref<number>
  gridRows: Ref<number>
  grid: Ref<(number | null)[]>
  basket: Ref<number[]>
  heldPiece: Ref<HeldPiece | null>
  currentImage: Ref<NailongImage>
  imageRatio: Ref<number>
  moves: Ref<number>
  hasStarted: Ref<boolean>
  totalCells: ComputedRef<number>
  startGame: (columns: number, rows: number, image: NailongImage, imgRatio: number) => void
  restart: () => void
  backToMenu: () => void
  pickUpFromGrid: (pos: number) => void
  placeOnGrid: (pos: number) => void
  cancelHold: () => void
  pickUpFromBasket: (pieceId: number) => void
  dropIntoBasket: () => void
  checkWin: () => void
}

export interface ThemeAPI {
  currentPreset: Ref<string>
  customBgImage: Ref<string>
  presets: Record<string, Record<string, string>>
  applyPreset: (name: string) => void
  setCustomVar: (prop: string, value: string) => void
  setBgImage: (url: string) => void
  init: () => void
}

export interface DragDropAPI {
  isDragging: Ref<boolean>
  dragPosition: Ref<{ x: number; y: number }>
  hoverTarget: Ref<DragTarget | null>
  onTilePointerDown: (gridIndex: number, event: PointerEvent) => void
  onBasketPiecePointerDown: (pieceId: number, event: PointerEvent) => void
  onBasketBarPointerDown: (event: PointerEvent) => void
}

export const ThemeKey: InjectionKey<ThemeAPI> = Symbol('theme')
export const DragKey: InjectionKey<DragDropAPI> = Symbol('drag')
