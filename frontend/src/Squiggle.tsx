import React, {
  // useEffect,
  useMemo,
  // useRef,
} from 'react';
import {
  extend, ReactThreeFiber,
} from '@react-three/fiber';
import {
  CatmullRomCurve3,
  Color, Vector3,
} from 'three';

// This is a fork of the threejs-meshline lib, as it is no longer maintained.
// See https://github.com/spite/THREE.MeshLine/issues/140#issuecomment-1208355220
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'meshline';
import { CoordArray } from './CoordArray';

// This extends r3f to include the meshline lib.
extend({ MeshLine, MeshLineMaterial });

// This adds the types from the meshline lib to JSX.IntrinsicElements so it can be added
// e.g. as a child of <mesh>
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

/**
 * This component uses MeshLine to render a colored line (width width in world coords)
 * that animates in/out based on visible prop.
 */
export const Squiggle = ({
  points,
  size,
  position,
  color,
  lineWidth,
  visible,
  curved = false,
  nPointsInCurve = 0,
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}: {
  points: CoordArray[];
  size: number;
  position: CoordArray;
  color: Color;
  lineWidth: number;
  visible: boolean;
  curved?: boolean;
  nPointsInCurve?: number;
  rotation?: CoordArray;
  scale?: CoordArray;
}) => {
  const sizedPoints: number[] = useMemo(() => {
    let vectors = points.flatMap((
      [x, y, z],
    ) => new Vector3(x * size - size / 2, y * size - size / 2, z));

    // Optionally extrapolate points into a curve
    if (curved) {
      vectors = new CatmullRomCurve3(vectors, true)
        .getPoints(nPointsInCurve);
    }

    return vectors.flatMap((point:Vector3) => [point.x, point.y, point.z]);
  }, [points, curved, size, nPointsInCurve]);

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

  return (
    <mesh
      position={position}
      rotation={rotation}
      scale={scale}
      raycast={MeshLineRaycast}
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
