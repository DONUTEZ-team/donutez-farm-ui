import * as React from 'react';
import cx from 'classnames';

import { Container } from '@ui/Container';

import s from './Background.module.sass';

type BackgroundProps = {
  className?: string
};

export const Background: React.FC<BackgroundProps> = ({ className }) => (
  <div className={cx(s.root, className)}>
    <Container className={s.container}>
      <div className={s.ellipse1} />
      <div className={s.ellipse2} />
      <div className={s.ellipse3} />
      <div className={s.ellipse4} />
      <div className={s.ellipse5} />
    </Container>
    <div className={s.overlay} />
  </div>
);
