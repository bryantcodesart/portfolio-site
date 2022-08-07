import { useState } from 'react';

export const useVideoElement = (url: string) => useState(() => {
  const vid = document.createElement('video');
  vid.src = url;
  vid.crossOrigin = 'Anonymous';
  vid.loop = true;
  vid.muted = true;
  vid.play();
  return vid;
});
