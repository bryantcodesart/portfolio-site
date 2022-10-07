/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/prop-types */
import React, { ReactNode, useMemo } from 'react';
import {
  PortableText, PortableTextBlockComponent, PortableTextMarkComponent, PortableTextTypeComponent,
} from '@portabletext/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TypedObject } from '@portabletext/types';
import Vimeo from '@u-wave/react-vimeo';
import { SanityImageAsset, SanityReference } from 'sanity-codegen';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { event } from 'nextjs-google-analytics';
import { ImageFigure, Project } from '../generatedSanitySchemaTypes';
import { getSanityImageUrlFor } from './sanity/sanityImageBuilder';
import { CustomCursorHover, CustomCursorState } from './CustomCursor';
import ExternalLinkIconSvg from './svg/ExternalLinkIconSvg';
import { contactHref } from './contactHref';

const ExternalLink = ({
  href, cursor = 'external', children, onClick = () => {},
}: { href: string; children: ReactNode; cursor?: CustomCursorState; onClick?: ()=>void}) => (
  <CustomCursorHover cursor={cursor}>
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="
          relative block p-2 pr-8 font-mono text-center border-[1px] border-[currentColor]
          hover:text-projectColor hover:border-projectColor hover:fill-projectColor
        "
      onClick={onClick}
    >
      {children}
      <span className="absolute top-0 grid w-6 h-full right-2 place-items-center fill-[currentColor]"><ExternalLinkIconSvg /></span>
    </a>
  </CustomCursorHover>
);

const P = ({ children, className = '' }: { children: ReactNode; className?: string; }) => (<p className={`my-4 ${className}`}>{children}</p>);

const H2 = ({ children }: { children: ReactNode; }) => (
  <h2
    className="mt-16 font-mono text-2xl"
  >
    {children}
  </h2>
);

const LinkMark:PortableTextMarkComponent = ({ value, children }) => {
  const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
  return (
    <a
      href={value?.href}
      className="underline decoration-1 underline-offset-4 hover:text-projectColor"
      target={target}
      rel={target === '_blank' ? 'noindex nofollow' : ''}
    >
      {children}
    </a>
  );
};

const ImageBlock:PortableTextTypeComponent = ({ value }:{value:ImageFigure}) => (
  <figure className="border-[1px] border-[currentColor]">
    <img
      src={
      getSanityImageUrlFor(value?.image?.asset as SanityImageSource)
        .width(1000).url()
      }
      alt={value?.alt}
    />
  </figure>
);

const VimeoBlock = ({ value }: { value: { id: string; }; }) => (
  <Vimeo
    video={value.id}
    responsive
    className="my-8 border-[1px] border-[currentColor]"
  />
);

const PBlock: PortableTextBlockComponent = ({ children }) => (<P>{children}</P>);
const H2Block: PortableTextBlockComponent = ({ children }) => (
  <H2>
    {children}
  </H2>
);
const H3Block: PortableTextBlockComponent = ({ children }) => (<h3 className="my-4 font-mono">{children}</h3>);
const LinkBlock = ({ value }: {
  value: {
    url: string;
    text: string;
  };
}) => (<a href={value.url} className="block underline">{value.text}</a>);

const QuoteBlock = ({ value }: {
  value: {
    author: string;
    title: string;
    quote: string;
    headshot: {
      asset: SanityReference<SanityImageAsset>;
    };
  };
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

export const ProjectHeader = ({ project }: { project: Project; }) => (
  <>
    <h1
      className="font-mono leading-[1] mb-6 mt-12"
      style={{
        fontSize: (project?.title?.length ?? 0) > 15 ? 'clamp(35px,3.5vw,55px)' : 'clamp(35px,6vw,85px)',
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
                          className="inline-block p-0 underline decoration-1 underline-offset-4 hover:text-projectColor hover:border-b-projectColor"
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

export const ProjectBody = ({ project }: { project: Project; }) => useMemo(() => (
  <div className="my-8 tracking-wide">
    <PortableText
      value={((project?.body ?? {}) as TypedObject)}
      components={{
        marks: {
          link: LinkMark,
        },
        types: {
          quote: QuoteBlock,
          link: LinkBlock,
          vimeo: VimeoBlock,
          imageFigure: ImageBlock,
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

export const ProjectCTA = ({ slug }:{slug:string}) => (
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
    <ExternalLink
      href={contactHref}
      cursor="contact"
      onClick={() => {
        event('cta', {
          type: 'email',
          location: `project-${slug}`,
        });
      }}
    >
      hello @ bryantcodes.art

    </ExternalLink>
  </div>
);
