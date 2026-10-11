import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { profile } from '../data/profile'
import { useStore } from '../store/useStore'
import { Cmd } from './blocks'
import { commandNames, commands, resolveCommand, suggest } from './commands'
import { useTerminalEngine } from './useTerminalEngine'
import './Terminal.css'

const PROMPT = `${profile.handle}@${profile.host}:~$`

/** A real little shell in a drawer: open it from the command menu or with the ` key. */
export default function Terminal() {
  const open = useStore((s) => s.terminalOpen)
  const setOpen = useStore((s) => s.setTerminalOpen)

  useEffect(() => {
    const onKey = (e) => {
      const typing = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)
      if (e.key === '`' && !typing) {
        e.preventDefault()
        setOpen(!useStore.getState().terminalOpen)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setOpen])

  return <AnimatePresence>{open && <Shell key="shell" onClose={() => setOpen(false)} />}</AnimatePresence>
}

function Shell({ onClose }) {
  const { lines, print, block, echo, sleep, then, clear, fast } = useTerminalEngine()
  const pending = useStore((s) => s.pendingCommand)
  const [value, setValue] = useState('')
  const [caret, setCaret] = useState(0)
  const history = useRef([])
  const historyPos = useRef(-1)
  const inputRef = useRef(null)
  const scrollRef = useRef(null)
  const greeted = useRef(false)

  useEffect(() => {
    if (greeted.current) return
    greeted.current = true
    block(<Welcome />)
  }, [block])

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
        else print("type 'help' to see what's here.", { cls: 't-dim', speed: 0 })
        return
      }
      commands[key].run({ print, block, sleep, then, clear, args, history: history.current, close: onClose })
    },
    [echo, print, block, sleep, then, clear, onClose],
  )

  // Clickable command names inside output run through the store.
  const lastPending = useRef(pending?.id)
  useEffect(() => {
    if (pending && pending.id !== lastPending.current) {
      lastPending.current = pending.id
      execute(pending.cmd)
    }
  }, [pending, execute])

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      execute(value)
      setValue('')
      setCaret(0)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      onClose()
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
    } else if (e.key === '`') {
      e.preventDefault()
      onClose()
    }
  }

  const syncCaret = (e) => setCaret(e.target.selectionStart ?? e.target.value.length)

  useLayoutEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines, value])

  const onLineProgress = useCallback(() => {
    const el = scrollRef.current
    if (el && el.scrollHeight - el.scrollTop - el.clientHeight < 120) el.scrollTop = el.scrollHeight
  }, [])

  const focusInput = () => {
    if (window.getSelection()?.toString()) return
    inputRef.current?.focus({ preventScroll: true })
  }

  return (
    <motion.section
      className="terminal"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Terminal"
    >
      <header className="terminal-bar">
        <span className="terminal-title">{PROMPT}</span>
        <button type="button" className="terminal-close" onClick={onClose} aria-label="Close terminal">
          close <kbd>esc</kbd>
        </button>
      </header>
      <div className="terminal-body" ref={scrollRef} onClick={focusInput} role="log" aria-live="polite">
        {lines.map((line) => (
          <Line key={line.id} line={line} fast={fast} onProgress={onLineProgress} />
        ))}
        <div className="t-input-row">
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
              autoFocus
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="send"
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
  )
}

function Welcome() {
  return (
    <div className="t-welcome">
      <p>
        You found the terminal. Type <Cmd>help</Cmd> for commands, or try <Cmd>whoami</Cmd> and <Cmd>neofetch</Cmd>.
      </p>
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
    const step = Math.max(1, Math.round(line.text.length / 160))
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
    return () => clearInterval(id)
  }, [line, fast, onProgress])

  return (
    <div className={`t-line ${line.cls ?? ''}`}>
      {line.text.slice(0, count)}
      {count < line.text.length && <span className="cursor cursor-inline" aria-hidden="true" />}
    </div>
  )
}
