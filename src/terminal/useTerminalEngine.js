import { useCallback, useRef, useState } from 'react'
import { useStore } from '../store/useStore'

let uid = 0
const nextId = () => ++uid

/**
 * Terminal output engine.
 * Output is a serial queue: every `print` / `block` waits for the previous one,
 * so command responses read like a real process writing to stdout.
 */
export function useTerminalEngine() {
  const [lines, setLines] = useState([])
  const [busy, setBusy] = useState(false)
  const queue = useRef(Promise.resolve())
  const epoch = useRef(0) // bumped on `clear` to cancel in-flight output
  const pendingJobs = useRef(0)

  const fast = useRef(false) // set to skip typing (boot skip / reduced motion)
  const instant = () => fast.current || useStore.getState().reducedMotion

  const push = useCallback((line) => {
    setLines((prev) => {
      const next = [...prev, line]
      return next.length > 400 ? next.slice(-400) : next
    })
  }, [])

  const settle = (fn) => {
    const myEpoch = epoch.current
    pendingJobs.current += 1
    setBusy(true)
    queue.current = queue.current
      .then(() => (myEpoch === epoch.current ? fn() : undefined))
      .catch((err) => console.error(err))
      .finally(() => {
        if (myEpoch !== epoch.current) return
        pendingJobs.current -= 1
        if (pendingJobs.current === 0) setBusy(false)
      })
    return queue.current
  }

  /** Typed line. opts: { cls, speed (ms/char), prefix } */
  const print = useCallback(
    (text, opts = {}) =>
      settle(
        () =>
          new Promise((resolve) => {
            const typed = !instant() && opts.speed !== 0
            push({ id: nextId(), kind: 'text', text, cls: opts.cls, prefix: opts.prefix, typed, speed: opts.speed ?? 12, onDone: resolve })
            if (!typed) resolve()
          }),
      ),
    [push],
  )

  /** Rich React block (animated in by the renderer). */
  const block = useCallback(
    (node, opts = {}) =>
      settle(
        () =>
          new Promise((resolve) => {
            push({ id: nextId(), kind: 'block', node })
            setTimeout(resolve, instant() ? 0 : (opts.hold ?? 120))
          }),
      ),
    [push],
  )

  const echo = useCallback((cmd) => push({ id: nextId(), kind: 'input', text: cmd }), [push])

  const sleep = useCallback(
    (ms) => settle(() => new Promise((r) => setTimeout(r, instant() ? 0 : ms))),
    [],
  )

  /** Run an arbitrary side effect in queue order (e.g. change the 3D view after a loading line). */
  const then = useCallback((fn) => settle(fn), [])

  const clear = useCallback(() => {
    epoch.current += 1
    queue.current = Promise.resolve()
    pendingJobs.current = 0
    setBusy(false)
    setLines([])
  }, [])

  return { lines, busy, print, block, echo, sleep, then, clear, fast }
}
