# DESIGN.md — The Silicon Revolution Brand Contract

## 1. Palette

### Core Theme
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#030303` | Page background, canvas backdrop |
| `--bg-surface` | `#0b0b0b` | Card surfaces, overlays |
| `--text-primary` | `#ffffff` | Body copy, headings |
| `--text-secondary` | `#a1a1aa` | Muted labels, meta text |
| `--text-tertiary` | `#52525b` | Captions, footnotes |
| `--accent-green` | `#00ff66` | Primary accent, hover highlights, scrollbar |
| `--border-subtle` | `rgba(255,255,255,0.06)` | Card borders, dividers |
| `--overlay-noise` | `0.025 opacity` | Fixed full-screen grain texture (mix-blend-mode: overlay) |

### Vendor Colors
| Vendor | Primary | Accent | CSS Variable |
|--------|---------|--------|--------------|
| NVIDIA | `#76B900` | `#00D4AA` | `--vendor-color`, `--vendor-accent` |
| AMD | `#ED1C24` | `#FF6900` | `--vendor-color`, `--vendor-accent` |
| Intel | `#0071C5` | `#00C7FD` | `--vendor-color`, `--vendor-accent` |

### Era Colorization
| Era | Border | Background | Radius |
|-----|--------|------------|--------|
| `blueprint` | `1px solid #00FF41` | `rgba(0,255,65,0.03)` | `0px` |
| `acceleration` | `2px solid var(--vendor-color)` | `color-mix(in srgb, var(--vendor-color) 5%, transparent)` | `4px` |
| `neural` | `0.5px solid rgba(255,255,255,0.06)` | `transparent` | `16px` |

## 2. Typography

### Font Stack
| Role | Family | Weights | Tracking |
|------|--------|---------|----------|
| Display (NVIDIA/Intel) | `Inter`, system-ui, sans-serif | `900`, `700` | `-0.03em` |
| Display (AMD) | `Space Grotesk`, system-ui, sans-serif | `800`, `600` | `-0.01em` |
| Monospace | `SF Mono`, `Cascadia Code`, `JetBrains Mono`, `Consolas`, monospace | `400`, `700` | `0.02em` |

### Type Scale
- Display: `clamp(2.5rem, 6vw, 5rem)`
- Heading: `clamp(1.75rem, 3.5vw, 3rem)`
- Body: `clamp(0.875rem, 1.2vw, 1.125rem)`

### Anti-aliasing
All text rendering uses `-webkit-font-smoothing: antialiased` (set on `body`). No subpixel rendering.

## 3. Spacing & Structure

### Layout Grid
| Breakpoint | Layout | Notes |
|------------|--------|-------|
| `< 768px` (mobile) | Single column stack | Canvas: fixed 40vh top; Content flows below |
| `768–1023px` (tablet) | `50fr 50fr` grid | Two equal columns |
| `>= 1024px` (desktop) | `1fr 1fr` grid | Balanced split; max-width: 36rem prose column |

### Containers
- `.layout-root`: `overflow-x: hidden`, `position: relative`
- `.split-canvas`: `position: fixed`, `inset: 0` (mobile), `position: sticky`, `height: 100vh` (desktop)
- `.split-content`: `content-visibility: auto`, `contain-intrinsic-size: 100vh`
- `.prose-column`: `max-width: 36rem`, `margin: auto`

### Component Spacing
- Section gaps: `16px` (`neural`), `6px` (`acceleration`), `2px` (`blueprint`)
- Capsule tag padding: `2px 6px` (desktop), `1px 4px` (mobile)
- Card hover transform: `scale(1.01)`
- Scrollbar: `6px` wide, `#222` track → `#00ff66` on hover

## 4. Animation

