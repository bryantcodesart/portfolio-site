// import { useEventListener } from 'usehooks-ts';
import React, { useMemo } from 'react';
import { shaderMaterial } from '@react-three/drei';
import { extend, ReactThreeFiber, useFrame } from '@react-three/fiber';
import {
  ShaderMaterial, Clock, FrontSide,
} from 'three';
// @ts-ignore
import glsl from 'glslify';
import { Project } from '../generatedSanitySchemaTypes';
import { useBreakpoints } from './useBreakpoints';
// import colors from './colors';

const BackgroundColorShaderMaterial = shaderMaterial(
  {
    opacity: 0.0,
    time: 0.0,
    seed: 0.0,
    // mouseX: 0.0,
    // mouseY: 0.0,
    projectColor: [1, 1, 1],
    breakpoint: false,
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
    // uniform float mouseX;
    // uniform float mouseY;
    uniform vec3 projectColor;
    uniform bool breakpoint;

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

    float distance(float x1, float y1, float x2, float y2) {
      return sqrt(pow(x2-x1,2.) + pow(y2-y1,2.));
    }

    // https://alaingalvan.tumblr.com/post/79864187609/glsl-color-correction-shaders
    vec3 brightnessContrast(vec3 value, float brightness, float contrast){
      return (value - 0.5) * contrast + 0.5 + brightness;
    }


    float blobNoise (float size, float seed, float correctedTime) {
      float blobNoise = 0.;
      float correction = 1.0;

      correctedTime = correctedTime * (0.75+0.5*randomWithSeed(vec2(seed),seed));
      blobNoise += noise(vec2(vUv.x*size-correctedTime/2.,vUv.y*size-correctedTime/2.),seed*2.0)*(cos(correctedTime+3.14*0.0))*correction;
      blobNoise += noise(vec2(vUv.x*size+correctedTime/2.,vUv.y*size+correctedTime/2.),seed*3.0)*(cos(correctedTime+3.14*0.5))*correction;
      blobNoise += noise(vec2(vUv.x*size+correctedTime/2.,vUv.y*size-correctedTime/2.),seed*4.0)*(cos(correctedTime+3.14*1.0))*correction;
      blobNoise += noise(vec2(vUv.x*size-correctedTime/2.,vUv.y*size+correctedTime/2.),seed*5.0)*(cos(correctedTime+3.14*1.5))*correction;

      return clamp(0.0,1.0,blobNoise);
    }


    float isNonZero(float test){
      return 1.-step(1.0,1.-test);
    }

    float isZero(float test){
      return step(1.0,1.-test);
    }

    vec3 coffee = vec3(0.333,0.122,0.);
    vec3 black = vec3(0.1);

    void main() {
      float transitionBlobs = 0.0;
      transitionBlobs += noise(vUv*2.0+time,seed)/2.0;
      transitionBlobs += noise(vUv*8.0+time,seed+1000.0)/2.0;
      transitionBlobs = step(1.0-opacity,transitionBlobs);


      float colorBlobs = 0.0;
      if(breakpoint) {
        colorBlobs += smoothstep(0.7,0.9,1.0-distance(vUv.x, vUv.y, .75, vUv.y)*1.0);
      } else {
        colorBlobs += smoothstep(0.7,0.9,1.0-distance(vUv.x, vUv.y, vUv.x, .65)*1.0);
      }
      colorBlobs += blobNoise(5.0, seed, time*0.1)/4.0;
      colorBlobs += blobNoise(2.0, seed, time*0.2)/4.0;
      vec3 color = mix(coffee,colorBlobs*projectColor,opacity);

      gl_FragColor.rgba = vec4(color, transitionBlobs);
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
  projectColor:[number, number, number],
  // color2:[number, number, number],
  // colorNudge: number,
  breakpoint:boolean,
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

const rgbToGlsl = (rgb: {r:number, g:number, b:number}):[number, number, number] => ([
  rgb.r / 255, rgb.g / 255, rgb.b / 255,
]);

export const BackgroundColorMaterial = ({ opacity = true, project = null }:
  { opacity: boolean; project:Project|null}) => {
  // const { videoElement } = useVideoElement(src, playing, { debug: false });
  const materialRef = React.useRef<BackgroundColorShaderMaterial>(null);

  const breakpoints = useBreakpoints();

  const projectColor:[number, number, number] = project !== null
    ? rgbToGlsl(project?.color1?.rgb)
    : null ?? ([0.333, 0.122, 0.0]);

  const opacityClock = useMemo(() => {
    const clock = new Clock();
    clock.start();
    return clock;
  }, []);

  useFrame(() => {
    if (!materialRef.current) return;

    const transitionTime = 1; // opacity ? 1 : 0.5;

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
      side={FrontSide}
      key={BackgroundColorShaderMaterial.key}
      opacity={0} // Animated with useFrame above
      seed={randomSeed}
      ref={materialRef}
      transparent
      time={0} // Animated with useFrame above
      projectColor={projectColor}
      breakpoint={breakpoints.projectOpen}
    />
  );
};
