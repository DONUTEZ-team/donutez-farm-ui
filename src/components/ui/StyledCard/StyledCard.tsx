import React from 'react';
import cx from 'classnames';

import s from './StyledCard.module.sass';

type StyledCardProps = {
  theme?: keyof typeof themeClass
  className?: string
};

const themeClass = {
  blue: s.blue,
  orange: s.orange,
  green: s.green,
};

export const StyledCard: React.FC<StyledCardProps> = ({
  children,
  className,
  theme = 'blue',
}) => {
  const compoundClassName = cx(
    s.root,
    themeClass[theme],
    className,
  );

  return (
    <div className={compoundClassName}>{children}</div>
  );
};
