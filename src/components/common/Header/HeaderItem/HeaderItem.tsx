import React from 'react';
import Link from 'next/link';
import { SingletonRouter, withRouter } from 'next/router';
import cx from 'classnames';

import s from './HeaderItem.module.sass';

type ItemProps = {
  router: SingletonRouter
  link: string
  label: string
  className?: string
};

const Item: React.FC<ItemProps> = ({
  router,
  link,
  label,
}) => (
  <Link href={link}>
    <a className={cx(s.root, {
      [s.active]: router.pathname === link as string,
    })}
    >
      {label}
    </a>
  </Link>
);

export const HeaderItem = withRouter(Item);
