import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'

const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF<>/{}[]=+*#'

/**
 * Digital rain on a 2D canvas.
 * ambient: faint, throttled background layer. Otherwise: full-screen `matrix` easter egg.
 */
export default function MatrixRain({ ambient = false }) {
  const canvasRef = useRef(null)
  const setMatrix = useStore((s) => s.setMatrix)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const size = ambient ? 16 : 18
    let drops = []
    let raf
    let last = 0
    const interval = ambient ? 70 : 40

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, ambient ? 1 : 1.5)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const cols = Math.ceil(window.innerWidth / size)
      drops = Array.from({ length: cols }, () => Math.random() * -60)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = (now) => {
      raf = requestAnimationFrame(draw)
      if (now - last < interval) return
      last = now
      if (ambient) {
        // Fade to transparent so the 3D scene shows through.
        ctx.globalCompositeOperation = 'destination-out'
        ctx.fillStyle = 'rgba(0,0,0,0.14)'
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
        ctx.globalCompositeOperation = 'source-over'
      } else {
        ctx.fillStyle = 'rgba(5,8,7,0.1)'
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
      }
      ctx.font = `${size - 2}px JetBrains Mono, monospace`
      for (let i = 0; i < drops.length; i++) {
        const ch = GLYPHS[(Math.random() * GLYPHS.length) | 0]
        const y = drops[i] * size
        ctx.fillStyle = Math.random() > 0.975 ? '#e8fff4' : i % 7 === 0 ? '#22e5ff' : '#39ff88'
        ctx.fillText(ch, i * size, y)
        if (y > window.innerHeight && Math.random() > (ambient ? 0.985 : 0.97)) drops[i] = 0
        drops[i] += ambient ? 0.5 : 1
      }
    }
    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [ambient])

  useEffect(() => {
    if (ambient) return
    const exit = () => setMatrix(false)
    const t = setTimeout(() => {
      window.addEventListener('keydown', exit, { once: true })
      window.addEventListener('pointerdown', exit, { once: true })
    }, 400)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', exit)
      window.removeEventListener('pointerdown', exit)
    }
  }, [ambient, setMatrix])

  return <canvas ref={canvasRef} className={ambient ? 'rain-ambient' : 'rain-full'} aria-hidden="true" />
}
