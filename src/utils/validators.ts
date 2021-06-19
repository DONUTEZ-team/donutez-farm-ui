import { i18n } from 'next-i18next';
import { validateContractAddress, validateAddress } from '@taquito/utils';

type ValidationType = (value: string) => string | undefined;

export const composeValidators = (...validators: ValidationType[]) => (value: string) => (
  validators.reduce(
    (
      error: string | undefined,
      validator: ValidationType,
    ) => error || validator(value), undefined,
  )
);

export const required = (value: string | number) => (
  value && value !== ''
    ? undefined
    : i18n?.t('common:This field is required')
);

export const isContractAddress = (value: string) => (
  validateContractAddress(value) === 3
    ? undefined
    : i18n?.t('common:You entered not a valid QP address')
);

export const isTokenAddress = (value: string) => (
  validateAddress(value) === 3
    ? undefined
    : i18n?.t('common:You entered not a valid token address')
);

export const validateMinMax = (min: number, max: number) => (value: string) => (
  !value || (+value >= min && +value <= max)
    ? undefined
    : i18n?.t('common:Value has to be a number between {{min}} and {{max}}', { min, max })
);
