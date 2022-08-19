/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import { PortableText, PortableTextBlockComponent } from '@portabletext/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TypedObject } from '@portabletext/types';
import Vimeo from '@u-wave/react-vimeo';
// import Image from 'next/image';
import { Project } from '../generatedSanitySchemaTypes';
import { CoordArray } from './CoordArray';

const VimeoBlock = ({ value }:{ value: { id:string } }) => (<Vimeo video={value.id} />);
const PBlock:PortableTextBlockComponent = ({ children }) => (<p className="my-4">{children}</p>);
const H2Block:PortableTextBlockComponent = ({ children }) => (<h2 className="my-4">{children}</h2>);
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
  ), [project.body]);

  return (
    <Html
      position={position}
      className="text-white w-[50vw] relative"
    >

      <div
        className="
          absolute top-[5vh] left-0
          w-[45vw] h-[90vh] -translate-y-1/2
          border-2 border-[red]
          overflow-y-scroll no-scrollbar
        "
      >
        <h1
          className=""
        >
          {project.title}
        </h1>
        <h2
          className="my-4"
        >
          {project.subTitle}
        </h2>
        <dl
          className="my-4"
        >
          <dt>Client:</dt>
          <dd>{project.client}</dd>
        </dl>

        {/* <pre>{JSON.stringify(project.body, null, 2)}</pre> */}
        {renderedPortableText}
      </div>
    </Html>
  );
};
