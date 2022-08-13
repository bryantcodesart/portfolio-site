import { Project } from '../generatedSanitySchemaTypes';
import { SceneName } from './SceneController';

export type SiteData = {
  startingScene: SceneName;
  projects: Project[] | null;
};
