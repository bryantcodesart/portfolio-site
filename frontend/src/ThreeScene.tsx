import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line, Stats, Html } from '@react-three/drei';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { MoveCameraWithMouse } from './MoveCameraWithMouse';
import { CodeLines } from './CodeLines';
import { squigglePoints } from './squigglePoints';
// import * as THREE from 'three';

// const Squiggle = ({ image, width, position }:
// {
//   image:StaticImageData,
//   width:number,
//   position:[x:number, y:number, z:number]
// }) => (
//   <Image
//     url={image.src}
//     scale={[width, width * (image.height / image.width), 1]}
//     position={position}
//     transparent
//     tint={0xff0000}
//   />
// );

type Point = [x: number, y: number, z:number];

const Squiggle = ({
  points, size, position, color, lineWidth, visible,
}:
{
  points:Point[],
  size:number,
  position:Point,
  color:number,
  lineWidth:number,
  visible:boolean,
}) => {
  const sizedPoints:Point[] = useMemo(() => points.map((
    [x, y, z],
  ) => [x * size - size / 2, y * size - size / 2, z]), [points, size]);

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
    <Line
      points={initialPoints}
      lineWidth={lineWidth}
      position={position}
      color={color}
      // @ts-ignore
      ref={lineRef}
    />
  );
};

const ThreeScene = () => (
  <Canvas>
    <ambientLight />
    <CodeLines />
    {/* <OrbitControls /> */}
    <MoveCameraWithMouse />
    <Squiggle
      points={squigglePoints as Point[]}
      size={13}
      position={[0, 0, -1]}
      lineWidth={10}
      color={0xff00ff}
      visible
    />

    <Html transform position={[0, 0, 0]}>
      <p className="p-4 text-white bg-blue font-mono text-[1vw]">
        hi! i’m bryant! (he/him)
        <br />
        i make dope
        <br />
        web experiences.
      </p>
    </Html>
    <Stats />
  </Canvas>
);
export default ThreeScene;
