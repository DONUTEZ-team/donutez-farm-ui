import React from 'react';
import { useTranslation } from 'next-i18next';
import cx from 'classnames';

import { useAccountPkh } from '@utils/dapp';
import { ConnectWallet } from '@containers/common/ConnectWallet';
import { Container } from '@components/ui/Container';
import { Row } from '@components/ui/Row';
import { Button } from '@components/ui/Button';
import DonutEmpty from '@icons/DonutEmpty.svg';

import s from './FirstScreen.module.sass';

export const FirstScreen: React.FC = () => {
  const { t } = useTranslation(['account']);

  const accountPkh = useAccountPkh();

  return (
    <section className={s.root}>
      <div className={s.backgrounds}>
        <Container>
          <Row className={s.row}>
            <img
              className={cx(s.background1, s.home)}
              src="/images/HomeBackground1.svg"
              alt="DONUTEZ Farm"
            />
            <img
              className={cx(s.background2, s.home)}
              src="/images/HomeBackground2.svg"
              alt="DONUTEZ Farm"
            />
          </Row>
        </Container>
      </div>
      <Container>
        <Row className={s.row}>
          <h1 className={s.header}>

            {
              !accountPkh
                ? t('account:Connect\nyour wallet\nfirst')
                : t('account:Seems You have\nno available \ndata yet')
            }
          </h1>

          {
            !accountPkh
              ? (
                <ConnectWallet className={s.button} label="Connect wallet" />
              )
              : (
                <div className={s.buttons}>
                  <Button className={s.button}>
                    {t('account:Create farming')}
                  </Button>
                  <Button className={s.button} theme="secondary">
                    {t('account:Create tokens')}
                  </Button>
                </div>
              )
          }

          <DonutEmpty className={s.image} />
        </Row>
      </Container>
    </section>
  );
};
