import React, {
  Children,
  ReactElement,
  // ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  useEventListener,
  // useInterval
} from 'usehooks-ts';
import create from 'zustand';
import createVanilla from 'zustand/vanilla';
import { PreloadLocalSvg } from './PreloadLocalSvg';
// import { Html } from '@react-three/drei';
import { useHasNoMouse } from './useHasNoMouse';
import { useParamOnLoad } from './useParamOnLoad';

/** Allowed cursor state names (project specific) */
export type CustomCursorState = null
 | 'default'
 | 'contact'
 | 'computer-on'
 | 'terminal'
 | 'spill'
 | 'open-project'
 | 'close-project'
 | 'unspill'
 | 'paint'
 | 'external'
 | 'none'
 | 'linked-in'
 | 'twitter'

/** Cant use <Head> tag or SSR inside CustomCursorRenderer,
  * since it conditionally runs based on user env
  * and is designed not to render on the server.
  * Instead add any preloads here.
  * It is REALLY smart to preload custom cursor assets--
  * you dont want an invisible cursor because an asset hasnt loaded!
  *  */
const CustomCursorPreloads = () => (
  <>
    <PreloadLocalSvg href="/cursor/terminal.svg" />
    <PreloadLocalSvg href="/cursor/paint.svg" />
  </>
);

