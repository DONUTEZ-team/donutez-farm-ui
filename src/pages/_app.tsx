import React from 'react';
import App from 'next/app';
import { appWithTranslation } from '@i18n';

import '@styles/globals.sass';

function MyApp({ Component, pageProps }: any) {
  return (
    <Component {...pageProps} />
  );
}

MyApp.getInitialProps = async (appContext: any) => ({
  ...(await App.getInitialProps(appContext)),
});

export default appWithTranslation(MyApp);
