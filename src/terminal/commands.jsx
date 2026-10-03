import { profile } from '../data/profile'
import { useStore } from '../store/useStore'
import {
  CoffeeBlock,
  ContactBlock,
  EducationBlock,
  ExperienceBlock,
  HelpBlock,
  LsBlock,
  NeofetchBlock,
  ProgressBlock,
  ProjectsBlock,
  SecretBlock,
  SkillsBlock,
} from './blocks'

const store = () => useStore.getState()
const openUrl = (url) => window.open(url, '_blank', 'noopener,noreferrer')

/**
 * Command registry. Each command receives a context:
 *   { print, block, sleep, then, clear, args, history }
 * Add a command by adding an entry here — help output is generated automatically.
 */
export const commands = {
  help: {
    desc: 'list available commands',
    run: ({ block }) =>
      block(
        <HelpBlock
          commands={Object.entries(commands)
            .filter(([, c]) => !c.hidden)
            .map(([name, c]) => [name, c.desc])}
        />,
      ),
  },

  about: {
    desc: 'who is behind this terminal',
    run: async ({ print, then }) => {
      print('> Opening developer profile...', { cls: 't-sys' })
      then(() => store().setView('about'))
      print(profile.about)
      print(`role: ${profile.role}`, { cls: 't-dim', speed: 6 })
    },
  },

  skills: {
    desc: 'open the 3D skill universe',
    run: async ({ print, block, then }) => {
      print('> Loading skill matrix...', { cls: 't-sys' })
      block(<ProgressBlock label="mapping neural pathways" />, { hold: 700 })
      then(() => store().setView('skills'))
      block(<SkillsBlock />)
      print('hover (or tap) any floating object to inspect it.', { cls: 't-dim', speed: 6 })
    },
  },

  projects: {
    desc: 'browse the holographic project gallery',
    run: async ({ print, block, then }) => {
      print('> Loading project database...', { cls: 't-sys' })
      block(<ProgressBlock label="decrypting repositories" duration={0.7} />, { hold: 550 })
      then(() => store().setView('projects'))
      block(<ProjectsBlock />)
    },
  },

  experience: {
    desc: 'walk the career timeline',
    run: async ({ print, block, then }) => {
      print('> Fetching career log...', { cls: 't-sys' })
      then(() => store().setView('experience'))
      block(<ExperienceBlock />)
    },
  },

  education: {
    desc: 'degree & certifications',
    run: async ({ print, block, then }) => {
      print('> Mounting /education ...', { cls: 't-sys' })
      then(() => store().setView('education'))
      block(<EducationBlock />)
    },
  },

  github: {
    desc: 'open GitHub profile',
    run: async ({ print, then }) => {
      print(`> Connecting to ${profile.links.github.replace('https://', '')}...`, { cls: 't-sys' })
      then(() => openUrl(profile.links.github))
    },
  },

  resume: {
    desc: 'download resume (PDF)',
    run: async ({ print, then }) => {
      print('> Fetching resume.pdf ...', { cls: 't-sys' })
      then(() => openUrl(profile.links.resume))
      print('opened in a new tab.', { cls: 't-dim' })
    },
  },

  contact: {
    desc: 'open the communication console',
    run: async ({ print, block, then }) => {
      print('> Opening secure channel...', { cls: 't-sys' })
      then(() => store().setView('contact'))
      block(<ContactBlock />)
    },
  },

  clear: {
    desc: 'clear the terminal',
    run: ({ clear }) => clear(),
  },

  '3d': {
    desc: 'enter the immersive 3D workspace',
    run: async ({ print, then, args }) => {
      const s = store()
      if (s.quality === 'off') {
        if (!s.webgl) {
          print('error: WebGL is not available on this device.', { cls: 't-err' })
          return
        }
        if (!args.includes('--force')) {
          print('3D is disabled on this device to keep things fast.', { cls: 't-warn' })
          print("run '3d --force' to enable it anyway.", { cls: 't-dim' })
          return
        }
        s.setQuality('low')
      }
      print('> Entering 3D workspace...', { cls: 't-sys' })
      print('drag to orbit · scroll to zoom · click an orbiting domain to fly there · Esc to exit', { cls: 't-dim', speed: 4 })
      then(() => store().setView('immersive'))
    },
  },

  matrix: {
    desc: 'toggle digital rain',
    run: async ({ print }) => {
      const on = !store().matrix
      store().setMatrix(on)
      print(on ? 'Wake up, Neo… (press any key or click to exit)' : 'Back to reality.', { cls: 't-sys' })
    },
  },

  /* ---------- extras ---------- */

  ls: {
    desc: 'list workspace',
    run: ({ block }) =>
      block(<LsBlock entries={['about.md', 'skills/', 'projects/', 'experience.log', 'education/', 'contact.sh', 'resume.pdf']} />),
  },

  home: {
    desc: 'return to the terminal view',
    run: async ({ print, then }) => {
      then(() => store().setView('terminal'))
      print('~', { cls: 't-dim', speed: 0 })
    },
  },

  exit: {
    desc: 'end session',
    run: async ({ print, then }) => {
      print('> closing session...', { cls: 't-sys' })
      then(() => store().setFinale(true))
    },
  },

  /* ---------- easter eggs (hidden from help) ---------- */

  whoami: {
    hidden: true,
    run: ({ print }) => print('hariom — AI Engineer building intelligent systems.', { cls: 't-accent' }),
  },

  neofetch: {
    hidden: true,
    run: ({ block }) => block(<NeofetchBlock />),
  },

  sudo: {
    hidden: true,
    run: async ({ print, sleep, args, then }) => {
      if (!args.length) {
        print('usage: sudo <command>', { cls: 't-dim' })
        return
      }
      print(`[sudo] password for visitor: `, { cls: 't-dim', speed: 0 })
      sleep(700)
      if (args.join(' ').startsWith('rm -rf')) {
        then(() => store().triggerGlitch())
        print('nice try. this filesystem is protected by a very anxious neural network.', { cls: 't-err' })
        return
      }
      print('visitor is not in the sudoers file. This incident will be reported… to /dev/null.', { cls: 't-err' })
      print("tip: you don't need root — just type 'contact'.", { cls: 't-dim' })
    },
  },

  coffee: {
    hidden: true,
    run: async ({ print, block }) => {
      print('> brewing coffee.exe ...', { cls: 't-sys' })
      block(<ProgressBlock label="grinding beans" duration={1.1} />, { hold: 1100 })
      block(<CoffeeBlock />)
      print('coffee ready. productivity +42%.', { cls: 't-accent' })
    },
  },

  secret: {
    hidden: true,
    run: async ({ print, block, sleep, then }) => {
      print('> decrypting hidden partition...', { cls: 't-sys' })
      then(() => store().triggerGlitch())
      sleep(500)
      block(<SecretBlock />)
    },
  },

  echo: { hidden: true, run: ({ print, args }) => print(args.join(' ') || ' ', { speed: 0 }) },
  date: { hidden: true, run: ({ print }) => print(new Date().toString(), { speed: 0 }) },
  history: {
    hidden: true,
    run: ({ print, history }) => print(history.map((h, i) => `${String(i + 1).padStart(4)}  ${h}`).join('\n') || '(empty)', { speed: 0 }),
  },
  pwd: { hidden: true, run: ({ print }) => print(`/home/${profile.handle}/workspace`, { speed: 0 }) },
  hello: { hidden: true, run: ({ print }) => print("hey 👋 glad you're here. try 'neofetch'.") },
  hi: { hidden: true, run: ({ print }) => print("hey 👋 glad you're here. try 'neofetch'.") },
}

const aliases = {
  cls: 'clear',
  '?': 'help',
  man: 'help',
  cv: 'resume',
  work: 'experience',
  edu: 'education',
  cd: 'home',
  quit: 'exit',
  bye: 'exit',
  logout: 'exit',
  terminal: 'home',
  fetch: 'neofetch',
  email: 'contact',
}

export const commandNames = Object.keys(commands)

export function resolveCommand(name) {
  const key = name.toLowerCase()
  return commands[key] ? key : aliases[key] ?? null
}

/** Closest command by edit distance, for "did you mean" hints. */
export function suggest(name) {
  const visible = Object.entries(commands)
    .filter(([, c]) => !c.hidden)
    .map(([n]) => n)
  let best = null
  let bestScore = 3
  for (const c of visible) {
    const d = levenshtein(name.toLowerCase(), c)
    if (d < bestScore) {
      bestScore = d
      best = c
    }
  }
  return best
}

function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
  return dp[a.length][b.length]
}
