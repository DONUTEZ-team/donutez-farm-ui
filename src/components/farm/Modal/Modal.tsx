import React, { useCallback, useMemo } from 'react';
import cx from 'classnames';
import BigNumber from 'bignumber.js';
import { Field, withTypes } from 'react-final-form';
import { FormApi } from 'final-form';
import { useTranslation } from '@i18n';
import { useTezos } from '@utils/dapp';
import { stake, unstake } from '@utils/farm';
import { composeValidators, required } from '@utils/validators';
import { convertUnits } from '@utils/helpers';

import { Button } from '@ui/Button';
import { Modal } from '@ui/Modal';
import { Input } from '@ui/Input';

import s from './Modal.module.sass';

type LabelProps = {
  isStake?: boolean,
  max: String
};

const Label:React.FC<LabelProps> = ({
  isStake = true,
  max,
}) => {
  const { t } = useTranslation(['common', 'farm']);

  return (
    <div className={s.label}>
      <p>
        {isStake ? t('farm:DTZ / XTZ tokens available') : t('farm:DTZ tokens available')}
        :
      </p>
      <p className={s.labelAmount}>{max}</p>
    </div>
  );
};

type FormValues = {
  amount: string
};

type ModalProps = {
  availTokens: BigNumber;
  isOpen: boolean;
  isStake: boolean;
  onRequestClose: () => void;
  contractPool: string;
  contractRewards: string;
  decimals: number;
  className?: string;
};

export const OperationModal: React.FC<ModalProps> = ({
  availTokens,
  isOpen,
  isStake,
  onRequestClose,
  contractPool,
  contractRewards,
  decimals,
  className,
}) => {
  const { t, i18n } = useTranslation(['common', 'farm']);

  // Context
  const tezos = useTezos();

  // Transform available amount to user friendly
  const tokenBalance = useMemo(
    () => (convertUnits(availTokens, decimals)),
    [availTokens, decimals],
  );

  const { Form } = withTypes<FormValues>();

  const onSubmit = useCallback(async (
    values: FormValues,
    form: FormApi<FormValues>,
  ) => {
    const expense = convertUnits(new BigNumber(values.amount), -decimals);
    try {
      if (tezos && expense) {
        if (isStake) {
          await stake(tezos, contractPool, expense, contractRewards);
        } else {
          await unstake(tezos, contractRewards, expense);
        }

        await onRequestClose(e); // TODO: Change to loader
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        setTimeout(form.restart);
      }
    } catch (e) {
      console.log(e);
    }
  }, [tezos, isStake, contractPool, decimals, contractRewards, onRequestClose]);

  return (
    <Modal className={cx(s.root, className)} isOpen={isOpen} onRequestClose={onRequestClose}>
      <Form
        key={i18n.language}
        onSubmit={onSubmit}
        mutators={{
          setMax: (args, state, utils) => {
            utils.changeValue(state, 'amount', () => tokenBalance);
          },
        }}
        render={({
          handleSubmit, form,
        }) => (
          <form onSubmit={handleSubmit}>
            <h3 className={s.header}>
              {isStake ? t('farm:Deposit DTZ / XTZ QP tokens') : t('farm:Withdraw DTZ tokens')}
            </h3>
            <div className={s.inputWrapper}>
              <Field
                name="amount"
                validate={composeValidators(
                  required,
                )}
              >
                {({ input, meta }) => (
                  <Input
                    {...input}
                    className={s.input}
                    label={<Label max={tokenBalance.toString()} />}
                    placeholder="0.000"
                    inputClassName={s.inputInner}
                    error={(meta.touched && meta.error) || meta.submitError}
                    success={!meta.error && meta.touched && !meta.submitError}
                  />
                )}
              </Field>
              <button
                type="button"
                onClick={form.mutators.setMax}
                className={s.max}
              >
                {t('common:MAX')}
              </button>
            </div>
            <div className={s.buttons}>
              <Button
                className={cx(s.button, s.buttonPrimary)}
                type="submit"
              >
                {t('common:Confirm')}
              </Button>
              <Button
                theme="secondary"
                onClick={onRequestClose}
                className={cx(s.button, s.buttonSecondary)}
              >
                {t('common:Cancel')}
              </Button>
            </div>
          </form>
        )}
      />
    </Modal>
  );
};
