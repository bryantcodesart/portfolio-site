import { useState } from 'react';
import { useInterval } from 'usehooks-ts';
import colors from './colors';

const {
  blue, cyan, violet, yellow, lime, white, black,
} = colors;
const colorPairs = [
  [blue, white],
  [yellow, black],
  [cyan, black],
  [violet, white],
  [lime, black],
];

export const useChangingColorPalette = (speed: number) => {
  const [colorIndex, setColorIndex] = useState(0);
  useInterval(() => {
    setColorIndex((index) => (index + 1) % colorPairs.length);
    // setCtaIndex((index) => (index + 1) % ctas.length);
  }, speed);

  return {
    bgColor: colorPairs[colorIndex][0],
    textColor: colorPairs[colorIndex][1],
  };
};
