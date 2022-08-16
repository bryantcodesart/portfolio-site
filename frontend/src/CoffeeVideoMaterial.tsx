import React, { useMemo } from 'react';
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
    uniform float seed;


    // 2D Random
    // from https://thebookofshaders.com/11/
    float random (in vec2 st) {
      return fract(sin(dot(st.xy,
        vec2(12.9898,78.233)))
        * 43758.5453123);
    }

    // 2D Noise based on Morgan McGuire @morgan3d
    // https://www.shadertoy.com/view/4dS3Wd
    float noise (in vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);

      // Four corners in 2D of a tile
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));

      // Smooth Interpolation

      // Cubic Hermine Curve.  Same as SmoothStep()
      vec2 u = f*f*(3.0-2.0*f);
      // u = smoothstep(0.,1.,f);

      // Mix 4 coorners percentages
      return mix(a, b, u.x) +
        (c - a)* u.y * (1.0 - u.x) +
        (d - b) * u.x * u.y;
    }

    vec3 darkColor = vec3(0.333,0.122,0.);
    vec3 lightColor = vec3(1.,1.,1.);

    void main() {
      vec3 texColor = texture2D(map, vUv).rgb;

      float grayscaleValue = (texColor.r + texColor.g + texColor.b) / 3.0;

      vec3 duoToneColor = mix(darkColor,lightColor,grayscaleValue);

      float noiseValue = noise(vUv*10.0-seed);
      float visible = smoothstep(1.5,2.0,(noiseValue+inColor*2.));

      vec3 color = mix(duoToneColor,texColor,visible);

      gl_FragColor.rgba = vec4(color, 1.); //0.8+0.2*inColor);
    }
  `,
);

extend({ CoffeeShaderMaterial });

// eslint-disable-next-line no-redeclare
type CoffeeShaderMaterial = ShaderMaterial & {inColor:number, seed:number};

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
    const transitionTime = 0.7;

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

  const randomSeed = useMemo(() => Math.random(), []);

  return (
    <coffeeShaderMaterial
      transparent
      depthTest={false}
      side={DoubleSide}
      key={CoffeeShaderMaterial.key}
      inColor={0}
      seed={randomSeed}
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
