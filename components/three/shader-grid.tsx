'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;

  void main() {
    vec2 uv = vUv;
    vec2 mouse = uMouse * 0.5 + 0.5;
    float dist = length(uv - mouse);

    float grid = 0.0;
    vec2 g = fract(uv * 40.0 + uTime * 0.05) - 0.5;
    grid = smoothstep(0.48, 0.5, max(abs(g.x), abs(g.y)));

    float ripple = sin(dist * 30.0 - uTime * 2.0) * 0.5 + 0.5;
    ripple *= smoothstep(0.6, 0.0, dist);

    // Palette: ink #181b20 → signal #2796df (cerulean).
    vec3 ink = vec3(0.094, 0.106, 0.125);
    vec3 signal = vec3(0.155, 0.588, 0.875);
    vec3 col = mix(ink, signal, grid * 0.3 + ripple * 0.4);

    gl_FragColor = vec4(col, 0.6);
  }
`;

function Plane() {
  const ref = useRef<THREE.ShaderMaterial>(null);
  const { mouse, size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
    }),
    [size.width, size.height],
  );

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.uniforms.uTime.value = state.clock.elapsedTime;
    ref.current.uniforms.uMouse.value.lerp(new THREE.Vector2(mouse.x, mouse.y), 0.05);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={ref} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} transparent />
    </mesh>
  );
}

export function ShaderGrid() {
  return (
    <Canvas
      camera={{ position: [0, 0, 1] }}
      gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      dpr={[1, 1.5]}
    >
      <Plane />
    </Canvas>
  );
}
