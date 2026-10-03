import { motion } from 'framer-motion'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { profile } from '../data/profile'
import { safeStorage } from '../lib/device'
import { useStore } from '../store/useStore'
import { Cmd } from './blocks'
import { commandNames, commands, resolveCommand, suggest } from './commands'
import { useTerminalEngine } from './useTerminalEngine'
import './Terminal.css'

const PROMPT = `${profile.handle}@${profile.host}:~$`

const BOOT = [
  'Initializing portfolio...',
  'Loading AI systems...',
  'Loading robotics modules...',
  'Loading computer vision...',
  'Loading software engineering modules...',
]

/**
 * The terminal is the site's identity: it is centered on the landing view,
 * docks to a corner while a section is open, and keeps accepting commands everywhere.
 */
export default function Terminal() {
  const engine = useTerminalEngine()
  const { lines, print, block, echo, sleep, then, clear, fast } = engine
  const view = useStore((s) => s.view)
  const booted = useStore((s) => s.booted)
  const setBooted = useStore((s) => s.setBooted)
  const pending = useStore((s) => s.pendingCommand)
  const terminalOpen = useStore((s) => s.terminalOpen)
  const setTerminalOpen = useStore((s) => s.setTerminalOpen)

  const [value, setValue] = useState('')
  const [caret, setCaret] = useState(0)
  const history = useRef([])
  const historyPos = useRef(-1)
  const inputRef = useRef(null)
  const scrollRef = useRef(null)
  const bootStarted = useRef(false)

  const docked = view !== 'terminal'
  const collapsed = docked && !terminalOpen

  /* ---------- boot sequence ---------- */
  useEffect(() => {
    if (bootStarted.current) return
    bootStarted.current = true
    const storage = safeStorage()
    const returning = storage?.getItem('hk-booted') === '1'
    if (returning) fast.current = true

    BOOT.forEach((line) => {
      print(`> ${line}`, { cls: 't-sys', speed: 14 })
      block(<span className="t-ok">[ OK ]</span>, { hold: 160 })
    })
    print('> System ready.', { cls: 't-accent', speed: 18 })
    sleep(250)
    block(<Welcome />, { hold: 300 })
    then(() => {
      fast.current = false
      setBooted(true)
      storage?.setItem('hk-booted', '1')
      // Deep link (#skills etc.) — the view is already set, just announce it.
      const v = useStore.getState().view
      if (v !== 'terminal') print(`> restored session: ${v}`, { cls: 't-dim', speed: 0 })
    })
  }, [print, block, sleep, then, fast, setBooted])

  // Any key or click during boot skips the typing animation.
  useEffect(() => {
    if (booted) return
    const skip = () => { fast.current = true }
    window.addEventListener('keydown', skip, { once: true })
    window.addEventListener('pointerdown', skip, { once: true })
    return () => {
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
  }, [booted, fast])

  /* ---------- command execution ---------- */
  const execute = useCallback(
    (raw) => {
      const input = raw.trim()
      echo(input)
      if (!input) return
      history.current = [...history.current.filter((h) => h !== input), input].slice(-50)
      historyPos.current = -1

      const [name, ...args] = input.split(/\s+/)
      const key = resolveCommand(name)
      if (!key) {
        const hint = suggest(name)
        print(`command not found: ${name}`, { cls: 't-err', speed: 0 })
        if (hint) block(<span className="t-dim">did you mean <Cmd>{hint}</Cmd>?</span>)
        else print("type 'help' to see available commands.", { cls: 't-dim', speed: 0 })
        return
      }
      commands[key].run({ print, block, sleep, then, clear, args, history: history.current })
    },
    [echo, print, block, sleep, then, clear],
  )

  // Commands dispatched from elsewhere (nav, 3D objects, clickable output).
  useEffect(() => {
    if (pending) execute(pending.cmd)
  }, [pending, execute])

  /* ---------- input handling ---------- */
  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      execute(value)
      setValue('')
      setCaret(0)
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      const h = history.current
      if (!h.length) return
      let pos = historyPos.current
      pos = e.key === 'ArrowUp' ? (pos === -1 ? h.length - 1 : Math.max(0, pos - 1)) : pos === -1 ? -1 : pos + 1
      if (pos >= h.length) pos = -1
      historyPos.current = pos
      const next = pos === -1 ? '' : h[pos]
      setValue(next)
      setCaret(next.length)
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const visible = commandNames.filter((n) => !commands[n].hidden)
      const matches = visible.filter((n) => n.startsWith(value.toLowerCase()))
      if (matches.length === 1) {
        setValue(matches[0])
        setCaret(matches[0].length)
      } else if (matches.length > 1 && value) {
        echo(value)
        print(matches.join('   '), { cls: 't-dim', speed: 0 })
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      clear()
    }
  }

  const syncCaret = (e) => setCaret(e.target.selectionStart ?? e.target.value.length)

  // Typing anywhere on the page focuses the terminal.
  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || document.activeElement?.isContentEditable) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key.length === 1 && useStore.getState().booted && !useStore.getState().matrix) {
        setTerminalOpen(true)
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setTerminalOpen])

  /* ---------- auto-scroll ---------- */
  useLayoutEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines, value])

  // Keep the tail visible while a typed line grows.
  const onLineProgress = useCallback(() => {
    const el = scrollRef.current
    if (el && el.scrollHeight - el.scrollTop - el.clientHeight < 120) el.scrollTop = el.scrollHeight
  }, [])

  const focusInput = () => {
    if (window.getSelection()?.toString()) return // allow copying output
    inputRef.current?.focus({ preventScroll: true })
  }

  // The section stays mounted while collapsed so in-flight typed output keeps its queue alive.
  return (
    <>
    {collapsed && (
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        type="button"
        className="terminal-pill glass"
        onClick={() => setTerminalOpen(true)}
        aria-label="Open terminal"
      >
        <span className="t-prompt">{PROMPT}</span>
        <span className="cursor" aria-hidden="true" />
      </motion.button>
    )}
    <motion.section
      layout
      className={`terminal glass ${docked ? 'is-docked' : 'is-center'} ${collapsed ? 'is-collapsed' : ''}`}
      transition={{ type: 'spring', stiffness: 160, damping: 24 }}
      aria-label="Interactive terminal"
    >
      <header className="terminal-bar">
        <div className="dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <span className="terminal-title">{PROMPT}</span>
        {docked && (
          <button type="button" className="terminal-min" onClick={() => setTerminalOpen(false)} aria-label="Minimize terminal">
            _
          </button>
        )}
      </header>

      <div className="terminal-body crt" ref={scrollRef} onClick={focusInput} role="log" aria-live="polite">
        {lines.map((line) => (
          <Line key={line.id} line={line} fast={fast} onProgress={onLineProgress} />
        ))}

        <div className={`t-input-row ${booted ? '' : 'is-hidden'}`}>
          <span className="t-prompt">{PROMPT}</span>
          <label className="t-input-wrap">
            <span className="sr-only">Terminal command</span>
            <input
              ref={inputRef}
              className="t-input"
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                syncCaret(e)
              }}
              onKeyDown={onKeyDown}
              onKeyUp={syncCaret}
              onSelect={syncCaret}
              autoFocus={!docked}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="send"
              disabled={!booted}
            />
            <span className="t-mirror" aria-hidden="true">
              {value.slice(0, caret)}
              <span className="cursor" />
              {value.slice(caret)}
            </span>
          </label>
        </div>
      </div>
    </motion.section>
    </>
  )
}

