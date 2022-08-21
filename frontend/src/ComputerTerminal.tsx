import { Html } from '@react-three/drei';
import React, { ReactNode, useState } from 'react';
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
        transition-transform ease-[steps(10)]
        duration-500
      `}
    >
      <div
        className={`absolute top-0 left-0 right-0 bottom-0
          bg-black translate-x-[-1px] translate-y-[-1px]
        `}
      />
      <div
        className="border-[0.3px] border-black overflow-scroll text-[4px] text-black relative w-full h-full"
        style={{
          backgroundColor: color,
        }}
      >
        <div className="border-b-[0.3px] border-black text-[2px] grid place-items-center relative">
          {title}
          <div className="border-black border-[0.3px] h-[2px] w-[2px] absolute right-[1px]" />
        </div>
        <div className="p-[4px]">{showWindow && children}</div>
      </div>
    </div>
  );
};

export const TerminalButton = ({
  onClick, children, className = '', delay = 300,
}:{
  onClick: ()=>void,
  children: ReactNode
  className?: string
  delay?:number
}) => {
  const show = useTrueAfterDelay(delay);
  return (
    <button
      type="button"
      className={`
          border-[0.5px] border-white py-[2px] px-[4px] hover:bg-white hover:text-blue ${className}
          ${show ? '' : 'scale-0'} transition-transform ease-[steps(5)] duration-300
        `}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

type SlideName = 'intro' | 'design'

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
          className="absolute top-[10px] left-[10px] w-[80%] h-[80%] "
          delay={1500}
        >
          <Typewriter key={slide}>
            {`I partner with awesome designers
  to build their wildest dreams.

  And I'm happiest
when the finished product
  makes people say, "woah."`}
          </Typewriter>
        </TerminalWindow>
        <TerminalWindow
          delay={500}
          title="BRYANT.jpg"
          color="lime"
          className="absolute bottom-[10px] right-[10px] w-[40px] h-[40px]"
        >
          image
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

  return (
    <group
      position={[-1, 0.7, 2]}
      rotation={[0, 0, Math.PI / 40]}
    >
      <Html
        transform
        className="text-white font-mono text-[8px] overflow-hidden"
      >
        <CustomCursorContext.Provider value={customCursor}>
          <CustomCursorHover cursor="terminal">
            <div className="w-[150px] h-[85px]">
              <Slides slide={slide} setSlide={setSlide} setScene={setScene} />
            </div>
          </CustomCursorHover>
        </CustomCursorContext.Provider>
      </Html>
    </group>
  );
}
