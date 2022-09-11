import React from 'react';
import { useEventListener } from 'usehooks-ts';

const setMobileViewPortUnitsAsCSSVar = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};
export const useMobileViewPortUnits = () => {
  React.useEffect(() => {
    setMobileViewPortUnitsAsCSSVar();
  }, []);
  useEventListener('resize', setMobileViewPortUnitsAsCSSVar);
};
