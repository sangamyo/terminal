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
const PANEL_PX = 410 // keep in sync with .panel width in ui.css

const damp3 = (v, goal, lambda, dt) => {
  v.x = MathUtils.damp(v.x, goal.x, lambda, dt)
  v.y = MathUtils.damp(v.y, goal.y, lambda, dt)
  v.z = MathUtils.damp(v.z, goal.z, lambda, dt)
}

/**
 * Smoothly flies the camera between section "stations", adds mouse parallax,
 * and hands control to OrbitControls once the immersive view is reached.
 */
export default function CameraRig() {
  const { camera, size } = useThree()
  const view = useStore((s) => s.view)
  const reduced = useStore((s) => s.reducedMotion)
  const look = useRef(new Vector3(0, 0.3, 0))
  const [orbit, setOrbit] = useState(false)

  useEffect(() => {
    if (view !== 'immersive') setOrbit(false)
  }, [view])

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.1)
    const s = useStore.getState()

    if (orbit) {
      focusPoint.copy(look.current)
      return
    }

    const st = stationFor(s)
    goalPos.fromArray(st.pos)
    goalTarget.fromArray(st.target)

    dir.subVectors(goalTarget, goalPos).normalize()
    right.crossVectors(dir, up).normalize()

    // Make room for the right-hand HTML panel on wide screens by shifting the projection
    // (film offset) rather than the camera, so subjects stay square-on instead of skewed.
    const panelFrac = PANEL_VIEWS.has(s.view) && size.width >= 1024 ? (PANEL_PX + 28) / (2 * size.width) : 0
    const goalOffset = panelFrac * camera.getFilmWidth() * 2 * Math.tan(MathUtils.degToRad(camera.fov / 2)) * camera.aspect
    const nextOffset = MathUtils.damp(camera.filmOffset, goalOffset, s.reducedMotion ? 12 : 2.4, dt)
    if (Math.abs(nextOffset - camera.filmOffset) > 1e-4) {
      camera.filmOffset = nextOffset
      camera.updateProjectionMatrix()
    }

    if (!s.reducedMotion) {
      goalPos.addScaledVector(right, globalPointer.x * 0.45)
      goalPos.y += globalPointer.y * 0.3
    }

    const lambda = s.reducedMotion ? 12 : 2.1
    damp3(camera.position, goalPos, lambda, dt)
    damp3(look.current, goalTarget, lambda * 1.15, dt)
    camera.lookAt(look.current)
    focusPoint.copy(look.current)

    if (s.view === 'immersive' && camera.position.distanceTo(goalPos) < 0.25) setOrbit(true)
  })

  if (!orbit) return null
  return (
    <OrbitControls
      makeDefault
      target={look.current.toArray()}
      enableDamping
      dampingFactor={0.08}
      enablePan={false}
      minDistance={5}
      maxDistance={34}
      autoRotate={!reduced}
      autoRotateSpeed={0.35}
      onChange={(e) => e?.target && look.current.copy(e.target.target)}
    />
  )
}
