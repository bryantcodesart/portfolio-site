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
  children, showCarat = true, timePerChar = 40, className = '',
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
    <pre className={className}>{text + (showCarat && caratVisible ? '_' : '')}</pre>
  );
};
