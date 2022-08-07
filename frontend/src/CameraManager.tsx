import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import { MatrixState } from './redux/matrixSlice';

export function CameraManager({ matrixState }: { matrixState: MatrixState; }) {
  const camera = useThree((state) => state.camera);

  const size = useThree((state) => state.size);

  useEffect(() => {
    if (camera.type !== 'OrthographicCamera') { return; }
    // console.log('camera', camera);
    const { width, height } = matrixState.dims;
    camera.position.set(0, 0, 100);
    camera.left = 0;
    camera.top = 0;
    camera.right = width;
    camera.bottom = height;

    camera.updateProjectionMatrix();
  }, [matrixState.dims, camera, size]);

  return (
    <OrthographicCamera
      makeDefault
    />
  );
}
