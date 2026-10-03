import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import { AdditiveBlending, Color } from 'three'
import { useStore } from '../store/useStore'
import { NOISE_GLSL, neon } from './materials'

const coreVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPulse;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vNoise;
  ${NOISE_GLSL}
  void main() {
    float n = snoise(normal * 1.6 + uTime * 0.35);
    vNoise = n;
    vec3 p = position + normal * n * (0.12 + 0.1 * uPulse);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`
const coreFragment = /* glsl */ `
  uniform vec3 uA;
  uniform vec3 uB;
  uniform float uPulse;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vNoise;
  void main() {
    float fres = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.2);
    vec3 col = mix(uA, uB, smoothstep(-0.4, 0.6, vNoise));
    col *= 0.35 + fres * (2.4 + uPulse);
    gl_FragColor = vec4(col, 0.92);
  }
`

/** The pulsing "AI CORE" at the centre of the workspace. */
export default function AICore() {
  const group = useRef()
  const shell = useRef()
  const rings = useRef()
  const [hovered, setHovered] = useState(false)
  const runCommand = useStore((s) => s.runCommand)
  const reduced = useStore((s) => s.reducedMotion)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPulse: { value: 0 },
      uA: { value: new Color('#0aff7a') },
      uB: { value: new Color('#19d9ff') },
    }),
    [],
  )

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    if (!reduced) uniforms.uTime.value += dt * (hovered ? 2.2 : 1)
    uniforms.uPulse.value += ((hovered ? 1 : 0.25 + 0.25 * Math.sin(t * 1.4)) - uniforms.uPulse.value) * 0.08
    if (reduced) return
    shell.current.rotation.y += dt * 0.15
    shell.current.rotation.x += dt * 0.05
    rings.current.children.forEach((r, i) => {
      r.rotation.z += dt * (0.2 + i * 0.12) * (i % 2 ? -1 : 1)
    })
    group.current.position.y = Math.sin(t * 0.8) * 0.12
  })

  return (
    <group ref={group}>
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = ''
        }}
        onClick={(e) => {
          e.stopPropagation()
          if (useStore.getState().view !== 'immersive') runCommand('3d')
        }}
      >
        <icosahedronGeometry args={[1.15, 24]} />
        <shaderMaterial vertexShader={coreVertex} fragmentShader={coreFragment} uniforms={uniforms} transparent toneMapped={false} />
      </mesh>

      {/* inner bright seed */}
      <mesh scale={0.45}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color={neon('#b9ffe0', 3)} toneMapped={false} />
      </mesh>

      <mesh ref={shell}>
        <icosahedronGeometry args={[1.85, 1]} />
        <meshBasicMaterial color={neon('#22e5ff', 1.4)} wireframe transparent opacity={0.35} toneMapped={false} />
      </mesh>

      <group ref={rings}>
        {[
          [2.45, [Math.PI / 2.2, 0, 0], '#39ff88'],
          [2.75, [Math.PI / 3, Math.PI / 5, 0], '#22e5ff'],
          [3.05, [Math.PI / 1.7, -Math.PI / 6, 0], '#39ff88'],
        ].map(([r, rot, c], i) => (
          <mesh key={i} rotation={rot}>
            <torusGeometry args={[r, 0.011, 6, 180]} />
            <meshBasicMaterial color={neon(c, 2.2)} toneMapped={false} transparent opacity={0.75} blending={AdditiveBlending} />
          </mesh>
        ))}
      </group>

      <pointLight color="#39ff88" intensity={25} distance={14} decay={1.8} />
    </group>
  )
}
