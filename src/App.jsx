import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { Suspense, lazy, useEffect, useState } from 'react'
import SectionLayer from './sections/sections'
import { EXPLORE_SET, useStore } from './store/useStore'
import Terminal from './terminal/Terminal'
import ErrorBoundary from './ui/ErrorBoundary'
import Finale from './ui/Finale'
import LiteBackground from './ui/LiteBackground'
import MatrixRain from './ui/MatrixRain'
import Nav from './ui/Nav'

// three.js + R3F live in a separate chunk, fetched once the terminal has painted.
const loadScene = () => import('./three/Scene')
const Scene = lazy(loadScene)

export default function App() {
  const quality = useStore((s) => s.quality)
  const setQuality = useStore((s) => s.setQuality)
  const reduced = useStore((s) => s.reducedMotion)
  const matrix = useStore((s) => s.matrix)
  const glitch = useStore((s) => s.glitch)
  const view = useStore((s) => s.view)
  const [sceneReady, setSceneReady] = useState(false)

  useDelayedSceneLoad(quality !== 'off', () => setSceneReady(true))
  useGlobalShortcuts()
  useFinaleTrigger()
  useSystemReducedMotion()

  const show3D = quality !== 'off' && sceneReady

  return (
    <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>
      <div className={`app view-${view} ${reduced ? 'reduced-motion' : ''} ${show3D ? 'has-3d' : 'is-lite'}`}>
        <LiteBackground />
        {show3D && (
          <ErrorBoundary onError={() => setQuality('off')}>
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </ErrorBoundary>
        )}
        {!reduced && quality !== 'off' && view === 'terminal' && <MatrixRain ambient />}

        <div className="ui-layer">
          <Nav />
          <SectionLayer />
          <Terminal />
        </div>

        <div className="crt-overlay" aria-hidden="true" />
        <GlitchFlash key={glitch} active={glitch > 0} />
        <AnimatePresence>
          {matrix && (
            <motion.div key="matrix" className="matrix-layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <MatrixRain />
              <p className="matrix-hint">press any key to exit</p>
            </motion.div>
          )}
        </AnimatePresence>
        <Finale />
      </div>
    </MotionConfig>
  )
}

function GlitchFlash({ active }) {
  if (!active) return null
  return <div className="glitch-flash" aria-hidden="true" />
}

/** Start fetching the 3D chunk after first paint / when idle, so the terminal never waits on it. */
function useDelayedSceneLoad(enabled, onReady) {
  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    const start = () => loadScene().then(() => !cancelled && onReady())
    const id = 'requestIdleCallback' in window ? window.requestIdleCallback(start, { timeout: 1200 }) : setTimeout(start, 300)
    return () => {
      cancelled = true
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(id)
      else clearTimeout(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled])
}

function useGlobalShortcuts() {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      const s = useStore.getState()
      if (s.matrix || s.finale || s.projectDetails) return
      if (s.view !== 'terminal') s.runCommand('home')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}

/** Once every main section has been visited, play the outro the next time the visitor is back at the terminal. */
function useFinaleTrigger() {
  const visited = useStore((s) => s.visited)
  const view = useStore((s) => s.view)
  const finaleSeen = useStore((s) => s.finaleSeen)
  const setFinale = useStore((s) => s.setFinale)
  useEffect(() => {
    if (finaleSeen || view !== 'terminal') return
    if (!EXPLORE_SET.every((v) => visited.includes(v))) return
    const t = setTimeout(() => setFinale(true), 1400)
    return () => clearTimeout(t)
  }, [visited, view, finaleSeen, setFinale])
}

function useSystemReducedMotion() {
  const setReduced = useStore((s) => s.setReducedMotion)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [setReduced])
}
