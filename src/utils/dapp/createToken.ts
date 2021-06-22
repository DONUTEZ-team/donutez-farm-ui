import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { TOKEN_CONTRACT } from '@utils/defaults';
import { batchify } from '@utils/dapp';

export const createToken = async (
  tezos: TezosToolkit,
  name: string,
  symbol: string,
  icon: string,
  totalSupply: number,
  decimals: number,
) => {
  const contract = await tezos.wallet.at(TOKEN_CONTRACT);

  const batch = tezos.wallet.batch([]);

  batchify(
    batch,
    [
      contract.methods.default(
        new BigNumber(totalSupply).multipliedBy(
          new BigNumber(10).pow(new BigNumber(decimals)),
        ).toString(),
        [
          ['', Buffer.from('tezos-storage:token', 'ascii').toString('hex')],
          ['token', Buffer.from(
            JSON.stringify({
              version: 'v1.0.0',
              description: name,
              authors: ['<donutez.team@gmail.com>'],
              source: {
                tools: ['Ligo', 'Flextesa'],
                location: 'https://ligolang.org/',
              },
              interfaces: ['TZIP-7', 'TZIP-16'],
              errors: [],
              views: [],
            }),
            'ascii',
          ).toString('hex')],
        ],
        [
          [
            0,
            [
              ['symbol', Buffer.from(symbol).toString('hex')],
              ['name', Buffer.from(name).toString('hex')],
              ['decimals', Buffer.from(decimals.toString()).toString('hex')],
              ['icon', Buffer.from(icon).toString('hex')],
            ],
          ],
        ],
      ).toTransferParams(),
    ],
  );

  const operation = await batch.send();
  await operation.confirmation();
};
