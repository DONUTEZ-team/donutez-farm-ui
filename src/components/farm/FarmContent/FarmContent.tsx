import React from 'react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import cx from 'classnames';

import { Container } from '@components/ui/Container';
import { Row } from '@components/ui/Row';
import { Button } from '@components/ui/Button';
import { FarmCard } from '@components/farm/FarmContent/FarmCard';
import DonutezIcon from '@icons/DONUTEZ_TOKEN.svg';
import TezosIcon from '@icons/TEZOS_TOKEN.svg';

import s from './FarmContent.module.sass';

type FarmContentProps = {
  className?: string
};

export const FarmContent: React.FC<FarmContentProps> = ({
  className,
}) => {
  const { t } = useTranslation(['farm']);

  return (
    <section className={cx(s.root, className)}>
      <Container>
        <Row className={s.row}>
          <img
            className={s.background1}
            src="/images/FarmBackground1.svg"
            alt="DONUTEZ Farm"
          />
          <img
            className={s.background2}
            src="/images/FarmBackground2.svg"
            alt="DONUTEZ Farm"
          />
          <img
            className={s.background3}
            src="/images/FarmBackground3.svg"
            alt="DONUTEZ Farm"
          />
          <h1 className={cx(s.header)}>
            {t('farm:stake QP tokens to earn DONUTEZ')}
          </h1>
          <div className={s.cards}>
            <FarmCard
              className={s.card}
              firstIcon={<DonutezIcon />}
              value={0}
              header="DONUTEZ tokens earned"
              buttons={(
                <>
                  <Button>Harvest</Button>
                </>
              )}
            />
            <FarmCard
              className={s.card}
              firstIcon={<DonutezIcon />}
              secondIcon={<TezosIcon />}
              value={0}
              header="DTZ / XTZ QP tokens staked"
              buttons={(
                <>
                  <Button className={s.button}>Stake</Button>
                  <Button className={s.button} theme="secondary">Unstake</Button>
                </>
              )}
            />
          </div>

          <div className={s.hand}>
            <Image
              layout="responsive"
              quality={90}
              width={173}
              height={373}
              priority
              src="/images/HandOkay.png"
              alt="DONUTEZ Farm"
            />
          </div>
        </Row>
      </Container>
    </section>
  );
};
