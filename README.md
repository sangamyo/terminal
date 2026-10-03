# hariom@portfolio:~$

Interactive 3D developer portfolio for **Hariom Kasaundhan**. A working terminal sits in front of a Three.js workspace.

> Don't just read my resume. Explore my system.

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # serve the build
```

Deploy `dist/` to any static host (Vercel, Netlify, GitHub Pages, Cloudflare Pages).

## Edit your content

Everything you'd want to change lives in **`src/data/profile.js`**: links, skills, projects, timeline, education and the AI-core domains. The terminal, the HTML panels and the 3D scenes all read from it. Search that file for `TODO` to find the placeholders.

- **Resume:** put your PDF at `public/resume.pdf`.
- **Contact form:** set `contactFormEndpoint` to a Formspree (or similar) URL that accepts JSON. Leave it empty to fall back to `mailto:`.
- **Live demos:** set a project's `live` URL to show the *Live Demo* button.

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
- **Fast first paint.** three.js and R3F (~330 KB gzip) load in a separate chunk after the terminal is interactive (~127 KB gzip).
- **Adaptive quality.** `high` (bloom, depth of field, chromatic aberration, noise), `low` (bloom only), or `off`. Phones default to `off` and keep the full terminal experience with HTML panels. `PerformanceMonitor` steps quality down automatically on slow devices, and the 3D / FX toggles in the top bar let visitors choose.
- **Reduced motion.** The site respects `prefers-reduced-motion`: it skips typing animations, auto-rotation and parallax, and cuts camera moves short. Visitors can also toggle this with **FX**.
# terminal
