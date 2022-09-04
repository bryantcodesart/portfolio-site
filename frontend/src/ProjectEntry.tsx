import React, {
  Ref,
  useMemo, useRef, useState,
} from 'react';
import {
  MathUtils, Mesh, Object3D,
} from 'three';
import { extend, ReactThreeFiber, useFrame } from '@react-three/fiber';
import { useInterval } from 'usehooks-ts';
import { animated, config, useSpring } from '@react-spring/three';
import { RoundedBoxGeometry } from 'three-stdlib';
import { MeshDistortMaterial } from '@react-three/drei';
import { Project } from '../generatedSanitySchemaTypes';
import { CoffeeVideoMaterial } from './CoffeeVideoMaterial';
import { ThreeButton } from './ThreeButton';
import colors from './colors';
import { ProjectHtml } from './ProjectHtml';
import { useBreakpoints } from './useBreakpoints';
import { CoordArray } from './CoordArray';
import { useHasNoMouse } from './useHasNoMouse';

const ROTATION_MAX_SPEED = 0.01;
const MAX_WANDER_DISTANCE = 0.5;

const getRandomCubeOffset = ():CoordArray => [
  (Math.random() * 2 - 1) * MAX_WANDER_DISTANCE,
  (Math.random() * 2 - 1) * MAX_WANDER_DISTANCE,
  (Math.random() * 2 - 1) * MAX_WANDER_DISTANCE,
];

const circle = Math.PI * 2;

extend({ RoundedBoxGeometry });

/* eslint-disable no-unused-vars */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'roundedBoxGeometry': ReactThreeFiber.Object3DNode<RoundedBoxGeometry, typeof RoundedBoxGeometry>;
    }
  }
}
/* eslint-enable no-unused-vars */

