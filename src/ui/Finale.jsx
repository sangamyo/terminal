import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'

const LINES = ['> connection established.', '> thanks for exploring my workspace.']

export default function Finale() {
  const open = useStore((s) => s.finale)
  const setFinale = useStore((s) => s.setFinale)
  const runCommand = useStore((s) => s.runCommand)
  const reduced = useStore((s) => s.reducedMotion)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!open) return setStep(0)
    if (reduced) return setStep(LINES.length + 1)
    const timers = [...LINES, 'cta'].map((_, i) => setTimeout(() => setStep(i + 1), 500 + i * 900))
    return () => timers.forEach(clearTimeout)
  }, [open, reduced])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setFinale(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setFinale])

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="finale" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Thanks for visiting">
          <div className="finale-card glass">
            {LINES.slice(0, step).map((l) => (
              <motion.p key={l} className="finale-line" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
                {l}
              </motion.p>
            ))}
            {step > LINES.length && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="finale-title">Let&apos;s build something intelligent.</h2>
                <div className="finale-actions">
                  <button
                    type="button"
                    className="btn"
                    autoFocus
                    onClick={() => {
                      setFinale(false)
                      runCommand('contact')
                    }}
                  >
                    ▸ Get in touch
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => setFinale(false)}>
                    Keep exploring
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
