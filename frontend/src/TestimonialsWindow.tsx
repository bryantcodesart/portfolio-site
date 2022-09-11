/* eslint-disable @next/next/no-img-element */
import React, { ReactNode, useState } from 'react';
import { TerminalWindowProps } from './TerminalWindowProps';
import { TerminalWindow } from './TerminalWindow';
import { Typewriter } from './Typewriter';
import { useBreakpoints } from './useBreakpoints';

const testimonials = [{
  quote: 'Bryant\'s kickass work is complemented by his infectious energy and passion for creating original, exciting work. He is a true creative partner––always bringing new ideas to the table. ',
  // I have learned so much from my experience working with him.
  shortName: 'Stef',
  name: 'Stephanie Jung',
  headshot: 'stef.jpg',
  title: [
    'Brand Design Lead, Employer Marketing at Handshake',
  ],
}, {
  quote: 'Bryant\'s collaborative mindset and aptitude to explore ideas well beyond the minimum viable product make him an invaluable partner.',
  // OG: Bryant's collaborative mindset and aptitude to explore ideas well beyond the
  // minimum viable product make him invaluable to any partner
  // looking for uniquely functional development projects.
  // (edited with permission)
  name: 'JP Ramirez',
  shortName: 'JP',
  title: ['Design Manager, Brand Design Strategy at Intuit',
    'Director, Studio Ramírez'],
  headshot: 'jp.jpg',
}, {
  quote: 'Bryant\'s building enables award-winning projects––including 4x STA100\'s, a Type Director\'s Club award, and a Webby.',
  name: 'The award people',
  shortName: 'Awards',
  headshot: 'star-icon.svg',
}];

type Testimonial = typeof testimonials[number];

// Manually decide which testimony should dictate window length
const longestTestimonial = testimonials[0];

const QuoteFigure = ({ testimonial, hidden = false }:
  {testimonial:Testimonial, hidden?:boolean}) => (
    <figure
      className={`${hidden ? 'invisible' : ''} col-[1/-1] row-[1/-1]`}
      aria-hidden={hidden}
    >
      <blockquote className="">
        {hidden ? testimonial.quote : <Typewriter timePerChar={2}>{testimonial.quote}</Typewriter>}
        {/* {testimonial.quote} */}
      </blockquote>
      <figcaption className="mt-[2em] text-[0.6em]">
        <div>
          –
          {testimonial.name}
        </div>
        {testimonial?.title?.map((title) => (<div key={title}>{title}</div>))}
      </figcaption>
    </figure>
);

export const TestimonialsWindow = ({
  children,
  ...terminalWindowProps
}: {
  children:ReactNode
} & Omit<TerminalWindowProps, 'children'>) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const breakpoints = useBreakpoints();
  const breakpoint = breakpoints.about;

  const testimonial = testimonials?.[messageIndex];

  return (
    <TerminalWindow
      {...terminalWindowProps}
    >
      <div className={`grid p-[1em] ${breakpoint ? 'grid-cols-[8em_1fr]' : ''}`}>
        {/* <div className="flex items-center justify-center col-span-2 mt-[-1em] gap-[0.5em]">
          <div className="relative inline-block">
            <span
              className="
                grid place-items-center rounded-full
                bg-blue text-white absolute top-[0em] right-[0em]
                w-[1.5em] h-[1.5em] text-[0.7em]
              "
            >
              3
            </span>
            <img src="/images/messages-icon.svg" className="w-[3em] h-[3em] m-auto"
            alt="Message bubble" />
          </div>
          <h2 className="font-display text-[2em]">
            <span className="text-[1.5em]">B</span>
            MAIL
          </h2>
        </div> */}
        <div>
          <ul className={`${breakpoint ? '' : 'flex'}`}>
            {testimonials.map(({ shortName, headshot }, index) => (
              <li key={shortName}>
                <button
                  onClick={() => { setMessageIndex(index); }}
                  type="button"
                  className={`
                  flex justify-start items-center gap-[0.5em]
                  w-full p-[0.5em]
                  text-left
                  ${messageIndex === index ? 'bg-[#bdffbd]' : ''}
                `}
                >
                  <div className="border-[2px] rounded-full">
                    <img src={`/images/${headshot}`} className="w-[3em] h-[3em] pointer-events-none rounded-full object-cover" alt="headshot" />
                  </div>
                  <div className="text-[0.75em] leading-[1]">
                    <h2 className="font-bold">
                      {shortName}
                    </h2>

                    {/* <h3 className="">
                      re:
                      {' '}
                      <span className="text-[1.5em]">{subject}</span>
                    </h3> */}
                  </div>
                </button>
              </li>
            ))}
          </ul>

        </div>
        <div className="bg-[#bdffbd] text-[1em] p-[1em] grid">
          {/* A hidden div with the longest testinmonial which will be used to size */}
          <QuoteFigure testimonial={longestTestimonial} hidden />
          <QuoteFigure testimonial={testimonial} />
        </div>
        {children}
      </div>
    </TerminalWindow>
  );
};
