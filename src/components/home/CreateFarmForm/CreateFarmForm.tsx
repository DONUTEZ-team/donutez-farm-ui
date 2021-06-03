import React, {
  useCallback,
} from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { Field, withTypes } from 'react-final-form';

import { Container } from '@components/ui/Container';
import { Row } from '@components/ui/Row';
import { Input } from '@components/ui/Input';
import { NumberInput } from '@components/common/NumberInput';

import { parseNumber } from '@utils/helpers';
import { FormBlock } from './FormBlock';
import s from './CreateFarmForm.module.sass';

// Default form values
type FormValues = {
  // qp token
  qpToken: string
  // farming information
  token: string
  lifeTimeDays: number
  lifeTimeHours: number
  lifeTimeMinutes: number
  lifeTimeSeconds: number
  rewardPeriod: number
  rewardPerPeriod: number
  // website information
  title: string
  description: string
  // donutez configuration
  isStake: boolean
};

type CreateFarmFormProps = {
  className?: string
};

export const CreateFarmForm: React.FC<CreateFarmFormProps> = ({
  className,
}) => {
  const { t, i18n } = useTranslation(['common', 'home']);

  // Logic of form
  const { Form } = withTypes<FormValues>();

  // TODO: submitting
  const onSubmit = useCallback(async (
    values: FormValues,
  ) => {
    console.log('submit', values);
  }, []);

  return (
    <Container className={className}>
      <Form
        key={i18n.language}
        onSubmit={onSubmit}
        initialValues={{ lifeTimeDays: 30, isStake: true }}
        mutators={{
          setValue: ([field, value], state, { changeValue }) => {
            changeValue(state, field, () => value);
          },
        }}
        render={({
          handleSubmit, form,
        }) => (
          <form onSubmit={handleSubmit}>
            <Row className={s.row}>
              <div className={s.form}>
                <FormBlock
                  header={t('home:Set up\nQP token')}
                  subheader="01"
                >
                  {/* TODO: Required and qp token pattern */}
                  <Field
                    name="qpToken"
                  >
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        className={s.input}
                        label={`${t('home:QP token address')}:`}
                        placeholder={t('home:Enter QP Token Address e.g. tz1W3a2...pSBmH')}
                        error={(meta.touched && meta.error) || meta.submitError}
                        success={!meta.error && meta.touched && !meta.submitError}
                      />
                    )}
                  </Field>
                  TODO: button to load paired token&apos;s info
                </FormBlock>

                <FormBlock
                  header={t('home:Set mining\nparameters')}
                  subheader="02"
                >
                  <div className={s.block}>
                    {/* TODO: Required and token pattern */}
                    <Field name="token">
                      {({ input, meta }) => (
                        <Input
                          {...input}
                          className={s.input}
                          label={`${t('home:Token Address')}:`}
                          placeholder={t('home:Enter reward Token Address e.g. tz1W3...SBmH')}
                          error={(meta.touched && meta.error) || meta.submitError}
                          success={!meta.error && meta.touched && !meta.submitError}
                        />
                      )}
                    </Field>
                  </div>
                  <div className={s.block}>
                    <div className={s.timeLabel}>
                      {t('home:Lifetime')}
                      :
                    </div>
                    <div className={s.timeWrapper}>
                      {/* TODO: Required, number and [min, max] */}
                      <Field
                        name="lifeTimeDays"
                        parse={(value) => parseNumber(value, 1, 100)}
                      >
                        {({ input, meta }) => (
                          <NumberInput
                            {...input}
                            className={s.inputTime}
                            label={`${t('home:Days')}:`}
                            placeholder="30"
                            step={1}
                            min={1}
                            max={100}
                            error={(meta.touched && meta.error) || meta.submitError}
                            success={!meta.error && meta.touched && !meta.submitError}
                            onIncrementClick={() => {
                              form.mutators.setValue(
                                'lifeTimeDays',
                                +input.value + 1 > 100 ? 100 : +input.value + 1,
                              );
                            }}
                            onDecrementClick={() => {
                              form.mutators.setValue(
                                'lifeTimeDays',
                                +input.value - 1 < 1 ? 1 : +input.value - 1,
                              );
                            }}
                          />
                        )}
                      </Field>

                      {/* TODO: Number and [min, max] */}
                      <Field
                        name="lifeTimeHours"
                        parse={(value) => parseNumber(value, 1, 23)}
                      >
                        {({ input, meta }) => (
                          <NumberInput
                            {...input}
                            className={s.inputTime}
                            label={`${t('home:Hours')}:`}
                            placeholder="13"
                            step={1}
                            min={1}
                            max={23}
                            error={(meta.touched && meta.error) || meta.submitError}
                            success={!meta.error && meta.touched && !meta.submitError}
                            onIncrementClick={() => {
                              form.mutators.setValue(
                                'lifeTimeHours',
                                +input.value + 1 > 23 ? 23 : +input.value + 1,
                              );
                            }}
                            onDecrementClick={() => {
                              form.mutators.setValue(
                                'lifeTimeHours',
                                +input.value - 1 < 1 ? 1 : +input.value - 1,
                              );
                            }}
                          />
                        )}
                      </Field>

                      {/* TODO: Number and [min, max] */}
                      <Field
                        name="lifeTimeMinutes"
                        parse={(value) => parseNumber(value, 1, 59)}
                      >
                        {({ input, meta }) => (
                          <NumberInput
                            {...input}
                            className={s.inputTime}
                            label={`${t('home:Minutes')}:`}
                            placeholder="00"
                            step={1}
                            min={1}
                            max={59}
                            error={(meta.touched && meta.error) || meta.submitError}
                            success={!meta.error && meta.touched && !meta.submitError}
                            onIncrementClick={() => {
                              form.mutators.setValue(
                                'lifeTimeMinutes',
                                +input.value + 1 > 59 ? 59 : +input.value + 1,
                              );
                            }}
                            onDecrementClick={() => {
                              form.mutators.setValue(
                                'lifeTimeMinutes',
                                +input.value - 1 < 1 ? 1 : +input.value - 1,
                              );
                            }}
                          />
                        )}
                      </Field>

                      {/* TODO: Number and [min, max] */}
                      <Field
                        name="lifeTimeSeconds"
                        parse={(value) => parseNumber(value, 1, 59)}
                      >
                        {({ input, meta }) => (
                          <NumberInput
                            {...input}
                            className={s.inputTime}
                            label={`${t('home:Seconds')}:`}
                            placeholder="00"
                            step={1}
                            min={1}
                            max={59}
                            error={(meta.touched && meta.error) || meta.submitError}
                            success={!meta.error && meta.touched && !meta.submitError}
                            onIncrementClick={() => {
                              form.mutators.setValue(
                                'lifeTimeSeconds',
                                +input.value + 1 > 59 ? 59 : +input.value + 1,
                              );
                            }}
                            onDecrementClick={() => {
                              form.mutators.setValue(
                                'lifeTimeSeconds',
                                +input.value - 1 < 1 ? 1 : +input.value - 1,
                              );
                            }}
                          />
                        )}
                      </Field>
                    </div>
                    <p className={s.item}>
                      {t('home:Estimated starting & closing time')}
                      :
                      {' '}
                      <br />
                      <strong>
                        TODO: Formatted lifetime from to
                      </strong>
                    </p>
                  </div>
                  <div className={s.block}>
                    {/* TODO: required & number & [min, max] */}
                    <Field
                      name="rewardPeriod"
                    >
                      {({ input, meta }) => (
                        <NumberInput
                          {...input}
                          type="number"
                          theme="large"
                          className={s.input}
                          label={`${t('home:Reward Period in Seconds')}:`}
                          placeholder="932157"
                          step={10}
                          min={1}
                          max={1_000_000}
                          error={(meta.touched && meta.error) || meta.submitError}
                          success={!meta.error && meta.touched && !meta.submitError}
                          onIncrementClick={() => {
                            form.mutators.setValue(
                              'rewardPeriod',
                              +input.value + 10 > 1_000_000 ? 1_000_000 : +input.value + 10,
                            );
                          }}
                          onDecrementClick={() => {
                            form.mutators.setValue(
                              'rewardPeriod',
                              +input.value - 10 < 1 ? 1 : +input.value - 10,
                            );
                          }}
                        />
                      )}
                    </Field>
                    <Field
                      name="rewardPerPeriod"
                    >
                      {({ input, meta }) => (
                        <NumberInput
                          {...input}
                          type="number"
                          theme="large"
                          className={s.input}
                          label={`${t('home:Mining Reward per Period')}:`}
                          placeholder="100"
                          step={10}
                          min={1}
                          max={1_000_000}
                          error={(meta.touched && meta.error) || meta.submitError}
                          success={!meta.error && meta.touched && !meta.submitError}
                          onIncrementClick={() => {
                            form.mutators.setValue(
                              'rewardPerPeriod',
                              +input.value + 10 > 1_000_000 ? 1_000_000 : +input.value + 10,
                            );
                          }}
                          onDecrementClick={() => {
                            form.mutators.setValue(
                              'rewardPerPeriod',
                              +input.value - 10 < 1 ? 1 : +input.value - 10,
                            );
                          }}
                        />
                      )}
                    </Field>
                    <p className={s.item}>
                      {t('home:Total Working Blocks Amount')}
                      :
                      {' '}
                      <strong>
                        Count blocks
                      </strong>
                    </p>
                    <p className={s.item}>
                      Total Reward:
                      {' '}
                      <strong>
                        Total Reward
                      </strong>
                    </p>
                    <p className={cx(s.item, s.active)}>
                      Available balance:
                      {' '}
                      <strong>0 DTZ</strong>
                    </p>
                  </div>
                </FormBlock>

                <FormBlock
                  header={t('home:Set project\nparameters')}
                  subheader="03"
                  isRequired={false}
                >
                  <Field
                    name="title"
                  >
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        className={s.input}
                        label="Project Title:"
                        placeholder="Project title e.g. Tezos Yield Farming"
                        error={(meta.touched && meta.error) || meta.submitError}
                        success={!meta.error && meta.touched && !meta.submitError}
                      />
                    )}
                  </Field>
                  <Field
                    name="description"
                  >
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        className={s.input}
                        label="Project Description:"
                        placeholder="Your Project Description
e.g. This project is about yeild farming..."
                        textarea
                        error={(meta.touched && meta.error) || meta.submitError}
                        success={!meta.error && meta.touched && !meta.submitError}
                      />
                    )}
                  </Field>
                  Project image as og image
                </FormBlock>
              </div>
              <div className={s.donut}>
                There will be tokens image
              </div>
            </Row>
            <div className={s.donutFinalWrapper}>
              Image with donut in the box
            </div>
          </form>
        )}
      />
    </Container>
  );
};
