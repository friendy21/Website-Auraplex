'use client';

import { useGLTF } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type Props = {
  url: string;
  autoRotate?: boolean;
  highlightPart?: string | null;
};

export function MachineModel({ url, autoRotate = true, highlightPart }: Props) {
  const { scene } = useGLTF(url) as any;
  const group = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    if (autoRotate && group.current) group.current.rotation.y += dt * 0.15;
  });

  useEffect(() => {
    scene.traverse((obj: THREE.Object3D) => {
      if (obj instanceof THREE.Mesh && obj.material) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        if (highlightPart && obj.name === highlightPart) {
          (obj.material as THREE.MeshStandardMaterial).emissive = new THREE.Color('#2796df');
          (obj.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.4;
        } else if (obj.material instanceof THREE.MeshStandardMaterial) {
          obj.material.emissiveIntensity = 0;
        }
      }
    });
  }, [scene, highlightPart]);

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}
