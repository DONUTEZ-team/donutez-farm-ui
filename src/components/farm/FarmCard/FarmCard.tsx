import React, { ReactNode, useCallback, useMemo } from 'react';
import cx from 'classnames';
import CountUp from 'react-countup';
import { useTranslation } from '@i18n';

import { Button } from '@ui/Button';
import { StyledCard } from '@ui/StyledCard';

import s from './FarmCard.module.sass';

const Icon: React.FC = ({ children }) => (
  <div className={s.icon}>
    {children}
  </div>
);

const typeClass = {
  harvest: s.harvest,
  approve: s.approve,
};

type FarmCardProps = {
  className?: string
  type: keyof typeof typeClass
  firstIcon: ReactNode
  secondIcon?: ReactNode
  prevValue?: number
  value: number
  balance?: number
  isReward?: boolean
  openDepositHandler?: (isStake: boolean) => void
  harvestHandler?: () => void
};

export const FarmCard: React.FC<FarmCardProps> = ({
  className,
  type,
  firstIcon,
  secondIcon,
  prevValue,
  value,
  balance = 0,
  openDepositHandler,
  harvestHandler,
}) => {
  const { t } = useTranslation(['common', 'farm']);

  const counter = useMemo(() => (
    <CountUp
      start={prevValue}
      end={value}
      decimals={0}
      duration={31}
    />
  ), [prevValue, value]);

  const openModal = useCallback(() => {
    if (openDepositHandler) {
      openDepositHandler(true);
    }
  }, [openDepositHandler]);
  const closeModal = useCallback(() => {
    if (openDepositHandler) {
      openDepositHandler(false);
    }
  }, [openDepositHandler]);

  let button = (
    <div className={s.buttons}>
      <Button
        className={s.button}
        disabled={!(balance > 0)}
        onClick={openModal}
      >
        {t('common:Stake')}
      </Button>
      <Button
        className={s.button}
        theme="secondary"
        disabled={!(value > 0)}
        onClick={closeModal}
      >
        {t('common:Unstake')}
      </Button>
    </div>
  );
  if (type === 'harvest') {
    button = (
      <Button
        className={s.button}
        disabled={!(value > 0)}
        onClick={harvestHandler}
      >
        {t('common:Harvest')}
      </Button>
    );
  }

  return (
    <StyledCard className={cx(s.root, className)}>
      <div className={s.icons}>
        <Icon>{firstIcon}</Icon>
        {secondIcon && <Icon>{secondIcon}</Icon>}
      </div>
      <p className={s.value}>
        {prevValue || prevValue === 0
          ? counter
          : value}
      </p>
      <h2 className={s.header}>
        {
          type === 'approve'
            ? t('farm:DTZ / XTZ QP tokens staked')
            : t('farm:DONUTEZ tokens earned')
        }
      </h2>
      {button}
    </StyledCard>
  );
};
