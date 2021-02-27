import React from 'react';

import { BaseLayout } from '@layouts/BaseLayout';
import { Background } from '@components/home/Background';
import { FirstScreen } from '@components/home/FirstScreen';

const Home = () => (
  <BaseLayout>
    <Background />
    <FirstScreen />
  </BaseLayout>
);

Home.getInitialProps = async () => ({
  namespacesRequired: ['common', 'home'],
});

export default Home;
