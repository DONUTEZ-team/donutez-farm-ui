import React, { useEffect } from 'react';
import App from 'next/app';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { appWithTranslation, i18n } from '@i18n';
import { DAppProvider } from '@utils/dapp';
import { APP_NAME } from '@utils/defaults';

import '@styles/globals.sass';

const lngLocale = {
  zh: 'zh-cn',
  en: 'en',
};

function MyApp({ Component, pageProps }: any) {
  useEffect(
    () => {
      const handleLanguageChanged = (lng: string) => {
        dayjs.locale(lngLocale[lng as keyof typeof lngLocale]);
      };
      i18n.on('languageChanged', handleLanguageChanged);

      handleLanguageChanged(i18n.language);
      return () => i18n.off('languageChanged', handleLanguageChanged);
    },
    [],
  );
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
