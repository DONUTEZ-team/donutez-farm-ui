import React, { useEffect, useState } from 'react';
import cx from 'classnames';

import { StyledCard } from '@components/ui/StyledCard';
import {
  MediaPreviewInfo,
  MediaType,
} from '@components/ui/MediaInput';
import XToken from '@icons/X_TOKEN.svg';

import s from './TokenCard.module.sass';

type TokenCardProps = {
  icon?: string | File
  name?: string
  symbol?: string
  decimals?: number
  totalSupply?: number
  className?: string
};

export const TokenCard: React.FC<TokenCardProps> = ({
  icon,
  name,
  symbol,
  decimals,
  totalSupply,
  className,
}) => {
  const [mediaPreviewInfo, setMediaPreviewInfo] = useState<MediaPreviewInfo | string>();

  useEffect(
    () => {
      if (icon instanceof File) {
        if (icon) {
          const reader = new FileReader();
          reader.addEventListener(
            'load',
            ({ target }) => {
              const previewUrl = target?.result;
              if (typeof previewUrl === 'string') {
                let type: MediaType;
                if (icon.type.startsWith('image/')) {
                  type = MediaType.Image;
                } else {
                  type = MediaType.Unknown;
                }

                setMediaPreviewInfo({
                  type,
                  url: previewUrl,
                });
              } else {
                throw new Error('Received non string result from file reader');
              }
            },
          );
          reader.readAsDataURL(icon);
        } else {
          setMediaPreviewInfo(undefined);
        }
      } else {
        setMediaPreviewInfo(icon);
      }
    },
    [icon],
  );

  return (
    <StyledCard className={cx(s.root, className)} theme="blue">
      <div className={s.icon}>
        <div className={s.iconInner}>
          {icon ? (
            <img
              src={
              typeof mediaPreviewInfo === 'string'
                ? mediaPreviewInfo
                : mediaPreviewInfo?.url
            }
              alt={name}
            />
          ) : (
            <XToken />
          )}
        </div>
      </div>
      <h2 className={s.header}>
        Token:
        {' '}
        {`${name || 'Unnamed'} (${
          symbol || (
            name
              ? name.replace(' ', '').substr(0, 3).toUpperCase()
              : 'UNMD'
          )
        })`}
      </h2>
      <h2 className={s.header}>
        Decimals:
        {' '}
        {decimals || decimals === 0 ? decimals : 6}
      </h2>
      <h2 className={s.header}>
        Total supply:
        {' '}
        {totalSupply || 0}
      </h2>
    </StyledCard>
  );
};
