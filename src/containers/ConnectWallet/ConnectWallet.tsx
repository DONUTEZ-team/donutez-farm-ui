import React, { useCallback } from 'react';
import { useTranslation } from '@i18n';
import { useConnect, useReady, useAccountPkh } from '@utils/dapp';
import { NETWORK } from '@utils/defaults';
import { shortize } from '@utils/helpers';

import { Button } from '@ui/Button';

type ConnectWalletProps = {
  className?: string
};

export const ConnectWallet: React.FC<ConnectWalletProps> = ({ className }) => {
  const connect = useConnect();
  const ready = useReady();
  const accountPkh = useAccountPkh();

  const { t } = useTranslation(['common']);

  const handleConnect = useCallback(async () => {
    try {
      await connect(NETWORK, { forcePermission: ready });
    } catch (err) {
      alert(err.message);
    }
  }, [ready, connect]);

  return (ready && accountPkh) ? (
    <Button
      type="button"
      className={className}
      theme="secondary"
      aria-label={accountPkh}
      title={accountPkh}
      onClick={handleConnect}
    >
      {shortize(accountPkh)}
    </Button>
  ) : (
    <Button
      type="button"
      className={className}
      onClick={handleConnect}
    >
      {t('common:Connect')}
    </Button>
  );
};
