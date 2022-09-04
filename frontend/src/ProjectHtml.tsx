/* eslint-disable react/prop-types */
import React, { ReactNode, useMemo } from 'react';
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
import { CustomCursorHover } from './CustomCursor';
import ExternalLinkIconSvg from './svg/ExternalLinkIconSvg';

const VimeoBlock = ({ value }:{ value: { id:string } }) => (
  <Vimeo
    video={value.id}
    responsive
    className="my-8 border-2 border-[currentColor]"
  />
);
const PBlock:PortableTextBlockComponent = ({ children }) => (<p className="my-4">{children}</p>);
const H2Block:PortableTextBlockComponent = ({ children }) => (
  <h2
    className="mt-16 font-mono text-2xl"
  >
    {children}
  </h2>
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

const ContentContainerWithScroll = ({ children }:{children:ReactNode}) => {
  const breakpoints = useBreakpoints();
  return (
    <div
      className={`
        absolute overflow-hidden
        ${breakpoints.projectOpen
        ? `
          top-[1.5rem] left-0
          w-full h-[calc(100vh-4rem)] -translate-y-1/2
          grid place-items-center
          p-4 pr-8
        ` : `
          top-[3vh] w-[98vw] h-[56vh] -translate-x-1/2
          p-4
        `}
      `}
    >
      <div
        className="w-full h-full overflow-y-scroll no-scrollbar"
      >
        <div
          className={`
          ${breakpoints.projectOpen
            ? `
            max-w-[450px]
            w-[45vw]
          ` : `
          `}
        `}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const CloseButton = ({ setOpen }:{setOpen: (_open:boolean)=>void}) => (
  <CustomCursorHover cursor="close-project">
    <button
      className="
        fixed top-[-50vh] left-[40vw]
        z-[100]
        font-mono text-[10vw] px-[0.5em] uppercase
        transition-transform
        group
      "
      onClick={() => setOpen(false)}
      type="button"
      aria-label="close project glow"
    >
      <span
        className="inline-block translate-y-[-3%]
    group-hover:scale-[1.5] transition-transform"
      >
        ×

      </span>
    </button>
  </CustomCursorHover>
);

const ProjectHeader = ({ project }:{project:Project}) => (
  <>
    <h1
      className="text-[max(35px,6vw)] font-mono leading-[1] my-6 mix-blend-difference"
    >
      {project.title}
    </h1>
    <h2
      className="font-mono text-2xl "
    >
      {project.subTitle}
    </h2>
    {(
      project.client || project.designers?.length || project.links?.length
    ) ? (
      <div className="grid grid-cols-2">
        {project.links?.length && (
        <ul className="col-span-2 mt-8">
          {project.links.map((link) => (
            <li className="">
              <CustomCursorHover cursor="external">
                <a
                  href={link?.url}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    relative block p-2 pr-8 font-mono text-center border-2 border-[currentColor] font-bold
                  "
                >
                  {link.text ?? 'Vist the site'}
                  <span className="absolute top-0 grid w-6 h-full right-2 place-items-center fill-[currentColor]"><ExternalLinkIconSvg /></span>
                </a>
              </CustomCursorHover>
            </li>
          ))}
        </ul>
        )}
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
                <li>
                  {designer.url ? (
                    <CustomCursorHover cursor="external">
                      <a
                        href={designer.url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
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
  </>
);

export const ProjectBody = ({ project }:{project:Project}) => useMemo(() => (
  <div className="my-8">
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

export const ProjectHtml = ({ project, position, setOpen }:
  { project: Project; position: CoordArray, setOpen: (_open:boolean)=>void }) => {
  const { textColor, color1, color2 } = project;
  console.log(color1);
  return (
    <Html
      position={position}
      className="w-[100vw] relative"
      style={{
        ['--textColor' as any]: textColor?.hex ?? '#000',
        ['--color1' as any]: color1?.hex ?? '#fff',
        ['--color2' as any]: color2?.hex ?? '#fff',
        color: 'var(--textColor)',
      }}
    >
      <CloseButton setOpen={setOpen} />
      <ContentContainerWithScroll>
        <ProjectHeader project={project} />
        <ProjectBody project={project} />
      </ContentContainerWithScroll>
    </Html>
  );
};
