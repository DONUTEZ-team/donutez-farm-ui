import React, { useCallback } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import {
  Field,
  withTypes,
} from 'react-final-form';
import Image from 'next/image';

import {
  composeValidators,
  required,
  validateMinMax,
} from '@utils/validators';
import {
  parseNumber,
  parseTokenSymbol,
  parseTokenName,
} from '@utils/helpers';
import { Container } from '@components/ui/Container';
import { Row } from '@components/ui/Row';
import { Button } from '@components/ui/Button';
import { Heading } from '@components/ui/Heading';
import { Input } from '@components/ui/Input';
import { MediaInput } from '@components/ui/MediaInput';
import { NumberInput } from '@components/common/NumberInput';

import { TokenCard } from './TokenCard';
import s from './CreateTokenForm.module.sass';

// Default form values
type FormValues = {
  name: string
  symbol: string
  icon: string
  totalSupply: number
  decimals: number
};

type CreateTokenFormProps = {
  className?: string
};

export const CreateTokenForm: React.FC<CreateTokenFormProps> = ({
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
    <section className={cx(s.root, className)}>
      <Container>
        <Row className={s.row}>
          <Heading
            header={t('home:Token\nInformation')}
            subheader="01"
            className={s.heading}
          />
        </Row>
      </Container>
      <Form
        key={i18n.language}
        onSubmit={onSubmit}
        initialValues={{ decimals: 6 }}
        mutators={{
          setValue: ([field, value], state, { changeValue }) => {
            changeValue(state, field, () => value);
          },
        }}
        render={({
          handleSubmit, form, submitting, values,
        }) => (
          <div className={s.section}>
            <Container>
              <form onSubmit={handleSubmit}>
                <Row className={s.row}>
                  <div className={s.form}>
                    <div className={s.block}>
                      <Field
                        name="name"
                        validate={required}
                        parse={parseTokenName}
                      >
                        {({ input, meta }) => (
                          <Input
                            {...input}
                            className={s.input}
                            label={`${t('home:Token name')}:`}
                            placeholder={t('home:DONUTEZ')}
                            error={(meta.touched && meta.error) || meta.submitError}
                            success={!meta.error && meta.touched && !meta.submitError}
                          />
                        )}
                      </Field>
                      <Field
                        name="symbol"
                        validate={required}
                        parse={parseTokenSymbol}
                      >
                        {({ input, meta }) => (
                          <Input
                            {...input}
                            className={s.input}
                            label={`${t('home:Token symbol')}:`}
                            placeholder={t('home:DTZ')}
                            error={(meta.touched && meta.error) || meta.submitError}
                            success={!meta.error && meta.touched && !meta.submitError}
                          />
                        )}
                      </Field>
                      <Field
                        name="decimals"
                        validate={composeValidators(required, validateMinMax(0, 18))}
                        parse={(value) => parseNumber(value, 0, 18)}
                      >
                        {({ input, meta }) => (
                          <NumberInput
                            {...input}
                            theme="large"
                            className={s.input}
                            label={`${t('home:Decimals')}:`}
                            placeholder="6"
                            step={1}
                            min={0}
                            max={18}
                            error={(meta.touched && meta.error) || meta.submitError}
                            success={!meta.error && meta.touched && !meta.submitError}
                            onIncrementClick={() => {
                              form.mutators.setValue(
                                'decimals',
                                +input.value + 1 > 18 ? 18 : +input.value + 1,
                              );
                            }}
                            onDecrementClick={() => {
                              form.mutators.setValue(
                                'decimals',
                                +input.value - 1 < 0 ? 0 : +input.value - 1,
                              );
                            }}
                          />
                        )}
                      </Field>
                      <Field<File | string>
                        name="icon"
                      >
                        {({ input: { value, onChange, ...input }, meta }) => (
                          <MediaInput
                            {...input}
                            className={s.input}
                            label="Token icon:"
                            value={value}
                            onChange={(file) => onChange(file)}
                            error={(meta.touched && meta.error) || meta.submitError}
                            success={!meta.error && meta.touched && !meta.submitError}
                          />
                        )}
                      </Field>
                      <Field
                        name="totalSupply"
                        validate={composeValidators(required, validateMinMax(1, 1_000_000_000))}
                        parse={(value) => parseNumber(value, 1, 1_000_000_000)}
                      >
                        {({ input, meta }) => (
                          <NumberInput
                            {...input}
                            theme="large"
                            className={s.input}
                            label={`${t('home:Total supply')}:`}
                            placeholder="1000000"
                            step={1}
                            min={1}
                            max={1_000_000_000}
                            error={(meta.touched && meta.error) || meta.submitError}
                            success={!meta.error && meta.touched && !meta.submitError}
                            onIncrementClick={() => {
                              form.mutators.setValue(
                                'totalSupply',
                                +input.value + 1 > 1_000_000_000 ? 1_000_000_000 : +input.value + 1,
                              );
                            }}
                            onDecrementClick={() => {
                              form.mutators.setValue(
                                'totalSupply',
                                +input.value - 1 < 1 ? 1 : +input.value - 1,
                              );
                            }}
                          />
                        )}
                      </Field>
                      <Button type="submit" className={s.button} disabled={submitting}>
                        {submitting ? t('common:Loading...') : t('token:Create & Deploy')}
                      </Button>
                    </div>
                    <TokenCard
                      className={s.card}
                      icon={values.icon}
                      name={values.name}
                      symbol={values.symbol}
                      decimals={values.decimals}
                      totalSupply={values.totalSupply}
                    />
                  </div>
                </Row>
              </form>
            </Container>

            <div className={s.handsWrapper}>
              <div className={cx(s.hands, {
                [s.active]: !(values.icon
                  && values.name
                  && values.symbol
                  && values.decimals
                  && values.totalSupply),
              })}
              >
                <Image
                  layout="responsive"
                  quality={90}
                  width={405}
                  height={553}
                  priority
                  src="/images/HandTwoFingers.png"
                  alt="DONUTEZ Farm"
                />
              </div>
              <div className={cx(s.hands, {
                [s.active]: !!(values.icon
                  && values.name
                  && values.symbol
                  && values.decimals
                  && values.totalSupply),
              })}
              >
                <Image
                  layout="responsive"
                  quality={90}
                  width={405}
                  height={553}
                  priority
                  src="/images/HandOneFinger.png"
                  alt="DONUTEZ Farm"
                />
              </div>
            </div>
          </div>
        )}
      />

      <div className={s.backgroundWrapper}>
        <Container>
          <Row className={s.row}>
            <img
              className={cx(s.background)}
              src="/images/TokenBackground3.svg"
              alt="DONUTEZ Farm"
            />
          </Row>
        </Container>
      </div>
    </section>
  );
};
