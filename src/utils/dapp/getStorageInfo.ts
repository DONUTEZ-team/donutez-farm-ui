import { TezosToolkit } from '@taquito/taquito';
import memoizee from 'memoizee';

const getContractPure = (tezos: TezosToolkit, address: string) => tezos.contract.at(address);

export const getContract = memoizee(getContractPure);

const getStoragePure = async (tezos: TezosToolkit, contractAddress: string) => {
  const contract = await getContract(tezos, contractAddress);
  return contract?.storage<any>();
};

export const getStorageInfo = memoizee(getStoragePure, { maxAge: 30000 });
