import React, { useEffect, useState } from 'react';
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
  const showCTAs = scene !== 'project-open' && scene !== 'intro' && scene !== 'start';

  // const [ctaIndex, setCtaIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);

  const defaultSpeed = 5000;
  const fastSpeed = 500;
  const [colorSpeed, setColorSpeed] = useState(defaultSpeed);
  useInterval(() => {
    setColorIndex((index) => (index + 1) % colorPairs.length);
    // setCtaIndex((index) => (index + 1) % ctas.length);
  }, colorSpeed);

  const [hover, setHover] = useState(false);

  const [showBg, setShowBg] = useState(false);
  useEffect(() => { setShowBg(true); }, []);

  // useInterval;
  return (
    <>
      <style>
        { hover && `
          body {
            background: black !important;
          }
        `}
      </style>
      <CustomCursorHover
        cursor="contact"
        onMouseEnter={() => { setColorSpeed(fastSpeed); setHover(true); }}
        onMouseLeave={() => { setColorSpeed(defaultSpeed); setHover(false); }}
      >
        <a
          href={contactHref}
          target="_blank"
          rel="noreferrer"
          className="block "
          style={{
            borderColor: colorPairs[colorIndex][1],
          }}
        >
          <div
            className={`
          fixed top-0 left-0 text-[min(4vw,1.3rem)]  pr-[1rem] py-[1rem] font-mono tracking-wide pl-[0.5em]
      ${showStats ? '' : 'z-[88888888]'}
      ${showCTAs ? '' : 'translate-y-[-200%]'} transition-all
    `}
            style={{
              filter: 'drop-shadow(0 0 0.2rem black) drop-shadow(0 0 0.2rem black)',
              background: colorPairs[colorIndex][0],
              color: colorPairs[colorIndex][1],
              stroke: colorPairs[colorIndex][1],
            }}
          >
            <h2 className="sr-only">Contact</h2>
            <span
              className="tracking-[-0.01em] flex gap-[0.75em] underline decoration-2 underline-offset-[6px]"
            >
              <MailIconSvg className="w-[2em] h-[1.625em]" />
              <span>
                hello
                <span className="text-[0.7em]">&nbsp;</span>
                <span>@</span>
                <span className="text-[0.7em]">&nbsp;</span>
                bryantcodes.art
              </span>
            </span>
          </div>
        </a>
      </CustomCursorHover>
      {showBg && (
        <div className="top-0 left-0 fixed w-full h-full overflow-hidden z-[-1] text-2vw] font-mono text-white break-all opacity-30" aria-hidden>{new Array(2000).fill(null).map(() => 'hi!')}</div>
      )}
    </>
  );
};
