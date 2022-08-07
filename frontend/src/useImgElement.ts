import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { Texture } from 'three';

export const useImgElement = (
  url: string,
) => {
  const [img] = useState<HTMLImageElement>(() => {
    const newImg = document.createElement('img');
    newImg.src = url;
    newImg.crossOrigin = 'Anonymous';
    return newImg;
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loaded = () => {
      setIsLoaded(true);
    };
    if (img.complete && img.naturalHeight !== 0) {
      loaded();
    } else {
      img.onload = loaded;
    }
  }, []);

  return { img, isLoaded };
};

export const useImgElementTexture = (url: string) => {
  const { img, isLoaded } = useImgElement(url);
  const [texture] = useState<Texture>(() => new THREE.Texture(img));

  useEffect(() => {
    if (isLoaded) texture.needsUpdate = true;
  }, [texture, isLoaded]);

  return texture;
};
