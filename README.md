# The Silicon Valley Story

A scroll-driven visual chronicle of Silicon Valley — from sleepy orchards to the engine room of the world. Built with React 19, TypeScript 6, Vite 8, and Tailwind CSS 4.

## Stack

- **Framework:** React 19 with TypeScript 6
- **Build:** Vite 8
- **Styling:** Tailwind CSS 4
- **Visualizations:** Canvas 2D (custom)
- **Icons:** Lucide React
- **Testing:** Vitest + React Testing Library
- **PWA:** vite-plugin-pwa

## Development

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint check |
| `npm test` | Run Vitest |
| `npm run typecheck` | TypeScript type check |

## Structure

```
src/
  components/   — Reusable UI (Navbar, ParticleField, Viz*, etc.)
  chapters/     — Scroll sections (Hero, Ch01–Ch09, Endless)
  hooks/        — Custom React hooks (useInView, usePageVisible)
  constants/    — Shared data (chapters, nav)
  types/        — Shared TypeScript types
  utils/        — Utility functions (canvas helpers)
  styles/       — CSS animations
```
