import { useFrame } from '@react-three/fiber';
import React, {
  useRef, useState,
} from 'react';
import { MathUtils, PerspectiveCamera } from 'three';
import { useEventListener, useWindowSize } from 'usehooks-ts';
import { Html } from '@react-three/drei';
import { event } from 'nextjs-google-analytics';
import { CoordArray } from './CoordArray';
import { CustomCursorHover } from './CustomCursor';
import { SceneName, useSceneController } from './SceneController';
import { Typewriter, TIME_PER_CHAR } from './Typewriter';
import { useBreakpoints } from './useBreakpoints';
import { SkillArtWindow } from './SkillArtWindow';
import { SlideName } from './SlideName';
import { ImageWindow } from './ImageWindow';
import { TextWindow } from './TextWindow';
import { TerminalButton } from './TerminalButton';
import { TestimonialsWindow } from './TestimonialsWindow';
import colors from './colors';
// import { AwardsWindow } from './AwardsWindow';
import { TerminalWindowButton } from './TerminalWindowButton';
import { aboutContent } from './aboutContent';
import selfPortraitImage from '../public/images/self-portrait.jpg';
import haileyImage from '../public/images/hailey2.jpg';

export const Slides = ({
  slide, setScene, setSlide,
}:{
  slide:SlideName,
  setScene:(_scene:SceneName)=>void,
  setSlide:(_slide:SlideName)=>void
}) => {
  const breakpoints = useBreakpoints();
  const breakpoint = breakpoints.about;

  const { scene } = useSceneController();

  if (slide === 'intro') {
    const text1Delay = 800;
    const text2Delay = text1Delay + 22 * TIME_PER_CHAR + 100;
    const buttonDelay = text2Delay + 23 * TIME_PER_CHAR + 300;
    return (
      <div className="p-[1em] font-mono text-white text-[2em]">
        <Typewriter delay={text1Delay} hideCaratAtEnd>
          {aboutContent.intro[0]}
        </Typewriter>
        <Typewriter delay={text2Delay}>
          {aboutContent.intro[1]}
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
            tabIndex={scene === 'menu' ? 0 : -1}
          >
            ABOUT_BRYANT
          </TerminalButton>
        </div>
      </div>
    );
  }

  return (
    <>
      {(slide === 'mission' || slide === 'testimonials' || slide === 'skills') && (
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
            texts={aboutContent.mission}
            // icon="/images/computer-icon.svg"
            // icon="/images/alert-icon.svg"
            buttonColor="pink"
            buttonText="tell me more!"
            onClick={() => {
              setSlide('testimonials');
            }}
            disabled={slide !== 'mission'}
          />
          <ImageWindow
            delay={300}
            title="SELF_CONCEPT.jpg"
            positions={['center']}
            topColor="yellow"
            className={`
            ${breakpoints.about ? `
              self-end min-h-[12em] h-[13em] ml-[-1em] mb-[2em]
            ` : `
              min-w-[220px]
              aspect-[9/8]
              justify-self-end  mt-[2em]
            `}

            transition-transform duration-[1s]
            ${slide === 'mission' ? '' : 'translate-x-[20%] translate-y-[70%]'}
          `}
            srcs={[selfPortraitImage]}
            alts={['Crayon illustration of Bryant from decades ago.']}
          />
        </div>
      )}
      {(slide === 'testimonials' || slide === 'skills') && (
      <div
        className={`
          absolute top-0 left-0 w-full h-full
          pointer-events-none
          ${breakpoints.about ? 'grid grid-cols-[1fr_80%]' : 'grid grid-cols-1'}
        `}
      >
        <ImageWindow
          delay={100}
          title="HAILEY.jpg"
          topColor="violet"
          positions={['60% 15%']}
          className={`
            ${breakpoints.about ? `
              self-start h-[13em] mr-[-2em] w-[10em] mt-[6em]
            ` : `
              w-[90%] max-w-[28em]
              aspect-[7/9]
              justify-self-start mb-[-12em] ml-[2em]
              min-h-[300px]
              h-[300px]
              col-[1/-1] row-[1/-1]
            `}
            transition-transform duration-[1s]
            ${slide === 'testimonials' ? '' : 'translate-x-[-70%] translate-y-[-10%]'}
          `}
          srcs={[haileyImage]}
          alts={['My dog Hailey smiling her crazy smile.']}
        />

        <TestimonialsWindow
          className={`
            relative
            transition-transform duration-[1s]
            ${slide === 'testimonials' ? '' : 'translate-x-[43%] translate-y-[-80%]'}
            ${breakpoint ? 'self-baseline' : 'col-[1/-1] row-[1/-1] self-end'}
          `}
          delay={1000}
          title="KIND_WORDS_FROM_OTHERS.exe"
          color={colors.lime}
          topColor={colors.cyan}
        >
          <div className={`grid place-items-center mt-[2em] ${breakpoint ? 'col-span-2' : ''}`}>
            <TerminalWindowButton
              onClick={() => {
                setSlide('skills');
              }}
              delay={1000}
              color="black"
              bgColor="violet"
              disabled={slide !== 'testimonials'}
            >
              skills, tho?
            </TerminalWindowButton>
          </div>

        </TestimonialsWindow>
        {/* <TextWindow
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
            'Already have a vision? I\'ll realize it down to the pixel.
            Searching? Let\'s find it together.',
          ]}
          buttonColor="violet"
          buttonText="skills tho?"
          disabled={slide !== 'process'}
          onClick={() => {
            setSlide('skills');
          }}
        /> */}
      </div>
      )}
      {(slide === 'skills') && (
        <div
          className={`
          absolute top-0 left-0 w-full h-full
          grid
          ${breakpoint ? ' grid-rows-[1fr_1em]' : ' grid-rows-[1fr_6em]'}
          pointer-events-none
        `}
        >
          <SkillArtWindow
            className="w-full h-full"
            title="PAINT_TO_REVEAL_MY_SKILLS"
            color="white"
            topColor="white"
            setScene={setScene}
            setSlide={setSlide}
            // draggable={false}
          />
        </div>
      )}
    </>
  );
};

export function ComputerTerminal() {
  const { scene, setScene } = useSceneController();

  const [slide, _setSlide] = useState<SlideName>('intro');
  const setSlide = (name: SlideName) => {
    event('about-slide', {
      slide: name,
    });
    _setSlide(name);
  };

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
    // const width = Math.min(planeWidthInPixels, windowSize.width * 0.9);
    // const height = Math.min(planeHeightInPixels, windowSize.height * 0.8);

    // Apply sizing to our terminal div via CSS vars
    terminalDivRef.current.style.setProperty('--terminal-width', `min(${windowSize.width * 0.9}px, ${planeWidthInPixels}px)`);
    terminalDivRef.current.style.setProperty('--terminal-height', `min(80 * var(--vh), ${planeHeightInPixels}px)`);
  });

  // Exit on escape key
  useEventListener('keypress', (e) => {
    if (e.key === 'Escape') {
      if (scene === 'about') {
        setScene('menu');
        setSlide('intro');
      }
    }
  });

  return (
    <group
      position={position}
      rotation={[0, 0, Math.PI / 40]}
    >
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
                className="font-mono"
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
