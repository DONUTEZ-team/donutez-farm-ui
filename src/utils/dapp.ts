import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import constate from 'constate';
import { TezosToolkit } from '@taquito/taquito';
import { TempleWallet } from '@temple-wallet/dapp';

import memoizee from 'memoizee';
import BigNumber from 'bignumber.js';
import { NETWORK_RPC } from '@utils/defaults';

export type DAppType = {
  wallet: null | TempleWallet
  tezos: TezosToolkit | null
  accountPkh: string | null
};

function useDApp({ appName }: { appName: string }) {
  const [{ wallet, tezos, accountPkh }, setState] = useState(() => (<DAppType>{
    wallet: null,
    tezos: null,
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

      const wlt = new TempleWallet(appName, perm);
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
        setState({
          wallet,
          tezos: tzs,
          accountPkh: pkh,
        });
      } catch (err) {
        alert(`Failed to connect TempleWallet: ${err.message}`);
      }
    },
    [setState, wallet],
  );

  return {
    wallet,
    tezos,
    accountPkh,
    ready,
    connect,
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
] = constate(
  useDApp,
  (v) => v.wallet,
  (v) => v.tezos,
  (v) => v.accountPkh,
  (v) => v.ready,
  (v) => v.connect,
);

/**
 * Block update
 */
export const useOnBlock = (tezos: TezosToolkit, callback: (hash: string) => void) => {
  const blockHashRef = useRef<string | undefined>();

  useEffect(() => {
    let sub: any; // Which type do I have to set here?

    const spawnSub = () => {
      sub = tezos.stream.subscribe('head');

      sub.on('data', (hash: string) => {
        if (blockHashRef.current && blockHashRef.current !== hash) {
          callback(hash);
        }
        blockHashRef.current = hash;
      });
      sub.on('error', (err: Error) => {
        if (process.env.NODE_ENV === 'development') {
          console.error(err);
        }
        sub.close();
        spawnSub();
      });
    };

    spawnSub();
    return () => sub.close();
  }, [tezos, callback]);
};
/**
 * Block update
 */

/**
 * Storage
 */
const getContractPure = (tezos: TezosToolkit, address: string) => tezos.contract.at(address);

export const getContract = memoizee(getContractPure);

const getStoragePure = async (tezos: TezosToolkit, contractAddress: string) => {
  const contract = await getContract(tezos, contractAddress);
  return contract?.storage<any>();
};

export const getStorageInfo = memoizee(getStoragePure, { maxAge: 30000 });

// Get QP-token
export const getStorage = async (
  tezos: TezosToolkit,
  contract: string,
  accountPkh: string,
) => {
  const storage = await getStorageInfo(tezos, contract);
  const ledger = storage.account_info;
  const val = await ledger.get(accountPkh);
  if (!val) return null;

  const amount = new BigNumber(val.amount);
  const former = new BigNumber(val.former);
  const { permit } = val;
  const reward = new BigNumber(val.reward);

  return {
    amount,
    former,
    permit,
    reward,
  };
};

// Get QP-token balance
export const getUserBalance = async (
  tezos: TezosToolkit,
  contract: string,
  accountPkh: string,
) => {
  const storage = await getStorageInfo(tezos, contract);
  const { ledger } = storage.storage;
  const val = await ledger.get(accountPkh);
  if (!val) return null;

  return new BigNumber(val.balance);
};
/**
 * Storage
 */
