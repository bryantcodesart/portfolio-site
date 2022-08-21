/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import { PortableText, PortableTextBlockComponent } from '@portabletext/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TypedObject } from '@portabletext/types';
import Vimeo from '@u-wave/react-vimeo';
// import Image from 'next/image';
import { useWindowSize } from 'usehooks-ts';
import { Project } from '../generatedSanitySchemaTypes';
import { CoordArray } from './CoordArray';
import { useBreakpoints } from './useBreakpoints';

const VimeoBlock = ({ value }:{ value: { id:string } }) => (
  <Vimeo
    video={value.id}
    responsive
    className="my-8"
  />
);
const PBlock:PortableTextBlockComponent = ({ children }) => (<p className="my-4">{children}</p>);
const H2Block:PortableTextBlockComponent = ({ children }) => (
  <h2
    className="mt-16 text-2xl"
  >
    {children}
  </h2>
);
const H3Block:PortableTextBlockComponent = ({ children }) => (<h3 className="my-4">{children}</h3>);
const LinkBlock = ({ value }:{
  value: {
    url: string;
    text: string;
  }
}) => (<a href={value.url} className="block text-white underline">{value.text}</a>);

const QuoteBlock = ({ value }:{
  value: {
    author:string,
    title:string,
    quote:string,
    image: any
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
      {/* <Image src={value.image.asset} */}
    </figcaption>
  </figure>
);

export const ProjectHtml = ({ project, position }: { project: Project; position: CoordArray }) => {
  const windowSize = useWindowSize();
  const renderedPortableText = useMemo(() => (
    <PortableText
      value={((project?.body ?? {}) as TypedObject)}
      components={{
        types: {
          // youtube: () => {},
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
  ), [project.body, windowSize]);

  const breakpoints = useBreakpoints();

  return (
    <Html
      position={position}
      className="text-white w-[50vw] relative"
    >
      <div
        className={`
          absolute
          ${breakpoints.projectOpen
          ? `
            top-[1.5rem] left-0
            w-[47vw] h-[calc(100vh-4rem)] -translate-y-1/2
            grid place-items-center
            p-4 pr-8
            max-w-[500px]
          ` : `
            top-[3vh] w-[98vw] h-[56vh] -translate-x-1/2
            p-4
          `}
          overflow-y-scroll no-scrollbar
        `}
      >
        <div className="pb-16">
          <h1
            className="text-4xl"
          >
            {project.title}
          </h1>
          <h2
            className="my-4 text-2xl"
          >
            {project.subTitle}
          </h2>
          {(project.client || project.designers?.length) && (
          <dl>
            {project.client && (
            <>
              <dt className="mt-4">Client:</dt>
              <dd>{project.client}</dd>
            </>
            )}
            {project.designers?.length && (
            <>
              <dt className="mt-4">Design:</dt>
              <dd>
                <ul>
                  {project.designers.map((designer) => (
                    <li>
                      {designer.url ? (
                        <a
                          href={designer.url}
                          target="_blank"
                          rel="noreferrer"
                          className="underline"
                        >
                          {designer.name}

                        </a>
                      ) : designer.name}
                    </li>
                  ))}
                </ul>

              </dd>
            </>
            )}
          </dl>
          )}
          {renderedPortableText}
        </div>
      </div>
    </Html>
  );
};
