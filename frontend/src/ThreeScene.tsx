import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Stats, Html, ScrollControls,
} from '@react-three/drei';
import {
  Line2,
} from 'three-stdlib';
import { CatmullRomCurve3, Vector3 } from 'three';
import { CameraController } from './CameraController';
import { CodeLines } from './CodeLines';
import { squigglePoints } from './squigglePoints';
import { WorldUnitsLine } from './WorldUnitsLine';

type Point = [x: number, y: number, z:number];

const Squiggle = ({
  points, size, position, color, lineWidth, visible, curve = false,
}:
{
  points:Point[],
  size:number,
  position:Point,
  color:number,
  lineWidth:number,
  visible:boolean,
  curve?:number|false,
}) => {
  const sizedPoints:Point[] = useMemo(() => {
    const resizedPoints = points.map((
      [x, y, z],
    ) => new Vector3(x * size - size / 2, y * size - size / 2, z));

    if (!curve) return resizedPoints.map((point) => [point.x, point.y, point.z]);

    const calculatedCurve = new CatmullRomCurve3(resizedPoints, true);
    const curvePoints = calculatedCurve.getPoints(curve);
    return curvePoints.map((point) => [point.x, point.y, point.z]);
  }, [points, size]);

  const initialPoints:Point[] = useMemo(() => sizedPoints.map(() => sizedPoints[0]), [sizedPoints]);

  const lineRef = useRef<Line2>();

  const currentPoint = useRef(0);

  useFrame(() => {
    if (lineRef.current) {
      if (visible) {
        currentPoint.current = Math.min(currentPoint.current + 1, sizedPoints.length - 1);
      } else {
        currentPoint.current = Math.max(currentPoint.current - 1, 0);
      }

      const newPositions = sizedPoints.map(
        (_, index) => (index <= currentPoint.current
          ? sizedPoints[index]
          : sizedPoints[currentPoint.current]),
      );
      lineRef.current.geometry.setPositions(newPositions.flat());
    }
  });

  return (
    <WorldUnitsLine
      points={initialPoints}
      lineWidth={lineWidth}
      position={position}
      color={color}
      // @ts-ignore
      ref={lineRef}
    />
  );
};

function ScrollExperience() {
  return (
    <ScrollControls pages={15}>
      <CameraController />
      <Squiggle
        points={(squigglePoints as Point[])}
        size={13}
        position={[0, 0, -1]}
        lineWidth={0.05}
        color={0xff00ff}
        visible
      />
      <Html
        transform
        position={[0, 0, 0]}
        className="p-4 text-white bg-blue font-mono text-[1vw]"
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
    <ambientLight />
    <CodeLines />
    <ScrollExperience />
    <Stats />
  </Canvas>
);
export default ThreeScene;
