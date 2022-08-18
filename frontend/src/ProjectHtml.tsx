/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import { PortableText, PortableTextBlockComponent } from '@portabletext/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TypedObject } from '@portabletext/types';
import Vimeo from '@u-wave/react-vimeo';
// import Image from 'next/image';
import { Project } from '../generatedSanitySchemaTypes';

const VimeoBlock = ({ value }:{ value: { id:string } }) => (<Vimeo video={value.id} />);
const PBlock:PortableTextBlockComponent = ({ children }) => (<p className="mt-4 text-[red]">{children}</p>);
const H2Block:PortableTextBlockComponent = ({ children }) => (<h2 className="mt-4 text-[blue]">{children}</h2>);
const H3Block:PortableTextBlockComponent = ({ children }) => (<h3 className="mt-4 text-[red]">{children}</h3>);
const LinkBlock = ({ value }:{
  value: {
    url: string;
    text: string;
  }
}) => (<div className="my-4 py-4 bg-[white]"><a href={value.url} className="text-[black] py-4">{value.text}</a></div>);

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

export const ProjectHtml = ({ project }: { project: Project; }) => {
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
      position={[-1.6, 0.5, 4.5]}
      className="text-white w-[50vw] h-[50vw] border-2 border-[red] p-[2rem] text-[1rem] overflow-scroll"
    >
      <h1>{project.title}</h1>
      <p>
        {project.subTitle}
      </p>
      <p>
        {project.client}
      </p>

      {/* <pre>{JSON.stringify(project.body, null, 2)}</pre> */}
      {renderedPortableText}
    </Html>
  );
};