/** How we render the cusror based on its state (project specific) */
const CustomCursorRenderer = ({ cursor }:{cursor:CustomCursorState}) => {
  const textCursor = cursor !== 'terminal' && cursor !== 'paint' && cursor !== 'none';
  return (
    <div
      style={{
        filter: textCursor ? 'drop-shadow(0 0 0.2rem black) drop-shadow(0 0 0.2rem black)' : 'drop-shadow(0 0 0.1rem black) drop-shadow(0 0 0.1rem black)',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {cursor === 'terminal' && <img className="w-[30px]" src="/cursor/terminal.svg" alt="" />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {cursor === 'paint' && <img className="w-[45px]" src="/cursor/paint.svg" alt="" />}
      <div
        className={`
          bg-contain bg-center
          font-mono text-white text-center leading-[1] text-[12px]
          -translate-x-1/2 -translate-y-1/2
          h-[75px] w-[75px]
          transition-all
          ${cursor === 'default' ? 'scale-[0.25]' : ''}
          ${!textCursor ? 'opacity-0' : ''}
          grid place-items-center
          bg-blue rounded-full border-[5px] border-white
        `}
      >
        {cursor === 'computer-on' && (
          <>
            boot up
          </>
        )}
        {cursor === 'contact' && (
          <>
            say hi!
          </>
        )}
        {cursor === 'spill' && (
          <>
            spill
            <br />
            coffee
          </>
        )}
        {cursor === 'unspill' && (
          <>
            unspill
          </>
        )}
        {cursor === 'open-project' && (
          <>
            explore
          </>
        )}
        {cursor === 'close-project' && (
          <>
            go back
          </>
        )}
        {cursor === 'external' && (
          <>
            visit
          </>
        )}
        {cursor === 'linked-in' && (
          <>
            LinkedIn
          </>
        )}
        {cursor === 'twitter' && (
          <>
            Twitter
          </>
        )}
      </div>
    </div>
  );
};

// Put the cursor state in a zustand store
// We prefer this to a context because its faster and we can consume it across R3F render boundaries
// Build a vanilla store so we can use it in our useSceneController store as well
// We'll also convert it into a react store for consumption in components, below
export const useCustomCursorVanillaStore = createVanilla<{
  cursor: CustomCursorState,
  currentlyHovering: Map<Symbol, CustomCursorState>
  startHover:(_cursorState:CustomCursorState, _id:Symbol)=>void,
  stopHover:(_id:Symbol)=>void,
  clearAllHovers:()=>void,
    }>((set) => ({
      cursor: 'default',
      currentlyHovering: new Map(),
      removeHoverById: (id:Symbol) => set((state) => {
        const newMap = new Map(state.currentlyHovering);
        newMap.delete(id);
        return { currentlyHovering: newMap };
      }),
      startHover: (newCursor, id) => set((state) => {
        const newMap = new Map(state.currentlyHovering);
        newMap.delete(id);
        newMap.set(id, newCursor);
        return { currentlyHovering: newMap };
      }),
      stopHover: (id) => set((state) => {
        const newMap = new Map(state.currentlyHovering);
        newMap.delete(id);
        return { currentlyHovering: newMap };
      }),
      clearAllHovers: () => { set(() => ({ currentlyHovering: new Map() })); },
    }));

export const useCustomCursorStore = create(useCustomCursorVanillaStore);

// Hooks to manage hover state in components
export const useCursorSetters = () => {
  const id = useMemo(() => Symbol('hoverable-thing'), []);
  return useCustomCursorStore((state) => ({
    startHover: (cursor:CustomCursorState) => state.startHover(cursor, id),
    stopHover: () => state.stopHover(id),
  }));
};
export const useClearHover = () => useCustomCursorStore((state) => state.clearAllHovers);
export const useCursor = () => useCustomCursorStore((state) => {
  const lastValueInCurrentlyHovering = [...state.currentlyHovering.values()].pop();
  return lastValueInCurrentlyHovering ?? 'default';
});

// Is element an iframe?
const isIframe = (el:HTMLElement|null) => el?.tagName?.toLowerCase() === 'iframe';

// Determine if mouse is in document (and hasnt exited the window or entered an iframe)
const useMouseIsInDocument = () => {
  const [inDocument, setInDocument] = useState(true);

  useEffect(() => {
    // Detect exiting window
    const handleMouseleave = () => {
      setInDocument(false);
    };

    // Detect entering window
    const handleMouseenter = () => {
      setInDocument(true);
    };

    // Detect entering and exiting an iframe
    const handleMouseout = (e:MouseEvent) => {
      if (isIframe(e.relatedTarget as HTMLElement|null)) {
        setInDocument(false);
      }
      if (isIframe(e.target as HTMLElement|null)) {
        setInDocument(true);
      }
    };

    // Left window
    document.addEventListener('mouseleave', handleMouseleave);
    document.addEventListener('mouseenter', handleMouseenter);
    document.addEventListener('mouseout', handleMouseout);

    return () => {
      document.removeEventListener('mouseleave', handleMouseleave);
      document.removeEventListener('mouseenter', handleMouseenter);
      document.removeEventListener('mouseout', handleMouseout);
    };
  });

  return inDocument;
};

export function CustomCursor() {
  // We wont show the cursor until the user has moved it
  // (otherwise it hangs in its original default position and is ugly)
  const [hasMoved, setHasMoved] = useState(false);

  // Now determine if we should show the cursor

  // Does the user even have a mouse?
  const hasMouse = !useHasNoMouse();

  // Are we inside the document? (and e.g. not in an iframe?)
  const inDocument = useMouseIsInDocument();

  // Have we been told to hide the cursor via param?
  const disabledByParam = useParamOnLoad('cursor', 'true') === 'false';

  // Is the current cursor not name null--e.g. we have decided not to show the mouse via app logic?
  const cursor = useCursor();

  // If we answered all these correctly, its enabled.
  const enabled = hasMouse && hasMoved && !disabledByParam && cursor && inDocument;

  // Animate our div to follow the mouse, use ref/mutation because its WAY faster than state.
  const mouseDivRef = useRef<HTMLDivElement>(null);
  useEventListener('mousemove', (e) => {
    if (!hasMoved) setHasMoved(true);
    if (!mouseDivRef.current) return;
    mouseDivRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });

  return (
    <>
      <CustomCursorPreloads />
      <style>
        {cursor && `* {
        cursor: none !important;
      }`}
      </style>
      <div
        className="pointer-events-none fixed top-0 left-0 z-[99999999]"
        ref={mouseDivRef}
      >
        {enabled ? (
          <CustomCursorRenderer cursor={cursor} />
        ) : null}
      </div>
    </>
  );
}

/** A convenience component wrapper that gives its only child a specified cursor on hover */
export function CustomCursorHover({
  children, cursor: targetCursor,
  onMouseEnter = () => {}, onMouseLeave = () => {},
}:{
  children: ReactElement;
  cursor: CustomCursorState;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const { startHover, stopHover } = useCursorSetters();
  const child = Children.only(children);
  const [hovering, setHovering] = useState(false);

  // If hovering and the targetcursor changes, call setCursor to change the cursor
  useEffect(() => {
    if (hovering) startHover(targetCursor);
    // Very easy to make an infinite loop here, only dep is targetCursor
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetCursor]);

  // End hover if I get deleted
  useEffect(() => () => {
    stopHover();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return React.cloneElement(child, {
    onMouseEnter: () => {
      startHover(targetCursor);
      setHovering(true);
      onMouseEnter();
    },
    onMouseLeave: () => {
      stopHover();
      setHovering(false);
      onMouseLeave();
    },
  });
}

// type HtmlProps = React.ComponentProps<typeof Html>
// // eslint-disable-next-line no-shadow
// export const DreiHtmlWithCursor = ({ children, ...HtmlProps }:
//   { children: ReactNode } & HtmlProps) => {
//   const clearHover = useClearHover();
//   return (
//     <Html
//       {...HtmlProps}
//       onPointerLeave={() => {
//         console.log('clear!');
//         clearHover();
//       }}
//     >
//       {children}
//     </Html>
//   );
// };
