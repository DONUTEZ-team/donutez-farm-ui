import React from 'react';
import cx from 'classnames';
import { useTranslation } from '@i18n';

import { Container } from '@ui/Container';
import { Row } from '@ui/Row';
import { Input } from '@ui/Input';
import { CheckBox } from '@ui/CheckBox';
import { Heading } from '@components/common/Heading';

import s from './Form.module.sass';

export const Form: React.FC = () => {
  const { t } = useTranslation(['common', 'home']);

  return (
    <Container>
      <Row className={s.row}>
        <div className={s.form}>
          <div className={s.block}>
            <Heading
              header={t('home:Set up\nQP token')}
              subheader="01*"
            />
            <Input
              className={s.input}
              label="QP token address:"
              placeholder="Enter QP Token Address e.g. tz1W3a2...pSBmH"
            />
            <p className={s.item}>
              Pair:
              {' '}
              <strong>DONUTEZ TOKEN</strong>
            </p>
          </div>
          <div className={s.block}>
            <Heading
              header={t('home:Set mining\nparameters')}
              subheader="02*"
            />
            <div className={s.innerBlock}>
              <Input
                className={s.input}
                label="Token Address:"
                placeholder="Enter reward Token Address e.g. tz1W3...SBmH"
              />
              <p className={s.item}>
                Token Name:
                {' '}
                <strong>XXXXXXX</strong>
              </p>
            </div>
            <div className={s.innerBlock}>
              <Input
                className={s.input}
                label="Starting Height:"
                placeholder="Starting Block Height e.g. 1223123455"
              />
              <CheckBox
                className={s.input}
                label="Execute immediately after the tap is created"
              />
              <Input
                className={s.input}
                label="Block Count:"
                placeholder="Eneter the number of blocks for mining"
              />
              <p className={s.item}>
                Closing Height:
                {' '}
                <strong>XXXXXXX</strong>
              </p>
              <p className={s.item}>
                Estimated starting & closing time:
                {' '}
                <strong>XXXXXXX</strong>
              </p>
            </div>
            <div className={s.innerBlock}>
              <Input
                className={s.input}
                label="Mining Reward per Block:"
                placeholder="Mining reward for each block"
              />
              <p className={s.item}>
                Total Reward:
                {' '}
                <strong>XXXXXXX</strong>
              </p>
              <p className={cx(s.item, s.active)}>
                Available balance:
                {' '}
                <strong>0 DTZ</strong>
              </p>
            </div>
          </div>
          <div className={s.block}>
            <Heading
              header={t('home:Project\ninformation')}
              subheader={(
                <>
                  03
                  <span className={s.optional}>(Optional)</span>
                </>
              )}
            />
            <Input
              className={s.input}
              label="Official Website:"
              placeholder="Website Address e.g. https://www.a...x.com/"
            />
            <Input
              className={s.input}
              label="Project Introduction:"
              placeholder="Your Project Description
e.g. This project is about yeild farming..."
              textarea
            />
          </div>
        </div>
        <div className={s.donut}>
          asdf
        </div>
      </Row>
    </Container>
  );
};
