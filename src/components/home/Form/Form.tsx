import React, { useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { useTranslation } from '@i18n';

import { Container } from '@ui/Container';
import { Row } from '@ui/Row';
import { Input } from '@ui/Input';
import { CheckBox } from '@ui/CheckBox';
import { Button } from '@ui/Button';
import { StyledCard } from '@ui/StyledCard';
import { Heading } from '@components/common/Heading';
import HandRock from '@icons/HandRock.svg';

import s from './Form.module.sass';

export const Form: React.FC = () => {
  const { t } = useTranslation(['common', 'home']);

  const refDonutSecond = useRef(null);
  const refDonutThird = useRef(null);

  const [isSecondActive, setIsSecondActive] = useState({
    second: false,
    third: false,
  });

  const isScrolledIntoView = (elem: any) => {
    const bounding = elem.getBoundingClientRect();
    return (
      bounding.top - 150 <= 0
    );
  };
  const onScroll = () => {
    if (refDonutSecond.current && refDonutThird.current) {
      setIsSecondActive({
        second: isScrolledIntoView(refDonutSecond.current),
        third: isScrolledIntoView(refDonutThird.current),
      });
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', () => onScroll());
    return window.removeEventListener('scroll', () => onScroll());
  }, []);

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
          <div className={s.block} ref={refDonutSecond}>
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
          <div className={s.block} ref={refDonutThird}>
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
          <img
            className={cx(s.donutImage, s.donutImageFirst)}
            src="/images/donut/DonutFirst.png"
            alt="DONUTEZ base"
          />
          <img
            className={cx(
              s.donutImage,
              s.donutImageSecond, { [s.active]: isSecondActive.second },
            )}
            src="/images/donut/DonutSecond.png"
            alt="DONUTEZ base"
          />
          <img
            className={cx(
              s.donutImage,
              s.donutImageThird, { [s.active]: isSecondActive.third },
            )}
            src="/images/donut/DonutThird.png"
            alt="DONUTEZ base"
          />
        </div>
      </Row>
      <Row className={s.final}>
        <Heading header="Create it!" subheader="Finally" />
        <p className={s.description}>
          Get
          {' '}
          <strong>30%</strong>
          {' '}
          Discount for staking 60 DTZ
          <br />
          {' '}
          and get them back as reward in
          {' '}
          <strong>~2 weeks</strong>
          {' '}
          to create new contracts
        </p>
        <div className={s.cards}>
          <StyledCard className={s.card} theme="green">
            <h3 className={cx(s.header, s.headerCTA)}>80 DTZ</h3>
            <p className={s.subheader}>{t('home:+ 60 DTZ to stake')}</p>
            <h4 className={s.listHeader}>
              {t('home:You will get')}
              :
            </h4>
            <ul className={s.list}>
              <li>
                {t('home:Smart contract')}
              </li>
              <li>
                {t('home:Discount 30%')}
              </li>
              <li>
                {t('home:Own front-end')}
              </li>
              <li>
                {t('home:Staked DTZ which u’ll get back in 2 weeks as reward')}
              </li>
            </ul>
            <Button className={s.button}>{t('home:Create & Stake')}</Button>
          </StyledCard>
          <StyledCard className={s.card} theme="orange">
            <h3 className={s.header}>120 DTZ</h3>
            <p className={cx(s.subheader, s.subheaderEmpty)}>0 DTZ</p>
            <h4 className={s.listHeader}>
              {t('home:You will get')}
              :
            </h4>
            <ul className={s.list}>
              <li>
                {t('home:Smart contract')}
              </li>
              <li>
                {t('home:Own front-end')}
              </li>
            </ul>
            <Button className={s.button} theme="secondary">{t('home:Create')}</Button>
          </StyledCard>
        </div>
        <HandRock className={s.hand} />
      </Row>
    </Container>
  );
};
