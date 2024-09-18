/* eslint-disable @next/next/no-img-element */
import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import { useGesture } from '@use-gesture/react';
import { useEventListener, useInterval } from 'usehooks-ts';
import { useFocusVisible } from 'react-aria';
import { event } from 'nextjs-google-analytics';
import { TerminalWindowProps } from './TerminalWindowProps';
import { DrawFill } from './DrawFill';
import { TerminalWindow } from './TerminalWindow';
// import { useImgElement } from './useImgElement';
import { CustomCursorHover } from './CustomCursor';
import { TerminalWindowButton } from './TerminalWindowButton';
import { SceneName } from './SceneController';
import { SlideName } from './SlideName';
import { contactHref } from './contactHref';
import { useBreakpoints } from './useBreakpoints';
import { aboutContent } from './aboutContent';
import { useTrueAfterDelay } from './useTrueAfterDelay';
import { useHasNoMouse } from './useHasNoMouse';

const { skills } = aboutContent;

const resolutionMultiplier = 2.0;

const DEBUG_DRAWFILLS = false;

/**
 * Improved from
 * @see https://css-tricks.com/using-requestanimationframe-with-react-hooks/
 */
export const useAnimationFrame = (callback: (_delta: number) => void) => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef<ReturnType<typeof requestAnimationFrame>>();
  const previousTimeRef = useRef<number>();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const animate = useCallback(
    (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    },
    [callback]
  );

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]); // Make sure the effect runs only once
};

const drawFatLinePath = (
  ctx: CanvasRenderingContext2D,
  [x1, y1]: [number, number],
  [x2, y2]: [number, number],
  stroke: number
) => {
  // The angle between our points
  const angle = Math.atan2(y2 - y1, x2 - x1);

  // Start on a point tangential to circle1
  ctx.moveTo(
    x1 + Math.cos(angle + Math.PI / 2) * stroke,
    y1 + Math.sin(angle + Math.PI / 2) * stroke
  );
  // Arc 180 deg to other side of c1
  ctx.arc(x1, y1, stroke, angle + Math.PI / 2, angle - Math.PI / 2);
  // Line to corresponding point on c2
  ctx.lineTo(
    x2 + Math.cos(angle - Math.PI / 2) * stroke,
    y2 + Math.sin(angle - Math.PI / 2) * stroke
  );
  // Arc 180 to other side of c2
  ctx.arc(x2, y2, stroke, angle - Math.PI / 2, angle + Math.PI / 2);

  // Closing the path takes us back to our first point
};

const draw = (
  canvas: HTMLCanvasElement,
  drawFill: DrawFill,
  x: number,
  y: number,
  prevX: number,
  prevY: number,
  onDraw: () => void
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('no ctx');
  const stroke = Math.max(canvas.width / 10, canvas.height / 10);
  const { width, height } = canvas;

  ctx.save();
  ctx.beginPath();
  drawFatLinePath(ctx, [prevX, prevY], [x, y], stroke);
  ctx.clip();
  drawFill(ctx, width, height);
  ctx.restore();

  onDraw();
};

