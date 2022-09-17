/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import { useTimeout } from 'usehooks-ts';

const useIsProbablySafari = () => {
  const [isProbablySafari, setIsProbablySafari] = useState(false);
  useEffect(() => {
    setIsProbablySafari(!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/));
  }, []);
  return isProbablySafari;
};

export const useConsoleLogDevSignature = () => {
  const isSafari = useIsProbablySafari();
  const sizeStyle = isSafari ? '' : 'font-size: 20px; padding: 10px;';
  const style = `color: white; background: blue; font-family:monospace; ${sizeStyle}`;
  const log = (text: string) => console.log(`%c${text.toUpperCase()}`, style);
  useTimeout(() => {
    console.clear();
    log(`looking at my code, are you?
awesome! dig around!
Although you'll probably have more luck looking at the repo:`);
    console.log('%chttps://github.com/bryantcodesart/bryantcodesart', sizeStyle);
    log(`hmu to nerd out about any of it!
hello@bryantcodes.art`);
  }, 1000);
};
