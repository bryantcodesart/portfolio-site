import React, { useRef } from 'react';
import { useFrame, Vector3 } from '@react-three/fiber';
// import { BufferGeometry, Mesh } from 'three';
import * as THREE from 'three';

// import { useColorTreatmentControls } from './useColorTreatmentControls';
// import { Treatment } from './Treatment';
export function Box({ position, speed = 0.02 }: { position: Vector3; speed?: number; }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame(() => {
    if (typeof meshRef.current?.rotation?.x === 'undefined') { return; }
    meshRef.current.rotation.x += speed;
    meshRef.current.rotation.y += speed;
    meshRef.current.rotation.z += speed;
  });

  return (
    <mesh
    // @ts-ignore
      ref={meshRef}
      position={position}
    >
      <boxGeometry args={[50, 50, 50]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
}
