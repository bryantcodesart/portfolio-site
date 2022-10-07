/* eslint-disable react/prop-types */
import React, { ReactNode } from 'react';
import { Html } from '@react-three/drei';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Project } from '../generatedSanitySchemaTypes';
import { CoordArray } from './CoordArray';
import {
  ProjectHeader, ProjectBody, ProjectCTA,
} from './ProjectContent';
import { CustomCursorHover } from './CustomCursor';
import { useBreakpoints } from './useBreakpoints';
import { useScrolledToBottom } from './useScrolledToBottom';

export const CloseButton = ({ setOpen }: { setOpen: (_open: boolean) => void; }) => {
  const breakpoints = useBreakpoints();
  return (
    <CustomCursorHover cursor="close-project">
      <button
        className={`
          fixed
          z-[100]
          font-mono text-[max(35px,6vw)] scale-[1.5] px-[0.5em] uppercase
          transition-transform
          group
          ${breakpoints.projectOpen
          ? 'top-[-50vh] left-[min(45vw,450px)]'
          : 'left-[50vw] top-[1em] -translate-x-[85%]'}
        `}
        onClick={() => setOpen(false)}
        type="button"
        aria-label="close project"
      >
        <span
          className="inline-block translate-y-[-3%]
          group-hover:scale-[1.5] transition-transform
          group-hover:text-projectColor
        "
        >
          ×

        </span>
      </button>
    </CustomCursorHover>
  );
};

export const ScollingContentContainer = ({ children }: { children: ReactNode; }) => {
  const breakpoints = useBreakpoints();

  const { scrollRef, scrolledToBottom } = useScrolledToBottom();

  return (
    <div
      className={`
        absolute overflow-hidden
        ${breakpoints.projectOpen
        ? `
          top-0 left-0
          w-full h-[100vh] -translate-y-1/2

          px-4 pr-8
        ` : `
          top-[3vh] w-[98vw] h-[60vh] -translate-x-1/2
          px-4
        `}
      `}
    >
      <div
        className={`
          w-full h-[calc(100%-3rem)] overflow-y-scroll no-scrollbar
          ${breakpoints.projectOpen ? 'h-[calc(100%-3rem)]' : 'h-[calc(100%-1.5rem)]'}
        `}
        ref={scrollRef}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
      >
        <div
          className={`
            ${breakpoints.projectOpen
            ? `
              max-w-[450px]
              w-[45vw]
            ` : `
              w-[94%]
            `}
          `}
        >
          {children}
        </div>
      </div>
      <div
        className={`
          absolute bottom-0 left-0
          flex justify-center pointer-events-none
            ${breakpoints.projectOpen
          ? `
              max-w-[450px]
              w-[45vw]
            ` : `
              w-full
            `}
        `}
      >
        {!scrolledToBottom
          && (
            <span
              className={`font-mono rotate-[90deg] inline-block
            ${breakpoints.projectOpen
                ? 'text-[3rem] translate-y-[20%]'
                : 'text-[3rem] translate-y-[40%]'}
          `}
            >
              ›

            </span>
          )}
      </div>
    </div>
  );
};

export const ProjectHtmlModal = ({ project, position, setOpen }:
  { project: Project; position: CoordArray, setOpen: (_open:boolean)=>void }) => {
  const { color1 } = project;
  // console.log(color1);
  return (
    <Html
      position={position}
      className="w-[100vw] relative font-light touch-auto"
      style={{
        ['--textColor' as any]: 'white', // textColor?.hex ?? '#000',
        ['--projectColor' as any]: color1?.hex ?? '#fff',
        // ['--color2' as any]: color2?.hex ?? '#fff',
        color: 'var(--textColor)',
      }}
    >
      <CloseButton setOpen={setOpen} />
      <ScollingContentContainer>
        <ProjectHeader project={project} />
        <ProjectBody project={project} />
        <ProjectCTA slug={project?.slug?.current ?? 'unset'} />
      </ScollingContentContainer>
    </Html>
  );
};
