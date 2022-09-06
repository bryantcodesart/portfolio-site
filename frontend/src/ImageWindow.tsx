import Image from 'next/image';
import React from 'react';
import { TerminalWindow } from './TerminalWindow';
import { TerminalWindowProps } from './TerminalWindowProps';


export const ImageWindow = ({
  srcs, alts, positions, ...terminalWindowProps
}: {
  srcs: string[];
  alts: string[];
  positions: (string | number)[];
} & Omit<TerminalWindowProps, 'children'>) => (
  <TerminalWindow
    {...terminalWindowProps}
  >
    <Image src={srcs[0]} layout="fill" objectFit="cover" objectPosition={positions[0]} alt={alts[0]} className="pointer-events-none" />
  </TerminalWindow>
);
