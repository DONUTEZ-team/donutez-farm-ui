import React from 'react';
import cx from 'classnames';

import s from './Header.module.sass';

type HeaderProps = {
  className?: string
};

export const Header: React.FC<HeaderProps> = ({
  className,
}) => (
  <header className={cx(s.root, className)}>
    <nav>
      Nav
    </nav>
  </header>
);
