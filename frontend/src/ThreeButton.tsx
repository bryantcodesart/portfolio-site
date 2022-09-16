import React from 'react';
import { A11y } from '@react-three/a11y';
import { GroupProps } from '@react-three/fiber';
import { InvisibleInteractiveMesh } from './InvisibleInteractiveMesh';
import { CustomCursorState } from './CustomCursor';

export function ThreeButton({
  width,
  height,
  cursor,
  onClick = () => { },
  onFocus = () => { },
  onBlur = () => { },
  description,
  activationMsg,
  debug = false,
  ...groupProps
}: {
  width: number;
  height: number;
  cursor: CustomCursorState;
  onClick: () => void;
  onFocus: () => void;
  onBlur: () => void;
  description: string;
  activationMsg: string;
  debug?: boolean
} & GroupProps) {
  return (
    <A11y
      role="button"
      description={description}
      activationMsg={activationMsg}
      a11yElStyle={{
        pointerEvents: 'none',
        // border: '3px solid red',
        // opacity: 1,
      }}
      actionCall={onClick}
    >
      <InvisibleInteractiveMesh
        {...groupProps}
        width={width}
        height={height}
        onFocus={() => {
          onFocus();
        }}
        onBlur={() => {
          onBlur();
        }}
        // onClick={() => {
        //   onClick();
        // }}
        cursor={cursor}
        debug={debug}
      />
    </A11y>
  );
}
