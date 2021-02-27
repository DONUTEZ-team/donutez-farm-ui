import React from 'react';
import { useTranslation } from '@i18n';

import { BaseLayout } from '@layouts/BaseLayout';
import { Container } from '@ui/Container';
import { Row } from '@ui/Row';
import { Button } from '@ui/Button';
import { Background } from '@components/home/Background';

import s from '@styles/NotFound.module.sass';

const NotFound = () => {
  const { t } = useTranslation(['common', 'not-found']);

  return (
    <BaseLayout className={s.wrapper} title="404 | Not Found">
      <Background />
      <Container className={s.root}>
        <Row className={s.row}>
          <h1 className={s.header}>
            {t('not-found:Ooooops....\nSeems your\nDONUTEZ BOX\nis empty')}
          </h1>
          <p className={s.description}>
            {t('not-found:Create your own yield farming and fill it up')}
          </p>
          <Button href="/">
            {t('common:Create')}
          </Button>
          <img className={s.image} src="/images/NotFoundBox.png" alt="DONUTEZ FARM | Not Found" />
        </Row>
      </Container>
    </BaseLayout>
  );
};

export default NotFound;
