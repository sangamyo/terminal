import { RoundedBox, Text } from '@react-three/drei'
import { useMemo } from 'react'
import { education, skillCategories, skills } from '../data/profile'
import Hotspot from './Hotspot'
import { FONT_MONO, FONT_SERIF, SPOTS } from './layout'
import { corkTexture, woodTexture } from './textures'

/* ---------- floating shelf with books and two framed certificates (Education) ---------- */

const BOOKS = [
  [0.024, 0.2, '#7a3b2e'],
  [0.03, 0.23, '#2f4f46'],
  [0.02, 0.19, '#d8cbb0'],
  [0.034, 0.215, '#3e5c8a'],
  [0.022, 0.18, '#c9a227'],
  [0.028, 0.225, '#2b2a28'],
  [0.026, 0.2, '#8c5a3c'],
]

export function Shelf() {
  const wood = useMemo(() => woodTexture('#8a6446', 33), [])
  const [x, y, z] = SPOTS.shelf
  const D = 0.2
  let cursor = -0.4
  return (
    <Hotspot view="education" position={[x, y, z + D / 2]} labelAt={[0, 0.42, 0]} lift={0}>
      <RoundedBox args={[0.95, 0.03, D]} radius={0.004} castShadow receiveShadow>
        <meshStandardMaterial map={wood} roughness={0.6} />
      </RoundedBox>
      {BOOKS.map(([w, h, c], i) => {
        const bx = cursor + w / 2
        cursor += w + 0.002
        return (
          <group key={i} position={[bx, 0.015 + h / 2, -0.01]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[w, h, 0.15]} />
              <meshStandardMaterial color={c} roughness={0.75} />
            </mesh>
            <mesh position={[0, h * 0.3, 0.0751]}>
              <planeGeometry args={[w * 0.8, 0.006]} />
              <meshStandardMaterial color="#c9a45c" metalness={0.7} roughness={0.35} />
            </mesh>
          </group>
        )
      })}
      {/* a leaning book */}
      <mesh position={[cursor + 0.04, 0.015 + 0.09, -0.01]} rotation={[0, 0, -0.32]} castShadow>
        <boxGeometry args={[0.026, 0.2, 0.15]} />
        <meshStandardMaterial color="#5b3a5e" roughness={0.75} />
      </mesh>
      <Certificate position={[0.12, 0.015, -0.02]} w={0.2} h={0.15} title={degreeTitle(education.degree)} sub={education.school.split(',')[0]} years={education.years} />
      <Certificate
        position={[0.34, 0.015, -0.03]}
        w={0.15}
        h={0.115}
        title={degreeTitle(education.previous[0].degree)}
        sub={education.previous[0].school.split(',')[0]}
        years={education.previous[0].years}
      />
    </Hotspot>
  )
}

const degreeTitle = (d) => d.replace(' (lateral entry)', '').replace(' — ', ', ')

function Certificate({ position, w, h, title, sub, years }) {
  return (
    <group position={position} rotation={[-0.12, -0.08, 0]}>
      <group position={[0, h / 2, 0]}>
        <RoundedBox args={[w, h, 0.012]} radius={0.002} castShadow>
          <meshStandardMaterial color="#2b2a28" roughness={0.5} />
        </RoundedBox>
        <mesh position={[0, 0, 0.0065]}>
          <planeGeometry args={[w * 0.86, h * 0.84]} />
          <meshStandardMaterial color="#f8f4ea" roughness={0.9} />
        </mesh>
        <Text font={FONT_SERIF} fontSize={w * 0.085} lineHeight={1.1} position={[0, h * 0.16, 0.007]} color="#1d1c1a" anchorX="center" maxWidth={w * 0.8} textAlign="center">
          {title}
        </Text>
        <Text font={FONT_MONO} fontSize={w * 0.04} position={[0, -h * 0.12, 0.007]} color="#5a554c" anchorX="center" maxWidth={w * 0.8} textAlign="center">
          {sub}
        </Text>
        <Text font={FONT_MONO} fontSize={w * 0.045} position={[0, -h * 0.28, 0.007]} color="#b4532a" anchorX="center">
          {years}
        </Text>
      </group>
    </group>
  )
}

/* ---------- cork pinboard with an index card per skill category (Skills) ---------- */

export function Pinboard() {
  const cork = useMemo(() => corkTexture(), [])
  const frameWood = useMemo(() => woodTexture('#6e4b33', 41), [])
  const [x, y, z] = SPOTS.pinboard
  const W = 0.92
  const H = 0.6
  const cards = useMemo(
    () =>
      skillCategories.map((c) => ({
        ...c,
        top: skills
          .filter((s) => s.category === c.id)
          .sort((a, b) => b.level - a.level)
          .slice(0, 3)
          .map((s) => s.name),
      })),
    [],
  )
  const slots = [
    [-0.29, 0.13, 0.03],
    [0.0, 0.15, -0.025],
    [0.29, 0.12, 0.02],
    [-0.15, -0.14, -0.02],
    [0.16, -0.13, 0.035],
  ]
  return (
    <Hotspot view="skills" position={[x, y, z + 0.015]} labelAt={[0, 0.42, 0.05]} lift={0}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[W + 0.04, H + 0.04, 0.025]} />
        <meshStandardMaterial map={frameWood} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.0126]} receiveShadow>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial map={cork} roughness={1} />
      </mesh>
      {cards.map((c, i) => {
        const [cx, cy, rot] = slots[i]
        return (
          <group key={c.id} position={[cx, cy, 0.015]} rotation={[0, 0, rot]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.25, 0.17, 0.0015]} />
              <meshStandardMaterial color="#fbf8f0" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.07, 0.001]}>
              <planeGeometry args={[0.25, 0.006]} />
              <meshBasicMaterial color={c.color} />
            </mesh>
            <Text font={FONT_SERIF} fontSize={0.024} position={[-0.105, 0.04, 0.0012]} anchorX="left" color="#1d1c1a">
              {c.label}
            </Text>
            {c.top.map((name, k) => (
              <Text key={name} font={FONT_MONO} fontSize={0.0115} position={[-0.105, 0.0 - k * 0.022, 0.0012]} anchorX="left" color="#4a463f" maxWidth={0.21}>
                {name}
              </Text>
            ))}
            {/* push pin */}
            <mesh position={[0, 0.062, 0.008]} castShadow>
              <sphereGeometry args={[0.009, 16, 12]} />
              <meshStandardMaterial color={c.color} roughness={0.35} />
            </mesh>
          </group>
        )
      })}
    </Hotspot>
  )
}
