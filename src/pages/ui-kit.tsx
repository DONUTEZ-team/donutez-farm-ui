import React, { useState } from 'react';
import { useTranslation } from '@i18n';

import { BaseLayout } from '@layouts/BaseLayout';
import { Container } from '@ui/Container';
import { Row } from '@ui/Row';
import { Button } from '@ui/Button';
import { Input } from '@ui/Input';
import { Modal } from '@ui/Modal';

import s from '@styles/UiKit.module.sass';
import { Heading } from '@components/common/Heading';

const UiKit = () => {
  const { t, i18n } = useTranslation(['common', 'ui-kit']);
  const [isModalOpened, setIsModalOpened] = useState(false);

  return (
    <BaseLayout>
      <Container>
        <Row className={s.row}>
          <h1>{t('ui-kit:UI Kit - temporary')}</h1>
          <div className={s.buttons}>
            <Heading header="Buttons" subheader="01*" />
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
          </div>
          <div className={s.inputs}>
            <Heading header="Inputs" subheader="02*" />
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
          <div className={s.buttons}>
            <Heading header="Modal" subheader="03*" />
            <Button className={s.button} onClick={() => setIsModalOpened(true)}>
              {t('common:Open modal')}
            </Button>
          </div>
          <Modal isOpen={isModalOpened} onRequestClose={() => setIsModalOpened(false)} />
        </Row>
      </Container>
    </BaseLayout>
  );
};

UiKit.getInitialProps = async () => ({
  namespacesRequired: ['common', 'ui-kit'],
});

export default UiKit;
