import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import Image from 'next/image';
import React, {
  ReactNode, useRef, useState,
} from 'react';
import { MathUtils, PerspectiveCamera } from 'three';
import { useWindowSize } from 'usehooks-ts';
import { QueryClientProvider } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CoordArray } from './CoordArray';
import { CustomCursorContext, CustomCursorHover, useCustomCursor } from './CustomCursor';
// import { useRandomGif } from './useRandomGif';
import { SceneName, useSceneController } from './SceneController';
import { Typewriter, TIME_PER_CHAR } from './Typewriter';
import { useBreakpoints } from './useBreakpoints';
import { useTrueAfterDelay } from './useTrueAfterDelay';
import { queryClient } from './queryClient';
// import { fontUrls } from './typography';

export const TerminalWindow = ({
  children, title, className = '', delay = 300, color = 'cyan', topColor = 'lime',
  wrapperClassName = '',
}:{
  children:ReactNode,
  title:string|null,
  className?:string,
  delay?:number,
  color?:string,
  topColor?:string
  wrapperClassName?:string
}) => {
  const showWindow = useTrueAfterDelay(delay);
  const breakpoints = useBreakpoints();
  const [flipped, setFlipped] = useState(false);
  return (
    <motion.div
      drag
      // whileTap={{ scale: 0.9 }}
      // dragSnapToOrigin
      dragMomentum={false}
      className={`relative  text-black ${className}`}
    >
      {/* eslint-disable jsx-a11y/click-events-have-key-events  */}
      {/* eslint-disable jsx-a11y/no-static-element-interactions */}
      <div
        className={`
        ${showWindow ? '' : 'scale-0'}
        transition-transform ease-[steps(8)]
        duration-500
        font-mono
        min-h-full

        border-[2px] border-black overflow-hidden relative
        flex flex-col
        ${breakpoints.about ? 'text-[1em]' : 'text-[max(1em,16px)]'}
        ${flipped ? 'rotate-180' : ''}
      `}
        style={{
          boxShadow: '-0.2em -0.2em black',
        }}
        onClick={() => {
          if (flipped) setFlipped(false);
        }}
      >
        {/* eslint-enable jsx-a11y/click-events-have-key-events  */}
        {/* eslint-enable jsx-a11y/no-static-element-interactions */}
        {title && (
        <div
          className="border-b-[2px] border-black grid place-items-center relative"
          style={{
            backgroundColor: topColor,
          }}
        >
          {title}
          <button
            className="border-black border-[2px] h-[0.75em] w-[0.75em] absolute right-[0.5em]"
            aria-label="silly"
            type="button"
            onClick={() => {
              setFlipped(!flipped);
            }}
          />
        </div>
        )}
        <div
          className={`flex-grow relative ${wrapperClassName}`}
          style={{
            backgroundColor: color,
          }}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export const TerminalWindowButton = ({
  onClick, children, className = '', delay = 300, color, bgColor,
}:{
  onClick: ()=>void,
  children: ReactNode,
  className?: string,
  delay?:number,
  color:string,
  bgColor:string
}) => {
  const show = useTrueAfterDelay(delay);
  return (
    <button
      type="button"
      style={{
        // @ts-ignore
        '--color': color,
        '--bgColor': bgColor,
        color: 'var(--color)',
      }}
      className={`
        relative
        ${show ? '' : 'scale-0 opacity-0'}
        transition-transform ease-[steps(5)] duration-300
        group
        ${className}
      `}
      onClick={onClick}
    >
      <div
        className="absolute top-0 left-0 w-full h-full bg-black group-active:scale-75"
      />
      <div
        className="border-[2px] border-[var(--color)]
        py-[0.5em] px-[1em] pointer-events-none
        translate-x-[0.15em] translate-y-[0.15em]
        group-hover:translate-x-0
        group-hover:translate-y-0
        group-active:scale-75
        "
        style={{
          backgroundColor: 'var(--bgColor)',
        }}
      >
        {children}
      </div>
    </button>
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

type TerminalWindowProps = React.ComponentProps<typeof TerminalWindow>
const TextWindow = ({
  texts, buttonColor = 'cyan',
  buttonText = 'button!', onClick = () => {},
  textMargin = '1em', noButton = false,
  ...terminalWindowProps
}: {
  texts: string[],
  buttonColor?: string,
  buttonText?: string|null,
  textMargin?: string,
  noButton?: boolean,
  onClick?: ()=>void
} & Omit<TerminalWindowProps, 'children'>) => {
  const pauseBetween = 500;
  const startDelay = 500;
  const delays = [startDelay, ...texts.map((text, i, array) => {
    const charCountSoFar = array.slice(0, i + 1).reduce((acc, cur) => acc + cur.length, 0);
    return startDelay + charCountSoFar * TIME_PER_CHAR + pauseBetween * (i + 1);
  })];
  return (
    <TerminalWindow {...terminalWindowProps}>
      {texts.map((text, i, array) => (
        <div
          style={{ marginTop: i !== 0 ? textMargin : 0 }}
        >
          <Typewriter
            key={text}
            delay={delays[i]}
            hideCaratAtEnd={i !== array.length - 1}
          >
            {text}
          </Typewriter>
        </div>
      ))}
      {!noButton && (
      <div className="grid place-items-center mt-[2em]">
        <TerminalWindowButton
          onClick={onClick}
          delay={delays[delays.length - 1]}
          color="black"
          bgColor={buttonColor}
        >
          {buttonText}
        </TerminalWindowButton>
      </div>
      )}
    </TerminalWindow>
  );
};

const SkillSlideshowWindow = ({
  texts,
  buttonColor = 'cyan',
  ...terminalWindowProps
}: {
  texts: string[],
  buttonColor: string,
  onClick?: ()=>void
} & Omit<TerminalWindowProps, 'children'>) => {
  const [textIndex, setTextIndex] = useState(0);

  // const { gif, newGif } = useRandomGif();
  const nextText = () => {
    // newGif();
    setTextIndex((index) => (index + 1) % texts.length);
  };
  const prevText = () => {
    // newGif();
    setTextIndex((index) => (index - 1 + texts.length) % texts.length);
  };

  const text = texts[textIndex];

  return (
    <TerminalWindow {...terminalWindowProps}>
      {/* <div
        className="absolute top-0 left-0 w-full h-full bg-center bg-cover"
        style={{
          backgroundImage: `url(${gif?.images.downsized_large.url})`,
        }}
      /> */}
      <Typewriter
        delay={500}
        className="bg-white bg-opacity-90" // min-h-[7em]
        timePerChar={10}
      >
        {text}
      </Typewriter>
      <div className="flex justify-between mt-[2em]">
        <TerminalWindowButton
          onClick={prevText}
          delay={500}
          color="black"
          bgColor={buttonColor}
        >
          &lt; PREV
        </TerminalWindowButton>
        <TerminalWindowButton
          onClick={nextText}
          delay={500}
          color="black"
          bgColor={buttonColor}
        >
          NEXT SKILL &gt;
        </TerminalWindowButton>
      </div>
    </TerminalWindow>
  );
};

export const ImageWindow = ({
  srcs, alts, positions, ...terminalWindowProps
}: {
  srcs: string[],
  alts: string[],
  positions: (string | number)[]
} & Omit<TerminalWindowProps, 'children'>) => (
  <TerminalWindow
    {...terminalWindowProps}
  >
    <Image src={srcs[0]} layout="fill" objectFit="cover" objectPosition={positions[0]} alt={alts[0]} className="pointer-events-none" />
  </TerminalWindow>
);

type SlideName = 'intro' | 'mission' | 'process' | 'skills'

export const Slides = ({
  slide, setScene, setSlide,
}:{
  slide:SlideName,
  setScene:(_scene:SceneName)=>void,
  setSlide:(_slide:SlideName)=>void
}) => {
  const breakpoints = useBreakpoints();
  if (slide === 'intro') {
    const text1Delay = 1000;
    const text2Delay = text1Delay + 22 * TIME_PER_CHAR + 300;
    const buttonDelay = text2Delay + 23 * TIME_PER_CHAR + 300;
    return (
      <div className="p-[1em] font-mono text-white text-[2em]">
        <Typewriter delay={text1Delay} hideCaratAtEnd>
          {'I\'m Bryant! (he/him)'}
        </Typewriter>
        <Typewriter delay={text2Delay}>
          I build web experiences
        </Typewriter>
        <div className="grid place-items-center mt-[2em]">
          <TerminalButton
            onClick={() => {
              setScene('about');
              setSlide('mission');
            }}
            delay={buttonDelay}
          >
            ABOUT_BRYANT
          </TerminalButton>
        </div>
      </div>
    );
  }

  if (slide === 'mission') {
    return (
      <div
        className={`
          grid h-full
          ${breakpoints.about ? 'grid-cols-[65%_1fr]' : 'grid-rows-[max-content_1fr]'}
        `}
      >
        <TextWindow
          title="BRYANT_SMITH.exe"
          className={`
            relative self-baseline
            ${breakpoints.about ? '' : `
              w-[90%] max-w-[30em] justify-self-start
            `}
          `}
          delay={1000}
          topColor="violet"
          wrapperClassName="p-[1em] pb-[3em]"
          texts={[
            'I help awesome designers (like you) build their wildest dreams.',
            'Together, let\'s make something that stands out from the crowd––',
            'and have users saying, "woah."',
          ]}
          buttonColor="pink"
          buttonText="tell me more!"
          onClick={() => {
            setSlide('process');
          }}
        />
        <ImageWindow
          delay={300}
          title="SELF_CONCEPT.jpg"
          positions={['center']}
          color="lime"
          className={`
            ${breakpoints.about ? `
              self-end min-h-[12em] h-[13em] ml-[-1em]
            ` : `
              w-[90%] max-w-[30em]
              justify-self-end  mt-[-1.5em]
            `}
          `}
          srcs={['/images/self-portrait.jpg']}
          alts={['Crayon illustration of Bryant from decades ago.']}
        />
      </div>
    );
  }

  if (slide === 'process') {
    return (
      <div
        className={`
          grid h-full
          ${breakpoints.about ? 'grid-cols-[1fr_65%]' : 'grid-rows-[1fr_max-content]'}
        `}
      >
        <ImageWindow
          delay={100}
          title="MY_DOG_HAILEY.jpg"
          topColor="cyan"
          positions={['60% 15%']}
          className={`
            ${breakpoints.about ? `
              self-end h-[18em] mr-[-2em] min-w-[12em] mb-[1em]
            ` : `
              w-[90%] max-w-[25em]
              justify-self-end mb-[-2em]
            `}
          `}
          srcs={['/images/hailey2.jpg']}
          alts={['My dog Hailey smiling her crazy smile.']}
        />

        <TextWindow
          title="MY_PROCESS.exe"
          className={`
            relative self-baseline
            ${breakpoints.about ? '' : `
              w-[90%] min-w-[300px] max-w-[30em] justify-self-start
            `}
          `}
          delay={500}
          topColor="yellow"
          color="lime"
          wrapperClassName="p-[1em]"
          texts={[
            'I\'m a full stack web developer––and a creative collaborator. Consider me a force multiplier for your talents.',
            'I help brainstorm, map tech options, maximize awesomeness, & minimize budget.',
            'Already have a vision? I\'ll realize it down to the pixel.  Searching? Let\'s find it together.',
          ]}
          buttonColor="violet"
          buttonText="skills tho?"
          onClick={() => {
            setSlide('skills');
          }}
        />
      </div>
    );
  }

  if (slide === 'skills') {
    return (
      <div
        className={`
          grid h-full relative
          ${breakpoints.about ? 'grid-cols-[65%_1fr]' : 'grid-rows-[1fr_max-content]'}
        `}
      >

        <SkillSlideshowWindow
          title="SKILLS.exe"
          className={`
            relative self-start
            ${breakpoints.about ? '' : `
              w-full justify-self-start
            `}
          `}
          delay={100}
          topColor="yellow"
          color="white"
          buttonColor="cyan"
          wrapperClassName="p-[1em]"
          texts={[
            '7 years working w/ best-in-class designers building award-winning projects',
            'exceptional at visual styling and attention to detail.  whatever tool it takes: CSS, SCSS, PostCSS, Tailwind, canvas, Three.js, Lottie, WebGL, etc.––even working with video/image assets directly in Adobe',
            'strong command of design systems––excellent at interpreting mockups in any form (adobe, figma, back of coffee shop napkin) and working with minimal OR maximal direction',
            'expert communication & project management––leading up, down, and laterally––transforming chaos into launches',
            // 'specializes in creative, multimedia, & interactive experiences',
            'capable of owning tech decisions from the ground up, but also onboards lightning fast to be a chameleon on any team',
            'mad scientist at heart who is happiest building something new and challenging––but never at the cost of first-class UX',
            'table stakes: always accessible, functional, responsive, compatible, performant and search engine optimized',
            'if you made it this far, reach out. even if you don\'t have a project in mind, I\'d love to geek out with you.',
          ]}
        />
        <TextWindow
          title={null}
          className={`
            relative self-end
            text-white
            ${breakpoints.about ? 'mb-[1em]' : `
              w-full justify-self-start
            `}
          `}
          delay={100}
          color="#222"
          wrapperClassName="p-[0.5em]"
          textMargin="0"
          texts={[
            '> CURRENT_FAVE_TECH:',
            'React, NextJS, Typescript, Tailwind, CSS/PostCSS, Three.js/R3f, WebGL, GLSL/Shaders, Sanity, Node, Figma, Adobe AE/PS/AI/ID',
          ]}
          noButton
        />
      </div>
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

  const breakpoints = useBreakpoints();

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
        <QueryClientProvider client={queryClient}>
          <CustomCursorContext.Provider value={customCursor}>
            <CustomCursorHover cursor="terminal">
              <div
                className={`
                ${breakpoints.about ? 'rotate-[-5deg]' : 'rotate-[-3deg]'}
                 -translate-x-1/2 -translate-y-1/2
                w-[var(--terminal-width)] h-[var(--terminal-height)]
              `}
                style={{
                  fontSize: 'calc(var(--terminal-width)/40)',
                }}
                ref={terminalDivRef}
              >
                <Slides slide={slide} setSlide={setSlide} setScene={setScene} key={slide} />
              </div>
            </CustomCursorHover>
          </CustomCursorContext.Provider>
        </QueryClientProvider>
      </Html>
    </group>
  );
}
