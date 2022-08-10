import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Stats,
  Text,
  useContextBridge,
} from '@react-three/drei';
import { Color } from 'three';
import {
  useSpring,
  animated,
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
import { useTrueAfterDelay } from './useTrueAfterDelay';
import { Typewriter } from './Typewriter';
import { fontUrls } from './typography';
import bookFillPoints from './lines/bookFill';
import bookLinesPoints from './lines/bookLines';
import bookHighlightPoints from './lines/bookHighlight';
import coffeeBackPoints from './lines/coffeeBack';
import coffeeLinesPoints from './lines/coffeeLines';
import coffeeLiquidPoints from './lines/coffeeLiquid';

function ComputerTerminal() {
  const computerScreenText = `I'm Bryant! (he/him)
    I build web experiences.`;
  return (
    <group
      // position={[-2.6, 1.3, 2.1]}
      position={[-1, 0.7, 2]}
      rotation={[0, 0, Math.PI / 40]}
    >
      <Typewriter
        color="white"
        anchorX="left"
        anchorY="top"
        position={[-1.6, 0.7, 0.1]}
        fontSize={0.27}
        lineHeight={1.3}
        font={fontUrls.bryantBold}
      >
        {computerScreenText}
      </Typewriter>
      <InvisibleThreeButton cursor="terminal" position={[0, 0, 0]} width={3.5} height={2} />
    </group>
  );
}

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
  const [projectButtonVisible, setProjectButtonVisible] = useState(false);
  const [blogButtonVisible, setBlogButtonVisible] = useState(false);

  const startComputerScene = () => {
    let delay = 0;
    setComputerTurningOn(true); setComputerOnButtonHovering(false);
    setTimeout(() => { setComputerOn(true); setComputerTurningOn(false); }, delay += 300);
    setTimeout(() => { setCodeRingsVisible(true); }, delay);
    setTimeout(() => { setProjectButtonVisible(true); }, delay += 1000);
    setTimeout(() => { setBlogButtonVisible(true); }, delay += 300);
  };

  let cameraPosition = [0, 0, 15];
  if (computerScreenVisible) cameraPosition = [-1, 0, 5.5];
  if (computerOn || computerTurningOn) cameraPosition = [1, 0, 6];

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
      <CameraController position={cameraPosition as [number, number, number]} />
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
        <CodeRings visible={codeRingsVisible} />
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
          // renderOrder={1}
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
          // renderOrder={1}
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
          // renderOrder={1}
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
          // renderOrder={1}
          scale={computerPartScale}
        />
        {computerOn ? (
          <ComputerTerminal />
        ) : null}
        <Text
          position={[-1, 0.7, 2.1]}
          rotation={[0, 0, Math.PI / 40]}
          color="gray"
          anchorX="center"
          anchorY="middle"
          fontSize={0.6}
          font={fontUrls.bryantBold}
          visible={computerCanBeTurnedOn && !computerOn}
        >
          {'Click me.'.toUpperCase()}
        </Text>

        {computerCanBeTurnedOn && !computerOn && (
          <InvisibleThreeButton
            position={[-0.7, 0.05, 2.2]}
            width={3.7}
            height={3.3}
            // @ts-ignore
            onPointerDown={(_, setCursor) => {
              if (setCursor) setCursor('normal');
              startComputerScene();
            }}
            onPointerEnter={() => setComputerOnButtonHovering(true)}
            onPointerOver={() => setComputerOnButtonHovering(true)}
            onPointerLeave={() => setComputerOnButtonHovering(false)}
            cursor="computer-on"
          />
        )}
      </animated.group>
      <animated.group
        position={[4, 1.3, 2.5]}
      >
        <Scribble
          points={(coffeeBackPoints as CoordArray[])}
          size={1.9}
          position={[0.2, 0.1, -0.3]}
          lineWidth={0.38}
          color={new Color(0xff00ff)}
          rotation={[Math.PI, 0, 0]}
          visible={projectButtonVisible}
          curved
          nPointsInCurve={700}
        />
        <Scribble
          points={(coffeeLiquidPoints as CoordArray[])}
          size={1}
          position={[-0.1, 0.55, -0.1]}
          lineWidth={0.15}
          color={new Color(0x551F00)}
          rotation={[Math.PI, 0, 0]}
          visible={projectButtonVisible}
          curved
          nPointsInCurve={100}
        />
        <Scribble
          points={(coffeeLinesPoints as CoordArray[])}
          size={1.8}
          position={[0, 0, 0]}
          lineWidth={0.02}
          color={new Color(0xffffff)}
          rotation={[Math.PI, 0, 0]}
          visible={projectButtonVisible}
          // curved
          // nPointsInCurve={700}
        />
        <Text
          position={[-0.3, -0.2, 0.1]}
          rotation={[0, 0, 0]}
          color="white"
          anchorX="center"
          anchorY="middle"
          fontSize={0.5}
          font={fontUrls.bryantBold}
          visible={projectButtonVisible}
        >
          {'Proj\nects'.toUpperCase()}
        </Text>
      </animated.group>
      <animated.group
        position={[3, -0.8, 3.5]}
      >
        <Scribble
          points={(bookFillPoints as CoordArray[])}
          size={1.5}
          position={[0.2, 0, -0.3]}
          lineWidth={0.5}
          color={new Color(0x00FFff)}
          rotation={[Math.PI, 0, 0]}
          visible={blogButtonVisible}
          curved
          nPointsInCurve={100}
        />
        <Scribble
          points={(bookHighlightPoints as CoordArray[])}
          size={1}
          position={[0.2, 0, -0.1]}
          lineWidth={0.3}
          color={new Color(0x00ff00)}
          rotation={[Math.PI, 0, 0]}
          visible={blogButtonVisible}
        />
        <Scribble
          points={(bookLinesPoints as CoordArray[])}
          size={1.5}
          position={[0, 0, 0]}
          lineWidth={0.02}
          color={new Color(0x000000)}
          rotation={[Math.PI, 0, 0]}
          visible={blogButtonVisible}
          curved
          nPointsInCurve={700}
        />
        <Text
          position={[0, 0, 0.1]}
          rotation={[0, 0, 0]}
          color="black"
          anchorX="center"
          anchorY="middle"
          fontSize={0.25}
          font={fontUrls.bryantBold}
          visible={blogButtonVisible}
        >
          {'Blog\ncoming\nsoon'.toUpperCase()}
        </Text>
      </animated.group>
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
