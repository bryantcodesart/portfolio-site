import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import Image from 'next/image';
import React, {
  ReactNode, useRef, useState,
} from 'react';
import { MathUtils, PerspectiveCamera } from 'three';
import { useWindowSize } from 'usehooks-ts';
import { CoordArray } from './CoordArray';
import { CustomCursorHover } from './CustomCursor';
import { SceneName, useSceneController } from './SceneController';
import { Typewriter, TIME_PER_CHAR } from './Typewriter';
import { useBreakpoints } from './useBreakpoints';
import { useTrueAfterDelay } from './useTrueAfterDelay';
import { SkillArtWindow } from './SkillArtWindow';
import { TerminalWindow } from './TerminalWindow';
import { TerminalWindowProps } from './TerminalWindowProps';

export const TerminalWindowButton = ({
  onClick, children, className = '', delay = 300, color = 'black', bgColor = 'white', disabled = false,
}:{
  onClick?: ()=>void,
  children: ReactNode,
  className?: string,
  delay?:number,
  color?:string,
  bgColor?:string
  disabled?:boolean

}) => {
  const show = useTrueAfterDelay(delay);

  return (
    <button
      type="button"
      style={{
        // @ts-ignore
        '--color': disabled ? '#444' : color,
        '--bgColor': disabled ? '#888' : bgColor,
        color: 'var(--color)',
      }}
      className={`
        relative
        ${show ? '' : 'scale-0 opacity-0'}
        transition-transform ease-[steps(5)] duration-300
        group
        ${className}
      `}
      onClick={disabled ? () => {} : onClick}
      disabled={disabled}
    >
      <div
        className="absolute top-0 left-0 w-full h-full bg-black group-active:scale-75"
      />
      <div
        className={`border-[2px] border-[var(--color)]
          py-[0.5em] px-[1em] pointer-events-none
          relative
          ${disabled ? '' : `
            translate-x-[0.15em] translate-y-[0.15em]
            group-hover:translate-x-0
            group-hover:translate-y-0
            group-active:scale-75
          `}
        `}
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
        pointer-events-auto
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

const TextWindow = ({
  texts, buttonColor = 'cyan',
  buttonText = 'button!', onClick = () => {},
  textMargin = '1em', noButton = false, disabled = false,
  icon = null,
  ...terminalWindowProps
}: {
  texts: string[],
  buttonColor?: string,
  buttonText?: string|null,
  textMargin?: string,
  noButton?: boolean,
  disabled?: boolean,
  icon?:string|null
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {icon && <img src={icon} alt="fake computer icon" className="w-[20%] h-auto m-auto mb-[1em] pointer-events-none" />}
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
          disabled={disabled}
        >
          {buttonText}
        </TerminalWindowButton>
      </div>
      )}
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
    const text1Delay = 800;
    const text2Delay = text1Delay + 22 * TIME_PER_CHAR + 100;
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
              // setSlide('skills');
              setSlide('mission');
            }}
            delay={buttonDelay}
            className="text-[max(1.5em,16px)]"
          >
            ABOUT_BRYANT
          </TerminalButton>
        </div>
      </div>
    );
  }

  return (
    <>
      {(slide === 'mission' || slide === 'process' || slide === 'skills') && (
        <div
          className={`
          grid h-full
          pointer-events-none
          absolute top-0 left-0 w-full
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
            transition-transform duration-[1s]
            ${slide === 'mission' ? '' : 'translate-x-[-80%] translate-y-[-40%]'}
          `}
            delay={1000}
            topColor="violet"
            wrapperClassName="p-[1em]"
            texts={[
              'I help awesome designers (like you) build their wildest dreams.',
              'Together, let\'s create something that stands out––and has users saying, "woah."',
            ]}
            icon="/images/computer-icon.svg"
            buttonColor="pink"
            buttonText="tell me more!"
            onClick={() => {
              setSlide('process');
            }}
            disabled={slide !== 'mission'}
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

            transition-transform duration-[1s]
            ${slide === 'mission' ? '' : 'translate-x-[20%] translate-y-[70%]'}
          `}
            srcs={['/images/self-portrait.jpg']}
            alts={['Crayon illustration of Bryant from decades ago.']}
          />
        </div>
      )}
      {(slide === 'process' || slide === 'skills') && (
      <div
        className={`
          absolute top-0 left-0 w-full h-full
          grid
          pointer-events-none
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
              w-[90%] max-w-[28em]
              justify-self-end mb-[-12em]
            `}
            transition-transform duration-[1s]
            ${slide === 'process' ? '' : 'translate-x-[-70%] translate-y-[-10%]'}
          `}
          srcs={['/images/hailey2.jpg']}
          alts={['My dog Hailey smiling her crazy smile.']}
        />

        <TextWindow
          title={null}
          className={`
            relative self-baseline
            ${breakpoints.about ? '' : `
              w-[90%] min-w-[300px] max-w-[30em] justify-self-start
            `}
            transition-transform duration-[1s]
            ${slide === 'process' ? '' : 'translate-x-[43%] translate-y-[-80%]'}
          `}
          delay={500}
          icon="/images/alert-icon.svg"
          topColor="yellow"
          color="lime"
          wrapperClassName="p-[1em]"
          texts={[
            'I\'m a fullstack web dev, a creative, and a partner you can trust with your project.',
            'Already have a vision? I\'ll realize it down to the pixel.  Searching? Let\'s find it together.',
          ]}
          buttonColor="violet"
          buttonText="skills tho?"
          disabled={slide !== 'process'}
          onClick={() => {
            setSlide('skills');
          }}
        />
      </div>
      )}
      {(slide === 'skills') && (
        <div
          className={`
          absolute top-0 left-0 w-full h-full
          grid grid-rows-[1fr_1em]
          pointer-events-none
        `}
        >
          <SkillArtWindow
            className="w-full h-full"
            title="PAINT_TO_REVEAL_MY_SKILLS"
            color="white"
            topColor="white"
            // draggable={false}
          />
          <TerminalWindow
            title={null}
            className="justify-self-end  mt-[-3em]"

          >
            <nav className="p-[0.75em] flex gap-[0.75em] items-end h-full">
              <TerminalWindowButton
                color="black"
                bgColor="yellow"
                onClick={() => {
                  setScene('menu');
                  setSlide('intro');
                }}
              >
                BACK_TO_MENU

              </TerminalWindowButton>
              <TerminalWindowButton
                bgColor="yellow"
                // href={contactHref}
              >
                CONTACT_ME

              </TerminalWindowButton>
            </nav>
          </TerminalWindow>
        </div>
      )}
    </>
  );
};

export function ComputerTerminal() {
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
        <CustomCursorHover cursor="terminal">
          <div
            className={`
                ${breakpoints.about ? 'rotate-[-5deg]' : 'rotate-[-4deg]'}
                 -translate-x-1/2 -translate-y-1/2
                w-[var(--terminal-width)] h-[var(--terminal-height)]
              `}
            style={{
              fontSize: 'calc(var(--terminal-width)/40)',
            }}
            ref={terminalDivRef}
          >
            <Slides slide={slide} setSlide={setSlide} setScene={setScene} />

            {slide !== 'intro' && (
            <div
              className={`absolute

                      text-[max(0.7em,16px)]

                      right-0
                    top-0
                    z-[-1]
                  `}
            >
              <TerminalButton
                onClick={() => {
                  setScene('menu');
                  setSlide('intro');
                }}
                delay={500}
              >
                {breakpoints.about ? 'BACK_TO_MENU' : 'BACK'}
              </TerminalButton>
            </div>
            )}
          </div>
        </CustomCursorHover>
      </Html>
    </group>
  );
}