import { useLayoutEffect, useMemo, useRef } from 'react'
import { Object3D, Quaternion, Vector3 } from 'three'
import { useStore } from '../store/useStore'
import Hotspot from './Hotspot'
import { DESK_Y, SPOTS } from './layout'

const ENAMEL = '#2f4f46'
const BASE = new Vector3(0, 0.03, 0)
const ELBOW = new Vector3(0.04, 0.33, -0.02)
const HEAD = new Vector3(-0.17, 0.5, 0.11)
// where the light lands, in lamp-local coordinates (the middle of the desk, near the keyboard)
const AIM = new Vector3(SPOTS.keyboard[0] - SPOTS.lamp[0] + 0.08, DESK_Y - SPOTS.lamp[1], SPOTS.keyboard[2] - SPOTS.lamp[2] - 0.12)

/** Articulated desk lamp. Click it to switch the room between day and night. */
export default function Lamp() {
  const night = useStore((s) => s.lights === 'night')
  const head = useRef()
  const target = useMemo(() => new Object3D(), [])
  const spot = useRef()

  useLayoutEffect(() => {
    // point the shade (its local -Y) at AIM
    const dir = AIM.clone().sub(HEAD).normalize()
    head.current.quaternion.copy(new Quaternion().setFromUnitVectors(new Vector3(0, -1, 0), dir))
    target.position.copy(AIM)
    if (spot.current) spot.current.target = target
  }, [target])

  return (
    <Hotspot
      label="Desk lamp"
      hint={night ? 'switch to day' : 'switch to night'}
      position={SPOTS.lamp}
      labelAt={[-0.1, 0.66, 0.1]}
      lift={0}
      onSelect={() => useStore.getState().toggleLights()}
    >
      <primitive object={target} />
      <mesh position={[0, 0.012, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.075, 0.08, 0.024, 40]} />
        <meshStandardMaterial color={ENAMEL} roughness={0.35} metalness={0.2} />
      </mesh>
      <Rod from={BASE} to={ELBOW} />
      <Rod from={ELBOW} to={HEAD} />
      {[BASE, ELBOW].map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <sphereGeometry args={[0.016, 16, 12]} />
          <meshStandardMaterial color="#c9a45c" roughness={0.3} metalness={0.8} />
        </mesh>
      ))}
      <group ref={head} position={HEAD}>
        <mesh position={[0, -0.04, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.085, 0.11, 36, 1, true]} />
          <meshStandardMaterial color={ENAMEL} roughness={0.35} metalness={0.2} side={2} />
        </mesh>
        <mesh position={[0, 0.02, 0]} castShadow>
          <sphereGeometry args={[0.036, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={ENAMEL} roughness={0.35} metalness={0.2} />
        </mesh>
        <mesh position={[0, -0.05, 0]}>
          <sphereGeometry args={[0.026, 20, 14]} />
          <meshStandardMaterial color="#fff6e6" emissive="#ffd9a0" emissiveIntensity={night ? 4 : 0.3} toneMapped={!night} />
        </mesh>
        <spotLight
          ref={spot}
          position={[0, -0.06, 0]}
          color="#ffc98c"
          intensity={night ? 9 : 0}
          angle={0.62}
          penumbra={0.75}
          distance={4}
          decay={2}
          castShadow={night}
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0004}
          shadow-radius={4}
          shadow-camera-near={0.05}
        />
        {night && <pointLight position={[0, -0.09, 0]} color="#ffbe7a" intensity={0.6} distance={1.5} decay={2} />}
      </group>
    </Hotspot>
  )
}

const UP = new Vector3(0, 1, 0)
function Rod({ from, to, r = 0.009 }) {
  const mid = from.clone().add(to).multiplyScalar(0.5)
  const len = from.distanceTo(to)
  const q = new Quaternion().setFromUnitVectors(UP, to.clone().sub(from).normalize())
  return (
    <mesh position={mid} quaternion={q} castShadow>
      <cylinderGeometry args={[r, r, len, 12]} />
      <meshStandardMaterial color={ENAMEL} roughness={0.35} metalness={0.2} />
    </mesh>
  )
}
