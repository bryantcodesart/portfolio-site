import type { InferGetStaticPropsType, NextPage } from 'next';
import { authorizedSanityExperimentalTypesafeClient } from '../src/sanity/sanityClient';
import { SceneName } from '../src/SceneController';

export async function getStaticProps() {
  const projects = await authorizedSanityExperimentalTypesafeClient.getAll('project');
  const scene:SceneName = 'intro';
  return {
    props: {
      projects,
      scene,
    },
  };
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

const ScenePage: NextPage<Props> = () => null;

export default ScenePage;
