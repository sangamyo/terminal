/** Decide how much 3D the current device should get: 'high' | 'low' | 'off'. */
export function detectQuality() {
  if (typeof window === 'undefined') return 'off'
  if (!hasWebGL()) return 'off'
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const small = Math.min(window.innerWidth, window.innerHeight) < 600
  const cores = navigator.hardwareConcurrency || 4
  const memory = navigator.deviceMemory || 8
  // Phones keep the terminal-first experience; 3D can still be enabled manually.
  if (coarse && small) return 'off'
  if (coarse || cores <= 4 || memory <= 4) return 'low'
  return 'high'
}

export function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export const isDesktopLayout = () => typeof window !== 'undefined' && window.innerWidth >= 1024

export function safeStorage(kind = 'sessionStorage') {
  try {
    return window[kind]
  } catch {
    return null
  }
}
