import { motion } from 'framer-motion'
import { education, profile, projects, skillCategories, skills, timeline } from '../data/profile'
import { useStore } from '../store/useStore'

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045 } },
}
const item = {
  hidden: { opacity: 0, x: -6 },
  show: { opacity: 1, x: 0, transition: { duration: 0.22 } },
}

function Stagger({ children, className }) {
  const reduced = useStore((s) => s.reducedMotion)
  return (
    <motion.div className={className} variants={list} initial={reduced ? 'show' : 'hidden'} animate="show">
      {children}
    </motion.div>
  )
}

const Row = ({ children, className }) => (
  <motion.div className={className} variants={item}>
    {children}
  </motion.div>
)

/** Clicking a command name inside output runs it — handy on touch devices. */
export function Cmd({ children, run }) {
  const runCommand = useStore((s) => s.runCommand)
  return (
    <button type="button" className="t-cmd" onClick={() => runCommand(run ?? children)}>
      {children}
    </button>
  )
}

export function HelpBlock({ commands }) {
  return (
    <Stagger className="t-help">
      {commands.map(([name, desc]) => (
        <Row key={name} className="t-help-row">
          <Cmd>{name}</Cmd>
          <span className="t-dim">{desc}</span>
        </Row>
      ))}
      <Row className="t-help-row t-note">
        <span className="t-dim">tip: ↑/↓ history · Tab autocomplete · Esc back to terminal · some commands are hidden…</span>
      </Row>
    </Stagger>
  )
}

