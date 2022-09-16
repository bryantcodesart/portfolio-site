import { useEffect, useState } from 'react';

const debugContainerId = 'brs-video-element-debug';

const createVideoElement = ({
  url, setCanPlay, id, debug = false,
}:{
  url:string,
  setCanPlay:(_canPlay:boolean)=>void,
  debug?: boolean
  id: string,
}) => {
  // const callback = () => {
  //   console.log('update', url);
  //   vid.requestVideoFrameCallback(callback);
  // };
  // vid.requestVideoFrameCallback(callback);

  if (debug) {
    let container:HTMLDivElement;
    if (!document.getElementById(debugContainerId)) {
      container = document.createElement('div');
      container.id = debugContainerId;
      container.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        border: 2px solid red;
        display: flex;
        max-width: 100%;
        flex-wrap: wrap;
        pointer-events: none;
        z-index: 88888889;
        gap: 2vw;
      `;
      document.body.appendChild(container);
    } else {
      container = (document.getElementById(debugContainerId) as HTMLDivElement);
    }
  }

  setCanPlay(false);
  const vid = document.createElement('video');
  vid.src = url;
  // vid.crossOrigin = 'Anonymous'
  vid.id = id;
  vid.loop = true;
  vid.muted = true;
  vid.playsInline = true;
  vid.autoplay = true;
  vid.oncanplay = () => {
    setCanPlay(true);
  };

  if (debug) {
    const container = document.getElementById(debugContainerId);
    vid.style.cssText = `
      height: 10vw;
    `;
    container?.appendChild(vid);
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
  options:{debug?:boolean, id?:string|null} = { debug: false, id: null },
) => {
  const videoId = options.id ?? url;

  const [canPlay, _setCanPlay] = useState(false);
  const setCanPlay = (value:boolean) => {
    _setCanPlay(value);
    if (!options.debug) return;
    const vid = document.getElementById(videoId);
    vid?.style?.setProperty('border', value ? '10px solid green' : '10px solid red');
  };

  const [videoElement, setVideoElement] = useState<HTMLVideoElement|null>(null);

  useEffect(() => {
    const vid = createVideoElement({
      setCanPlay, debug: options.debug, url, id: videoId,
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
