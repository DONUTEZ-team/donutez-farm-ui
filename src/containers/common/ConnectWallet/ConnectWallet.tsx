import React, { useCallback } from 'react';

import {
  useConnect, useReady, useAccountPkh, useDisconnect,
} from '@utils/dapp';
import { NETWORK } from '@utils/defaults';
import { Button } from '@components/ui/Button';
import { AccountButton } from '@components/common/AccountButton';

type ConnectWalletProps = {
  label?: string
  className?: string
};

export const ConnectWallet: React.FC<ConnectWalletProps> = ({
  label = 'Connect',
  className,
}) => {
  const connect = useConnect();
  const disconnect = useDisconnect();
  const ready = useReady();
  const accountPkh = useAccountPkh();

  const handleConnect = useCallback(async () => {
    try {
      await connect(NETWORK, { forcePermission: ready });
    } catch (err) {
      alert(err.message);
    }
  }, [ready, connect]);

  const handleDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

  return (ready && accountPkh) ? (
    <AccountButton
      balance={120}
      accountPkh={accountPkh}
      onReconnect={handleConnect}
      onDisconnect={handleDisconnect}
      className={className}
    />
  ) : (
    <Button
      className={className}
      onClick={handleConnect}
    >
      {label}
    </Button>
  );
};
