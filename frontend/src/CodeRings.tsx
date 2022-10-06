import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import useFontFaceObserver from 'use-font-face-observer';
import {
  LinearFilter,
  Mesh,
  MeshStandardMaterial,
  NearestFilter,
  Texture,
} from 'three';
import { useInterval } from 'usehooks-ts';
import {
  useSpring,
  animated,
  config,
} from '@react-spring/three';
import colors from './colors';
import { useSceneController } from './SceneController';
import { useBreakpoints } from './useBreakpoints';

/** Number of rings to be drawn */
const N_RINGS = 16;
/* height of each ring in world coordinate */
const RING_HEIGHT_LANDSCAPE = 0.02;
/* height of each ring in world coordinate */
const RING_HEIGHT_PORTRAIT = 0.06;
/* each ring is slightly narrower on top compared to bottom, creating a taper.
The difference in world coords */
const RADIUS_TAPER = 0.05;
/* number of canvas textures that can be pulled at random for a ring,
ie some are recycled for performance */
const N_RING_CANVASES = 1;
/** width of each canvas texture in pixels */
const CANVAS_WIDTH = 1146;
/** Font size of the text written on the canvas */
const FONT_SIZE = 12;
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
  'useOnMyDeath(()=>{ eraseBrowserHistoryOnAllDevices(); doItAgainJustToBeSure(); tripleCheck(); youKnowWhatMaybeJustIncinerateTheHardDrives(); }); ',
  'const debugInterval = setInterval(()=>{if(prompt(\'Program still working?\')==="nope") throw new Error("bug.");}, 100);',
  '<Burrito spicy={100}>{toppings.map((tProps:{name:string,spicy:number,isHotsauce:boolean,vegan:boolean})=>(<Topping {...(tprops)} key={name} />)}</Burrito>',
  'if(i%(3*(7*3+2))===0) return "nice"; if(i%3===0 && i%5===0) return "fizzbuzz"; if(i%3===0) return "fizz"; if(i%5===0) return "buzz";',
  // eslint-disable-next-line no-template-curly-in-string
  'const isEven = async (i:number) => {const res = await fetch(`https://iseven.com/api/numbers/${i}`); const {isEven} = await res.json(); return isEven; }',
].map((line) => line + ((new Array(TEXT_LINE_LENGTH - line.length)).fill('.').join('')));

/**
 * Creates a canvas that can be used as a ring texture.
 * The canvas writes a line of code from TEXT_LINES.
 * It animates to simulate someone typing another line of text on top
 */
function createTextCanvas(): HTMLCanvasElement | null {
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
  let i = Math.floor(Math.random() * TEXT_LINE_LENGTH);
  /* line of text we just wrote */
  let previousLine = chooseLine();
  /* line of text we are writing */
  let nextLine = chooseLine();

  /* the string to use to simulate the typer's carat */
  const caratString = '░▒▓██';

  const dark = false;
  // let dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  // window.matchMedia('(prefers-color-scheme: dark)')
  // .addEventListener('change', (e) => { dark = e.matches; });

  /* Draw the current state of the ascii animation onto our canvas */
  const redrawCanvas = () => {
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
    context.font = `${dark ? 400 : 200} ${FONT_SIZE}px 'Roboto Mono'`;
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.fillStyle = colors.blue;
    context.fillText(textToWrite, 0, canvas.height / 2);
  };

  // Draw now to start
  redrawCanvas();

  // Repeat to animate
  setInterval(() => {
    redrawCanvas();
  }, UPDATE_INTERVAL);

  return canvas;
}

const useRingHeight = () => {
  const breakpoints = useBreakpoints();
  const breakpoint = breakpoints.menu;
  return breakpoint ? RING_HEIGHT_LANDSCAPE : RING_HEIGHT_PORTRAIT;
};

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
  visible,
}:
{
  canvases: (HTMLCanvasElement | null)[],
  y: number,
  r: number,
  repeats: number,
  visible:boolean
}) {
  const canvas = useMemo(() => canvases[Math.floor(Math.random() * canvases.length)], [canvases]);

  const speed = useMemo(() => Math.random() * 0.5 + 0.5, []);
  const startingOffset = useMemo(() => Math.random(), []);

  const cylinder = useRef<Mesh>(null);

  const texture = useRef<Texture>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);

  const { scene } = useSceneController();

  useFrame(({
    clock,
    // camera
  }) => {
    if (!cylinder.current || !texture.current || !materialRef.current) return;

    // Rotate the texture slightly--must be done by the texture and not rotating the mesh itself
    // because of the irregular elliptical shape (the axis of the ellipses would turn!)
    texture.current.offset.x = startingOffset * CANVAS_WIDTH
     + (clock.getElapsedTime() / 60) * -speed;

    if (visible && materialRef.current.opacity < 1) {
      materialRef.current.opacity += 0.1;
    }
  });

  useInterval(() => {
    if (!texture.current) return;
    if (scene === 'menu' || scene === 'about') { texture.current.needsUpdate = true; }
  }, UPDATE_INTERVAL);

  const { scale } = useSpring({ scale: visible ? 1 : 0, config: config.wobbly });

  const ringHeight = useRingHeight();

  return (
    <animated.group scale={scale}>
      <Cylinder
        args={[r, r - RADIUS_TAPER, ringHeight * 2, 64, 1, true]}
        position={[0, y, 0]}
        scale={[2, 1, 1]}
        rotation={[0, 0, 0]}
        ref={cylinder}
      >
        <meshStandardMaterial
          transparent
          attach="material"
          side={THREE.BackSide}
          ref={materialRef}
          opacity={0}
        >
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
          // onUpdate={(s) => { s.needsUpdate = true; }}
            minFilter={LinearFilter}
            magFilter={NearestFilter}
          />
        </meshStandardMaterial>
      </Cylinder>
    </animated.group>
  );
}

export function CodeRings({ visible }: { visible: boolean }) {
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

  const [nVisibleRings, setNVisibleRings] = useState(0);

  useInterval(() => {
    if (visible && nVisibleRings < N_RINGS) {
      setNVisibleRings(nVisibleRings + 1);
    }
  }, 50);

  const ringHeight = useRingHeight();

  return (
    // Don't even try to draw until we have the dont we need.
    isFontLoaded ? (
      <>
        {/* Will draw the whole group rightside up along the y axis
        and then rotate it toward camera */}
        <group rotation={[Math.PI / 2, 0, 0]} position={[-1, 1, 2]} scale={1.8}>
          {new Array(N_RINGS).fill(null).map((_, index) => (
            <CodeRing
              y={index * (-4) * ringHeight}
              r={3 - index * 0.1}
              repeats={
                Math.max(4 - (Math.floor(index / 5)), 1)
              }
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              canvases={canvases}
              visible={index > N_RINGS - nVisibleRings}
            />
          ))}
        </group>
      </>
    ) : null
  );
}
