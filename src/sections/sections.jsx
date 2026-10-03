import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { education, getCategory, getProject, profile, projects, skillCategories, skills, timeline } from '../data/profile'
import { useStore } from '../store/useStore'
import Panel, { Chips, Meter } from './Panel'

const levelLabel = (v) => (v >= 85 ? 'Advanced' : v >= 70 ? 'Proficient' : v >= 55 ? 'Working knowledge' : 'Exploring')

/* ------------------------------------------------------------------ */
export function AboutPanel() {
  const runCommand = useStore((s) => s.runCommand)
  const facts = [
    ['location', profile.location],
    ['focus', profile.currentFocus],
    ['stack', profile.mainStack],
    ['status', profile.status],
  ]
  return (
    <Panel path="about.md" kicker="developer profile" title={profile.name}>
      <p className="panel-role">{profile.role}</p>
      <p className="panel-lead">{profile.about}</p>
      <dl className="facts">
        {facts.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <Chips items={['Generative AI', 'Computer Vision', 'Robot Learning', 'VLA', 'LLMs', 'Software Engineering']} />
      <div className="actions">
        <button type="button" className="btn" onClick={() => runCommand('skills')}>
          ▸ skills
        </button>
        <button type="button" className="btn" onClick={() => runCommand('projects')}>
          ▸ projects
        </button>
        <a className="btn btn-cyan" href={profile.links.resume} target="_blank" rel="noreferrer">
          ↓ resume
        </a>
      </div>
    </Panel>
  )
}

/* ------------------------------------------------------------------ */
export function SkillsPanel() {
  const hovered = useStore((s) => s.hoveredSkill)
  const setHovered = useStore((s) => s.setHoveredSkill)
  const focus = useStore((s) => s.skillFocus)
  const setFocus = useStore((s) => s.setSkillFocus)
  const quality = useStore((s) => s.quality)
  const [pinned, setPinned] = useState(null)
  const skill = skills.find((s) => s.id === (hovered ?? pinned))

  // Keep the last inspected skill visible after the pointer leaves the 3D card.
  useEffect(() => {
    if (hovered) setPinned(hovered)
  }, [hovered])

  return (
    <Panel path="skills/" kicker="skill matrix" title="Skill Universe">
      <div className="filter" role="group" aria-label="Filter by category">
        <button type="button" className={`filter-btn ${!focus ? 'is-active' : ''}`} onClick={() => setFocus(null)}>
          all
        </button>
        {skillCategories.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`filter-btn ${focus === c.id ? 'is-active' : ''}`}
            style={{ '--chip': c.color }}
            onClick={() => setFocus(focus === c.id ? null : c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {skill ? (
          <SkillInfo key={skill.id} skill={skill} />
        ) : (
          <motion.p key="hint" className="panel-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {quality === 'off' ? 'Tap a skill below to inspect it.' : 'Hover a floating card to inspect it · drag the globe to rotate.'}
          </motion.p>
        )}
      </AnimatePresence>

      {quality === 'off' && (
        <div className="skill-grid">
          {skillCategories
            .filter((c) => !focus || focus === c.id)
            .map((c) => (
              <section key={c.id}>
                <h3 className="skill-grid-title" style={{ color: c.color }}>
                  {c.label}
                </h3>
                <div className="skill-grid-items">
                  {skills
                    .filter((s) => s.category === c.id)
                    .map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className={`skill-pill ${skill?.id === s.id ? 'is-active' : ''}`}
                        style={{ '--chip': c.color }}
                        onClick={() => setHovered(s.id)}
                      >
                        {s.name}
                      </button>
                    ))}
                </div>
              </section>
            ))}
        </div>
      )}
    </Panel>
  )
}

function SkillInfo({ skill }) {
  const cat = getCategory(skill.category)
  const related = skill.projects.map(getProject).filter(Boolean)
  const setProjectIndex = useStore((s) => s.setProjectIndex)
  const runCommand = useStore((s) => s.runCommand)
  return (
    <motion.div className="skill-info" style={{ '--chip': cat.color }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
      <div className="skill-info-head">
        <span className="skill-info-cat">{cat.label}</span>
        <span className="skill-info-level">{levelLabel(skill.level)}</span>
      </div>
      <h3 className="skill-info-name">{skill.name}</h3>
      <Meter value={skill.level} color={cat.color} />
      <p className="skill-info-ctx">{skill.context}</p>
      {related.length > 0 && (
        <div className="skill-related">
          <span className="label">related projects</span>
          {related.map((p) => (
            <button
              key={p.id}
              type="button"
              className="link-btn"
              onClick={() => {
                setProjectIndex(projects.indexOf(p))
                runCommand('projects')
              }}
            >
              ↳ {p.title}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
export function ProjectsPanel() {
  const index = useStore((s) => s.projectIndex)
  const setIndex = useStore((s) => s.setProjectIndex)
  const quality = useStore((s) => s.quality)
  const project = projects[index]
  const step = (d) => setIndex((index + d + projects.length) % projects.length)

  useEffect(() => {
    const onKey = (e) => {
      if (document.activeElement?.tagName === 'INPUT' || useStore.getState().projectDetails) return
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (quality === 'off') {
    return (
      <Panel path="projects/" kicker="project database" title="Projects" wide>
        <div className="project-list">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </Panel>
    )
  }

  return (
    <Panel path={`projects/${project.id}`} kicker={`project ${index + 1} / ${projects.length}`} title={project.title}>
      <AnimatePresence mode="wait">
        <motion.div key={project.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <ProjectBody project={project} />
        </motion.div>
      </AnimatePresence>
      <div className="pager">
        <button type="button" className="btn btn-ghost" onClick={() => step(-1)} aria-label="Previous project">
          ← prev
        </button>
        <div className="pager-dots">
          {projects.map((p, i) => (
            <button key={p.id} type="button" className={`dot ${i === index ? 'is-active' : ''}`} onClick={() => setIndex(i)} aria-label={p.title} />
          ))}
        </div>
        <button type="button" className="btn btn-ghost" onClick={() => step(1)} aria-label="Next project">
          next →
        </button>
      </div>
    </Panel>
  )
}

function ProjectBody({ project }) {
  const setDetails = useStore((s) => s.setProjectDetails)
  return (
    <>
      <p className="panel-lead">{project.short}</p>
      <Chips items={project.tech} />
      <div className="actions">
        <a className="btn" href={project.github} target="_blank" rel="noreferrer">
          ⌥ GitHub
        </a>
        {project.live && (
          <a className="btn btn-cyan" href={project.live} target="_blank" rel="noreferrer">
            ▶ Live Demo
          </a>
        )}
        <button type="button" className="btn btn-ghost" onClick={() => setDetails(project.id)}>
          ⋯ View Details
        </button>
      </div>
    </>
  )
}

function ProjectCard({ project, index }) {
  return (
    <article className="project-card">
      <div className="project-card-head">
        <span className="project-id">PRJ_{String(index + 1).padStart(2, '0')}</span>
        <span className="project-glyph" aria-hidden="true">
          {{ face: '◉', traffic: '⊕', resume: '▤', voice: '◍', style: '✦', robot: '⌬', algo: '▥', hand: '✋' }[project.visual]}
        </span>
      </div>
      <h3>{project.title}</h3>
      <ProjectBody project={project} />
    </article>
  )
}

export function ProjectDetails() {
  const id = useStore((s) => s.projectDetails)
  const setDetails = useStore((s) => s.setProjectDetails)
  const project = id && getProject(id)

  useEffect(() => {
    if (!id) return
    const onKey = (e) => e.key === 'Escape' && (e.stopImmediatePropagation(), setDetails(null))
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [id, setDetails])

  return (
    <AnimatePresence>
      {project && (
        <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDetails(null)}>
          <motion.div
            className="modal glass"
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="panel-bar">
              <span className="panel-path">cat projects/{project.id}/README.md</span>
              <button type="button" className="panel-close" onClick={() => setDetails(null)} autoFocus>
                esc ✕
              </button>
            </div>
            <div className="panel-body">
              <h2 className="panel-title">{project.title}</h2>
              <p className="panel-lead">{project.short}</p>
              <h3 className="label">highlights</h3>
              <ul className="bullets">
                {project.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <h3 className="label">stack</h3>
              <Chips items={project.tech} />
              <div className="actions">
                <a className="btn" href={project.github} target="_blank" rel="noreferrer">
                  ⌥ GitHub
                </a>
                {project.live && (
                  <a className="btn btn-cyan" href={project.live} target="_blank" rel="noreferrer">
                    ▶ Live Demo
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------ */
export function ExperiencePanel() {
  const index = useStore((s) => s.timelineIndex)
  const setIndex = useStore((s) => s.setTimelineIndex)
  const item = timeline[index]
  return (
    <Panel path="experience.log" kicker="career timeline" title="Experience">
      <ol className="steps" aria-label="Timeline">
        {timeline.map((t, i) => (
          <li key={t.id}>
            <button type="button" className={`step ${i === index ? 'is-active' : ''} ${t.kind === 'work' ? 'is-work' : ''}`} onClick={() => setIndex(i)}>
              <span className="step-dot" />
              <span className="step-date">{t.duration}</span>
              <span className="step-name">{t.kind === 'work' ? t.company : t.role}</span>
            </button>
          </li>
        ))}
      </ol>
      <AnimatePresence mode="wait">
        <motion.div key={item.id} className="exp-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <dl className="facts">
            <div>
              <dt>{item.kind === 'work' ? 'company' : 'where'}</dt>
              <dd>{item.company}</dd>
            </div>
            <div>
              <dt>role</dt>
              <dd>{item.role}</dd>
            </div>
            <div>
              <dt>duration</dt>
              <dd>{item.duration}</dd>
            </div>
          </dl>
          <h3 className="label">{item.kind === 'work' ? 'responsibilities' : 'what happened'}</h3>
          <ul className="bullets">
            {item.responsibilities.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <h3 className="label">technologies</h3>
          <Chips items={item.tech} />
          <h3 className="label">key achievements</h3>
          <ul className="bullets is-achievements">
            {item.achievements.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </Panel>
  )
}

/* ------------------------------------------------------------------ */
export function EducationPanel() {
  return (
    <Panel path="education/" kicker="education module" title={education.degree}>
      <p className="panel-role">{education.school}</p>
      <p className="panel-lead">
        {education.university} · {education.years}
      </p>
      {education.previous?.map((e) => (
        <div key={e.degree} className="cert prev-edu">
          <span className="cert-badge">DIP</span>
          <div>
            <div className="cert-name">{e.degree}</div>
            <div className="cert-issuer">
              {e.school} · {e.years}
            </div>
          </div>
        </div>
      ))}
      <h3 className="label">certifications</h3>
      <div className="certs">
        {education.certifications.map((c) => (
          <div key={c.name} className="cert">
            <span className="cert-badge">{c.badge}</span>
            <div>
              <div className="cert-name">{c.name}</div>
              <div className="cert-issuer">{c.issuer}</div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

/* ------------------------------------------------------------------ */
export function ContactPanel() {
  const { links } = profile
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [log, setLog] = useState([])

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    setStatus('sending')
    setLog(['> encrypting payload...', '> opening socket...'])
    try {
      if (profile.contactFormEndpoint) {
        const res = await fetch(profile.contactFormEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error(res.statusText)
        setLog((l) => [...l, '> message delivered. ✓'])
      } else {
        const subject = encodeURIComponent(`Portfolio contact from ${data.name}`)
        const body = encodeURIComponent(`${data.message}\n\n— ${data.name} <${data.email}>`)
        window.location.href = `mailto:${links.email}?subject=${subject}&body=${body}`
        setLog((l) => [...l, '> handing off to your mail client. ✓'])
      }
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
      setLog((l) => [...l, `> transmission failed. email me directly: ${links.email}`])
    }
  }

  return (
    <Panel path="contact.sh" kicker="communication console" title="Establish connection">
      <div className="actions contact-links">
        <a className="btn" href={links.github} target="_blank" rel="noreferrer">
          ⌥ GitHub
        </a>
        <a className="btn" href={links.linkedin} target="_blank" rel="noreferrer">
          in LinkedIn
        </a>
        <a className="btn" href={`mailto:${links.email}`}>
          @ Email
        </a>
        {links.phone && (
          <a className="btn" href={`tel:${links.phone.replace(/\s/g, '')}`}>
            ☏ Call
          </a>
        )}
        <a className="btn btn-cyan" href={links.resume} target="_blank" rel="noreferrer">
          ↓ Resume
        </a>
      </div>

      <form className="form" onSubmit={onSubmit}>
        <label>
          <span>name</span>
          <input name="name" required autoComplete="name" placeholder="Ada Lovelace" />
        </label>
        <label>
          <span>email</span>
          <input name="email" type="email" required autoComplete="email" placeholder="ada@example.com" />
        </label>
        <label>
          <span>message</span>
          <textarea name="message" required rows={4} placeholder="Let's build something intelligent…" />
        </label>
        <button type="submit" className="btn" disabled={status === 'sending'}>
          {status === 'sending' ? 'transmitting…' : '▸ Send Message'}
        </button>
        {log.length > 0 && (
          <pre className={`form-log ${status === 'error' ? 'is-error' : ''}`} aria-live="polite">
            {log.join('\n')}
          </pre>
        )}
      </form>
    </Panel>
  )
}

/* ------------------------------------------------------------------ */
export function ImmersiveHud() {
  const runCommand = useStore((s) => s.runCommand)
  return (
    <motion.div className="immersive-hud glass" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} transition={{ delay: 0.6 }}>
      <span>drag to orbit · scroll to zoom · click a domain to fly there</span>
      <button type="button" className="btn btn-ghost" onClick={() => runCommand('home')}>
        exit 3D
      </button>
    </motion.div>
  )
}

const PANELS = {
  about: AboutPanel,
  skills: SkillsPanel,
  projects: ProjectsPanel,
  experience: ExperiencePanel,
  education: EducationPanel,
  contact: ContactPanel,
  immersive: ImmersiveHud,
}

export default function SectionLayer() {
  const view = useStore((s) => s.view)
  const Current = PANELS[view]
  return (
    <>
      <AnimatePresence mode="wait">{Current && <Current key={view} />}</AnimatePresence>
      <ProjectDetails />
    </>
  )
}
