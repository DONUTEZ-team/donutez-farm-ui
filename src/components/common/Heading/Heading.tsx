import React, { ReactNode } from 'react';
import cx from 'classnames';
import { useTranslation } from '@i18n';

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
}) => {
  const { i18n } = useTranslation();

  return (
    <div className={cx(s.root, className)}>
      <span className={s.subheader}>{subheader}</span>
      <h2 className={cx(s.header, { chinese: i18n.language === 'zh' })}>{header}</h2>
    </div>
  );
};
