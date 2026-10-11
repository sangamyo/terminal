import { create } from 'zustand'
import { detectQuality, hasWebGL, prefersReducedMotion, safeStorage } from '../lib/device'

export const VIEWS = ['home', 'about', 'projects', 'experience', 'skills', 'education', 'contact', 'explore']

const initialView = () => {
  if (typeof window === 'undefined') return 'home'
  const hash = window.location.hash.replace('#', '')
  return VIEWS.includes(hash) ? hash : 'home'
}

/** Daylight between 7:00 and 18:59 in the visitor's own time zone, unless they picked one. */
const initialLights = () => {
  const saved = safeStorage('localStorage')?.getItem('hk-lights')
  if (saved === 'day' || saved === 'night') return saved
  const h = new Date().getHours()
  return h >= 7 && h < 19 ? 'day' : 'night'
}

export const useStore = create((set, get) => ({
  /* navigation */
  view: initialView(),
  setView: (view) => {
    if (!VIEWS.includes(view)) return
    set({ view, hoveredSkill: null, projectDetails: null })
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', view === 'home' ? window.location.pathname : `#${view}`)
    }
  },

  /* 3D hover label */
  hovered: null, // view id of the object under the pointer
  setHovered: (hovered) => set({ hovered }),

  /* day / night */
  lights: initialLights(),
  toggleLights: () => {
    const lights = get().lights === 'day' ? 'night' : 'day'
    safeStorage('localStorage')?.setItem('hk-lights', lights)
    set({ lights })
  },

  /* command palette + terminal drawer */
  paletteOpen: false,
  setPaletteOpen: (paletteOpen) => set({ paletteOpen }),
  terminalOpen: false,
  setTerminalOpen: (terminalOpen) => set({ terminalOpen }),
  // Clickable command names inside terminal output run through here.
  pendingCommand: null,
  runCommand: (cmd) => set({ pendingCommand: { cmd, id: performance.now() } }),

  /* skills */
  hoveredSkill: null,
  setHoveredSkill: (hoveredSkill) => set({ hoveredSkill }),
  skillFocus: null, // category id
  setSkillFocus: (skillFocus) => set({ skillFocus }),

  /* projects */
  projectIndex: 0,
  setProjectIndex: (projectIndex) => set({ projectIndex }),
  projectDetails: null, // project id for the details sheet
  setProjectDetails: (projectDetails) => set({ projectDetails }),

  /* experience — index into `timeline`, newest work item by default */
  timelineIndex: 2,
  setTimelineIndex: (timelineIndex) => set({ timelineIndex }),

  /* performance & accessibility */
  quality: detectQuality(), // 'high' | 'low' | 'off'
  webgl: typeof window !== 'undefined' ? hasWebGL() : false,
  setQuality: (quality) => set({ quality }),
  reducedMotion: prefersReducedMotion(),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
}))
