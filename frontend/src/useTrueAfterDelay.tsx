import { useState } from 'react';
import { useTimeout } from 'usehooks-ts';

export const useTrueAfterDelay = (timeoutLength: number) => {
  const [visible, setVisible] = useState(false);
  useTimeout(() => {
    setVisible(true);
  }, timeoutLength);
  return visible;
};
