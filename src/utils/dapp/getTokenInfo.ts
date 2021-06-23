import { TezosToolkit } from '@taquito/taquito';

import { getTokenLogo, uintToString } from '@utils/helpers';
import { getStorageInfo } from '@utils/dapp';

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
  const decimals = uintToString(tokenInfo.get('decimals')) ?? null;
  const icon = getTokenLogo(uintToString(tokenInfo.get('icon') || tokenInfo.get('thumbnailUri'))) ?? null;

  return {
    name,
    symbol,
    decimals,
    icon,
    address: tokenAddress,
  };
};
