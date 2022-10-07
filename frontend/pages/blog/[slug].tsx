/* eslint-disable react/prop-types */
import React from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { PortableText } from '@portabletext/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TypedObject } from '@portabletext/types';
import { SanityAsset } from '@sanity/image-url/lib/types/types';
import { SceneName } from '../../src/SceneController';
import { authorizedSanityClient, authorizedSanityExperimentalTypesafeClient } from '../../src/sanity/sanityClient';
import { Post } from '../../generatedSanitySchemaTypes';
import { getSanityImageUrlFor } from '../../src/sanity/sanityImageBuilder';

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
        mainImage{
          asset,
          crop,
          hotspot
        },
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

// getSanityImageUrlFor('image-928ac96d53b0c9049836c86ff25fd3c009039a16-200x200-png')
//   .auto('format')
//   .fit('max')
//   .width(720)
//   .toString()

const BlogPostPage:NextPage<Props> = ({ post }) => {
  const featuredImage = getSanityImageUrlFor(post.mainImage)
    .width(1000)
    .height(1000)
    .url();

  return (
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
      <img src={featuredImage} />

      {/* <div><pre></pre>{post?.author}</div> */}
      <PortableText
        value={post.body}
        components={{
        }}
      />
      <pre className="mt-[20vh]">{JSON.stringify(post, null, 2)}</pre>
    </div>
  );
};

export default BlogPostPage;
