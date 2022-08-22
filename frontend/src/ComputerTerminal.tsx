import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import Image from 'next/image';
import React, { ReactNode, useRef, useState } from 'react';
import { MathUtils, PerspectiveCamera } from 'three';
import { useWindowSize } from 'usehooks-ts';
import { CoordArray } from './CoordArray';
import { CustomCursorContext, CustomCursorHover, useCustomCursor } from './CustomCursor';
import { SceneName, useSceneController } from './SceneController';
import { Typewriter } from './Typewriter';
import { useBreakpoints } from './useBreakpoints';
import { useTrueAfterDelay } from './useTrueAfterDelay';
// import { fontUrls } from './typography';

export const TerminalWindow = ({
  children, title, className = '', delay = 300, color = 'cyan', topColor = 'lime',
}:{
  children:ReactNode,
  title:string,
  className?:string,
  delay?:number,
  color?:string,
  topColor?:string
}) => {
  const showWindow = useTrueAfterDelay(delay);
  return (
    <div
      className={` relative
        ${showWindow ? '' : 'scale-0'}
        transition-transform ease-[steps(8)]
        duration-500
        font-mono
        text-[max(16px,1em)]
        ${className}
      `}
    >
      <div
        className={`absolute top-0 left-0 right-0 bottom-0
          bg-black translate-x-[-0.2em] translate-y-[-0.2em]
        `}
      />
      <div
        className="border-[2px] border-black overflow-hidden text-black relative w-full h-full"
        style={{
          backgroundColor: color,
        }}
      >
        <div
          className="border-b-[2px] border-black grid place-items-center relative"
          style={{
            backgroundColor: topColor,
          }}
        >
          {title}
          <div className="border-black border-[2px] h-[0.75em] w-[0.75em] absolute right-[0.5em]" />
        </div>
        <div className="relative h-[calc(100%-0.75em)]">
          <div className="p-[1em] h-full">{showWindow && children}</div>
        </div>
      </div>
    </div>
  );
};
export const TerminalWindowButton = ({
  onClick, children, className = '', delay = 300, color, bgColor, shadow = true,
}:{
  onClick: ()=>void,
  children: ReactNode,
  className?: string,
  delay?:number,
  color:string,
  bgColor:string,
  shadow?:boolean
}) => {
  const show = useTrueAfterDelay(delay);
  return (
    <div
      className={`relative
        ${show ? '' : 'scale-0 opacity-0'}
        transition-transform ease-[steps(5)] duration-300
      `}
    >
      {shadow && <div className="absolute top-0 left-0 right-0 bottom-0 bg-black translate-x-[-0.15em] translate-y-[-0.15em]" />}
      <button
        type="button"
        style={{
          // @ts-ignore
          '--color': color,
          '--bgColor': bgColor,
          backgroundColor: 'var(--bgColor)',
          color: 'var(--color)',
        }}
        className={`
          border-[2px] border-[var(--color)] py-[0.5em] px-[1em]
          relative
          ${className}
        `}
        onClick={onClick}
      >
        {children}
      </button>

    </div>
  );
};

export const TerminalButton = ({
  onClick, children, className = '', delay = 300,
}:{
  onClick: ()=>void,
  children: ReactNode,
  className?: string,
  delay?:number,
}) => {
  const show = useTrueAfterDelay(delay);
  return (
    <div
      className={`relative
        ${show ? '' : 'scale-0'}
        transition-transform ease-[steps(5)] duration-400
      `}
    >
      <button
        type="button"
        className={`
          border-[2px] border-white py-[0.5em] px-[0.5em] text-white
          hover:bg-white
          hover:text-blue
          relative
          ${className}
        `}
        onClick={onClick}
      >
        {children}
      </button>

    </div>
  );
};

type SlideName = 'intro' | 'design' | 'skills'

