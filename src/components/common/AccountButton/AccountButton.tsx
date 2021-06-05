import React, { useCallback, useState } from 'react';
import cx from 'classnames';

import { Button } from '@components/ui/Button';

import s from './AccountButton.module.sass';

type AccountButtonProps = {
  balance: number
  accountPkh: string
  onReconnect: () => void
  onDisconnect: () => void
  className?: string
};

export const AccountButton: React.FC<AccountButtonProps> = ({
  balance,
  accountPkh,
  onReconnect,
  onDisconnect,
  className,
}) => {
  const [accountDialogOpened, setAccountDialogOpened] = useState(false);

  const openAccountDialog = useCallback(() => {
    setAccountDialogOpened(true);
  }, []);
  const closeAccountDialog = useCallback(() => {
    setAccountDialogOpened(false);
  }, []);

  return (
    <div
      className={s.wrapper}
      onMouseEnter={openAccountDialog}
      onFocus={openAccountDialog}
      onMouseLeave={closeAccountDialog}
      onBlur={closeAccountDialog}
    >
      <button
        type="button"
        className={cx(s.root, className)}
      >
        <span className={s.balance}>
          {balance}
          {' '}
          XTZ
        </span>
        <span className={s.icon} />
      </button>
      <div className={cx(s.dialog, { [s.active]: accountDialogOpened })}>
        <p className={s.header}>Your wallet:</p>
        <p className={s.value}>{accountPkh}</p>
        <p className={s.header}>Your balance:</p>
        <p className={cx(s.value, s.amount)}>
          {balance}
          {' '}
          XTZ
        </p>
        <div className={s.buttons}>
          <Button
            className={s.button}
            theme="light"
            onClick={onReconnect}
          >
            Change account
          </Button>
          <Button
            className={s.button}
            theme="lightSecondary"
            onClick={onDisconnect}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};
