import React from 'react';
import { useTranslation } from '@i18n';

import { BaseLayout } from '@layouts/BaseLayout';
import { Container } from '@ui/Container';
import { Row } from '@ui/Row';
import { Button } from '@components/ui/Button';

const Home = () => {
  const { t, i18n } = useTranslation(['common', 'home']);

  return (
    <BaseLayout>
      <Container>
        <Row>
          <h1>{t('home:Example Home Title')}</h1>
          <Button onClick={() => { i18n.changeLanguage(i18n.language === 'en' ? 'ru' : 'en'); }}>
            {t('common:Change language')}
          </Button>
        </Row>
      </Container>
    </BaseLayout>
  );
};

Home.getInitialProps = async () => ({
  namespacesRequired: ['common', 'home'],
});

export default Home;
