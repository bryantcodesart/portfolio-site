import React, {
  useEffect, useState,
} from 'react';
import { MeshDistortMaterial } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';
import { animated, useSpring, config } from '@react-spring/three';
import {
  DoubleSide,
} from 'three';
import { Project } from '../generatedSanitySchemaTypes';
import { ProjectEntry } from './ProjectEntry';
import colors from './colors';
import { useWindowAspectRatio } from './useWindowAspectRatio';
import { getIsPortraitProjects } from './getIsPortraitProjects';

export function ProjectListing({ active, projects, ...groupProps }:
  { active:boolean, projects: Project[] | null; } & GroupProps) {
  const [blobIsBig, setBlobIsBig] = useState(false);

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

  const nProjects = projects?.length ?? 0;
  const arcPerProject = projects ? ((Math.PI * 2) / nProjects) : 0;

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

  return (
    <group {...groupProps}>
      <pointLight
        position={[10, 10, 40]}
        intensity={2}
        color="#993F00"
      />
      <animated.mesh
        scale={blobScale}
        // @ts-ignore
        position={blobPosition}
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
          depthTest={false}
          transparent
          opacity={0.7}
          side={DoubleSide}
          roughness={0.4}
        />
      </animated.mesh>
      <animated.group
        scale={blobScale}
        // @ts-ignore
        position={blobPosition}
      >
        {projects && projects.map((project, index) => (
          <ProjectEntry
            project={project}
            theta={index * arcPerProject}
            key={project._id + index.toString()}
          />
        ))}
      </animated.group>
    </group>
  );
}
