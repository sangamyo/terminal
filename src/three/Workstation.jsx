import { Float, RoundedBox, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { useStore } from '../store/useStore'
import { ANCHORS, FONT_DISPLAY, FONT_MONO } from './layout'
import { holoProps, neon } from './materials'

const SCREENS = [
  {
    title: 'policy.py',
    color: '#39ff88',
    code: [
      'class VLAPolicy(nn.Module):',
      '  def forward(self, img, text):',
      '    z = self.vision(img)',
      '    t = self.lang(text)',
      '    return self.action_head(z, t)',
    ],
  },
  {
    title: 'detect.py',
    color: '#22e5ff',
    code: [
      'cap = cv2.VideoCapture(0)',
      'while cap.isOpened():',
      '  ok, frame = cap.read()',
      '  boxes = model(frame)',
      '  draw(frame, boxes)',
    ],
  },
  {
    title: 'api.py',
    color: '#c6ff3d',
    code: [
      '@app.post("/analyze")',
      'async def analyze(cv: Resume):',
      '  score = llm.match(cv, jd)',
      '  return {"fit": score}',
      '',
    ],
  },
]

/** About section: an abstract developer avatar at a holographic workstation. */
export default function Workstation() {
  return (
    <group position={ANCHORS.about}>
      {/* floor halo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.25, 0]}>
        <ringGeometry args={[2.6, 2.66, 96]} />
        <meshBasicMaterial color={neon('#39ff88', 1.6)} toneMapped={false} transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.26, 0]}>
        <circleGeometry args={[2.6, 64]} />
        <meshBasicMaterial color="#06140e" transparent opacity={0.65} />
      </mesh>

      {/* desk */}
      <RoundedBox args={[4.2, 0.1, 1.5]} radius={0.04} position={[0, -0.35, 0.4]}>
        <meshStandardMaterial color="#0c1714" metalness={0.7} roughness={0.35} />
      </RoundedBox>
      <mesh position={[0, -0.29, 1.15]}>
        <boxGeometry args={[4.2, 0.012, 0.012]} />
        <meshBasicMaterial color={neon('#22e5ff', 2.5)} toneMapped={false} />
      </mesh>
      {/* holographic keyboard */}
      <mesh position={[0, -0.28, 0.75]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.6, 0.5, 16, 4]} />
        <meshBasicMaterial color={neon('#39ff88', 1.4)} wireframe transparent opacity={0.4} toneMapped={false} />
      </mesh>

      {/* monitors */}
      {SCREENS.map((s, i) => {
        const angle = (i - 1) * 0.42
        return (
          <group key={s.title} position={[Math.sin(angle) * 2.2, 0.75, -Math.cos(angle) * 2.2 + 2.2 - 1.6]} rotation={[0, -angle, 0]}>
            <Monitor screen={s} index={i} />
          </group>
        )
      })}

      <Avatar position={[0, 2.35, -0.6]} />
    </group>
  )
}

function Monitor({ screen, index }) {
  const mat = useRef()
  useFrame((_, dt) => {
    if (mat.current) mat.current.uTime += dt
  })
  return (
    <group>
      <mesh>
        <planeGeometry args={[1.7, 1.08]} />
        <holoMaterial ref={mat} {...holoProps} uColor={neon(screen.color, 1)} uIntensity={0.9} uTime={index * 3} />
      </mesh>
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[1.7, 1.08]} />
        <meshBasicMaterial color="#020806" transparent opacity={0.75} />
      </mesh>
      <Text font={FONT_MONO} fontSize={0.065} color={neon(screen.color, 1.3)} position={[-0.76, 0.44, 0.01]} anchorX="left" anchorY="top">
        {`● ${screen.title}`}
      </Text>
      <Text
        font={FONT_MONO}
        fontSize={0.07}
        lineHeight={1.5}
        color="#cfeee0"
        position={[-0.76, 0.3, 0.01]}
        anchorX="left"
        anchorY="top"
        maxWidth={1.55}
      >
        {screen.code.join('\n')}
      </Text>
    </group>
  )
}

/** A non-literal avatar: wireframe head, scanning ring and monogram. */
function Avatar(props) {
  const head = useRef()
  const scan = useRef()
  const reduced = useStore((s) => s.reducedMotion)

  useFrame((state, dt) => {
    if (reduced) return
    head.current.rotation.y += dt * 0.4
    scan.current.position.y = Math.sin(state.clock.elapsedTime * 1.4) * 0.55
  })

  return (
    <Float enabled={!reduced} speed={1.4} rotationIntensity={0.15} floatIntensity={0.4} {...props}>
      <group ref={head}>
        <mesh>
          <icosahedronGeometry args={[0.62, 1]} />
          <meshBasicMaterial color={neon('#22e5ff', 1.8)} wireframe toneMapped={false} />
        </mesh>
        <mesh scale={0.4}>
          <icosahedronGeometry args={[1, 3]} />
          <meshStandardMaterial color="#0a2a1d" emissive="#39ff88" emissiveIntensity={1.4} roughness={0.3} toneMapped={false} />
        </mesh>
      </group>
      <mesh ref={scan} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.82, 0.008, 4, 96]} />
        <meshBasicMaterial color={neon('#39ff88', 3)} toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.95, 0]}>
        <cylinderGeometry args={[0.02, 0.35, 0.6, 24, 1, true]} />
        <meshBasicMaterial color={neon('#22e5ff', 1.2)} transparent opacity={0.25} toneMapped={false} depthWrite={false} />
      </mesh>
      <Text font={FONT_DISPLAY} fontSize={0.32} position={[0, 0.98, 0]} color={neon('#e8fff4', 1.4)} letterSpacing={0.2}>
        HK
      </Text>
    </Float>
  )
}
