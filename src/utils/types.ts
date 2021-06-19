import {
  WalletOperationBatch,
} from '@taquito/taquito';
import { OperationBatch } from '@taquito/taquito/dist/types/batch/rpc-batch-provider';

// Common
export type Batch = OperationBatch | WalletOperationBatch;
export type { TransferParams } from '@taquito/taquito/dist/types/operations/types';
