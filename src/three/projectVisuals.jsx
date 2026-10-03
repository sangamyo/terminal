import { Line, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { FONT_MONO } from './layout'
import { neon } from './materials'

/* Each visual fits roughly inside a 1.8 × 1.4 box centred on the origin. */

function useTime() {
  const t = useRef(0)
  useFrame((_, dt) => {
    t.current += dt
  })
  return t
}

function FaceVisual() {
  const head = useRef()
  const box = useRef()
  const t = useTime()
  useFrame(() => {
    const x = Math.sin(t.current * 0.9) * 0.35
    head.current.position.x = x
    head.current.rotation.y = t.current * 0.6
    box.current.position.x += (x - box.current.position.x) * 0.12
  })
  const s = 0.5
  const c = 0.14
  const corners = [
    [[-s, s - c, 0], [-s, s, 0], [-s + c, s, 0]],
    [[s - c, s, 0], [s, s, 0], [s, s - c, 0]],
    [[s, -s + c, 0], [s, -s, 0], [s - c, -s, 0]],
    [[-s + c, -s, 0], [-s, -s, 0], [-s, -s + c, 0]],
  ]
  return (
    <group>
      <group ref={head}>
        <mesh scale={[0.32, 0.4, 0.32]}>
          <icosahedronGeometry args={[1, 2]} />
          <meshBasicMaterial color={neon('#22e5ff', 1.4)} wireframe toneMapped={false} />
        </mesh>
      </group>
      <group ref={box}>
        {corners.map((pts, i) => (
          <Line key={i} points={pts} color={neon('#39ff88', 2.5)} lineWidth={2} toneMapped={false} />
        ))}
        <Text font={FONT_MONO} fontSize={0.08} position={[-s, s + 0.08, 0]} anchorX="left" color={neon('#39ff88', 1.6)}>
          face 0.98
        </Text>
      </group>
    </group>
  )
}

function TrafficVisual() {
  const lights = useRef([])
  const cars = useRef([])
  const t = useTime()
  useFrame(() => {
    const phase = Math.floor(t.current / 1.6) % 2
    lights.current.forEach((l, i) => {
      if (!l) return
      const green = (i % 2) === phase
      l.children[0].material.color.set(green ? '#1a1a1a' : '#ff3b4f').multiplyScalar(green ? 1 : 2.5)
      l.children[1].material.color.set(green ? '#39ff88' : '#1a1a1a').multiplyScalar(green ? 2.5 : 1)
    })
    cars.current.forEach((c, i) => {
      if (!c) return
      const k = ((t.current * 0.45 + i * 0.33) % 1) * 2 - 1
      if (i % 2) c.position.set(0.12, -0.05, k * 0.75)
      else c.position.set(k * 0.75, -0.05, -0.12)
    })
  })
  return (
    <group rotation={[0.75, 0.6, 0]} scale={1.1}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[1.6, 0.42]} />
        <meshStandardMaterial color="#14201c" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, -0.099, 0]}>
        <planeGeometry args={[1.6, 0.42]} />
        <meshStandardMaterial color="#14201c" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.098, 0]}>
        <planeGeometry args={[1.6, 1.6, 16, 16]} />
        <meshBasicMaterial color={neon('#22e5ff', 0.8)} wireframe transparent opacity={0.18} toneMapped={false} />
      </mesh>
      {[[-0.32, 0.32], [0.32, -0.32], [0.32, 0.32], [-0.32, -0.32]].map(([x, z], i) => (
        <group key={i} position={[x, 0.05, z]} ref={(el) => (lights.current[i] = el)}>
          <mesh position={[0, 0.12, 0]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshBasicMaterial toneMapped={false} />
          </mesh>
          <mesh position={[0, 0.03, 0]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshBasicMaterial toneMapped={false} />
          </mesh>
          <mesh position={[0, -0.06, 0]}>
            <boxGeometry args={[0.02, 0.1, 0.02]} />
            <meshStandardMaterial color="#2b3a35" />
          </mesh>
        </group>
      ))}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} ref={(el) => (cars.current[i] = el)}>
          <boxGeometry args={i % 2 ? [0.1, 0.06, 0.18] : [0.18, 0.06, 0.1]} />
          <meshBasicMaterial color={neon(i % 2 ? '#22e5ff' : '#c6ff3d', 1.6)} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function ResumeVisual() {
  const scan = useRef()
  const t = useTime()
  useFrame(() => {
    scan.current.position.y = Math.sin(t.current * 1.6) * 0.5
  })
  return (
    <group rotation={[0, -0.35, 0]}>
      {[0, 1, 2].map((i) => (
        <group key={i} position={[i * 0.12 - 0.12, i * -0.05, -i * 0.12]}>
          <mesh>
            <planeGeometry args={[0.85, 1.1]} />
            <meshBasicMaterial color={i === 0 ? '#0b1f18' : '#081511'} transparent opacity={0.92} />
          </mesh>
          {i === 0 &&
            [0.38, 0.26, 0.14, 0.02, -0.1, -0.22, -0.34].map((y, j) => (
              <mesh key={y} position={[-0.32 + (j === 0 ? 0.18 : (j % 3) * 0.04) / 2, y, 0.001]}>
                <planeGeometry args={[j === 0 ? 0.42 : 0.6 - (j % 3) * 0.1, 0.035]} />
                <meshBasicMaterial color={neon(j === 0 ? '#39ff88' : '#7d9a8c', j === 0 ? 2 : 1)} toneMapped={false} />
              </mesh>
            ))}
        </group>
      ))}
      <mesh ref={scan} position={[0, 0, 0.02]}>
        <planeGeometry args={[1.05, 0.025]} />
        <meshBasicMaterial color={neon('#22e5ff', 3)} toneMapped={false} />
      </mesh>
    </group>
  )
}

function VoiceVisual() {
  const bars = useRef([])
  const t = useTime()
  const N = 22
  useFrame(() => {
    bars.current.forEach((b, i) => {
      if (!b) return
      const v = 0.15 + Math.abs(Math.sin(t.current * 3 + i * 0.6) * Math.cos(t.current * 1.3 + i * 0.25)) * 0.85
      b.scale.y = v
    })
  })
  return (
    <group>
      {Array.from({ length: N }, (_, i) => {
        const a = (i / N) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 0.55, Math.sin(a) * 0.55, 0]} rotation={[0, 0, a - Math.PI / 2]} ref={(el) => (bars.current[i] = el)}>
            <boxGeometry args={[0.05, 0.4, 0.05]} />
            <meshBasicMaterial color={neon(i % 2 ? '#39ff88' : '#22e5ff', 2)} toneMapped={false} />
          </mesh>
        )
      })}
      <mesh>
        <capsuleGeometry args={[0.12, 0.22, 6, 16]} />
        <meshStandardMaterial color="#0c1a15" emissive="#39ff88" emissiveIntensity={0.6} metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  )
}

