import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import cx from 'classnames';

import { Button } from '@components/ui/Button';
import { languages } from '@components/common/LanguageSwitcher/content';
import ArrowDown from '@icons/ArrowDown.svg';

import s from './LanguageSwitcher.module.sass';

type LanguageSwitcherProps = {
  className?: string
};

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const router = useRouter();

  const [languagesDialogOpened, setLanguagesDialogOpened] = useState(false);
  const openLanguages = useCallback(() => setLanguagesDialogOpened(true), []);
  const closeLanguages = useCallback(() => setLanguagesDialogOpened(false), []);

  return (
    <div
      className={cx(s.root, { [s.active]: languagesDialogOpened }, className)}
      onMouseEnter={openLanguages}
      onMouseLeave={closeLanguages}
    >
      <button
        type="button"
        className={s.button}
      >
        {router.locale}
        <ArrowDown className={s.icon} />
      </button>
      <div className={cx(s.languages, { [s.active]: languagesDialogOpened })}>
        {router.locales?.map((locale) => (
          <Button
            key={locale}
            theme={locale === router.locale ? 'light' : 'lightSecondary'}
            className={s.language}
            href={router.asPath}
            locale={locale}
          >
            {
              // @ts-ignore
              languages[locale]
            }
          </Button>
        ))}
      </div>
    </div>
  );
};
