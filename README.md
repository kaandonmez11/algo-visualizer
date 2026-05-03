# Algo Visualizer

A high-performance sorting algorithm visualizer built with React and Vite. Watch 26 algorithms come to life with smooth Canvas rendering, real-time audio feedback, and a head-to-head race mode.

![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)

---

## Features

### Visualization
- **Canvas-based renderer** — smooth 60fps bar chart, no DOM thrashing
- **Color-coded states** — yellow (comparing), red (swapping), teal (sorted)
- **Timeline scrubber** — drag to any point in the sort history and resume from there
- **Live stats** — comparison count, array access count, CPU time, elapsed time

### Audio
- **Web Audio API** — triangle-wave synthesizer, pitch mapped to element height across 3 octaves (200 Hz – 1600 Hz)
- **Smooth mute/unmute** — instant cut on mute, ~400ms fade-in on unmute
- **Throttled** — capped at ~200 notes/sec to prevent audio node explosion

### Race Mode
- Run **2–4 algorithms simultaneously** on the same array
- First to finish **pauses the others** automatically
- Shared timeline — scrub all panels in sync, resume each from the exact scrubbed position
- Algorithms that finished early **re-animate** if scrubbed back before their done frame

### Algorithms — 26 total

| Group | Algorithms |
|---|---|
| **Fastest** | Counting Sort, Pigeonhole Sort, Bucket Sort, Radix Sort |
| **Efficient** | Tim Sort, Intro Sort, Merge Sort, Quick Sort, Heap Sort, Shell Sort |
| **Classic** | Bubble Sort, Selection Sort, Insertion Sort |
| **Exotic** | Cocktail Shaker Sort, Gnome Sort, Comb Sort, Odd-Even Sort, Cycle Sort, Bitonic Sort, Strand Sort, Pancake Sort, Tree Sort |
| **Joke** | Bogo Sort, Stooge Sort, Sleep Sort, Stalin Sort |

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 19, Tailwind CSS 4 |
| Rendering | Canvas API (2D) |
| Computation | Web Workers — sorting never blocks the main thread |
| Audio | Web Audio API — OscillatorNode + GainNode |
| Build | Vite 8 |
| Icons | Lucide React |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## Architecture

```
src/
├── workers/
│   └── sortWorker.js       # All 26 algorithms — fast (CPU timing) + generator (animation) variants
├── components/
│   ├── CanvasRenderer.jsx  # requestAnimationFrame loop, reads refs directly (no re-renders)
│   ├── AlgoDropdown.jsx    # Grouped dropdown with custom scrollbar
│   ├── RaceGrid.jsx        # Race mode orchestrator — manages 2–4 RacePanel instances
│   └── RacePanel.jsx       # Single race lane — imperative API via forwardRef
├── utils/
│   └── audioManager.js     # Singleton AudioContext wrapper
└── App.jsx                 # Single-algorithm mode, controls, timeline
```

### How the animation pipeline works

1. **Worker** runs the sort generator, posting `compare` / `swap` / `sorted-index` / `done` messages at the configured delay.
2. **Main thread** receives messages, updates `arrayRef` and `highlightRef` (plain refs, no state).
3. **CanvasRenderer** runs a `requestAnimationFrame` loop reading those refs directly — zero React re-renders per frame.
4. Every `swap` message is pushed to a **history snapshot** array, enabling the timeline scrubber.
5. On scrub-resume, the worker fast-forwards synchronously through the generator (no `setTimeout`) to the target snapshot, then continues normally.

---

## Controls

| Control | Description |
|---|---|
| **Array Size** | Number of elements (10 – 500+) |
| **Delay** | Step delay in ms — set to 0 for instant CPU benchmark |
| **Array Type** | Random / Reversed / Nearly Sorted / Custom |
| **Custom Array** | Comma-separated custom values |
| **Timeline** | Drag while paused to scrub through sort history |
| **Sound** | Mute/unmute with fade |

---

## Notes

- **Stooge Sort** is O(n^2.7) — use array size < 30 or it will take a while.
- **Bogo Sort** is capped at 100 shuffle attempts, then force-sorts.
- **Stalin Sort** doesn't fully sort — it eliminates out-of-order elements. Eliminated bars drop to zero height visually.
- **Sleep Sort** simulates concurrent threads by processing elements in ascending value order.
- **Bitonic Sort** requires power-of-2 array sizes internally — padding is handled automatically.

---

## License

MIT
