import React, { useEffect, useRef, useMemo } from 'react';
import { shaderMaterial } from '@react-three/drei';
import { extend, ReactThreeFiber, useFrame } from '@react-three/fiber';
import {
  DoubleSide, Texture, ShaderMaterial, Clock,
} from 'three';
// @ts-ignore
import glsl from 'glslify';
import { useVideoElement } from './useVideoElement';

const CoffeeShaderMaterial = shaderMaterial(
  {
    map: new Texture(),
    inColor: 0.0,
  },
  glsl`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  glsl`
    uniform sampler2D map;
    varying vec2 vUv;
    uniform float inColor;

    vec3 darkColor = vec3(0.333,0.122,0.);
    vec3 lightColor = vec3(1.,1.,1.);
    float feather = 0.1;

    void main() {
      vec2 smallSquareUv = vUv;
      vec3 texColor = texture2D(map, smallSquareUv).rgb;

      float grayscaleValue = (texColor.r + texColor.g + texColor.b) / 3.0;

      vec3 duoToneColor = mix(darkColor,lightColor,grayscaleValue);

      vec3 color = mix(duoToneColor,texColor,inColor);

      gl_FragColor.rgba = vec4(color, 1.0);
    }
  `,
);

extend({ CoffeeShaderMaterial });

// eslint-disable-next-line no-redeclare
type CoffeeShaderMaterial = ShaderMaterial & {inColor:number}

/* eslint-disable no-unused-vars */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      // eslint-disable-next-line no-undef
      'coffeeShaderMaterial': ReactThreeFiber.Object3DNode<CoffeeShaderMaterial, typeof CoffeeShaderMaterial>;
    }
  }
}
/* eslint-enable no-unused-vars */

export const CoffeeVideoMaterial = ({ src, playing = true }:
  { src: string; playing: boolean; }) => {
  const { videoElement } = useVideoElement(src, playing);
  const materialRef = React.useRef<CoffeeShaderMaterial>(null);

  const inColorClock = useMemo(() => {
    const clock = new Clock();
    clock.start();
    return clock;
  }, []);

  const inColor = playing;

  // useEffect(() => {
  // }, [inColor, inColorClock]);

  useFrame(() => {
    if (!materialRef.current) return;
    const transitionTime = 1.0;

    const increment = inColorClock.getDelta() / transitionTime;

    if (inColor) {
      materialRef.current.uniforms.inColor.value = Math.min(
        materialRef.current.uniforms.inColor.value + increment,
        1.0,
      );
    } else {
      materialRef.current.uniforms.inColor.value = Math.max(
        materialRef.current.uniforms.inColor.value - increment,
        0.0,
      );
    }
  });

  return (
    <coffeeShaderMaterial
      transparent
      depthTest={false}
      side={DoubleSide}
      key={CoffeeShaderMaterial.key}
      inColor={0}
      ref={materialRef}
    >

      {videoElement && (
        <videoTexture
          args={[videoElement]}
          attach="map"
        />
      )}
    </coffeeShaderMaterial>
  );
};
