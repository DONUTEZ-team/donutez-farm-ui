import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import constate from 'constate';
import { TempleWallet } from '@temple-wallet/dapp';
import { TezosToolkit } from '@taquito/taquito';
import {
  LOCALSTORAGE_RECONNECT_KEY,
  NETWORK_RPC,
} from '@utils/defaults';

export type DAppType = {
  wallet: null | TempleWallet
  tezos: TezosToolkit | null
  accountPkh: string | null
};

function useDApp({ appName }: { appName: string }) {
  const [{ wallet, tezos, accountPkh }, setState] = useState(() => (<DAppType>{
    wallet: null,
    tezos: new TezosToolkit(NETWORK_RPC),
    accountPkh: null,
  }));

  const ready = Boolean(tezos);

  useEffect(() => TempleWallet.onAvailabilityChange(async (available) => {
    if (available) {
      let perm;
      try {
        perm = await TempleWallet.getCurrentPermission();
      } catch (error) {
        console.log(error);
      }

      const wlt = new TempleWallet(
        appName,
        localStorage.getItem(LOCALSTORAGE_RECONNECT_KEY) ? null : perm,
      );
      setState({
        wallet: wlt,
        tezos: wlt.connected ? wlt.toTezos() : new TezosToolkit(NETWORK_RPC),
        accountPkh: wlt.connected ? await wlt.getPKH() : null,
      });
    } else {
      setState({
        wallet: null,
        tezos: new TezosToolkit(NETWORK_RPC),
        accountPkh: null,
      });
    }
  }), [appName, setState]);

  useEffect(() => {
    if (wallet && wallet.connected) {
      TempleWallet.onPermissionChange((perm) => {
        if (!perm) {
          setState({
            wallet: new TempleWallet(appName),
            tezos: new TezosToolkit(NETWORK_RPC),
            accountPkh: null,
          });
        }
      });
    }
  }, [wallet, appName, setState]);

  const connect = useCallback(
    async (network, opts) => {
      try {
        if (!wallet) {
          throw new Error('Thanos Wallet not available');
        }
        await wallet.connect(network, opts);
        const tzs = wallet.toTezos();
        const pkh = await tzs.wallet.pkh();
        localStorage.removeItem(LOCALSTORAGE_RECONNECT_KEY);
        setState({
          wallet,
          tezos: tzs,
          accountPkh: pkh,
        });
      } catch (err) {
        alert(`Failed to connect ThanosWallet: ${err.message}`);
      }
    },
    [setState, wallet],
  );

  const disconnect = useCallback(
    () => {
      setState((prevState) => ({
        ...prevState,
        tezos: new TezosToolkit(NETWORK_RPC),
        accountPkh: null,
      }));
      localStorage.setItem(LOCALSTORAGE_RECONNECT_KEY, 'true');
    },
    [],
  );

  return {
    wallet,
    tezos,
    accountPkh,
    ready,
    connect,
    disconnect,
  };
}

// App provider
export const [
  DAppProvider,
  useWallet,
  useTezos,
  useAccountPkh,
  useReady,
  useConnect,
  useDisconnect,
] = constate(
  useDApp,
  (v) => v.wallet,
  (v) => v.tezos,
  (v) => v.accountPkh,
  (v) => v.ready,
  (v) => v.connect,
  (v) => v.disconnect,
);
