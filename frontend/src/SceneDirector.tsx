import React, { useEffect } from 'react';
import { Text } from '@react-three/drei';
// import { useControls } from 'leva';
import { CameraController } from './CameraController';
import { BackgroundScribbles } from './BackgroundScribbles';
import { Computer } from './Computer';
import { CoffeeCup } from './CoffeeCup';
import { CoordArray } from './CoordArray';
import { useSceneController } from './SceneController';
import { Notebook } from './Notebook';
// import { routerLog } from './loggers';
import { SiteData } from './SiteData';
import { ProjectListing } from './ProjectListing';
import { useBreakpoints } from './useBreakpoints';
// import { useClearHover } from './CustomCursor';

export function SceneDirector({
  siteData,
}:
{
  siteData:SiteData,
}) {
  const { startingScene, projects } = siteData;

  const { scene, setScene } = useSceneController();
  useEffect(() => {
    setScene(startingScene);
  }, [setScene, startingScene]);
  // const [scene, _setScene] = useState(startingScene);
  // const setScene = (newScene:SceneName) => { _setScene(newScene); clearCursor(); };

  const breakpoints = useBreakpoints();

  const showCoffeeCup = scene !== 'intro' && scene !== 'start';
  const showNotebook = scene !== 'intro' && scene !== 'start';

  const projectListingPosition = [0, breakpoints.projects ? -12 : -11, 1];

  let stagePosition = [-1, 0, 3];
  let stageSize = [15, 15];
  // if (breakpoints.menu) {
  //   stageSize = [15, 15];
  // }
  if (scene === 'start') {
    stagePosition = [-1, 0, 3];
    stageSize = [5, 4];
  }
  if (scene === 'menu') {
    stagePosition = [-0.8, -0.2, 3];
    stageSize = [4.3, 10];
    if (breakpoints.menu) {
      stagePosition = [1.25, 0, 3];
      stageSize = [8, 4.5];
    }
  }
  if (scene === 'projects') {
    stagePosition = [0, -10, 3];
    stageSize = [6, 10];
    if (breakpoints.projects) {
      stagePosition = [0.5, -12, 3];
      stageSize = [8.5, 6.5];
    }
  }
  if (scene === 'project-open') {
    stagePosition = [
      projectListingPosition[0],
      projectListingPosition[1] - 1.0,
      projectListingPosition[2] + 4.5,
    ];
    stageSize = [0.1, 2.8];
    if (breakpoints.projectOpen) {
      stagePosition = [
        projectListingPosition[0] - 0.6,
        projectListingPosition[1],
        projectListingPosition[2] + 4.5,
      ];
      stageSize = [2, 0.1];
    }
  }
  if (scene === 'about') {
    stageSize = [1, 1];
    stagePosition = [-1, 0.75, 2.1];
    if (breakpoints.about) {
      stageSize = [4.2, 3];
      stagePosition = [-1, 0.7, 2.1];
    }
  }

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
    <>
      <CameraController
        stagePosition={stagePosition as CoordArray}
        stageSize={stageSize as [number, number]}
        // debug
        controllable={scene !== 'project-open' && scene !== 'about'}
      />
      <BackgroundScribbles />
      <Computer />
      {showCoffeeCup && <CoffeeCup />}
      {showNotebook && <Notebook />}
      <ProjectListing
        projects={projects}
        position={projectListingPosition as CoordArray}
        active={scene === 'projects' || scene === 'project-open'}
      />
    </>
  );
}
