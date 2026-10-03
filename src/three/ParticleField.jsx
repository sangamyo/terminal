import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { AdditiveBlending, Color } from 'three'
import { useStore } from '../store/useStore'

const vertex = /* glsl */ `
  attribute float aScale;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.25 + position.x * 0.35) * 0.45;
    p.x += cos(uTime * 0.18 + position.z * 0.3) * 0.3;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = 70.0 * aScale * uPixelRatio / -mv.z;
    vColor = aColor;
    vAlpha = smoothstep(70.0, 6.0, -mv.z) * (0.55 + 0.45 * sin(uTime * 1.3 + aScale * 40.0));
  }
`
const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor * 1.6, a * vAlpha);
  }
`

/** Drifting data motes spread across the whole workspace. */
export default function ParticleField({ count = 1500 }) {
  const material = useRef()
  const dpr = useThree((s) => s.viewport.dpr)
  const reduced = useStore((s) => s.reducedMotion)

  const { positions, scales, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const colors = new Float32Array(count * 3)
    const a = new Color('#39ff88')
    const b = new Color('#22e5ff')
    const c = new Color()
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 90
      positions[i * 3 + 1] = Math.random() * 26 - 6
      positions[i * 3 + 2] = (Math.random() - 0.5) * 95
      scales[i] = 0.3 + Math.random() * 0.9
      c.copy(a).lerp(b, Math.random())
      colors.set([c.r, c.g, c.b], i * 3)
    }
    return { positions, scales, colors }
  }, [count])

  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uPixelRatio: { value: dpr } }), [dpr])

  useFrame((_, dt) => {
    if (material.current && !reduced) material.current.uniforms.uTime.value += dt
  })

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  )
}
