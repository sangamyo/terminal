import { RoundedBox, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { useStore } from '../store/useStore'
import { FONT_MONO, LEFT_WALL_X, SPOTS, WALL_Z } from './layout'
import { floorTexture, plasterTexture } from './textures'

/** Floor, walls, window, rug, plant and clock: the parts of the room you look at but don't click. */
export default function Room() {
  const floor = useMemo(() => floorTexture(), [])
  const plaster = useMemo(() => plasterTexture(), [])
  const plasterSide = useMemo(() => plasterTexture('#e5dfd3'), [])

  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.6]} receiveShadow>
        <planeGeometry args={[9, 6]} />
        <meshStandardMaterial map={floor} roughness={0.72} />
      </mesh>
      {/* back wall */}
      <mesh position={[0.6, 1.6, WALL_Z]} receiveShadow>
        <planeGeometry args={[6, 3.2]} />
        <meshStandardMaterial map={plaster} roughness={0.95} />
      </mesh>
      {/* left wall */}
      <mesh position={[LEFT_WALL_X, 1.6, 0.8]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[4, 3.2]} />
        <meshStandardMaterial map={plasterSide} roughness={0.95} />
      </mesh>
      {/* skirting boards */}
      <mesh position={[0.6, 0.05, WALL_Z + 0.008]} receiveShadow>
        <boxGeometry args={[6, 0.1, 0.016]} />
        <meshStandardMaterial color="#efeae0" roughness={0.6} />
      </mesh>
      <mesh position={[LEFT_WALL_X + 0.008, 0.05, 0.8]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[4, 0.1, 0.016]} />
        <meshStandardMaterial color="#efeae0" roughness={0.6} />
      </mesh>

      <Rug />
      <Window />
      <Plant position={SPOTS.plant} />
      <Clock position={SPOTS.clock} />
    </group>
  )
}

