import React, { ReactNode, useCallback } from 'react';
import cx from 'classnames';
import { useTranslation } from '@i18n';

import s from './Card.module.sass';

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

export const Card: React.FC<FarmCardProps> = ({
  className,
  type,
  firstIcon,
  secondIcon,
  value,
  balance = 0,
  openDepositHandler,
  harvestHandler,
}) => {
  const { t } = useTranslation(['common', 'farm']);

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
      <button
        type="button"
        className={cx(s.button, s.btn, s.effect04)}
        data-sm-link-text={!(balance > 0) ? 'DISABLED:(' : 'CLICK'}
        disabled={!(balance > 0)}
        onClick={openModal}
      >
        <span>
          {t('common:Stake')}
        </span>
      </button>
      <button
        type="button"
        className={cx(s.button, s.btn, s.effect04)}
        data-sm-link-text={!(value > 0) ? 'DISABLED:(' : 'CLICK'}
        disabled={!(value > 0)}
        onClick={closeModal}
      >
        <span>
          {t('common:Unstake')}
        </span>
      </button>
    </div>
  );
  if (type === 'harvest') {
    button = (
      <button
        type="button"
        className={cx(s.button, s.btn, s.effect04)}
        data-sm-link-text={!(value > 0) ? 'DISABLED:(' : 'CLICK'}
        disabled={!(value > 0)}
        onClick={harvestHandler}
      >
        <span>
          {t('common:Harvest')}
        </span>
      </button>
    );
  }

  return (
    <div className={cx(s.root, className)}>
      <div className={s.icons}>
        <Icon>{firstIcon}</Icon>
        {secondIcon && <Icon>{secondIcon}</Icon>}
      </div>
      <p className={s.value}>
        {value}
      </p>
      <h2 className={s.header}>
        {
          type === 'approve'
            ? t('farm:XXX / XTZ QP tokens staked')
            : t('farm:XXXXXXX tokens earned')
        }
      </h2>
      {button}
    </div>
  );
};
