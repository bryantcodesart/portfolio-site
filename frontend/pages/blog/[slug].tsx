/* eslint-disable react/prop-types */
import React from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { PortableText } from '@portabletext/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TypedObject } from '@portabletext/types';
import { SceneName } from '../../src/SceneController';
import { authorizedSanityClient, authorizedSanityExperimentalTypesafeClient } from '../../src/sanity/sanityClient';
import { Post } from '../../generatedSanitySchemaTypes';

interface Props {
  scene:SceneName,
  post:Post
}

// *[_type == 'post']{
//   title,
//   author->{
//     name,
//     bio
//   },
//   categories[]->{title}
// }

export const getStaticProps:GetStaticProps<Props> = async (context) => {
  const post = await authorizedSanityClient.fetch(
    `
      *[_type == "post" && slug.current == $slug][0]{
        title,
        author->{
          name,
          bio
        },
        categories[]->{title},
        publishedAt,
        mainImage,
        body
      }
    `,
    { slug: context.params?.slug },
  );

  return {
    props: {
      scene: 'menu',
      post,
    },
  };
};

export const getStaticPaths:GetStaticPaths = async () => {
  const posts = await authorizedSanityExperimentalTypesafeClient.getAll('post');
  const paths = posts
    .map((post) => ({ params: { slug: post?.slug?.current ?? '' } }))
    .filter((post) => post.params.slug !== '');

  return {
    paths,
    fallback: false,
  };
};

const BlogPostPage:NextPage<Props> = ({ post }) => (
  <div
    className="
      fixed z-[77777777]
      top-0 left-0 w-full h-full
      border-[10px] border-[red]
      bg-white
      grid place-items-center
      overflow-y-scroll py-[10vh]
    "
  >
    <h1>{post.title}</h1>
    <div>{post?.author?.name}</div>

    {/* <div><pre></pre>{post?.author}</div> */}
    <PortableText value={post.body} />
    <pre className="mt-[20vh]">{JSON.stringify(post, null, 2)}</pre>
  </div>
);

export default BlogPostPage;
