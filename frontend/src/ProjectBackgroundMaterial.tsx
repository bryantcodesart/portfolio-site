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

const BackgroundColorShaderMaterial = shaderMaterial(
  {
    opacity: 0.0,
    time: 0.0,
    seed: 0.0,
    // mouseX: 0.0,
    // mouseY: 0.0,
    color1: [1, 1, 1],
    color2: [1, 1, 1],
    colorNudge: 1.0,
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
    uniform float colorNudge;

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

    float blobNoise (float size, float seed, float time) {
      float blobNoise = 0.;
      float correction = 1.0;

      time = time * (0.75+0.5*randomWithSeed(vec2(seed),seed));
      blobNoise += noise(vec2(vUv.x*size-time/2.,vUv.y*size-time/2.),seed*2.0)*(cos(time+3.14*0.0))*correction;
      blobNoise += noise(vec2(vUv.x*size+time/2.,vUv.y*size+time/2.),seed*3.0)*(cos(time+3.14*0.5))*correction;
      blobNoise += noise(vec2(vUv.x*size+time/2.,vUv.y*size-time/2.),seed*4.0)*(cos(time+3.14*1.0))*correction;
      blobNoise += noise(vec2(vUv.x*size-time/2.,vUv.y*size+time/2.),seed*5.0)*(cos(time+3.14*1.5))*correction;

      // time = time * (0.5+randomWithSeed(vec2(seed),seed));
      // blobNoise += noise(vec2(vUv.x*size-time/3.,vUv.y*size-time/3.),seed*2.0)*(cos(time+3.14*0.0))*correction;
      // blobNoise += noise(vec2(vUv.x*size+time/3.,vUv.y*size+time/3.),seed*3.0)*(cos(time+3.14*0.5))*correction;
      // blobNoise += noise(vec2(vUv.x*size+time/3.,vUv.y*size-time/3.),seed*4.0)*(cos(time+3.14*1.0))*correction;
      // blobNoise += noise(vec2(vUv.x*size-time/3.,vUv.y*size+time/3.),seed*5.0)*(cos(time+3.14*1.5))*correction;

      return clamp(0.0,1.0,blobNoise);
    }


    float isNonZero(float test){
      return 1.-step(1.0,1.-test);
    }

    float isZero(float test){
      return step(1.0,1.-test);
    }

    void main() {

      float blobs = 0.0;
      // blobs += blobNoise(2.0, seed, time*0.2)/3.0;
      // blobs += noise(vUv,seed);
      // blobs += isZero(blobs)*blobs(8.0, 0.3, seed*10.0, time*0.3);
      // A blobs that will make a grainy pseudo-pixelation effect
      // float pixels = 0.0;
      // // pixels += blobNoise(1000.0, seed*vUv.x+seed+vUv.y, time*3.);

      // float compositeNoise = blobs - pixels;
      blobs += smoothstep(0.3,0.8,1.0-distance(vUv.x,vUv.y,.75,.7)*1.0);
      blobs += blobNoise(5.0, seed, time*0.1)/4.0;
      blobs += blobNoise(2.0, seed, time*0.2)/4.0;
      // blobs += blobNoise(10.0, seed, time*0.2)/2.0;
      // blobs = step(0.5,blobs);
      blobs = smoothstep(0.2,0.6,blobs);


      // Sample color based on noise
      vec3 color = vec3(0.0);
      // color = mix(color1,color2,clamp(0.0,1.0,blobs));
      // color=vec3(blobs);

      // Nudge the color based on a value provided by the CMS (to make text more readable)
      // color = mix(color,vec3(0.0),-colorNudge);
      // color = color + colorNudge;
      // color = brightnessContrast(color, 0., 0.3);

      // Out
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
  colorNudge: number,
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

  const color1:[number, number, number] = project !== null
    ? rgbToGlsl(project?.color1?.rgb)
    : null ?? ([1, 1, 1]);

  const color2:[number, number, number] = project !== null
    ? rgbToGlsl(project?.color2?.rgb)
    : null ?? [0, 0, 0];

  const colorNudge = project !== null
    ? project.colorNudge
    : null ?? 1.0;

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
      colorNudge={colorNudge}
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
