import React, { useMemo } from 'react';
import Link from 'next/link';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { ConnectWallet } from '@containers/ConnectWallet';
import { Container } from '@components/ui/Container';
import { Row } from '@components/ui/Row';
import { HeaderItem } from '@components/common/Header/HeaderItem';
import { LanguageSwitcher } from '@components/common/LanguageSwitcher';
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
        link: '/token',
        label: t('common:Create Token'),
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
        <Row className={s.row}>
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
          <LanguageSwitcher className={s.languageSwitcher} />
          <ConnectWallet />
        </Row>
      </Container>
    </header>
  );
};
