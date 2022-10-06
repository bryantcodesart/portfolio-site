import React, { useEffect, useMemo, useState } from 'react';
import { Text } from '@react-three/drei';
import { Color, MeshBasicMaterial } from 'three';
import {
  useSpring,
  animated,
} from '@react-spring/three';
import { useTimeout } from 'usehooks-ts';
import { CodeRings } from './CodeRings';
import computerScreenPoints from './lines/computerScreen';
import computerBodyPoints from './lines/computerBody';
import computerKeyboardPoints from './lines/computerKeyboard';
import computerFillPoints from './lines/computerFill';
import { Scribble } from './Scribble';
import { CoordArray } from './CoordArray';
import colors from './colors';
import { useTrueAfterDelay } from './useTrueAfterDelay';
import { fontUrls } from './typography';
import { ComputerTerminal } from './About';
import { useSceneController } from './SceneController';
import { ThreeButton } from './ThreeButton';
import { useHasNoMouse } from './useHasNoMouse';

export function Computer() {
  const sceneController = useSceneController();

  let time = 450;
  const computerScreenVisible = useTrueAfterDelay(time += 1000);
  useTimeout(() => {
    if (sceneController.scene === 'intro') {
      sceneController.setScene('start');
    }
  }, time);
  const computerBodyVisible = useTrueAfterDelay(time += 500);
  const computerKeyboardVisible = useTrueAfterDelay(time);
  const computerFillVisible = useTrueAfterDelay(time += 500);
  const computerCanBeTurnedOn = useTrueAfterDelay(time += 1000);

  const [computerOnButtonHovering, setComputerOnButtonHovering] = useState(false);
  const [computerWillTurnOn, setComputerWillTurnOn] = useState(false);
  const [computerOn, setComputerOn] = useState(false);
  const [computerTurningOn, setComputerTurningOn] = useState(false);
  const [codeRingsVisible, setCodeRingsVisible] = useState(false);

  const animateComputerOn = () => {
    let delay = 0;
    setComputerTurningOn(true); setComputerOnButtonHovering(false);
    setTimeout(() => { setComputerOn(true); setComputerTurningOn(false); }, delay += 300);
    setTimeout(() => { setCodeRingsVisible(true); }, delay);
  };

  useEffect(() => {
    if (!computerOn && !computerTurningOn && !computerWillTurnOn && (sceneController.scene !== 'start' && sceneController.scene !== 'intro')) {
      setComputerWillTurnOn(true);
      setTimeout(() => { animateComputerOn(); }, 4000);
    }
  }, [sceneController.scene, computerOn, computerTurningOn, computerWillTurnOn]);

  const triggerStart = () => {
    animateComputerOn();
    sceneController.setScene('menu');
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

  // Cant seem to turn off depthTest with drei Text props, so making a material here to pass to Text
  const textMaterial = useMemo(() => new MeshBasicMaterial({
    depthTest: false,
  }), []);

  const hasNoMouse = useHasNoMouse();

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
        nPointsInCurve={700}
        scale={computerPartScale}
        closed
      />
      <Scribble
        points={(computerScreenPoints as CoordArray[])}
        size={3.3}
        position={[-1, 0.7, 2.1]}
        lineWidth={0.6}
        color={computerOn ? new Color(colors.blue) : new Color('darkblue')}
        rotation={[Math.PI, 0, -Math.PI / 15]}
        visible={computerScreenVisible}
        curved
        nPointsInCurve={700}
        scale={computerPartScale}
        closed
        depthTest={false}
        renderOrder={1}
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
        scale={computerPartScale}
        depthTest={false}
        renderOrder={2}
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
        scale={computerPartScale}
        depthTest={false}
        renderOrder={2}
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
        material={textMaterial}
        renderOrder={3}
        visible={computerCanBeTurnedOn && !computerTurningOn && !computerOn && !computerWillTurnOn}
      >
        {hasNoMouse ? 'Tap' : 'Click'}
        {' '}
        to start
      </Text>
      {computerCanBeTurnedOn && !computerOn && (
      <ThreeButton
        description="Turn computer on"
        activationMsg="Computer turns on, rears back, and explodes forward shooting code everywhere."
        onClick={triggerStart}
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
      )}
    </animated.group>
  );
}
