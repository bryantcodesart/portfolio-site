import React, { useMemo, useRef } from 'react';
import { shaderMaterial, useTexture } from '@react-three/drei';
import { extend, ReactThreeFiber, useFrame } from '@react-three/fiber';
import {
  Texture, ShaderMaterial, Clock, FrontSide, VideoTexture,
} from 'three';
// @ts-ignore
import glsl from 'glslify';
import { useInterval } from 'usehooks-ts';
import { useVideoElement } from './useVideoElement';
import './PausableVideoTexture';
import { isPlaying } from './isPlaying';

const CoffeeShaderMaterial = shaderMaterial(
  {
    thumb: new Texture(),
    video: new Texture(),
    unfreeze: 0.0,
    time: 0.0,
    videoReady: 0.0,
  },
  glsl`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  glsl`
    uniform sampler2D thumb;
    uniform sampler2D video;
    varying vec2 vUv;
    uniform float unfreeze;
    uniform float seed;
    uniform float time;
    uniform float videoReady;

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

    vec3 darkColor = vec3(0.,0.,1.); //vec3(0.333,0.122,0.);
    vec3 middleColor = vec3(0.,1.,1.);
    vec3 lightColor = vec3(0.8,1.,1.);

    void main() {

      float noiseValue1 = noise(vUv*5.0-seed + time);
      float noiseValue2 = noise(vUv*10.0-seed*50. + time);
      float noiseValue3 = noise(vUv*2.0-seed*100. + time);
      float noiseValue4 = noise(vUv*8.0-seed*150.*unfreeze + time);
      float noiseValue5 = noise(vUv*100.0-seed*250.*unfreeze + time);
      float noiseValue6 = noise(vUv*-seed*300. + time);
      float noiseValue = (noiseValue1+noiseValue2+noiseValue3+noiseValue4+noiseValue5+noiseValue6)/6.;
      float visible = smoothstep(0.0,2.0,(noiseValue+unfreeze*2.));
      visible = smoothstep(0.5,1.0,visible);


      vec3 distortedVideoColor = texture2D(video, (vUv-0.5)*visible+0.5).rgb;
      vec3 distortedThumbColor = texture2D(thumb, (vUv-0.5)*visible+0.5).rgb;
      vec3 unfrozenColor = mix(distortedThumbColor, distortedVideoColor, videoReady);

      vec3 frozenColor = texture2D(thumb, vUv).rgb;
      float grayscaleValue = (frozenColor.r + frozenColor.g + frozenColor.b) / 3.0 * 1. + 0.33;
      frozenColor =
      (1.-step(0.5, grayscaleValue)) * mix(darkColor,middleColor,grayscaleValue*2.)
        + step(0.5, grayscaleValue) * mix(middleColor,lightColor,grayscaleValue*2.-1.);
      frozenColor += noiseValue;

      vec3 color = mix(frozenColor,unfrozenColor,visible);

      gl_FragColor.rgba = vec4(color, 1.0); //0.8+0.2*unfreeze);
    }
  `,
);

extend({ CoffeeShaderMaterial });

// eslint-disable-next-line no-redeclare
type CoffeeShaderMaterial = ShaderMaterial & {
  unfreeze:number,
  seed:number,
  thumb:Texture,
  video:Texture,
  time:number,
  videoReady:number,
};

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

export const CoffeeVideoMaterial = ({ videoSrc, thumbSrc, active = true }:
  { thumbSrc: string; videoSrc: string; active: boolean; }) => {
  const { videoElement, canPlay } = useVideoElement(videoSrc, active, { debug: false });
  const materialRef = React.useRef<CoffeeShaderMaterial>(null);

  const unfreezeClock = useMemo(() => {
    const clock = new Clock();
    clock.start();
    return clock;
  }, []);

  useFrame(() => {
    if (!materialRef.current) return;
    const transitionTime = 1;

    const increment = unfreezeClock.getDelta() / transitionTime;

    if (active) {
      materialRef.current.uniforms.unfreeze.value = Math.min(
        materialRef.current.uniforms.unfreeze.value + increment * 0.7,
        1.0,
      );
    } else {
      materialRef.current.uniforms.unfreeze.value = Math.max(
        materialRef.current.uniforms.unfreeze.value - increment * 0.7,
        0.0,
      );
    }

    if (canPlay) {
      materialRef.current.uniforms.videoReady.value = Math.min(
        materialRef.current.uniforms.videoReady.value + increment,
        1.0,
      );
    } else {
      materialRef.current.uniforms.videoReady.value = Math.max(
        materialRef.current.uniforms.videoReady.value - increment,
        0.0,
      );
    }

    materialRef.current.uniforms.time.value += increment;
  });

  const randomSeed = useMemo(() => Math.random(), []);

  const thumbTexture = useTexture(thumbSrc);

  // Due to some race case with requestVideoFrameCallback, paused videos are occasionally unrendered
  // So we prompt a rerender every so often jic.
  const videoTextureRef = useRef<VideoTexture>(null);
  useInterval(() => {
    if (videoTextureRef.current) videoTextureRef.current.needsUpdate = true;
    if (videoElement && isPlaying(videoElement) && !active) videoElement.pause();
  }, 500);

  // Make sure the video is paused when not active
  useInterval(() => {
    if (videoElement && isPlaying(videoElement) && !active) videoElement.pause();
  }, 500);

  return (
    <coffeeShaderMaterial
      depthTest={false}
      side={FrontSide}
      key={CoffeeShaderMaterial.key}
      unfreeze={0}
      seed={randomSeed}
      ref={materialRef}
      thumb={thumbTexture}
      videoReady={0}
      time={0} // will be set in anim frame
      transparent
    >

      {videoElement && (
        <pausableVideoTexture
          args={[videoElement]}
          attach="video"
          ref={videoTextureRef}
        />
      )}
    </coffeeShaderMaterial>
  );
};
