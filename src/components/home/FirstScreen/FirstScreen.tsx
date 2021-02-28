import React, { ReactNode } from 'react';
import cx from 'classnames';

import { useTranslation } from '@i18n';

import { Container } from '@ui/Container';
import { Row } from '@ui/Row';
import { Button } from '@ui/Button';
import HandToRight from '@icons/HandToRight.svg';
import HandToRightChinese from '@icons/HandToRightChinese.svg';

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
  const { t, i18n } = useTranslation(['common']);

  return (
    <Container className={s.root}>
      <Row className={s.row}>
        <h1 className={cx(s.header, { chinese: i18n.language === 'zh' })}>
          {title}
        </h1>
        <p className={s.description}>
          {description}
        </p>
        {isHome ? (
          <div className={s.buttonWrapper}>
            <Button onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'zh' : 'en')}>
              {t('common:Create')}
            </Button>
            {i18n.language === 'zh' ? <HandToRightChinese className={s.hand} /> : <HandToRight className={s.hand} />}
          </div>
        ) : (
          <Button onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'zh' : 'en')}>
            {t('common:Create')}
          </Button>
        )}
        <img className={s.image} src={image} alt="DONUTEZ FARM" />
      </Row>
    </Container>
  );
};
