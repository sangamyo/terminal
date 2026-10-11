# Hari Om Kasaundhan — portfolio

**Live:** https://sangamyo.github.io/terminal/

A portfolio set in a small 3D studio. Each object on the desk opens a section: the monitor shows projects, the robot arm opens experience, the pinboard skills, the shelf education, the notepad contact and the name plate the about page. The lamp switches the room between day and night (it starts with the visitor's local time). Phones, browsers without WebGL and anyone who prefers it get the same content as one readable page.

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # serve the build
```

Every push to `main` deploys to GitHub Pages (`.github/workflows/deploy.yml`).

## Edit your content

Everything lives in **`src/data/profile.js`**: links, projects, skills, timeline and education. The 3D room, the panels, the simple page, the command menu and the terminal all read from it.

- **Résumé:** `public/resume.pdf`.
- **Project screenshots:** `public/shots/<name>.jpg` (1280×800), referenced by a project's `shot`. Projects without one get a typeset title card on the monitor.
- **Links:** set a project's `github` / `live` URL to show its button; leave it `null` to hide it.
- **Contact form:** set `contactFormEndpoint` to a Formspree (or similar) URL that accepts JSON. Empty falls back to `mailto:`.

## Keys

`⌘K` / `Ctrl+K` / `/` command menu · `Esc` back to the desk · `←/→` flip projects on the monitor · `` ` `` terminal.

The terminal keeps the old commands (`help`, `whoami`, `neofetch`, `projects`, `skills`, `3d`, …). Add one in `src/terminal/commands.jsx`; `help` lists it automatically.

## Architecture

```
src/
  data/profile.js        all content
  store/useStore.js      zustand: view, day/night, palette + terminal, selections, quality
  three/                 lazy-loaded R3F scene (its own chunk)
    layout.js            object positions + a camera station per view
    CameraRig.jsx        damped camera moves, parallax, film offset beside the HTML
    Room / Desk / Monitor / RobotArm / Lamp / WallPieces
    Hotspot.jsx          hover tag + click-to-open for desk objects
    textures.js          procedural wood, floor, plaster and cork (no image files)
  sections/              panel content shared by the 3D view and the simple page
  ui/                    top bar, command menu, icons
  terminal/              the terminal drawer
  styles/site.css        design tokens (day/night), layout, components
```

- **Fast first paint.** The text and UI load first. three.js arrives in a separate chunk after the first paint.
- **No downloaded 3D assets.** Every object is built from primitives, textures are drawn on canvases, and reflections come from light panels, so there's nothing to license and very little to load.
- **Robot arm.** The arm runs a pick-and-place loop with two-link inverse kinematics, so the wrist keeps the gripper vertical.
- **Adaptive quality.** Phones default to the simple page, and `PerformanceMonitor` lowers resolution on slow devices.
- **Accessibility.** The site respects `prefers-reduced-motion` (no camera glides, no parallax, the arm stays still), every section is reachable from the keyboard, and the 3D canvas is `aria-hidden` because all its content is in the HTML.

Fonts: Newsreader and IBM Plex (self-hosted via Fontsource).
