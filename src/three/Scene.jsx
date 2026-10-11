import { AdaptiveDpr, Environment, Lightformer, PerformanceMonitor } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import { PCFShadowMap } from 'three'
import { useStore } from '../store/useStore'
import CameraRig from './CameraRig'
import Desk from './Desk'
import Lamp from './Lamp'
import { LEFT_WALL_X, SPOTS } from './layout'
import Monitor from './Monitor'
import RobotArm from './RobotArm'
import Room from './Room'
import { Pinboard, Shelf } from './WallPieces'

/** The studio: one room, one desk. Lazy-loaded so the page is readable before three.js arrives. */
export default function Scene() {
  const quality = useStore((s) => s.quality)
  const setQuality = useStore((s) => s.setQuality)
  const night = useStore((s) => s.lights === 'night')
  const [dpr, setDpr] = useState(quality === 'high' ? [1, 2] : [1, 1.25])

  return (
    <Canvas
      className="canvas-layer"
      dpr={dpr}
      shadows={{ type: PCFShadowMap }}
      camera={{ position: [1.05, 1.55, 2.75], fov: 38, near: 0.02, far: 30 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      aria-hidden="true"
    >
      <color attach="background" args={[night ? '#15161a' : '#e9e3d8']} />
      <PerformanceMonitor
        onDecline={() => {
          setDpr([1, 1])
          if (useStore.getState().quality === 'high') setQuality('low')
        }}
      />
      <AdaptiveDpr pixelated={false} />
      <Lights night={night} quality={quality} />
      <CameraRig />
      <Suspense fallback={null}>
        <Room />
        <Desk />
        <Monitor />
        <RobotArm />
        <Lamp />
        <Shelf />
        <Pinboard />
      </Suspense>
    </Canvas>
  )
}

function Lights({ night, quality }) {
  const [wx, wy, wz] = SPOTS.window
  return (
    <>
      <hemisphereLight args={night ? ['#3a4458', '#1b1612', 0.35] : ['#f6f0e6', '#8f7a63', 0.9]} />
      {/* daylight (or moonlight) through the window */}
      <directionalLight
        position={[LEFT_WALL_X - 2.2, wy + 2.4, wz + 1.6]}
        intensity={night ? 0.35 : 2.4}
        color={night ? '#93a7cf' : '#fff0da'}
        castShadow
        shadow-mapSize={quality === 'high' ? [2048, 2048] : [1024, 1024]}
        shadow-bias={-0.0003}
        shadow-normalBias={0.02}
        shadow-radius={6}
        shadow-camera-left={-2.4}
        shadow-camera-right={2.4}
        shadow-camera-top={2.4}
        shadow-camera-bottom={-2.4}
        shadow-camera-near={0.5}
        shadow-camera-far={12}
      />
      {/* soft bounce from the room in front of the desk */}
      <pointLight position={[0.4, 2.4, 1.6]} intensity={night ? 1.1 : 3} distance={6} decay={2} color={night ? '#6b6f80' : '#fff6ea'} />
      {/* reflections only: a window, a ceiling panel and a wall card, nothing downloaded */}
      <Environment resolution={128} frames={1} environmentIntensity={night ? 0.25 : 0.7}>
        <Lightformer form="rect" intensity={night ? 0.6 : 3} color={night ? '#33415c' : '#ffffff'} position={[-4, 1.6, 0]} rotation={[0, Math.PI / 2, 0]} scale={[2, 1.6, 1]} />
        <Lightformer form="rect" intensity={night ? 0.3 : 1.2} position={[0, 4, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[4, 4, 1]} />
        <Lightformer form="rect" intensity={night ? 0.6 : 0.5} color={night ? '#ffbe7a' : '#ffffff'} position={[2, 1, 2]} scale={[1, 1, 1]} />
      </Environment>
    </>
  )
}
