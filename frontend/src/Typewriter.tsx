import React, { useState } from 'react';
import { Text } from '@react-three/drei';
import { useInterval } from 'usehooks-ts';

type TextProps = React.ComponentProps<typeof Text>;

export const ThreeTextTypewriter = ({
  children, showCarat = true, timePerChar = 20, ...textProps
}:
{ children: string; showCarat?: boolean; timePerChar?:number } & TextProps) => {
  const targetText = children;
  const [text, setText] = useState('');
  const [caratVisible, setCaratVisible] = useState(false);

  useInterval(() => {
    if (!targetText.includes(text)) {
      setText('');
      return;
    }
    if (text.length < targetText.length) {
      setText(targetText.slice(0, text.length + 1));
    }
  }, timePerChar);

  useInterval(() => {
    setCaratVisible(!caratVisible);
  }, 300);

  return (
    <Text
      {...textProps}
    >
      {text + (showCarat && caratVisible ? '_' : ' ')}
    </Text>
  );
};

export const Typewriter = ({
  children, showCarat = true, timePerChar = 20, className = '',
}:{
  children: string;
  showCarat?: boolean;
  timePerChar?:number;
  className?: string;
}) => {
  const targetText = children;
  const [text, setText] = useState('');
  const [caratVisible, setCaratVisible] = useState(false);

  useInterval(() => {
    if (!targetText.includes(text)) {
      setText('');
      return;
    }
    if (text.length < targetText.length) {
      setText(targetText.slice(0, text.length + 1));
    }
  }, timePerChar);

  useInterval(() => {
    setCaratVisible(!caratVisible);
  }, 300);

  return (
    <p className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-full">
          <span className="relative">
            {text}
            <span className="absolute right-0 translate-x-full">{showCarat && caratVisible ? '_' : ''}</span>
          </span>
        </div>
        <span className="opacity-25">{targetText}</span>
      </div>
    </p>
  );
};