### Keyframes (defined in `animations.css`)
| Name | Duration | Easing | Purpose |
|------|----------|--------|---------|
| `fade-up` | `0.7s` | `ease-out` | Section entry |
| `weight-reveal` | `1s` | `cubic-bezier(0.16, 1, 0.3, 1)` | Hero title |
| `cinematic-in` | `1s` | `cubic-bezier(0.16, 1, 0.3, 1)` | Premium reveal |
| `stagger-up` | `0.6s` | `cubic-bezier(0.16, 1, 0.3, 1)` | List items |
| `segment-glow` | `2s` | `ease-in-out` | Performance bars |
| `wf-pulse` | `6s` | `ease-in-out` | WebGL fallback |
| `wf-drift` | `20s` | `linear` | Fallback particle drift |

### Reduced Motion
All animations respect `prefers-reduced-motion: reduce` (reset to `none`, `opacity: 1`, `transform: none`). Also respects `prefers-reduced-data: reduce`.

## 5. Accessibility

### Focus
- All interactive elements: `focus-visible` outline `2px solid var(--vendor-accent)` with `4px offset`
- Skip-to-content button: fixed at top, slides into view on focus
- Screen-reader-only class: `.sr-only` (standard clip-based pattern)

### ARIA
- GPU cards: `role="article"` + `aria-label` with GPU name
- Mobile nav: `aria-label="Chapter navigation"`, `role="navigation"`
- Announcer: `role="status"`, `aria-live="polite"`
- Share button: `aria-label="Share this page"`

## 6. Anti-Patterns (Forbidden)

1. **No absolute pixel offsets** — Use `rem`, `clamp()`, `fr`, or percentage-based values only. Avoid `left: 123px` or `margin-top: 42px`.
2. **No hardcoded spatial values** — All margins, padding, gaps must use CSS variables, clamp, or relative units. No `width: 300px` on components.
3. **No `unsafe-inline` in CSP script-src** — Use nonce-based inline scripts only. CSP is locked in `index.html`.
4. **No `console.log` / `debugger` in production** — Stripped by esbuild drop; do not add them.
5. **No explicit `height` on content containers** — Use `min-height`, `content-visibility: auto`, or `contain-intrinsic-size`.
6. **No service worker registration** — All existing SW registrations are unregistered on load.
7. **No inline `style` attributes in JSX** — Use Tailwind utility classes or CSS classes. Exception: dynamic vendor colors via CSS variables.
8. **No charting library dependencies** — Pure SVG for GraphifyView; all rendering uses native `<path>`, `<circle>`, `<line>`, `<text>` elements.

## 7. Component-to-Community Map

| Community ID | Name | Key Files |
|-------------|------|-----------|
| 0 | Chapter Components | `src/chapters/*.tsx`, `BentoGrid.tsx` |
| 1 | Error Boundaries & UI State | `ErrorBoundary.tsx`, `useScrollHash.ts`, `OfflineIndicator.tsx` |
| 2 | GPU Cards & Footer | `GPUCard.tsx`, `Footer.tsx`, `PortalOverlay.tsx` |
| 3 | 3D Chip Die & Camera Spline | `AMD_ChipletDie.tsx`, `CameraSpline.tsx`, `IridescentMaterial.ts` |
| 4 | Scene & 3D Rendering | `Scene.tsx`, `VendorScene.tsx`, `AmdScene.tsx` |
| 5 | Graphify Analytics | `GraphifyView.tsx`, `dataPipeline.ts`, `graphify.test.ts` |
| 6 | Audio Engine | `audioManager.ts`, `AudioToggle.tsx` |
| 7 | Particle System | `DataParticles.tsx`, `FluidSimulation.tsx` |
| 8 | Circuit & Rack Renderers | `CircuitBoard.tsx`, `NVLinkRack.tsx` |
| 9 | HTML Meta & SEO | `index.html` (meta, CSP, OG tags) |
| 10 | Hero & InView Hook | `Hero.tsx`, `useInView.ts` |
| 12 | Theme Toggle | `ThemeToggle.tsx` |
| 14 | Share Button | `ShareButton.tsx` |

---

*This contract is auto-synced with `.graphify/graph.json` (339 nodes, 20 communities). Update when the graph is rebuilt.*
