import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';
import cx from 'classnames';
import BigNumber from 'bignumber.js';

import { useTezos } from '@utils/dapp';
import {
  BLOCK_INTERVAL,
  DONUTEZ_TOKEN_ADDRESS,
} from '@utils/defaults';
import { getUserBalance } from '@utils/dapp/getUserBalance';
import useBlockchainSWR from '@utils/useBlockchainSWR';
import { Button } from '@components/ui/Button';

import s from './AccountButton.module.sass';

type AccountButtonProps = {
  accountPkh: string
  onReconnect: () => void
  onDisconnect: () => void
  className?: string
};

export const AccountButton: React.FC<AccountButtonProps> = ({
  accountPkh,
  onReconnect,
  onDisconnect,
  className,
}) => {
  const tezos = useTezos()!;

  const [accountDialogOpened, setAccountDialogOpened] = useState(false);

  const openAccountDialog = useCallback(() => {
    setAccountDialogOpened(true);
  }, []);
  const closeAccountDialog = useCallback(() => {
    setAccountDialogOpened(false);
  }, []);

  const getUserBalanceCb = useCallback(async () => (
    getUserBalance(tezos, accountPkh, DONUTEZ_TOKEN_ADDRESS)
  ),
  [accountPkh, tezos]);

  const { error, data } = useBlockchainSWR(
    ['donutez-balance'],
    getUserBalanceCb,
    { refreshInterval: BLOCK_INTERVAL },
  );

  const balanceInfo = useMemo(() => {
    if (error) {
      return {
        balance: '0',
        token: 'XXX',
      };
    }
    return {
      balance: data?.balance
        .div(new BigNumber(10).pow(data?.decimals))
        .decimalPlaces(data?.decimals, 1)
        .toString(),
      token: data?.symbol,
    };
  }, [data?.balance, data?.decimals, data?.symbol, error]);

  if (!error && !data) {
    return (
      <Button
        className={className}
        theme="secondary"
        disabled
      >
        Loading...
      </Button>
    );
  }

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
          {balanceInfo.balance}
          {' '}
          {balanceInfo.token}
        </span>
        <span className={s.icon} />
      </button>
      <div className={cx(s.dialog, { [s.active]: accountDialogOpened })}>
        <p className={s.header}>Your wallet:</p>
        <p className={s.value}>{accountPkh}</p>
        <p className={s.header}>Your balance:</p>
        <p className={cx(s.value, s.amount)}>
          {balanceInfo.balance}
          {' '}
          {balanceInfo.token}
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
