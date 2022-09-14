import React from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Stats,
} from '@react-three/drei';
import { A11yAnnouncer } from '@react-three/a11y';
import { LinearToneMapping } from 'three';
import { SceneDirector } from './SceneDirector';
import { SiteData } from './SiteData';
import { useParamOnLoad } from './useParamOnLoad';

const ThreeCanvas = ({ siteData }:{siteData:SiteData}) => {
  const showStats = useParamOnLoad('stats') === 'true';

  return (
    <>
      <Canvas
        // eslint-disable-next-line no-param-reassign
        onCreated={({ gl }) => { gl.toneMapping = LinearToneMapping; }}
      >
        <SceneDirector siteData={siteData} />
        {showStats && <Stats />}
        <ambientLight />
      </Canvas>
      <A11yAnnouncer />
    </>
  );
};
export default ThreeCanvas;