export const ProjectEntry = ({
  project,
  basePosition,
  open,
  setOpen,
  hovering,
  someProjectIsOpen,
  setHovering,
}:{
  project: Project;
  basePosition: CoordArray;
  open: boolean;
  setOpen: (_open: boolean) => void;
  someProjectIsOpen: boolean;
  hovering: boolean;
  setHovering: (_hovering: boolean) => void;
}) => {
  const breakpoints = useBreakpoints();

  const directionInterval = useMemo(() => Math.random() * 5000 + 2500, []);
  const [cubeFloatingOffset, setCubeFloatingOffset] = useState<CoordArray>(
    getRandomCubeOffset(),
  );
  const { animatedCubeFloatingOffset } = useSpring({
    animatedCubeFloatingOffset: open ? [0, 0, 0] as CoordArray : cubeFloatingOffset,
    config: {
      duration: open ? 100 : directionInterval,
    },
  });

  useInterval(() => {
    setCubeFloatingOffset(getRandomCubeOffset());
  }, directionInterval);

  const cubeRef = useRef<Mesh>();
  const rotationSpeeds = useRef({
    x: (Math.random() * 2 - 1) * ROTATION_MAX_SPEED,
    y: (Math.random() * 2 - 1) * ROTATION_MAX_SPEED,
    z: (Math.random() * 2 - 1) * ROTATION_MAX_SPEED,
  });

  const objectAimedAtCamera = useMemo(() => new Object3D(), []);

  useFrame(({ camera }) => {
    if (!cubeRef.current) return;
    if (hovering || open) {
      cubeRef.current.getWorldPosition(objectAimedAtCamera.position);
      objectAimedAtCamera.lookAt(camera.position);

      const { x, y, z } = cubeRef.current.rotation;
      cubeRef.current.rotation.x = MathUtils.lerp(
        x,
        Math.round(x / (circle)) * circle + objectAimedAtCamera.rotation.x,
        0.1,
      );
      cubeRef.current.rotation.y = MathUtils.lerp(
        y,
        Math.round(y / (circle)) * circle + objectAimedAtCamera.rotation.y,
        0.1,
      );
      cubeRef.current.rotation.z = MathUtils.lerp(
        z,
        Math.round(z / (circle)) * circle + objectAimedAtCamera.rotation.z,
        0.1,
      );
    } else {
      cubeRef.current.rotation.x += rotationSpeeds.current.x;
      cubeRef.current.rotation.y += rotationSpeeds.current.y;
      cubeRef.current.rotation.z += rotationSpeeds.current.z;
    }
  });

  const hasNoMouse = useHasNoMouse();
  let cubeScale = 1;
  if (hovering) {
    cubeScale = hasNoMouse ? 1.5 : 2;
    if (breakpoints.projects) {
      cubeScale = hasNoMouse ? 2 : 3;
    }
  }
  if (open) cubeScale = 1;

  const cubePosition:CoordArray = open
    ? [0, 0, 4]
    : basePosition;
  const { animatedCubePosition } = useSpring({
    animatedCubePosition: cubePosition,
    config: config.stiff,
  });

  const { spotlightIntensity } = useSpring({
    spotlightIntensity: open ? 0.5 : 0,
    delay: open ? 500 : 0,
    config: {
      duration: open ? 1000 : 0,
    },
  });

  const { animatedCubeScale } = useSpring({
    animatedCubeScale: cubeScale,
    config: config.wobbly,
  });

  const anotherProjectIsOpen = someProjectIsOpen && !open;

  return (
    <>
      <group
        position={basePosition}
      >
        <animated.group
          position={animatedCubeFloatingOffset}
        >
          <mesh
            position={[0, 0, -0.1]}
          >
            <sphereBufferGeometry
              args={[1, 20, 20]}
              attach="geometry"
            />
            <MeshDistortMaterial
              color={colors.cyan}
              speed={6}
              radius={1}
              distort={0.5}
              transparent
              opacity={0.4}
              roughness={0}
            />
          </mesh>
        </animated.group>
      </group>
      <animated.group
        position={animatedCubePosition}
      >
        <animated.group
          position={animatedCubeFloatingOffset}
          scale={animatedCubeScale}
        >
          <mesh
            ref={cubeRef as Ref<Mesh>}
          >
            <roundedBoxGeometry
              args={[1, 1, 1, 4, 0.1]}
              attach="geometry"
            />
            <CoffeeVideoMaterial src={`/videos/${project?.video}`} playing={hovering || open} />
          </mesh>
          {!anotherProjectIsOpen && (
          <ThreeButton
            position={[0, 0, 0.5]}
            width={1.1}
            height={1.1}
            description=""
            activationMsg=""
            cursor={open ? 'close-project' : 'open-project'}
            // debug
            onClick={() => {
              setOpen(!open);
            }}
            onFocus={() => {
              setHovering(true);
            }}
            onBlur={() => {
              setHovering(false);
            }}
          />
          )}
          {/* @ts-ignore */}
          <animated.pointLight
            position={[2, 0, 4]}
            intensity={spotlightIntensity}
          />
        </animated.group>
      </animated.group>

      {open && (
        <ProjectHtml
          project={project}
          position={breakpoints.projectOpen ? [-1.6, 0, 4.5] : [0, -0.6, 4.5]}
          setOpen={setOpen}
        />
      )}
      {/* <group
        position={[-1.4, 0.8, 3.2]}
        rotation={[0, 0, Math.PI / 9]}
      >
        <Scribble
          position={[0, 0, -0.1]}
          points={(labelBackPoints as CoordArray[])}
          size={2}
          lineWidth={0.15}
          color={new Color(TITLE_BACK_COLOR)}
          rotation={[Math.PI, 0, 0]}
          visible={showBack}
          drawSpringConfig={active ? config.molasses : config.stiff}
          scaleSpringConfig={config.wobbly}
          curved
          nPointsInCurve={1200}
        />
        <Text
          position={[0, -0.0, -0.1]}
          color={TITLE_TEXT_COLOR}
          anchorX="center"
          anchorY="middle"
          fontSize={0.25}
          font={fontUrls.bryantBold}
          visible={showText}
        >
          {project.title}
        </Text>
      </group> */}
    </>
  );
};
