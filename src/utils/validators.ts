import { i18n } from '@i18n';

type ValidationType = (value: string) => string | undefined;

export const required = (value: string) => (
  value
    ? undefined
    : i18n.t('common:This field is required')
);

export const composeValidators = (...validators: ValidationType[]) => (value: string) => (
  validators.reduce(
    (
      error: string | undefined,
      validator: ValidationType,
    ) => error || validator(value), undefined,
  )
);

function isUSDTAddress(address: string) {
  const re = /^0x[a-fA-F0-9]{40}$/;
  return re.test(address);
}

export const validateDay = (value?: string) => (
  !value || (+value > 0 && +value < 100) ? undefined : i18n.t('common:Field has to be a number between 0 and 100')
);
export const validateHours = (value?: string) => (
  !value || (+value > 0 && +value < 24) ? undefined : i18n.t('common:Field has to be a number between 0 and 24')
);
export const validateMinsSecs = (value?: string) => (
  !value || (+value > 0 && +value < 60) ? undefined : i18n.t('common:Field has to be a number between 0 and 60')
);
export const validateSecs = (max: number) => (value: string) => (
  value && +value > 0 && +value <= max ? undefined : i18n.t('common:Field has to be a number between 0 and 60')
);

export const validateUSDTAddress = (value?: string) => (
  !value || isUSDTAddress(value) ? undefined : i18n.t('common:Validators.validateUSDTAddress')
);
