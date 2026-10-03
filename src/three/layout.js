import { Vector3 } from 'three'
import { projects, timeline } from '../data/profile'

export const FONT_MONO = '/fonts/jetbrains-mono-latin-500-normal.woff'
export const FONT_DISPLAY = '/fonts/space-grotesk-latin-700-normal.woff'

/** World-space anchor of every section. The AI core sits at the origin. */
export const ANCHORS = {
  core: [0, 0, 0],
  about: [-20, 0, -6],
  skills: [0, 0.5, -28],
  projects: [22, 0, -6],
  experience: [0, 0, 26],
  education: [-22, 8, -31],
  contact: [22, 8, -31],
}

const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]

/* ---------- project gallery: a gentle arc of holo cards ---------- */
const PROJECT_SPACING = 4.6
export function projectPosition(i) {
  const offset = (i - (projects.length - 1) / 2) * PROJECT_SPACING
  return add(ANCHORS.projects, [offset, 0, -0.02 * offset * offset])
}
export function projectRotation() {
  return [0, 0, 0] // cards face the camera square-on; the z-arc alone gives depth
}

/* ---------- timeline: chronological left→right as seen from the camera (looking +z) ---------- */
export function timelinePosition(i) {
  const n = timeline.length
  const span = 15
  const x = span / 2 - (i * span) / Math.max(1, n - 1)
  return add(ANCHORS.experience, [x, Math.sin(i * 1.3) * 0.6, Math.cos(i * 0.9) * 1.2])
}

/** Camera position + look target per view. Some depend on the current selection. */
export function stationFor(state) {
  switch (state.view) {
    case 'about':
      return { pos: [-16.4, 1.9, 0.2], target: add(ANCHORS.about, [0, 0.9, 0]) }
    case 'skills':
      return { pos: [0, 1.3, -15.4], target: ANCHORS.skills }
    case 'projects': {
      // Straight down +z: neighbours stay visible to the sides and never sit between camera and card.
      const p = projectPosition(state.projectIndex)
      return { pos: add(p, [0, 0.3, 8.2]), target: add(p, [0, 0.1, 0]) }
    }
    case 'experience': {
      const p = timelinePosition(state.timelineIndex)
      return { pos: [p[0] * 0.55, 2.4, ANCHORS.experience[2] - 9.5], target: p }
    }
    case 'education':
      return { pos: [-16.6, 9.4, -22.6], target: ANCHORS.education }
    case 'contact':
      return { pos: [16.6, 9.4, -22.6], target: ANCHORS.contact }
    case 'immersive':
      return { pos: [0, 3.2, 14], target: ANCHORS.core }
    default:
      return { pos: [0, 0.7, 12.5], target: [0, 0.3, 0] }
  }
}

/** Views that show an HTML panel on the right — the camera shifts so the 3D subject sits left of it. */
export const PANEL_VIEWS = new Set(['about', 'skills', 'projects', 'experience', 'education', 'contact'])

/** Shared, mutable focus point (camera look target) — read by depth of field & lighting. */
export const focusPoint = new Vector3()

/** Global pointer in NDC (-1..1), tracked on window so parallax works over HTML overlays too. */
export const globalPointer = { x: 0, y: 0 }
if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointermove',
    (e) => {
      globalPointer.x = (e.clientX / window.innerWidth) * 2 - 1
      globalPointer.y = -(e.clientY / window.innerHeight) * 2 + 1
    },
    { passive: true },
  )
}
