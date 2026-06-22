# Emerald Checkers

A mobile checkers game built with React + TypeScript + Capacitor for iOS.
Supports Russian rules (8×8) and International rules (10×10), PvP and vs AI.

---

## Stack

- **React 18** + **TypeScript** + **Vite 5**
- **Zustand 5** — state management
- **Capacitor 7** — iOS native wrapper
- **Tailwind CSS 3** — utility styles

---

## Run in browser (web dev)

Requires **Node.js 18+**.

```bash
# Install dependencies (first time only)
npm install

# Start dev server
npm run dev
```

Open `http://localhost:5173` in the browser.
The app is designed for a phone screen — set browser devtools to mobile view (e.g. iPhone 14 Pro, 390×844).

---

## Build for web

```bash
npm run build
```

Output goes to `dist/`. Preview the production build:

```bash
npm run preview
```

---

## Build for iOS (requires macOS + Xcode)

```bash
# 1. Build the web app
npm run build

# 2. Sync web assets into the iOS project
npx cap sync ios

# 3. Open in Xcode
npx cap open ios
```

Then in Xcode:
- Select your Apple developer account in **Signing & Capabilities**
- Choose target device or simulator
- Press **Run** (⌘R) or **Product → Archive** for App Store submission

---

## Project structure

```
src/
  engine/
    boardFactory.ts     — board initialization
    moveValidator.ts    — move rules (Russian + International)
    aiEngine.ts         — minimax with alpha-beta pruning
  models/
    types.ts            — all TypeScript types
  store/
    gameStore.ts        — Zustand game state
  views/
    Home/               — home screen
    Game/               — board + HUD
    Settings/           — settings screen
    Stats/              — statistics screen
  i18n.ts               — EN / RU / ES translations

ios/                    — Capacitor iOS project (Xcode)
docs/
  privacy/              — Privacy Policy page (GitHub Pages)
  appstore-listing.md   — App Store metadata (EN + RU)
  appstore/             — App Store screenshots
public/
  logo.png              — app icon (transparent PNG)
```

---

## Game rules

| Feature | Russian 8×8 | International 10×10 |
|---|---|---|
| Men move | Forward only | Forward only |
| Men capture | All 4 directions | All 4 directions |
| King moves | Any distance (flying) | Any distance (flying) |
| Captures mandatory | Yes | Yes |
| Majority capture | No | Yes — must take max pieces |
| Promotion mid-chain | Stops chain, piece promoted | Stops chain, piece promoted |

---

## Privacy Policy

Hosted on GitHub Pages: `https://qa-urbanovics.github.io/checkers/privacy/`
