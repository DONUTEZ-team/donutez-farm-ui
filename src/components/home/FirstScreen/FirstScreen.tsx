import React, { ReactNode } from 'react';

import { useTranslation } from '@i18n';

import { Container } from '@ui/Container';
import { Row } from '@ui/Row';
import { Button } from '@ui/Button';
import HandToRight from '@icons/HandToRight.svg';

import s from './FirstScreen.module.sass';

type FirstScreenProps = {
  title: string | ReactNode
  description: string
  image: string
  isHome?: boolean
};

export const FirstScreen: React.FC<FirstScreenProps> = ({
  title,
  description,
  image,
  isHome,
}) => {
  const { t } = useTranslation(['common']);

  return (
    <Container className={s.root}>
      <Row className={s.row}>
        <h1 className={s.header}>
          {title}
        </h1>
        <p className={s.description}>
          {description}
        </p>
        {isHome ? (
          <div className={s.buttonWrapper}>
            <Button>
              {t('common:Create')}
            </Button>
            <HandToRight className={s.hand} />
          </div>
        ) : (
          <Button>
            {t('common:Create')}
          </Button>
        )}
        <img className={s.image} src={image} alt="DONUTEZ FARM" />
      </Row>
    </Container>
  );
};
