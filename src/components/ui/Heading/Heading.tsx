import React, { ReactNode } from 'react';
import cx from 'classnames';

import s from './Heading.module.sass';

export interface HeadingProps {
  header: ReactNode
  subheader: ReactNode
  isRequired?: boolean | null
  className?: string
}

export const Heading: React.FC<HeadingProps> = ({
  header,
  subheader,
  isRequired = true,
  className,
}) => (
  <div className={cx(s.root, className)}>
    <span className={s.subheader}>
      {subheader}
      {isRequired !== null && (isRequired ? '*' : <span className={s.optional}>(Optional)</span>)}
    </span>
    <h2 className={s.header}>{header}</h2>
  </div>
);
