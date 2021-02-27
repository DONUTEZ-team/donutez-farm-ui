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
  const tokenMD = MichelsonMap.fromLiteral({
    0: {
      token_id: '0',
      extras: MichelsonMap.fromLiteral({
        0: Buffer.from(
          JSON.stringify({
            name: 'Donutez Token',
            authors: ['DONUTEZ TEAM'],
          }),
        ).toString('hex'),
      }),
    },
  });

  // const tokenMD = MichelsonMap.fromLiteral(
  //   metadata.map((item, index) => (
  //     {
  //       index: {
  //         token_id: `${index}`,
  //         extras: MichelsonMap.fromLiteral({
  //           index: Buffer.from(item.tokenMetadata).toString('hex'),
  //         }),
  //       },
  //     }
  //   )),
  // );

  // const newMetadata: any = [];
  //
  // metadata.map((item, index) => {
  //   if (item.tokenMetadata) {
  //     const innerObject: any = {};
  //     innerObject[index] = JSON.stringify(item.tokenMetadata);
  //
  //     const object: any = {};
  //     object[index] = {
  //       token_id: index,
  //       extras: innerObject,
  //     };
  //     newMetadata.push(object);
  //   }
  // });

  // console.log('newMetadata', newMetadata);

  const contract = await tezos.wallet.at(TOKEN_FA2);

  const batch = tezos.wallet.batch([]);

  batchify(
    batch,
    [
      contract.methods.default(totalSuply, tokenMD).toTransferParams(),
    ],
  );

  await batch.send();
};
