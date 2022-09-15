import React from 'react';
import { Typewriter, TIME_PER_CHAR } from './Typewriter';
import { TerminalWindow } from './TerminalWindow';
import { TerminalWindowProps } from './TerminalWindowProps';
import { TerminalWindowButton } from './TerminalWindowButton';

export const TextWindow = ({
  texts, buttonColor = 'cyan', buttonText = 'button!', onClick = () => { }, textMargin = '1em', noButton = false, disabled = false, icon = null, ...terminalWindowProps
}: {
  texts: string[];
  buttonColor?: string;
  buttonText?: string | null;
  textMargin?: string;
  noButton?: boolean;
  disabled?: boolean;
  icon?: string | null;
  onClick?: () => void;
} & Omit<TerminalWindowProps, 'children'>) => {
  const pauseBetween = 500;
  const startDelay = 500;
  const delays = [startDelay, ...texts.map((text, i, array) => {
    const charCountSoFar = array.slice(0, i + 1).reduce((acc, cur) => acc + cur.length, 0);
    return startDelay + charCountSoFar * TIME_PER_CHAR + pauseBetween * (i + 1);
  })];
  return (
    <TerminalWindow {...terminalWindowProps}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {icon && <img src={icon} alt="fake computer icon" className="w-[20%] h-auto m-auto mb-[1em] pointer-events-none" />}
      {texts.map((text, i, array) => (
        <div
          style={{ marginTop: i !== 0 ? textMargin : 0 }}
          key={text}
        >
          <Typewriter
            delay={delays[i]}
            hideCaratAtEnd={i !== array.length - 1}
          >
            {text}
          </Typewriter>
        </div>
      ))}
      {!noButton && (
        <div className="grid place-items-center mt-[2em]">
          <TerminalWindowButton
            onClick={onClick}
            delay={delays[delays.length - 1]}
            color="black"
            bgColor={buttonColor}
            disabled={disabled}
          >
            {buttonText}
          </TerminalWindowButton>
        </div>
      )}
    </TerminalWindow>
  );
};
