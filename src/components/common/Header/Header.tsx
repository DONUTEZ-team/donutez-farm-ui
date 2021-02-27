import React, { useMemo } from 'react';
import Link from 'next/link';
import cx from 'classnames';
import { useTranslation } from '@i18n';

import { ConnectWallet } from '@containers/ConnectWallet';
import { Container } from '@ui/Container';
import { Row } from '@ui/Row';
import { HeaderItem } from '@components/common/Header/HeaderItem';
import Donutez from '@icons/DONUTEZ.svg';

import s from './Header.module.sass';

type HeaderProps = {
  className?: string
};

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const { t } = useTranslation(['common']);

  const navItems = useMemo(() => (
    [
      {
        link: '/',
        label: t('common:Create Farming'),
      },
      {
        link: '/deploy',
        label: t('common:Deploy Token'),
      },
      {
        link: '/farm',
        label: t('common:Farm DONUTEZ'),
      },
      {
        link: '/account',
        label: t('common:Account'),
      },
    ]
  ), [t]);

  return (
    <header className={cx(s.root, className)}>
      <Container>
        <Row>
          <Link
            href="/"
          >
            <a className={s.logo}>
              <Donutez />
            </a>
          </Link>
          <nav className={s.nav}>
            {navItems.map((link) => (
              <HeaderItem
                key={link.link}
                link={link.link}
                label={link.label}
              />
            ))}
          </nav>
          <ConnectWallet className={s.button} />
        </Row>
      </Container>
    </header>
  );
};
