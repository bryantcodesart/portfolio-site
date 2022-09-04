// import { useEventListener } from 'usehooks-ts';
import React, { useMemo } from 'react';
import { shaderMaterial } from '@react-three/drei';
import { extend, ReactThreeFiber, useFrame } from '@react-three/fiber';
import {
  ShaderMaterial, Clock, FrontSide,
} from 'three';
// @ts-ignore
import glsl from 'glslify';

const BackgroundColorShaderMaterial = shaderMaterial(
  {
    opacity: 0.0,
    time: 0.0,
    seed: 0.0,
    // mouseX: 0.0,
    // mouseY: 0.0,
    color1: [1, 1, 1],
    color2: [1, 1, 1],
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
    uniform float opacity;
    uniform float time;
    uniform float seed;
    uniform float mouseX;
    uniform float mouseY;
    uniform vec3 color1;
    uniform vec3 color2;


    // 2D Random
    // from https://thebookofshaders.com/11/
    float random (in vec2 st) {
      return fract(sin(dot(st.xy,
        vec2(12.9898,78.233)))
        * 43758.5453123);
    }

    float randomWithSeed (in vec2 st, float seed) {
      return fract(sin(dot(st.xy,
        vec2(12.9898+seed,78.233+seed)))
        * 43758.5453123);
    }


    // 2D Noise based on Morgan McGuire @morgan3d
    // https://www.shadertoy.com/view/4dS3Wd
    float noise (in vec2 st, float seed) {
      vec2 i = floor(st);
      vec2 f = fract(st);

      // Four corners in 2D of a tile
      float a = randomWithSeed(i,seed);
      float b = randomWithSeed(i + vec2(1.0, 0.0),seed);
      float c = randomWithSeed(i + vec2(0.0, 1.0),seed);
      float d = randomWithSeed(i + vec2(1.0, 1.0),seed);

      // Smooth Interpolation

      // Cubic Hermine Curve.  Same as SmoothStep()
      vec2 u = f*f*(3.0-2.0*f);
      // u = smoothstep(0.,1.,f);

      // Mix 4 coorners percentages
      return mix(a, b, u.x) +
        (c - a)* u.y * (1.0 - u.x) +
        (d - b) * u.x * u.y;
    }

    float grayscaleValue(vec3 color) {
      return (color.r + color.g + color.b) / 3.;
    }
    vec3 grayscaleColor(vec3 color) {
      return vec3((color.r + color.g + color.b) / 3.);
    }

    // #pragma glslify: blur = require('glsl-fast-gaussian-blur')

    float distance(float x1, float y1, float x2, float y2) {
      return sqrt(pow(x2-x1,2.) + pow(y2-y1,2.));
    }

    vec3 tritone(vec3 color, vec3 light, vec3 mid, vec3 dark) {
      float gray = grayscaleValue(color);
      return (1.-step(0.5, gray)) * mix(dark,mid,gray*2.)
        + step(0.5, gray) * mix(mid,light,gray*2.-1.);
    }

    // vec3 color1 = vec3(0.945,0.729,0.902); // pink
    // vec3 color2 = vec3(0.733,0.945,0.976); // blue
    // vec3 color3 = vec3(0.973,0.231,0.133);

    mat4 bayerIndex = mat4(
      vec4(00.0/16.0, 12.0/16.0, 03.0/16.0, 15.0/16.0),
      vec4(08.0/16.0, 04.0/16.0, 11.0/16.0, 07.0/16.0),
      vec4(02.0/16.0, 14.0/16.0, 01.0/16.0, 13.0/16.0),
      vec4(10.0/16.0, 06.0/16.0, 09.0/16.0, 05.0/16.0));

    vec3 dither(vec2 coord, vec3 color) {
      // coord *= 1.5;

      // gamma correction
      color = smoothstep(0.1,1.,color);
      color = vec3(pow(color.rgb,vec3(2.1)) - 0.004);

      // find bayer matrix entry based on fragment position
      float bayerValue = bayerIndex[int(coord.x) % 4][int(coord.y) % 4];

      // output
      return vec3(
          step(bayerValue,color.r),
          step(bayerValue,color.g),
          step(bayerValue,color.b));

      // return vec3(step(bayerValue,grayscale(color)));
    }


    void main() {
      float distanceFromMouse = clamp(distance(vUv.x,vUv.y,mouseX,mouseY)*5.,0.,1.);

      float noiseValue = 0.;
      noiseValue += noise(vUv*3.+time/5.,seed)*(1.+cos(time)/4.)/5.0;
      noiseValue += noise(vUv*3.-time/5.,seed)*(1.+cos(time+3.14/2.)/4.)/5.0;
      noiseValue += noise(vUv*6.+time/5.,seed)*(1.+cos(time+3.14)/4.)/5.0;
      noiseValue += noise(vUv*10.-time/5.,seed)*(1.+cos(time+3.14*3./2.)/4.)/5.0;
      noiseValue += noise(vUv*2.,seed)*(1.+cos(time+3.14*3./2.)/2.)/5.0;

      noiseValue = smoothstep(0.4,0.6,noiseValue);

      float noiseTiny = 0.;
      noiseTiny += noise(vUv*700.,0.)*(1.+cos(time+3.14*3./2.)/2.)/2.0;
      // noiseTiny += noise(vUv*500.,seed)*(1.+cos(time+3.14*3./2.)/2.);
      // noiseTiny = step(0.1,noiseTiny);

      noiseValue = min(noiseValue + noiseTiny,1.0);
      noiseValue = step(0.5,noiseValue);


      // noiseValue += noise(vUv*900.,0.)*(1.+cos(time+3.14*3./2.)/2.)/6.0;
      // noiseValue += noise(vUv*900.,seed)*(1.+cos(time+3.14*3./2.)/2.)/6.0;



      vec3 color = mix(color1,color2,vec3(noiseValue));

      // color = dither(gl_FragCoord.xy,color);

      // vec3 color = vec3(noiseValue);

      gl_FragColor.rgba = vec4(color, opacity);
    }
  `,
);

extend({ BackgroundColorShaderMaterial });

// eslint-disable-next-line no-redeclare
type BackgroundColorShaderMaterial = ShaderMaterial &
{
  opacity:number,
  seed:number,
  time:number,
  // mouseX:number,
  // mouseY:number
  color1:[number, number, number],
  color2:[number, number, number],
};

/* eslint-disable no-unused-vars */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      // eslint-disable-next-line no-undef
      'backgroundColorShaderMaterial': ReactThreeFiber.Object3DNode<BackgroundColorShaderMaterial, typeof BackgroundColorShaderMaterial>;
    }
  }
}
/* eslint-enable no-unused-vars */

export const BackgroundColorMaterial = ({ opacity = true, color1, color2 }:
  { opacity: boolean; color1: [number, number, number]; color2: [number, number, number]}) => {
  // const { videoElement } = useVideoElement(src, playing, { debug: false });
  const materialRef = React.useRef<BackgroundColorShaderMaterial>(null);

  const opacityClock = useMemo(() => {
    const clock = new Clock();
    clock.start();
    return clock;
  }, []);

  useFrame(() => {
    if (!materialRef.current) return;

    const transitionTime = opacity ? 1 : 0.2;

    const increment = opacityClock.getDelta() / transitionTime;

    if (opacity) {
      materialRef.current.uniforms.opacity.value = Math.min(
        materialRef.current.uniforms.opacity.value + increment,
        1.0,
      );
    } else {
      materialRef.current.uniforms.opacity.value = Math.max(
        materialRef.current.uniforms.opacity.value - increment,
        0.0,
      );
    }

    materialRef.current.uniforms.time.value += increment;
  });

  // useEventListener('mousemove', (e) => {
  //   if (!materialRef.current) return;

  //   materialRef.current.uniforms.mouseX.value = e.clientX / window.innerWidth;
  //   materialRef.current.uniforms.mouseY.value = 1 - e.clientY / window.innerHeight;
  //   // console.log(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
  // });

  const randomSeed = useMemo(() => Math.random(), []);

  return (
    <backgroundColorShaderMaterial
      // transparent
      // depthTest={false}
      side={FrontSide}
      key={BackgroundColorShaderMaterial.key}
      opacity={0} // Animated with useFrame above
      seed={randomSeed}
      ref={materialRef}
      transparent
      time={0} // Animated with useFrame above
      color1={color1}
      color2={color2}
    >

      {/* {videoElement && (
        <videoTexture
          args={[videoElement]}
          attach="map"
        />
      )} */}
    </backgroundColorShaderMaterial>
  );
};
