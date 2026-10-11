import { Vector3 } from 'three'
import { asset } from '../lib/assets'

export { asset }

export const FONT_SERIF = asset('fonts/newsreader-latin-500-normal.woff')
export const FONT_SERIF_ITALIC = asset('fonts/newsreader-latin-400-italic.woff')
export const FONT_SANS = asset('fonts/ibm-plex-sans-latin-500-normal.woff')
export const FONT_MONO = asset('fonts/ibm-plex-mono-latin-500-normal.woff')

/* Units are metres. The desk stands against the back wall; the window is on the left wall. */
export const DESK_Y = 0.75
export const DESK = { x: 0, z: -0.75, w: 2.2, d: 0.8 }
export const WALL_Z = -1.2
export const LEFT_WALL_X = -2.4

/** Where each object sits (group origins). */
export const SPOTS = {
  monitor: [0.12, DESK_Y, -0.92],
  keyboard: [0.08, DESK_Y, -0.53],
  mouse: [0.43, DESK_Y, -0.52],
  robot: [-0.66, DESK_Y, -0.86],
  notepad: [-0.34, DESK_Y, -0.52],
  nameplate: [0.74, DESK_Y, -0.46],
  mug: [0.6, DESK_Y, -0.84],
  lamp: [0.93, DESK_Y, -1.0],
  shelf: [-0.62, 1.74, WALL_Z],
  pinboard: [0.94, 1.7, WALL_Z],
  clock: [-1.62, 2.22, WALL_Z],
  plant: [1.62, 0, -0.86],
  window: [LEFT_WALL_X, 1.6, -0.15],
}

/** Camera position + look target for every view. */
const STATIONS = {
  home: { pos: [1.05, 1.55, 2.75], target: [0.12, 1.16, -0.8] },
  about: { pos: [1.02, 1.0, 0.12], target: [0.74, 0.82, -0.46] },
  projects: { pos: [0.12, 1.185, 0.02], target: [0.12, 1.17, -0.92] },
  experience: { pos: [-0.22, 1.2, 0.04], target: [-0.66, 0.97, -0.84] },
  skills: { pos: [0.94, 1.69, 0.14], target: [0.94, 1.7, WALL_Z] },
  education: { pos: [-0.62, 1.66, 0.02], target: [-0.62, 1.8, WALL_Z] },
  contact: { pos: [-0.28, 1.3, -0.06], target: [-0.34, 0.76, -0.52] },
  explore: { pos: [1.9, 1.75, 2.35], target: [0, 1.0, -0.75] },
}
export const stationFor = (view) => STATIONS[view] ?? STATIONS.home

/** HTML that covers part of the screen: section panels on the right, the intro on the left. */
export const PANEL_VIEWS = new Set(['about', 'projects', 'experience', 'skills', 'education', 'contact'])

/** Shared, mutable look target. */
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
