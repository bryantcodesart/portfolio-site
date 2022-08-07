import React, {
  useState, createContext, ReactNode, useContext, useMemo,
  Children, ReactElement, useEffect,
} from 'react';
import { useMouse } from 'rooks';
// import { useEventListener } from 'usehooks-ts';
import { useHasNoMouse } from './useHasNoMouse';

export type CustomCursorState = 'normal' | 'contact'
export type CustomCursorSetter = (_cursorState:CustomCursorState)=>void
export type CustomCursorArray = [CustomCursorState, CustomCursorSetter]

export const CustomCursorContext = createContext<CustomCursorArray>([
  'normal',
  (cursorState:CustomCursorState) => { console.warn(`Tried to set custom cursor to ${cursorState} before it was ready`); },
]);

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
            transform: `translate(${mouse.clientX ?? 0}px,${mouse.clientY ?? 0}px) translate(-50%,-50%)`,
            filter: 'drop-shadow(0 0 0.2rem white) drop-shadow(0 0 0.2rem white)',
          }}
        >
          {cursor === 'normal' && <div className="p-2 border-2 border-white rounded-full bg-blue min-h-2 min-w-2" />}

          {cursor === 'contact' && (
          <div className="relative grid w-12 h-12 font-mono text-xs font-extrabold text-center text-white border-2 border-white rounded-full bg-blue place-items-center">
            SAY
            <br />
            HI!
          </div>
          )}

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
