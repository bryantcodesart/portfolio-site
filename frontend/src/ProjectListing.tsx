import React, {
  useEffect, useState,
} from 'react';
import { MeshDistortMaterial } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';
import { animated, useSpring, config } from '@react-spring/three';
import {
  // Color,
  DoubleSide,
} from 'three';
// @ts-ignore
import { Project } from '../generatedSanitySchemaTypes';
import { ProjectEntry } from './ProjectEntry';
import colors from './colors';

export function ProjectListing({ active, projects, ...groupProps }:
  { active:boolean, projects: Project[] | null; } & GroupProps) {
  const [blobIsBig, setBlobIsBig] = useState(false);

  const { blobScale, blobPosition } = useSpring({
    blobPosition: blobIsBig ? [0, 0, 0] : [3.62, 1.91, 0],
    blobScale: blobIsBig ? 1 : 0,
    config: active ? config.slow : config.stiff,
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
          // color={colors.violet}
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
        // rotation={carouselRotation}
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
      {/* <animated.group
        position={[-0.9, -1.2, 3.5]}
        scale={leftArrowScale}
      >
        <Scribble
          points={(leftArrowFill as CoordArray[])}
          size={0.7}
          position={[-0.02, -0.07, -0.1]}
          lineWidth={0.25}
          color={new Color(ARROW_FILL_COLOR)}
          rotation={[0, Math.PI, 0]}
          visible={leftArrowFillVisible}
          drawSpringConfig={config.slow}
          scaleSpringConfig={config.wobbly}
          curved
          closed
          nPointsInCurve={700}
        />
        <Scribble
          points={(leftArrowLines as CoordArray[])}
          size={0.5}
          position={[0, 0, 0.1]}
          lineWidth={0.01}
          color={new Color(ARROW_LINES_COLOR)}
          rotation={[Math.PI, 0, 0]}
          visible={leftArrowLinesVisible}
          drawSpringConfig={config.slow}
          scaleSpringConfig={config.wobbly}
          curved
          nPointsInCurve={500}
        />
        {leftArrowFillVisible && (
          <ThreeButton
            position={[0, 0, 0]}
            width={1}
            height={0.5}
            description=""
            activationMsg=""
            onFocus={() => { setLeftArrowHovering(true); }}
            onBlur={() => { setLeftArrowHovering(false); }}
            cursor="previous"
            onClick={() => setNTurns((n) => n - 1)}
          />
        )}
      </animated.group>
      <animated.group
        position={[0.9, -1.2, 3.5]}
        scale={rightArrowScale}
      >
        <Scribble
          points={(rightArrowFill as CoordArray[])}
          size={0.7}
          position={[0.02, -0.07, -0.1]}
          lineWidth={0.25}
          color={new Color(ARROW_FILL_COLOR)}
          rotation={[Math.PI, 0, 0]}
          visible={rightArrowFillVisible}
          drawSpringConfig={config.slow}
          scaleSpringConfig={config.wobbly}
          curved
          closed
          nPointsInCurve={700}
        />
        <Scribble
          points={(rightArrowLines as CoordArray[])}
          size={0.5}
          position={[0, 0, 0.1]}
          lineWidth={0.01}
          color={new Color(ARROW_LINES_COLOR)}
          rotation={[Math.PI, 0, 0]}
          visible={rightArrowLinesVisible}
          drawSpringConfig={config.slow}
          scaleSpringConfig={config.wobbly}
          curved
          nPointsInCurve={500}
        />
        {rightArrowFillVisible && (
          <ThreeButton
            position={[0, 0, 0]}
            width={1}
            height={0.5}
            description=""
            activationMsg=""
            onFocus={() => { setRightArrowHovering(true); }}
            onBlur={() => { setRightArrowHovering(false); }}
            cursor="next"
            onClick={() => setNTurns((n) => n + 1)}
          />
        )}
      </animated.group> */}
    </group>
  );
}
