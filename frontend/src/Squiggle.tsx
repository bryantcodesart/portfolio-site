import React, {
  useEffect,
  useMemo, useRef,
} from 'react';
import {
  extend, ReactThreeFiber,
} from '@react-three/fiber';
import {
  AdditiveBlending,
  CatmullRomCurve3,
  // CatmullRomCurve3,
  Color, Mesh, MultiplyBlending, SubtractiveBlending, Vector3,
} from 'three';
// This is
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'meshline';
import { CoordArray } from './CoordArray';

// Add me
extend({ MeshLine, MeshLineMaterial });
/* eslint-disable no-unused-vars */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'meshLine': ReactThreeFiber.Object3DNode<MeshLine, typeof MeshLine>;
      'meshLineMaterial': ReactThreeFiber.Object3DNode<MeshLineMaterial, typeof MeshLineMaterial>;
    }
  }
}
/* eslint-enable no-unused-vars */

export const Squiggle = ({
  points,
  size,
  position,
  color,
  lineWidth,
  visible,
  curved = false,
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}: {
  points: CoordArray[];
  size: number;
  position: CoordArray;
  color: Color;
  lineWidth: number;
  visible: boolean;
  curved?: number | false;
  rotation?: CoordArray;
  scale?: CoordArray;
}) => {
  const sizedPoints: number[] = useMemo(() => {
    const sizedVec3s = points.flatMap((
      [x, y, z],
    ) => new Vector3(x * size - size / 2, y * size - size / 2, z));

    // return sizedVec3s;

    // console.log(visible);

    // if (!curve) { return resizedPoints; }

    return new CatmullRomCurve3(sizedVec3s, true)
      .getPoints(1000)
      .flatMap((point:Vector3) => [point.x, point.y, point.z]);
  }, [points, size, curved]);

  // const initialPoints: Vector3[] = useMemo(() => sizedPoints.map(
  //   () => sizedPoints[0],
  // ), [sizedPoints]);

  console.log(visible);
  // const lineRef = useRef<Line2>();

  // const currentPoint = useRef(0);

  // useFrame(() => {
  //   if (lineRef.current) {
  //     if (visible) {
  //       currentPoint.current = Math.min(currentPoint.current + 1, sizedPoints.length - 1);
  //     } else {
  //       currentPoint.current = Math.max(currentPoint.current - 1, 0);
  //     }

  //     const newPositions = sizedPoints.map(
  //       (_, index) => (index <= currentPoint.current
  //         ? sizedPoints[index]
  //         : sizedPoints[currentPoint.current]),
  //     );
  //     lineRef.current.geometry.setPositions(newPositions.flat());
  //   }
  // });

  const meshRef = useRef<Mesh>(null);
  useEffect(() => {
    console.log(meshRef);
  }, []);

  return (
    <mesh
      position={position}
      rotation={rotation}
      scale={scale}
      raycast={MeshLineRaycast}
      ref={meshRef}
    >
      <meshLine
        attach="geometry"
        points={sizedPoints}
      />
      <meshLineMaterial
        attach="material"
        // ref={material}
        transparent
        depthTest={false}
        lineWidth={lineWidth}
        color={color}
        dashArray={1}
        dashRatio={0}
      />
    </mesh>
  );
};
