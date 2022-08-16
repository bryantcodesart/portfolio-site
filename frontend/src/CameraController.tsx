import React, { useEffect, useRef } from 'react';
import { useHelper } from '@react-three/drei';
import {
  BoxHelper, Mesh, Vector3,
  PerspectiveCamera,
  MathUtils,
} from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useEventListener } from 'usehooks-ts';
import { useHasNoMouse } from './useHasNoMouse';

export const CameraController = ({
  stagePosition,
  stageSize,
  lerpAlpha = 0.05,
  debug = false,
  controllable = true,
}:{
  stagePosition:[number, number, number],
  stageSize: [number, number],
  lerpAlpha?:number,
  debug?:boolean,
  controllable?:boolean,
}) => {
  const mouseNormalizeCoords = useRef<{ x: number; y: number; } | null>(null);

  const hasNoMouse = useHasNoMouse();

  useEventListener('mousemove', (e) => {
    mouseNormalizeCoords.current = {
      x: e.clientX / window.innerWidth - 0.5,
      y: (1 - e.clientY / window.innerHeight) - 0.5,
    };
  });

  const cameraDistance = useRef(5);

  const { camera } = useThree();

  useEffect(() => {
    const perspectiveCamera = camera as PerspectiveCamera;
    const [width, height] = stageSize;

    const heightFitDistance = (height / 2)
      / Math.tan(MathUtils.degToRad(perspectiveCamera.fov / 2));

    const widthFitDistance = ((width / 2) / perspectiveCamera.aspect)
    / Math.tan(MathUtils.degToRad(perspectiveCamera.fov / 2));

    cameraDistance.current = Math.max(widthFitDistance, heightFitDistance);
    // console.log('cameraDistance', cameraDistance.current);
  }, [stageSize]);

  useFrame(() => {
    const defaultMouseCoords = { x: 0, y: 0 };
    let { x: displaceX, y: displaceY } = mouseNormalizeCoords.current
      ? mouseNormalizeCoords.current : defaultMouseCoords;

    if (hasNoMouse) {
      ({ x: displaceX, y: displaceY } = defaultMouseCoords);
    }

    if (!controllable) {
      ({ x: displaceX, y: displaceY } = defaultMouseCoords);
    }

    const [x, y, z] = stagePosition;
    camera.position.lerp(new Vector3(
      x + displaceX * 2,
      y + displaceY * 1,
      cameraDistance.current + z,
    ), lerpAlpha);
  });

  const meshRef = useRef<Mesh>(null);
  useHelper(debug ? meshRef : undefined, BoxHelper, 'red');

  return (
    <mesh
      position={stagePosition}
      ref={meshRef}
      // renderOrder
    >
      <boxGeometry
        attach="geometry"
        args={[...stageSize, 0.01]}
      />
      <meshBasicMaterial
        attach="material"
        color="blue"
        // transparent
        // opacity={0.5}
        // depthTest={false}
        visible={false}
      />
    </mesh>
  );
};