function StyleVisual() {
  const a = useRef()
  const b = useRef()
  const t = useTime()
  useFrame(() => {
    a.current.rotation.set(t.current * 0.4, t.current * 0.6, 0)
    b.current.rotation.copy(a.current.rotation)
    const hue = (t.current * 0.05) % 1
    b.current.material.color.setHSL(0.35 + Math.sin(hue * Math.PI * 2) * 0.15, 0.7, 0.55)
  })
  return (
    <group scale={0.62}>
      <mesh ref={a} position={[-0.25, 0, 0]}>
        <torusKnotGeometry args={[0.55, 0.18, 120, 16]} />
        <meshBasicMaterial color={neon('#22e5ff', 1.3)} wireframe toneMapped={false} />
      </mesh>
      <mesh ref={b} position={[0.25, 0, 0]}>
        <torusKnotGeometry args={[0.55, 0.18, 120, 16]} />
        <meshToonMaterial color="#7dffb0" />
      </mesh>
    </group>
  )
}

function RobotVisual() {
  const base = useRef()
  const shoulder = useRef()
  const elbow = useRef()
  const fingers = useRef([])
  const t = useTime()
  useFrame(() => {
    const k = t.current
    base.current.rotation.y = Math.sin(k * 0.6) * 0.8
    shoulder.current.rotation.z = -0.5 + Math.sin(k * 1.1) * 0.35
    elbow.current.rotation.z = 1.1 + Math.sin(k * 1.1 + 1) * 0.4
    const g = 0.04 + (Math.sin(k * 2.2) * 0.5 + 0.5) * 0.05
    if (fingers.current[0]) fingers.current[0].position.x = -g
    if (fingers.current[1]) fingers.current[1].position.x = g
  })
  const metal = <meshStandardMaterial color="#1a2b25" metalness={0.8} roughness={0.25} emissive="#0a3322" />
  const joint = <meshBasicMaterial color={neon('#39ff88', 2.4)} toneMapped={false} />
  return (
    <group position={[0, -0.55, 0]} scale={0.95}>
      <mesh>
        <cylinderGeometry args={[0.3, 0.36, 0.12, 32]} />
        {metal}
      </mesh>
      <group ref={base} position={[0, 0.06, 0]}>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.1, 0.12, 0.2, 24]} />
          {metal}
        </mesh>
        <group ref={shoulder} position={[0, 0.22, 0]}>
          <mesh>
            <sphereGeometry args={[0.07, 16, 16]} />
            {joint}
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[0.08, 0.6, 0.08]} />
            {metal}
          </mesh>
          <group ref={elbow} position={[0, 0.6, 0]}>
            <mesh>
              <sphereGeometry args={[0.06, 16, 16]} />
              {joint}
            </mesh>
            <mesh position={[0, 0.24, 0]}>
              <boxGeometry args={[0.06, 0.48, 0.06]} />
              {metal}
            </mesh>
            <group position={[0, 0.5, 0]}>
              {[0, 1].map((i) => (
                <mesh key={i} ref={(el) => (fingers.current[i] = el)} position={[0, 0.06, 0]}>
                  <boxGeometry args={[0.02, 0.12, 0.05]} />
                  <meshBasicMaterial color={neon('#22e5ff', 2)} toneMapped={false} />
                </mesh>
              ))}
            </group>
          </group>
        </group>
      </group>
      <mesh position={[0.5, 0.08, 0.1]}>
        <boxGeometry args={[0.12, 0.12, 0.12]} />
        <meshBasicMaterial color={neon('#c6ff3d', 1.8)} wireframe toneMapped={false} />
      </mesh>
    </group>
  )
}

