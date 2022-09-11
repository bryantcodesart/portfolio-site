import React from 'react';
// eslint-disable-next-line @next/next/no-document-import-in-page
import Head from 'next/head';

export const PreloadLocalSvg = ({ href }: { href: string; }) => (
  <Head>
    <link
      rel="preload"
      href={href}
      key={`preload_${href}`}
      as="image"
      type="image/svg+xml"
    />
  </Head>
);
