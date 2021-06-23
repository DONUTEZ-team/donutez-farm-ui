import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { getStorageInfo, getTokenInfo } from '@utils/dapp';

export const getUserBalance = async (
  tezos: TezosToolkit,
  userAddress: string,
  tokenAddress: string,
) => {
  const tokenData = await getTokenInfo(tezos, tokenAddress);

  let balance = new BigNumber(0);
  const { ledger } = await getStorageInfo(
    tezos!,
    tokenAddress,
  );
  const ledgerRecord = await ledger.get(userAddress);
  if (ledgerRecord) {
    balance = ledgerRecord.balance;
  }

  return {
    balance,
    symbol: tokenData?.symbol,
    decimals: tokenData?.decimals ? +tokenData?.decimals : 0,
  };
};
