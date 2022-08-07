import React, { forwardRef, useMemo } from 'react';
import {
  EffectComposer,
  Pixelation,
  BrightnessContrast,
} from '@react-three/postprocessing';
// import { useControls } from 'leva';
import { LUT3DEffect } from 'postprocessing';
import { Texture } from 'three';
import { useTexture } from '@react-three/drei';
// import { rangeParams } from './rangeParams';


export function PostProcessing() {
  const config = {
    brightness: -0.37,
    contrast: -0.16,
    lut: true,
    pixelate: 2,
  };
  // useControls('Post Processing Effects', {
  //   brightness: rangeParams(-0.37, -1, 1, 0.01),
  //   contrast: rangeParams(-0.16, -1, 1, 0.01),
  //   lut: true,
  //   pixelate: rangeParams(2, 0, 30, 1),
  // });


  return (
    <EffectComposer>
    </EffectComposer>
  );
}
