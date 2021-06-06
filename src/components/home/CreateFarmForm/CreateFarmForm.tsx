import React, {
  useCallback, useState,
} from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { Field, withTypes } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';

import { getStorageInfo, getTokenInfo, useTezos } from '@utils/dapp';
import { parseNumber } from '@utils/helpers';
import { Container } from '@components/ui/Container';
import { Row } from '@components/ui/Row';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { MediaInput } from '@components/ui/MediaInput';
import { NumberInput } from '@components/common/NumberInput';
import { TokenProps, TokensInfo } from '@components/common/TokensInfo';

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

type MetadataProps = {
  data: TokenProps | null
  loading: boolean
  error: boolean
};

const initialMetadataState = {
  data: null,
  loading: false,
  error: false,
};

export const CreateFarmForm: React.FC<CreateFarmFormProps> = ({
  className,
}) => {
  const { t, i18n } = useTranslation(['common', 'home']);
  const [
    pairTokenMetadata,
    setPairTokenMetadata,
  ] = useState<MetadataProps>(initialMetadataState);
  const [
    rewardTokenMetadata,
    setRewardTokenMetadata,
  ] = useState<MetadataProps>(initialMetadataState);

  const tezos = useTezos()!;

  // Logic of form
  const { Form } = withTypes<FormValues>();

  const getTokenPairInfo = useCallback(async (pairAddress: string) => {
    setPairTokenMetadata({
      data: null,
      loading: true,
      error: false,
    });
    try {
      const {
        storage: pairStorage,
      } = await getStorageInfo(tezos, pairAddress);
      const {
        token_address: tokenAddress,
      } = await pairStorage;

      const tokenData = await getTokenInfo(tezos, tokenAddress);

      if (!tokenData) {
        setPairTokenMetadata({
          data: null,
          loading: false,
          error: true,
        });
      } else {
        setPairTokenMetadata({
          data: tokenData,
          loading: false,
          error: false,
        });
      }
    } catch (e) {
      setPairTokenMetadata({
        data: null,
        loading: false,
        error: true,
      });
    }
  }, [tezos]);

  const getRewardTokenInfo = useCallback(async (tokenAddress: string) => {
    setRewardTokenMetadata({
      data: null,
      loading: true,
      error: false,
    });
    try {
      const tokenData = await getTokenInfo(tezos, tokenAddress);

      if (!tokenData) {
        setRewardTokenMetadata({
          data: null,
          loading: false,
          error: true,
        });
      } else {
        setRewardTokenMetadata({
          data: tokenData,
          loading: false,
          error: false,
        });
      }
    } catch (e) {
      setRewardTokenMetadata({
        data: null,
        loading: false,
        error: true,
      });
    }
  }, [tezos]);

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
              <img
                className={s.background}
                src="/images/HomeBackground3.svg"
                alt="DONUTEZ Farm"
              />
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
                      <>
                        <Input
                          {...input}
                          className={s.input}
                          label={`${t('home:QP token address')}:`}
                          placeholder={t('home:Enter QP Token Address e.g. tz1W3a2...pSBmH')}
                          error={
                            pairTokenMetadata.error
                              ? "Couldn't load pair's metadata"
                              : ((meta.touched && meta.error) || meta.submitError)
                          }
                          success={!meta.error && meta.touched && !meta.submitError}
                        />
                        <OnChange name="qpToken">
                          {() => {
                            if (pairTokenMetadata.data !== null) {
                              setPairTokenMetadata(initialMetadataState);
                            }
                          }}
                        </OnChange>
                        {
                          pairTokenMetadata.data ? (
                            <TokensInfo
                              firstToken="Tez"
                              secondToken={pairTokenMetadata.data}
                              pairLink={input.value}
                            />
                          ) : (
                            <Button
                              theme="secondary"
                              disabled={meta.error || pairTokenMetadata.loading}
                              onClick={() => getTokenPairInfo(input.value)}
                            >
                              {pairTokenMetadata.loading ? 'Loading...' : 'Get info'}
                            </Button>
                          )
                        }
                      </>
                    )}
                  </Field>
                </FormBlock>

                <FormBlock
                  header={t('home:Set mining\nparameters')}
                  subheader="02"
                >
                  <div className={s.block}>
                    {/* TODO: Required and token pattern */}
                    <Field name="token">
                      {({ input, meta }) => (
                        <>
                          <Input
                            {...input}
                            className={s.input}
                            label={`${t('home:Token Address')}:`}
                            placeholder={t('home:Enter reward Token Address e.g. tz1W3...SBmH')}
                            error={
                              rewardTokenMetadata.error
                                ? "Couldn't load token's metadata"
                                : ((meta.touched && meta.error) || meta.submitError)
                            }
                            success={!meta.error && meta.touched && !meta.submitError}
                          />
                          <OnChange name="token">
                            {() => {
                              if (rewardTokenMetadata.data !== null) {
                                setRewardTokenMetadata(initialMetadataState);
                              }
                            }}
                          </OnChange>
                          {
                            rewardTokenMetadata.data ? (
                              <TokensInfo
                                firstToken={rewardTokenMetadata.data}
                              />
                            ) : (
                              <Button
                                theme="secondary"
                                disabled={meta.error || rewardTokenMetadata.loading}
                                onClick={() => getRewardTokenInfo(input.value)}
                              >
                                {rewardTokenMetadata.loading ? 'Loading...' : 'Get info'}
                              </Button>
                            )
                          }
                        </>
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
                  <Field<File | string>
                    name="asset"
                  >
                    {({ input: { value, onChange, ...input }, meta }) => (
                      <MediaInput
                        {...input}
                        className={s.input}
                        label="Project image:"
                        value={value}
                        onChange={(file) => onChange(file)}
                        error={(meta.touched && meta.error) || meta.submitError}
                        success={!meta.error && meta.touched && !meta.submitError}
                      />
                    )}
                  </Field>
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
