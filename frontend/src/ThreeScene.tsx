import React from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Stats,
  Html,
  ScrollControls,
} from '@react-three/drei';
import { Color } from 'three';
import { CameraController } from './CameraController';
import { CodeRings } from './CodeRings';
import squiggle1Points from './lines/squiggle1';
import squiggleCirclePoints from './lines/squiggleCircle';
import squiggleRectPoints from './lines/squiggleRect';
import { Squiggle } from './Squiggle';
import { CoordArray } from './CoordArray';
import colors from './colors';

function ScrollExperience() {
  return (
    <ScrollControls pages={15}>
      <CameraController />
      <CodeRings />
      <Squiggle
        points={(squiggle1Points as CoordArray[])}
        size={15}
        position={[-4, -0.5, -1]}
        scale={[1, 1, 1]}
        lineWidth={0.5}
        color={new Color(0x00ff00)}
        rotation={[0, Math.PI, Math.PI]}
        visible
        curved
        nPointsInCurve={400}
      />
      {/* <Squiggle
        points={(squiggle2Points as CoordArray[])}
        size={13}
        position={[0, 0, -1]}
        lineWidth={0.2}
        color={0xffff00}
        rotation={[0, -Math.PI / 10, 0]}
        visible
      /> */}
      <Squiggle
        points={(squiggleCirclePoints as CoordArray[])}
        size={7}
        position={[-2, -1, -0.4]}
        lineWidth={0.1}
        color={new Color(0x00ffff)}
        rotation={[0, Math.PI, Math.PI]}
        visible
        curved
        nPointsInCurve={200}
      />
      {/* <Squiggle
        points={(squiggleHelloPoints as CoordArray[])}
        size={8}
        position={[2, 3.5, -1]}
        lineWidth={0.1}
        color={0xff0000}
        rotation={[Math.PI, 0, -Math.PI / 15]}
        visible
      /> */}
      <Squiggle
        points={(squiggleRectPoints as CoordArray[])}
        size={6}
        position={[-1, 1, 0]}
        lineWidth={0.6}
        color={new Color(colors.blue)}
        rotation={[Math.PI, 0, -Math.PI / 15]}
        visible
        curved
        nPointsInCurve={400}
      />
      <Html
        transform
        position={[-1, 1, 0]}
        className="p-4 text-white font-mono text-[1vw]"
        pointerEvents="none"
      >
        <p>
          hi! i’m bryant! (he/him)
          <br />
          i make dope
          <br />
          web experiences.
        </p>
      </Html>
    </ScrollControls>
  );
}

const ThreeScene = () => (
  <Canvas>
    {/* <color attach="background" args={[0xffffff]} /> */}
    {/* <ambientLight color={0xffffff} intensity={2} /> */}
    <ScrollExperience />
    <Stats />
    <ambientLight />
  </Canvas>
);
export default ThreeScene;
