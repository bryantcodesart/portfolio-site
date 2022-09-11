// pages/_document.js
import React from 'react';
import {
  Html, Head, Main, NextScript,
} from 'next/document';
import { fontUrls } from '../src/typography';

const GoogleFonts = ({ href }:{href:string}) => (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
    {/* <link rel="preload" href={href} as="style" /> */}
    <link href={href} rel="stylesheet" />
  </>
);

const PreloadLocalFont = ({ href }:{href:string}) => (
  <link rel="preload" href={href} as="font" />
);

// const preloadSvg = (href=)
export default function Document() {
  return (
    <Html>
      <Head>
        <GoogleFonts href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@100;400;700&family=Roboto:wght@100&display=swap" />
        <PreloadLocalFont href={fontUrls.bryantBold} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
