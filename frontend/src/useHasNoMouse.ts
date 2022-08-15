import { useEffect, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';

export function useHasNoMouse() {
  const [mounted, setMounted] = useState(false);
  const hasNoMouseFromMediaQuery = !useMediaQuery('(pointer: fine)');
  useEffect(() => {
    setMounted(true);
  }, []);

  const hasNoMouse = mounted ? hasNoMouseFromMediaQuery : null;

  return hasNoMouse;
}
