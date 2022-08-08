import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import useFontFaceObserver from 'use-font-face-observer';
import {
  Mesh, SubtractiveBlending, Texture,
} from 'three';
import colors from './colors';

/* height of each ring in world coordinate */
const RING_HEIGHT = 0.02;
/* each ring is slightly narrower on top compared to bottom, creating a taper.
The difference in world coords */
const RADIUS_TAPER = 0.05;
/* number of canvas textures that can be pulled at random for a ring,
ie some are recycled for performance */
const N_RING_CANVASES = 5;
/** width of each canvas texture in pixels */
const CANVAS_WIDTH = 1433;
/** Font size of the text written on the canvas */
const FONT_SIZE = 15;
/** time ms between each anim frame */
const UPDATE_INTERVAL = 100;
/** The length a string should be to fit perfectly on the CANVAS_WIDTH pixels wide canvas */
const TEXT_LINE_LENGTH = 158;
/** The possible lines of code we can type on the rings */
const TEXT_LINES = [
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
].map((line) => line + ((new Array(TEXT_LINE_LENGTH - line.length)).fill('.').join('')));

/**
 * Creates a canvas that can be used as a ring texture.
 * The canvas writes a line of code from TEXT_LINES.
 * It animates to simulate someone typing another line of text on top
 */
function createTextCanvas(): HTMLCanvasElement | null {
  console.log('createTextCanvas');
  // Create a canvas
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = FONT_SIZE;
  const context = canvas.getContext('2d');

  /** returns a random line from TEXT_LINES */
  function chooseLine() {
    return TEXT_LINES[Math.floor(Math.random() * TEXT_LINES.length)];
  }

  /* Current character index in the line of text to simulate typing */
  let i = Math.floor(Math.random() * TEXT_LINES.length);
  /* line of text we just wrote */
  let previousLine = chooseLine();
  /* line of text we are writing */
  let nextLine = chooseLine();

  /* the string to use to simulate the typer's carat */
  const caratString = '░▒▓██';

  /* Draw the current state of the ascii animation onto our canvas */
  function redrawCanvas() {
    if (!context) return;

    // Determine the text to write and iterate our counters
    const textToWrite = `${nextLine.slice(0, i)}${caratString}${previousLine.slice(i + caratString.length)}`;
    i += 1;
    // Reset and pick a new line if we are at the end
    if (i === TEXT_LINE_LENGTH) {
      previousLine = nextLine;
      nextLine = chooseLine();
      i = 0;
    }

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Write the text (our component will have already double checked that the font is loaded)
    context.font = `200 ${FONT_SIZE}px 'Roboto Mono'`;
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.fillStyle = colors.blue;
    context.fillText(textToWrite, 0, canvas.height / 2);
  }

  // Draw now to start
  redrawCanvas();

  // Repeat to animate
  setInterval(() => {
    redrawCanvas();
  }, UPDATE_INTERVAL);
  return canvas;
}

// Inspired by https://github.com/gsimone/gsim.one/blob/master/src/Scene.js
/**
 * Draws a ring of animating text onto the scene.
 * @see https://github.com/gsimone/gsim.one/blob/master/src/Scene.js (inspired by)
 */
function CodeRing({
  /* the available texture canvases, one will be chosen at random */
  canvases,
  /* the y coord of the ring in world coordinates */
  y,
  /* the radius of the ring in world coordinates */
  r,
  /* How many times the texture should be repeated, (few for small ring, many for large ring) */
  repeats,
}:
  { canvases: (HTMLCanvasElement | null)[]; y: number; r: number, repeats: number }) {
  const canvas = useMemo(() => canvases[Math.floor(Math.random() * canvases.length)], [canvases]);

  const speed = useMemo(() => Math.random() * 0.5 + 0.5, []);
  const startingOffset = useMemo(() => Math.random(), []);

  const cylinder = useRef<Mesh>(null);

  const texture = useRef<Texture>(null);

  useFrame(({
    clock,
    // camera
  }) => {
    if (!cylinder.current || !texture.current) return;

    // Rotate the texture slightly--must be done by the texture and not rotating the mesh itself
    // because of the irregular shape
    texture.current.offset.x = startingOffset * CANVAS_WIDTH
     + (clock.getElapsedTime() / 60) * -speed;

    // texture.current.needsUpdate = true;

    // if (!cylinder.current) { }
    // cylinder.current.rotation.y = startingOffset * Math.PI * 2
    // + (clock.getElapsedTime() / 30) * -speed;

    // cylinder.current.getWorldPosition(worldPosition);
    // const scale = (Math.max(10 - camera.position.distanceTo(worldPosition), 0)) ** 0.1;
    // cylinder.current.scale.set(scale, scale, scale);

    // const scale = (Math.cos(clock.getElapsedTime()) + 1 / 2) * 0.2 + 0.8;
    // cylinder.current.scale.set(scale, scale, scale);
  });

  return (
    <Cylinder
      args={[r, r - RADIUS_TAPER, RING_HEIGHT * 2, 64, 1, true]}
      position={[0, y, 0]}
      scale={[2, 1, 1]}
      rotation={[0, 0, 0]}
      ref={cylinder}
    >
      <meshStandardMaterial transparent attach="material" side={THREE.BackSide}>
        <canvasTexture
          attach="map"
          // @ts-ignore
          repeat={[repeats, 1]}
          image={canvas}
          premultiplyAlpha
          // @ts-ignore
          wrapS={THREE.RepeatWrapping}
          wrapT={THREE.RepeatWrapping}
          flipY={false}
          // @ts-ignore
          ref={texture}
          // eslint-disable-next-line no-param-reassign
          onUpdate={(s) => { s.needsUpdate = true; }}
          blending={SubtractiveBlending}
        />
      </meshStandardMaterial>
    </Cylinder>
  );
}

export function CodeRings() {
  // Watches font face and becomes true when its loaded
  const isFontLoaded = useFontFaceObserver([
    {
      family: 'Roboto Mono',
      weight: '200',
    },
  ]);

  // Spawn all the canvas textures that our rings will use.
  const canvases = useMemo(() => (
    new Array(N_RING_CANVASES).fill(null).map(() => (isFontLoaded ? createTextCanvas() : null))
  ), [isFontLoaded]);

  return (
    // Don't even try to draw until we have the dont we need.
    isFontLoaded ? (
      <>
        {/* Will draw the whole group rightside up along the y axis
        and then rotate it toward camera */}
        <group rotation={[Math.PI / 2, 0, 0]} position={[-1, 1, 3]}>
          {new Array(35).fill(null).map((_, index) => (
            <CodeRing
              y={index * (-4) * RING_HEIGHT}
              r={3 - index * 0.1}
              repeats={
                1 + (index < 15 ? 1 : 0) + (index < 25 ? 1 : 0)
              }
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              canvases={canvases}
            />
          ))}
        </group>
      </>
    ) : null
  );
}
