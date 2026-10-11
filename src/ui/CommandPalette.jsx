import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { profile, projects } from '../data/profile'
import { useStore } from '../store/useStore'
import { SearchIcon } from './Icons'

/** ⌘K / Ctrl+K / "/" menu: jump anywhere, open links, flip settings, or drop into the terminal. */
export default function CommandPalette({ lite }) {
  const open = useStore((s) => s.paletteOpen)
  const setOpen = useStore((s) => s.setPaletteOpen)

  useEffect(() => {
    const onKey = (e) => {
      const typing = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!useStore.getState().paletteOpen)
      } else if (e.key === '/' && !typing && !useStore.getState().terminalOpen) {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setOpen])

  return <AnimatePresence>{open && <Palette key="palette" lite={lite} onClose={() => setOpen(false)} />}</AnimatePresence>
}

function useActions(lite) {
  return useMemo(() => {
    const s = () => useStore.getState()
    const go = (view, anchor) => () => {
      if (lite) document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' })
      else s().setView(view)
    }
    const openUrl = (url) => () => window.open(url, '_blank', 'noopener,noreferrer')
    const list = [
      { group: 'Go to', label: 'Home', hint: 'the desk', run: lite ? () => window.scrollTo({ top: 0, behavior: 'smooth' }) : go('home') },
      ...(!lite ? [{ group: 'Go to', label: 'About', hint: 'name plate', run: go('about') }] : []),
      { group: 'Go to', label: 'Projects', hint: lite ? '' : 'monitor', run: go('projects', 'work') },
      { group: 'Go to', label: 'Experience', hint: lite ? '' : 'robot arm', run: go('experience', 'experience') },
      { group: 'Go to', label: 'Skills', hint: lite ? '' : 'pinboard', run: go('skills', 'skills') },
      { group: 'Go to', label: 'Education', hint: lite ? '' : 'shelf', run: go('education', 'education') },
      { group: 'Go to', label: 'Contact', hint: lite ? '' : 'notepad', run: go('contact', 'contact') },
      ...(!lite ? [{ group: 'Go to', label: 'Look around the room', hint: 'free camera', run: go('explore') }] : []),
      ...projects.map((p, i) => ({
        group: 'Projects',
        label: p.title,
        hint: p.live ? 'live demo' : '',
        run: () => {
          if (lite) document.getElementById(`project-${p.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          else {
            s().setProjectIndex(i)
            s().setView('projects')
          }
        },
      })),
      {
        group: 'Actions',
        label: 'Copy email address',
        hint: profile.links.email,
        run: () => navigator.clipboard?.writeText(profile.links.email).catch(() => {}),
      },
      { group: 'Actions', label: 'Download résumé', hint: 'PDF', run: openUrl(profile.links.resume) },
      { group: 'Actions', label: 'Open GitHub', hint: 'github.com/sangamyo', run: openUrl(profile.links.github) },
      { group: 'Actions', label: 'Open LinkedIn', run: openUrl(profile.links.linkedin) },
      { group: 'Settings', label: s().lights === 'day' ? 'Turn the lights down (night)' : 'Open the curtains (day)', run: () => s().toggleLights() },
      ...(s().webgl ? [{ group: 'Settings', label: lite ? 'Switch to the 3D desk' : 'Switch to the simple page', run: () => s().setQuality(lite ? 'low' : 'off') }] : []),
      { group: 'Settings', label: 'Open the terminal', hint: 'for the curious', run: () => s().setTerminalOpen(true) },
    ]
    return list
  }, [lite])
}

function Palette({ lite, onClose }) {
  const actions = useActions(lite)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return actions
    return actions.filter((a) => `${a.label} ${a.hint ?? ''} ${a.group}`.toLowerCase().includes(q))
  }, [actions, query])

  useEffect(() => setActive(0), [query])
  useEffect(() => inputRef.current?.focus(), [])
  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const run = (a) => {
    onClose()
    a.run()
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(results.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(0, i - 1))
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault()
      run(results[active])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      onClose()
    }
  }

  let lastGroup = null
  return (
    <motion.div className="palette-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} onClick={onClose}>
      <motion.div
        className="palette"
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        initial={{ opacity: 0, y: -8, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.18 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="palette-input">
          <SearchIcon size={18} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Jump to a section, a project, or an action…"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={results[active] ? `pal-${active}` : undefined}
          />
          <kbd>esc</kbd>
        </div>
        <ul className="palette-list" id="palette-list" role="listbox" ref={listRef}>
          {results.length === 0 && <li className="palette-empty">Nothing matches “{query}”.</li>}
          {results.map((a, i) => {
            const header = a.group !== lastGroup
            lastGroup = a.group
            return (
              <li key={`${a.group}-${a.label}`} role="presentation">
                {header && <div className="palette-group">{a.group}</div>}
                <div
                  id={`pal-${i}`}
                  role="option"
                  aria-selected={i === active}
                  className="palette-item"
                  onMouseMove={() => setActive(i)}
                  onClick={() => run(a)}
                >
                  <span>{a.label}</span>
                  {a.hint && <small>{a.hint}</small>}
                </div>
              </li>
            )
          })}
        </ul>
        <div className="palette-foot">
          <span>↑↓ to move</span>
          <span>↵ to open</span>
          <span>esc to close</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
