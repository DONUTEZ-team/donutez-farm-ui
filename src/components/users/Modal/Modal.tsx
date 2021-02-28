import React, { useCallback, useMemo } from 'react';
import cx from 'classnames';
import BigNumber from 'bignumber.js';
import { Field, withTypes } from 'react-final-form';
import { FormApi } from 'final-form';
import ReactModal from 'react-modal';
import { useTezos } from '@utils/dapp';
import { stake, unstake } from '@utils/farm';
import { composeValidators, required } from '@utils/validators';
import { convertUnits } from '@utils/helpers';

import { Input } from '@ui/Input';

import s from './Modal.module.sass';

type LabelProps = {
  isStake?: boolean,
  max: String
};

const Label:React.FC<LabelProps> = ({
  isStake = true,
  max,
}) => (
  <div className={s.label}>
    <p>
      {isStake ? 'XXX / XTZ tokens available' : 'XXX tokens available'}
      :
    </p>
    <p className={s.labelAmount}>{max}</p>
  </div>
);

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
} & ReactModal.Props;

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

        await onRequestClose(); // TODO: Change to loader
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        setTimeout(form.restart);
      }
    } catch (e) {
      console.log(e);
    }
  }, [tezos, isStake, contractPool, decimals, contractRewards, onRequestClose]);

  return (
    <ReactModal
      className={cx(
        s.root,
        className,
      )}
      appElement={
        typeof window !== 'undefined'
          ? document.querySelector('#__next')!
          : undefined
      }
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName={cx(s.overlay)}
      portalClassName={cx(s.portal, { [s.hidden]: !isOpen })}
    >
      <div
        className={s.wrapper}
        onClick={(e) => {
          if (e.target === e.currentTarget && onRequestClose) {
            onRequestClose(e);
          }
        }}
      >
        <div className={cx(s.inner)}>
          <Form
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
                  {isStake ? 'Deposit XXX / XTZ QP tokens' : 'Withdraw XXX tokens'}
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
                    MAX
                  </button>
                </div>
                <div className={s.buttons}>
                  <button
                    className={cx(s.btn, s.effect04)}
                    type="submit"
                    data-sm-link-text={isStake ? 'CLICK' : 'WHY?'}
                  >
                    <span>
                      Confirm
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={onRequestClose}
                    className={cx(s.btn, s.effect04)}
                    data-sm-link-text={isStake ? 'WHY?' : 'CLICK'}
                  >
                    <span>
                      Cancel
                    </span>
                  </button>
                </div>
              </form>
            )}
          />
        </div>
      </div>
    </ReactModal>
  );
};