export const DrawToRevealCanvas = ({
  drawFill,
  onDraw = () => {},
}: {
  drawFill: DrawFill;
  onDraw: () => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const drawPositionForKeyboardUsers = useRef<null | { x: number; y: number }>(
    null
  );
  const keyboardUserPaintbrushRef = useRef<HTMLImageElement | null>(null);
  const [usingKeyboard, _setUsingKeyboard] = useState(false);
  const setUsingKeyboard = (value: boolean) => {
    _setUsingKeyboard(value);
    if (value === false) {
      // @ts-ignore
      keyboardUserPaintbrushRef.current.style.setProperty('--x', '-9999px');
      // @ts-ignore
      keyboardUserPaintbrushRef.current.style.setProperty('--y', '-9999px');
    }
  };

  const arrowKeysDown = useRef<
    Set<'ArrowRight' | 'ArrowLeft' | 'ArrowUp' | 'ArrowDown'>
  >(new Set());
  useEventListener('keydown', (e) => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key))
      return;
    const arrowKey = e.key as
      | 'ArrowRight'
      | 'ArrowLeft'
      | 'ArrowUp'
      | 'ArrowDown';
    if (!arrowKeysDown.current.has(arrowKey))
      arrowKeysDown.current.add(arrowKey);
    setUsingKeyboard(true);
  });

  useEventListener('keyup', (e) => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key))
      return;
    const arrowKey = e.key as
      | 'ArrowRight'
      | 'ArrowLeft'
      | 'ArrowUp'
      | 'ArrowDown';
    if (arrowKeysDown.current.has(arrowKey))
      arrowKeysDown.current.delete(arrowKey);
  });

  useAnimationFrame(() => {
    if (!canvasRef.current || !keyboardUserPaintbrushRef.current) return;

    if (arrowKeysDown.current.size === 0) return;

    const w = canvasRef.current.width;
    const h = canvasRef.current.height;
    if (!drawPositionForKeyboardUsers.current) {
      drawPositionForKeyboardUsers.current = {
        x: w / 2,
        y: h / 2,
      };
    }

    const { x: prevX, y: prevY } = drawPositionForKeyboardUsers.current;

    const distance = w / 100;
    if (arrowKeysDown.current.has('ArrowRight')) {
      drawPositionForKeyboardUsers.current.x = Math.min(
        drawPositionForKeyboardUsers.current.x + distance,
        w
      );
    }
    if (arrowKeysDown.current.has('ArrowLeft')) {
      drawPositionForKeyboardUsers.current.x = Math.max(
        drawPositionForKeyboardUsers.current.x - distance,
        0
      );
    }
    if (arrowKeysDown.current.has('ArrowUp')) {
      drawPositionForKeyboardUsers.current.y = Math.max(
        drawPositionForKeyboardUsers.current.y - distance,
        0
      );
    }
    if (arrowKeysDown.current.has('ArrowDown')) {
      drawPositionForKeyboardUsers.current.y = Math.min(
        drawPositionForKeyboardUsers.current.y + distance,
        h
      );
    }

    // @ts-ignore
    keyboardUserPaintbrushRef.current.style.setProperty(
      '--x',
      `${drawPositionForKeyboardUsers.current.x / devicePixelRatio}px`
    );
    // @ts-ignore
    keyboardUserPaintbrushRef.current.style.setProperty(
      '--y',
      `${drawPositionForKeyboardUsers.current.y / devicePixelRatio}px`
    );

    draw(
      canvasRef.current,
      drawFill,
      drawPositionForKeyboardUsers.current.x,
      drawPositionForKeyboardUsers.current.y,
      prevX,
      prevY,
      onDraw
    );
  });

  useEventListener('mousemove', () => {
    setUsingKeyboard(false);
  });

  const gestureProps = useGesture(
    {
      // @ts-ignore
      onDrag: ({ xy, delta }) => {
        if (!canvasRef.current) return;
        const [x, y] = xy;
        const [prevX, prevY] = [x - delta[0], y - delta[1]];
        draw(canvasRef.current, drawFill, x, y, prevX, prevY, onDraw);
        setUsingKeyboard(false);
      },
    },
    {
      transform: ([x, y]) => {
        if (!canvasRef.current) return [x, y];
        const boundingRect = canvasRef.current.getBoundingClientRect();
        return [
          (x - boundingRect.left) * resolutionMultiplier,
          (y - boundingRect.top) * resolutionMultiplier,
        ];
      },
    }
  );

  // Update canvas resolution if dimensions change
  useInterval(() => {
    if (!canvasRef.current) return;
    if (
      canvasRef.current.width !==
        canvasRef.current.offsetWidth * resolutionMultiplier ||
      canvasRef.current.height !==
        canvasRef.current.offsetHeight * resolutionMultiplier
    ) {
      canvasRef.current.width =
        canvasRef.current.offsetWidth * resolutionMultiplier;
      canvasRef.current.height =
        canvasRef.current.offsetHeight * resolutionMultiplier;
    }

    // Debug drawfill
    if (DEBUG_DRAWFILLS) {
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) throw new Error('no ctx');
      const { width, height } = canvasRef.current;
      drawFill(ctx, width, height);
    }
  }, 200);

  return (
    <>
      <CustomCursorHover cursor={usingKeyboard ? 'none' : 'paint'}>
        <canvas
          ref={canvasRef}
          {...gestureProps()}
          className="top-0 left-0 w-full h-full top left touch-none"
        />
      </CustomCursorHover>
      <img
        className="w-[45px] absolute top-0 left-0 touch-none pointer-events-none"
        src="/cursor/paint.svg"
        alt=""
        style={{
          // @ts-ignore
          '--x': '-9999px',
          // @ts-ignore
          '--y': '-9999px',
          transform: 'translate(-50%, -50%) translate(var(--x), var(--y))',
        }}
        ref={keyboardUserPaintbrushRef}
      />
    </>
  );
};

