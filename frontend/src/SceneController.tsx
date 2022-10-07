// import { createContext, useContext } from 'react';
import { event } from 'nextjs-google-analytics';
import create from 'zustand';
import { useCustomCursorVanillaStore } from './CustomCursor';

export const sceneNames = [
  'intro',
  'home',
  'start',
  'menu',
  'projects',
  'project-open',
  'error',
  'about',
] as const;

// This helps us infer the type as the actual strings, not just a general string[]
type ArrElement<ArrType> = ArrType extends readonly (infer ElementType)[]
  ? ElementType
  : never;
export type SceneName = ArrElement<typeof sceneNames>;

export type SceneController = {
  scene: SceneName;
  setScene: (_scene: SceneName) => void;
}

export const useSceneController = create<SceneController>((set) => ({
  scene: 'intro',
  setScene: (scene:SceneName) => {
    set({ scene });
    event('scene', {
      scene,
    });
    useCustomCursorVanillaStore.getState().clearAllHovers();
  },
}));

// export const SceneControllerContext = createContext<SceneController>({
//   scene: 'error',
//   setScene: () => {
//     throw new Error('SceneController must be used within a <SceneControllerProvider>.');
//   },
// });

// export const SceneControllerProvider = SceneControllerContext.Provider;

// export const useSceneController = ():SceneController => useContext(SceneControllerContext);
