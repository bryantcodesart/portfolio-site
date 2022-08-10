import React, { useState } from 'react';
import { Text } from '@react-three/drei';
import { Color } from 'three';
import {
  useSpring,
  animated,
} from '@react-spring/three';
import { A11y } from '@react-three/a11y';
import { useTimeout } from 'usehooks-ts';
import { CodeRings } from './CodeRings';
import computerScreenPoints from './lines/computerScreen';
import computerBodyPoints from './lines/computerBody';
import computerKeyboardPoints from './lines/computerKeyboard';
import computerFillPoints from './lines/computerFill';
import { Scribble } from './Scribble';
import { CoordArray } from './CoordArray';
import colors from './colors';
import { InvisibleInteractiveMesh } from './InvisibleInteractiveMesh';
import { useTrueAfterDelay } from './useTrueAfterDelay';
import { fontUrls } from './typography';
import { ComputerTerminal } from './ComputerTerminal';
import { useSceneController } from './SceneControllerProvider';

export function Computer() {
  const sceneController = useSceneController();

  let time = 450;
  const computerScreenVisible = useTrueAfterDelay(time += 1000);
  useTimeout(() => {
    sceneController.setScene('start');
  }, time);
  const computerBodyVisible = useTrueAfterDelay(time += 500);
  const computerKeyboardVisible = useTrueAfterDelay(time);
  const computerFillVisible = useTrueAfterDelay(time += 500);
  const computerCanBeTurnedOn = useTrueAfterDelay(time += 1000);

  const [computerOnButtonHovering, setComputerOnButtonHovering] = useState(false);
  const [computerOn, setComputerOn] = useState(false);
  const [computerTurningOn, setComputerTurningOn] = useState(false);
  const [codeRingsVisible, setCodeRingsVisible] = useState(false);

  const goToMenuScene = () => {
    let delay = 0;
    setComputerTurningOn(true); setComputerOnButtonHovering(false);
    setTimeout(() => { setComputerOn(true); setComputerTurningOn(false); }, delay += 300);
    setTimeout(() => { setCodeRingsVisible(true); }, delay);
    sceneController.setScene('menu');
    // setTimeout(() => { setProjectButtonVisible1(true); }, delay += 1000);
    // setTimeout(() => { setProjectButtonVisible2(true); }, delay += 300);
    // setTimeout(() => { setBlogButtonVisible1(true); }, delay += 300);
    // setTimeout(() => { setBlogButtonVisible2(true); }, delay += 800);
    // setTimeout(() => { setBlogButtonVisible3(true); }, delay += 600);
  };

  let computerPartScale = 1;
  if (computerOnButtonHovering) { computerPartScale = 1.1; }
  if (computerTurningOn) { computerPartScale = 0.95; }

  let computerGroupScale = 1;
  if (computerTurningOn) { computerGroupScale = 0.5; }

  let computerGroupRotation = [0, 0, 0];
  if (computerTurningOn) { computerGroupRotation = [Math.PI / 7, 0, Math.PI / 7]; }

  const { animatedComputerGroupScale, animatedComputerGroupRotation } = useSpring({
    animatedComputerGroupScale: computerGroupScale,
    animatedComputerGroupRotation: computerGroupRotation,
    config: { mass: 1.5, tension: 220, friction: 12 },
  });

  return (
    <animated.group
      scale={animatedComputerGroupScale} // @ts-ignore
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
        nPointsInCurve={700} // renderOrder={1}
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
        nPointsInCurve={700} // renderOrder={1}
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
        nPointsInCurve={700} // renderOrder={1}
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
        nPointsInCurve={700} // renderOrder={1}
        scale={computerPartScale}
      />

      {computerOn ? <ComputerTerminal /> : null}
      <Text
        position={[-1, 0.7, 2.1]}
        rotation={[0, 0, Math.PI / 40]}
        color="gray"
        anchorX="center"
        anchorY="middle"
        fontSize={0.5}
        font={fontUrls.bryantBold}
        visible={computerCanBeTurnedOn && !computerTurningOn && !computerOn}
      >
        click to start
      </Text>

      {computerCanBeTurnedOn && !computerOn && (
        <A11y
          role="button"
          description="Turn computer on"
          activationMsg="Computer turns on, rears back, and explodes forward shooting code everywhere."
          actionCall={() => {
            goToMenuScene();
          }}
        >
          <InvisibleInteractiveMesh
            position={[-0.7, 0.05, 2.2]}
            width={3.7}
            height={3.3}
            onFocus={() => {
              setComputerOnButtonHovering(true);
            }}
            onBlur={() => {
              setComputerOnButtonHovering(false);
            }}
            cursor="computer-on"
          />
        </A11y>
      )}
    </animated.group>
  );
}
