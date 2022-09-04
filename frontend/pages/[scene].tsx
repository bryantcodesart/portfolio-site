import type {
  GetStaticPaths, GetStaticProps, NextPage,
} from 'next';
import { ParsedUrlQuery } from 'querystring';
import { authorizedSanityExperimentalTypesafeClient } from '../src/sanity/sanityClient';
import { SceneName, sceneNames } from '../src/SceneController';

interface Params extends ParsedUrlQuery {
  scene:SceneName
}

interface Props {
  scene:SceneName,
}

export const getStaticProps:GetStaticProps<Props, Params> = async (context) => {
  const projects = await authorizedSanityExperimentalTypesafeClient.getAll('project');
  const { scene } = context.params ?? { scene: 'error' };

  return {
    props: {
      projects,
      scene,
    },
  };
};

export const getStaticPaths:GetStaticPaths = async () => {
  const paths = sceneNames
    .filter((scene:SceneName) => scene !== 'projects')
    .map((scene:SceneName) => ({ params: { scene } }));

  return {
    paths,
    fallback: false,
  };
};
const ScenePage: NextPage<Props> = () => (null);

export default ScenePage;
