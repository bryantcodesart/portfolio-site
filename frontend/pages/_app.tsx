import '../styles/globals.css';
import type { AppProps } from 'next/app';
import React from 'react';
import { CustomCursor } from '../src/CustomCursor';
import { ThreePage } from '../src/ThreePage';
import { SiteData } from '../src/SiteData';

function MyApp({ Component, pageProps }: AppProps) {
  const siteData:SiteData = {
    startingScene: pageProps.scene ?? 'error',
    projects: pageProps.projects ?? null,
  };
  return (
    <>
      <ThreePage
        siteData={siteData}
      />
      <Component {...pageProps} />
      <CustomCursor />
    </>
  );
}

export default MyApp;
