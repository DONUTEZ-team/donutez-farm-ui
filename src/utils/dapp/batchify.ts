import { Batch, TransferParams } from '@utils/types';

export const batchify = (
  batch: Batch, transfers: TransferParams[],
) => (
  transfers.reduce((b, tParams) => b.withTransfer(tParams), batch)
);
