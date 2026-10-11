import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'

/** Paper card beside the desk that holds a section. */
export default function Panel({ crumb, title, children }) {
  const setView = useStore((s) => s.setView)
  const reduced = useStore((s) => s.reducedMotion)
  return (
    <motion.aside
      className="panel"
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration: reduced ? 0.12 : 0.38, ease: [0.22, 1, 0.36, 1], delay: reduced ? 0 : 0.18 }}
      aria-label={crumb}
    >
      <div className="panel-head">
        <span className="panel-crumb">{crumb}</span>
        <button type="button" className="panel-close" onClick={() => setView('home')} aria-label="Close and go back to the desk">
          Back to desk <kbd>esc</kbd>
        </button>
      </div>
      <div className="panel-body">
        {title && <h2 className="panel-title">{title}</h2>}
        {children}
      </div>
    </motion.aside>
  )
}
