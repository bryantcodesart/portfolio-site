import { createContext, useContext } from 'react';

export type SceneName = 'loading' | 'start' | 'menu' | 'error';

export type SceneController = {
  scene: SceneName;
  setScene: (_scene: SceneName) => void;
}

export const SceneControllerContext = createContext<SceneController>({
  scene: 'error',
  setScene: () => {
    throw new Error('SceneController must be used within a <SceneControllerProvider>.');
  },
});

export const SceneControllerProvider = SceneControllerContext.Provider;

export const useSceneController = () => useContext(SceneControllerContext);
