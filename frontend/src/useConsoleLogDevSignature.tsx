/* eslint-disable no-console */
import { useTimeout } from 'usehooks-ts';

export const useConsoleLogDevSignature = () => {
  const style = 'color: white; background: blue; font-family:monospace; font-size: 20px; padding: 10px;';
  const log = (text: string) => console.log(`%c${text.toUpperCase()}`, style);
  useTimeout(() => {
    console.clear();
    log(`looking at my code, are you?
awesome! dig around!
Although you'll probably have more luck looking at the repo:`);
    console.log('%chttps://github.com/bryantcodesart/bryantcodesart', 'font-size: 15px; padding: 10px;');
    log(`hmu to nerd out about any of it!
hello@bryantcodes.art`);
  }, 1000);
};
