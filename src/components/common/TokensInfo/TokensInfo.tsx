import React from 'react';
import cx from 'classnames';

import { BCD } from '@utils/defaults';

import s from './TokensInfo.module.sass';

export interface TokenProps {
  name?: string | null
  symbol?: string | null
  icon?: string | null
  address?: string | null
}

type TokensInfoProps = {
  firstToken: TokenProps | 'Tez'
  secondToken?: TokenProps
  pairLink?: string
  className?: string
};

const refactorToken = (token: TokenProps) => ({
  name: token.name ?? 'Unnamed',
  symbol: token.symbol ?? 'UNMD',
  address: token.address,
  icon: token.icon,
});

export const TokensInfo: React.FC<TokensInfoProps> = ({
  firstToken,
  secondToken,
  pairLink,
  className,
}) => {
  const refactoredFirstToken = firstToken === 'Tez' ? ({
    name: 'Tezos',
    symbol: 'XTZ',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2011.png',
    address: 'Tez',
  }) : refactorToken(firstToken);
  const refactoredSecondToken = secondToken && refactorToken(secondToken);

  const link = secondToken && pairLink
    ? `${BCD}${pairLink}`
    : `${BCD}${refactoredFirstToken.address}_0`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer noopener"
      className={cx(s.root, className)}
    >
      {refactoredSecondToken ? (
        <span className={s.icons}>
          <span className={s.icon}>
            {refactoredFirstToken.icon ? (
              <img src={refactoredFirstToken.icon} alt={refactoredFirstToken.name} />
            ) : (
              'icon'
            )}
          </span>
          <span className={cx(s.icon, s.iconPair)}>
            {refactoredSecondToken.icon ? (
              <img src={refactoredSecondToken.icon} alt={refactoredSecondToken.name} />
            ) : (
              'icon'
            )}
          </span>
        </span>
      ) : (
        <span className={s.icon}>
          {refactoredFirstToken.icon ? (
            <img src={refactoredFirstToken.icon} alt={refactoredFirstToken.name} />
          ) : (
            'icon'
          )}
        </span>
      )}
      <span className={s.token}>
        {refactoredSecondToken ? (
          `${refactoredFirstToken.name}/${refactoredSecondToken.name} (${refactoredFirstToken.symbol}/${refactoredSecondToken.symbol})`
        ) : (
          `${refactoredFirstToken.name} (${refactoredFirstToken.symbol})`
        )}
      </span>
    </a>
  );
};
