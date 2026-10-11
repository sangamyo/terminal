import { RoundedBox, Text } from '@react-three/drei'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { Object3D } from 'three'
import { profile } from '../data/profile'
import Hotspot from './Hotspot'
import { DESK, DESK_Y, FONT_MONO, FONT_SERIF, FONT_SERIF_ITALIC, SPOTS } from './layout'
import { woodTexture } from './textures'

const STEEL = <meshStandardMaterial color="#262523" roughness={0.45} metalness={0.6} />

/** Walnut desk on a black steel frame, plus the small things that live on it. */
export default function Desk() {
  const wood = useMemo(() => woodTexture('#6e4b33', 7), [])
  const T = 0.035
  const legH = DESK_Y - T
  return (
    <group>
      <RoundedBox args={[DESK.w, T, DESK.d]} radius={0.008} smoothness={3} position={[DESK.x, DESK_Y - T / 2, DESK.z]} castShadow receiveShadow>
        <meshStandardMaterial map={wood} roughness={0.55} />
      </RoundedBox>
      {/* frame: two A-legs joined by a rail */}
      {[-1, 1].map((side) => (
        <group key={side} position={[DESK.x + side * (DESK.w / 2 - 0.1), 0, DESK.z]}>
          {[-1, 1].map((f) => (
            <mesh key={f} position={[0, legH / 2, f * (DESK.d / 2 - 0.06)]} castShadow>
              <boxGeometry args={[0.035, legH, 0.035]} />
              {STEEL}
            </mesh>
          ))}
          <mesh position={[0, legH - 0.03, 0]} castShadow>
            <boxGeometry args={[0.035, 0.035, DESK.d - 0.1]} />
            {STEEL}
          </mesh>
          <mesh position={[0, 0.06, 0]} castShadow>
            <boxGeometry args={[0.035, 0.02, DESK.d - 0.1]} />
            {STEEL}
          </mesh>
        </group>
      ))}
      <mesh position={[DESK.x, legH - 0.03, DESK.z - DESK.d / 2 + 0.07]} castShadow>
        <boxGeometry args={[DESK.w - 0.2, 0.03, 0.02]} />
        {STEEL}
      </mesh>

      <Keyboard position={SPOTS.keyboard} />
      <Mouse position={SPOTS.mouse} />
      <Mug position={SPOTS.mug} />
      <Hotspot view="about" position={SPOTS.nameplate} rotation={[0, -0.32, 0]} labelAt={[0, 0.16, 0]}>
        <Nameplate />
      </Hotspot>
      <Hotspot view="contact" position={SPOTS.notepad} rotation={[0, 0.16, 0]} labelAt={[0, 0.12, 0]} lift={0.012}>
        <Notepad />
      </Hotspot>
    </group>
  )
}

function Keyboard(props) {
  const keys = useRef()
  const layout = useMemo(() => {
    const out = []
    const rows = [14, 14, 13, 12, 9]
    rows.forEach((n, r) => {
      const w = 0.4 / 14.6
      for (let i = 0; i < n; i++) {
        const isSpace = r === 4 && i === 4
        out.push({ x: -0.2 + w * 0.6 + i * w + (14 - n) * w * 0.5 + (isSpace ? w * 2 : 0), z: -0.048 + r * 0.024, w: isSpace ? w * 5 : w * 0.82 })
        if (isSpace) i += 4
      }
    })
    return out
  }, [])
  useLayoutEffect(() => {
    const o = new Object3D()
    layout.forEach((k, i) => {
      o.position.set(k.x, 0.016, k.z)
      o.scale.set(k.w, 1, 1)
      o.updateMatrix()
      keys.current.setMatrixAt(i, o.matrix)
    })
    keys.current.instanceMatrix.needsUpdate = true
  }, [layout])
  return (
    <group {...props}>
      <RoundedBox args={[0.42, 0.016, 0.135]} radius={0.006} position={[0, 0.008, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#d9d4ca" roughness={0.5} />
      </RoundedBox>
      <instancedMesh ref={keys} args={[null, null, layout.length]} castShadow>
        <boxGeometry args={[1, 0.008, 0.019]} />
        <meshStandardMaterial color="#f4f1ea" roughness={0.65} />
      </instancedMesh>
    </group>
  )
}

function Mouse(props) {
  return (
    <group {...props}>
      <mesh position={[0, 0.012, 0]} scale={[0.032, 0.016, 0.055]} castShadow>
        <sphereGeometry args={[1, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#f4f1ea" roughness={0.45} />
      </mesh>
    </group>
  )
}

function Mug(props) {
  return (
    <group {...props}>
      <mesh position={[0, 0.048, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.04, 0.036, 0.095, 32, 1, true]} />
        <meshStandardMaterial color="#efe9dc" roughness={0.35} side={2} />
      </mesh>
      <mesh position={[0, 0.002, 0]}>
        <cylinderGeometry args={[0.036, 0.036, 0.004, 32]} />
        <meshStandardMaterial color="#efe9dc" roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.037, 32]} />
        <meshStandardMaterial color="#3a2618" roughness={0.2} />
      </mesh>
      <mesh position={[0.045, 0.05, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.022, 0.006, 10, 24, Math.PI]} />
        <meshStandardMaterial color="#efe9dc" roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.0405, 0.0405, 0.012, 32, 1, true]} />
        <meshStandardMaterial color="#b4532a" roughness={0.5} side={2} />
      </mesh>
    </group>
  )
}

