import React from 'react';
import { Text } from '@react-three/drei';
import { Color } from 'three';
import {
  animated,
  config
} from '@react-spring/three';
import { Scribble } from './Scribble';
import { CoordArray } from './CoordArray';
import { useTrueAfterDelay } from './useTrueAfterDelay';
import { fontUrls } from './typography';
import coffeeBackPoints from './lines/coffeeBack';
import coffeeLinesPoints from './lines/coffeeLines';
import coffeeLiquidPoints from './lines/coffeeLiquid';

export function CoffeeCup() {
  let time = 450;
  const projectButtonVisible1 = useTrueAfterDelay(time += 1000);
  const projectButtonVisible2 = useTrueAfterDelay(time += 1000);

  return (
    <animated.group position={[4, 1.3, 2.5]}>
      <Scribble
        points={(coffeeBackPoints as CoordArray[])}
        size={1.9}
        position={[0.2, 0.1, -0.3]}
        lineWidth={0.38}
        color={new Color(0xff00ff)}
        rotation={[Math.PI, 0, 0]}
        visible={projectButtonVisible1}
        drawSpringConfig={config.molasses}
        curved
        nPointsInCurve={700} />
      <Scribble
        points={(coffeeLiquidPoints as CoordArray[])}
        size={1}
        position={[-0.1, 0.55, -0.1]}
        lineWidth={0.15}
        color={new Color(0x551F00)}
        rotation={[Math.PI, 0, 0]}
        visible={projectButtonVisible2}
        drawSpringConfig={config.molasses}
        curved
        nPointsInCurve={100} />
      <Scribble
        points={(coffeeLinesPoints as CoordArray[])}
        size={1.8}
        position={[0, 0, 0]}
        lineWidth={0.016}
        color={new Color(0xffffff)}
        rotation={[Math.PI, 0, 0]}
        visible={projectButtonVisible2}
        drawSpringConfig={config.molasses} />
      <Text
        position={[-0.3, -0.2, 0.1]}
        rotation={[0, 0, 0]}
        color="white"
        anchorX="center"
        anchorY="middle"
        fontSize={0.5}
        font={fontUrls.bryantBold}
        visible={projectButtonVisible1}
      >
        {'Proj\nects'.toUpperCase()}
      </Text>
    </animated.group>
  );
}
