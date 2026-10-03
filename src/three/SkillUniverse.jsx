import { Billboard, Line, RoundedBox, Sparkles, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { memo, useMemo, useRef } from 'react'
import { MathUtils } from 'three'
import { skillCategories, skills } from '../data/profile'
import { useStore } from '../store/useStore'
import { ANCHORS, FONT_MONO } from './layout'
import { neon } from './materials'

const RADIUS = 5
const BAND_LAT = { ai: 0.62, cv: 0.2, robotics: -0.22, software: -0.62 }
const CARD_H = 0.58
/** Card width grows with the label so names never wrap. */
const cardWidth = (name) => MathUtils.clamp(0.62 + name.length * 0.112, 1.35, 3)

const framePoints = (width) => {
  const w = width / 2 + 0.02
  const h = CARD_H / 2 + 0.02
  return [[-w, -h, 0], [w, -h, 0], [w, h, 0], [-w, h, 0], [-w, -h, 0]]
}

/** Technologies arranged on a slowly rotating globe, banded by category. Drag to spin. */
export default function SkillUniverse() {
  const group = useRef()
  const velocity = useRef(0)
  const dragging = useRef(false)

  const placed = useMemo(() => {
    return skillCategories.flatMap((cat, ci) => {
      const items = skills.filter((s) => s.category === cat.id)
      const lat = BAND_LAT[cat.id]
      return items.map((skill, i) => {
        const lon = (i / items.length) * Math.PI * 2 + ci * 0.6
        const r = RADIUS * Math.cos(lat)
        return {
          skill,
          color: cat.color,
          position: [Math.cos(lon) * r, Math.sin(lat) * RADIUS, Math.sin(lon) * r],
        }
      })
    })
  }, [])

  useFrame((_, dt) => {
    const s = useStore.getState()
    const idle = !s.hoveredSkill && !dragging.current && !s.reducedMotion
    velocity.current = MathUtils.damp(velocity.current, idle ? 0.12 : 0, dragging.current ? 0 : 1.5, dt)
    group.current.rotation.y += velocity.current * dt
  })

  return (
    <group position={ANCHORS.skills}>
      {/* drag surface (inside the cards so it never steals hover) */}
      <mesh
        onPointerDown={(e) => {
          e.stopPropagation()
          dragging.current = true
          e.target.setPointerCapture?.(e.pointerId)
        }}
        onPointerMove={(e) => {
          if (!dragging.current) return
          group.current.rotation.y += e.movementX * 0.006
          velocity.current = e.movementX * 0.35
        }}
        onPointerUp={(e) => {
          dragging.current = false
          e.target.releasePointerCapture?.(e.pointerId)
        }}
      >
        <sphereGeometry args={[RADIUS - 0.6, 24, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* latitude guides */}
      {Object.values(BAND_LAT).map((lat) => (
        <mesh key={lat} position={[0, Math.sin(lat) * RADIUS, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[RADIUS * Math.cos(lat), 0.005, 4, 160]} />
          <meshBasicMaterial color={neon('#1fbf77', 1)} transparent opacity={0.25} toneMapped={false} />
        </mesh>
      ))}
      <mesh>
        <icosahedronGeometry args={[0.7, 2]} />
        <meshBasicMaterial color={neon('#39ff88', 1.5)} wireframe toneMapped={false} />
      </mesh>

      <group ref={group}>
        {placed.map((p) => (
          <SkillCard key={p.skill.id} {...p} />
        ))}
      </group>
    </group>
  )
}

const SkillCard = memo(function SkillCard({ skill, color, position }) {
  const inner = useRef()
  const glow = useRef()
  const hovered = useStore((s) => s.hoveredSkill === skill.id)
  const focus = useStore((s) => s.skillFocus)
  const dimmed = focus && focus !== skill.category
  const setHoveredSkill = useStore((s) => s.setHoveredSkill)
  const CARD_W = useMemo(() => cardWidth(skill.name), [skill.name])
  const frame = useMemo(() => framePoints(CARD_W), [CARD_W])

  useFrame((_, dt) => {
    const g = inner.current
    // Full 360° flip on hover; both faces carry text so it stays readable.
    g.rotation.y = MathUtils.damp(g.rotation.y, hovered ? Math.PI * 2 : 0, 4, dt)
    const target = hovered ? 1.22 : dimmed ? 0.82 : 1
    g.scale.setScalar(MathUtils.damp(g.scale.x, target, 6, dt))
    if (glow.current) glow.current.material.opacity = MathUtils.damp(glow.current.material.opacity, hovered ? 0.95 : dimmed ? 0.15 : 0.45, 6, dt)
  })

  const face = (back) => (
    <group rotation={[0, back ? Math.PI : 0, 0]} position={[0, 0, back ? -0.04 : 0.04]}>
      <mesh position={[-CARD_W / 2 + 0.08, 0, 0.001]}>
        <planeGeometry args={[0.035, CARD_H - 0.16]} />
        <meshBasicMaterial color={neon(color, 2.4)} toneMapped={false} />
      </mesh>
      <Text font={FONT_MONO} fontSize={0.17} position={[-CARD_W / 2 + 0.18, 0.04, 0.002]} anchorX="left" anchorY="middle" color={dimmed ? '#5c7469' : '#eafff4'} whiteSpace="nowrap">
        {skill.name}
      </Text>
      <Text font={FONT_MONO} fontSize={0.09} position={[-CARD_W / 2 + 0.18, -0.15, 0.002]} anchorX="left" anchorY="middle" color={neon(color, dimmed ? 0.5 : 1.2)}>
        {`${'▮'.repeat(Math.round(skill.level / 10))}${'▯'.repeat(10 - Math.round(skill.level / 10))}`}
      </Text>
    </group>
  )

  return (
    <Billboard position={position}>
      <group
        ref={inner}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHoveredSkill(skill.id)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          if (useStore.getState().hoveredSkill === skill.id) setHoveredSkill(null)
          document.body.style.cursor = ''
        }}
        onClick={(e) => {
          e.stopPropagation()
          setHoveredSkill(skill.id)
          if (useStore.getState().view !== 'skills') useStore.getState().runCommand('skills')
        }}
      >
        <RoundedBox args={[CARD_W, CARD_H, 0.06]} radius={0.05} smoothness={3}>
          <meshStandardMaterial color={dimmed ? '#050a08' : '#08120f'} metalness={0.5} roughness={0.35} />
        </RoundedBox>
        <Line ref={glow} points={frame} color={neon(color, 2)} lineWidth={1.2} transparent opacity={0.45} toneMapped={false} />
        {face(false)}
        {face(true)}
        {hovered && <Sparkles count={26} scale={[CARD_W + 0.6, CARD_H + 0.8, 0.8]} size={2.2} speed={0.7} color={color} opacity={0.9} />}
      </group>
    </Billboard>
  )
})