function Rug() {
  return (
    <group position={[0.05, 0.004, -0.35]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.7, 1.9]} />
        <meshStandardMaterial color="#c8b79c" roughness={1} />
      </mesh>
      {/* woven border */}
      {[
        [0, -0.88, 2.56, 0.05],
        [0, 0.88, 2.56, 0.05],
        [-1.26, 0, 0.05, 1.71],
        [1.26, 0, 0.05, 1.71],
      ].map(([x, z, w, d], i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.002, z]} receiveShadow>
          <planeGeometry args={[w, d]} />
          <meshStandardMaterial color="#8c5a3c" roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

function Window() {
  const lights = useStore((s) => s.lights)
  const day = lights === 'day'
  const frame = <meshStandardMaterial color="#f2eee6" roughness={0.5} />
  const [x, y, z] = SPOTS.window
  const W = 1.3
  const H = 1.25
  return (
    <group position={[x + 0.01, y, z]} rotation={[0, Math.PI / 2, 0]}>
      {/* the view outside: bright overcast by day, dusk blue at night */}
      <mesh position={[0, 0, -0.005]}>
        <planeGeometry args={[W, H]} />
        <meshBasicMaterial color={day ? '#f6f1e6' : '#1d2a3d'} toneMapped={false} />
      </mesh>
      {!day && (
        <mesh position={[0.32, 0.3, -0.003]}>
          <circleGeometry args={[0.035, 24]} />
          <meshBasicMaterial color="#e9e6d8" toneMapped={false} />
        </mesh>
      )}
      {/* frame + mullions */}
      {[
        [0, H / 2, W + 0.08, 0.05],
        [0, -H / 2, W + 0.08, 0.05],
        [-W / 2, 0, 0.05, H],
        [W / 2, 0, 0.05, H],
        [0, 0, 0.03, H],
        [0, 0.08, W, 0.03],
      ].map(([px, py, w, h], i) => (
        <mesh key={i} position={[px, py, 0.012]} castShadow>
          <boxGeometry args={[w, h, 0.04]} />
          {frame}
        </mesh>
      ))}
      {/* sill */}
      <mesh position={[0, -H / 2 - 0.03, 0.06]} castShadow receiveShadow>
        <boxGeometry args={[W + 0.2, 0.03, 0.16]} />
        {frame}
      </mesh>
    </group>
  )
}

function Plant({ position }) {
  // A fiddle-leaf-style plant: leaves are flattened spheres along a few stems.
  const leaves = useMemo(() => {
    const out = []
    const stems = [
      [0, 1.15, 0.0, 0.05],
      [-0.12, 0.95, 0.06, -0.25],
      [0.13, 1.02, -0.05, 0.3],
    ]
    let seed = 1
    const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
    stems.forEach(([sx, top, sz, lean]) => {
      for (let i = 0; i < 11; i++) {
        const t = 0.3 + (i / 11) * 0.7
        const yaw = r() * Math.PI * 2
        out.push({
          pos: [sx * t + Math.cos(yaw) * 0.07 + lean * t * 0.2, 0.42 + (top - 0.42) * t, sz * t + Math.sin(yaw) * 0.07],
          rot: [0.5 + r() * 0.7, yaw, 0.15 + r() * 0.2],
          s: 0.045 + r() * 0.03,
          c: r() > 0.5 ? '#3f6b4a' : '#4f7f57',
        })
      }
    })
    return out
  }, [])
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.17, 0.13, 0.4, 32]} />
        <meshStandardMaterial color="#c2673f" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.395, 0]}>
        <cylinderGeometry args={[0.155, 0.155, 0.01, 32]} />
        <meshStandardMaterial color="#3b2b20" roughness={1} />
      </mesh>
      {[
        [0, 0.78, 0, 0.75, 0.04],
        [-0.06, 0.68, 0.03, 0.6, -0.2],
        [0.065, 0.7, -0.025, 0.65, 0.25],
      ].map(([x, y, z, h, tilt], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0, 0, tilt]} castShadow>
          <cylinderGeometry args={[0.008, 0.012, h, 6]} />
          <meshStandardMaterial color="#5b4a32" roughness={0.9} />
        </mesh>
      ))}
      {leaves.map((l, i) => (
        <mesh key={i} position={l.pos} rotation={l.rot} scale={[l.s, l.s * 0.18, l.s * 1.45]} castShadow>
          <sphereGeometry args={[1, 14, 10]} />
          <meshStandardMaterial color={l.c} roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

/** Wall clock running on Noida time (UTC+5:30), wherever the visitor is. */
function Clock({ position }) {
  const hour = useRef()
  const minute = useRef()
  const second = useRef()
  useFrame(() => {
    const now = new Date()
    const ist = new Date(now.getTime() + (now.getTimezoneOffset() + 330) * 60000)
    const s = ist.getSeconds() + ist.getMilliseconds() / 1000
    const m = ist.getMinutes() + s / 60
    const h = (ist.getHours() % 12) + m / 60
    if (hour.current) hour.current.rotation.z = -(h / 12) * Math.PI * 2
    if (minute.current) minute.current.rotation.z = -(m / 60) * Math.PI * 2
    if (second.current) second.current.rotation.z = -(Math.floor(s) / 60) * Math.PI * 2
  })
  return (
    <group position={[position[0], position[1], position[2] + 0.025]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.16, 0.035, 48]} />
        <meshStandardMaterial color="#2b2a28" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.018]}>
        <circleGeometry args={[0.145, 48]} />
        <meshStandardMaterial color="#f6f2ea" roughness={0.8} />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.sin(a) * 0.122, Math.cos(a) * 0.122, 0.02]} rotation={[0, 0, -a]}>
            <planeGeometry args={[i % 3 === 0 ? 0.008 : 0.004, i % 3 === 0 ? 0.03 : 0.018]} />
            <meshBasicMaterial color="#2b2a28" />
          </mesh>
        )
      })}
      <Text font={FONT_MONO} fontSize={0.014} letterSpacing={0.2} position={[0, -0.055, 0.021]} color="#8a8378">
        NOIDA
      </Text>
      <group ref={hour} position={[0, 0, 0.022]}>
        <mesh position={[0, 0.035, 0]}>
          <planeGeometry args={[0.01, 0.075]} />
          <meshBasicMaterial color="#2b2a28" />
        </mesh>
      </group>
      <group ref={minute} position={[0, 0, 0.023]}>
        <mesh position={[0, 0.05, 0]}>
          <planeGeometry args={[0.006, 0.105]} />
          <meshBasicMaterial color="#2b2a28" />
        </mesh>
      </group>
      <group ref={second} position={[0, 0, 0.024]}>
        <mesh position={[0, 0.04, 0]}>
          <planeGeometry args={[0.002, 0.11]} />
          <meshBasicMaterial color="#b4532a" />
        </mesh>
      </group>
      <RoundedBox args={[0.014, 0.014, 0.004]} radius={0.002} position={[0, 0, 0.026]}>
        <meshBasicMaterial color="#b4532a" />
      </RoundedBox>
    </group>
  )
}
