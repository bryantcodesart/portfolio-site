/* eslint-disable no-param-reassign */
// import { useRef } from 'react';
// import { useFrame } from '@react-three/fiber';
// import * as THREE from 'three';
// import { useEventListener } from 'usehooks-ts';
// import { useHasNoMouse } from './useHasNoMouse';
// import { useScroll } from '@react-three/drei';
import React, { useRef } from 'react';

import { useHelper } from '@react-three/drei';
import {
  BoxHelper, Mesh, Vector3,
  PerspectiveCamera,
  MathUtils,
} from 'three';
import { useFrame } from '@react-three/fiber';
// import { animated, useSpring, config } from '@react-spring/three';

// function zoomCameraToSelection( camera, controls, selection, fitOffset = 1.2 ) {

//   const box = new THREE.Box3();

//   for( const object of selection ) box.expandByObject( object );

//   const size = box.getSize( new THREE.Vector3() );
//   const center = box.getCenter( new THREE.Vector3() );

//   const maxSize = Math.max( size.x, size.y, size.z );
//   const fitHeightDistance = maxSize / ( 2 * Math.atan( Math.PI * camera.fov / 360 ) );
//   const fitWidthDistance = fitHeightDistance / camera.aspect;
//   const distance = fitOffset * Math.max( fitHeightDistance, fitWidthDistance );

//   const direction = controls.target.clone()
//     .sub( camera.position )
//     .normalize()
//     .multiplyScalar( distance );

//   controls.maxDistance = distance * 10;
//   controls.target.copy( center );

//   camera.near = distance / 100;
//   camera.far = distance * 100;
//   camera.updateProjectionMatrix();

//   camera.position.copy( controls.target ).sub(direction);

//   controls.update();

// }

export const CameraController = ({ stagePosition, stageSize, speed = 0.05 }:{
  stagePosition:[number, number, number],
  stageSize: [number, number, number],
  speed?:number
}) => {
  // const mouseNormalizeCoords = useRef<{ x: number; y: number; } | null>(null);

  // const hasNoMouse = useHasNoMouse();

  // useEventListener('mousemove', (e) => {
  //   mouseNormalizeCoords.current = {
  //     x: e.clientX / window.innerWidth - 0.5,
  //     y: (1 - e.clientY / window.innerHeight) - 0.5,
  //   };
  // });

  // const fov = 50;
  // const planeAspectRatio = stageSize[0] / stageSize[1];

  // const { camera } = useThree();
  useFrame(({ camera }) => {
    const perspectiveCamera = camera as PerspectiveCamera;
    // const defaultMouseCoords = { x: 0, y: 0 };
    // let { x: displaceX, y: displaceY } = mouseNormalizeCoords.current
    //   ? mouseNormalizeCoords.current : defaultMouseCoords;

    // if (hasNoMouse) {
    //   ({ x: displaceX, y: displaceY } = defaultMouseCoords);
    // }

    // if (perspectiveCamera.aspect > planeAspectRatio) {
    //   // window too large
    //   perspectiveCamera.fov = fov;
    // } else {
    //   // window too narrow
    //   const cameraHeight = Math.tan(MathUtils.degToRad(fov / 2));
    //   const ratio = perspectiveCamera.aspect / planeAspectRatio;
    //   const newCameraHeight = cameraHeight / ratio;
    //   perspectiveCamera.fov = MathUtils.radToDeg(Math.atan(newCameraHeight)) * 2;
    // }

    const [width, height] = stageSize;
    // const { fov } = perspectiveCamera;
    const heightFitDistance = (height / 2)
    / Math.tan(MathUtils.degToRad(perspectiveCamera.fov / 2));

    const distance = heightFitDistance;
    console.log(distance);

    const [x, y, z] = stagePosition;
    camera.position.lerp(new Vector3(
      x,
      y,
      distance + z,
      // displaceX * 2 + position[0],
      // displaceY * 1 + position[1],
      // position[2],
    ), speed);
  });

  // const animatedPosition = useSpring({});

  // console.log(speed);

  const meshRef = useRef<Mesh>(null);
  useHelper(meshRef, BoxHelper, 'red');

  return (
    <mesh
      position={stagePosition}
      // scale={stageSize}
      ref={meshRef}
    >
      <boxGeometry
        attach="geometry"
        args={stageSize}
      />
      <meshBasicMaterial
        attach="material"
        color="blue"
        // visible={false}
      />
    </mesh>
  );
};
