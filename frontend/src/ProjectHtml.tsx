/* eslint-disable react/prop-types */
import React, {
  ReactNode, useMemo,
} from 'react';
import { Html } from '@react-three/drei';
import { PortableText, PortableTextBlockComponent } from '@portabletext/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TypedObject } from '@portabletext/types';
import Vimeo from '@u-wave/react-vimeo';
import { SanityImageAsset, SanityReference } from 'sanity-codegen';
import { Project } from '../generatedSanitySchemaTypes';
import { CoordArray } from './CoordArray';
import { useBreakpoints } from './useBreakpoints';
import { getSanityImageUrlFor } from './sanity/sanityImageBuilder';
import { CustomCursorHover, CustomCursorState } from './CustomCursor';
import ExternalLinkIconSvg from './svg/ExternalLinkIconSvg';
import { contactHref } from './contactHref';
import { useScrolledToBottom } from './useScrolledToBottom';

const VimeoBlock = ({ value }:{ value: { id:string } }) => (
  <Vimeo
    video={value.id}
    responsive
    className="my-8 border-[1px] border-[currentColor]"
  />
);
const P = ({ children, className = '' }:
{children:ReactNode, className?:string}) => (<p className={`my-4 ${className}`}>{children}</p>);
const PBlock:PortableTextBlockComponent = ({ children }) => (<P>{children}</P>);
const H2 = ({ children }:{children:ReactNode}) => (
  <h2
    className="mt-16 font-mono text-2xl"
  >
    {children}
  </h2>
);

const H2Block:PortableTextBlockComponent = ({ children }) => (
  <H2>
    {children}
  </H2>
);
const H3Block:PortableTextBlockComponent = ({ children }) => (<h3 className="my-4 font-mono">{children}</h3>);
const LinkBlock = ({ value }:{
  value: {
    url: string;
    text: string;
  }
}) => (<a href={value.url} className="block underline">{value.text}</a>);

const QuoteBlock = ({ value }:{
  value: {
    author:string,
    title:string,
    quote:string,
    headshot: {
      asset: SanityReference<SanityImageAsset>;
    }
  }
}) => (
  <figure>
    <blockquote>{value.quote}</blockquote>
    <figcaption>
      <div>
        {value.author}
        ,
        {value.title}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={getSanityImageUrlFor(value.headshot).width(800).url()} alt="hi" />
    </figcaption>
  </figure>
);

const ScollingContentContainer = ({ children }:{children:ReactNode}) => {
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
            : 'text-[3rem] translate-y-[40%]'
            }
          `}
        >
          ›

        </span>
        )}
      </div>
    </div>
  );
};

const CloseButton = ({ setOpen }:{setOpen: (_open:boolean)=>void}) => {
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

const ExternalLink = ({ href, cursor = 'external', children }:
{href:string, children:ReactNode, cursor?:CustomCursorState}) => (
  <CustomCursorHover cursor={cursor}>
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="
          relative block p-2 pr-8 font-mono text-center border-[1px] border-[currentColor]
          hover:text-projectColor hover:border-projectColor hover:fill-projectColor
        "
    >
      {children}
      <span className="absolute top-0 grid w-6 h-full right-2 place-items-center fill-[currentColor]"><ExternalLinkIconSvg /></span>
    </a>
  </CustomCursorHover>
);

const ProjectHeader = ({ project }:{project:Project}) => (
  <>
    <h1
      className="font-mono leading-[1] mb-6 mt-12"
      style={{
        fontSize: (project?.title?.length ?? 0) > 15 ? 'max(35px,3.5vw)' : 'max(35px,6vw)',
      }}
    >
      {project.title}
    </h1>
    <h2
      className="font-mono text-2xl"
    >
      {project.subTitle}
    </h2>
    {(
      project.designers?.length || project.client
    ) ? (
      <div className="grid grid-cols-2 gap-8">
        {project.client && (
        <dl className="mt-8 font-mono">
          <dt className="font-bold">Client</dt>
          <dd>{project.client}</dd>
        </dl>
        )}
        {project.designers?.length && (
        <dl className="mt-8 font-mono">
          <dt className="font-bold">Design</dt>
          <dd>
            <ul>
              {project.designers.map((designer) => (
                <li key={designer.name}>
                  {designer.url ? (
                    <CustomCursorHover cursor="external">
                      <a
                        href={designer.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block border-b-[1px] p-0 border-white hover:text-projectColor hover:border-b-projectColor"
                      >
                        {designer.name}
                      </a>
                    </CustomCursorHover>
                  ) : designer.name}
                </li>
              ))}
            </ul>
          </dd>
        </dl>
        )}
      </div>
      ) : null}
    {project.links?.length && (
    <ul className="col-span-2 mt-8">
      {project.links.map((link) => (
        <li className="mt-4 first:mt-0" key={link.url}>
          <ExternalLink href={link.url ?? ''}>{link.text}</ExternalLink>
        </li>
      ))}
    </ul>
    )}

  </>
);

export const ProjectBody = ({ project }:{project:Project}) => useMemo(() => (
  <div className="my-8 tracking-wide">
    <PortableText
      value={((project?.body ?? {}) as TypedObject)}
      components={{
        types: {
          quote: QuoteBlock,
          link: LinkBlock,
          vimeo: VimeoBlock,
        },
        block: {
          h2: H2Block,
          h3: H3Block,
          normal: PBlock,
        },
      }}
    />

  </div>
), [project?.body]);

const ProjectCTA = () => (
  <div className="mb-[5em]">
    <H2>Questions?</H2>
    <P className="mb-8">
      {`
        Wanna nerd out and talk shop?
        Have a project of your own you wanna discuss?
        Just wanna say hi and introduce yourself?
        I'd love to hear from you!
      `}
    </P>
    <ExternalLink href={contactHref} cursor="contact">hello @ bryantcodes.art</ExternalLink>
  </div>
);

export const ProjectHtml = ({ project, position, setOpen }:
  { project: Project; position: CoordArray, setOpen: (_open:boolean)=>void }) => {
  const { color1 } = project;
  // console.log(color1);
  return (
    <Html
      position={position}
      className="w-[100vw] relative font-thin touch-auto"
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
        <ProjectCTA />
      </ScollingContentContainer>
    </Html>
  );
};
