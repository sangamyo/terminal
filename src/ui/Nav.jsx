import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'

const ITEMS = [
  ['terminal', 'home'],
  ['about', 'about'],
  ['skills', 'skills'],
  ['projects', 'projects'],
  ['experience', 'experience'],
  ['contact', 'contact'],
]

/** Minimal floating nav. Every item runs a terminal command, keeping the terminal the source of truth. */
export default function Nav() {
  const view = useStore((s) => s.view)
  const runCommand = useStore((s) => s.runCommand)
  const booted = useStore((s) => s.booted)
  const quality = useStore((s) => s.quality)
  const webgl = useStore((s) => s.webgl)
  const setQuality = useStore((s) => s.setQuality)
  const reduced = useStore((s) => s.reducedMotion)
  const setReduced = useStore((s) => s.setReducedMotion)
  const navRef = useRef(null)

  // Keep the active item visible when the nav scrolls horizontally on small screens.
  useEffect(() => {
    const nav = navRef.current
    const active = nav?.querySelector('.is-active')
    if (nav && active) nav.scrollTo({ left: active.offsetLeft - nav.clientWidth / 2 + active.clientWidth / 2, behavior: 'smooth' })
  }, [view])

  return (
    <header className={`topbar ${booted ? 'is-ready' : ''}`}>
      <button type="button" className="brand" onClick={() => runCommand('home')} aria-label="Home">
        <span className="brand-mark">&gt;_</span>
        <span className="brand-text">hk://workspace</span>
      </button>

      <nav ref={navRef} className="nav glass" aria-label="Sections">
        {ITEMS.map(([v, cmd]) => (
          <button
            key={v}
            type="button"
            className={`nav-item ${view === v ? 'is-active' : ''}`}
            aria-current={view === v ? 'page' : undefined}
            onClick={() => runCommand(cmd)}
          >
            [{v.toUpperCase()}]
          </button>
        ))}
      </nav>

      <div className="toggles">
        {webgl && (
          <button
            type="button"
            className={`toggle ${quality !== 'off' ? 'is-on' : ''}`}
            onClick={() => setQuality(quality === 'off' ? 'low' : 'off')}
            title={quality === 'off' ? 'Enable 3D' : 'Disable 3D (lite mode)'}
            aria-pressed={quality !== 'off'}
          >
            3D
          </button>
        )}
        <button
          type="button"
          className={`toggle ${!reduced ? 'is-on' : ''}`}
          onClick={() => setReduced(!reduced)}
          title={reduced ? 'Enable motion' : 'Reduce motion'}
          aria-pressed={!reduced}
        >
          FX
        </button>
      </div>
    </header>
  )
}
