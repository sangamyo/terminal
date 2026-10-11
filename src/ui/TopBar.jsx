import { profile } from '../data/profile'
import { useStore } from '../store/useStore'
import { CubeIcon, MoonIcon, PageIcon, SearchIcon, SunIcon } from './Icons'

const ITEMS = [
  ['projects', 'Work', 'work'],
  ['experience', 'Experience', 'experience'],
  ['skills', 'Skills', 'skills'],
  ['education', 'Education', 'education'],
  ['contact', 'Contact', 'contact'],
]

export default function TopBar({ lite }) {
  const view = useStore((s) => s.view)
  const setView = useStore((s) => s.setView)
  const lights = useStore((s) => s.lights)
  const toggleLights = useStore((s) => s.toggleLights)
  const setPaletteOpen = useStore((s) => s.setPaletteOpen)
  const webgl = useStore((s) => s.webgl)
  const setQuality = useStore((s) => s.setQuality)
  const mac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

  return (
    <header className="topbar">
      <button type="button" className="wordmark" onClick={() => (lite ? window.scrollTo({ top: 0, behavior: 'smooth' }) : setView('home'))}>
        <strong>{profile.name}</strong>
        <span>AI / Software Engineer</span>
      </button>

      <nav className="topnav" aria-label="Sections">
        {ITEMS.map(([v, label, anchor]) =>
          lite ? (
            <a key={v} href={`#${anchor}`}>
              {label}
            </a>
          ) : (
            <button key={v} type="button" aria-current={view === v ? 'page' : undefined} onClick={() => setView(v)}>
              {label}
            </button>
          ),
        )}
        <a href={profile.links.resume} target="_blank" rel="noreferrer">
          Résumé ↗
        </a>
      </nav>

      <div className="top-actions">
        <button type="button" className="kbd-btn" onClick={() => setPaletteOpen(true)} aria-label="Open command menu">
          <SearchIcon />
          <span className="kbd-label">Jump to</span>
          <kbd>{mac ? '⌘' : 'Ctrl'} K</kbd>
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={toggleLights}
          aria-label={lights === 'day' ? 'Switch to night' : 'Switch to day'}
          title={lights === 'day' ? 'Night' : 'Day'}
        >
          {lights === 'day' ? <MoonIcon /> : <SunIcon />}
        </button>
        {webgl && (
          <button
            type="button"
            className="icon-btn"
            onClick={() => setQuality(lite ? 'low' : 'off')}
            aria-label={lite ? 'Open the 3D desk' : 'Switch to the simple page'}
            title={lite ? '3D desk' : 'Simple page'}
          >
            {lite ? <CubeIcon /> : <PageIcon />}
          </button>
        )}
      </div>
    </header>
  )
}
