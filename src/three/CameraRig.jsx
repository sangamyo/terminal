import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { MathUtils, Vector3 } from 'three'
import { useStore } from '../store/useStore'
import { PANEL_VIEWS, focusPoint, globalPointer, stationFor } from './layout'

const goalPos = new Vector3()
const goalTarget = new Vector3()
const dir = new Vector3()
const right = new Vector3()
const up = new Vector3(0, 1, 0)
const PANEL_PX = 440 // keep in sync with --panel-w in site.css
const HERO_PX = 560 // the intro column on the home view

const damp3 = (v, goal, lambda, dt) => {
  v.x = MathUtils.damp(v.x, goal.x, lambda, dt)
  v.y = MathUtils.damp(v.y, goal.y, lambda, dt)
  v.z = MathUtils.damp(v.z, goal.z, lambda, dt)
}

/**
 * Glides the camera between objects on the desk, with a little mouse parallax.
 * In "explore" it hands over to OrbitControls once it arrives.
 */
export default function CameraRig() {
  const { camera, size } = useThree()
  const view = useStore((s) => s.view)
  const look = useRef(new Vector3(0.12, 1.16, -0.8))
  const [orbit, setOrbit] = useState(false)

  useEffect(() => {
    if (view !== 'explore') setOrbit(false)
  }, [view])

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.1)
    const s = useStore.getState()

    // Shift the projection (film offset) so the subject sits beside the HTML instead of under it:
    // panels cover the right edge, the intro covers the left.
    const wide = size.width >= 1024
    let frac = 0
    if (wide && PANEL_VIEWS.has(s.view)) frac = (PANEL_PX + 32) / (2 * size.width)
    else if (wide && s.view === 'home') frac = -(HERO_PX * 0.72) / (2 * size.width)
    const goalOffset = frac * camera.getFilmWidth() * 2 * Math.tan(MathUtils.degToRad(camera.fov / 2)) * camera.aspect
    const nextOffset = MathUtils.damp(camera.filmOffset, goalOffset, s.reducedMotion ? 14 : 3, dt)
    if (Math.abs(nextOffset - camera.filmOffset) > 1e-5) {
      camera.filmOffset = nextOffset
      camera.updateProjectionMatrix()
    }

    if (orbit) {
      focusPoint.copy(look.current)
      return
    }

    const st = stationFor(s.view)
    goalPos.fromArray(st.pos)
    goalTarget.fromArray(st.target)
    dir.subVectors(goalTarget, goalPos)
    const dist = dir.length()
    dir.normalize()
    right.crossVectors(dir, up).normalize()

    // parallax scales with distance so close-ups don't swing wildly
    if (!s.reducedMotion) {
      const amount = Math.min(0.12, dist * 0.06)
      goalPos.addScaledVector(right, globalPointer.x * amount)
      goalPos.y += globalPointer.y * amount * 0.6
    }

    const lambda = s.reducedMotion ? 14 : 2.6
    damp3(camera.position, goalPos, lambda, dt)
    damp3(look.current, goalTarget, lambda * 1.2, dt)
    camera.lookAt(look.current)
    focusPoint.copy(look.current)

    if (s.view === 'explore' && camera.position.distanceTo(goalPos) < 0.05) setOrbit(true)
  })

  if (!orbit) return null
  return (
    <OrbitControls
      makeDefault
      target={look.current.toArray()}
      enableDamping
      dampingFactor={0.08}
      enablePan={false}
      minDistance={0.9}
      maxDistance={3.6}
      minPolarAngle={0.35}
      maxPolarAngle={1.5}
      minAzimuthAngle={-0.9}
      maxAzimuthAngle={1.05}
      onChange={(e) => e?.target && look.current.copy(e.target.target)}
    />
  )
}
