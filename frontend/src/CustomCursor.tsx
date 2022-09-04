import React, {
  Children,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useEventListener } from 'usehooks-ts';
import create from 'zustand';
import { useHasNoMouse } from './useHasNoMouse';
import { useParamOnLoad } from './useParamOnLoad';

/** Allowed cursor state names (project specific) */
export type CustomCursorState = null
 | 'normal'
 | 'contact'
 | 'computer-on'
 | 'terminal'
 | 'spill'
 | 'open-project'
 | 'close-project'
 | 'unspill'
 | 'paint'
 | 'external'

/** How we render the cusror based on its state (project specific) */
export const CustomCursorRenderer = ({ cursor }:{cursor:CustomCursorState}) => {
  const textCursor = cursor !== 'terminal' && cursor !== 'paint';
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
          font-mono text-white text-center leading-[0.8] text-[12px]
          -translate-x-1/2 -translate-y-1/2
          h-[75px] w-[75px]
          transition-all
          ${cursor === 'normal' ? 'scale-[0.25]' : ''}
          ${!textCursor ? 'opacity-0' : ''}
          grid place-items-center
        `}
        style={{ backgroundImage: 'url(/cursor/circle.svg)' }}
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
      </div>
    </div>
  );
};

// Put the cursor state in a zustand store
// We prefer this to a context because its faster and we can consume it across R3F render boundaries
const useCustomCursorStore = create<{
  cursor:CustomCursorState,
  setCursor:(_cursorState:CustomCursorState)=>void,
    }>((set) => ({
      cursor: 'normal',
      setCursor: (cursorState:CustomCursorState) => set({ cursor: cursorState }),
    }));

// Hooks to use cursor state in components
export const useCursorSetter = () => useCustomCursorStore((state) => state.setCursor);
export const useCursor = () => useCustomCursorStore((state) => state.cursor);

// Is element an iframe?
const isIframe = (el:HTMLElement|null) => el?.tagName?.toLowerCase() === 'iframe';

// Determine if mouse is in document (and hasnt exited the window or entered an iframe)
const useMouseIsInDocument = () => {
  const [inDocument, setInDocument] = useState(false);

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
    <div
      className="pointer-events-none fixed top-0 left-0 z-[99999999]"
      ref={mouseDivRef}
    >
      {enabled ? (
        <>
          <style>
            {cursor && `* {
              cursor: none !important;
            }`}
          </style>
          <CustomCursorRenderer cursor={cursor} />
        </>
      ) : null}
    </div>
  );
}

/** A convenience component wrapper that gives its only child a specified cursor on hover */
export function CustomCursorHover({ children, cursor: targetCursor, defaultCursor = 'normal' }:
  { children: ReactElement; cursor: CustomCursorState; defaultCursor?:CustomCursorState }) {
  const setCursor = useCursorSetter();
  const child = Children.only(children);
  const [hovering, setHovering] = useState(false);

  // If hovering and the targetcursor changes, call setCursor to change the cursor
  useEffect(() => {
    if (hovering) setCursor(targetCursor);
  }, [hovering, setCursor, targetCursor]);

  return React.cloneElement(child, {
    onMouseEnter: () => {
      setCursor(targetCursor);
      setHovering(true);
    },
    onMouseLeave: () => {
      setCursor(defaultCursor);
      setHovering(false);
    },
  });
}
