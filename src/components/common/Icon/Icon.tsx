import React from 'react';
import cx from 'classnames';

import s from './Icon.module.sass';

type IconProps = {
  className?: string
};

export const Icon: React.FC<IconProps> = ({
  children,
  className,
}) => (
  <div className={cx(s.root, className)}>
    <div className={s.inner}>
      {children}
    </div>
  </div>
);
