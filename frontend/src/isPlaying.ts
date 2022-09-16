export function isPlaying(videoElement: HTMLVideoElement) {
  return !!(
    videoElement.currentTime > 0
    && !videoElement.paused
    && !videoElement.ended
    && videoElement.readyState > 2
  );
}
