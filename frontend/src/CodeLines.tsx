import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import useFontFaceObserver from 'use-font-face-observer';
import { Mesh } from 'three';
import colors from './colors';

const RING_HEIGHT = 0.1;
const RADIUS_TAPER = 0.1;
const codeLines = [
  '<TurboEncabulator><Amulite prefabulated /><HydrocopticMarzelvanes count={6} /><Panendermic /><Panendermic semiboloid /></TurboEncabulator>',
  'rm -rf node_modules && npm install && npm run build && npm run hope && npm start',
  '// I hope github copilot will finish this part...',
  '<AllWorkAndNoPlayMakesBryantADullBoy /><AllWorkAndNoPlayMakesBryantADullBoy /><AllWorkAndNoPlayMakesBryantADullBoy /><AllWorkAndNoPlayMakesBryantADullBoy />',
  'useOnMyDeath(()=>{ eraseBrowserHistoryOnAllDevices(); doItAgainJustToBeSure(); tripleCheck(); alsoJustIncinerateHardDrives(); }); ',
  'const debugInterval = setInterval(()=>{if(prompt(\'Program still working?\')==="nope") throw new Error("bug.");}, 100);',
  '<Burrito spicy={100}>{toppings.map((tProps:{name:string,spicy:number,isHotsauce:boolean,vegan:boolean})=>(<Topping {...(tprops)} key={name} />)}</Burrito>',
  'if(i%(3*(7*3+2))===0) return "nice"; if(i%3===0 && i%5===0) return "fizzbuzz"; if(i%3===0) return "fizz"; if(i%5===0) return "buzz";',
  'mintNft("silly-3d-monkey1.gif"); profit(); mintNft("silly-3d-monkey2.gif"); profit(); mintNft("silly-3d-monkey3.gif"); profit();',
  // eslint-disable-next-line no-template-curly-in-string
  'const isEven = async (i:number) => {const res = await fetch(`https://iseven.com/api/numbers/${i}`); const {isEven} = await res.json(); return isEven; }',
];
function createTextCanvas(text: string): HTMLCanvasElement | null {
  const fontSize = 32;

  const canvas = document.createElement('canvas');
  canvas.width = 3048;
  canvas.height = fontSize;
  const context = canvas.getContext('2d');

  if (!context) { return null; }

  context.fillStyle = 'transparent';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.font = `100 ${fontSize}px 'Roboto Mono'`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = colors.blue;
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  return canvas;
}

// https://github.com/gsimone/gsim.one/blob/master/src/Scene.js
function CodeRing({ canvases, y, r }:
  { canvases: (HTMLCanvasElement | null)[]; y: number; r: number; }) {
  const canvas = useMemo(() => canvases[Math.floor(Math.random() * codeLines.length)], [canvases]);

  const speed = useMemo(() => Math.random() * 0.5 + 0.5, []);
  const startingOffset = useMemo(() => Math.random(), []);

  const cylinder = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (!cylinder.current) { return; }
    cylinder.current.rotation.y = startingOffset * Math.PI * 2
    + (clock.getElapsedTime() / 30) * -speed;

    // const scale = (Math.cos(clock.getElapsedTime()) + 1 / 2) * 0.2 + 0.8;
    // cylinder.current.scale.set(scale, scale, scale);
  });

  return (
    <Cylinder
      args={[r, r - RADIUS_TAPER, RING_HEIGHT, 64, 1, true]}
      position={[0, y, 0]}
      rotation={[0, 0, 0]}
      ref={cylinder}
    >
      <meshStandardMaterial transparent attach="material" side={THREE.BackSide}>
        <canvasTexture
          attach="map"
          // @ts-ignore
          repeat={[2, 1]}
          image={canvas}
          premultiplyAlpha
          // @ts-ignore
          wrapS={THREE.RepeatWrapping}
          wrapT={THREE.RepeatWrapping}
          flipY={false}
          // eslint-disable-next-line no-param-reassign
          onUpdate={(s) => { s.needsUpdate = true; }}
        />
      </meshStandardMaterial>
    </Cylinder>
  );
}

export function CodeLines() {
  const isFontLoaded = useFontFaceObserver([
    {
      family: 'Roboto Mono',
      weight: '100',
    },
  ]);

  const canvases = useMemo(() => (
    codeLines.map((code) => (isFontLoaded ? createTextCanvas(`${code} ${new Array(157 - code.length).fill(0).map(() => Math.round(Math.random())).join('')}`) : null))
  ), [isFontLoaded]);

  return (
    isFontLoaded ? (
      <group rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        {new Array(100).fill(null).map((_, index) => (
          <CodeRing
            y={54 + index * -8 * RING_HEIGHT}
            r={5}
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            canvases={canvases}
          />
        ))}
      </group>
    ) : null
  );
}
