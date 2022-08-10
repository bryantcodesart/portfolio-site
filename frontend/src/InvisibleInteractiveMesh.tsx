import React, { useEffect } from 'react';
import {
  MeshProps,
  // ThreeEvent
} from '@react-three/fiber';
import { Color } from 'three';
import { useUnmountEffect } from '@react-hookz/web';
import { useA11y } from '@react-three/a11y';
import { CustomCursorState, useCustomCursor } from './CustomCursor';
import circlePoints from './lines/circle';
import { Scribble } from './Scribble';
import { CoordArray } from './CoordArray';

export const InvisibleInteractiveMesh = ({
  width = 1,
  height = 1,
  debug = false,
  cursor = 'normal',
  onFocus = () => {},
  onBlur = () => {},
  // onPointerEnter = () => { },
  // onPointerLeave = () => { },
  // onPointerOver = () => { },
  // onPointerDown = () => { },
  ...meshProps
}: {
  width?: number;
  height?: number;
  debug?: boolean;
  cursor?: CustomCursorState;
  onFocus?: () => void;
  onBlur?: () => void;
} & MeshProps) => {
  const setCursor = useCustomCursor()[1];

  const { focus, hover } = useA11y();

  // If hovering and the target cursor changes, call setCursor to change the cursor
  useEffect(() => {
    if (hover) setCursor(cursor);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor]);

  useUnmountEffect(() => {
    if (hover) setCursor('normal');
    if (focus) onBlur();
  });

  useEffect(() => {
    if (focus || hover) onFocus();
    else onBlur();
  }, [focus, hover, onBlur, onFocus]);

  return (
    <mesh
      renderOrder={1000}
      onPointerEnter={() => {
        setCursor(cursor);
      }}
      onPointerLeave={() => {
        setCursor('normal');
      }}
      onPointerOver={() => {
        setCursor(cursor);
      }}
      {...meshProps}
    >
      <boxGeometry
        attach="geometry"
        args={[width, height, 0.01]}
      />
      <meshStandardMaterial
        attach="material"
        color={new Color(0xff0000)}
        opacity={debug ? 0.3 : 0}
        transparent
        depthTest={false}
      />
      <Scribble
        points={(circlePoints as CoordArray[])}
        size={Math.max(height, width) * 1.2}
        position={[0, 0, 0]}
        lineWidth={0.1}
        color={new Color(0xff0000)}
        rotation={[Math.PI, 0, -Math.PI / 15]}
        visible={focus}
        curved
        nPointsInCurve={100}
        drawSpringConfig={{
          duration: 300,
        }}
      />
    </mesh>
  );
};
