import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextSeo } from 'next-seo';

import firstScreenImage from '@images/TokenPerson.png';
import { BaseLayout } from '@layouts/BaseLayout';
import { FirstScreen } from '@components/home/FirstScreen';
import { CreateTokenForm } from '@components/token/CreateTokenForm';

const Token: React.FC = () => {
  const { t } = useTranslation('token');

  return (
    <BaseLayout>
      <NextSeo
        title={t('token:Token page')}
        description={t('token:Token page description. Couple sentences...')}
        openGraph={{
          title: t('token:Token page'),
          description: t('token:Token page description. Couple sentences...'),
        }}
      />
      <FirstScreen
        title={(
          <>
            Create you own
            <br />
            FA 2 token
            <br />
            <span>for free</span>
          </>
        )}
        alt={t('token:Create you own FA 2 token for free')}
        description={t('token:Create & Deploy your own token in a minute')}
        image={firstScreenImage}
      />
      <CreateTokenForm />
    </BaseLayout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'token']),
  },
});

export default Token;