// Forked and heavily edited from https://gitlab.com/davideblasutto/canvas-multiline-text/-/blob/master/index.js
type MultilineTextOptions = {
  font?: string;
  stroke?: boolean;
  verbose?: boolean;
  rect?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  lineHeight?: number;
  minFontSize?: number;
  maxFontSize?: number;
  logFunction?: (_text: string) => void;
  centerY?: boolean;
  centerX?: boolean;
  nbsp?: string;
  br?: string;
};
type Line = {
  text: string;
  x: number;
  y: number;
};
function multilineText(
  ctx: CanvasRenderingContext2D,
  text: string,
  providedOpts: MultilineTextOptions = {}
) {
  // Default options
  const opts = {
    font: 'sans-serif',
    stroke: false,
    verbose: false,
    rect: {
      x: 0,
      y: 0,
      width: ctx.canvas.width,
      height: ctx.canvas.height,
    },
    lineHeight: 1.1,
    minFontSize: 20,
    maxFontSize: 100,
    logFunction: console.log,
    centerY: false,
    centerX: false,
    nbsp: '&nbsp;',
    br: '\n',
    ...providedOpts,
  };
  if (!providedOpts.font) {
    opts.font = 'sans-serif';
  }
  if (typeof providedOpts.stroke === 'undefined') {
    opts.stroke = false;
  }
  if (typeof opts.verbose === 'undefined') {
    opts.verbose = false;
  }
  if (!opts.rect) {
    opts.rect = {
      x: 0,
      y: 0,
      width: ctx.canvas.width,
      height: ctx.canvas.height,
    };
  }

  const words = text
    .split(' ')
    .map((word) => word.trim().replaceAll(' ', '').replaceAll(opts.nbsp, ' '))
    .filter((word) => word !== '');
  if (opts.verbose) opts.logFunction(`Text contains ${words.length} words`);

  let x = opts.rect.x + (opts.centerX ? opts.rect.width / 2 : 0);
  let y = opts.rect.y + opts.minFontSize; // It's the bottom line of the letters
  let lines: Line[] = [];

  ctx.textBaseline = 'alphabetic';

  let fontSize: number;
  // Finds max font size  which can be used to print whole text in opts.rec
  for (
    fontSize = opts.minFontSize;
    fontSize <= opts.maxFontSize;
    fontSize += 1
  ) {
    // Line height
    const lineHeight = fontSize * opts.lineHeight;

    // Set font for testing with measureText()
    ctx.font = ` ${fontSize}px ${opts.font}`;

    // Start
    x = opts.rect.x + (opts.centerX ? opts.rect.width / 2 : 0);
    y = opts.rect.y + lineHeight; // It's the bottom line of the letters
    const testLines: Line[] = [];
    let line = '';

    let aWordWasTooBig = false;
    // Cycles on words
    // eslint-disable-next-line no-restricted-syntax
    for (const word of words) {
      // Add next word to line
      const linePlus = `${line + word} `;
      if (ctx.measureText(word).width > opts.rect.width) aWordWasTooBig = true;

      // If added word exceeds rect width...
      if (
        ctx.measureText(linePlus).width > opts.rect.width ||
        word === opts.br
      ) {
        // ..."prints" (save) the line without last word
        testLines.push({ text: line, x, y });
        // New line with ctx last word
        line = `${word} `;
        y += lineHeight;
      } else {
        // ...continues appending words
        line = linePlus;
      }
    }
    if (aWordWasTooBig) break;

    // "Print" (save) last line
    testLines.push({ text: line, x, y });

    // If bottom of rect is reached then breaks "fontSize" cycle
    if (y > opts.rect.height + opts.rect.y) {
      break;
    }

    // Otherwise saves lines
    lines = testLines;
  }

  if (!lines.length) {
    throw new Error('Could not draw with those constraints!');
  }

  if (opts.verbose) opts.logFunction(`Font used: ${ctx.font}`);

  if (opts.centerX) {
    ctx.textAlign = 'center';
  }

  // Print lines
  // eslint-disable-next-line no-restricted-syntax
  for (const line of lines) {
    if (opts.centerY) {
      const leftOverY =
        opts.rect.y +
        opts.rect.height -
        lines[lines.length - 1].y -
        (fontSize * opts.lineHeight) / 2;
      line.y += leftOverY / 2;
    }
    if (opts.stroke) {
      ctx.strokeText(line.text.trim(), line.x, line.y);
    } else {
      ctx.fillText(line.text.trim(), line.x, line.y);
    }
  }

  // Returns font size
  return fontSize;
}

