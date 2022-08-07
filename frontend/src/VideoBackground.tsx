import React from 'react';
import { MatrixState } from './redux/matrixSlice';
import { useVideoElement } from './useVideoElement';

export function VideoBackground({ matrixState }: { matrixState: MatrixState; }) {
  const { width, height } = matrixState.dims;

  const bgVideoUrl = '/raw-bg-vid.mp4';
  const [video] = useVideoElement(bgVideoUrl);

  return (
    <mesh
      position={[width / 2, height / 2, -2]}
      rotation={[0, 0, Math.PI]}
    >
      <boxGeometry args={[matrixState.dims.width, matrixState.dims.height, 1]} />
      <meshStandardMaterial>
        <videoTexture args={[video]} attach="map" />
      </meshStandardMaterial>
    </mesh>
  );
}
