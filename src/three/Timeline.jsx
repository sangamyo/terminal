import { Billboard, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import { AdditiveBlending, CatmullRomCurve3, Color, Vector3 } from 'three'
import { timeline } from '../data/profile'
import { useStore } from '../store/useStore'
import { FONT_MONO, timelinePosition } from './layout'
import { neon } from './materials'

const pathVertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`
const pathFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uA;
  uniform vec3 uB;
  varying vec2 vUv;
  void main() {
    float pulse = smoothstep(0.06, 0.0, abs(fract(vUv.x * 2.0 - uTime * 0.25) - 0.5) - 0.44);
    vec3 col = mix(uA, uB, vUv.x) * (0.9 + pulse * 3.0);
    gl_FragColor = vec4(col, 0.85);
  }
`

/** Career timeline: a glowing path with expandable milestone nodes. */
export default function Timeline() {
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uA: { value: new Color('#22e5ff') }, uB: { value: new Color('#39ff88') } }),
    [],
  )
  const curve = useMemo(() => {
    const pts = timeline.map((_, i) => new Vector3(...timelinePosition(i)))
    const first = pts[0].clone().add(new Vector3(2.5, -0.3, -0.8))
    const last = pts[pts.length - 1].clone().add(new Vector3(-2.5, 0.3, 0.8))
    return new CatmullRomCurve3([first, ...pts, last])
  }, [])

  useFrame((_, dt) => {
    if (!useStore.getState().reducedMotion) uniforms.uTime.value += dt
  })

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 220, 0.035, 8, false]} />
        <shaderMaterial vertexShader={pathVertex} fragmentShader={pathFragment} uniforms={uniforms} transparent toneMapped={false} />
      </mesh>
      <mesh>
        <tubeGeometry args={[curve, 220, 0.16, 8, false]} />
        <meshBasicMaterial color={neon('#22e5ff', 0.6)} transparent opacity={0.08} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      {timeline.map((t, i) => (
        <TimelineNode key={t.id} item={t} index={i} />
      ))}
    </group>
  )
}

function TimelineNode({ item, index }) {
  const ring = useRef()
  const orb = useRef()
  const beam = useRef()
  const [hovered, setHovered] = useState(false)
  const selected = useStore((s) => s.timelineIndex === index)
  const isWork = item.kind === 'work'
  const color = isWork ? '#39ff88' : '#22e5ff'

  useFrame((state, dt) => {
    ring.current.rotation.z += dt * (selected ? 1.6 : 0.5)
    const target = selected ? 1.5 : hovered ? 1.25 : 1
    const s = orb.current.scale.x + (target - orb.current.scale.x) * Math.min(1, dt * 8)
    orb.current.scale.setScalar(s)
    ring.current.scale.setScalar(s)
    beam.current.scale.y += ((selected ? 1 : 0.001) - beam.current.scale.y) * Math.min(1, dt * 6)
    beam.current.material.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 3) * 0.03
  })

  return (
    <group position={timelinePosition(index)}>
      <mesh
        ref={orb}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = ''
        }}
        onClick={(e) => {
          e.stopPropagation()
          const s = useStore.getState()
          s.setTimelineIndex(index)
          if (s.view !== 'experience') s.runCommand('experience')
        }}
      >
        <sphereGeometry args={[isWork ? 0.26 : 0.18, 24, 24]} />
        <meshBasicMaterial color={neon(color, selected ? 3 : 1.8)} toneMapped={false} />
      </mesh>
      <Billboard>
        <mesh ref={ring}>
          <ringGeometry args={[0.36, 0.39, 6]} />
          <meshBasicMaterial color={neon(color, 2)} toneMapped={false} transparent opacity={0.8} />
        </mesh>
        <Text font={FONT_MONO} fontSize={0.15} position={[0, 0.62, 0]} color={neon(color, 1.4)} anchorY="bottom">
          {item.duration}
        </Text>
        <Text font={FONT_MONO} fontSize={0.17} position={[0, -0.55, 0]} color="#eafff4" anchorY="top" maxWidth={3} textAlign="center">
          {isWork ? item.company : item.role}
        </Text>
        {isWork && (
          <Text font={FONT_MONO} fontSize={0.12} position={[0, -0.82, 0]} color="#8fb3a3" anchorY="top">
            {item.role}
          </Text>
        )}
      </Billboard>
      <mesh ref={beam} position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.006, 0.09, 2.4, 16, 1, true]} />
        <meshBasicMaterial color={neon(color, 1.5)} transparent opacity={0.2} depthWrite={false} toneMapped={false} blending={AdditiveBlending} />
      </mesh>
    </group>
  )
}
