import { useWindowSize } from 'usehooks-ts';

// import { rangeParams } from './rangeParams';
export const useWindowAspectRatio = () => {
  const windowSize = useWindowSize();
  const aspectRatio = windowSize.width / windowSize.height;
  return aspectRatio;
};
