import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { batchify } from '@utils/helpers';
import { getStorageInfo } from '@utils/dapp';

export const getUserHarvest = async (
  tezos: TezosToolkit,
  contract: string,
  accountPkh: string,
) => {
  const storage = await getStorageInfo(tezos, contract);
  const {
    rewardPerShare,
    ledger,
  } = storage;
  const val = await ledger.get(accountPkh);

  const {
    reward,
    staked,
    lastRewardPerShare,
  } = val;

  const rewardDiv = new BigNumber(rewardPerShare).minus(new BigNumber(lastRewardPerShare));
  const newStaked = new BigNumber(staked).multipliedBy(rewardDiv);
  const finalReward = new BigNumber(reward).plus(newStaked);

  if (finalReward.lt(new BigNumber(1))) {
    return new BigNumber(0);
  }
  return finalReward;
};

export const stake = async (
  tezos: TezosToolkit,
  tokenContract: string,
  amount: BigNumber,
  rewardContract: string,
) => {
  const contractApprove = await tezos.wallet.at(tokenContract);
  const contractStake = await tezos.wallet.at(rewardContract);

  const batch = tezos.wallet.batch([]);
  batchify(
    batch,
    [
      contractApprove.methods.approve(rewardContract, amount).toTransferParams(),
      contractStake.methods.stake(amount).toTransferParams(),
    ],
  );

  await batch.send();
};

export const unstake = async (
  tezos: TezosToolkit,
  rewardContract: string,
  amount: BigNumber,
) => {
  const contract = await tezos.wallet.at(rewardContract);

  const batch = tezos.wallet.batch([]);
  batchify(
    batch,
    [
      contract.methods.unstake(amount).toTransferParams(),
      contract.methods.claim('').toTransferParams(),
    ],
  );
  await batch.send();
};

export const harvest = async (
  tezos: TezosToolkit,
  rewardContract: string,
) => {
  const contract = await tezos.wallet.at(rewardContract);
  const operation = await contract.methods.claim('').send();
  await operation.confirmation();
};
