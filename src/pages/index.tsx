import React from 'react';

import { BaseLayout } from '@layouts/BaseLayout';
import { Background } from '@components/home/Background';
import { FirstScreen } from '@components/home/FirstScreen';
import { Form } from '@components/home/Form';

import s from '@styles/Home.module.sass';

const Home = () => (
  <BaseLayout className={s.wrapper}>
    <Background />
    <FirstScreen />
    <Form />
  </BaseLayout>
);

Home.getInitialProps = async () => ({
  namespacesRequired: ['common', 'home'],
});

export default Home;
