# naipuzzle

A modern scatter-and-place puzzle game built with Vue 3 + TypeScript + Vite + TailwindCSS.

## Features

- Scatter-and-place puzzle with basket (暂存区) — easier than classic sliding puzzles
- Click-to-select or drag-and-drop to move pieces
- Multiple grid sizes: 4×4, 5×5, or custom (2–10)
- Image sources: default, local upload, or remote URL
- Board aspect ratio matches source image
- Theme system with 4 presets (Dark, Light, Forest, Ocean)
- Fully customizable colors, background, blur, and opacity
- Responsive: desktop, tablet, and mobile
- Timer and move counter
- Pure static deployment — no backend required

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Build

```bash
npm run build
```

Output goes to `dist/`. TypeScript type checking runs as part of the build.

## Type Check Only

```bash
npm run typecheck
```

## Deploy

Output in `dist/` can be deployed to any static host.

### GitHub Pages

This project is configured for GitHub Pages at:

**https://scarecrow928.github.io/naipuzzle/**

The Vite config uses `base: '/naipuzzle/'` so all asset paths are prefixed correctly.
Pushes to `master` automatically deploy via `.github/workflows/deploy.yml`.

### Other Hosts

- [Cloudflare Pages](https://pages.cloudflare.com/): set build command to `npm run build`, output to `dist/`
- [Netlify](https://www.netlify.com/): same settings
- Any static file server (nginx, Apache, etc.)

## Project Structure

```
naipuzzle/
├── .github/workflows/
│   └── deploy.yml               # GitHub Pages auto-deploy
├── public/
│   └── assets/
│       └── default.jpg           # Default puzzle image
├── src/
│   ├── components/
│   │   ├── App.vue               # Root component & game orchestration
│   │   ├── BackgroundLayer.vue   # Theme-aware background
│   │   ├── BasketBar.vue         # Collapsible piece basket
│   │   ├── MainMenu.vue          # Start screen (size, image, theme)
│   │   ├── PuzzleBoard.vue       # Dynamic-aspect-ratio puzzle board
│   │   ├── PuzzleTile.vue        # Single tile with sliced background
│   │   ├── ThemePanel.vue        # Theme customization panel
│   │   ├── TopBar.vue            # Timer, moves, held piece, restart
│   │   └── WinOverlay.vue        # Win screen with stats & animation
│   ├── composables/
│   │   ├── useAudio.ts           # Audio playback
│   │   ├── useDragDrop.ts        # Pointer-event drag-and-drop engine
│   │   ├── usePuzzle.ts          # Game state machine & logic
│   │   ├── useTheme.ts           # CSS variable theme engine
│   │   └── useTimer.ts           # MM:SS timer
│   ├── utils/
│   │   ├── format.ts             # Time formatting
│   │   ├── imageLoader.ts        # File & URL image loading with ratio
│   │   ├── puzzleMath.ts         # Solved-check & grid utilities
│   │   └── shuffle.ts            # Solvable scatter shuffle
│   ├── styles/
│   │   ├── animations.css        # Keyframes & utility classes
│   │   ├── base.css              # Reset, global styles, Tailwind
│   │   └── theme.css             # CSS variable definitions
│   ├── config.ts                 # Grid size limits
│   ├── env.d.ts                  # Vite & Vue SFC type declarations
│   ├── main.ts                   # App entry point
│   └── types.ts                  # Shared TypeScript types & InjectionKeys
├── index.html                    # HTML shell
├── tsconfig.json                 # TS build mode references
├── tsconfig.app.json             # App source TS config
├── tsconfig.node.json            # Vite config TS config
├── vite.config.ts                # Vite + Vue + Tailwind + base path
└── package.json
```

## Tech Stack

- **Vue 3** (Composition API, `<script setup lang="ts">`)
- **TypeScript** (strict mode, `vue-tsc` type checking)
- **Vite** (with `base: '/naipuzzle/'` for GitHub Pages)
- **TailwindCSS v4**
- **CSS Variables** for theming
- No router, no Pinia, no backend — single-page state machine
