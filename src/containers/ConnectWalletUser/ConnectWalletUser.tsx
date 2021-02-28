import React, { useCallback } from 'react';
import cx from 'classnames';
import { useConnect, useReady, useAccountPkh } from '@utils/dapp';
import { NETWORK } from '@utils/defaults';
import { shortize } from '@utils/helpers';

import s from './ConnectWalletUser.module.sass';

type ConnectWalletProps = {
  className?: string
};

export const ConnectWalletUser: React.FC<ConnectWalletProps> = ({ className }) => {
  const connect = useConnect();
  const ready = useReady();
  const accountPkh = useAccountPkh();

  const handleConnect = useCallback(async () => {
    try {
      await connect(NETWORK, { forcePermission: ready });
    } catch (err) {
      alert(err.message);
    }
  }, [ready, connect]);

  return (ready && accountPkh) ? (
    <button
      type="button"
      className={cx(s.btn, s.effect04, className)}
      aria-label={accountPkh}
      title={accountPkh}
      onClick={handleConnect}
      data-sm-link-text="CHANGE"
    >
      <span>
        {shortize(accountPkh)}
      </span>
    </button>
  ) : (
    <button
      type="button"
      className={cx(s.btn, s.effect04, className)}
      onClick={handleConnect}
      data-sm-link-text="CLICK"
    >
      <span>
        Connect
      </span>
    </button>
  );
};
