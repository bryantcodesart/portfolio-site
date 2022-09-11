import React, { useState } from 'react';
import { useInterval } from 'usehooks-ts';
import { CustomCursorHover } from './CustomCursor';
import { useParamOnLoad } from './useParamOnLoad';
import { contactHref } from './contactHref';
import { useSceneController } from './SceneController';
import colors from './colors';
import MailIconSvg from './svg/MailIconSvg';

const {
  blue, cyan, violet, yellow, lime, white, black,
} = colors;

// const availablity = 'available Q4';

const colorPairs = [
  [blue, white],
  [yellow, black],
  [cyan, black],
  [violet, white],
  [lime, black],
];
// const ctas = [
//   'hello@bryantcodes.art',
//   'hello@bryantcodes.art',
//   'hello@bryantcodes.art',
//   'hello@bryantcodes.art',
//   'hello@bryantcodes.art',
//   'hello@bryantcodes.art',
//   'email me!',
//   'hello@bryantcodes.art',
//   'hello@bryantcodes.art',
//   'hello@bryantcodes.art',
//   'hello@bryantcodes.art',
//   'act now!',
//   'hello@bryantcodes.art',
//   'while supplies last',
//   'hello@bryantcodes.art',
//   'limited time only',
//   'hello@bryantcodes.art',
//   'hello@bryantcodes.art',
//   'just say hello',
//   'hello@bryantcodes.art',
//   'why not?',
//   'hello@bryantcodes.art',
//   availablity,
//   '& down to make art',
//   'hello@bryantcodes.art',
//   'lets collab!',
//   'hello@bryantcodes.art',
//   'or just nerd out',
//   'about design and tech',
//   'hello@bryantcodes.art',
//   'hello@bryantcodes.art',
//   'hello@bryantcodes.art',
//   'cmooooooooon!',
// ];

export const CTA = () => {
  const showStats = useParamOnLoad('stats') === 'true';
  const { scene } = useSceneController();
  const showCTAs = scene !== 'project-open';

  // const [ctaIndex, setCtaIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);

  useInterval(() => {
    setColorIndex((index) => (index + 1) % colorPairs.length);
    // setCtaIndex((index) => (index + 1) % ctas.length);
  }, 4000);

  // useInterval;
  return (
    <div
      className={`
      fixed top-0 left-0 text-[1rem] pl-[0.5em] pr-[1rem] py-[1rem] font-mono tracking-wide
      ${showStats ? '' : 'z-[88888888]'}
      ${showCTAs ? '' : '-translate-y-full'} transition-all
    `}
      style={{
        filter: 'drop-shadow(0 0 0.2rem black) drop-shadow(0 0 0.2rem black)',
        background: colorPairs[colorIndex][0],
        color: colorPairs[colorIndex][1],
        stroke: colorPairs[colorIndex][1],
      }}
    >
      <CustomCursorHover cursor="contact">
        <a
          href={contactHref}
          className="flex gap-[0.75em]"
          target="_blank"
          rel="noreferrer"
          style={{
            borderColor: colorPairs[colorIndex][1],
          }}
        >
          <MailIconSvg className="w-[2em] h-[1.625em]" />
          <span className="border-b-[2px] tracking-[-0.01em]">
            hello
            <span className="mx-[0.4em]">@</span>
            bryantcodes.art
          </span>
        </a>
      </CustomCursorHover>
    </div>
  );
};
