'use client';

import { Environment, ContactShadows } from '@react-three/drei';

export function FactoryEnvironment() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 3]} intensity={1.4} castShadow shadow-mapSize={[1024, 1024]} />
      {/* Cool rim light keyed to brand signal (cerulean) for cinematic separation. */}
      <directionalLight position={[-3, 4, -5]} intensity={0.3} color="#4eaae9" />
      <Environment preset="warehouse" />
      <ContactShadows position={[0, -0.5, 0]} opacity={0.5} scale={10} blur={2.5} far={2} />
    </>
  );
}
