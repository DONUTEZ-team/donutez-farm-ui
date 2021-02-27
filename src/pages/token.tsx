import React from 'react';
import { useTranslation } from '@i18n';

import { BaseLayout } from '@layouts/BaseLayout';
import { Background } from '@components/home/Background';
import { FirstScreen } from '@components/home/FirstScreen';

import s from '@styles/Home.module.sass';
import { TokenForm } from '@components/token/Form';

const Token = () => {
  const { t } = useTranslation(['common', 'home']);

  return (
    <BaseLayout className={s.wrapper}>
      <Background />
      <FirstScreen
        title={(
          <>
            Create you own
            <br />
            FA 1.2 / fa 2
            <br />
            token
            {' '}
            <span>for free</span>
          </>
        )}
        description={t('token:Create & Deploy your own token in a minute')}
        image="/images/TokenFirst.png"
      />
      <TokenForm />
    </BaseLayout>
  );
};

Token.getInitialProps = async () => ({
  namespacesRequired: ['common', 'token'],
});

export default Token;
