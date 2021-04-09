import React from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextSeo } from 'next-seo';

import { BaseLayout } from '@layouts/BaseLayout';
import { Row } from '@components/ui/Row';
import { Container } from '@components/ui/Container';
import { Heading } from '@components/common/Heading';
import { Button } from '@components/ui/Button';

import s from '../styles/UiKit.module.sass';

const UiKit: React.FC = () => {
  const { t } = useTranslation(['common', 'home']);

  return (
    <BaseLayout>
      <NextSeo
        title={t('secondary:Home page')}
        description={t('secondary:Home page description. Couple sentences...')}
        openGraph={{
          title: t('secondary:Home page'),
          description: t('secondary:Home page description. Couple sentences...'),
        }}
      />
      <Container>
        <Row className={s.row}>
          <div className={s.block}>
            <h1 className={s.header}>[DEV] UI Kit</h1>
          </div>
          <div className={s.block}>
            <Heading header="Headings" subheader="01" />
            <Heading header="Required" subheader="01" />
            <Heading header="Optional header" subheader="02" isRequired={false} />
            <Heading header="Create it!" subheader="Finally" isRequired={null} />
          </div>
          <div className={s.block}>
            <Heading header="Buttons" subheader="02" />
            <div className={s.buttons}>
              <div className={s.buttonsRow}>
                <Button className={s.button}>
                  Primary
                </Button>
                <Button
                  disabled
                  className={s.button}
                >
                  Primary
                </Button>
              </div>
              <div className={s.buttonsRow}>
                <Button
                  theme="secondary"
                  className={s.button}
                >
                  Secondary
                </Button>
                <Button
                  theme="secondary"
                  disabled
                  className={s.button}
                >
                  Secondary
                </Button>
              </div>
            </div>
            <div className={cx(s.buttons, s.buttonsLight)}>
              <div className={s.buttonsRow}>
                <Button
                  theme="light"
                  className={s.button}
                >
                  Light
                </Button>
                <Button
                  theme="light"
                  disabled
                  className={s.button}
                >
                  Light
                </Button>
              </div>
              <div className={s.buttonsRow}>
                <Button
                  theme="lightSecondary"
                  className={s.button}
                >
                  Light Secondary
                </Button>
                <Button
                  theme="lightSecondary"
                  disabled
                  className={s.button}
                >
                  Light Secondary
                </Button>
              </div>
            </div>
          </div>
        </Row>
      </Container>
    </BaseLayout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'home']),
  },
});

export default UiKit;
