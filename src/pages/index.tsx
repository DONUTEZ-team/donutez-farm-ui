import React from 'react';
import { useTranslation } from '@i18n';

import { BaseLayout } from '@layouts/BaseLayout';
import { Background } from '@components/home/Background';
import { FirstScreen } from '@components/home/FirstScreen';
import { YieldForm } from '@components/home/Form';

import s from '@styles/Home.module.sass';

const Home = () => {
  const { t, i18n } = useTranslation(['common', 'home']);

  return (
    <BaseLayout className={s.wrapper}>
      <Background />
      <FirstScreen
        title={t('home:All u need\nis farming...\nand Donutez')}
        description={t('home:Create your own yield farming in 5 minutes')}
        image={i18n.language === 'zh' ? '/images/HomeFirstChinese.png' : '/images/HomeFirst.png'}
        isHome
      />
      <YieldForm />
    </BaseLayout>
  );
};

Home.getInitialProps = async () => ({
  namespacesRequired: ['common', 'home'],
});

export default Home;
