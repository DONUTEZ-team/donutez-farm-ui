import React from 'react';
import App from 'next/app';
import { appWithTranslation } from '@i18n';
import { DAppProvider } from '@utils/dapp';
import { APP_NAME } from '@utils/defaults';

import '@styles/globals.sass';

function MyApp({ Component, pageProps }: any) {
  return (
    <DAppProvider appName={APP_NAME}>
      <Component {...pageProps} />
    </DAppProvider>
  );
}

MyApp.getInitialProps = async (appContext: any) => ({
  ...(await App.getInitialProps(appContext)),
});

export default appWithTranslation(MyApp);
