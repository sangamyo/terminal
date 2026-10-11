import { profile } from '../data/profile'
import { useStore } from '../store/useStore'
import { AboutContent, ContactContent, EducationContent, ExperienceContent, ProjectsGrid, SkillsContent } from './content'

const SECTIONS = [
  ['work', 'Selected work', () => <ProjectsGrid />],
  ['experience', 'Experience', () => <ExperienceContent />],
  ['skills', 'Skills', () => <SkillsContent mode="page" />],
  ['education', 'Education', () => <EducationContent />],
  ['contact', 'Contact', () => <ContactContent />],
]

/** The whole portfolio as one readable page: used on phones, without WebGL, or by choice. */
export default function LitePage() {
  const webgl = useStore((s) => s.webgl)
  const setQuality = useStore((s) => s.setQuality)
  return (
    <main className="lite" id="top">
      <section className="lite-hero">
        <div>
          <p className="eyebrow">AI Engineer · Software Engineer</p>
          <h1>
            I build Python backends, LLM data tools and <em>datasets that teach robots.</em>
          </h1>
          <div className="status">Available immediately · Greater Noida, India</div>
          <div className="cta-row">
            <a className="btn" href="#work">
              See the work ↓
            </a>
            <a className="btn ghost" href={profile.links.resume} target="_blank" rel="noreferrer">
              Résumé (PDF)
            </a>
          </div>
        </div>
        <aside>
          <AboutContent />
          {webgl && (
            <p className="desk-hint" style={{ marginTop: 22 }}>
              There's also an interactive 3D version of this page.{' '}
              <button type="button" className="link-btn" onClick={() => setQuality('low')}>
                Open the 3D desk
              </button>
            </p>
          )}
        </aside>
      </section>

      {SECTIONS.map(([id, title, Body], i) => (
        <section key={id} id={id} className="lite-section">
          <header>
            <span className="num">{String(i + 1).padStart(2, '0')}</span>
            <h2>{title}</h2>
          </header>
          <div>
            <Body />
          </div>
        </section>
      ))}

      <footer className="lite-foot">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <a className="text-link" href="#top">
          Back to top ↑
        </a>
      </footer>
    </main>
  )
}
