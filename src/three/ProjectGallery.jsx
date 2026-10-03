import { Float, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { memo, useRef, useState } from 'react'
import { MathUtils } from 'three'
import { projects } from '../data/profile'
import { useStore } from '../store/useStore'
import { FONT_DISPLAY, FONT_MONO, projectPosition, projectRotation } from './layout'
import { holoProps, neon } from './materials'
import { projectVisuals } from './projectVisuals'

const W = 2.9
const H = 3.7

/** Floating holographic project cards. Click one to focus it; details live in the HTML panel. */
export default function ProjectGallery() {
  return (
    <group>
      {projects.map((p, i) => (
        <HoloCard key={p.id} project={p} index={i} />
      ))}
    </group>
  )
}

const HoloCard = memo(function HoloCard({ project, index }) {
  const frame = useRef()
  const group = useRef()
  const [hovered, setHovered] = useState(false)
  const selected = useStore((s) => s.projectIndex === index && s.view === 'projects')
  const reduced = useStore((s) => s.reducedMotion)
  const Visual = projectVisuals[project.visual]

  useFrame((_, dt) => {
    if (frame.current) {
      frame.current.uTime += dt
      frame.current.uIntensity = MathUtils.damp(frame.current.uIntensity, selected ? 1.5 : hovered ? 1.2 : 0.7, 5, dt)
    }
    group.current.scale.setScalar(MathUtils.damp(group.current.scale.x, selected ? 1.06 : hovered ? 1.03 : 1, 5, dt))
  })

  const select = (e) => {
    e.stopPropagation()
    const s = useStore.getState()
    s.setProjectIndex(index)
    if (s.view !== 'projects') s.runCommand('projects')
  }

  return (
    <group position={projectPosition(index)} rotation={projectRotation(index)}>
      <Float enabled={!reduced} speed={1.2} rotationIntensity={0.08} floatIntensity={0.25}>
        <group ref={group}>
          {/* glass backing + hit area */}
          <mesh
            onPointerOver={(e) => {
              e.stopPropagation()
              setHovered(true)
              document.body.style.cursor = 'pointer'
            }}
            onPointerOut={() => {
              setHovered(false)
              document.body.style.cursor = ''
            }}
            onClick={select}
          >
            <planeGeometry args={[W, H]} />
            <meshBasicMaterial color="#03100b" transparent opacity={0.72} depthWrite={false} />
          </mesh>
          <mesh position={[0, 0, 0.005]}>
            <planeGeometry args={[W, H]} />
            <holoMaterial ref={frame} {...holoProps} uColor={neon(index % 2 ? '#22e5ff' : '#39ff88', 1)} uTime={index * 2.3} />
          </mesh>

          <Text font={FONT_MONO} fontSize={0.1} position={[-W / 2 + 0.18, H / 2 - 0.18, 0.02]} anchorX="left" anchorY="top" color={neon('#39ff88', 1.4)} letterSpacing={0.1}>
            {`PRJ_${String(index + 1).padStart(2, '0')}`}
          </Text>
          <Text font={FONT_MONO} fontSize={0.1} position={[W / 2 - 0.18, H / 2 - 0.18, 0.02]} anchorX="right" anchorY="top" color="#5f7d70">
            {project.live ? '● LIVE' : '○ REPO'}
          </Text>

          <group position={[0, 0.55, 0.25]}>{Visual && <Visual />}</group>

          <Text
            font={FONT_DISPLAY}
            fontSize={0.21}
            position={[-W / 2 + 0.18, -0.55, 0.02]}
            anchorX="left"
            anchorY="top"
            maxWidth={W - 0.36}
            lineHeight={1.15}
            color="#f0fff8"
          >
            {project.title}
          </Text>
          <Text
            font={FONT_MONO}
            fontSize={0.095}
            position={[-W / 2 + 0.18, -1.12, 0.02]}
            anchorX="left"
            anchorY="top"
            maxWidth={W - 0.36}
            lineHeight={1.45}
            color="#8fb3a3"
          >
            {project.short}
          </Text>
          <Text
            font={FONT_MONO}
            fontSize={0.09}
            position={[-W / 2 + 0.18, -H / 2 + 0.2, 0.02]}
            anchorX="left"
            anchorY="bottom"
            maxWidth={W - 0.36}
            color={neon('#22e5ff', 1.3)}
          >
            {project.tech.join('  ·  ')}
          </Text>
        </group>
      </Float>
    </group>
  )
})