const useAddDrawFill = (
  drawFills: [DrawFill, string][],
  text: string,
  bgColor: string,
  textColor: string,
  breakpoint: boolean
) => {
  const rotationAmountStable = useMemo(() => Math.random(), []);
  const displaceXAmountStable = useMemo(() => Math.random(), []);
  const displaceYAmountStable = useMemo(() => Math.random(), []);

  drawFills.push([
    (ctx, w, h) => {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, w, h);

      const paddingX = breakpoint ? w * 0.15 : w * 0.15;
      const paddingTop = breakpoint ? w * 0.12 : h * 0.2;
      const paddingBottom = breakpoint ? w * 0.08 : h * 0.25;

      const areaW = w - paddingX * 2;
      const areaH = h - paddingTop - paddingBottom;

      let rotationAmount = rotationAmountStable;
      let displaceXAmount = displaceXAmountStable;
      let displaceYAmount = displaceYAmountStable;

      if (DEBUG_DRAWFILLS) {
        rotationAmount = Math.random();
        displaceXAmount = Math.random();
        displaceYAmount = Math.random();

        const rotation1 = (-5 / 360) * Math.PI * 2;
        ctx.translate(w / 2, h / 2);
        ctx.rotate(rotation1);
        ctx.translate(-w / 2, -h / 2);

        ctx.fillStyle = 'black';
        ctx.rect(paddingX, paddingTop, areaW, areaH);
        ctx.fill();

        ctx.resetTransform();
      }

      const rotation =
        ((-5 + 2 * (rotationAmount * 2 - 1)) / 360) * Math.PI * 2;
      ctx.translate(w / 2, h / 2);
      ctx.rotate(rotation);
      ctx.translate(-w / 2, -h / 2);

      ctx.fillStyle = textColor;
      multilineText(ctx, text, {
        rect: {
          x: paddingX + 10 * (displaceXAmount * 2 - 1),
          y: paddingTop + 10 * (displaceYAmount * 2 - 1),
          width: areaW,
          height: areaH,
        },
        font: 'Roboto Mono',
        maxFontSize: 500,
        centerX: true,
        centerY: true,
        br: '<br>', // Fake br
        nbsp: '&nbsp;', // Fake br
      });

      ctx.resetTransform();
    },
    bgColor,
  ]);
};

