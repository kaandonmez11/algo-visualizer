# CLAUDE.md - Global Context & Guidelines

## Project Context
You are building the "Ultimate Sorting Visualizer", a high-performance, modern React+Vite application.
The app features Web Workers for computing large arrays (50k+ elements), Canvas API for rendering smoothly, 1-to-4 simultaneous algorithm comparison mode, and a Web Audio API engine for sound effects.

## Token Optimization & Modularity Rules
1. **Never read the entire codebase.** Only read the files strictly necessary for the current Sprint.
2. **Strict Modularity:** Keep UI components, State (Zustand), and Web Workers completely decoupled.
3. **Do not hallucinate large rewrites.** If changing a component, modify only the relevant lines.
4. **Use `npm run dev` to test.** If instructed, start the server so the user can test the UI in their browser.

## Custom Commands (Skills)
- `npm run dev` - Start the local development server.
- `npm run lint` - Run ESLint.

## Code Style
- Use React Functional Components with Hooks.
- Styling must use Tailwind CSS with modern 'glassmorphism' and 'dark mode' aesthetics.
- ALL animations and transitions MUST be smooth (`ease-in-out`, `transition-all`, etc.). No sharp changes.
- Web Workers must be used for all sorting calculations to prevent main thread blocking.
