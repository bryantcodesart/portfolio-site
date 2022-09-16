import { useEffect, useState } from 'react';

/* eslint-enable no-unused-vars */
/**
 * Returns a boolean state variable that follows @param target with a delay,
 * @param trueDelay for turning from false to true (ms)
 * and likewise @param falseDelay for turning from true to false (ms).
 * Pass null to either @param trueDelay or @param falseDelay to not use a timeout and set instantly
 */
export const useDelayedBoolean = (target: boolean, trueDelay: number | null, falseDelay: number | null) => {
  const [delayedBoolean, setDelayedBoolean] = useState(false);
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (target) {
      if (trueDelay === null) { setDelayedBoolean(true); } else {
        timeout = setTimeout(() => {
          setDelayedBoolean(true);
        }, trueDelay);
      }
    } else if (falseDelay === null) { setDelayedBoolean(false); } else {
      timeout = setTimeout(() => {
        setDelayedBoolean(false);
      }, falseDelay);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [falseDelay, target, trueDelay]);

  return delayedBoolean;
};
