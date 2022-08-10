import React, {
  useState, createContext, ReactNode, useContext, useMemo,
  Children, ReactElement, useEffect,
} from 'react';
import { useMouse } from 'rooks';
// import { useEventListener } from 'usehooks-ts';
import { useHasNoMouse } from './useHasNoMouse';

export type CustomCursorState = 'none' | 'normal' | 'contact' | 'computer-on' | 'terminal'
export type CustomCursorSetter = (_cursorState:CustomCursorState)=>void
export type CustomCursorArray = [CustomCursorState, CustomCursorSetter]

export const CustomCursorContext = createContext<CustomCursorArray>([
  'normal',
  (cursorState:CustomCursorState) => { console.warn(`Tried to set custom cursor to ${cursorState} outside of <CustomCursorProvider>`); },
]);

/**
 * @returns [cursorState, setCursorState]
 */
export const useCustomCursor = () => useContext(CustomCursorContext);

export function CustomCursorProvider({ children }:{children:ReactNode}) {
  const mouse = useMouse();
  const [cursor, setCursor] = useState<CustomCursorState>('normal');

  const customCursorStateArray = useMemo(() => [cursor, setCursor] as CustomCursorArray, [cursor]);

  // const determineCursorFromEventTarget = (e:Event) => {
  //   let newCursor = 'normal';

  //   const dataAttributeCursor =
  // ((e.target as HTMLElement)?.closest('[data-cursor]') as HTMLElement)?.dataset?.cursor;

  //   if (dataAttributeCursor) {
  //     newCursor = dataAttributeCursor;
  //   }

  //   if (newCursor !== cursor) {
  //     setCursor(newCursor);
  //   }
  // };
  // useEventListener('mousemove', determineCursorFromEventTarget);
  // useEventListener('mouseup', determineCursorFromEventTarget);
  // useEventListener('mousedown', determineCursorFromEventTarget);

  const hasNoMouse = useHasNoMouse();

  return (
    <>
      <CustomCursorContext.Provider value={customCursorStateArray}>
        {children}
      </CustomCursorContext.Provider>
      {!hasNoMouse ? (
        <div
          className="pointer-events-none fixed top-0 left-0 z-[1000]"
          style={{
            transform: `translate(${mouse.clientX ?? 0}px,${mouse.clientY ?? 0}px)`,
            filter: cursor !== 'terminal' ? 'drop-shadow(0 0 0.2rem black) drop-shadow(0 0 0.2rem black)' : '',
          }}
        >
          {cursor === 'normal' && <img className="w-[3vw]" src="/cursor/normal.svg" alt="" />}

          {cursor === 'computer-on' && <img className="w-[3vw]" src="/cursor/normal.svg" alt="" />}
          {cursor === 'contact' && <img className="w-[3vw]" src="/cursor/normal.svg" alt="" />}

          {cursor === 'terminal' && <img className="w-[1vw]" src="/cursor/terminal.svg" alt="" />}

        </div>
      ) : null}
    </>
  );
}

export function CustomCursorHover({ children, cursor: targetCursor }:
  { children: ReactElement; cursor: CustomCursorState; }) {
  const setCursor = useCustomCursor()[1];
  const child = Children.only(children);
  const [hovering, setHovering] = useState(false);

  // If hovering and the targetcursor changes, call setCursor to change the cursor
  useEffect(() => {
    if (hovering) setCursor(targetCursor);
  }, [targetCursor]);

  return React.cloneElement(child, {
    onMouseEnter: () => {
      setCursor(targetCursor);
      setHovering(true);
    },
    onMouseLeave: () => {
      setCursor('normal');
      setHovering(false);
    },
  });
}
