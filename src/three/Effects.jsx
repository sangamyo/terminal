import { useFrame } from '@react-three/fiber'
import { Bloom, ChromaticAberration, DepthOfField, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { useRef } from 'react'
import { useStore } from '../store/useStore'
import { focusPoint } from './layout'

/** Bloom for the neon glow, subtle depth of field, film noise and a glitch spike on demand. */
export default function Effects({ quality }) {
  const chroma = useRef()
  const dof = useRef()

  useFrame(() => {
    if (dof.current?.target) dof.current.target.copy(focusPoint)
    if (chroma.current) {
      const since = (performance.now() - useStore.getState().glitch) / 1000
      const spike = since < 0.9 ? (1 - since / 0.9) * 0.012 * (Math.random() > 0.3 ? 1 : -1) : 0
      chroma.current.offset.set(0.0005 + spike, 0.0005 - spike * 0.6)
    }
  })

  if (quality === 'high') {
    return (
      <EffectComposer multisampling={0} key="high">
        <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.22} luminanceSmoothing={0.25} radius={0.72} />
        <DepthOfField ref={dof} target={[0, 0, 0]} worldFocusRange={16} bokehScale={1.6} />
        <ChromaticAberration ref={chroma} offset={[0.0005, 0.0005]} radialModulation modulationOffset={0.35} />
        <Noise opacity={0.035} premultiply />
        <Vignette offset={0.22} darkness={0.78} />
      </EffectComposer>
    )
  }

  return (
    <EffectComposer multisampling={0} key="low">
      <Bloom mipmapBlur intensity={0.75} luminanceThreshold={0.28} luminanceSmoothing={0.25} radius={0.6} />
      <ChromaticAberration ref={chroma} offset={[0.0005, 0.0005]} />
      <Vignette offset={0.22} darkness={0.75} />
    </EffectComposer>
  )
}
