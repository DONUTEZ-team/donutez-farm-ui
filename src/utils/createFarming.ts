import { TezosToolkit } from '@taquito/taquito';
import { batchify } from '@utils/helpers';
import {
  CONSTRUCT_FARM_CONTRACT,
  CONSTRUCT_FEE,
  CONSTRUCT_STAKE_FEE, CONSTRUCT_STAKE_SUM,
  DTZ_TOKEN, FARM_CONTRACT,
} from '@utils/defaults';

export const createFarming = async (
  tezos: TezosToolkit,
  qpToken: string,
  token: string,
  lifeTime: number,
  rewardPeriod: number,
  rewardPerBlock: number,
  isStake: boolean = false,
) => {
  const contractApprove = await tezos.wallet.at(DTZ_TOKEN);
  const contractConstruct = await tezos.wallet.at(CONSTRUCT_FARM_CONTRACT);

  const batch = tezos.wallet.batch([]);

  if (isStake) {
    batchify(
      batch,
      [
        contractApprove.methods.approve(
          CONSTRUCT_FARM_CONTRACT, CONSTRUCT_STAKE_FEE,
        ).toTransferParams(),
        contractApprove.methods.approve(FARM_CONTRACT, CONSTRUCT_STAKE_SUM).toTransferParams(),
        contractConstruct.methods.deployYF(
          qpToken, token, lifeTime, rewardPeriod, rewardPerBlock, true, CONSTRUCT_STAKE_SUM,
        ).toTransferParams(),
      ],
    );
  } else {
    batchify(
      batch,
      [
        contractApprove.methods.approve(CONSTRUCT_FARM_CONTRACT, CONSTRUCT_FEE).toTransferParams(),
        contractConstruct.methods.deployYF(
          qpToken, token, lifeTime, rewardPeriod, rewardPerBlock, false, 0,
        ).toTransferParams(),
      ],
    );
  }

  const batchOp = await batch.send();
  await batchOp.confirmation();
};
