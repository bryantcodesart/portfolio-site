import { createContext, useContext } from 'react';

export const sceneNames = [
  'intro',
  'home',
  'start',
  'menu',
  'projects',
  'project-open',
  'error',
] as const;

type ArrElement<ArrType> = ArrType extends readonly (infer ElementType)[]
  ? ElementType
  : never;
export type SceneName = ArrElement<typeof sceneNames>;

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

export const useSceneController = ():SceneController => useContext(SceneControllerContext);
