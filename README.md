# hari-om@portfolio:~$

**Live:** https://sangamyo.github.io/terminal/

Interactive 3D developer portfolio for **Hari Om Kasaundhan**, AI Engineer and Software Engineer. A working terminal sits in front of a Three.js workspace with holographic project cards, a skill universe and a career timeline, in a deep-indigo "Midnight Aurora" palette (mint, sky blue and warm amber).

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # serve the build
```

Every push to `main` deploys to GitHub Pages (`.github/workflows/deploy.yml`).

## Edit your content

Everything you'd want to change lives in **`src/data/profile.js`**: links, skills, projects, timeline, education and the AI-core domains. The terminal, the HTML panels and the 3D scenes all read from it.

- **Résumé:** `public/resume.pdf`.
- **Contact form:** set `contactFormEndpoint` to a Formspree (or similar) URL that accepts JSON. Leave it empty to fall back to `mailto:`.
- **Links:** set a project's `github` / `live` URL to show its *GitHub* / *Live Demo* button; leave it `null` to hide the button.
- **Hologram:** a project's `visual` picks its 3D animation from `src/three/projectVisuals.jsx`.

## Projects shown

DataLens · PDF RAG Chat · RAG Chat (in-browser) · ATS Resume Checker · AI Desktop Assistant (Jarvis) · Ghibli Image Converter · SYNCRONET-AI · Hand Gesture Control · AlgoFlow Tracker · Robotics / VLA work at Addverb · Real-Time Face Detection. Each card links to its live demo and repository where one exists.

## Commands

`help` `about` `skills` `projects` `experience` `education` `github` `resume` `contact` `clear` `3d` `matrix` `ls` `home` `exit`

Hidden: `whoami` `neofetch` `sudo` `coffee` `secret` `history` `echo` `date`

Keys: ↑/↓ history · Tab autocomplete · Ctrl+L clear · Esc back to terminal · ←/→ cycle projects.

To add a command, add an entry to `src/terminal/commands.jsx`. `help` lists it automatically.

## Architecture

```
src/
  data/profile.js        all content (single source of truth)
  store/useStore.js      zustand: view, selections, quality, reduced-motion, command bus
  terminal/              engine (serial typed-output queue), commands, rich output blocks
  sections/              glass HTML panels per view (+ 3D-free fallbacks)
  three/                 lazy-loaded R3F scene
    layout.js            world anchors + camera stations per view
    CameraRig.jsx        damped camera flights, parallax, film-offset for panels, orbit mode
    AICore / DomainOrbit / SkillUniverse / ProjectGallery / Timeline / Workstation / ...
  ui/                    nav, digital rain, finale, lite background
```

- **The terminal drives everything.** Nav clicks and 3D clicks dispatch commands through `runCommand`, so the terminal log always reflects where you are.
- **Fast first paint.** three.js and R3F (~330 KB gzip) load in a separate chunk after the terminal is interactive (~130 KB gzip).
- **Adaptive quality.** `high` (bloom, depth of field, chromatic aberration, noise), `low` (bloom only), or `off`. Phones default to `off` and keep the full terminal experience with HTML panels. `PerformanceMonitor` steps quality down automatically on slow devices, and the 3D / FX toggles in the top bar let visitors choose.
- **Reduced motion.** The site respects `prefers-reduced-motion`: it skips typing animations, auto-rotation and parallax, and cuts camera moves short. Visitors can also toggle this with **FX**.
