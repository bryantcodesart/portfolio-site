import React, {
  Ref,
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
  // BufferGeometry, Material,
  MathUtils, Mesh,
  // Vector3,
} from 'three';
import { extend, ReactThreeFiber, useFrame } from '@react-three/fiber';
import { useInterval } from 'usehooks-ts';
import { animated, useSpring } from '@react-spring/three';
import { RoundedBoxGeometry } from 'three-stdlib';
import { Project } from '../generatedSanitySchemaTypes';
// import colors from './colors';
// import { fontUrls } from './typography';
import { CoffeeVideoMaterial } from './CoffeeVideoMaterial';
import { ThreeButton } from './ThreeButton';
// import labelBackPoints from './lines/labelBack';
// import { Scribble } from './Scribble';
// import { CoordArray } from './CoordArray';

// const TITLE_BACK_COLOR = colors.cyan;
// const TITLE_TEXT_COLOR = colors.blue;

const ROTATION_MAX_SPEED = 0.01;
const MAX_WANDER_DISTANCE = 0.5;

const getRandomCubePosition = () => [
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

// type RoundedBoxType = Mesh<BufferGeometry, Material | Material[]>

// eslint-disable-next-line no-unused-vars
export const ProjectEntry = ({ project, theta }: { project: Project; theta: number }) => {
  const active = false;

  const [hovering, setHovering] = useState(false);
  // const [showText, setShowText] = useState(false);
  // const [showBack, setShowBack] = useState(false);

  // useEffect(() => {
  //   const timeouts:ReturnType<typeof setTimeout>[] = [];
  //   if (active) {
  //     let delay = 0;
  //     timeouts.push(setTimeout(() => {
  //       setShowBack(true);
  //     }, delay += 400));
  //     timeouts.push(setTimeout(() => {
  //       setShowText(true);
  //     }, delay += 1000));
  //   } else {
  //     setShowBack(false);
  //     setShowText(false);
  //   }
  //   return () => {
  //     timeouts.forEach((timeout) => { clearTimeout(timeout); });
  //   };
  // }, [active]);

  // const { cubeScale } = useSpring({
  //   cubeScale: showBack ? 1 : 0.7,
  //   config: config.wobbly,
  // });

  const directionInterval = useMemo(() => Math.random() * 5000 + 2500, []);
  const [cubePosition, setCubePosition] = useState(getRandomCubePosition());
  const { animatedCubePosition } = useSpring({
    animatedCubePosition: cubePosition,
    config: {
      duration: directionInterval,
    },
  });

  useInterval(() => {
    setCubePosition(getRandomCubePosition());
  }, directionInterval);

  const radius = 2.7; // useMemo(() => Math.random() * 1.2 + 3, []);

  const cubeRef = useRef<Mesh>();
  const rotationSpeeds = useRef({
    x: (Math.random() * 2 - 1) * ROTATION_MAX_SPEED,
    y: (Math.random() * 2 - 1) * ROTATION_MAX_SPEED,
    z: (Math.random() * 2 - 1) * ROTATION_MAX_SPEED,
  });
  useFrame(() => {
    if (!cubeRef.current) return;
    if (hovering) {
      const { x, y, z } = cubeRef.current.rotation;
      cubeRef.current.rotation.x = MathUtils.lerp(x, Math.round(x / (circle)) * circle, 0.1);
      cubeRef.current.rotation.y = MathUtils.lerp(y, Math.round(y / (circle)) * circle, 0.1);
      cubeRef.current.rotation.z = MathUtils.lerp(z, Math.round(z / (circle)) * circle, 0.1);
    } else {
      cubeRef.current.rotation.x += rotationSpeeds.current.x;
      cubeRef.current.rotation.y += rotationSpeeds.current.y;
      cubeRef.current.rotation.z += rotationSpeeds.current.z;
    }
  });

  const { animatedCubeScale } = useSpring({
    animatedCubeScale: hovering ? 2 : 1,
    config: {
      duration: 2000,
    },
  });

  return (
    <>
      <group
        position={[Math.cos(theta) * radius, Math.sin(theta) * radius, 0]}
      >
        <animated.group
          // @ts-ignore
          position={animatedCubePosition}
          // @ts-ignore
          scale={animatedCubeScale}
        >
          <mesh
            renderOrder={1}
            ref={cubeRef as Ref<Mesh>}
          >
            <roundedBoxGeometry
              args={[1, 1, 1, 2, 0.1]}
              attach="geometry"
            />
            <CoffeeVideoMaterial src="/videos/test.mp4" playing={hovering} />
          </mesh>
          <ThreeButton
            position={[0, 0, 0.5]}
            width={1.2}
            height={1.2}
            description=""
            activationMsg=""
            cursor="normal"
            onClick={() => {
              console.log('click');
            }}
            onFocus={() => {
              setHovering(true);
            }}
            onBlur={() => {
              setHovering(false);
            }}
            // debug
          />
        </animated.group>
      </group>
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
