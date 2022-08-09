import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Stats,
  // Html,
  // ScrollControls,
  useContextBridge,
} from '@react-three/drei';
import { Color } from 'three';
import { useTimeout } from 'usehooks-ts';
import {
  useSpring,
  animated,
  // config,
} from '@react-spring/three';
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
import { CustomCursorContext } from './CustomCursor';
import { InvisibleThreeButton } from './InvisibleThreeButton';

const useTrueAfterDelay = (timeoutLength:number) => {
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
  const squiggle1Visible = useTrueAfterDelay(time += 50);
  const squiggle2Visible = useTrueAfterDelay(time += 400);
  const computerScreenVisible = useTrueAfterDelay(time += 1000);
  const computerBodyVisible = useTrueAfterDelay(time += 500);
  const computerKeyboardVisible = useTrueAfterDelay(time);
  const computerFillVisible = useTrueAfterDelay(time += 500);
  const computerCanBeTurnedOn = useTrueAfterDelay(time += 1000);

  const [computerOnButtonHovering, setComputerOnButtonHovering] = useState(false);

  const [computerOn, setComputerOn] = useState(false);
  const [computerTurningOn, setComputerTurningOn] = useState(false);
  const [codeRingsVisible, setCodeRingsVisible] = useState(false);

  let cameraPosition = 15;
  if (computerScreenVisible) cameraPosition = 5.5;
  if (computerOn || computerTurningOn) cameraPosition = 6;

  let computerPartScale = 1;
  if (computerOnButtonHovering) computerPartScale = 1.1;
  if (computerTurningOn) computerPartScale = 0.95;

  let computerGroupScale = 1;
  if (computerTurningOn) computerGroupScale = 0.5;

  let computerGroupRotation = [0, 0, 0];
  if (computerTurningOn) computerGroupRotation = [Math.PI / 7, 0, Math.PI / 7];
  // if (computerOn) computerGroupRotation = [-Math.PI * 2, 0, -Math.PI * 2];

  const { animatedComputerGroupScale, animatedComputerGroupRotation } = useSpring({
    animatedComputerGroupScale: computerGroupScale,
    animatedComputerGroupRotation: computerGroupRotation,
    config: { mass: 1.5, tension: 220, friction: 12 },
  });

  return (
    <>
      <CameraController distance={cameraPosition} />
      <CodeRings visible={codeRingsVisible} />
      <Scribble
        points={(squiggle1Points as CoordArray[])}
        size={30}
        position={[-4, -0.5, -4]}
        scale={1}
        lineWidth={0.7}
        color={new Color(0x00ff00)}
        rotation={[0, Math.PI, Math.PI]}
        visible={squiggle1Visible}
        curved
        nPointsInCurve={700}
      />
      <Scribble
        points={(squiggleCirclePoints as CoordArray[])}
        size={15}
        position={[3, 1, -0.4]}
        lineWidth={0.1}
        color={new Color(0x00ffff)}
        rotation={[0, Math.PI, Math.PI]}
        visible={squiggle2Visible}
        curved
        nPointsInCurve={300}
      />
      <animated.group
        scale={animatedComputerGroupScale}
        // @ts-ignore
        rotation={animatedComputerGroupRotation}
      >
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
          scale={computerPartScale}
        />
        <Scribble
          points={(computerScreenPoints as CoordArray[])}
          size={3.3}
          position={[-1, 0.7, 2]}
          lineWidth={0.6}
          color={computerOn ? new Color(colors.blue) : new Color('darkblue')}
          rotation={[Math.PI, 0, -Math.PI / 15]}
          visible={computerScreenVisible}
          curved
          nPointsInCurve={700}
          renderOrder={1}
          scale={computerPartScale}
        />
        <Scribble
          points={(computerBodyPoints as CoordArray[])}
          size={4.9}
          position={[-1, 0, 2.3]}
          lineWidth={0.02}
          color={new Color(0xff00ff)}
          rotation={[Math.PI, 0, -Math.PI / 15]}
          visible={computerBodyVisible}
          curved
          nPointsInCurve={700}
          renderOrder={1}
          scale={computerPartScale}
        />
        <Scribble
          points={(computerKeyboardPoints as CoordArray[])}
          size={4.1}
          position={[-0.7, -1.2, 2.5]}
          lineWidth={0.02}
          color={new Color(0xff00ff)}
          rotation={[Math.PI, 0, -Math.PI / 15]}
          visible={computerKeyboardVisible}
          curved
          nPointsInCurve={700}
          renderOrder={1}
          scale={computerPartScale}
        />

        {computerCanBeTurnedOn && !computerOn && (
          <InvisibleThreeButton
            position={[-0.7, 0.05, 2.2]}
            width={3.7}
            height={3.3}
            // @ts-ignore
            onPointerDown={(_, setCursor) => {
              if (setCursor) setCursor('normal');
              setComputerTurningOn(true); setComputerOnButtonHovering(false);
              setTimeout(() => { setComputerOn(true); setComputerTurningOn(false); }, 300);
              setTimeout(() => { setCodeRingsVisible(true); }, 300);
            }}
            onPointerEnter={() => setComputerOnButtonHovering(true)}
            onPointerOver={() => setComputerOnButtonHovering(true)}
            onPointerLeave={() => setComputerOnButtonHovering(false)}
            cursor="computer-on"
          />
        )}
      </animated.group>
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
}

const ThreeScene = () => {
  const ContextBridge = useContextBridge(CustomCursorContext);
  return (
    <Canvas>
      <ContextBridge>
        <Content />
      </ContextBridge>
      {new URLSearchParams(window.location.search).get('stats') === 'true' && <Stats />}
      <ambientLight />
    </Canvas>
  );
};
export default ThreeScene;
