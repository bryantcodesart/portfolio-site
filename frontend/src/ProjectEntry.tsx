import React from 'react';
import { Project } from '../generatedSanitySchemaTypes';
import { VideoMaterial } from './VideoMaterial';

// eslint-disable-next-line no-unused-vars
export const ProjectEntry = ({ project, active }: { project: Project; active: boolean; }) => (
  <>
    {/* {active && (
        <Html
          position={[-1, 1, 3]}
          rotation={[0, 0, -Math.PI / 4]}
        >
          <h1
            className="font-display text-black text-[5vw] w-max"
          >
            {project.title}
          </h1>
        </Html>
        )} */}
    <mesh
      position={[0, 0, 3]}
    >
      <planeGeometry args={[2, 2]} attach="geometry" />
      <VideoMaterial src="/videos/test.mp4" playing={active} />
    </mesh>
  </>
);
