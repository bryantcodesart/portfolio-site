import '../styles/globals.css';
import type { AppProps } from 'next/app';
import React from 'react';
import { CustomCursorProvider } from '../src/CustomCursor';
import { Homepage } from '../src/Homepage';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CustomCursorProvider>
      {true // check for homepage props once they exist here
        && <Homepage />}
      <Component {...pageProps} />
    </CustomCursorProvider>
  );
}

export default MyApp;
