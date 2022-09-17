/* eslint-disable no-console */
import { useTimeout } from 'usehooks-ts';
import { useIsProbablySafari } from './useIsProbablySafari';

export const useConsoleLogDevSignature = () => {
  const isSafari = useIsProbablySafari();
  const sizeStyle = `font-size: 20px;  ${isSafari ? '' : 'display:inline-block; padding: 10px;'}`;
  const style = `color: white; background: blue; font-family:monospace; ${sizeStyle}`;
  const log = (text: string) => console.log(`%c${text.toUpperCase()}`, style);
  useTimeout(() => {
    log('looking at my code, are you?');
    log('awesome! dig around!');
    log('Although you\'ll probably have more luck looking at the repo:');
    console.log('%chttps://github.com/bryantcodesart/portfolio-site', sizeStyle);
    log('hmu to nerd out about any of it!');
    log('hello@bryantcodes.art');
  }, 1000);
};
