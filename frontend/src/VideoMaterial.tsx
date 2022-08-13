import React from 'react';
import { shaderMaterial } from '@react-three/drei';
import { extend, ReactThreeFiber } from '@react-three/fiber';
import {
  DoubleSide, Texture, ShaderMaterial,
} from 'three';
// @ts-ignore
import glsl from 'glslify';
import { useVideoElement } from './useVideoElement';

extend({
  // shaderMaterial creates a THREE.ShaderMaterial, and auto-creates uniform setter/getters
  // extend makes it available in JSX, in this case <portalMaterial />
  PlainTextureMaterial: shaderMaterial(
    {
      map: new Texture(),
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
    void main() {
      vec3 color = texture2D(map, vUv).rgb;
      gl_FragColor.rgba = vec4(color, 1.0);
    }
    `,
  ),
});

/* eslint-disable no-unused-vars */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'plainTextureMaterial': ReactThreeFiber.Object3DNode<ShaderMaterial, typeof ShaderMaterial>;
    }
  }
}
/* eslint-enable no-unused-vars */

export const VideoMaterial = ({ src, playing = true }: { src: string; playing: boolean; }) => {
  const { videoElement } = useVideoElement(src, playing);
  return (
    <plainTextureMaterial
      transparent
      depthTest={false}
      side={DoubleSide}
    >

      {videoElement && (
        <videoTexture
          args={[videoElement]}
          attach="map"
        />
      )}
    </plainTextureMaterial>
  );
};
