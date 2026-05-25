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
  const palette: FloaterSpec['tone'][] = ['gold', 'pearl', 'ivory', 'cyan', 'pearl', 'gold'];
  const COUNT = 9;
  for (let i = 0; i < COUNT; i++) {
    // bias position to edges so they frame the video rather than cover its center
    const sideX = (Math.random() - 0.5) * 16;
    const sideY = (Math.random() - 0.5) * 9;
    const z = -3 - Math.random() * 10;
    const scale = 0.32 + Math.random() * 0.65;
    const speed = 0.04 + Math.random() * 0.09;
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
  gold: { color: '#c8a86a', emissive: '#d4b97e', emissiveIntensity: 0.7 },
  ivory: { color: '#f5efe6', emissive: '#fff6e6', emissiveIntensity: 0.55 },
  pearl: { color: '#e8e0d0', emissive: '#fff1d9', emissiveIntensity: 0.6 },
  cyan: { color: '#78b2dc', emissive: '#3a6f9a', emissiveIntensity: 0.55 },
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
        thickness={0.8}
        clearcoat={0.7}
        clearcoatRoughness={0.18}
        ior={1.45}
        transparent
        opacity={0.55}
      />
    </mesh>
  );
}

function CameraDrift() {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 0));
  useFrame(() => {
    const tx = (pointer.lerpNX - 0.5) * 1.3;
    const ty = -(pointer.lerpNY - 0.5) * 0.9;
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
      {/* IMPORTANT: no <color attach="background"/> — must stay transparent so the hero video shows through */}
      <fog attach="fog" args={['#040912', 8, 26]} />
      <ambientLight intensity={0.36} color="#7caee0" />
      <directionalLight position={[5, 6, 8]} intensity={0.75} color="#fff1cc" />
      <directionalLight position={[-6, -2, 4]} intensity={0.42} color="#5d92c6" />
      <pointLight position={[0, 0, 4]} intensity={0.45} color="#c8a86a" distance={14} />
      <CameraDrift />
      {specs.map((s, i) => (
        <Floater key={i} spec={s} />
      ))}
    </Canvas>
  );
}
