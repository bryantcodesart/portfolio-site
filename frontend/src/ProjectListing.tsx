import React, {
  useEffect, useState,
} from 'react';
import { MeshDistortMaterial } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';
import { animated, useSpring, config } from '@react-spring/three';
import {
  DoubleSide,
} from 'three';
// @ts-ignore
import { Project } from '../generatedSanitySchemaTypes';
import { ThreeButton } from './ThreeButton';
import { ProjectEntry } from './ProjectEntry';

export function ProjectListing({ active, projects, ...groupProps }:
  { active:boolean, projects: Project[] | null; } & GroupProps) {
  const [blobIsBig, setBlobIsBig] = useState(false);
  const [carouselIsActive, setCarouselIsActive] = useState(false);
  const [carouselHasAnimated, setCarouselHasAnimated] = useState(false);

  const { blobScale, blobPosition } = useSpring({
    blobPosition: blobIsBig ? [0, 0, 0] : [3.62, 1.91, 0],
    blobScale: blobIsBig ? 1 : 0,
    config: config.wobbly,
  });
  const [nTurns, setNTurns] = useState(0);

  const nProjects = projects?.length ?? 0;
  const arcPerProject = projects ? ((Math.PI * 2) / nProjects) : 0;
  const { carouselRotation, carouselScale } = useSpring({
    carouselRotation: carouselIsActive ? [0, nTurns * -arcPerProject, 0] : [0, -1 * Math.PI, 0],
    carouselScale: carouselIsActive ? 1 : 0,
    config: config.gentle,
  });

  const activeIndex = (nTurns
    + (nTurns < 0 ? nProjects * Math.ceil(-nTurns / nProjects) : 0)) % nProjects;

  useEffect(() => {
    if (active) {
      let delay = 0;
      setNTurns(0);
      setTimeout(() => {
        setBlobIsBig(true);
      }, delay += 500);
      setTimeout(() => {
        setCarouselIsActive(true);
      }, delay += 500);
      setTimeout(() => {
        setCarouselHasAnimated(true);
      }, delay += 1000);
    } else {
      setTimeout(() => {
        setCarouselIsActive(false);
        setBlobIsBig(false);
        setCarouselHasAnimated(false);
        setNTurns(0);
      }, 500);
    }
  }, [active]);

  return (
    <group {...groupProps}>
      <animated.mesh
        scale={blobScale}
        // @ts-ignore
        position={blobPosition}
      >
        <sphereBufferGeometry
          args={[3.5, 70, 70]}
          attach="geometry"
        />
        <MeshDistortMaterial
          color="#551F00"
          speed={6}
          radius={1}
          distort={0.3}
          depthTest={false}
          transparent
          opacity={0.7}
          side={DoubleSide}
        />
        {/* <meshBasicMaterial color={0xfff1ef} attach="material" /> */}
      </animated.mesh>
      <animated.group
        // @ts-ignore
        rotation={carouselRotation}
        scale={carouselScale}
      >
        {projects && projects.map((project, index) => (
          <group
            rotation={[0, index * arcPerProject, 0]}
            key={project._id + index.toString()}
          >
            <ProjectEntry
              project={project}
              active={carouselHasAnimated && index === activeIndex}
            />
          </group>
        ))}

      </animated.group>
      <ThreeButton
        position={[2, -2, 1]}
        width={1.5}
        height={1.5}
        description=""
        activationMsg=""
        onFocus={() => {}}
        onBlur={() => {}}
        cursor="next"
        debug
        onClick={() => setNTurns((n) => n + 1)}
      />
      <ThreeButton
        position={[-2, -2, 1]}
        width={1.5}
        height={1.5}
        description=""
        activationMsg=""
        onFocus={() => {}}
        onBlur={() => {}}
        cursor="previous"
        debug
        onClick={() => setNTurns((n) => n - 1)}
      />
    </group>
  );
}
