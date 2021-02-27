import React from 'react';

import { BaseLayout } from '@layouts/BaseLayout';
import { Background } from '@components/home/Background';
import { FirstScreen } from '@components/home/FirstScreen';
import { YieldForm } from '@components/home/Form';

import s from '@styles/Home.module.sass';

const Home = () => (
  <BaseLayout className={s.wrapper}>
    <Background />
    <FirstScreen />
    <YieldForm />
  </BaseLayout>
);

Home.getInitialProps = async () => ({
  namespacesRequired: ['common', 'home'],
});

export default Home;
