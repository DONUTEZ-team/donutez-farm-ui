import React, { ReactNode } from 'react';
import cx from 'classnames';

import { StyledCard } from '@components/ui/StyledCard';
import { Icon } from '@components/common/Icon';

import s from './FarmCard.module.sass';

type FarmCardProps = {
  className?: string
  firstIcon: ReactNode | string
  secondIcon?: ReactNode | string
  value: number | null
  header: string
  buttons: ReactNode
};

export const FarmCard: React.FC<FarmCardProps> = ({
  className,
  firstIcon,
  secondIcon,
  value,
  header,
  buttons,
}) => (
  <StyledCard className={cx(s.root, className)}>
    <div className={s.icons}>
      <Icon className={s.icon}>{firstIcon}</Icon>
      {secondIcon && <Icon className={s.icon}>{secondIcon}</Icon>}
    </div>
    <p className={s.value}>
      {value ?? 'XXXX'}
    </p>
    <h2 className={s.header}>
      {header}
    </h2>
    <div className={s.buttons}>
      {buttons}
    </div>
  </StyledCard>
);
