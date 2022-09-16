/* eslint-disable comma-dangle */
/* eslint-disable operator-linebreak */
import { extend, ReactThreeFiber } from '@react-three/fiber';
import { VideoTexture } from 'three';
import { isPlaying } from './isPlaying';

export class PausableVideoTexture extends VideoTexture {
  update() {
    const video = this.image;
    const hasVideoFrameCallback = 'requestVideoFrameCallback' in video;
    if (
      (hasVideoFrameCallback === false
      && video.readyState >= video.HAVE_CURRENT_DATA
      && (isPlaying(video)))
    ) {
      this.needsUpdate = true;
    }
  }
}

extend({ PausableVideoTexture });

// eslint-disable-next-line no-redeclare
export type PausableVideoTextureType = VideoTexture;

/* eslint-disable no-unused-vars */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      // eslint-disable-next-line no-undef
      'pausableVideoTexture': ReactThreeFiber.Object3DNode<PausableVideoTextureType, typeof PausableVideoTexture>;
    }
  }
}
/* eslint-enable no-unused-vars */
