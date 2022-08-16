import { useEffect, useState } from 'react';

const createVideoElement = ({ url, setCanPlay, debug = false }:{
  url:string,
  setCanPlay:(_canPlay:boolean)=>void,
  debug?: boolean
}) => {
  setCanPlay(false);
  const vid = document.createElement('video');
  vid.src = url;
  // vid.crossOrigin = 'Anonymous';
  vid.loop = true;
  vid.muted = true;
  vid.playsInline = true;
  vid.autoplay = true;
  vid.oncanplay = () => {
    setCanPlay(true);
  };

  if (debug) {
    const containerId = 'brs-video-element-debug';
    let container:HTMLDivElement;
    if (!document.getElementById(containerId)) {
      container = document.createElement('div');
      container.id = containerId;
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        border: 2px solid red;
        display: flex;
        max-width: 100%;
        flex-wrap: wrap;
        pointer-events: none;
      `;
      document.body.appendChild(container);
    } else {
      container = (document.getElementById(containerId) as HTMLDivElement);
    }
    vid.style.cssText = `
      height: 10vw;
    `;
    container.appendChild(vid);
  }
  return vid;
};

const destroyVideoElement = ({ videoElement, setCanPlay }:{
  videoElement:HTMLVideoElement,
  setCanPlay:(_canPlay:boolean)=>void,
}) => {
  setCanPlay(false);
  videoElement.pause();
  videoElement.removeAttribute('src'); // empty source
  videoElement.load();
  videoElement.remove();
};

export const useVideoElement = (
  url: string,
  playing:boolean = true,
  options:{debug?:boolean} = { debug: false },
) => {
  const [canPlay, setCanPlay] = useState(false);

  const [videoElement, setVideoElement] = useState<HTMLVideoElement|null>(null);

  useEffect(() => {
    const vid = createVideoElement({
      setCanPlay, debug: options.debug, url,
    });
    setVideoElement(vid);
    return () => {
      destroyVideoElement({ videoElement: vid, setCanPlay });
    };
  }, [options.debug, url]);

  useEffect(() => {
    if (!videoElement) return;
    if (!canPlay) return;
    if (playing) {
      // if (!isPlaying(videoElement)) return;
      videoElement.play();
    } else {
      videoElement.pause();
    }
  }, [playing, videoElement, canPlay]);

  return { videoElement, canPlay };
};
