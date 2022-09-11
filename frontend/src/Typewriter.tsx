import React, { useState } from 'react';
import { Text } from '@react-three/drei';
import { useInterval } from 'usehooks-ts';
import { useTrueAfterDelay } from './useTrueAfterDelay';

type TextProps = React.ComponentProps<typeof Text>;

export const TIME_PER_CHAR = 25;

export const ThreeTextTypewriter = ({
  children, showCarat = true, timePerChar = TIME_PER_CHAR, delay = 100, ...textProps
}:
{ children: string; showCarat?: boolean; timePerChar?:number, delay?:number } & TextProps) => {
  const targetText = children;
  const [text, setText] = useState('');
  const [caratBlinkingOn, setCaratBlinkingOn] = useState(false);

  const started = useTrueAfterDelay(delay);

  useInterval(() => {
    if (!targetText.includes(text)) {
      setText('');
      return;
    }
    if (started && text.length < targetText.length) {
      setText(targetText.slice(0, text.length + 1));
    }
  }, timePerChar);

  useInterval(() => {
    setCaratBlinkingOn(!caratBlinkingOn);
  }, 300);

  return (
    <Text
      {...textProps}
    >
      {text + (showCarat && caratBlinkingOn ? '_' : ' ')}
    </Text>
  );
};

export const Typewriter = ({
  children, showCarat = true,
  timePerChar = TIME_PER_CHAR, className = '', delay = 100,
  hideCaratAtEnd = false,
}:{
  children: string;
  showCarat?: boolean;
  timePerChar?:number;
  className?: string;
  delay?: number;
  hideCaratAtEnd?: boolean;
}) => {
  const targetText = children;
  const [text, setText] = useState('');
  const [caratBlinkingOn, setCaratBlinkingOn] = useState(false);

  const started = useTrueAfterDelay(delay);

  const finished = text.length === targetText.length;

  useInterval(() => {
    if (!targetText.includes(text)) {
      setText('');
      return;
    }
    if (started && text.length < targetText.length) {
      setText(targetText.slice(0, text.length + 1));
    }
  }, timePerChar);

  useInterval(() => {
    setCaratBlinkingOn(!caratBlinkingOn);
  }, 300);

  let caratVisible = false;
  if (started && showCarat) {
    if (caratBlinkingOn) caratVisible = true;
    if (hideCaratAtEnd && finished) caratVisible = false;
  }

  return (
    <p className={`relative ${className}`}>
      <span className="relative block">
        <span className="absolute top-0 left-0 block w-full h-full">
          <span className="relative">
            {text}
            <span className="absolute right-0 translate-x-full">{caratVisible ? '_' : ''}</span>
          </span>
        </span>
        <span className="opacity-0">{targetText}</span>
      </span>
    </p>
  );
};
