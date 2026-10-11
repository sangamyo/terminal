import { RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { MathUtils } from 'three'
import { useStore } from '../store/useStore'
import Hotspot from './Hotspot'
import { SPOTS } from './layout'

/* Desk-top manipulator doing a slow pick-and-place loop (a nod to teleoperated data collection). */

const H0 = 0.11 // shoulder height above the desk
const L1 = 0.21 // upper arm
const L2 = 0.19 // forearm
const TOOL = 0.075 // wrist joint -> finger midpoint
const CUBE = 0.04
const A = { yaw: 0.5, r: 0.27 }
const B = { yaw: 2.5, r: 0.26 }
const HOVER = 0.13
const GRASP = CUBE / 2
const LEG = 5.4 // seconds per move

// [time, at destination?, tip height, grip closed 0..1]
const KEYS = [
  [0.0, 0, HOVER, 0],
  [0.7, 0, GRASP, 0],
  [1.0, 0, GRASP, 1],
  [1.6, 0, HOVER, 1],
  [3.2, 1, HOVER, 1],
  [3.8, 1, GRASP, 1],
  [4.1, 1, GRASP, 0],
  [4.7, 1, HOVER, 0],
  [LEG, 1, HOVER, 0],
]
const ease = (x) => x * x * (3 - 2 * x)

/** Pose of the tool tip at time t: yaw, reach, height, grip, and where the cube is. */
function pose(t) {
  const leg = Math.floor(t / LEG) % 2
  const lt = t % LEG
  const src = leg === 0 ? A : B
  const dst = leg === 0 ? B : A
  let k = 0
  while (k < KEYS.length - 2 && KEYS[k + 1][0] <= lt) k++
  const [t0, d0, y0, g0] = KEYS[k]
  const [t1, d1, y1, g1] = KEYS[k + 1]
  const f = ease(MathUtils.clamp((lt - t0) / (t1 - t0), 0, 1))
  const at = (d) => (d ? dst : src)
  const yaw = MathUtils.lerp(at(d0).yaw, at(d1).yaw, f)
  const r = MathUtils.lerp(at(d0).r, at(d1).r, f) + Math.sin(f * Math.PI) * (d0 !== d1 ? -0.04 : 0)
  const y = MathUtils.lerp(y0, y1, f)
  const grip = MathUtils.lerp(g0, g1, f)
  const carried = lt >= 1.0 && lt < 4.1
  return { yaw, r, y, grip, carried, rest: lt < 1.0 ? src : dst }
}

/** Two-link IK in the arm's vertical plane, elbow up; the wrist keeps the tool pointing down. */
function solve(r, y) {
  const wx = r
  const wy = y + TOOL - H0
  const d = MathUtils.clamp(Math.hypot(wx, wy), Math.abs(L1 - L2) + 1e-3, L1 + L2 - 1e-3)
  const cosE = (d * d - L1 * L1 - L2 * L2) / (2 * L1 * L2)
  const a2 = -Math.acos(MathUtils.clamp(cosE, -1, 1))
  const a1 = Math.atan2(wy, wx) - Math.atan2(L2 * Math.sin(a2), L1 + L2 * Math.cos(a2))
  return [a1, a2, -Math.PI / 2 - a1 - a2]
}

const WHITE = <meshStandardMaterial color="#ecebe6" roughness={0.38} />
const DARK = <meshStandardMaterial color="#2f2f31" roughness={0.5} metalness={0.3} />

export default function RobotArm() {
  const yawG = useRef()
  const shoulder = useRef()
  const elbow = useRef()
  const wrist = useRef()
  const fingerL = useRef()
  const fingerR = useRef()
  const cube = useRef()
  const t = useRef(0.4)

  useFrame((_, dt) => {
    const reduced = useStore.getState().reducedMotion
    if (!reduced) t.current += Math.min(dt, 0.05)
    const p = pose(t.current)
    const [a1, a2, a3] = solve(p.r, p.y)
    yawG.current.rotation.y = p.yaw
    shoulder.current.rotation.z = a1
    elbow.current.rotation.z = a2
    wrist.current.rotation.z = a3
    const gap = MathUtils.lerp(0.032, CUBE / 2 + 0.004, p.grip)
    fingerL.current.position.z = gap
    fingerR.current.position.z = -gap
    const at = p.carried ? p : { ...p.rest, y: GRASP }
    cube.current.position.set(Math.cos(at.yaw) * at.r, at.y, -Math.sin(at.yaw) * at.r)
    if (p.carried) cube.current.rotation.y = p.yaw
  })

  return (
    <Hotspot view="experience" position={SPOTS.robot} labelAt={[0, 0.58, 0]} lift={0}>
      {/* base */}
      <mesh position={[0, 0.012, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.085, 0.024, 40]} />
        {DARK}
      </mesh>
      <group ref={yawG}>
        <mesh position={[0, 0.065, 0]} castShadow>
          <cylinderGeometry args={[0.048, 0.055, 0.085, 32]} />
          {WHITE}
        </mesh>
        <group ref={shoulder} position={[0, H0, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.033, 0.033, 0.07, 28]} />
            {DARK}
          </mesh>
          <RoundedBox args={[L1, 0.046, 0.05]} radius={0.016} smoothness={3} position={[L1 / 2, 0, 0]} castShadow>
            {WHITE}
          </RoundedBox>
          <group ref={elbow} position={[L1, 0, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.028, 0.028, 0.062, 28]} />
              {DARK}
            </mesh>
            <RoundedBox args={[L2, 0.038, 0.042]} radius={0.014} smoothness={3} position={[L2 / 2, 0, 0]} castShadow>
              {WHITE}
            </RoundedBox>
            <group ref={wrist} position={[L2, 0, 0]}>
              <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.022, 0.022, 0.05, 24]} />
                {DARK}
              </mesh>
              <mesh position={[0.036, 0, 0]} castShadow>
                <boxGeometry args={[0.03, 0.032, 0.075]} />
                {DARK}
              </mesh>
              <mesh ref={fingerL} position={[0.072, 0, 0.03]} castShadow>
                <boxGeometry args={[0.034, 0.016, 0.007]} />
                {WHITE}
              </mesh>
              <mesh ref={fingerR} position={[0.072, 0, -0.03]} castShadow>
                <boxGeometry args={[0.034, 0.016, 0.007]} />
                {WHITE}
              </mesh>
            </group>
          </group>
        </group>
      </group>
      <RoundedBox ref={cube} args={[CUBE, CUBE, CUBE]} radius={0.004} castShadow receiveShadow>
        <meshStandardMaterial color="#b4532a" roughness={0.55} />
      </RoundedBox>
      {/* the two marked spots on the desk */}
      {[A, B].map((s, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[Math.cos(s.yaw) * s.r, 0.0008, -Math.sin(s.yaw) * s.r]}>
          <ringGeometry args={[0.03, 0.033, 4, 1, Math.PI / 4]} />
          <meshBasicMaterial color="#9a8f7c" />
        </mesh>
      ))}
    </Hotspot>
  )
}
