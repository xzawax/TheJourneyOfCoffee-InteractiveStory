# The Journey of Coffee: From Bean to Cup

An interactive single-page infographic tracing the lifecycle of coffee — from origin farm to final cup. Built as a frontend assessment project.

---

## Quick Start

No build step. No dependencies to install. Open directly in a browser.

```bash
# Option 1 — just open the file
open index.html

# Option 2 — local server (recommended, required for the .glb to load)
npx serve .
# or 
# Just use xampp
```

> **Note:** The 3D coffee bean (`object/coffee_bean.glb`) will not load when opening `index.html` directly via `file://` due to browser CORS restrictions on local files. Use a local server for the full experience.

---

## File Structure

```
coffee-journey/
├── index.html              # Single-page entry point
├── css/
│   └── style.css           # All styles — mobile-first, CSS variables
├── js/
│   └── main.js             # All animations and interactions (GSAP + Three.js)
├── object/
│   └── coffee_bean.glb     # 3D coffee bean model (loaded by Three.js GLTFLoader)
└── README.md
```

---

## Sections

| # | ID | Content |
|---|---|---|
| 0 | `#section-hero` | Full-viewport opening with 3D bean, animated title |
| 1 | `#section-origin` | Where coffee grows — animated bean grid visual |
| 2 | `#section-harvest` | Hand-picking — floating cherry cluster |
| 3 | `#section-roasting` | Roast level selector — bean colour tween |
| 4 | `#section-brewing` | Brew methods — staggered card grid |
| 5 | `#section-cup` | Closing stat — count-up + steam animation |

---

## Interactions

**Three.js Hero (S0)**
- 3D coffee bean auto-spins on the Y axis with a gentle wobble
- Hover → pauses auto-spin, enables drag-to-rotate (OrbitControls)
- drag-to-rotate feature will be disabled at less than 900px width device.
- Mouse leave → resumes auto-spin from current rotation
- Touch-friendly: tap to enable drag, resets after 1.5s idle

**Roast Level Selector (S3)**
- Click Light / Medium / Dark button
- GSAP tweens the bean's background colour between roast shades
- Micro-bounce on the bean for tactile feedback
- `aria-pressed` state updates for accessibility

**Scroll Reveal (all sections)**
- Every section triggers a GSAP timeline on ScrollTrigger enter
- Stagger order: stage number → heading → body copy → stat card → visual

---

## Animations

| Animation | Trigger | Library |
|---|---|---|
| Hero title stagger | Page load | GSAP |
| Hero background parallax | Scroll (scrub) | GSAP ScrollTrigger |
| Scroll progress bar | Continuous scroll | GSAP ScrollTrigger |
| Stage nav dot activation | Section crosses 50% | GSAP ScrollTrigger |
| Section reveal timelines | Scroll enter | GSAP ScrollTrigger |
| Stat count-up (K / M / B) | Scroll enter, once | GSAP |
| Bean grid stagger pop-in | Scroll enter | GSAP ScrollTrigger |
| Cherry cluster float loop | Continuous | GSAP yoyo repeat |
| Roast bean colour tween | Click | GSAP |
| Brew cards stagger | Scroll enter | GSAP ScrollTrigger |
| Cup + steam entrance | Scroll enter | GSAP ScrollTrigger |
| Steam rise loop | Continuous | CSS keyframes |
| 3D bean spin + wobble | Continuous / hover | Three.js rAF |

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| GSAP | 3.12.5 | All scroll and entrance animations |
| ScrollTrigger | 3.12.5 | Scroll-driven triggers (GSAP plugin) |
| Three.js | r134 | 3D hero canvas |
| OrbitControls | r134 | Drag-to-rotate on 3D bean |
| GLTFLoader | r134 | Loads `coffee_bean.glb` |
| Google Fonts | — | Playfair Display + DM Sans |

All loaded via CDN — no bundler, no npm required.

---

## Responsive Breakpoints

| Breakpoint | Width | Changes |
|---|---|---|
| Mobile (base) | 375px+ | Single column, stacked sections |
| Tablet | 768px+ | Two-column brew grid, stage nav visible |
| Desktop | 1200px+ | Two-column split layouts, larger visual frames |

All type scales via `clamp()` — fluid between breakpoints, no layout jumps.

---

## Accessibility

- Semantic HTML throughout — `<section>`, `<article>`, `<nav>`, `<dl>` for specs
- Every section has `aria-labelledby` pointing to its `<h2>`
- Screen-reader-only full title on the hero (`<span class="sr-only">`)
- `aria-pressed` state on roast level buttons
- `aria-label` on all icon-only and decorative elements
- `prefers-reduced-motion` respected — all GSAP animations skip, CSS loops stop; content remains fully visible
- Keyboard-navigable dot nav with `:focus-visible` ring

---
*Frontend assessment project — built with GSAP, Three.js, and zero build tools.*


## Embedding
For the embed experience, it would be the same, but just showcase a quick embed experience.
the link will be /embed.html