export const SkillArtWindow = ({
  setScene,
  setSlide,
  ...terminalWindowProps
}: {
  setScene: (_scene: SceneName) => void;
  setSlide: (_slide: SlideName) => void;
} & Omit<TerminalWindowProps, 'children'>) => {
  const drawFills: [DrawFill, string][] = [];
  const [colorsUsed, setColorsUsed] = useState<Set<number>>(new Set());

  const breakpoints = useBreakpoints();
  const breakpoint = breakpoints.about;

  useAddDrawFill(drawFills, skills[0], 'red', 'white', breakpoint);
  useAddDrawFill(drawFills, skills[1], 'violet', 'black', breakpoint);
  useAddDrawFill(drawFills, skills[2], 'orange', 'black', breakpoint);
  useAddDrawFill(drawFills, skills[3], 'yellow', 'black', breakpoint);
  useAddDrawFill(drawFills, skills[4], 'lime', 'black', breakpoint);
  useAddDrawFill(drawFills, skills[5], 'blue', 'white', breakpoint);

  const [currentFill, setCurrentFill] = useState(0);

  const [showInstructions, setShowInstructions] = useState(true);
  const [showCta, setShowCta] = useState(false);

  const giveUserAHint = useTrueAfterDelay(8000);
  const hasNoMouse = useHasNoMouse();
  const theUserShouldHaveFiguredItOutByNow = useTrueAfterDelay(12000);

  const { isFocusVisible } = useFocusVisible({ isTextInput: true });

  return (
    <>
      <TerminalWindow
        {...terminalWindowProps}
        draggableByTitleBarOnly
        noCloseButton
      >
        <div className="grid overflow-hidden absolute top-0 left-0 place-items-center w-full h-full">
          <div
            className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%]
            rotate-[5deg] touch-none"
          >
            <DrawToRevealCanvas
              drawFill={drawFills[currentFill][0]}
              onDraw={() => {
                if (showInstructions) setShowInstructions(false);
                if (!colorsUsed.has(currentFill)) {
                  setColorsUsed(
                    (currentSet) => new Set([...currentSet, currentFill])
                  );
                  if (colorsUsed.size > 0) {
                    setShowCta(true);
                  }
                  event('skill-draw', {
                    fill: currentFill,
                  });
                }
              }}
            />
          </div>
          {showInstructions && (
            <div
              className={`
              font-display text-center
              ${giveUserAHint ? 'text-[3em]' : 'text-[4em]'}
              leading-[1] uppercase text-[#aaa]
              pointer-events-none p-[0.2em]
              max-w-[8em]
            `}
            >
              {giveUserAHint ? (
                <span>
                  Hint: Choose a color and {hasNoMouse ? 'tap' : 'click'}{' '}
                  anywhere to paint!
                </span>
              ) : (
                <span>
                  Draw on me
                  {breakpoint ? <br /> : ' '}
                  in every color
                </span>
              )}
            </div>
          )}
          <div className="flex absolute top-0 left-0">
            {drawFills.map(([_drawFill, color], index) => (
              <button
                key={color}
                onClick={() => setCurrentFill(index)}
                type="button"
                className={`grid place-items-center  border-black w-[3em] h-[3em]
                    ${currentFill === index ? 'border-[0.5em]' : 'border-2'}
                    focus-visible:scale-125
                    origin-top
                  `}
                style={{
                  backgroundColor: color,
                }}
                aria-label={color}
              />
            ))}
          </div>
        </div>
      </TerminalWindow>

      {isFocusVisible && (
        <div className="absolute bottom-0 left-0 font-mono text-white bg-black z-[5] p-[0.2em] text-[1em]">
          {"Don't use a mouse? "}
          <br />
          Paint with the arrow keys!
        </div>
      )}
      {(showCta || theUserShouldHaveFiguredItOutByNow) && (
        <TerminalWindow
          title={null}
          className={`
          justify-self-end
          ${breakpoint ? 'mt-[-1em] mr-[-1em]' : 'self-end mt-[-10em] mr-[4em]'}
        `}
        >
          <nav
            className={`
            p-[0.75em] flex gap-[0.75em]
            ${breakpoint ? 'items-end h-full' : 'flex-col items-center'}
          `}
          >
            <TerminalWindowButton
              key="art-board"
              color="black"
              bgColor="yellow"
              onClick={() => {
                setScene('menu');
                setSlide('intro');
              }}
            >
              BACK_TO_MENU
            </TerminalWindowButton>
            <TerminalWindowButton
              key="back-to-menu-and-contact"
              bgColor="yellow"
              href={contactHref}
              onClick={() => {
                event('cta', {
                  type: 'email',
                  location: 'about',
                });
              }}
            >
              CONTACT_ME
            </TerminalWindowButton>
          </nav>
        </TerminalWindow>
      )}
    </>
  );
};
