import React from 'react';
import { useTranslation } from '@i18n';

import { BaseLayout } from '@layouts/BaseLayout';
import { Container } from '@ui/Container';
import { Row } from '@ui/Row';
import { Button } from '@ui/Button';
import { Input } from '@ui/Input';

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
          <div className={s.inputs}>
            <Input
              className={s.input}
              label="Token Address"
              placeholder="Enter reward Token Address e.g. tz1W3...SBmH"
            />
            <Input
              className={s.input}
              label="Token Address"
              placeholder="Enter reward Token Address e.g. tz1W3...SBmH"
              error="Enter valid token address"
            />
            <Input
              className={s.input}
              label="Token Address"
              placeholder="Enter reward Token Address e.g. tz1W3...SBmH"
              success
            />
          </div>
        </Row>
      </Container>
    </BaseLayout>
  );
};

UiKit.getInitialProps = async () => ({
  namespacesRequired: ['common', 'ui-kit'],
});

export default UiKit;
