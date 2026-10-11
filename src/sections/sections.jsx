import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { profile, projects } from '../data/profile'
import { useStore } from '../store/useStore'
import { AboutContent, ContactContent, EducationContent, ExperienceContent, ProjectsPanelContent, SkillsContent } from './content'
import Panel from './Panel'

const PANELS = {
  about: () => (
    <Panel crumb="About" title={profile.name}>
      <AboutContent />
    </Panel>
  ),
  projects: () => (
    <Panel crumb="Projects · on the monitor">
      <ProjectsPanelContent />
    </Panel>
  ),
  experience: () => (
    <Panel crumb="Experience · the robot arm" title="Where I've worked">
      <ExperienceContent />
    </Panel>
  ),
  skills: () => (
    <Panel crumb="Skills · the pinboard" title="What I work with">
      <SkillsContent mode="panel" />
    </Panel>
  ),
  education: () => (
    <Panel crumb="Education · the shelf" title="Education">
      <EducationContent />
    </Panel>
  ),
  contact: () => (
    <Panel crumb="Contact · the notepad" title="Say hello">
      <ContactContent />
    </Panel>
  ),
}

/** The panel for the current view, plus the intro on the home view. */
export default function SectionLayer() {
  const view = useStore((s) => s.view)
  const Current = PANELS[view]
  useProjectKeys(view === 'projects')
  return (
    <>
      <AnimatePresence>{view === 'home' && <Scrim key="scrim" />}</AnimatePresence>
      <AnimatePresence mode="wait">
        {view === 'home' ? <Hero key="hero" /> : view === 'explore' ? <ExploreBar key="explore" /> : Current ? <Current key={view} /> : null}
      </AnimatePresence>
    </>
  )
}

function Hero() {
  const setView = useStore((s) => s.setView)
  const reduced = useStore((s) => s.reducedMotion)
  return (
    <motion.section
      className="hero"
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      aria-label="Introduction"
    >
      <p className="eyebrow">AI Engineer · Software Engineer</p>
      <h1>
        I build Python backends, LLM data tools and <em>datasets that teach robots.</em>
      </h1>
      <p className="lede">
        Robotics &amp; AI Intern at Addverb Technologies, building teleoperated manipulation datasets for VLA models. Before that, MERN platforms and APIs at
        PureWashr. B.Tech CSE, 2026.
      </p>
      <div className="status">Available immediately · Greater Noida, India</div>
      <div className="cta-row">
        <button type="button" className="btn" onClick={() => setView('projects')}>
          See the work →
        </button>
        <a className="btn ghost" href={profile.links.resume} target="_blank" rel="noreferrer">
          Résumé (PDF)
        </a>
      </div>
      <p className="desk-hint">
        Everything on the desk opens something: the <b>monitor</b>, the <b>robot arm</b>, the <b>shelf</b>, the <b>pinboard</b>, the <b>notepad</b>. The{' '}
        <b>lamp</b> switches day and night.
      </p>
    </motion.section>
  )
}

/** A paper-coloured fade behind the intro so the text never sits on a busy part of the room. */
function Scrim() {
  return <motion.div className="hero-scrim" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} />
}

function ExploreBar() {
  const setView = useStore((s) => s.setView)
  return (
    <motion.div className="explore-bar" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      Drag to look around · scroll to zoom · click any object
      <button type="button" className="btn small ghost" onClick={() => setView('home')}>
        Done
      </button>
    </motion.div>
  )
}

/** ←/→ flip through projects while the monitor is in view. */
function useProjectKeys(active) {
  useEffect(() => {
    if (!active) return
    const onKey = (e) => {
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      const s = useStore.getState()
      if (s.paletteOpen || s.terminalOpen) return
      if (e.key === 'ArrowRight') s.setProjectIndex((s.projectIndex + 1) % projects.length)
      if (e.key === 'ArrowLeft') s.setProjectIndex((s.projectIndex - 1 + projects.length) % projects.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])
}
