import { Batch, TransferParams } from '@utils/types';

export const shortize = (str: string) => `${str.slice(0, 4)}...${str.slice(-4)}`;

export const batchify = (
  batch: Batch, transfers: TransferParams[],
) => (
  transfers.reduce((b, tParams) => b.withTransfer(tParams), batch)
);
