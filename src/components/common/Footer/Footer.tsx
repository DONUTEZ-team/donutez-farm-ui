import React from 'react';
import cx from 'classnames';

import s from './Footer.module.sass';

type FooterProps = {
  classNames?: string
};

export const Footer:React.FC<FooterProps> = ({
  classNames,
}) => (
  <footer className={cx(s.root, classNames)}>
    Footer
  </footer>
);
