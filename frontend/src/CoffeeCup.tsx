import React, { useState } from 'react';
import { Text } from '@react-three/drei';
import { Color } from 'three';
import {
  animated,
  config,
  // easings,
  useSpring,
} from '@react-spring/three';
// import { useControls } from 'leva';
// import { useControls } from 'leva';
import { Scribble } from './Scribble';
import { CoordArray } from './CoordArray';
import { useTrueAfterDelay } from './useTrueAfterDelay';
import { fontUrls } from './typography';
import coffeeBackPoints from './lines/coffeeBack';
import coffeeLinesPoints from './lines/coffeeLines';
import coffeeLiquidPoints from './lines/coffeeLiquid';
import { ThreeButton } from './ThreeButton';
import { useSceneController } from './SceneController';
import colors from './colors';
// import { rangeParams } from './rangeParams';
// import spillPoints from './lines/spill';
// import { rangeParams } from './rangeParams';

export function CoffeeCup({
  position,
  rotation,
  spilled,
}:{
  position:CoordArray,
  rotation:CoordArray,
  spilled:boolean,
}) {
  let time = 450;
  const projectButtonVisible1 = useTrueAfterDelay(time += 1000);
  const projectButtonVisible2 = useTrueAfterDelay(time += 1000);
  const projectButtonPressable = useTrueAfterDelay(time += 1000);
  // const spillVisible = useTrueAfterDelay(time += 1000);
  const [hovering, setHovering] = useState(false);

  const sceneController = useSceneController();
  const { scene } = sceneController;

  let mugHoverRotation = 0;
  if (scene === 'menu' && hovering) mugHoverRotation = Math.PI / 6;
  if (scene === 'projects' && hovering) mugHoverRotation = -Math.PI / 6;

  const { animatedPosition, animatedRotation } = useSpring({
    animatedPosition: position,
    animatedRotation:
    [
      rotation[0],
      rotation[1],
      rotation[2] + mugHoverRotation,
    ],
    config: config.wobbly,
  });

  // const test = useControls({
  //   x: rangeParams(0, -5, 5, 0.01),
  //   y: rangeParams(0, -5, 5, 0.01),
  //   lineWidth: rangeParams(0.1, 0, 5, 0.01),
  //   size: rangeParams(0.1, 0, 10, 0.01),
  // });

  // let liquidScale = 1;
  // if (hovering) liquidScale = 1.3;

  // const test = useControls({
  //   x: rangeParams(0, -5, 5, 0.01),
  //   y: rangeParams(0, -5, 5, 0.01),
  //   size: rangeParams(0, -5, 5, 0.01),
  //   lineWidth: rangeParams(0, -5, 5, 0.01),
  // });

  return (
    <animated.group
      position={animatedPosition}
      // @ts-ignore
      rotation={animatedRotation}
    >
      <Scribble
        points={(coffeeBackPoints as CoordArray[])}
        size={1.8}
        position={[0.1, -0.1, -0.3]}
        lineWidth={0.4}
        color={new Color(colors.cyan)}
        rotation={[Math.PI, 0, 0]}
        visible={projectButtonVisible2}
        drawSpringConfig={config.molasses}
        curved
        nPointsInCurve={700}
        scaleSpringConfig={config.wobbly}
        scale={hovering ? 1.1 : 1}
        closed
      />
      <group
        visible={!spilled}
      >
        <Scribble
          points={(coffeeLiquidPoints as CoordArray[])}
          size={1}
          position={[-0.1, 0.47, -0.15]}
          lineWidth={0.15}
          color={new Color(0x990B00)}
          rotation={[Math.PI, 0, 0]}
          visible={!spilled && projectButtonVisible2}
          drawSpringConfig={config.molasses}
          curved
          nPointsInCurve={200}
          scaleSpringConfig={config.wobbly}
          scale={1}
          closed
        />
      </group>
      <Scribble
        points={(coffeeLinesPoints as CoordArray[])}
        size={1.8}
        position={[0, 0, 0]}
        lineWidth={0.02}
        color={new Color(colors.blue)}
        rotation={[Math.PI, 0, 0]}
        visible={projectButtonVisible1}
        drawSpringConfig={config.molasses}
        scaleSpringConfig={config.wobbly}
        scale={hovering ? 1.1 : 1}
      />
      <Text
        position={[-0.3, -0.2, 0.1]}
        rotation={[0, 0, 0]}
        color={colors.blue}
        anchorX="center"
        anchorY="middle"
        fontSize={0.5}
        font={fontUrls.bryantBold}
        visible={projectButtonVisible1}
      >
        {scene === 'projects' ? 'Back'.toUpperCase() : 'Proj\nects'.toUpperCase()}
      </Text>
      {projectButtonPressable && scene === 'menu' && (
      <ThreeButton
        position={[0, 0, 0]}
        width={2}
        height={2}
        description={'A coffee mug with the word "Projects" on it.'}
        activationMsg="Mug tips, cofee spills everywhere, a project carousel animates into view from the 3d floating liquid."
        onFocus={() => setHovering(true)}
        onBlur={() => setHovering(false)}
        cursor="projects"
        onClick={() => sceneController.setScene('projects')}
      />
      )}
      {projectButtonPressable && scene === 'projects' && (
      <ThreeButton
        position={[0, 0, 0]}
        width={1.5}
        height={1.5}
        description={'A spilled coffee mug with the word "Back" on it'}
        activationMsg="Coffee unspills, returning us to the desk / main menu."
        onFocus={() => setHovering(true)}
        onBlur={() => setHovering(false)}
        cursor="menu"
        onClick={() => sceneController.setScene('menu')}
      />
      )}
    </animated.group>
  );
}