function Welcome() {
  return (
    <div className="t-welcome">
      <h1 className="t-welcome-title">Welcome to Hariom&apos;s Digital Workspace.</h1>
      <p className="t-welcome-sub">
        Type <Cmd>help</Cmd> to explore.
      </p>
      <div className="t-quick" aria-label="Quick commands">
        {['about', 'skills', 'projects', 'experience', 'contact', '3d'].map((c) => (
          <Cmd key={c}>{c}</Cmd>
        ))}
      </div>
    </div>
  )
}

function Line({ line, fast, onProgress }) {
  if (line.kind === 'input') {
    return (
      <div className="t-line t-echo">
        <span className="t-prompt">{PROMPT}</span> {line.text}
      </div>
    )
  }
  if (line.kind === 'block') return <div className="t-line t-block">{line.node}</div>
  return <TypedLine line={line} fast={fast} onProgress={onProgress} />
}

function TypedLine({ line, fast, onProgress }) {
  const [count, setCount] = useState(line.typed ? 0 : line.text.length)
  const done = useRef(!line.typed)

  useEffect(() => {
    if (done.current) return
    let i = 0
    const step = Math.max(1, Math.round(line.text.length / 160)) // long lines type faster
    const id = setInterval(() => {
      i = fast.current ? line.text.length : i + step
      setCount(Math.min(i, line.text.length))
      onProgress()
      if (i >= line.text.length) {
        clearInterval(id)
        done.current = true
        line.onDone?.()
      }
    }, line.speed)
    // If unmounted mid-type (e.g. `clear`), the engine discards the stale queue itself.
    return () => clearInterval(id)
  }, [line, fast, onProgress])

  return (
    <div className={`t-line ${line.cls ?? ''}`}>
      {line.text.slice(0, count)}
      {count < line.text.length && <span className="cursor cursor-inline" aria-hidden="true" />}
    </div>
  )
}
