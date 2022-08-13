import React from 'react';
import { animated, config } from '@react-spring/three';
import { Color } from 'three';
import { Text } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';
import bookFillPoints from './lines/bookFill';
import bookLinesPoints from './lines/bookLines';
// import bookHighlightPoints from './lines/bookHighlight';
import { Scribble } from './Scribble';
import { CoordArray } from './CoordArray';
import { fontUrls } from './typography';
import { useTrueAfterDelay } from './useTrueAfterDelay';
import colors from './colors';

export function Notebook({ ...groupProps }:GroupProps) {
  let time = 450;
  const blogButtonVisible1 = useTrueAfterDelay(time += 1000);
  const blogButtonVisible2 = useTrueAfterDelay(time += 500);
  // const blogButtonVisible3 = useTrueAfterDelay(time += 1000);
  return (
    <animated.group
      {...groupProps}
    >
      <Scribble
        points={(bookFillPoints as CoordArray[])}
        size={1.5}
        position={[0.2, 0, -0.3]}
        lineWidth={0.5}
        color={new Color(colors.violet)}
        rotation={[Math.PI, 0, 0]}
        visible={blogButtonVisible2}
        drawSpringConfig={config.molasses}
        curved
        nPointsInCurve={100}
      />
      {/* <Scribble
        points={(bookHighlightPoints as CoordArray[])}
        size={0.5}
        position={[0.2, 0, -0.1]}
        lineWidth={0.3}
        color={new Color(colors.cyan)}
        rotation={[Math.PI, 0, 0]}
        visible={blogButtonVisible3}
      /> */}
      <Scribble
        points={(bookLinesPoints as CoordArray[])}
        size={1.5}
        position={[0, 0, 0]}
        lineWidth={0.015}
        color={new Color(colors.black)}
        rotation={[Math.PI, 0, 0]}
        visible={blogButtonVisible1}
        curved
        nPointsInCurve={700}
      />
      <Text
        position={[0, 0, 0.1]}
        rotation={[0, 0, 0]}
        color={colors.black}
        anchorX="center"
        anchorY="middle"
        fontSize={0.25}
        font={fontUrls.bryantBold}
        visible={blogButtonVisible1}
      >
        {'Blog\ncoming\nsoon'.toUpperCase()}
      </Text>
    </animated.group>
  );
}
