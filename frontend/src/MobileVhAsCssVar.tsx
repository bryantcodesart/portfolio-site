import React, { useState } from 'react';
import { useEventListener } from 'usehooks-ts';

export const MobileVhAsCssVar = () => {
  const [vh, setVh] = useState('1vh');
  const calculateAndSetVh = () => {
    setVh(`${window.innerHeight * 0.01}px`);
  };
  React.useEffect(calculateAndSetVh, []);
  useEventListener('resize', calculateAndSetVh);
  return (
    <style>
      {`
      :root {
        --vh: ${vh};
      }
    `}
    </style>
  );
};
