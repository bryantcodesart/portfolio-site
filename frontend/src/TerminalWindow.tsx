import React, { PointerEventHandler, ReactNode, useState } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { useBreakpoints } from './useBreakpoints';
import { useTrueAfterDelay } from './useTrueAfterDelay';

// import { fontUrls } from './typography';
export const TerminalWindow = ({
  children,
  title,
  className = '',
  delay = 300,
  color = 'cyan',
  topColor = 'lime',
  wrapperClassName = '',
  draggableByTitleBarOnly = false,
  noCloseButton = false,
}: {
  children: ReactNode;
  title: string | null;
  className?: string;
  delay?: number;
  color?: string;
  topColor?: string;
  wrapperClassName?: string;
  draggableByTitleBarOnly?: boolean;
  noCloseButton?: boolean;
}) => {
  const showWindow = useTrueAfterDelay(delay);
  const breakpoints = useBreakpoints();
  const [flipped, setFlipped] = useState(false);

  const dragControls = useDragControls();
  const startDrag:PointerEventHandler<HTMLDivElement> = (event) => {
    dragControls.start(event);
  };

  return (
    <div
      className={`relative select-none touch-none text-black ${className}`}
    >
      <motion.div
        // drag={draggable}
        drag
        dragMomentum={false}
        dragListener={false}
        className="relative w-full h-full text-black"
        dragControls={dragControls}
        onPointerDown={draggableByTitleBarOnly ? () => {} : startDrag}
      >
        {/* eslint-disable jsx-a11y/click-events-have-key-events  */}
        {/* eslint-disable jsx-a11y/no-static-element-interactions */}
        <div
          className={`
            ${showWindow ? '' : 'scale-0'}
            transition-transform ease-[steps(8)]
            duration-500
            font-mono
            min-h-full
            pointer-events-auto

            border-[2px] border-black overflow-hidden relative
            flex flex-col
            ${breakpoints.about ? 'text-[1em]' : 'text-[max(1em,16px)]'}
            ${flipped ? 'rotate-180' : ''}
          `}
          style={{
            boxShadow: '-0.2em -0.2em black',
          }}
          onClick={() => {
            if (flipped) {
              setFlipped(false);
            }
          }}
        >
          {/* eslint-enable jsx-a11y/click-events-have-key-events  */}
          {/* eslint-enable jsx-a11y/no-static-element-interactions */}
          {title && (
            <div
              className="border-b-[2px] border-black grid place-items-center relative"
              style={{
                backgroundColor: topColor,
              }}
              onPointerDown={draggableByTitleBarOnly ? startDrag : () => {}}
            >
              {title}
              {!noCloseButton && (
                <button
                  className={`
                    border-black border-[2px]
                    h-[0.75em] w-[0.75em]
                    absolute right-[0.5em]
                    ${flipped ? 'bg-black' : ''}
                  `}
                  aria-label="this looks like a close button, but actually turns the window upside down. lol."
                  type="button"
                  onClick={() => {
                    setFlipped(!flipped);
                  }}
                  tabIndex={-1}
                />
              )}
            </div>
          )}
          <div
            className={`flex-grow relative ${wrapperClassName}`}
            style={{
              backgroundColor: color,
            }}
          >
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
