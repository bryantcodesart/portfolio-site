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
import squiggle1Points from './lines/squiggle1';
// import squiggle2Points from './lines/squiggle2';
import squiggleCirclePoints from './lines/squiggleCircle';
// import squiggleHelloPoints from './lines/squiggleHello';
import { WorldUnitsLine } from './WorldUnitsLine';

type Vec3Array = [x: number, y: number, z:number];

const Squiggle = ({
  points,
  size,
  position,
  color,
  lineWidth,
  visible,
  curve = false,
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}:
{
  points:Vec3Array[],
  size:number,
  position:Vec3Array,
  color:number,
  lineWidth:number,
  visible:boolean,
  curve?:number|false,
  rotation?:Vec3Array,
  scale?:Vec3Array,
}) => {
  const sizedPoints:Vec3Array[] = useMemo(() => {
    const resizedPoints = points.map((
      [x, y, z],
    ) => new Vector3(x * size - size / 2, y * size - size / 2, z));

    if (!curve) return resizedPoints.map((point) => [point.x, point.y, point.z]);

    const calculatedCurve = new CatmullRomCurve3(resizedPoints, true);
    const curvePoints = calculatedCurve.getPoints(curve);
    return curvePoints.map((point) => [point.x, point.y, point.z]);
  }, [points, size, curve]);

  const initialPoints:Vec3Array[] = useMemo(() => sizedPoints.map(
    () => sizedPoints[0],
  ), [sizedPoints]);

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
      rotation={rotation}
      scale={scale}
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
      <CodeLines />
      <Squiggle
        points={(squiggle1Points as Vec3Array[])}
        size={15}
        position={[-4, -0.5, -1]}
        scale={[1, 1, 1]}
        lineWidth={0.7}
        color={0x00ff00}
        rotation={[0, Math.PI, Math.PI]}
        visible
      />
      {/* <Squiggle
        points={(squiggle2Points as Vec3Array[])}
        size={13}
        position={[0, 0, -1]}
        lineWidth={0.2}
        color={0xffff00}
        rotation={[0, -Math.PI / 10, 0]}
        visible
      /> */}
      <Squiggle
        points={(squiggleCirclePoints as Vec3Array[])}
        size={7}
        position={[-2, -1, -0.4]}
        lineWidth={0.1}
        color={0x00ffff}
        rotation={[0, Math.PI, Math.PI]}
        visible
      />
      {/* <Squiggle
        points={(squiggleHelloPoints as Vec3Array[])}
        size={8}
        position={[2, 3.5, -1]}
        lineWidth={0.1}
        color={0xff0000}
        rotation={[Math.PI, 0, -Math.PI / 15]}
        visible
      /> */}
      <Html
        transform
        position={[-1, 1, 0]}
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
    {/* <ambientLight color={0xffffff} intensity={2} /> */}
    <ScrollExperience />
    <Stats />
    <ambientLight color={0xffffff} intensity={2} />
  </Canvas>
);
export default ThreeScene;
