import React, { useState } from 'react';
import { useInterval } from 'usehooks-ts';
import { event } from 'nextjs-google-analytics';
import { CustomCursorHover, CustomCursorState } from './CustomCursor';
import { useParamOnLoad } from './useParamOnLoad';
import { contactHref, linkedInHref, twitterHref } from './contactHref';
import { useSceneController } from './SceneController';
import MailIconSvg from './svg/MailIconSvg';
import { useChangingColorPalette } from './useChangingColorPalette';
import { useDelayedBoolean } from './useDelayedBoolean';
import LinkedInIconSvg from './svg/LinkedInIconSvg';
import TwitterIconSvg from './svg/TwitterIconSvg';

// const availablity = 'available Q4';

const ctas = [
  null,
  null,
  'avail 4 freelance!',
  null,
  null,
  'avail 4 freelance!',
  null,
  null,
  'wow so clickable',
  'much convert',
  null,
  null,
  'avail 4 freelance!',
  null,
  null,
  'this is my CTA',
  'i hope you like it',
  null,
  null,
  'trying to strike',
  'a self-aware tone with it',
  'but still have it work',
  'ya know?',
  null,
  null,
  'are the colors too much?',
  'how bout the hover state?',
  null,
  null,
  'ngl, very outta',
  'my comfort zone',
  'to self-promote',
  'lolololol',
  null,
  null,
  'feels sorta like',
  'selling peanuts',
  'at a ballgame',
  "but I'M THE PEANUTS",
  '"webdev!"',
  '"get your webdev, here!"',
  '"webdeeeeeev!"',
];

export const useShowCtas = () => {
  const { scene } = useSceneController();
  return scene !== 'project-open' && scene !== 'intro' && scene !== 'start';
};

const SocialLink = ({
  IconSvg,
  showCTAs,
  title,
  href,
  onFocus,
  onBlur,
  cursor,
}: {
  IconSvg: typeof MailIconSvg;
  showCTAs: boolean;
  title: string;
  href: string;
  onFocus: () => void;
  onBlur: () => void;
  cursor: CustomCursorState;
}) => (
  <CustomCursorHover cursor={cursor}>
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="block"
      tabIndex={showCTAs ? 0 : -1}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={() => {
        event('cta', {
          type: `social-${title.toLowerCase()}`,
          location: 'bottom-nav',
        });
      }}
    >
      <IconSvg className="w-[2em] h-[1.625em]" />
      <span className="sr-only">{title}</span>
    </a>
  </CustomCursorHover>
);

export const CTA = () => {
  const showStats = useParamOnLoad('stats') === 'true';
  const showCTAs = useShowCtas();

  const [ctaIndex, setCtaIndex] = useState(0);
  useInterval(() => {
    if (!showCTAs) return;
    setCtaIndex((i) => (i + 1) % ctas.length);
  }, 3000);

  const defaultSpeed = 5000;
  const fastSpeed = 400;
  const [colorSpeed, setColorSpeed] = useState(defaultSpeed);
  const { bgColor, textColor } = useChangingColorPalette(colorSpeed);

  const [hover, setHover] = useState(false);

  // const [showBg, setShowBg] = useState(false);
  const showBg = useDelayedBoolean(hover, null, 1000);

  const onFocus = () => {
    setColorSpeed(fastSpeed);
    setHover(true);
  };
  const onBlur = () => {
    setColorSpeed(defaultSpeed);
    setHover(false);
  };
  // useInterval;
  return (
    <>
      <style>
        {hover &&
          `
          body {
            background: black !important;
          }
        `}
      </style>
      <CustomCursorHover
        cursor="contact"
        onMouseEnter={onFocus}
        onMouseLeave={onBlur}
      >
        <a
          href={contactHref}
          target="_blank"
          rel="noreferrer"
          className={`
            block fixed top-0 left-0 text-[min(4vw,1.3rem)]  pr-[1rem] py-[1rem] font-mono tracking-wide pl-[0.5em]
            ${showStats ? '' : 'z-[88888888]'}
            ${showCTAs ? '' : 'translate-y-[-200%]'} transition-all duration-300
            ${hover ? 'scale-[1.3]' : ''}  origin-top-left
          `}
          style={{
            filter:
              'drop-shadow(0 0 0.2rem black) drop-shadow(0 0 0.2rem black)',
            background: bgColor,
            color: textColor,
            stroke: textColor,
          }}
          tabIndex={showCTAs ? 0 : -1}
          onFocus={onFocus}
          onBlur={onBlur}
          onClick={() => {
            event('cta', {
              type: 'email',
              location: 'nav',
            });
          }}
        >
          <h2 className="sr-only">Contact</h2>
          <span className="tracking-[-0.01em] flex gap-[0.75em] underline decoration-2 underline-offset-[6px]">
            <MailIconSvg className="w-[2em] h-[1.625em]" />
            {ctas[ctaIndex] ?? (
              <span>
                hello
                <span className="text-[0.7em]">&nbsp;</span>
                <span>@</span>
                <span className="text-[0.7em]">&nbsp;</span>
                bryantcodes.art
              </span>
            )}
          </span>
        </a>
      </CustomCursorHover>
      <nav
        className={`
          block fixed bottom-0 right-0 text-[min(4vw,1.3rem)]  pr-[1rem] py-[1rem] font-mono tracking-wide pl-[0.5em]
          ${showCTAs ? '' : 'translate-y-[200%]'} transition-all duration-300
          z-[88888888]
          ${hover ? 'scale-[1.3]' : ''} origin-bottom-right
        `}
        style={{
          filter: 'drop-shadow(0 0 0.2rem black) drop-shadow(0 0 0.2rem black)',
          background: bgColor,
          color: textColor,
          stroke: textColor,
        }}
        onMouseEnter={onFocus}
        onMouseLeave={onBlur}
      >
        <h2 className="sr-only">Social</h2>
        <ul className="flex gap-[0.5em]">
          <li>
            <SocialLink
              title="LinkedIn"
              IconSvg={LinkedInIconSvg}
              showCTAs={showCTAs}
              href={linkedInHref}
              onFocus={onFocus}
              onBlur={onBlur}
              cursor="linked-in"
            />
          </li>
        </ul>
      </nav>
      {showBg && (
        <div
          className="top-0 left-0 fixed w-full h-full overflow-hidden z-[-1] text-[2vw] font-mono text-white break-all opacity-30"
          aria-hidden
        >
          {new Array(2000).fill(null).map(() => 'hi!')}
        </div>
      )}
    </>
  );
};
