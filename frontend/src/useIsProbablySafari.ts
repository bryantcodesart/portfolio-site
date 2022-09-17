/* eslint-disable no-useless-escape */
import { useEffect, useState } from 'react';

export const useIsProbablySafari = () => {
  const [isProbablySafari, setIsProbablySafari] = useState(false);
  useEffect(() => {
    setIsProbablySafari(!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/));
  }, []);
  return isProbablySafari;
};
