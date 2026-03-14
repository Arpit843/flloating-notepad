# ✦ Floating Notepad

A minimal, always-on-top notepad that lives above all your other windows. Built with Electron — transparent, frameless, and out of your way.

![Electron](https://img.shields.io/badge/Electron-latest-47848F?logo=electron&logoColor=white)
![License](https://img.shields.io/badge/license-ISC-lightgrey)

---

## Features

- **Always on top** — floats above every other window; toggle with the pin button
- **Multiple tabs** — keep separate notes open at once, rename them by double-clicking
- **Auto-save** — notes persist automatically via `localStorage`; no files to manage
- **Dark & light themes** — toggle with the sun/moon button; preference is remembered
- **Adjustable font size** — `A+` / `A−` controls in the status bar
- **Live word & character count** — shown in real time as you type
- **Keyboard-first** — full set of shortcuts for tab and window management
- **Transparent glass UI** — backdrop-blur background that blends with your desktop

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or later
- npm (bundled with Node.js)

### Install & Run

```bash
# 1. Clone or download the project
git clone https://github.com/your-username/floating-notepad.git
cd floating-notepad

# 2. Install dependencies
npm install

# 3. Launch
npm start
```

The notepad will open in the top-right corner of your screen.

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl/⌘ + T` | New tab |
| `Ctrl/⌘ + W` | Close current tab |
| `Ctrl + Tab` | Next tab |
| `Ctrl + Shift + Tab` | Previous tab |
| `Ctrl/⌘ + S` | Force save now |
| Double-click tab label | Rename tab |

---

## Project Structure

```
floating-notepad/
├── main.js          # Electron main process — window creation, IPC handlers
├── index.html       # App shell — markup and font imports
├── style.css        # All styling — themes, layout, animations
├── renderer.js      # App logic — tabs, auto-save, shortcuts, state
├── package.json
└── notes.txt        # Legacy flat-file (unused by current version)
```

---

## How It Works

**State management** — all notes, tab labels, font size, and theme are stored as a single JSON object in `localStorage` under the key `floating-notepad-v3`. State is read on startup and written automatically 800 ms after the last keystroke (debounced).

**IPC** — the renderer sends messages to the main process via Electron's `ipcRenderer`/`ipcMain` for actions that require OS-level access: closing the window, minimising, and toggling always-on-top. The current pin state is sent back to the renderer so the button reflects reality.

**Theming** — a single `.light` class on `<body>` switches a set of CSS custom properties. Everything else adapts automatically — no duplicated rules.

---

## Customisation

Tweak the defaults near the top of `renderer.js`:

```js
let state = {
  fontSize: 14,   // starting font size in px
  theme: 'dark',  // 'dark' or 'light'
  // ...
};
```

Window size and starting position live in `main.js`:

```js
mainWindow = new BrowserWindow({
  width: 340,
  height: 480,
  x: width - 360,  // distance from right edge of screen
  y: 40,           // distance from top of screen
});
```

---

## Building for Distribution

Use [electron-forge](https://www.electronforge.io/) to package the app into an `.exe`, `.dmg`, or `.AppImage`.

```bash
npm install --save-dev @electron-forge/cli
npx electron-forge import
npm run make
```

---

## License

ISC — do whatever you like with it.
