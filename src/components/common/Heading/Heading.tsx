import React, { ReactNode } from 'react';
import cx from 'classnames';

import s from './Heading.module.sass';

type ContainerProps = {
  header: ReactNode
  subheader: ReactNode
  className?: string
};

export const Heading: React.FC<ContainerProps> = ({
  header,
  subheader,
  className,
}) => (
  <div className={cx(s.root, className)}>
    <span className={s.subheader}>{subheader}</span>
    <h2 className={s.header}>{header}</h2>
  </div>
);
