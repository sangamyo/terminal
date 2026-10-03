import { create } from 'zustand'
import { detectQuality, hasWebGL, prefersReducedMotion } from '../lib/device'

export const VIEWS = ['terminal', 'about', 'skills', 'projects', 'experience', 'education', 'contact', 'immersive']
/** Sections a visitor must open before the "connection established" finale plays. */
export const EXPLORE_SET = ['about', 'skills', 'projects', 'experience', 'contact']

const initialView = () => {
  const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : ''
  return VIEWS.includes(hash) ? hash : 'terminal'
}

export const useStore = create((set, get) => ({
  /* navigation */
  view: initialView(),
  visited: [],
  setView: (view) => {
    if (!VIEWS.includes(view)) return
    const visited = get().visited.includes(view) ? get().visited : [...get().visited, view]
    // On narrow screens the section panel needs the space, so the terminal tucks into a pill.
    const narrow = typeof window !== 'undefined' && window.innerWidth < 1024
    set({ view, visited, hoveredSkill: null, ...(view === 'terminal' ? { terminalOpen: true } : narrow || view === 'immersive' ? { terminalOpen: false } : {}) })
    if (typeof window !== 'undefined') {
      const url = view === 'terminal' ? window.location.pathname : `#${view}`
      window.history.replaceState(null, '', url)
    }
  },

  /* terminal command bus — UI elements (nav, 3D objects) route actions through the terminal */
  pendingCommand: null,
  runCommand: (cmd) => set({ pendingCommand: { cmd, id: performance.now() } }),
  booted: false,
  setBooted: (booted) => set({ booted }),
  terminalOpen: true,
  setTerminalOpen: (terminalOpen) => set({ terminalOpen }),

  /* skills */
  hoveredSkill: null,
  setHoveredSkill: (hoveredSkill) => set({ hoveredSkill }),
  skillFocus: null, // category id
  setSkillFocus: (skillFocus) => set({ skillFocus }),

  /* projects */
  projectIndex: 0,
  setProjectIndex: (projectIndex) => set({ projectIndex }),
  projectDetails: null, // project id for modal
  setProjectDetails: (projectDetails) => set({ projectDetails }),

  /* experience */
  timelineIndex: 2,
  setTimelineIndex: (timelineIndex) => set({ timelineIndex }),

  /* effects */
  matrix: false,
  setMatrix: (matrix) => set({ matrix }),
  glitch: 0,
  triggerGlitch: () => set({ glitch: performance.now() }),
  finale: false,
  finaleSeen: false,
  setFinale: (finale) => set(finale ? { finale, finaleSeen: true } : { finale }),

  /* performance & accessibility */
  quality: detectQuality(), // 'high' | 'low' | 'off'
  webgl: typeof window !== 'undefined' ? hasWebGL() : false,
  setQuality: (quality) => set({ quality }),
  reducedMotion: prefersReducedMotion(),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
}))
