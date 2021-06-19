import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import constate from 'constate';
import { TempleWallet } from '@temple-wallet/dapp';
import { TezosToolkit } from '@taquito/taquito';
import memoizee from 'memoizee';
import { NETWORK_RPC } from '@utils/defaults';
import { getTokenLogo, uintToString } from '@utils/helpers';

function removeFeeAndLimit(op: any) {
  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    fee, gas_limit, storage_limit, ...rest
  } = op;
  return rest;
}
class PatchedTempleWallet extends TempleWallet {
  async sendOperations(opParams: any[]) {
    return super.sendOperations(opParams.map(removeFeeAndLimit));
  }
}

export type DAppType = {
  wallet: null | PatchedTempleWallet
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

  useEffect(() => PatchedTempleWallet.onAvailabilityChange(async (available) => {
    if (available) {
      let perm;
      try {
        perm = await PatchedTempleWallet.getCurrentPermission();
      } catch (error) {
        console.log(error);
      }

      const wlt = new PatchedTempleWallet(appName, perm);
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
      PatchedTempleWallet.onPermissionChange((perm) => {
        if (!perm) {
          setState({
            wallet: new PatchedTempleWallet(appName),
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
      localStorage.setItem('shouldPreventReconnect', 'true');
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

/**
 * Block update
 */
export const useOnBlock = (tezos: TezosToolkit | null, callback: (hash: string) => void) => {
  const blockHashRef = useRef<string | undefined>();

  useEffect(() => {
    if (tezos) {
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
    }

    // close error: Expected to return a value
    return () => undefined;
  }, [tezos, callback]);
};

// STORAGE
const getContractPure = (tezos: TezosToolkit, address: string) => tezos.contract.at(address);

export const getContract = memoizee(getContractPure);

const getStoragePure = async (tezos: TezosToolkit, contractAddress: string) => {
  const contract = await getContract(tezos, contractAddress);
  return contract?.storage<any>();
};

export const getStorageInfo = memoizee(getStoragePure, { maxAge: 30000 });

// Token info
export const getTokenInfo = async (tezos: TezosToolkit, tokenAddress: string) => {
  const {
    token_metadata: tokenMetadata,
  } = await getStorageInfo(tezos, tokenAddress);
  if (!tokenMetadata) return null;
  const {
    token_info: tokenInfo,
  } = await tokenMetadata.get(0);
  if (!tokenInfo) return null;

  const name = uintToString(tokenInfo.get('name')) ?? null;
  const symbol = uintToString(tokenInfo.get('symbol')) ?? null;
  const icon = getTokenLogo(uintToString(tokenInfo.get('thumbnailUri'))) ?? null;

  return {
    name,
    symbol,
    icon,
    address: tokenAddress,
  };
};
