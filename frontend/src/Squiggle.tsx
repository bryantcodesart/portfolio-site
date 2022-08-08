import React, {
  Ref,
  // useEffect,
  useMemo, useRef,
  // useRef,
} from 'react';
import {
  extend, ReactThreeFiber, useFrame,
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
  drawSpeed = 0.01,
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
  drawSpeed?: number;
}) => {
  // Calculate our points, sized via the size prop
  // and possibly interpolated into a curve on nPointsInCurve if curved prop is true.
  // Must be in format [x1,y1,z1,x2,y2,z2,...] for MeshLine.
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

  // Animate by incrementing/decrementing the dash ratio fed to the material shader
  // value of 0 means the entire line is drawn, 1 means none of it is drawn.
  const materialRef = useRef<MeshLineMaterial>();
  useFrame(() => {
    if (materialRef.current) {
      if (visible) {
        materialRef.current.uniforms.dashRatio.value = Math.max(
          materialRef.current.uniforms.dashRatio.value - drawSpeed,
          0,
        );
      } else {
        materialRef.current.uniforms.dashRatio.value = Math.min(
          materialRef.current.uniforms.dashRatio.value + drawSpeed,
          1,
        );
      }
    }
  });

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
        transparent
        depthTest={false}
        lineWidth={lineWidth}
        color={color}
        ref={materialRef as Ref<MeshLineMaterial>}
        dashArray={1}
        dashRatio={1}
        dashOffset={0}
      />
    </mesh>
  );
};
