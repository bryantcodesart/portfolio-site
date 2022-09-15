import '../styles/globals.css';
import type { AppProps } from 'next/app';
import React, from 'react';
import { DefaultSeo } from 'next-seo';
import { useTimeout } from 'usehooks-ts';
import { CustomCursor } from '../src/CustomCursor';
import { ThreePage } from '../src/ThreePage';
import { SiteData } from '../src/SiteData';
import { MobileVhAsCssVar } from '../src/MobileVhAsCssVar';

const useConsoleLogDevSignature = () => {
  const style = 'color: white; background: blue; font-family:monospace; font-size: 20px; padding: 10px;';
  const log = (text:string) => console.log(`%c${text.toUpperCase()}`, style);
  useTimeout(() => {
    console.clear();
    log(`looking at my code, are you?
awesome! dig around!
Although you'll probably have more luck looking at the repo:`);
    console.log('%chttps://github.com/bryantcodesart/bryantcodesart', 'font-size: 15px; padding: 10px;');
    log(`hmu to nerd out about any of it!
hello@bryantcodes.art`);
  }, 1000);
};

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
