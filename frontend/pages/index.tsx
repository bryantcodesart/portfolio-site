import type { InferGetStaticPropsType, NextPage } from 'next';

export async function getStaticProps() {
  return {
    props: {},
  };
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Home: NextPage<Props> = () => null;

export default Home;
