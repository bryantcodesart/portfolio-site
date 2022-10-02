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
import { useBreakpoints } from './useBreakpoints';
import { useHasNoMouse } from './useHasNoMouse';
import { useSceneController } from './SceneController';
import { fontUrls } from './typography';
import { BackgroundColorMaterial } from './ProjectBackgroundMaterial';

export function ProjectListing({ active, projects, ...groupProps }:
  { active:boolean, projects: Project[] | null; } & GroupProps) {
  const [blobIsBig, setBlobIsBig] = useState(false);

  const [hoveredIndex, setHoveredIndex] = useState<null|number>(null);
  const [openIndex, setOpenIndex] = useState<null|number>(null);

  const breakpoints = useBreakpoints();

  const nProjects = projects?.length ?? 0;
  const arcPerProject = projects ? ((Math.PI * 2) / nProjects) : 0;

  const [autoHover, setAutoHover] = useState(false);
  const hasNoMouse = useHasNoMouse();

  const aProjectIsOpen = openIndex !== null;

  useInterval(() => {
    if (aProjectIsOpen) return;
    if (hasNoMouse && autoHover) setHoveredIndex(((hoveredIndex ?? 0) + 1) % nProjects);
  }, 2000);

  let blobTargetPosition = [0, 0, 0];
  if (!blobIsBig) {
    blobTargetPosition = [1, 3.91, 0];
    if (breakpoints.projects) blobTargetPosition = [3.62, 1.91, 0];
  }

  const { blobScale, blobPosition } = useSpring({
    blobPosition: blobTargetPosition,
    blobScale: blobIsBig ? 1 : 0,
    config: active ? config.gentle : config.stiff,
  });

  useEffect(() => {
    if (active) {
      let delay = 0;
      setTimeout(() => {
        setBlobIsBig(true);
      }, delay += 500);
      setTimeout(() => {
        setAutoHover(true);
      }, delay += 3000);
    } else {
      setHoveredIndex(null);
      setAutoHover(false);
      setTimeout(() => {
        setBlobIsBig(false);
      }, 500);
    }
  }, [active]);

  const radius = breakpoints.projects ? 2.7 : 2.4;

  const { setScene } = useSceneController();

  const currentProject = (openIndex !== null ? projects?.[openIndex] ?? null : null);

  return (
    <group {...groupProps}>
      <animated.group
        scale={blobScale}
        // @ts-ignore
        position={blobPosition}
      >
        <mesh
          position={[0, 0, -5]}
          scale={[2.5, 2.5, 0.1]}
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
          fontSize={0.5}
          font={fontUrls.bryantBold}
          material-toneMapped={false}
        >
          {`${hasNoMouse ? 'Tap' : 'Click'} an \nice cube.`}
        </Text>
      </animated.group>
      <mesh
        position={[0, 0, 3]}
      >
        <boxGeometry
          attach="geometry"
          args={[10, 10, 0.01]}
        />
        <BackgroundColorMaterial opacity={aProjectIsOpen} project={currentProject} />
      </mesh>
      {/* @ts-ignore */}
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
            someProjectIsOpen={openIndex !== null}
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
