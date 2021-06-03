import React, { forwardRef, ReactNode } from 'react';
import cx from 'classnames';
import { Heading, HeadingProps } from '@components/ui/Heading';

import s from './FormBlock.module.sass';

type FormBlockProps = HeadingProps & {
  children: ReactNode
};

export const FormBlock = forwardRef<HTMLDivElement, FormBlockProps>(({
  header,
  subheader,
  isRequired,
  children,
  className,
}, ref) => (
  <div className={cx(s.root, className)} ref={ref}>
    <Heading
      header={header}
      subheader={subheader}
      isRequired={isRequired}
    />
    {children}
  </div>
));
