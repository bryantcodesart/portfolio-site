import '../styles/globals.css';
import type { AppProps } from 'next/app';
import React from 'react';
import { DefaultSeo } from 'next-seo';
import { CustomCursor } from '../src/CustomCursor';
import { ThreePage } from '../src/ThreePage';
import { SiteData } from '../src/SiteData';
import { MobileVhAsCssVar } from '../src/MobileVhAsCssVar';
import { useConsoleLogDevSignature } from './useConsoleLogDevSignature';

function MyApp({ Component, pageProps }: AppProps) {
  const siteData:SiteData = {
    startingScene: pageProps.scene ?? 'error',
    projects: pageProps.projects ?? null,
  };

  const title = 'bryantcodes.art';
  const description = 'I am a dev who helps awesome designers (like you) build their wildest dreams.';
  const url = 'https://bryantcodes.art';

  useConsoleLogDevSignature();

  return (
    <>
      <DefaultSeo
        title={title}
        description={description}
        canonical="https://bryantcodes.art"
        openGraph={{
          url,
          title,
          description,
          images: [
            {
              url: 'https://bryantcodes.art/images/social.jpg',
              width: 1920,
              height: 1080,
              alt: 'Bryantcodes.art wordmark over colorful, crudely scribbled illustration of laptop',
              type: 'image/jpeg',
            },
          ],
          site_name: 'bryantcodes.art',
        }}
        twitter={{
          handle: '@bryantcodesart',
          cardType: 'summary_large_image',
        }}
      />
      <MobileVhAsCssVar />
      <ThreePage
        siteData={siteData}
      />
      <Component {...pageProps} />
      <CustomCursor />
    </>
  );
}

export default MyApp;
