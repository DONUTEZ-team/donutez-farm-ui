import { TezosToolkit, MichelsonMap } from '@taquito/taquito';
import { batchify } from '@utils/helpers';
import {
  TOKEN_FA1, TOKEN_FA2,
} from '@utils/defaults';

export const createTokenFAOne = async (
  tezos: TezosToolkit,
  totalSuply: number,
) => {
  const contract = await tezos.wallet.at(TOKEN_FA1);

  const batch = tezos.wallet.batch([]);

  batchify(
    batch,
    [
      contract.methods.default(totalSuply).toTransferParams(),
    ],
  );

  await batch.send();
};

export const createTokenFATwo = async (
  tezos: TezosToolkit,
  totalSuply: number,
  metadata: {
    tokenId: number
    tokenMetadata: string
  }[],
) => {
  const object: any = {};
  metadata.forEach((item, index) => {
    object[index] = {
      token_id: `${index}`,
      extras: MichelsonMap.fromLiteral({
        index: Buffer.from(item.tokenMetadata).toString('hex'),
      }),
    };
  });

  const tokenMD = MichelsonMap.fromLiteral(object);

  const MD = MichelsonMap.fromLiteral({
    '': Buffer.from('tezos-storage:here', 'ascii').toString('hex'),
    here: Buffer.from(
      JSON.stringify({
        version: 'v0.0.1',
        description: 'Donutez Token',
        name: 'Donutez Token',
        authors: ['DONUTEZ TEAM'],
        source: {
          tools: ['Ligo', 'Flextesa'],
          location: 'https://ligolang.org/',
        },
        interfaces: ['TZIP-12', 'TZIP-16'],
        errors: [],
        views: [],
        tokens: {
          dynamic: [
            {
              big_map: 'tokenMD',
            },
          ],
        },
      }),
      'ascii',
    ).toString('hex'),
  });

  const contract = await tezos.wallet.at(TOKEN_FA2);

  const batch = tezos.wallet.batch([]);

  batchify(
    batch,
    [
      contract.methods.default(totalSuply, tokenMD, MD).toTransferParams(),
    ],
  );

  await batch.send();
};
