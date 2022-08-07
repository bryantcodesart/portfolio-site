import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Cylinder,
  // Image,
  // Html
} from '@react-three/drei';
import * as THREE from 'three';
// import { Box } from './Box';
import useFontFaceObserver from 'use-font-face-observer';
// import { useMouse } from 'rooks';
import { useEventListener } from 'usehooks-ts';
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

function createTextCanvas(text:string) : HTMLCanvasElement|null {
  const fontSize = 32;

  const canvas = document.createElement('canvas');
  canvas.width = 3048;
  canvas.height = fontSize;
  const context = canvas.getContext('2d');

  if (!context) return null;

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
function CodeRing({ canvases, z, r }:{ canvases:(HTMLCanvasElement|null)[], z: number, r:number }) {
  const canvas = useMemo(() => canvases[Math.floor(Math.random() * codeLines.length)], [canvases]);

  const speed = useMemo(() => Math.random() * 0.5 + 0.5, []);
  const startingOffset = useMemo(() => Math.random(), []);

  const texture = useRef<THREE.CanvasTexture|null>(null);
  useFrame(({ clock }) => {
    if (!texture.current) return;
    texture.current.offset.x = startingOffset * 1000 + (clock.getElapsedTime() / 50) * -speed;
  });

  return (
    <Cylinder
      args={[r, r - RADIUS_TAPER, RING_HEIGHT, 64, 1, true]}
      position={[0, 2, z]}
      rotation={[0, Math.PI / 2, Math.PI / 2]}
    >
      <meshStandardMaterial transparent attach="material" side={THREE.BackSide}>
        <canvasTexture
          attach="map"
          // @ts-ignore
          repeat={[2, 1]}
          image={canvas}
          premultiplyAlpha
          // @ts-ignore
          ref={texture}
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

const MoveCameraWithMouse = () => {
  const mouse = useRef<{x:number, y:number}|null>(null);
  useEventListener('mousemove', (e) => {
    mouse.current = {
      x: e.clientX / window.innerWidth - 0.5,
      y: (1 - e.clientY / window.innerHeight) - 0.5,
    };
  });
  useFrame(({ camera }) => {
    const { x, y } = mouse.current ? mouse.current : { x: 0, y: 0 };
    camera.position.lerp(new THREE.Vector3(x / 2, y / 2, 5), 0.1);
  });

  return null;
};

// const Squiggle = ({ image, width, position }:
// {
//   image:StaticImageData,
//   width:number,
//   position:[x:number, y:number, z:number]
// }) => (
//   <Image
//     url={image.src}
//     scale={[width, width * (image.height / image.width), 1]}
//     position={position}
//     transparent
//     tint={0xff0000}
//   />
// );

function CodeLines() {
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
      <group>
        {new Array(50).fill(null).map((_, index) => (
          <CodeRing
            z={5 + index * -RING_HEIGHT * (2 + 0.05 * index)}
            r={5 - RADIUS_TAPER * index}
          // eslint-disable-next-line react/no-array-index-key
            key={index}
            canvases={canvases}
          />
        ))}
      </group>
    ) : null
  );
}

const ThreeScene = () => (
  <Canvas>
    <ambientLight />
    <CodeLines />
    {/* <OrbitControls /> */}
    <MoveCameraWithMouse />
    {/* <Squiggle image={squiggleBigGreenImage} width={5} position={[0, 0, 3]} /> */}

    {/* <Html transform position={[0, 0, 2]}>
      <p className="p-4 text-white bg-blue font-mono text-[1vw]">
        hi! i’m bryant! (he/him)
        <br />
        i make dope
        <br />
        web experiences.
      </p>
    </Html> */}
  </Canvas>
);
export default ThreeScene;
