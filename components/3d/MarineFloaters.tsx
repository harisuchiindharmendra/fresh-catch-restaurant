'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { pointer } from '@/lib/pointer';
import { scrollState } from '@/lib/scroll-state';

type FloaterSpec = {
  position: [number, number, number];
  scale: number;
  speed: number;
  geom: 'sphere' | 'torus' | 'icosa';
  tone: 'gold' | 'ivory' | 'pearl' | 'cyan';
};

function buildSpecs(): FloaterSpec[] {
  const specs: FloaterSpec[] = [];
  const palette: FloaterSpec['tone'][] = ['gold', 'pearl', 'ivory', 'cyan', 'pearl', 'gold', 'cyan'];
  const COUNT = 10;
  for (let i = 0; i < COUNT; i++) {
    // bias position to edges so the video center stays clear
    const sideSign = Math.random() < 0.5 ? -1 : 1;
    const sideX = sideSign * (3 + Math.random() * 6);
    const sideY = (Math.random() - 0.5) * 9;
    const z = -3 - Math.random() * 10;
    const scale = 0.32 + Math.random() * 0.7;
    const speed = 0.04 + Math.random() * 0.1;
    const geomPick = Math.random();
    const geom: FloaterSpec['geom'] =
      geomPick < 0.55 ? 'sphere' : geomPick < 0.85 ? 'torus' : 'icosa';
    const tone = palette[i % palette.length];
    specs.push({ position: [sideX, sideY, z], scale, speed, geom, tone });
  }
  return specs;
}

const TONE_COLORS: Record<
  FloaterSpec['tone'],
  { color: string; emissive: string; emissiveIntensity: number }
> = {
  gold: { color: '#c8a86a', emissive: '#d4b97e', emissiveIntensity: 0.75 },
  ivory: { color: '#f5efe6', emissive: '#fff6e6', emissiveIntensity: 0.6 },
  pearl: { color: '#e8e0d0', emissive: '#fff1d9', emissiveIntensity: 0.65 },
  cyan: { color: '#78b2dc', emissive: '#3a6f9a', emissiveIntensity: 0.6 },
};

function Floater({ spec }: { spec: FloaterSpec }) {
  const ref = useRef<THREE.Mesh>(null);
  const base = useMemo(
    () => ({
      bx: spec.position[0],
      by: spec.position[1],
      bz: spec.position[2],
      phase: Math.random() * Math.PI * 2,
    }),
    [spec]
  );

  useFrame((state) => {
    const m = ref.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    m.position.x = base.bx + Math.sin(t * spec.speed + base.phase) * 0.7;
    m.position.y =
      base.by +
      Math.cos(t * spec.speed * 0.8 + base.phase) * 0.55 -
      scrollState.progress * 3.5;
    m.position.z = base.bz + Math.sin(t * spec.speed * 0.5 + base.phase) * 0.45;
    m.rotation.x = t * spec.speed * 0.35 + base.phase;
    m.rotation.y = t * spec.speed * 0.5 + base.phase;
  });

  const tone = TONE_COLORS[spec.tone];

  const geometry = useMemo(() => {
    if (spec.geom === 'sphere') return <sphereGeometry args={[1, 32, 32]} />;
    if (spec.geom === 'torus') return <torusGeometry args={[0.9, 0.22, 16, 64]} />;
    return <icosahedronGeometry args={[1, 1]} />;
  }, [spec.geom]);

  return (
    <mesh ref={ref} position={spec.position} scale={spec.scale}>
      {geometry}
      <meshPhysicalMaterial
        color={tone.color}
        emissive={tone.emissive}
        emissiveIntensity={tone.emissiveIntensity}
        roughness={0.18}
        metalness={0.25}
        transmission={0.85}
        thickness={0.85}
        clearcoat={0.7}
        clearcoatRoughness={0.18}
        ior={1.45}
        transparent
        opacity={0.62}
      />
    </mesh>
  );
}

const causticVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const causticFrag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uScroll;
  uniform vec2  uMouse;

  // hash + fbm based caustic — cheap and tileable
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 4; i++) {
      v += amp * noise(p);
      p *= 2.0;
      amp *= 0.5;
    }
    return v;
  }
  void main() {
    vec2 uv = vUv;
    vec2 p = uv * 5.5;
    p += vec2(uMouse.x * 0.4, -uMouse.y * 0.4);
    p.y += uScroll * 1.2;

    float t = uTime * 0.16;
    float n = fbm(p + vec2(t, -t * 0.7));
    float n2 = fbm(p * 1.7 + vec2(-t * 0.5, t * 0.8));
    float caustic = pow(abs(n - n2) * 1.5, 2.0);

    // soft mask — fade toward edges so caustics don't overpower the video
    float mask = smoothstep(0.0, 0.4, uv.x) * smoothstep(0.0, 0.4, 1.0 - uv.x)
               * smoothstep(0.0, 0.3, uv.y) * smoothstep(0.0, 0.3, 1.0 - uv.y);

    // luxury gold + ocean blue tint
    vec3 cGold = vec3(0.78, 0.66, 0.42);
    vec3 cBlue = vec3(0.32, 0.55, 0.78);
    vec3 col = mix(cBlue, cGold, smoothstep(0.0, 0.6, caustic));
    float a = caustic * mask * 0.55;

    gl_FragColor = vec4(col, a);
  }
`;

function CausticPlane() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  useFrame((state) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    matRef.current.uniforms.uScroll.value = scrollState.progress;
    matRef.current.uniforms.uMouse.value.x = pointer.lerpNX - 0.5;
    matRef.current.uniforms.uMouse.value.y = pointer.lerpNY - 0.5;
  });
  return (
    <mesh position={[0, 0, -8]} scale={[30, 18, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={causticVert}
        fragmentShader={causticFrag}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
        }}
      />
    </mesh>
  );
}

function CameraDrift() {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 0));
  useFrame(() => {
    const tx = (pointer.lerpNX - 0.5) * 1.4;
    const ty = -(pointer.lerpNY - 0.5) * 1.0;
    camera.position.x += (tx - camera.position.x) * 0.03;
    camera.position.y += (ty - camera.position.y) * 0.03;
    camera.lookAt(target.current);
  });
  return null;
}

export default function MarineFloaters() {
  const specs = useMemo(() => buildSpecs(), []);
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 8], fov: 42, near: 0.1, far: 60 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'transparent' }}
      frameloop="always"
    >
      {/* transparent canvas — hero video shows through */}
      <fog attach="fog" args={['#040912', 8, 26]} />
      <ambientLight intensity={0.38} color="#7caee0" />
      <directionalLight position={[5, 6, 8]} intensity={0.8} color="#fff1cc" />
      <directionalLight position={[-6, -2, 4]} intensity={0.45} color="#5d92c6" />
      <pointLight position={[0, 0, 4]} intensity={0.55} color="#c8a86a" distance={14} />
      <CameraDrift />
      <CausticPlane />
      {specs.map((s, i) => (
        <Floater key={i} spec={s} />
      ))}
    </Canvas>
  );
}
