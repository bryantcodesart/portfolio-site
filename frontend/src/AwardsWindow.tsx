/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { TerminalWindowProps } from './TerminalWindowProps';
import { TerminalWindow } from './TerminalWindow';
import { SceneName } from './SceneController';
import { SlideName } from './SlideName';

export const AwardsWindow = ({
  // setScene, setSlide,
  ...terminalWindowProps
}: {
  setScene: (_scene: SceneName) => void;
  setSlide: (_slide: SlideName) => void;
} & Omit<TerminalWindowProps, 'children'>) => (
  <TerminalWindow {...terminalWindowProps} draggableByTitleBarOnly>
    <div className="grid grid-cols-5 grid-rows-5" />
  </TerminalWindow>
);
