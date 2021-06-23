import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextSeo } from 'next-seo';

import { BaseLayout } from '@layouts/BaseLayout';
import { FirstScreen } from '@components/account/FirstScreen';

const Account: React.FC = () => {
  const { t } = useTranslation(['account']);

  return (
    <BaseLayout>
      <NextSeo
        title={t('account:Account page')}
        description={t('account:Account page description. Couple sentences...')}
        openGraph={{
          title: t('account:Account page'),
          description: t('account:Account page description. Couple sentences...'),
        }}
      />
      <FirstScreen />
    </BaseLayout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'account']),
  },
});

export default Account;
