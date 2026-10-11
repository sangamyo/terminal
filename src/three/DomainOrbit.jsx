import { Billboard, Line, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import { domains, projects, timeline } from '../data/profile'
import { useStore } from '../store/useStore'
import { FONT_MONO } from './layout'
import { neon } from './materials'

const RADIUS = 4.6

/** Fly to the section a domain represents, pre-selecting the most relevant item. */
export function goToDomain(domain) {
  const s = useStore.getState()
  if (domain.view === 'skills') s.setSkillFocus(domain.focus)
  if (domain.view === 'projects') s.setProjectIndex(Math.max(0, projects.findIndex((p) => p.id === domain.focus)))
  if (domain.view === 'experience') s.setTimelineIndex(Math.max(0, timeline.findIndex((t) => t.id === domain.focus)))
  s.runCommand(domain.view)
}

/** Technical domains orbiting the AI core. Click one to travel to its section. */
export default function DomainOrbit() {
  const group = useRef()
  const [active, setActive] = useState(null)
  const reduced = useStore((s) => s.reducedMotion)

  const nodes = useMemo(
    () =>
      domains.map((d, i) => {
        const a = (i / domains.length) * Math.PI * 2
        return { ...d, position: [Math.cos(a) * RADIUS, Math.sin(a * 2) * 0.5, Math.sin(a) * RADIUS] }
      }),
    [],
  )

  useFrame((_, dt) => {
    if (!reduced && active === null) group.current.rotation.y += dt * 0.08
  })

  return (
    <group rotation={[0.32, 0, 0.08]}>
      <group ref={group}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[RADIUS, 0.006, 4, 220]} />
          <meshBasicMaterial color={neon('#22e5ff', 1.2)} transparent opacity={0.35} toneMapped={false} />
        </mesh>
        {nodes.map((n, i) => (
          <DomainNode key={n.label} node={n} active={active === i} onHover={(on) => setActive(on ? i : null)} />
        ))}
      </group>
    </group>
  )
}

function DomainNode({ node, active, onHover }) {
  const gem = useRef()
  const scale = useRef(1)

  useFrame((_, dt) => {
    gem.current.rotation.y += dt * (active ? 3 : 0.8)
    gem.current.rotation.x += dt * 0.4
    scale.current += ((active ? 1.6 : 1) - scale.current) * 0.15
    gem.current.scale.setScalar(scale.current)
  })

  return (
    <group position={node.position}>
      <Line points={[[0, 0, 0], node.position.map((v) => -v)]} color="#1fbf77" lineWidth={0.6} transparent opacity={active ? 0.6 : 0.14} />
      <Billboard>
        <mesh
          onPointerOver={(e) => {
            e.stopPropagation()
            onHover(true)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            onHover(false)
            document.body.style.cursor = ''
          }}
          onClick={(e) => {
            e.stopPropagation()
            goToDomain(node)
          }}
        >
          <planeGeometry args={[2.4, 1.1]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        <mesh ref={gem}>
          <octahedronGeometry args={[0.18, 0]} />
          <meshBasicMaterial color={neon(active ? '#ffffff' : '#39ff88', 2.4)} wireframe={!active} toneMapped={false} />
        </mesh>
        <Text
          font={FONT_MONO}
          position={[0, -0.38, 0]}
          fontSize={0.2}
          letterSpacing={0.08}
          color={active ? neon('#ffffff', 1.6) : neon('#9dffd0', 1.1)}
          anchorX="center"
          anchorY="top"
          outlineWidth={active ? 0.004 : 0}
          outlineColor="#22e5ff"
        >
          {node.label}
        </Text>
      </Billboard>
    </group>
  )
}