function AlgoVisual() {
  const bars = useRef([])
  const t = useTime()
  const N = 9
  useFrame(() => {
    bars.current.forEach((b, i) => {
      if (!b) return
      const h = 0.15 + ((Math.sin(t.current * 0.8 + i * 0.7) + 1) / 2) * 0.35 + i * 0.07
      b.scale.y = h
      b.position.y = -0.55 + h / 2
    })
  })
  return (
    <group rotation={[0.25, -0.5, 0]}>
      {Array.from({ length: N }, (_, i) => (
        <mesh key={i} position={[(i - (N - 1) / 2) * 0.17, 0, 0]} ref={(el) => (bars.current[i] = el)}>
          <boxGeometry args={[0.11, 1, 0.11]} />
          <meshBasicMaterial color={neon(i > 5 ? '#39ff88' : '#22e5ff', 1.8)} toneMapped={false} />
        </mesh>
      ))}
      <Line points={Array.from({ length: N }, (_, i) => [(i - (N - 1) / 2) * 0.17, -0.2 + i * 0.09, 0.1])} color={neon('#c6ff3d', 2.4)} lineWidth={2} toneMapped={false} />
      <mesh position={[0, -0.56, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.7, 0.6, 10, 4]} />
        <meshBasicMaterial color={neon('#22e5ff', 0.8)} wireframe transparent opacity={0.25} toneMapped={false} />
      </mesh>
    </group>
  )
}

function HandVisual() {
  const fingers = useRef([])
  const hand = useRef()
  const t = useTime()
  const spread = [-0.24, -0.08, 0.08, 0.24]
  useFrame(() => {
    hand.current.rotation.y = Math.sin(t.current * 0.6) * 0.5
    fingers.current.forEach((f, i) => {
      if (f) f.rotation.x = (Math.sin(t.current * 2 + i * 0.5) * 0.5 + 0.5) * 1.2
    })
  })
  const mat = <meshBasicMaterial color={neon('#22e5ff', 1.6)} wireframe toneMapped={false} />
  return (
    <group ref={hand} position={[0, -0.25, 0]}>
      <mesh>
        <boxGeometry args={[0.62, 0.55, 0.14, 3, 3, 1]} />
        {mat}
      </mesh>
      {spread.map((x, i) => (
        <group key={i} position={[x, 0.28, 0]} ref={(el) => (fingers.current[i] = el)}>
          <mesh position={[0, 0.2, 0]}>
            <capsuleGeometry args={[0.05, 0.3, 4, 8]} />
            <meshBasicMaterial color={neon('#39ff88', 2)} toneMapped={false} />
          </mesh>
        </group>
      ))}
      <group position={[-0.36, 0.05, 0]} rotation={[0, 0, 0.8]}>
        <mesh position={[0, 0.16, 0]}>
          <capsuleGeometry args={[0.055, 0.22, 4, 8]} />
          <meshBasicMaterial color={neon('#39ff88', 2)} toneMapped={false} />
        </mesh>
      </group>
      {[[-0.24, 0.62], [0.08, 0.7], [0.24, 0.64], [-0.36, 0.3]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.08]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color={neon('#c6ff3d', 3)} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

export const projectVisuals = {
  algo: AlgoVisual,
  hand: HandVisual,
  face: FaceVisual,
  traffic: TrafficVisual,
  resume: ResumeVisual,
  voice: VoiceVisual,
  style: StyleVisual,
  robot: RobotVisual,
}
