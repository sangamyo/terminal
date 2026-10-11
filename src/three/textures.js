import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three'

/* Procedural surface textures. Drawn once on a canvas, so the room needs no image downloads. */

// Small deterministic PRNG so the room looks the same on every visit.
function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function make(size, draw, { repeat = [1, 1], srgb = true } = {}) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  draw(canvas.getContext('2d'), size)
  const tex = new CanvasTexture(canvas)
  if (srgb) tex.colorSpace = SRGBColorSpace
  tex.wrapS = tex.wrapT = RepeatWrapping
  tex.repeat.set(...repeat)
  tex.anisotropy = 8
  return tex
}

const shade = (hex, f) => {
  const n = parseInt(hex.slice(1), 16)
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(v * f))))
  return `rgb(${c.join(',')})`
}

/** Long wavy grain lines, for the desk top and shelf. */
export function woodTexture(base = '#6e4b33', seed = 7) {
  return make(1024, (g, s) => {
    const r = rng(seed)
    g.fillStyle = base
    g.fillRect(0, 0, s, s)
    for (let i = 0; i < 140; i++) {
      const y0 = r() * s
      g.strokeStyle = shade(base, 0.78 + r() * 0.4)
      g.globalAlpha = 0.18 + r() * 0.25
      g.lineWidth = 0.6 + r() * 2.4
      g.beginPath()
      for (let x = 0; x <= s; x += 16) {
        const y = y0 + Math.sin(x / (90 + r() * 40) + i) * (4 + r() * 3) + Math.sin(x / 23) * 0.8
        x === 0 ? g.moveTo(x, y) : g.lineTo(x, y)
      }
      g.stroke()
    }
    g.globalAlpha = 1
  })
}

/** Oak floor boards with staggered joints. */
export function floorTexture() {
  return make(
    1024,
    (g, s) => {
      const r = rng(11)
      const rows = 8
      const h = s / rows
      for (let row = 0; row < rows; row++) {
        let x = -r() * s * 0.5
        while (x < s) {
          const w = s * (0.45 + r() * 0.5)
          g.fillStyle = shade('#b48f69', 0.9 + r() * 0.18)
          g.fillRect(x, row * h, w, h)
          for (let k = 0; k < 9; k++) {
            g.strokeStyle = shade('#b48f69', 0.75 + r() * 0.2)
            g.globalAlpha = 0.25
            g.lineWidth = 1 + r() * 1.5
            const yy = row * h + r() * h
            g.beginPath()
            g.moveTo(x, yy)
            g.bezierCurveTo(x + w * 0.3, yy + (r() - 0.5) * 6, x + w * 0.7, yy + (r() - 0.5) * 6, x + w, yy)
            g.stroke()
          }
          g.globalAlpha = 1
          g.fillStyle = 'rgba(60,40,25,.55)'
          g.fillRect(x, row * h, 2, h)
          x += w
        }
        g.fillStyle = 'rgba(60,40,25,.6)'
        g.fillRect(0, row * h, s, 2)
      }
    },
    { repeat: [3, 3] },
  )
}

/** Faint mottling so painted walls don't look like flat CG. */
export function plasterTexture(base = '#e9e4da') {
  return make(
    512,
    (g, s) => {
      const r = rng(3)
      g.fillStyle = base
      g.fillRect(0, 0, s, s)
      for (let i = 0; i < 1800; i++) {
        g.fillStyle = r() > 0.5 ? 'rgba(255,255,255,.025)' : 'rgba(90,80,60,.014)'
        const d = 3 + r() * 14
        g.beginPath()
        g.arc(r() * s, r() * s, d, 0, Math.PI * 2)
        g.fill()
      }
    },
    { repeat: [4, 2] },
  )
}

/** Speckled cork for the pinboard. */
export function corkTexture() {
  return make(
    512,
    (g, s) => {
      const r = rng(5)
      g.fillStyle = '#c29a6b'
      g.fillRect(0, 0, s, s)
      for (let i = 0; i < 9000; i++) {
        g.fillStyle = r() > 0.55 ? `rgba(90,55,25,${0.15 + r() * 0.3})` : `rgba(240,210,160,${0.1 + r() * 0.2})`
        g.fillRect(r() * s, r() * s, 1 + r() * 2.5, 1 + r() * 2.5)
      }
    },
    { repeat: [1, 1] },
  )
}
