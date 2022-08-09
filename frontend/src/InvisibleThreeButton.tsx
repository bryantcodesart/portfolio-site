import React from 'react';
import { MeshProps, ThreeEvent } from '@react-three/fiber';
import { Color } from 'three';
import { CustomCursorState, useCustomCursor } from './CustomCursor';

export const InvisibleThreeButton = ({
  width = 1,
  height = 1,
  debug = false,
  cursor = 'normal',
  onPointerEnter = () => { },
  onPointerLeave = () => { },
  onPointerOver = () => { },
  onPointerDown = () => { },
  ...meshprops
}: {
  width?: number;
  height?: number;
  debug?: boolean;
  onPointerEnter?: (
    _event?: ThreeEvent<PointerEvent>,
    _setCursor?:(_cursor:CustomCursorState)=>void
  ) => void;
  onPointerOver?: (
    _event?: ThreeEvent<PointerEvent>,
    _setCursor?:(_cursor:CustomCursorState)=>void
  ) => void;
  onPointerLeave?: (
    _event?: ThreeEvent<PointerEvent>,
    _setCursor?:(_cursor:CustomCursorState)=>void
  ) => void;
  onPointerDown?: (
    _event?: ThreeEvent<PointerEvent>,
    _setCursor?:(_cursor:CustomCursorState)=>void
  ) => void;
  cursor?: CustomCursorState;
} & MeshProps) => {
  const setCursor = useCustomCursor()[1];
  return (
    <mesh
      renderOrder={1000}
      visible={debug}
      onPointerEnter={(e) => {
        onPointerEnter(e, setCursor);
        setCursor(cursor);
      }}
      onPointerLeave={(e) => {
        onPointerLeave(e, setCursor);
        setCursor('normal');
      }}
      onPointerOver={(e) => {
        onPointerOver(e, setCursor);
        setCursor(cursor);
      }}
      onPointerDown={(e) => {
        onPointerDown(e, setCursor);
      }}
      {...meshprops}
    >
      <boxGeometry
        attach="geometry"
        args={[width, height, 1]}
      />
      <meshStandardMaterial
        attach="material"
        color={new Color(0xff0000)}
        opacity={0.3}
        transparent
        depthTest={false}
      />
    </mesh>
  );
};
