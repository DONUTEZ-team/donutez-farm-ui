import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextSeo } from 'next-seo';

import { BaseLayout } from '@layouts/BaseLayout';
import { FirstScreen } from '@components/home/FirstScreen';
import { CreateFarmForm } from '@components/home/CreateFarmForm';

const Home: React.FC = () => {
  const { t } = useTranslation(['home']);

  return (
    <BaseLayout>
      <NextSeo
        title={t('home:Home page')}
        description={t('home:Home page description. Couple sentences...')}
        openGraph={{
          title: t('home:Home page'),
          description: t('home:Home page description. Couple sentences...'),
        }}
      />
      <FirstScreen
        title={t('home:All u need\nis farming...\nand Donutez')}
        description={t('home:Create your own yield farming in 5 minutes')}
        image="/images/HomePerson.png"
      />
      <CreateFarmForm />
    </BaseLayout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'home']),
  },
});

export default Home;