export function ProgressBlock({ label, duration = 0.9 }) {
  const reduced = useStore((s) => s.reducedMotion)
  return (
    <div className="t-progress">
      <span className="t-dim">{label}</span>
      <div className="t-bar">
        <motion.div
          className="t-bar-fill"
          initial={{ width: reduced ? '100%' : '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: reduced ? 0 : duration, ease: [0.65, 0, 0.35, 1] }}
        />
      </div>
    </div>
  )
}

export function SkillsBlock() {
  return (
    <Stagger className="t-skills">
      {skillCategories.map((cat) => (
        <Row key={cat.id} className="t-skill-row">
          <span className="t-skill-cat" style={{ color: cat.color }}>
            {cat.label.padEnd(16, ' ')}
          </span>
          <span className="t-skill-list">
            {skills
              .filter((s) => s.category === cat.id)
              .map((s) => s.name)
              .join(' · ')}
          </span>
        </Row>
      ))}
    </Stagger>
  )
}

export function ProjectsBlock() {
  const setProjectIndex = useStore((s) => s.setProjectIndex)
  const setView = useStore((s) => s.setView)
  return (
    <Stagger className="t-projects">
      {projects.map((p, i) => (
        <Row key={p.id} className="t-project-row">
          <button
            type="button"
            className="t-cmd"
            onClick={() => {
              setProjectIndex(i)
              setView('projects')
            }}
          >
            [{String(i + 1).padStart(2, '0')}] {p.title}
          </button>
          <span className="t-dim">{p.tech.join(', ')}</span>
        </Row>
      ))}
    </Stagger>
  )
}

export function ExperienceBlock() {
  const work = timeline.filter((t) => t.kind === 'work')
  return (
    <Stagger className="t-kv">
      {work.map((w) => (
        <Row key={w.id} className="t-exp">
          <div>
            <span className="t-accent">{w.company}</span> — {w.role} <span className="t-dim">({w.duration})</span>
          </div>
          {w.responsibilities.map((r) => (
            <div key={r} className="t-dim">
              {'  ▸ '}
              {r}
            </div>
          ))}
        </Row>
      ))}
    </Stagger>
  )
}

export function EducationBlock() {
  return (
    <Stagger className="t-kv">
      <Row>
        <span className="t-accent">{education.degree}</span>
      </Row>
      <Row>
        {education.school} <span className="t-dim">· {education.university} · {education.years}</span>
      </Row>
      {education.previous?.map((e) => (
        <Row key={e.degree}>
          {e.degree} <span className="t-dim">· {e.school} · {e.years}</span>
        </Row>
      ))}
      {education.certifications.map((c) => (
        <Row key={c.name} className="t-dim">
          {'  ✓ '}
          {c.issuer} — {c.name}
        </Row>
      ))}
    </Stagger>
  )
}

export function ContactBlock() {
  const { links } = profile
  const entries = [
    ['github', links.github],
    ['linkedin', links.linkedin],
    ['email', `mailto:${links.email}`, links.email],
    ...(links.phone ? [['phone', `tel:${links.phone.replace(/\s/g, '')}`, links.phone]] : []),
    ['resume', links.resume],
  ]
  return (
    <Stagger className="t-kv">
      {entries.map(([k, href, label]) => (
        <Row key={k}>
          <span className="t-key">{k.padEnd(9, ' ')}</span>
          <a href={href} target="_blank" rel="noreferrer" className="t-link">
            {label ?? href.replace(/^https?:\/\//, '')}
          </a>
        </Row>
      ))}
    </Stagger>
  )
}

const LOGO = String.raw`
   ██╗  ██╗██╗  ██╗
   ██║  ██║██║ ██╔╝
   ███████║█████╔╝
   ██╔══██║██╔═██╗
   ██║  ██║██║  ██╗
   ╚═╝  ╚═╝╚═╝  ╚═╝`

export function NeofetchBlock() {
  const rows = [
    ['Name', profile.name],
    ['Role', 'AI Engineer · Software Developer'],
    ['Location', profile.location],
    ['Primary Lang', profile.primaryLanguage],
    ['Main Stack', profile.mainStack],
    ['Current Focus', profile.currentFocus],
    ['Status', profile.status],
    ['Shell', 'portfolio-sh 3.0 (react + three.js)'],
    ['Uptime', `${Math.floor(performance.now() / 1000)}s in this session`],
  ]
  return (
    <div className="t-neofetch">
      <pre className="t-logo" aria-hidden="true">{LOGO}</pre>
      <Stagger className="t-neo-info">
        <Row>
          <span className="t-accent">{profile.handle}</span>@<span className="t-accent">{profile.host}</span>
        </Row>
        <Row className="t-dim">{'─'.repeat(22)}</Row>
        {rows.map(([k, v]) => (
          <Row key={k}>
            <span className="t-key">{k}</span>: {v}
          </Row>
        ))}
        <Row className="t-swatches">
          {['#0b0f0e', '#39ff88', '#22e5ff', '#c6ff3d', '#7aa2ff', '#e8fff4'].map((c) => (
            <span key={c} style={{ background: c }} />
          ))}
        </Row>
      </Stagger>
    </div>
  )
}

export function CoffeeBlock() {
  return (
    <pre className="t-coffee" aria-label="A cup of coffee">
      <span className="t-steam">{'   ( (\n    ) )\n'}</span>
      {`  ........
  |      |]
  \\      /
   \`----'`}
    </pre>
  )
}

export function SecretBlock() {
  return (
    <Stagger className="t-secret">
      <Row className="t-accent">▓▓ ACCESS GRANTED ▓▓</Row>
      <Row>You found the hidden layer. Here's the real stack trace:</Row>
      <Row className="t-dim">  at curiosity (brain.py:1)</Row>
      <Row className="t-dim">  at late_night_debugging (coffee.cpp:404)</Row>
      <Row className="t-dim">  at robots_that_understand_language (vla/policy.py:∞)</Row>
      <Row>
        If you read this far, we should talk → <Cmd>contact</Cmd>
      </Row>
    </Stagger>
  )
}

export function LsBlock({ entries }) {
  return (
    <Stagger className="t-ls">
      {entries.map((e) => (
        <Row key={e}>
          <Cmd run={e.replace(/[/.].*$/, '')}>{e}</Cmd>
        </Row>
      ))}
    </Stagger>
  )
}
