import * as React from 'react';
import { useTranslation } from '@i18n';

import { Container } from '@ui/Container';
import { Row } from '@ui/Row';
import { Button } from '@ui/Button';
import HandToRight from '@icons/HandToRight.svg';

import s from './FirstScreen.module.sass';

export const FirstScreen: React.FC = () => {
  const { t } = useTranslation(['common', 'home']);

  return (
    <Container className={s.root}>
      <Row className={s.row}>
        <h1 className={s.header}>
          {t('home:All u need\nis farming...\nand Donuts')}
        </h1>
        <p className={s.description}>
          {t('home:Create your own yield farming in 5 minutes')}
        </p>
        <div className={s.buttonWrapper}>
          <Button>
            {t('common:Create')}
          </Button>
          <HandToRight className={s.hand} />
        </div>
        <img className={s.image} src="/images/HomeFirst.png" alt="DONUTEZ FARM" />
      </Row>
    </Container>
  );
};
