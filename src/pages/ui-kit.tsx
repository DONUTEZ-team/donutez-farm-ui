import React from 'react';
import { useTranslation } from '@i18n';

import { BaseLayout } from '@layouts/BaseLayout';
import { Container } from '@ui/Container';
import { Row } from '@ui/Row';
import { Button } from '@ui/Button';

import s from '@styles/UiKit.module.sass';

const UiKit = () => {
  const { t, i18n } = useTranslation(['common', 'ui-kit']);

  return (
    <BaseLayout>
      <Container>
        <Row className={s.row}>
          <h1>{t('ui-kit:UI Kit - temporary')}</h1>
          <Button className={s.button}>
            {t('common:Create')}
          </Button>
          <Button theme="secondary" className={s.button}>
            {t('common:Create')}
          </Button>
          <Button
            className={s.button}
            onClick={() => { i18n.changeLanguage(i18n.language === 'en' ? 'ru' : 'en'); }}
          >
            {t('common:Change language')}
          </Button>
        </Row>
      </Container>
    </BaseLayout>
  );
};

UiKit.getInitialProps = async () => ({
  namespacesRequired: ['common', 'ui-kit'],
});

export default UiKit;
