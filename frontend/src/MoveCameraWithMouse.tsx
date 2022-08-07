import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEventListener } from 'usehooks-ts';

export const MoveCameraWithMouse = () => {
  const mouse = useRef<{ x: number; y: number; } | null>(null);

  useEventListener('mousemove', (e) => {
    mouse.current = {
      x: e.clientX / window.innerWidth - 0.5,
      y: (1 - e.clientY / window.innerHeight) - 0.5,
    };
  });

  useFrame(({ camera }) => {
    const { x, y } = mouse.current ? mouse.current : { x: 0, y: 0 };
    camera.position.lerp(new THREE.Vector3(x / 2, y / 2, 5), 0.1);
  });

  return null;
};