function Nameplate() {
  const wood = useMemo(() => woodTexture('#8a6446', 21), [])
  return (
    <group>
      {/* a wooden wedge with an engraved brass face */}
      <mesh position={[0, 0.022, 0]} rotation={[-0.42, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.26, 0.05, 0.035]} />
        <meshStandardMaterial map={wood} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.026, 0.018]} rotation={[-0.42, 0, 0]}>
        <planeGeometry args={[0.24, 0.038]} />
        <meshStandardMaterial color="#c9a45c" roughness={0.35} metalness={0.8} />
      </mesh>
      <group position={[0, 0.026, 0.0195]} rotation={[-0.42, 0, 0]}>
        <Text font={FONT_SERIF} fontSize={0.0145} position={[0, 0.006, 0]} color="#2b2116" anchorX="center">
          {profile.name}
        </Text>
        <Text font={FONT_MONO} fontSize={0.0068} letterSpacing={0.12} position={[0, -0.009, 0]} color="#4a3a24" anchorX="center">
          AI ENGINEER · SOFTWARE ENGINEER
        </Text>
      </group>
    </group>
  )
}

function Notepad() {
  return (
    <group>
      <mesh position={[0, 0.003, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.15, 0.006, 0.21]} />
        <meshStandardMaterial color="#f7f3e8" roughness={0.9} />
      </mesh>
      {/* ruled lines */}
      {Array.from({ length: 9 }, (_, i) => (
        <mesh key={i} position={[0, 0.0062, -0.07 + i * 0.019]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.13, 0.0008]} />
          <meshBasicMaterial color="#b9c6d6" />
        </mesh>
      ))}
      <mesh position={[0, 0.0063, -0.098]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.15, 0.012]} />
        <meshStandardMaterial color="#b4532a" roughness={0.8} />
      </mesh>
      <group position={[-0.062, 0.0066, -0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <Text font={FONT_SERIF_ITALIC} fontSize={0.016} anchorX="left" color="#2a3b55">
          say hello —
        </Text>
        <Text font={FONT_SERIF_ITALIC} fontSize={0.0092} anchorX="left" position={[0, -0.02, 0]} color="#2a3b55" maxWidth={0.125}>
          {profile.links.email}
        </Text>
        <Text font={FONT_SERIF_ITALIC} fontSize={0.0092} anchorX="left" position={[0, -0.038, 0]} color="#2a3b55">
          {profile.links.phone}
        </Text>
      </group>
      {/* pen */}
      <group position={[0.088, 0.006, 0.01]} rotation={[0, 0.25, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.0045, 0.0045, 0.14, 12]} />
          <meshStandardMaterial color="#1f3a5f" roughness={0.35} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.078]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.0045, 0.016, 12]} />
          <meshStandardMaterial color="#c9a45c" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
    </group>
  )
}
