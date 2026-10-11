import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { MathUtils } from 'three'
import { useStore } from '../store/useStore'

const LABELS = {
  about: ['About', 'name plate'],
  projects: ['Projects', 'monitor'],
  experience: ['Experience', 'robot arm'],
  skills: ['Skills', 'pinboard'],
  education: ['Education', 'shelf'],
  contact: ['Contact', 'notepad'],
}

/**
 * Makes a desk object clickable: hover lifts it a few millimetres and shows a paper tag,
 * click opens its section. `lift` is in metres; `labelAt` is where the tag hangs.
 */
export default function Hotspot({ view, onSelect, label, hint: hintProp, labelAt = [0, 0.3, 0], lift = 0.008, children, ...props }) {
  const group = useRef()
  const hovered = useStore((s) => s.hovered === (label ?? view))
  const current = useStore((s) => s.view)
  const reduced = useStore((s) => s.reducedMotion)
  const baseY = useRef(null)

  useFrame((_, dt) => {
    if (!group.current) return
    if (baseY.current === null) baseY.current = group.current.position.y
    const goal = baseY.current + (hovered && !reduced ? lift : 0)
    group.current.position.y = MathUtils.damp(group.current.position.y, goal, 10, dt)
  })

  const key = label ?? view
  const [title, hint] = LABELS[view] ?? [label, hintProp]
  const showTag = hovered && current !== view

  return (
    <group
      ref={group}
      {...props}
      onPointerOver={(e) => {
        e.stopPropagation()
        useStore.getState().setHovered(key)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        if (useStore.getState().hovered === key) useStore.getState().setHovered(null)
        document.body.style.cursor = ''
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect ? onSelect() : useStore.getState().setView(view)
      }}
    >
      {children}
      {showTag && (
        <Html position={labelAt} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <div className="tag3d">
            <strong>{title}</strong>
            {hint && <span>{hint}</span>}
          </div>
        </Html>
      )}
    </group>
  )
}
