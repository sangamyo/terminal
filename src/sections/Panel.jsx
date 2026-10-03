import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'

/** Glass side panel shared by every section. */
export default function Panel({ path, title, kicker, children, wide = false }) {
  const runCommand = useStore((s) => s.runCommand)
  const reduced = useStore((s) => s.reducedMotion)
  return (
    <motion.aside
      className={`panel glass ${wide ? 'is-wide' : ''}`}
      initial={reduced ? { opacity: 0 } : { opacity: 0, x: 40, filter: 'blur(6px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, x: 30, filter: 'blur(4px)' }}
      transition={{ duration: reduced ? 0.15 : 0.45, ease: [0.22, 1, 0.36, 1], delay: reduced ? 0 : 0.25 }}
      aria-label={title}
    >
      <div className="panel-bar">
        <span className="panel-path">~/{path}</span>
        <button type="button" className="panel-close" onClick={() => runCommand('home')} aria-label="Close panel and return to terminal">
          esc ✕
        </button>
      </div>
      <div className="panel-body">
        {kicker && <p className="panel-kicker">{kicker}</p>}
        <h2 className="panel-title">{title}</h2>
        {children}
      </div>
    </motion.aside>
  )
}

export const Chips = ({ items, color }) => (
  <ul className="chips">
    {items.map((t) => (
      <li key={t} className="chip" style={color ? { '--chip': color } : undefined}>
        {t}
      </li>
    ))}
  </ul>
)

export const Meter = ({ value, color = 'var(--green)' }) => (
  <div className="meter" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} style={{ '--meter': color }}>
    <motion.div className="meter-fill" initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} />
  </div>
)
