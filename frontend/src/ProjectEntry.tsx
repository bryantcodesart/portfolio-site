import React, {
  Ref,
  useEffect,
  // useEffect,
  useMemo, useRef, useState,
  // useState,
} from 'react';
// import { Color } from 'three';
// import {
//   // config,
//   animated, useSpring,
// } from '@react-spring/three';
// import { useInterval } from 'usehooks-ts';
import {
  // DoubleSide,
  // BufferGeometry, Material,
  MathUtils, Mesh, Object3D, // Object3D,
  // Vector3,
} from 'three';
import { extend, ReactThreeFiber, useFrame } from '@react-three/fiber';
import { useInterval } from 'usehooks-ts';
import { animated, config, useSpring } from '@react-spring/three';
import { RoundedBoxGeometry } from 'three-stdlib';
import { MeshDistortMaterial } from '@react-three/drei';
import { Project } from '../generatedSanitySchemaTypes';
// import colors from './colors';
// import { fontUrls } from './typography';
import { CoffeeVideoMaterial } from './CoffeeVideoMaterial';
import { ThreeButton } from './ThreeButton';
import colors from './colors';
import { ProjectHtml } from './ProjectHtml';

const ROTATION_MAX_SPEED = 0.01;
const MAX_WANDER_DISTANCE = 0.5;

const getRandomCubeOffset = () => [
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
  // eslint-disable-next-line no-unused-vars
  project,
  basePosition,
  open,
  setOpen,
  hovering,
  setHovering,
}:{
  project: Project;
  basePosition: [number, number, number];
  open: boolean;
  setOpen: (_open: boolean) => void;
  hovering: boolean;
  setHovering: (_hovering: boolean) => void;
}) => {
  const [showSpotlight, setShowSpotlight] = useState(false);
  // const [showText, setShowText] = useState(false);
  // const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    const timeouts:ReturnType<typeof setTimeout>[] = [];
    if (open) {
      let delay = 0;
      timeouts.push(setTimeout(() => {
        setShowSpotlight(true);
      }, delay += 1500));
    } else {
      setShowSpotlight(false);
    }
    return () => {
      timeouts.forEach((timeout) => { clearTimeout(timeout); });
    };
  }, [open]);

  // const { cubeScale } = useSpring({
  //   cubeScale: showBack ? 1 : 0.7,
  //   config: config.wobbly,
  // });

  const directionInterval = useMemo(() => Math.random() * 5000 + 2500, []);
  const [cubeFloatingOffset, setCubeFloatingOffset] = useState(
    getRandomCubeOffset(),
  );
  const { animatedCubeFloatingOffset } = useSpring({
    animatedCubeFloatingOffset: open ? [0, 0, 0] : cubeFloatingOffset,
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

  // const worldPosition = useMemo(() => new Object3D(), []);

  const objectAimedAtCamera = useMemo(() => new Object3D(), []);

  useFrame(({ camera }) => {
    if (!cubeRef.current) return;
    if (hovering || open) {
      cubeRef.current.getWorldPosition(objectAimedAtCamera.position);
      objectAimedAtCamera.lookAt(camera.position);
      console.log(objectAimedAtCamera.position, camera.position);

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

  let cubeScale = 1;
  if (hovering) cubeScale = 3;
  if (open) cubeScale = 1;

  const { animatedCubePosition } = useSpring({
    animatedCubePosition: open
      ? [0, 0, 4]
      : basePosition,
    config: config.stiff,
  });

  const { animatedCubeScale } = useSpring({
    animatedCubeScale: cubeScale,
    config: config.wobbly,
  });

  return (
    <>
      <group
        position={basePosition}
      >
        <animated.group
          // @ts-ignore
          position={animatedCubeFloatingOffset}
        >
          <mesh
            position={[0, 0, -0.1]}
            // renderOrder={1}
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
              // depthTest={false}
              transparent
              opacity={0.4}
              roughness={0}
            />
          </mesh>
        </animated.group>
      </group>
      <animated.group
          // @ts-ignore
        position={animatedCubePosition}
      >
        <animated.group
          // @ts-ignore
          position={animatedCubeFloatingOffset}
          // @ts-ignore
          scale={animatedCubeScale}
        >
          <mesh
            // renderOrder={1}
            ref={cubeRef as Ref<Mesh>}
          >
            <roundedBoxGeometry
              args={[1, 1, 1, 4, 0.1]}
              attach="geometry"
            />
            <CoffeeVideoMaterial src={`/videos/${project?.video}`} playing={hovering || open} />
          </mesh>
          <ThreeButton
            position={[0, 0, 0.5]}
            width={1.1}
            height={1.1}
            description=""
            activationMsg=""
            cursor="normal"
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
          {showSpotlight && <pointLight position={[2, 0, 4]} intensity={1} />}
        </animated.group>
      </animated.group>

      {open && (
        <ProjectHtml project={project} />
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
