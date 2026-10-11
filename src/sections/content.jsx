import { useState } from 'react'
import { education, getProject, profile, projects, skillCategories, skills, timeline } from '../data/profile'
import { asset } from '../lib/assets'
import { useStore } from '../store/useStore'

/*
 * Section content, shared by the 3D panels and the simple page.
 * `mode` is 'panel' (beside the desk) or 'page' (the stacked 2D layout).
 */

export const Chips = ({ items }) => (
  <ul className="chips">
    {items.map((t) => (
      <li key={t} className="chip">
        {t}
      </li>
    ))}
  </ul>
)

const ext = { target: '_blank', rel: 'noreferrer' }

/** Open a project: in the room that means the monitor, on the page it means scrolling to the card. */
export function useOpenProject(mode) {
  const setProjectIndex = useStore((s) => s.setProjectIndex)
  const setView = useStore((s) => s.setView)
  return (id) => {
    const i = projects.findIndex((p) => p.id === id)
    if (i < 0) return
    if (mode === 'page') {
      document.getElementById(`project-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setProjectIndex(i)
    setView('projects')
  }
}

/* ---------- about ---------- */
export function AboutContent() {
  return (
    <>
      <p className="lead">{profile.about}</p>
      <dl className="facts">
        <dt>based in</dt>
        <dd>{profile.location}</dd>
        <dt>focus</dt>
        <dd>{profile.currentFocus}</dd>
        <dt>stack</dt>
        <dd>{profile.mainStack}</dd>
        <dt>status</dt>
        <dd>{profile.status}</dd>
      </dl>
      <div className="links-row">
        <a className="btn small" href={profile.links.resume} {...ext}>
          Résumé (PDF)
        </a>
        <a className="btn small ghost" href={profile.links.linkedin} {...ext}>
          LinkedIn
        </a>
        <a className="btn small ghost" href={profile.links.github} {...ext}>
          GitHub
        </a>
      </div>
    </>
  )
}

/* ---------- projects ---------- */
export function ProjectLinks({ project }) {
  if (!project.live && !project.github) return <p className="form-note">Internal work, so there's no public repository.</p>
  return (
    <div className="links-row">
      {project.live && (
        <a className="btn small" href={project.live} {...ext}>
          Live demo ↗
        </a>
      )}
      {project.github && (
        <a className="btn small ghost" href={project.github} {...ext}>
          Code ↗
        </a>
      )}
    </div>
  )
}

/** Panel version: the project on the monitor, with a pager and an index of the rest. */
export function ProjectsPanelContent() {
  const index = useStore((s) => s.projectIndex)
  const setIndex = useStore((s) => s.setProjectIndex)
  const p = projects[index]
  const step = (d) => setIndex((index + d + projects.length) % projects.length)
  return (
    <>
      <div className="pager">
        <span className="pager-count">
          {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
        </span>
        <span>
          <button type="button" className="copy-btn" onClick={() => step(-1)} aria-label="Previous project">
            ← prev
          </button>{' '}
          <button type="button" className="copy-btn" onClick={() => step(1)} aria-label="Next project">
            next →
          </button>
        </span>
      </div>
      <h2 className="panel-title">{p.title}</h2>
      <p className="lead">{p.short}</p>
      <ul className="bullets">
        {p.details.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
      <p className="label">Built with</p>
      <Chips items={p.tech} />
      <ProjectLinks project={p} />
      <p className="label">All projects</p>
      <ol className="project-index">
        {projects.map((q, i) => (
          <li key={q.id}>
            <button type="button" aria-current={i === index} onClick={() => setIndex(i)}>
              <span className="pi-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="pi-title">{q.title}</span>
              {q.live && <span className="pi-tag">live</span>}
            </button>
          </li>
        ))}
      </ol>
    </>
  )
}

/** Page version: every project as a card, screenshot first. */
export function ProjectsGrid() {
  return (
    <div className="work-grid">
      {projects.map((p, i) => (
        <article key={p.id} id={`project-${p.id}`} className={`work-card ${p.shot ? '' : 'no-shot'}`}>
          {p.shot ? (
            <img className="shot" src={asset(p.shot)} alt={`Screenshot of ${p.title}`} loading="lazy" width="1280" height="800" />
          ) : (
            <div className="card-cover" aria-hidden="true">
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <strong>{p.title}</strong>
            </div>
          )}
          <h3>{p.title}</h3>
          <p>{p.short}</p>
          <Chips items={p.tech} />
          <details>
            <summary className="link-btn">How it works</summary>
            <ul className="bullets" style={{ marginTop: 10 }}>
              {p.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </details>
          <ProjectLinks project={p} />
        </article>
      ))}
    </div>
  )
}

/* ---------- experience ---------- */
export function ExperienceContent() {
  const work = timeline.filter((t) => t.kind === 'work').reverse() // newest first
  const now = timeline.find((t) => t.kind === 'milestone')
  return (
    <>
      {now && (
        <div className="now-note">
          <div>
            {now.responsibilities[0]}
            <div className="status">{now.achievements[0]}</div>
          </div>
        </div>
      )}
      {work.map((w) => {
        const [title, team] = w.role.split(' · ')
        return (
          <section key={w.id} className="role">
            <div className="role-head">
              <h3>{title}</h3>
              <span className="when">{w.duration}</span>
            </div>
            <p className="where">
              {w.company}
              {team ? ` · ${team}` : ''}
            </p>
            <ul className="bullets">
              {w.responsibilities.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <Chips items={w.tech} />
          </section>
        )
      })}
    </>
  )
}

/* ---------- skills ---------- */
const levelLabel = (v) => (v >= 85 ? 'daily driver' : v >= 75 ? 'proficient' : v >= 65 ? 'working knowledge' : 'learning')

export function SkillsContent({ mode }) {
  const focus = useStore((s) => s.skillFocus)
  const setFocus = useStore((s) => s.setSkillFocus)
  const open = useOpenProject(mode)
  const cats = skillCategories.filter((c) => !focus || c.id === focus)
  return (
    <>
      <div className="filter" role="group" aria-label="Filter skills">
        <button type="button" aria-pressed={!focus} onClick={() => setFocus(null)} style={{ '--chip': 'var(--ink-2)' }}>
          All
        </button>
        {skillCategories.map((c) => (
          <button key={c.id} type="button" aria-pressed={focus === c.id} onClick={() => setFocus(focus === c.id ? null : c.id)} style={{ '--chip': c.color }}>
            {c.label}
          </button>
        ))}
      </div>
      {cats.map((c) => (
        <section key={c.id} className="skill-group" style={{ '--chip': c.color }}>
          <h3>{c.label}</h3>
          <ul className="skill-list">
            {skills
              .filter((s) => s.category === c.id)
              .map((s) => {
                const used = s.projects.map(getProject).filter(Boolean)
                return (
                  <li key={s.id}>
                    <span className="skill-name">{s.name}</span>
                    <span className="skill-level">{levelLabel(s.level)}</span>
                    <span className="skill-ctx">{s.context}</span>
                    {used.length > 0 && (
                      <span className="skill-used">
                        {used.map((p) => (
                          <button key={p.id} type="button" className="link-btn" onClick={() => open(p.id)}>
                            {p.title}
                          </button>
                        ))}
                      </span>
                    )}
                  </li>
                )
              })}
          </ul>
        </section>
      ))}
    </>
  )
}

/* ---------- education ---------- */
export function EducationContent() {
  const all = [{ ...education }, ...education.previous]
  return (
    <>
      {all.map((e) => (
        <section key={e.degree} className="edu">
          <h3>{e.degree}</h3>
          <p>{e.school}</p>
          <p>
            {e.university ? `${e.university} · ` : ''}
            {e.years}
          </p>
          {e.grade && <span className="grade">{e.grade}</span>}
        </section>
      ))}
      <p className="label">Certifications</p>
      <ul className="cert-list">
        {education.certifications.map((c) => (
          <li key={c.name}>
            {c.name}
            <span>{c.issuer}</span>
          </li>
        ))}
      </ul>
    </>
  )
}

/* ---------- contact ---------- */
export function ContactContent() {
  const { links } = profile
  const [copied, setCopied] = useState(false)
  const [state, setState] = useState('idle') // idle | sent | error

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(links.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      window.location.href = `mailto:${links.email}`
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    try {
      if (profile.contactFormEndpoint) {
        const res = await fetch(profile.contactFormEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error(res.statusText)
      } else {
        const subject = encodeURIComponent(`Hello from your portfolio — ${data.name}`)
        const body = encodeURIComponent(`${data.message}\n\n${data.name} <${data.email}>`)
        window.location.href = `mailto:${links.email}?subject=${subject}&body=${body}`
      }
      setState('sent')
      form.reset()
    } catch {
      setState('error')
    }
  }

  return (
    <>
      <p className="lead">Email is the quickest way to reach me. I'm available immediately for AI and software engineering roles.</p>
      <ul className="contact-list">
        <li>
          <span className="k">email</span>
          <a className="text-link" href={`mailto:${links.email}`}>
            {links.email}
          </a>
          <button type="button" className="copy-btn" onClick={copy}>
            {copied ? 'copied' : 'copy'}
          </button>
        </li>
        <li>
          <span className="k">phone</span>
          <a className="text-link" href={`tel:${links.phone.replace(/\s/g, '')}`}>
            {links.phone}
          </a>
          <span />
        </li>
        <li>
          <span className="k">linkedin</span>
          <a className="text-link" href={links.linkedin} {...ext}>
            hari-om-kasaundhan
          </a>
          <span />
        </li>
        <li>
          <span className="k">github</span>
          <a className="text-link" href={links.github} {...ext}>
            {links.github.replace('https://github.com/', '')}
          </a>
          <span />
        </li>
        <li>
          <span className="k">résumé</span>
          <a className="text-link" href={links.resume} {...ext}>
            Download PDF
          </a>
          <span />
        </li>
      </ul>
      <p className="label">Or write here</p>
      <form className="form" onSubmit={onSubmit}>
        <label>
          Your name
          <input name="name" required autoComplete="name" />
        </label>
        <label>
          Your email
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label>
          Message
          <textarea name="message" required rows={4} />
        </label>
        <div>
          <button type="submit" className="btn small">
            Send
          </button>
        </div>
        {state === 'sent' && <p className="form-note">{profile.contactFormEndpoint ? 'Sent. Thank you!' : 'Your mail app should open with the message filled in.'}</p>}
        {state === 'error' && <p className="form-note err">That didn't go through. Please email {links.email} directly.</p>}
      </form>
    </>
  )
}
