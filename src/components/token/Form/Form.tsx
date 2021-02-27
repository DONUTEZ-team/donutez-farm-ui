import React, {
  useCallback, useState,
} from 'react';
import cx from 'classnames';
import { useTranslation } from '@i18n';
import { Field, withTypes } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import { FormApi, getIn } from 'final-form';
// eslint-disable-next-line import/no-named-default
import focusDecorator from 'final-form-focus';
import {
  composeValidators,
  required,
} from '@utils/validators';
import { useTezos } from '@utils/dapp';
import { createTokenFAOne, createTokenFATwo } from '@utils/createToken';

import { Container } from '@ui/Container';
import { Row } from '@ui/Row';
import { Button } from '@ui/Button';
import { Input } from '@ui/Input';
import { Heading } from '@components/common/Heading';
import Plus from '@icons/Plus.svg';
import Minus from '@icons/Minus.svg';
import HandFaOne from '@icons/FA1_2.svg';
import HandFaTwo from '@icons/FA2.svg';

import s from './Form.module.sass';

const findInput = (inputs: any, errors: any) => inputs.find((input: any) => {
  const name = input.name || input.id; // <------------ THERE
  return name && getIn(errors, name);
});

// @ts-ignore
const focusOnError = focusDecorator(null, findInput);

// Default stake value
type FormValues = {
  totalSupply: string
  metadatas: {
    tokenId: number
    tokenMetadata: string
  }[]
  isFaTwo: boolean
};

export const TokenForm: React.FC = () => {
  const { t, i18n } = useTranslation(['common', 'token']);
  const [isFa2, setIsFa2] = useState(false);

  // Context
  const tezos = useTezos();

  // Logic of form
  const { Form } = withTypes<FormValues>();

  const onSubmit = useCallback(async (
    values: FormValues,
    form: FormApi<FormValues>,
  ) => {
    try {
      if (tezos) {
        if (isFa2) {
          await createTokenFATwo(
            tezos,
            +values.totalSupply,
            values.metadatas,
          );
        } else {
          await createTokenFAOne(
            tezos,
            +values.totalSupply,
          );
        }

        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        setTimeout(form.restart);
      }
    } catch (e) {
      console.log(e);
    }
  }, [tezos, isFa2]);

  return (
    <div className={s.wrapper}>
      <Container>
        <Form
          key={i18n.language}
          onSubmit={onSubmit}
          initialValues={{ isFaTwo: false, metadatas: [{ tokenId: 0, tokenMetadata: '' }] }}
          // @ts-ignore
          decorators={[focusOnError]}
          mutators={{
            // potentially other mutators could be merged here
            ...arrayMutators,
          }}
          render={({
            handleSubmit, values,
          }) => (
            <form onSubmit={handleSubmit}>
              <Row className={s.row}>
                <div className={s.form}>
                  <div className={s.block}>
                    <Heading
                      header={t('home:Token\ninformation')}
                      subheader="01*"
                    />
                    <div className={s.switcher}>
                      <Button
                        className={cx(s.button, !isFa2 ? s.buttonPrimary : s.buttonSecondary)}
                        theme={!isFa2 ? 'primary' : 'secondary'}
                        onClick={() => setIsFa2(false)}
                      >
                        FA 1.2
                      </Button>
                      <Button
                        className={cx(s.button, isFa2 ? s.buttonPrimary : s.buttonSecondary)}
                        theme={isFa2 ? 'primary' : 'secondary'}
                        onClick={() => setIsFa2(true)}
                      >
                        FA 2
                      </Button>
                    </div>
                    <Field
                      name="totalSupply"
                      validate={composeValidators(
                        required,
                      )}
                    >
                      {({ input, meta }) => (
                        <Input
                          {...input}
                          className={s.input}
                          label="Total supply:"
                          placeholder="93481034"
                          error={(meta.touched && meta.error) || meta.submitError}
                          success={!meta.error && meta.touched && !meta.submitError}
                        />
                      )}
                    </Field>
                    {isFa2 && (
                    <>
                      <FieldArray name="metadatas">
                        {({ fields }) => (
                          <>
                            {fields.map((name, index) => (
                              <React.Fragment key={name}>
                                <Field
                                  name={`${name}tokenId`}
                                >
                                  {({ input, meta }) => (
                                    <Input
                                      {...input}
                                      className={s.input}
                                      label="Token id:"
                                      placeholder={`${index}`}
                                      value={index}
                                      disabled
                                      error={(meta.touched && meta.error) || meta.submitError}
                                      success={!meta.error && meta.touched && !meta.submitError}
                                    />
                                  )}
                                </Field>
                                <Field
                                  name={`${name}tokenMetadata`}
                                >
                                  {({ input, meta }) => (
                                    <Input
                                      {...input}
                                      className={s.input}
                                      label="Token metadata:"
                                      placeholder="1"
                                      textarea
                                      error={(meta.touched && meta.error) || meta.submitError}
                                      success={!meta.error && meta.touched && !meta.submitError}
                                    />
                                  )}
                                </Field>
                              </React.Fragment>
                            ))}
                            <div className={s.plusWrapper}>
                              {fields.length && fields.length > 1 && (
                                <Button
                                  theme="secondary"
                                  type="button"
                                  className={cx(s.buttonPlus, s.buttonMinus)}
                                  onClick={
                                    () => fields.length && fields.remove(fields.length - 1)
                                  }
                                >
                                  <Minus className={s.buttonIcon} />
                                </Button>
                              )}
                              <Button
                                theme="secondary"
                                type="button"
                                className={s.buttonPlus}
                                onClick={
                                  () => (values.metadatas[values.metadatas.length - 1].tokenMetadata
                                    ? fields.push({ tokenId: values.metadatas.length, tokenMetadata: '' })
                                    : console.log(fields))
                                }
                              >
                                <Plus className={s.buttonIcon} />
                              </Button>
                            </div>
                          </>
                        )}
                      </FieldArray>
                    </>
                    )}
                    <Button type="submit" className={s.finalButton}>
                      Create & Deploy
                    </Button>
                  </div>
                </div>
              </Row>
            </form>
          )}
        />
      </Container>

      <div className={s.hands}>
        {isFa2 ? <HandFaTwo className={s.icon} /> : <HandFaOne className={s.icon} />}
      </div>
    </div>
  );
};
