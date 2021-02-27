import { Batch, TransferParams } from '@utils/types';
import BigNumber from 'bignumber.js';

export const shortize = (str: string) => `${str.slice(0, 4)}...${str.slice(-4)}`;

export const convertUnits = (
  n: BigNumber, unit: number | BigNumber = 6,
) => (
  n.div(new BigNumber(10).pow(unit))
);

export const batchify = (
  batch: Batch, transfers: TransferParams[],
) => (
  transfers.reduce((b, tParams) => b.withTransfer(tParams), batch)
);
