# Checkers App — Project Documentation

## Project Goal
iOS checkers game, developed as a web app (React) and packaged for App Store via Capacitor.

## Tech Stack
- **Vite 5** + **React 18** + **TypeScript** — core framework
- **Tailwind CSS 3** — styling
- **Zustand** — global state management (with localStorage persistence)
- **Capacitor** (future) — iOS packaging for App Store

## Development
- Develop on Windows, preview in browser at `localhost:5173`
- Build for iOS on Mac with Capacitor

## Commands
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
```

## Game Features
- [x] 8x8 board (Russian rules)
- [x] 10x10 board (International rules)
- [x] 1v1 local multiplayer (PvP)
- [x] vs AI (Easy / Medium / Hard)
- [x] Mandatory capture rule
- [x] King promotion
- [x] Move highlighting
- [x] Game over detection
- [x] Statistics persistence
- [x] Settings (sound, haptic, themes, language)
- [ ] Chain capture (multi-jump) — in progress
- [ ] Undo move
- [ ] Sound effects
- [ ] Haptic feedback (Capacitor)
- [ ] Board themes (wood, marble)
- [ ] Animations (CSS transitions)

## AI Algorithm
- Minimax with Alpha-Beta pruning
- Easy: depth 1, 40% random moves
- Medium: depth 3, standard heuristic
- Hard: depth 6, advanced position evaluation

## File Structure
```
src/
├── models/types.ts          — all TypeScript types
├── engine/
│   ├── boardFactory.ts      — board creation, piece setup
│   ├── moveValidator.ts     — move generation, validation, application
│   └── aiEngine.ts          — Minimax AI
├── store/gameStore.ts       — Zustand store (game state + settings + stats)
├── views/
│   ├── Home/                — HomeScreen, ModeSelect, BoardSelect, Difficulty
│   ├── Game/                — GameScreen, BoardView, CellView, PieceView, GameHUD
│   ├── Settings/            — SettingsScreen
│   └── Stats/               — StatsScreen
└── App.tsx                  — Router / screen switcher
```

## iOS Publishing Plan
1. Add Capacitor: `npm install @capacitor/core @capacitor/ios`
2. Init: `npx cap init`
3. Build: `npm run build`
4. Add iOS: `npx cap add ios`
5. Sync: `npx cap sync`
6. Open Xcode: `npx cap open ios`
7. Configure signing, icons, splash screen
8. Submit to App Store Connect

## Node Version Note
Node v21.5.0 is in use. Some EBADENGINE warnings appear but do not affect functionality.
Recommend upgrading to Node 22+ for future work.
