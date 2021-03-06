import React, {
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'next-i18next';
import cx from 'classnames';

import { StyledCard } from '@components/ui/StyledCard';
import {
  MediaPreviewInfo,
  MediaType,
} from '@components/common/MediaInput';
import { Icon } from '@components/common/Icon';

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
  const { t } = useTranslation(['common', 'token']);

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
      <Icon className={s.icon}>
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
          <img
            src="/images/icon-token.png"
            alt={name}
          />
        )}
      </Icon>
      <h2 className={s.header}>
        {t('token:Token')}
        {': '}
        {`${name || 'Unnamed'} (${
          symbol || (
            name
              ? name.replace(' ', '').substr(0, 3).toUpperCase()
              : 'UNMD'
          )
        })`}
      </h2>
      <h2 className={s.header}>
        {t('token:Decimals')}
        {': '}
        {decimals || decimals === 0 ? decimals : 6}
      </h2>
      <h2 className={s.header}>
        {t('token:Total supply')}
        {': '}
        {totalSupply || 0}
      </h2>
    </StyledCard>
  );
};
