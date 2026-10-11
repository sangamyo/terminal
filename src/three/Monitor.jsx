import { RoundedBox, useTexture } from '@react-three/drei'
import { useEffect, useMemo, useState } from 'react'
import { CanvasTexture, SRGBColorSpace } from 'three'
import { projects } from '../data/profile'
import { useStore } from '../store/useStore'
import Hotspot from './Hotspot'
import { asset, SPOTS } from './layout'

const SCREEN_W = 0.624
const SCREEN_H = 0.39
const withShots = projects.map((p, i) => [p, i]).filter(([p]) => p.shot)

/** 27" monitor on a stand. The screen shows the selected project; the home view cycles through live ones. */
export default function Monitor() {
  const view = useStore((s) => s.view)
  const projectIndex = useStore((s) => s.projectIndex)
  const reduced = useStore((s) => s.reducedMotion)
  const [ambient, setAmbient] = useState(0)

  useEffect(() => {
    if (view === 'projects' || reduced) return
    const id = setInterval(() => setAmbient((a) => (a + 1) % withShots.length), 6500)
    return () => clearInterval(id)
  }, [view, reduced])

  const index = view === 'projects' ? projectIndex : withShots[ambient][1]

  return (
    <Hotspot
      view="projects"
      position={SPOTS.monitor}
      labelAt={[0, 0.7, 0]}
      lift={0}
      onSelect={() => {
        const s = useStore.getState()
        if (s.view === 'projects') s.setProjectIndex((s.projectIndex + 1) % projects.length)
        else s.setView('projects')
      }}
    >
      <group position={[0, 0.42, 0]}>
        <RoundedBox args={[0.66, 0.42, 0.024]} radius={0.01} smoothness={4} castShadow>
          <meshStandardMaterial color="#1c1c1e" roughness={0.35} metalness={0.4} />
        </RoundedBox>
        <mesh position={[0, 0.004, 0.0125]}>
          <planeGeometry args={[SCREEN_W, SCREEN_H]} />
          <ScreenMaterial index={index} />
        </mesh>
        {/* chin logo dot */}
        <mesh position={[0, -0.2, 0.0125]}>
          <circleGeometry args={[0.003, 16]} />
          <meshBasicMaterial color="#4a4a4c" />
        </mesh>
      </group>
      {/* stand */}
      <mesh position={[0, 0.2, -0.045]} rotation={[0.08, 0, 0]} castShadow>
        <boxGeometry args={[0.06, 0.4, 0.014]} />
        <meshStandardMaterial color="#b9b6b0" roughness={0.3} metalness={0.85} />
      </mesh>
      <mesh position={[0, 0.005, -0.03]} scale={[1, 1, 0.75]} castShadow receiveShadow>
        <cylinderGeometry args={[0.11, 0.115, 0.01, 40]} />
        <meshStandardMaterial color="#b9b6b0" roughness={0.3} metalness={0.85} />
      </mesh>
    </Hotspot>
  )
}

function ScreenMaterial({ index }) {
  const shots = useTexture(withShots.map(([p]) => asset(p.shot)))
  const cards = useTitleCards()
  const shotTex = useMemo(() => {
    const map = new Map()
    withShots.forEach(([, i], k) => {
      shots[k].colorSpace = SRGBColorSpace
      shots[k].anisotropy = 8
      map.set(i, shots[k])
    })
    return map
  }, [shots])
  const map = shotTex.get(index) ?? cards[index]
  return <meshBasicMaterial map={map} toneMapped={false} color={map ? '#ffffff' : '#222'} />
}

/** Typeset cards (1280×800) for projects that have no screenshot, drawn once the web fonts are ready. */
function useTitleCards() {
  const [cards, setCards] = useState({})
  useEffect(() => {
    let cancelled = false
    Promise.all(['500 80px Newsreader', '400 30px "IBM Plex Sans"', '500 22px "IBM Plex Mono"'].map((f) => document.fonts.load(f)))
      .catch(() => {})
      .then(() => {
        if (cancelled) return
        const out = {}
        projects.forEach((p, i) => {
          if (!p.shot) out[i] = drawCard(p, i)
        })
        setCards(out)
      })
    return () => {
      cancelled = true
    }
  }, [])
  return cards
}

function drawCard(p, i) {
  const W = 1280
  const H = 800
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')
  g.fillStyle = '#f3efe7'
  g.fillRect(0, 0, W, H)
  g.fillStyle = '#b4532a'
  g.fillRect(96, 96, 56, 6)
  g.fillStyle = '#6b665d'
  g.font = '500 22px "IBM Plex Mono", monospace'
  g.fillText(`PROJECT ${String(i + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}`, 96, 150)
  g.fillStyle = '#1d1c1a'
  g.font = '500 84px Newsreader, Georgia, serif'
  const titleBottom = wrap(g, p.title, 96, 260, W - 192, 92)
  g.fillStyle = '#4a463f'
  g.font = '400 30px "IBM Plex Sans", system-ui, sans-serif'
  wrap(g, p.short, 96, titleBottom + 70, W - 260, 44)
  g.fillStyle = '#6b665d'
  g.font = '500 22px "IBM Plex Mono", monospace'
  g.fillText(p.tech.join('  ·  '), 96, H - 120)
  g.fillText(p.github ? 'Source on GitHub' : 'No public repository', 96, H - 80)
  const tex = new CanvasTexture(c)
  tex.colorSpace = SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

function wrap(g, text, x, y, maxW, lh) {
  let line = ''
  for (const word of text.split(' ')) {
    const test = line ? `${line} ${word}` : word
    if (g.measureText(test).width > maxW && line) {
      g.fillText(line, x, y)
      line = word
      y += lh
    } else line = test
  }
  g.fillText(line, x, y)
  return y
}
