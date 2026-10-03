import { Billboard, Float, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { education } from '../data/profile'
import { useStore } from '../store/useStore'
import { ANCHORS, FONT_DISPLAY, FONT_MONO } from './layout'
import { neon } from './materials'

/** A rotating data crystal for the degree, orbited by certification badges. */
export default function EducationModule() {
  const crystal = useRef()
  const orbit = useRef()
  const reduced = useStore((s) => s.reducedMotion)

  useFrame((_, dt) => {
    if (reduced) return
    crystal.current.rotation.y += dt * 0.3
    orbit.current.rotation.y -= dt * 0.45
  })

  return (
    <group position={ANCHORS.education}>
      <Float enabled={!reduced} speed={1} floatIntensity={0.4} rotationIntensity={0.1}>
        <group
          ref={crystal}
          onClick={(e) => {
            e.stopPropagation()
            if (useStore.getState().view !== 'education') useStore.getState().runCommand('education')
          }}
        >
          <mesh>
            <cylinderGeometry args={[1.1, 1.1, 2.2, 6, 1]} />
            <meshStandardMaterial color="#071a12" emissive="#0b4a2f" emissiveIntensity={0.6} metalness={0.6} roughness={0.25} transparent opacity={0.85} />
          </mesh>
          <mesh scale={1.02}>
            <cylinderGeometry args={[1.1, 1.1, 2.2, 6, 4]} />
            <meshBasicMaterial color={neon('#39ff88', 1.8)} wireframe toneMapped={false} />
          </mesh>
          <mesh position={[0, 1.55, 0]}>
            <coneGeometry args={[1.1, 0.9, 6]} />
            <meshBasicMaterial color={neon('#22e5ff', 1.4)} wireframe toneMapped={false} />
          </mesh>
          <mesh position={[0, -1.55, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[1.1, 0.9, 6]} />
            <meshBasicMaterial color={neon('#22e5ff', 1.4)} wireframe toneMapped={false} />
          </mesh>
        </group>
        <Billboard position={[0, 0, 1.5]}>
          <Text font={FONT_DISPLAY} fontSize={0.38} color={neon('#ffffff', 1.3)} anchorY="bottom">
            B.TECH · CSE
          </Text>
          <Text font={FONT_MONO} fontSize={0.15} color={neon('#39ff88', 1.4)} position={[0, -0.12, 0]} anchorY="top">
            {education.years}
          </Text>
        </Billboard>
      </Float>

      <group ref={orbit}>
        {education.certifications.map((c, i) => {
          const a = (i / education.certifications.length) * Math.PI * 2
          return (
            <Billboard key={c.name} position={[Math.cos(a) * 2.6, Math.sin(a * 2) * 0.5 - 0.3, Math.sin(a) * 2.6]}>
              <mesh>
                <circleGeometry args={[0.42, 6]} />
                <meshBasicMaterial color="#04140d" transparent opacity={0.85} />
              </mesh>
              <mesh>
                <ringGeometry args={[0.42, 0.45, 6]} />
                <meshBasicMaterial color={neon('#c6ff3d', 2)} toneMapped={false} />
              </mesh>
              <Text font={FONT_DISPLAY} fontSize={0.2} color={neon('#c6ff3d', 1.5)}>
                {c.badge}
              </Text>
              <Text font={FONT_MONO} fontSize={0.09} position={[0, -0.6, 0]} color="#bfe9d4" maxWidth={1.6} textAlign="center">
                {`${c.issuer}\n${c.name}`}
              </Text>
            </Billboard>
          )
        })}
      </group>
    </group>
  )
}
