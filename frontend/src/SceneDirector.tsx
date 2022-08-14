import React, { useState } from 'react';
import { NextRouter } from 'next/router';
import { Text } from '@react-three/drei';
// import { useControls } from 'leva';
import { CameraController } from './CameraController';
import { BackgroundScribbles } from './BackgroundScribbles';
import { Computer } from './Computer';
import { CoffeeCup } from './CoffeeCup';
import { CoordArray } from './CoordArray';
import { SceneName, SceneControllerProvider } from './SceneController';
import { Notebook } from './Notebook';
import { routerLog } from './loggers';
import { SiteData } from './SiteData';
import { ProjectListing } from './ProjectListing';
// import { rangeParams } from './rangeParams';

export function SceneDirector({
  siteData,
  // eslint-disable-next-line no-unused-vars
  router,
}:
{
  siteData:SiteData,
  router: NextRouter,
}) {
  const { startingScene, projects } = siteData;

  const [scene, setScene] = useState(startingScene);

  const showCoffeeCup = scene !== 'intro' && scene !== 'start';
  const showNotebook = scene !== 'intro' && scene !== 'start';

  let cameraPosition = [0, 0, 15];
  if (scene === 'start') { cameraPosition = [-1, 0, 5.5]; }
  if (scene === 'menu') { cameraPosition = [1, 0, 6]; }
  if (scene === 'projects') { cameraPosition = [0, -12, 6.3]; }

  let coffeeCupPosition = [3.5, -0.8, 3.5];
  let coffeeCupRotation = [0, 0, 0];
  if (scene === 'projects') {
    coffeeCupPosition = [3.48, -10.60, 3.02];
    coffeeCupRotation = [0.00, 0.00, 1.88 + Math.PI * 2];
  }

  if (scene === 'error') {
    return (
      <>
        <CameraController
          position={cameraPosition as CoordArray}
        />
        <BackgroundScribbles />
        <Text fontSize={1} color="red">ERROR!</Text>
      </>
    );
  }

  return (
    <SceneControllerProvider
      value={{
        scene,
        setScene: (newScene:SceneName) => {
          routerLog('changing scene to', newScene);
          setScene(newScene);
          // router.push(`/${newScene}`, undefined, {
          //   shallow: true,
          // });
          window.history.pushState({}, '', `/${newScene}${window.location.search}`);
        },
      }}
    >
      <CameraController
        position={cameraPosition as CoordArray}
      />
      <BackgroundScribbles />
      <Computer />
      {showCoffeeCup && (
        <CoffeeCup
          rotation={coffeeCupRotation as CoordArray}
          position={coffeeCupPosition as CoordArray}
          spilled={scene === 'projects'}
        />
      )}
      {showNotebook && (
      <Notebook
        position={[4, 1.3, 2.5]}
      />
      )}
      <ProjectListing
        projects={projects}
        position={[0, -12, 1]}
        active={scene === 'projects'}
      />
    </SceneControllerProvider>
  );
}
