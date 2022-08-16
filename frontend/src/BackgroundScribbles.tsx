import React from 'react';
import { Color } from 'three';
import squiggle1Points from './lines/squiggle1';
import squiggleCirclePoints from './lines/squiggleCircle';
import { Scribble } from './Scribble';
import { CoordArray } from './CoordArray';
import { useTrueAfterDelay } from './useTrueAfterDelay';

export function BackgroundScribbles() {
  let time = 0;
  const squiggle1Visible = useTrueAfterDelay(time += 50);
  const squiggle2Visible = useTrueAfterDelay(time += 400);

  return (
    <>
      {/* <Scribble
        points={(squiggle1Points as CoordArray[])}
        size={30}
        position={[-4, -0.5, -4]}
        scale={1}
        lineWidth={0.7}
        color={new Color(0x00ff00)}
        rotation={[0, Math.PI, Math.PI]}
        visible={squiggle1Visible}
        curved
        nPointsInCurve={700} />
      <Scribble
        points={(squiggleCirclePoints as CoordArray[])}
        size={15}
        position={[3, 1, -0.4]}
        lineWidth={0.1}
        color={new Color(0x00ffff)}
        rotation={[0, Math.PI, Math.PI]}
        visible={squiggle2Visible}
        curved
        nPointsInCurve={300} /> */}
      <Scribble
        points={(squiggle1Points as CoordArray[])}
        size={130}
        position={[-4, -0.5, -4 - 30]}
        lineWidth={0.7 * 5}
        color={new Color(0x00ff00)}
        rotation={[0, Math.PI, Math.PI]}
        visible={squiggle1Visible}
        curved
        nPointsInCurve={1200}
      />
      <Scribble
        points={(squiggleCirclePoints as CoordArray[])}
        size={40}
        position={[13, -5, -0.4 - 20]}
        lineWidth={0.1 * 5}
        color={new Color(0x00ffff)}
        rotation={[0, Math.PI, Math.PI]}
        visible={squiggle2Visible}
        curved
        closed
        nPointsInCurve={700}
      />
    </>
  );
}
