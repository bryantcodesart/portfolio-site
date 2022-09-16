import '../styles/globals.css';
import type { AppProps } from 'next/app';
import React from 'react';
import { DefaultSeo } from 'next-seo';
import { CustomCursor } from '../src/CustomCursor';
import { ThreePage } from '../src/ThreePage';
import { SiteData } from '../src/SiteData';
import { MobileVhAsCssVar } from '../src/MobileVhAsCssVar';
import { useConsoleLogDevSignature } from '../src/useConsoleLogDevSignature';

function MyApp({ Component, pageProps }: AppProps) {
  const siteData:SiteData = {
    startingScene: pageProps.scene ?? 'error',
    projects: pageProps.projects ?? null,
  };

  const title = 'Bryant Smith, Creative Dev';
  const description = 'I help awesome designers (like you) build their wildest dreams.';
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
          type: 'website',
          images: [
            {
              url: 'https://bryantcodes.art/images/social.png',
              width: 2333,
              height: 1313,
              alt: 'Bryantcodes.art wordmark over colorful, crudely scribbled illustration of laptop displaying another crudely drawn illustration of a laptop.',
              type: 'image/png',
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
