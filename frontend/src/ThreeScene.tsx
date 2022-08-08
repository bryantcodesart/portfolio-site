import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Stats,
  // Html,
  // ScrollControls,
} from '@react-three/drei';
import { Color } from 'three';
import { useTimeout } from 'usehooks-ts';
import { CameraController } from './CameraController';
import { CodeRings } from './CodeRings';
import squiggle1Points from './lines/squiggle1';
import squiggleCirclePoints from './lines/squiggleCircle';
import computerScreenPoints from './lines/computerScreen';
import computerBodyPoints from './lines/computerBody';
import computerKeyboardPoints from './lines/computerKeyboard';
import computerFillPoints from './lines/computerFill';
import { Scribble } from './Scribble';
import { CoordArray } from './CoordArray';
import colors from './colors';

const useRevealAfter = (timeoutLength:number) => {
  const [visible, setVisible] = useState(false);
  useTimeout(() => {
    setVisible(true);
  }, timeoutLength);
  return visible;
};

function Content() {
  // This time+= is just a clever way to syntax to timeline each of these
  // relative to the previous use of the time variable, so its quick to adjust.
  let time = 0;
  const squiggle1Visible = useRevealAfter(time += 200);
  const squiggle2Visible = useRevealAfter(time += 600);
  const computerScreenVisible = useRevealAfter(time += 1500);
  const computerBodyVisible = useRevealAfter(time += 500);
  const computerKeyboardVisible = useRevealAfter(time);
  const computerFillVisible = useRevealAfter(time += 500);
  const codeRingsVisible = useRevealAfter(time += 3000);

  return (
    // <ScrollControls pages={15}>
    <>
      <CameraController />
      <CodeRings visible={codeRingsVisible} />
      <Scribble
        points={(squiggle1Points as CoordArray[])}
        size={30}
        position={[-4, -0.5, -4]}
        scale={[1, 1, 1]}
        lineWidth={0.7}
        color={new Color(0x00ff00)}
        rotation={[0, Math.PI, Math.PI]}
        visible={squiggle1Visible}
        curved
        nPointsInCurve={700}
      />
      <Scribble
        points={(squiggleCirclePoints as CoordArray[])}
        size={7}
        position={[3, 1, -0.4]}
        lineWidth={0.1}
        color={new Color(0x00ffff)}
        rotation={[0, Math.PI, Math.PI]}
        visible={squiggle2Visible}
        curved
        nPointsInCurve={300}
      />
      {/* <Scribble
        points={(squiggleHelloPoints as CoordArray[])}
        size={8}
        position={[2, 3.5, -1]}
        lineWidth={0.1}
        color={0xff0000}
        rotation={[Math.PI, 0, -Math.PI / 15]}
        visible
      /> */}

      <Scribble
        points={(computerFillPoints as CoordArray[])}
        size={5}
        position={[-1, 0.05, 1.7]}
        lineWidth={1}
        color={new Color(0xffff00)}
        rotation={[Math.PI, 0, -Math.PI / 15]}
        visible={computerFillVisible}
        curved
        nPointsInCurve={700}
        renderOrder={1}
      />
      <Scribble
        points={(computerScreenPoints as CoordArray[])}
        size={3}
        position={[-1, 0.7, 2]}
        lineWidth={0.6}
        color={new Color(colors.blue)}
        rotation={[Math.PI, 0, -Math.PI / 15]}
        visible={computerScreenVisible}
        curved
        nPointsInCurve={700}
        renderOrder={1}
      />
      <Scribble
        points={(computerBodyPoints as CoordArray[])}
        size={4.9}
        position={[-1, 0, 2.1]}
        lineWidth={0.02}
        color={new Color(0xff00ff)}
        rotation={[Math.PI, 0, -Math.PI / 15]}
        visible={computerBodyVisible}
        curved
        nPointsInCurve={700}
        renderOrder={1}
      />
      <Scribble
        points={(computerKeyboardPoints as CoordArray[])}
        size={4.3}
        position={[-0.7, -1.2, 2]}
        lineWidth={0.02}
        color={new Color(0xff00ff)}
        rotation={[Math.PI, 0, -Math.PI / 15]}
        visible={computerKeyboardVisible}
        curved
        nPointsInCurve={700}
        renderOrder={1}
      />
      {/* <Html
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
      </Html> */}
    </>
  );
  // </ScrollControls>
}

const ThreeScene = () => (
  <Canvas>
    {/* <color attach="background" args={[0xffffff]} /> */}
    {/* <ambientLight color={0xffffff} intensity={2} /> */}
    <Content />
    {new URLSearchParams(window.location.search).get('stats') === 'true' && <Stats />}
    <ambientLight />
  </Canvas>
);
export default ThreeScene;
