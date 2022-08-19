import type { InferGetStaticPropsType, NextPage } from 'next';
import { sanityExperimentalTypesafeClient } from '../src/sanity/sanityClient';
import { SceneName } from '../src/SceneController';

export async function getStaticProps() {
  const projects = await sanityExperimentalTypesafeClient.getAll('project');
  const scene:SceneName = 'intro';
  console.log(JSON.stringify(projects, null, 2));
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
