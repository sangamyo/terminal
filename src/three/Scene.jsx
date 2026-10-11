import { AdaptiveDpr, Grid, PerformanceMonitor } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useRef, useState } from 'react'
import { useStore } from '../store/useStore'
import AICore from './AICore'
import CameraRig from './CameraRig'
import CommsTower from './CommsTower'
import DomainOrbit from './DomainOrbit'
import EducationModule from './EducationModule'
import Effects from './Effects'
import ParticleField from './ParticleField'
import ProjectGallery from './ProjectGallery'
import SkillUniverse from './SkillUniverse'
import Timeline from './Timeline'
import Workstation from './Workstation'
import { focusPoint, globalPointer } from './layout'

/** The whole 3D workspace. Lazy-loaded so the terminal is interactive before three.js arrives. */
export default function Scene() {
  const quality = useStore((s) => s.quality)
  const setQuality = useStore((s) => s.setQuality)
  const [dpr, setDpr] = useState(quality === 'high' ? 1.6 : 1.15)

  return (
    <Canvas
      className="canvas-layer"
      dpr={dpr}
      camera={{ position: [0, 0.7, 12.5], fov: 50, near: 0.1, far: 140 }}
      gl={{ antialias: false, powerPreference: 'high-performance', stencil: false }}
      aria-hidden="true"
    >
      <color attach="background" args={['#050807']} />
      <fog attach="fog" args={['#050807', 16, 52]} />

      <PerformanceMonitor
        onDecline={() => {
          setDpr(1)
          if (useStore.getState().quality === 'high') setQuality('low')
        }}
      />
      <AdaptiveDpr pixelated={false} />

      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 10, 8]} intensity={0.6} color="#bfffe0" />
      <InteractiveLight />
      <CameraRig />

      <Suspense fallback={null}>
        <ParticleField count={quality === 'high' ? 2200 : 900} />
        <Grid
          position={[0, -3, 0]}
          infiniteGrid
          cellSize={1}
          sectionSize={6}
          cellThickness={0.6}
          sectionThickness={1.1}
          cellColor="#0d3524"
          sectionColor="#1a7a52"
          fadeDistance={55}
          fadeStrength={1.4}
          followCamera={false}
        />
        <AICore />
        <DomainOrbit />
        <Workstation />
        <SkillUniverse />
        <ProjectGallery />
        <Timeline />
        <EducationModule />
        <CommsTower />
      </Suspense>

      <Effects quality={quality} />
    </Canvas>
  )
}

/** A light that hovers near whatever the camera is looking at and follows the mouse. */
function InteractiveLight() {
  const ref = useRef()
  useFrame(() => {
    if (!ref.current) return
    ref.current.position.set(focusPoint.x + globalPointer.x * 4, focusPoint.y + 2 + globalPointer.y * 2, focusPoint.z + 4)
  })
  return <pointLight ref={ref} intensity={18} distance={16} decay={1.6} color="#7dffd0" />
}