export const Slides = ({
  slide, setScene, setSlide,
}:{
  slide:SlideName,
  setScene:(_scene:SceneName)=>void,
  setSlide:(_slide:SlideName)=>void
}) => {
  const breakpoints = useBreakpoints();
  if (slide === 'intro') {
    return (
      <div className="p-[1em] font-mono text-white text-[2em]">
        <Typewriter delay={1000} hideCaratAtEnd>
          {'I\'m Bryant! (he/him)'}
        </Typewriter>
        <Typewriter delay={1500}>
          I build web experiences
        </Typewriter>
        <div className="grid place-items-center mt-[2em]">
          <TerminalButton
            onClick={() => {
              setScene('about');
              setSlide('design');
            }}
            delay={2500}
          >
            ABOUT_BRYANT
          </TerminalButton>
        </div>
      </div>
    );
  }

  if (slide === 'design') {
    return (
      <div
        className={`
          grid h-full
          ${breakpoints.about ? 'grid-cols-2 ' : ''}
        `}
      >
        <TerminalWindow
          title="ABOUT_BRYANT.exe"
          className="relative max-w-[20em] self-baseline m-[1em]"
          delay={1000}
          topColor="violet"
        >
          <Typewriter className="" hideCaratAtEnd key="wildest-dreams">
            I help awesome designers build their wildest dreams.
          </Typewriter>

          <Typewriter className="mt-[1em]" delay={2500} key="together">
            {'Together, we\'ll make your client\'s project stand out from the crowd–and have users saying, "woah."'}
          </Typewriter>
          <div className="grid place-items-center mt-[2em]">
            <TerminalWindowButton
              onClick={() => {
                setSlide('skills');
              }}
              delay={5500}
              color="black"
              bgColor="pink"
            >
              Tell me more!
            </TerminalWindowButton>
          </div>
        </TerminalWindow>
        <TerminalWindow
          delay={200}
          title="SELF_CONCEPT.jpg"
          color="lime"
          className={`
            ${breakpoints.about ? 'w-[17em] h-[15em]' : 'w-[14em] h-[9em]'}
            self-end justify-self-end
          `}
        >
          <Image
            src="/images/self-portrait.jpg"
            layout="fill"
            objectFit="cover"
            className="border-[0.5px] border-black"
          />
        </TerminalWindow>
        <div className={`${breakpoints.about ? 'absolute top-0 right-0' : ''}`}>
          <TerminalButton
            onClick={() => {
              setScene('menu');
              setSlide('intro');
            }}
            className="font-mono text-[14px] m-[1em]"
          >
            BACK_TO_MENU
          </TerminalButton>
        </div>
      </div>
    );
  }

  if (slide === 'skills') {
    return (
      <>
        <TerminalWindow
          title="BRYANT_SKILLS.exe"
          color="lime"
          className="absolute top-[4px] left-[4px] w-[85%] h-[65%] "
          delay={500}
          key="skills"
        >
          <Typewriter>
            {`I am a full stack developer who
 specializes in high-concept creative
    front-ends.
  But most of all I LOVE a challenge.`}
          </Typewriter>
          <div className="absolute bottom-[10px] grid place-items-center w-full">
            <TerminalWindowButton
              onClick={() => {
                setScene('menu');
                setSlide('intro');
              }}
              delay={5000}
              color="black"
              bgColor="yellow"
            >
              HOME
            </TerminalWindowButton>
          </div>
        </TerminalWindow>
        <TerminalWindow
          delay={800}
          title="MY_PUPPY_HAILEY.jpg"
          color="cyan"
          className="absolute bottom-[2px] left-[2px] w-[40px] h-[40px]"
          key="puppy"
        >
          <Image src="/images/hailey.jpg" layout="fill" className="border-[0.5px] border-black" />
        </TerminalWindow>
        <TerminalWindow
          delay={6100}
          title="TECH_I_LOVE.exe"
          color="pink"
          className="absolute top-[0px] right-[2px] w-[42px] h-[77px]"
          key="list-of-tech"
        >
          <Typewriter className="" showCarat={false}>
            {`• React
• NextJS
• CSS
• Tailwind
• WebGL
• Three.js/R3F
• GLSL
• Node
• Sanity
• webRTC
• socketIO`}
          </Typewriter>
        </TerminalWindow>
      </>
    );
  }

  return null;
};

export function ComputerTerminal() {
  const customCursor = useCustomCursor();
  const { setScene } = useSceneController();

  const [slide, setSlide] = useState<SlideName>('intro');

  // We cant use drei/HTML transform property to manage the size of this div
  // Why? Because a close camera will scale it up so much
  // On Safari (which kinda isnt great for subpixel rendering things)
  // it will be blurry
  // Instead, we do trigonometry to get the exact pixel size

  // Position and size of plane that our div should cover as closely as possible
  const position:CoordArray = [-1, 0.7, 2];
  const planeSizeInWorldUnits = [3.4, 2];

  // Canvas is full window
  const windowSize = useWindowSize();

  // The div we will style
  const terminalDivRef = useRef<HTMLDivElement>(null);

  useFrame(({ camera }) => {
    if (!terminalDivRef.current) return;

    // get FOV in radians
    const perspectiveCamera = camera as PerspectiveCamera;
    const vFOV = MathUtils.degToRad(perspectiveCamera.fov);

    /** Distance of plane from camera */
    const dist = Math.abs(perspectiveCamera.position.z - position[2]);

    /** Height of full plane in view of camera at this dist */
    const worldCameraHeight = 2 * Math.tan(vFOV / 2) * dist;

    /** Width of full plane in view of camera at this dist */
    const worldCameraWidth = worldCameraHeight * perspectiveCamera.aspect;

    /** Width of our plane in screen pixels */
    const planeWidthInPixels = (planeSizeInWorldUnits[0] / worldCameraWidth) * windowSize.width;

    /** Height of our plane in screen pixels */
    const planeHeightInPixels = (planeSizeInWorldUnits[1] / worldCameraHeight) * windowSize.height;

    // We can help out with responsive behavior here by limiting this
    // div to be always smaller than the screen
    const width = Math.min(planeWidthInPixels, windowSize.width * 0.9);
    const height = Math.min(planeHeightInPixels, windowSize.height * 0.8);

    // Apply sizing to our terminal div via CSS vars
    terminalDivRef.current.style.setProperty('--terminal-width', `${width}px`);
    terminalDivRef.current.style.setProperty('--terminal-height', `${height}px`);
  });

  return (
    <group
      position={position}
      rotation={[0, 0, Math.PI / 40]}
    >
      {/* <mesh renderOrder={2}>
        <boxGeometry args={[...planeSizeInWorldUnits, 0.1] as CoordArray} />
        <meshStandardMaterial color="red" transparent opacity={0.5} depthTest={false} />
      </mesh> */}
      <Html>
        <CustomCursorContext.Provider value={customCursor}>
          <CustomCursorHover cursor="terminal">
            <div
              className="
               border-[red] border-[1px]
                overflow-hidden
                rotate-[-5deg] -translate-x-1/2 -translate-y-1/2
                w-[var(--terminal-width)] h-[var(--terminal-height)]
                "
              style={{
                fontSize: 'calc(var(--terminal-width)/40)',
              }}
              ref={terminalDivRef}
            >
              <Slides slide={slide} setSlide={setSlide} setScene={setScene} key={slide} />
            </div>
          </CustomCursorHover>
        </CustomCursorContext.Provider>
      </Html>
    </group>
  );
}
