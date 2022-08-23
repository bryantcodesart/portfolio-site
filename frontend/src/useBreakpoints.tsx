import { useWindowSize } from 'usehooks-ts';

export const useWindowAspectRatio = () => {
  const windowSize = useWindowSize();
  const aspectRatio = windowSize.width / windowSize.height;
  return aspectRatio;
};

export const useBreakpoints = () => {
  const aspectRatio = useWindowAspectRatio();

  return {
    projects: aspectRatio >= 0.8,
    projectOpen: aspectRatio >= 1,
    menu: aspectRatio >= 1,
    about: aspectRatio >= 1,
    square: aspectRatio >= 1,
  };
};
