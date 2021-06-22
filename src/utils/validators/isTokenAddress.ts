import { i18n } from 'next-i18next';
import { validateAddress } from '@taquito/utils';

export const isTokenAddress = (value: string) => (
  validateAddress(value) === 3
    ? undefined
    : i18n?.t('common:You entered not a valid token address')
);
