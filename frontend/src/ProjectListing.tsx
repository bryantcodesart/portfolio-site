import React, {
  useEffect, useState,
} from 'react';
import { MeshDistortMaterial, Text } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';
import { animated, useSpring, config } from '@react-spring/three';
import {
  DoubleSide,
} from 'three';
import { useInterval } from 'usehooks-ts';
import { Project } from '../generatedSanitySchemaTypes';
import { ProjectEntry } from './ProjectEntry';
import colors from './colors';
import { useWindowAspectRatio } from './useWindowAspectRatio';
import { getIsPortraitProjects } from './getIsPortraitProjects';
import { useHasNoMouse } from './useHasNoMouse';
import { useSceneController } from './SceneController';
import { fontUrls } from './typography';

export function ProjectListing({ active, projects, ...groupProps }:
  { active:boolean, projects: Project[] | null; } & GroupProps) {
  const [blobIsBig, setBlobIsBig] = useState(false);

  const [hoveredIndex, setHoveredIndex] = useState<null|number>(null);
  const [openIndex, setOpenIndex] = useState<null|number>(null);

  const nProjects = projects?.length ?? 0;
  const arcPerProject = projects ? ((Math.PI * 2) / nProjects) : 0;

  const hasNoMouse = useHasNoMouse();
  useInterval(() => {
    if (hasNoMouse) setHoveredIndex(((hoveredIndex ?? 0) + 1) % nProjects);
  }, 3000);

  const aspectRatio = useWindowAspectRatio();
  const isPortraitProjects = getIsPortraitProjects(aspectRatio);

  let blobTargetPosition = [0, 0, 0];
  if (!blobIsBig) {
    blobTargetPosition = [3.62, 1.91, 0];
    if (isPortraitProjects) blobTargetPosition = [1, 3.91, 0];
  }

  const { blobScale, blobPosition } = useSpring({
    blobPosition: blobTargetPosition,
    blobScale: blobIsBig ? 1 : 0,
    config: active ? config.gentle : config.stiff,
  });

  const aProjectIsOpen = openIndex !== null;

  const { backgroundOpacity } = useSpring({
    backgroundOpacity: aProjectIsOpen ? 1 : 0,
    delay: aProjectIsOpen ? 500 : 0,
    config: aProjectIsOpen ? config.slow : {
      duration: 150,
    },
  });

  useEffect(() => {
    if (active) {
      let delay = 0;
      setTimeout(() => {
        setBlobIsBig(true);
      }, delay += 500);
    } else {
      setTimeout(() => {
        setBlobIsBig(false);
      }, 500);
    }
  }, [active]);

  const radius = isPortraitProjects ? 2.4 : 2.7;

  const { setScene } = useSceneController();

  return (
    <group {...groupProps}>
      <animated.group
        scale={blobScale}
        // @ts-ignore
        position={blobPosition}
      >
        <mesh
          position={[0, 0, -5]}
          scale={[2.5, 2.5, 1]}
        >
          <sphereBufferGeometry
            args={[4, 70, 70]}
            attach="geometry"
          />
          <MeshDistortMaterial
            color={colors.coffee}
            speed={6}
            radius={1}
            distort={0.3}
          // depthTest={false}
            transparent
            opacity={0.7}
            side={DoubleSide}
          />
        </mesh>
        <Text
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          color={colors.cyan}
          anchorX="center"
          anchorY="middle"
          textAlign="center"
          fontSize={0.7}
          font={fontUrls.bryantBold}
        >
          {'Some things\nI built!'}
        </Text>
      </animated.group>
      <mesh
        position={[0, 0, 3]}
        // renderOrder={1}
      >
        <boxGeometry
          attach="geometry"
          args={[20, 20, 0.01]}
        />
        {/* @ts-ignore */}
        <animated.meshBasicMaterial
          attach="material"
          color="black"
          transparent
          opacity={backgroundOpacity}
          // depthTest={false}
        />
      </mesh>
      <animated.group
        scale={blobScale}
        // @ts-ignore
        position={blobPosition}
      >
        {projects && projects.map((project, index) => (
          <ProjectEntry
            project={project}
            key={project._id + index.toString()}
            basePosition={[
              Math.sin(index * arcPerProject) * radius,
              Math.cos(index * arcPerProject) * radius,
              0,
            ]}
            hovering={openIndex === null && hoveredIndex === index}
            setHovering={(isHovering:boolean) => {
              if (isHovering) setHoveredIndex(index);
              else if (!isHovering && hoveredIndex === index) setHoveredIndex(null);
            }}
            open={openIndex === index}
            setOpen={(isOpening:boolean) => {
              if (isOpening && !aProjectIsOpen) {
                setOpenIndex(index);
                setScene('project-open');
              } else if (!isOpening && openIndex === index) {
                setOpenIndex(null);
                setScene('projects');
                setHoveredIndex(null);
              }
            }}
          />
        ))}
      </animated.group>
    </group>
  );
}
