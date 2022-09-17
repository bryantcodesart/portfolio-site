import React, { useEffect } from 'react';

export const usePlayAllVideosOnClickInLowPowerMode = () => {
  const [lowPowerMode, setLowPowerMode] = React.useState(false);

  // Create a test muted video element, in low power mode this will fail to play with play()
  useEffect(() => {
    let testVideo:HTMLVideoElement|null = document.createElement('video');
    testVideo.muted = true;
    testVideo.play().catch((err) => {
      console.warn('Low power mode detected via error', err);
      setLowPowerMode(true);
      testVideo?.remove();
      testVideo = null;
    });
    return () => {
      if (testVideo) {
        testVideo.remove();
        testVideo = null;
      }
    };
  }, []);

  const [userAlreadyClicked, setUserAlreadyClicked] = React.useState(false);

  // Inspired by https://shaktisinghcheema.com/how-to-autoplay-video-on-mobile-devices-on-low-power-mode/
  useEffect(() => {
    const playDummyVideoOnClick = () => {
      if (!lowPowerMode) return;
      if (userAlreadyClicked) return;
      setUserAlreadyClicked(true);

      let dummyVidToPlay:HTMLVideoElement|null = document.createElement('video');
      dummyVidToPlay.muted = true;
      dummyVidToPlay.play();
      dummyVidToPlay.remove();
      dummyVidToPlay = null;
    };
    document.body.addEventListener('click', playDummyVideoOnClick);
    document.body.addEventListener('touchstart', playDummyVideoOnClick);
    return () => {
      document.body.removeEventListener('click', playDummyVideoOnClick);
      document.body.removeEventListener('touchstart', playDummyVideoOnClick);
    };
  }, [lowPowerMode, userAlreadyClicked]);
};

export const PlayAllVideosOnClickInLowPowerMode = () => {
  usePlayAllVideosOnClickInLowPowerMode();
  return null;
};
