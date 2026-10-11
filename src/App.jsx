import { MotionConfig } from 'framer-motion'
import { Suspense, lazy, useEffect, useState } from 'react'
import LitePage from './sections/LitePage'
import SectionLayer from './sections/sections'
import { useStore } from './store/useStore'
import Terminal from './terminal/Terminal'
import CommandPalette from './ui/CommandPalette'
import ErrorBoundary from './ui/ErrorBoundary'
import TopBar from './ui/TopBar'

// three.js + R3F live in their own chunk, fetched after the first paint.
const loadScene = () => import('./three/Scene')
const Scene = lazy(loadScene)

export default function App() {
  const quality = useStore((s) => s.quality)
  const setQuality = useStore((s) => s.setQuality)
  const reduced = useStore((s) => s.reducedMotion)
  const lights = useStore((s) => s.lights)
  const view = useStore((s) => s.view)
  const [sceneReady, setSceneReady] = useState(false)

  const want3D = quality !== 'off'
  useDelayedSceneLoad(want3D, () => setSceneReady(true))
  useEscapeToDesk(want3D)
  useSystemReducedMotion()

  useEffect(() => {
    document.documentElement.dataset.lights = lights
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', lights === 'night' ? '#15161a' : '#ebe5da')
  }, [lights])

  return (
    <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>
      <div className={`app view-${view} ${want3D ? 'has-3d' : 'is-lite'}`}>
        {want3D ? (
          <>
            {sceneReady && (
              <ErrorBoundary onError={() => setQuality('off')}>
                <Suspense fallback={null}>
                  <Scene />
                </Suspense>
              </ErrorBoundary>
            )}
            {!sceneReady && <p className="loading-note">setting up the desk…</p>}
            <div className="ui-layer">
              <TopBar />
              <SectionLayer />
            </div>
          </>
        ) : (
          <>
            <TopBar lite />
            <LitePage />
          </>
        )}
        <CommandPalette lite={!want3D} />
        <Terminal />
      </div>
    </MotionConfig>
  )
}

/** Start fetching the 3D chunk once the page has painted, so text is never blocked on it. */
function useDelayedSceneLoad(enabled, onReady) {
  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    const start = () => loadScene().then(() => !cancelled && onReady())
    const id = 'requestIdleCallback' in window ? window.requestIdleCallback(start, { timeout: 800 }) : setTimeout(start, 200)
    return () => {
      cancelled = true
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(id)
      else clearTimeout(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled])
}

function useEscapeToDesk(enabled) {
  useEffect(() => {
    if (!enabled) return
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      const s = useStore.getState()
      if (s.paletteOpen || s.terminalOpen) return
      if (s.view !== 'home') s.setView('home')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [enabled])
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
