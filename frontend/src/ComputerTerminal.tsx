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
import { useTrueAfterDelay } from './useTrueAfterDelay';
// import { fontUrls } from './typography';

export const TerminalWindow = ({
  children, title, className = '', delay = 300, color = 'cyan',
}:{
  children:ReactNode, title:string, className?:string, delay?:number, color?:string
}) => {
  const showWindow = useTrueAfterDelay(delay);
  return (
    <div
      className={` ${className}
        ${showWindow ? '' : 'scale-0'}
        transition-transform ease-[steps(8)]
        duration-500
      `}
    >
      <div
        className={`absolute top-0 left-0 right-0 bottom-0
          bg-black translate-x-[-1px] translate-y-[-1px]
        `}
      />
      <div
        className="border-[0.3px] border-black overflow-scroll text-black relative w-full h-full"
        style={{
          backgroundColor: color,
        }}
      >
        <div className="border-b-[0.3px] border-black grid place-items-center relative">
          {title}
          <div className="border-black border-[0.3px] h-[2px] w-[2px] absolute right-[1px]" />
        </div>
        <div className="relative h-full">
          <div className="p-[4px] h-full">{showWindow && children}</div>
        </div>
      </div>
    </div>
  );
};

export const TerminalButton = ({
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
        ${show ? '' : 'scale-0'}
        transition-transform ease-[steps(5)] duration-300
      `}
    >
      {shadow && <div className="absolute top-0 left-0 right-0 bottom-0 bg-black translate-x-[-0.5px] translate-y-[-0.5px]" />}
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
          border-[0.5px] border-[var(--color)] py-[2px] px-[4px]
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
  if (slide === 'intro') {
    return (
      <>
        <Typewriter key={slide} className="p-[5px]">
          {`I'm Bryant! (he/him)
  I build web experiences`}
        </Typewriter>
        <div className="grid place-items-center absolute bottom-[15px] w-full">
          <TerminalButton
            onClick={() => {
              setScene('about');
              setSlide('design');
            }}
            delay={2000}
            color="white"
            bgColor="blue"
            shadow={false}
          >
            ABOUT_BRYANT
          </TerminalButton>
        </div>
      </>
    );
  }

  if (slide === 'design') {
    return (
      <>
        <TerminalWindow
          title="ABOUT_BRYANT.exe"
          className="absolute top-[10px] left-[10px] w-[73%] h-[80%] "
          delay={1000}
          key="about-bryant"
        >
          <Typewriter>
            {`I partner with awesome designers
  to build their wildest dreams.

  And I'm happiest
when the finished product
  makes people say, "woah."`}
          </Typewriter>
          <div className="absolute bottom-[10px] grid place-items-center w-full">
            <TerminalButton
              onClick={() => {
                setSlide('skills');
              }}
              delay={6000}
              color="black"
              bgColor="pink"
            >
              MY_SKILLS
            </TerminalButton>
          </div>
        </TerminalWindow>
        <TerminalWindow
          delay={200}
          title="SELF_CONCEPT.jpg"
          color="lime"
          className="absolute bottom-[11px] right-[10px] w-[40px] h-[40px]"
          key="self-portrait"
        >
          <Image src="/images/self-portrait.jpg" layout="fill" className="border-[0.5px] border-black" />
        </TerminalWindow>
      </>
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
            <TerminalButton
              onClick={() => {
                setScene('menu');
                setSlide('intro');
              }}
              delay={5000}
              color="black"
              bgColor="yellow"
            >
              HOME
            </TerminalButton>
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

  const position:CoordArray = [-1, 0.7, 2];
  const planeSizeInWorldUnits = [3.4, 2];
  const windowSize = useWindowSize();
  const terminalDivRef = useRef<HTMLDivElement>(null);
  useFrame(({ camera }) => {
    if (!terminalDivRef.current) return;
    const perspectiveCamera = camera as PerspectiveCamera;
    const vFOV = MathUtils.degToRad(perspectiveCamera.fov); // convert vertical fov to radians

    const dist = Math.abs(perspectiveCamera.position.z - position[2]);
    const worldCameraHeight = 2 * Math.tan(vFOV / 2) * dist; // visible height
    const worldCameraWidth = worldCameraHeight * perspectiveCamera.aspect; // visible width
    const planeWidthInPixels = (planeSizeInWorldUnits[0] / worldCameraWidth) * windowSize.width;
    const planeHeightInPixels = (planeSizeInWorldUnits[1] / worldCameraHeight) * windowSize.height;

    const width = Math.min(planeWidthInPixels, windowSize.width * 0.9);
    const height = Math.min(planeHeightInPixels, windowSize.height * 0.9);
    terminalDivRef.current.style.setProperty('--terminal-width', `${width}px`);
    terminalDivRef.current.style.setProperty('--terminal-height', `${height}px`);
  });

  return (
    <group
      position={position}
      rotation={[0, 0, Math.PI / 40]}
    >
      <mesh renderOrder={2}>
        <boxGeometry args={[...planeSizeInWorldUnits, 0.1] as CoordArray} />
        <meshStandardMaterial color="red" transparent opacity={0.5} depthTest={false} />
      </mesh>
      <Html>
        <CustomCursorContext.Provider value={customCursor}>
          <CustomCursorHover cursor="terminal">
            <div
              className="
                bg-[green] border-[red] border-2
                overflow-hidden
                rotate-[-5deg] -translate-x-1/2 -translate-y-1/2
                w-[var(--terminal-width)] h-[var(--terminal-height)]
                "
              style={{
                fontSize: 'calc(var(--terminal-width)/20)',
              }}
              ref={terminalDivRef}
            >
              <div className="">
                <Slides slide={slide} setSlide={setSlide} setScene={setScene} />
              </div>
            </div>
          </CustomCursorHover>
        </CustomCursorContext.Provider>
      </Html>
    </group>
  );
}
