import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Stats,
  useContextBridge,
} from '@react-three/drei';
import { A11yAnnouncer } from '@react-three/a11y';
import { CameraController } from './CameraController';
import { CustomCursorContext } from './CustomCursor';
// import bookFillPoints from './lines/bookFill';
// import bookLinesPoints from './lines/bookLines';
// import bookHighlightPoints from './lines/bookHighlight';
import { BackgroundScribbles } from './BackgroundScribbles';
import { Computer } from './Computer';
import { CoffeeCup } from './CoffeeCup';
import { CoordArray } from './CoordArray';
import { SceneName, SceneControllerProvider } from './SceneControllerProvider';

function SceneDirector() {
  const [scene, setScene] = useState<SceneName>('loading');

  // const [blogButtonVisible1, setBlogButtonVisible1] = useState(false);
  // const [blogButtonVisible2, setBlogButtonVisible2] = useState(false);
  // const [blogButtonVisible3, setBlogButtonVisible3] = useState(false);

  const showCoffeeCup = scene === 'menu';

  let cameraPosition = [0, 0, 15];
  if (scene === 'start') cameraPosition = [-1, 0, 5.5];
  if (scene === 'menu') cameraPosition = [1, 0, 6];

  return (
    <SceneControllerProvider value={{ scene, setScene }}>
      <CameraController
        position={cameraPosition as CoordArray}
      />
      <BackgroundScribbles />
      <Computer />
      {showCoffeeCup && <CoffeeCup />}
      {/* <animated.group
        position={[3, -0.8, 3.5]}
      >
        <Scribble
          points={(bookFillPoints as CoordArray[])}
          size={1.5}
          position={[0.2, 0, -0.3]}
          lineWidth={0.5}
          color={new Color(0x00FFff)}
          rotation={[Math.PI, 0, 0]}
          visible={blogButtonVisible2}
          drawSpringConfig={config.molasses}
          curved
          nPointsInCurve={100}
        />
        <Scribble
          points={(bookHighlightPoints as CoordArray[])}
          size={1}
          position={[0.2, 0, -0.1]}
          lineWidth={0.3}
          color={new Color(0x00ff00)}
          rotation={[Math.PI, 0, 0]}
          visible={blogButtonVisible3}
        />
        <Scribble
          points={(bookLinesPoints as CoordArray[])}
          size={1.5}
          position={[0, 0, 0]}
          lineWidth={0.015}
          color={new Color(0x000000)}
          rotation={[Math.PI, 0, 0]}
          visible={blogButtonVisible1}
          curved
          nPointsInCurve={700}
        />
        <Text
          position={[0, 0, 0.1]}
          rotation={[0, 0, 0]}
          color="black"
          anchorX="center"
          anchorY="middle"
          fontSize={0.25}
          font={fontUrls.bryantBold}
          visible={blogButtonVisible1}
        >
          {'Blog\ncoming\nsoon'.toUpperCase()}
        </Text>
      </animated.group> */}
    </SceneControllerProvider>
  );
}

const ThreeCanvas = () => {
  const ContextBridge = useContextBridge(CustomCursorContext);
  const showStats = new URLSearchParams(window.location.search).get('stats') === 'true';
  return (
    <>
      <Canvas>
        <ContextBridge>
          <SceneDirector />
        </ContextBridge>
        {showStats && <Stats />}
        <ambientLight intensity={1} />
      </Canvas>
      <A11yAnnouncer />
    </>
  );
};
export default ThreeCanvas;
