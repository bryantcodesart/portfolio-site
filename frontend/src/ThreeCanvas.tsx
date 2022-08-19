import React from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Stats,
  useContextBridge,
} from '@react-three/drei';
import { A11yAnnouncer } from '@react-three/a11y';
import { LinearToneMapping } from 'three';
import { CustomCursorContext } from './CustomCursor';
import { SceneDirector } from './SceneDirector';
import { SiteData } from './SiteData';
import { useParamOnLoad } from './useParamOnLoad';

const ThreeCanvas = ({ siteData }:{siteData:SiteData}) => {
  const ContextBridge = useContextBridge(CustomCursorContext);
  const showStats = useParamOnLoad('stats') === 'true';
  return (
    <>
      <Canvas
        // eslint-disable-next-line no-param-reassign
        onCreated={({ gl }) => { gl.toneMapping = LinearToneMapping; }}
      >
        <ContextBridge>
          <SceneDirector siteData={siteData} />
        </ContextBridge>
        {showStats && <Stats />}
        {/* <pointLight position={[0, 0, 5]} /> */}
        <ambientLight />
      </Canvas>
      <A11yAnnouncer />
    </>
  );
};
export default ThreeCanvas;
