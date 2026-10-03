import { Billboard, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { AdditiveBlending } from 'three'
import { useStore } from '../store/useStore'
import { ANCHORS, FONT_MONO } from './layout'
import { neon } from './materials'

/** Contact: an antenna broadcasting expanding signal rings. */
export default function CommsTower() {
  const waves = useRef([])
  const dish = useRef()

  useFrame((state, dt) => {
    const reduced = useStore.getState().reducedMotion
    const t = state.clock.elapsedTime
    if (!reduced) dish.current.rotation.y += dt * 0.4
    waves.current.forEach((w, i) => {
      if (!w) return
      const k = reduced ? 0.5 : (t * 0.35 + i / 3) % 1
      w.scale.setScalar(0.4 + k * 3.2)
      w.material.opacity = (1 - k) * 0.7
    })
  })

  return (
    <group
      position={ANCHORS.contact}
      onClick={(e) => {
        e.stopPropagation()
        if (useStore.getState().view !== 'contact') useStore.getState().runCommand('contact')
      }}
    >
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.05, 0.18, 2.6, 12]} />
        <meshStandardMaterial color="#13221d" metalness={0.8} roughness={0.3} />
      </mesh>
      <group ref={dish} position={[0, 0.25, 0]}>
        <mesh rotation={[-0.5, 0, 0]}>
          <sphereGeometry args={[0.9, 32, 12, 0, Math.PI * 2, 0, 0.9]} />
          <meshBasicMaterial color={neon('#22e5ff', 1.4)} wireframe toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.2, 0.35]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color={neon('#39ff88', 3)} toneMapped={false} />
        </mesh>
      </group>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(el) => (waves.current[i] = el)} position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1, 0.012, 6, 120]} />
          <meshBasicMaterial color={neon('#39ff88', 2.2)} transparent toneMapped={false} blending={AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
      <Billboard position={[0, 2.1, 0]}>
        <Text font={FONT_MONO} fontSize={0.22} letterSpacing={0.14} color={neon('#eafff4', 1.4)}>
          ESTABLISH CONNECTION
        </Text>
        <Text font={FONT_MONO} fontSize={0.11} position={[0, -0.28, 0]} color={neon('#39ff88', 1.3)}>
          ▲ signal strong · channel open
        </Text>
      </Billboard>
    </group>
  )
}
