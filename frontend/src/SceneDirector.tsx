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
import { useWindowAspectRatio } from './useWindowAspectRatio';
import { getIsPortraitProjects } from './getIsPortraitProjects';

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

  const aspectRatio = useWindowAspectRatio();
  const isPortraitMenu = aspectRatio < 1;
  const isPortraitProjects = getIsPortraitProjects(aspectRatio);
  console.log(aspectRatio);

  const showCoffeeCup = scene !== 'intro' && scene !== 'start';
  const showNotebook = scene !== 'intro' && scene !== 'start';

  let stagePosition = [-1, 0, 3];
  let stageSize = [15, 15];
  // if (scene === 'start') { stagePosition = [0, 0, 0]; }
  if (scene === 'start') {
    stagePosition = [-1, 0, 3];
    stageSize = [5, 4];
  }
  if (scene === 'menu') {
    stagePosition = [1.25, 0, 3];
    stageSize = [8, 4.5];
    if (isPortraitMenu) {
      stagePosition = [-0.5, -1.9, 3];
      stageSize = [5, 10];
    }
  }
  if (scene === 'projects') {
    stagePosition = [0.5, -12, 3];
    stageSize = [8.5, 5.5];

    if (isPortraitProjects) {
      stagePosition = [0, -14.5, 3];
      stageSize = [5, 10];
    }
  }

  let coffeeCupPosition = isPortraitMenu ? [0.5, -4.3, 4.5] : [3.5, -0.8, 3.5];
  let coffeeCupRotation = [0, 0, 0];

  if (scene === 'projects') {
    coffeeCupPosition = [3.48, -10.60, 3.02];
    coffeeCupRotation = [0.00, 0.00, 1.88 + Math.PI * 2];

    if (isPortraitProjects) {
      coffeeCupPosition = [1.5, -11.5, 3.02];
      coffeeCupRotation = [0.00, 0.00, 2 + Math.PI * 2];
    }
  }

  const noteBookPosition = isPortraitMenu ? [-1.8, -4, 3] : [4, 1.3, 2.5];

  if (scene === 'error') {
    return (
      <>
        <CameraController
          stagePosition={stagePosition as CoordArray}
          stageSize={stageSize as [number, number]}
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
        stagePosition={stagePosition as CoordArray}
        stageSize={stageSize as [number, number]}
        debug
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
        position={noteBookPosition as CoordArray}
      />
      )}
      <ProjectListing
        projects={projects}
        position={[0, isPortraitProjects ? -15 : -12, 1]}
        active={scene === 'projects'}
      />
    </SceneControllerProvider>
  );
}
